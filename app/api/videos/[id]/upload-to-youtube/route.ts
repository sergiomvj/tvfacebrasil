// ============================================
// API ROUTE: /api/videos/[id]/upload-to-youtube
// Faz upload de vídeo para o YouTube
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeService, YouTubeUploadOptions } from '@/lib/youtube-service';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id;
    const supabase = createRouteHandlerClient({ cookies });

    // Verifica autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Busca tokens do YouTube do usuário
    const { data: integration, error: integrationError } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'youtube')
      .single();

    if (integrationError || !integration) {
      return NextResponse.json(
        { error: 'YouTube not connected. Please connect your YouTube account first.' },
        { status: 400 }
      );
    }

    // Busca dados do vídeo
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Verifica se o vídeo está no status correto
    if (video.status !== 'review') {
      return NextResponse.json(
        { error: 'Video must be in review status to upload to YouTube' },
        { status: 400 }
      );
    }

    // Configura o serviço do YouTube com os tokens do usuário
    const youtubeService = getYouTubeService();
    youtubeService.setCredentials({
      access_token: integration.access_token,
      refresh_token: integration.refresh_token,
      expiry_date: integration.expires_at ? new Date(integration.expires_at).getTime() : undefined,
    });

    // Busca o arquivo de vídeo do storage (R2/S3)
    const videoResponse = await fetch(video.video_url);
    if (!videoResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch video file' }, { status: 500 });
    }
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

    // Prepara opções de upload
    const uploadOptions: YouTubeUploadOptions = {
      title: video.video_title || video.article_title,
      description: video.video_description || video.article_excerpt || '',
      tags: video.video_tags || ['tvfacebrasil', 'comunidade', 'brasileiroseua'],
      categoryId: '27', // Education (ou 25 para News & Politics)
      privacyStatus: 'private', // Começa como privado, publica depois de revisar
    };

    // Faz upload do vídeo
    console.log('Starting YouTube upload for video:', videoId);
    const youtubeVideoId = await youtubeService.uploadVideo(videoBuffer, uploadOptions);
    console.log('YouTube upload complete. Video ID:', youtubeVideoId);

    // Se tiver thumbnail, faz upload também
    if (video.thumbnail_url) {
      try {
        const thumbnailResponse = await fetch(video.thumbnail_url);
        if (thumbnailResponse.ok) {
          const thumbnailBuffer = Buffer.from(await thumbnailResponse.arrayBuffer());
          await youtubeService.uploadThumbnail(youtubeVideoId, thumbnailBuffer);
          console.log('Thumbnail uploaded successfully');
        }
      } catch (thumbnailError) {
        console.error('Error uploading thumbnail:', thumbnailError);
        // Não falha se a thumbnail der erro
      }
    }

    // Atualiza o vídeo no banco com o ID do YouTube
    await supabase
      .from('videos')
      .update({
        youtube_video_id: youtubeVideoId,
        status: 'published',
        published_at: new Date().toISOString(),
        published_by: user.id,
      })
      .eq('id', videoId);

    // Cria log
    await supabase.from('video_logs').insert({
      video_id: videoId,
      user_id: user.id,
      action: 'youtube_upload',
      notes: `Vídeo enviado para YouTube. ID: ${youtubeVideoId}`,
      metadata: { youtube_video_id: youtubeVideoId },
    });

    return NextResponse.json({
      success: true,
      youtube_video_id: youtubeVideoId,
      message: 'Video uploaded successfully to YouTube',
    });

  } catch (error) {
    console.error('Error uploading to YouTube:', error);
    return NextResponse.json(
      { error: 'Failed to upload video to YouTube', details: (error as Error).message },
      { status: 500 }
    );
  }
}

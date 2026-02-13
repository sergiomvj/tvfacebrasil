// ============================================
// API ROUTE: /api/videos/[id]/upload-to-instagram
// Faz upload de vídeo para o Instagram (Reels)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getInstagramService } from '@/lib/meta-service';
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

    // Busca dados do vídeo
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Verifica status
    if (video.status !== 'review') {
      return NextResponse.json(
        { error: 'Video must be in review status' },
        { status: 400 }
      );
    }

    // Inicializa serviço do Instagram
    const instagramService = getInstagramService();

    // Publica como Reel
    console.log('Publishing to Instagram:', videoId);
    const mediaId = await instagramService.uploadReel(
      video.video_url!,
      {
        caption: video.video_title || video.article_title,
        mediaType: 'REELS',
        hashtags: video.video_tags || ['tvfacebrasil', 'comunidade', 'brasileiroseua'],
      }
    );

    console.log('Instagram Reel published:', mediaId);

    // Atualiza vídeo no banco
    await supabase
      .from('videos')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        published_by: user.id,
      })
      .eq('id', videoId);

    // Cria log
    await supabase.from('video_logs').insert({
      video_id: videoId,
      user_id: user.id,
      action: 'instagram_publish',
      notes: `Reel publicado no Instagram. Media ID: ${mediaId}`,
      metadata: { instagram_media_id: mediaId },
    });

    return NextResponse.json({
      success: true,
      instagram_media_id: mediaId,
      message: 'Video published successfully to Instagram!',
    });

  } catch (error) {
    console.error('Error publishing to Instagram:', error);
    return NextResponse.json(
      { error: 'Failed to publish to Instagram', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// ============================================
// API ROUTE: /api/videos/[id]/upload-to-facebook
// Faz upload de vídeo para a Página do Facebook
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getFacebookService } from '@/lib/meta-service';
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

    if (video.status !== 'review') {
      return NextResponse.json(
        { error: 'Video must be in review status' },
        { status: 400 }
      );
    }

    // Pega Page ID do body ou env
    const pageId = process.env.FACEBOOK_PAGE_ID;
    if (!pageId) {
      return NextResponse.json(
        { error: 'FACEBOOK_PAGE_ID not configured in .env.local' },
        { status: 500 }
      );
    }

    // Inicializa serviço do Facebook
    const facebookService = getFacebookService(pageId);

    // Publica vídeo na página
    console.log('Publishing to Facebook:', videoId);
    const postId = await facebookService.uploadVideo(
      video.video_url!,
      {
        message: `${video.video_title || video.article_title}\n\n${video.video_description || ''}`,
      }
    );

    console.log('Facebook video published:', postId);

    // Cria log
    await supabase.from('video_logs').insert({
      video_id: videoId,
      user_id: user.id,
      action: 'facebook_publish',
      notes: `Vídeo publicado no Facebook. Post ID: ${postId}`,
      metadata: { facebook_post_id: postId },
    });

    return NextResponse.json({
      success: true,
      facebook_post_id: postId,
      message: 'Video published successfully to Facebook!',
    });

  } catch (error) {
    console.error('Error publishing to Facebook:', error);
    return NextResponse.json(
      { error: 'Failed to publish to Facebook', details: (error as Error).message },
      { status: 500 }
    );
  }
}

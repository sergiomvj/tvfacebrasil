// ============================================
// API ROUTE: /api/auth/youtube/callback
// Recebe código OAuth e troca por tokens
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { handleYouTubeCallback } from '@/lib/youtube-service';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('YouTube OAuth error:', error);
      return NextResponse.redirect(new URL('/dashboard/settings?error=youtube_auth', request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/dashboard/settings?error=no_code', request.url));
    }

    // Troca código por tokens
    const tokens = await handleYouTubeCallback(code);

    // Salva tokens no Supabase (associado ao usuário)
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=not_authenticated', request.url));
    }

    // Salva tokens na tabela user_integrations
    await supabase.from('user_integrations').upsert({
      user_id: user.id,
      provider: 'youtube',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,provider'
    });

    // Redireciona de volta para o dashboard
    return NextResponse.redirect(new URL('/dashboard/settings?success=youtube_connected', request.url));

  } catch (error) {
    console.error('Error handling YouTube callback:', error);
    return NextResponse.redirect(new URL('/dashboard/settings?error=youtube_callback', request.url));
  }
}

// ============================================
// API ROUTE: /api/auth/meta/refresh-token
// Troca token de 1 hora por token de 60 dias
// ============================================

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const shortLivedToken = process.env.META_ACCESS_TOKEN;

    if (!appId || !appSecret || !shortLivedToken) {
      return NextResponse.json(
        { error: 'Missing Meta credentials' },
        { status: 500 }
      );
    }

    // Troca por token de longa duração (60 dias)
    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `grant_type=fb_exchange_token&` +
      `client_id=${appId}&` +
      `client_secret=${appSecret}&` +
      `fb_exchange_token=${shortLivedToken}`
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return NextResponse.json(
        { error: 'Failed to exchange token', details: data.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token exchanged successfully!',
      long_lived_token: data.access_token.substring(0, 20) + '...',
      expires_in: data.expires_in, // segundos (geralmente ~5184000 = 60 dias)
      note: 'Update your .env.local with the new token',
    });

  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}

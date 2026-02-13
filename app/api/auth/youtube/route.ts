// ============================================
// API ROUTE: /api/auth/youtube
// Inicia autenticação OAuth com YouTube
// ============================================

import { NextResponse } from 'next/server';
import { getYouTubeAuthUrl } from '@/lib/youtube-service';

export async function GET() {
  try {
    const authUrl = getYouTubeAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error generating YouTube auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}

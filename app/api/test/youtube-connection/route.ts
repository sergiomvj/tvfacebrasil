// ============================================
// API ROUTE: /api/test/youtube-connection
// Testa conexão com YouTube Data API
// ============================================

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    // Verifica se as credenciais estão configuradas
    const clientId = process.env.YOUTUBE_DATA_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_DATA_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'YouTube credentials not configured in environment variables' 
        },
        { status: 500 }
      );
    }

    // Cria cliente OAuth2 (sem token ainda - só verifica configuração)
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`
    );

    // Gera URL de autorização para teste
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });

    return NextResponse.json({
      success: true,
      message: 'YouTube Data API v3 configured correctly!',
      client_id_configured: true,
      client_secret_configured: true,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`,
      auth_url: authUrl,
      next_steps: [
        '1. Visit the auth_url to connect your YouTube account',
        '2. Authorize the application',
        '3. Tokens will be saved automatically',
        '4. Test video upload at /api/test/youtube-upload'
      ]
    });

  } catch (error) {
    console.error('YouTube connection test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initialize YouTube API',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

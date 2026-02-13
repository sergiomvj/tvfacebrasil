// ============================================
// API ROUTE: /api/test/meta-connection
// Testa conexão com Meta APIs
// ============================================

import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const instagramAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  // Verifica configuração básica
  const configStatus = {
    app_id_configured: !!appId,
    app_secret_configured: !!appSecret,
    access_token_configured: !!accessToken,
    instagram_account_configured: !!instagramAccountId,
  };

  const allConfigured = Object.values(configStatus).every(Boolean);

  if (!appId || !appSecret) {
    return NextResponse.json({
      success: false,
      status: 'incomplete',
      message: 'Meta App ID and Secret not configured',
      config: configStatus,
      next_steps: [
        '1. Create app at https://developers.facebook.com/apps',
        '2. Add Instagram Graph API product',
        '3. Get App ID and App Secret from Settings → Basic',
        '4. Add to .env.local: META_APP_ID and META_APP_SECRET',
      ]
    }, { status: 200 });
  }

  if (!accessToken || !instagramAccountId) {
    return NextResponse.json({
      success: false,
      status: 'partial',
      message: 'App configured but Access Token and Instagram Account ID needed',
      app_id: appId.substring(0, 8) + '...',
      config: configStatus,
      next_steps: [
        '1. Go to https://developers.facebook.com/tools/explorer',
        '2. Select your app and generate User Token',
        '3. Add permissions: instagram_basic, instagram_content_publish',
        '4. Query /me/accounts to get Instagram Business Account ID',
        '5. Add to .env.local: META_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID',
      ],
      guide_url: '/docs/META_ACCESS_TOKEN_GUIDE.md'
    }, { status: 200 });
  }

  // Se tudo configurado, tenta fazer uma chamada de teste
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}?fields=id,username&access_token=${accessToken}`
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({
        success: false,
        status: 'token_invalid',
        message: 'Access token may be expired or invalid',
        error: error.error?.message,
        config: configStatus,
        next_steps: [
          '1. Generate new token at Graph API Explorer',
          '2. Ensure token has instagram_basic permission',
          '3. Token expires in 1 hour (use long-lived token for production)',
        ]
      }, { status: 200 });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: 'connected',
      message: 'Meta Instagram API connected successfully!',
      config: configStatus,
      account: {
        id: data.id,
        username: data.username,
      },
      ready_to_publish: true,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Failed to test Meta connection',
      error: (error as Error).message,
      config: configStatus,
    }, { status: 200 });
  }
}

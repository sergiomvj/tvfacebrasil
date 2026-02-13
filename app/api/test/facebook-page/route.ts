// ============================================
// API ROUTE: /api/test/facebook-page
// Lista páginas do Facebook do usuário
// ============================================

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Meta access token not configured' },
        { status: 500 }
      );
    }

    // Busca páginas do usuário
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?` +
      `fields=id,name,access_token,instagram_business_account{id,username}&` +
      `access_token=${accessToken}`
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return NextResponse.json(
        { 
          error: 'Failed to fetch pages', 
          details: data.error,
          note: 'Token may be expired'
        },
        { status: 500 }
      );
    }

    // Formata a resposta
    const pages = data.data?.map((page: any) => ({
      id: page.id,
      name: page.name,
      has_instagram: !!page.instagram_business_account,
      instagram_account: page.instagram_business_account ? {
        id: page.instagram_business_account.id,
        username: page.instagram_business_account.username || 'N/A',
      } : null,
    }));

    return NextResponse.json({
      success: true,
      pages_count: pages?.length || 0,
      pages: pages,
      instagram_account_id: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      instructions: {
        page_id_for_facebook: 'Use o ID da página para publicar no Facebook',
        instagram_account_id: 'Já configurado no .env.local',
      }
    });

  } catch (error) {
    console.error('Error fetching Facebook pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

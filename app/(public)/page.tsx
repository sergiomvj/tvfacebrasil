// ============================================
// VIDEO PORTAL - HOME PAGE
// Página principal / (public)
// ============================================

import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/video-portal/components/Header';
import { HeroCarousel } from '@/video-portal/components/HeroCarousel';
import { CategoryRail } from '@/video-portal/components/CategoryRail';
import { fetchVideos } from '@/control-tower/services/control-tower-service';

export const metadata: Metadata = {
  title: 'TV Facebrasil - Sua comunidade em vídeo',
  description: 'A TV Facebrasil transforma o jornalismo comunitário em experiências visuais. Notícias, imigração, entrevistas e séries exclusivas para brasileiros nos EUA.',
  openGraph: {
    title: 'TV Facebrasil',
    description: 'Sua comunidade em vídeo',
    type: 'website',
  },
};

export default async function HomePage() {
  // Fetch published videos
  const { videos } = await fetchVideos({ status: 'published', limit: 50 });

  // Group videos by category
  const videosByCategory: Record<string, typeof videos> = {};
  
  videos.forEach(video => {
    const category = video.category_name || 'Outros';
    if (!videosByCategory[category]) {
      videosByCategory[category] = [];
    }
    videosByCategory[category].push(video);
  });

  // Define category order and colors
  const categoryConfig: Record<string, { title: string; color: string }> = {
    'Notícias': { title: 'Últimas Notícias', color: 'bg-red-500' },
    'Imigração': { title: 'Imigração & Legal', color: 'bg-blue-500' },
    'Entrevistas': { title: 'Entrevistas Exclusivas', color: 'bg-purple-500' },
    'Séries': { title: 'Séries Originais', color: 'bg-green-500' },
    'Empreendedorismo': { title: 'Empreendedorismo', color: 'bg-amber-500' },
    'Saúde': { title: 'Saúde & Bem-estar', color: 'bg-teal-500' },
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="pt-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-8">
            <HeroCarousel videos={videos} autoPlayInterval={6000} />
          </div>
        </section>

        {/* Category Rails */}
        <section className="pb-12">
          {Object.entries(videosByCategory).map(([category, categoryVideos]) => {
            const config = categoryConfig[category] || { title: category, color: 'bg-gray-500' };
            return (
              <CategoryRail 
                key={category}
                title={config.title}
                videos={categoryVideos}
                color={config.color}
              />
            );
          })}

          {/* Empty State */}
          {videos.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📺</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Em breve novos vídeos!
                </h3>
                <p className="text-gray-400">
                  Estamos preparando conteúdo exclusivo para você.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FB</span>
                </div>
                <span className="text-white font-bold text-lg">TV Facebrasil</span>
              </div>
              <p className="text-gray-400 text-sm">
                Da Palavra à Imagem: Histórias da Nossa Comunidade Ganham Vida
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white">Início</a></li>
                <li><a href="/category/imigracao" className="hover:text-white">Imigração</a></li>
                <li><a href="/category/noticias" className="hover:text-white">Notícias</a></li>
                <li><a href="/academy" className="hover:text-white">FB Academy</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-semibold mb-4">Redes Sociais</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">YouTube</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">TikTok</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            © 2026 TV Facebrasil. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

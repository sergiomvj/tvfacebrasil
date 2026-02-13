// ============================================
// VIDEO PORTAL - CATEGORY PAGE
// /category/[slug]
// ============================================

import React from 'react';
import { Metadata } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Header } from '@/video-portal/components/Header';
import { fetchVideos } from '@/control-tower/services/control-tower-service';
import { Grid3X3, List, Filter } from 'lucide-react';

interface CategoryPageProps {
  params: { slug: string };
}

const categoryNames: Record<string, string> = {
  'imigracao': 'Imigração & Legal',
  'noticias': 'Notícias',
  'entrevistas': 'Entrevistas',
  'series': 'Séries Originais',
  'empreendedorismo': 'Empreendedorismo',
  'saude': 'Saúde & Bem-estar',
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = categoryNames[params.slug] || params.slug;
  return {
    title: `${categoryName} - TV Facebrasil`,
    description: `Assista vídeos sobre ${categoryName} na TV Facebrasil`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const categoryName = categoryNames[slug] || slug;

  // Fetch all published videos
  const { videos: allVideos } = await fetchVideos({ status: 'published', limit: 100 });
  
  // Filter by category (using category slug in name matching for now)
  const videos = allVideos.filter(v => 
    v.category_name?.toLowerCase().includes(slug.toLowerCase()) ||
    v.article_slug?.toLowerCase().includes(slug.toLowerCase())
  );

  if (videos.length === 0 && !categoryNames[slug]) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="pt-20 pb-12">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-2">{categoryName}</h1>
            <p className="text-gray-400">
              {videos.length} vídeo{videos.length !== 1 ? 's' : ''} disponível{videos.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                <Filter className="w-4 h-4" />
                Filtrar
              </button>
              
              <select className="px-4 py-2 bg-gray-800 text-white rounded-lg border-none focus:ring-2 focus:ring-blue-500">
                <option value="newest">Mais recentes</option>
                <option value="popular">Mais populares</option>
                <option value="oldest">Mais antigos</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <a 
                  key={video.id}
                  href={`/video/${video.article_slug}`}
                  className="group"
                >
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-3">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url}
                        alt={video.article_title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <span className="text-4xl">▶️</span>
                      </div>
                    )}
                    
                    {/* Duration Badge */}
                    {video.video_duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                        {Math.floor(video.video_duration / 60)}:{(video.video_duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-white font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {video.article_title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <span>{video.category_name}</span>
                    <span>•</span>
                    <span>{new Date(video.published_at || video.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <p className="text-gray-500 text-sm mt-1">
                    {Math.floor(Math.random() * 10000) + 500} visualizações
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📂</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum vídeo nesta categoria
              </h3>
              <p className="text-gray-400">
                Em breve teremos novos conteúdos sobre {categoryName}.
              </p>
              <a 
                href="/"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Explorar outras categorias
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

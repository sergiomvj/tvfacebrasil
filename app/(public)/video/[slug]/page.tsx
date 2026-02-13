// ============================================
// VIDEO PORTAL - VIDEO DETAIL PAGE
// /video/[slug]
// ============================================

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/video-portal/components/Header';
import { VideoPlayer } from '@/video-portal/components/VideoPlayer';
import { CategoryRail } from '@/video-portal/components/CategoryRail';
import { fetchVideos, fetchVideoById } from '@/control-tower/services/control-tower-service';
import { 
  Share2, 
  ThumbsUp, 
  MessageCircle, 
  Bookmark,
  Clock,
  Eye,
  Calendar
} from 'lucide-react';

interface VideoPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  // In a real implementation, fetch video by slug
  // For now, return generic metadata
  return {
    title: 'Vídeo - TV Facebrasil',
    description: 'Assista na TV Facebrasil',
    openGraph: {
      title: 'TV Facebrasil',
      description: 'Conteúdo exclusivo para brasileiros nos EUA',
      type: 'video.other',
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = params;
  
  // Fetch all published videos to find by slug
  const { videos } = await fetchVideos({ status: 'published', limit: 100 });
  const video = videos.find(v => v.article_slug === slug);
  
  if (!video) {
    notFound();
  }

  // Fetch related videos (same category)
  const relatedVideos = videos
    .filter(v => v.article_category_id === video.article_category_id && v.id !== video.id)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <VideoPlayer 
                videoUrl={video.video_url || ''}
                thumbnailUrl={video.thumbnail_url || undefined}
                title={video.article_title}
                autoPlay={true}
              />

              {/* Video Info */}
              <div className="mt-6">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {video.video_title || video.article_title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {Math.floor(Math.random() * 10000) + 1000} visualizações
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(video.published_at || video.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  {video.video_duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.floor(video.video_duration / 60)}:{(video.video_duration % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                    <ThumbsUp className="w-4 h-4" />
                    Curtir
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                    <Bookmark className="w-4 h-4" />
                    Salvar
                  </button>
                </div>

                {/* Description */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-line">
                    {video.video_description || video.article_excerpt || 'Sem descrição'}
                  </p>
                  
                  {video.video_tags && video.video_tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {video.video_tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-gray-800 text-gray-400 text-sm rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Comentários
                  </h3>
                  
                  {/* Comment Input */}
                  <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-white">👤</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Adicione um comentário..."
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                        rows={3}
                      />
                      <div className="mt-2 flex justify-end">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Comentar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mock Comments */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white">👤</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">Maria Silva</span>
                          <span className="text-gray-500 text-sm">há 2 dias</span>
                        </div>
                        <p className="text-gray-300">Ótimo conteúdo! Muito esclarecedor.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-white mb-4">Próximos vídeos</h3>
              
              <div className="space-y-4">
                {relatedVideos.map((related) => (
                  <a 
                    key={related.id}
                    href={`/video/${related.article_slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="w-40 aspect-video bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {related.thumbnail_url ? (
                        <img 
                          src={related.thumbnail_url}
                          alt={related.article_title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <span className="text-2xl">▶️</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {related.article_title}
                      </h4>
                      <p className="text-gray-500 text-sm mt-1">{related.category_name}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        {Math.floor(Math.random() * 10000) + 500} views
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Category Rail */}
        {relatedVideos.length > 0 && (
          <div className="mt-12">
            <CategoryRail 
              title="Mais da mesma categoria"
              videos={relatedVideos}
              color="bg-blue-500"
            />
          </div>
        )}
      </main>
    </div>
  );
}

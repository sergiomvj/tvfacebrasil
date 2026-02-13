// ============================================
// PÁGINA: REVISÃO DE VÍDEO
// /dashboard/review/[id]
// ============================================

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';
import { VideoReviewPlayer } from '@/control-tower/components/VideoReviewPlayer';
import { useVideo } from '@/control-tower/hooks/useControlTower';
import { useAuth } from '@clerk/nextjs';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const videoId = params.id as string;
  
  const { video, loading, publish, retry } = useVideo(videoId);

  const handleApprove = async (data: {
    video_title: string;
    video_description: string;
    video_tags: string[];
    youtube_video_id?: string;
  }) => {
    if (!userId) {
      alert('Você precisa estar logado para publicar');
      return;
    }

    const success = await publish(data, userId);
    if (success) {
      router.push('/dashboard/production');
    } else {
      alert('Erro ao publicar vídeo');
    }
  };

  const handleReject = async (reason: string) => {
    console.log('Rejected:', reason);
    // Implement reject logic - move back to rendering or scripting
    router.push('/dashboard/production');
  };

  const handleRetry = async () => {
    const success = await retry();
    if (!success) {
      alert('Erro ao tentar novamente');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/production"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Revisão de Vídeo</h1>
                <p className="text-sm text-gray-500">
                  {loading ? 'Carregando...' : video?.article_title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <VideoReviewPlayer
          video={video}
          loading={loading}
          onApprove={handleApprove}
          onReject={handleReject}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}

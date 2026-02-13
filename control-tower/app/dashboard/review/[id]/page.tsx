// ============================================
// PÁGINA: REVIEW DE VÍDEO
// /dashboard/review/[id]
// ============================================

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { VideoReviewPlayer } from '@/control-tower/components/VideoReviewPlayer';
import { useVideo } from '@/control-tower/hooks/useControlTower';
import { useUser } from '@clerk/nextjs';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const { user } = useUser();
  
  const { video, loading, publish, retry } = useVideo(videoId);

  const handleApprove = async (data: {
    video_title: string;
    video_description: string;
    video_tags: string[];
    youtube_video_id?: string;
  }) => {
    if (!user) {
      alert('Você precisa estar logado');
      return;
    }
    
    const success = await publish(data, user.id);
    if (success) {
      alert('Vídeo publicado com sucesso!');
      router.push('/dashboard/production');
    } else {
      alert('Erro ao publicar vídeo');
    }
  };

  const handleReject = (reason: string) => {
    // Move back to rendering or scripting based on reason
    alert(`Vídeo rejeitado: ${reason}`);
    // TODO: Update status and add log
  };

  const handleRetry = async () => {
    const success = await retry();
    if (success) {
      alert('Tentando novamente...');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/production"
          className="p-2 border rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revisão Final</h1>
          <p className="text-gray-500">
            {video?.article_title || 'Carregando...'}
          </p>
        </div>
      </div>

      {/* Review Player */}
      <VideoReviewPlayer
        video={video}
        loading={loading}
        onApprove={handleApprove}
        onReject={handleReject}
        onRetry={handleRetry}
      />
    </div>
  );
}

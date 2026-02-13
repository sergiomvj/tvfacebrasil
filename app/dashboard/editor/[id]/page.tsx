// ============================================
// PÁGINA: EDITOR DE ROTEIRO
// /dashboard/editor/[id]
// ============================================

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { ScriptEditor } from '@/control-tower/components/ScriptEditor';
import { useVideo } from '@/control-tower/hooks/useControlTower';
import { useAuth } from '@clerk/nextjs';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const videoId = params.id as string;
  
  const { video, loading, approve } = useVideo(videoId);

  const handleApprove = async (scriptData: {
    hook: string;
    intro: string;
    body: string;
    cta: string;
    full: string;
  }) => {
    if (!userId) {
      alert('Você precisa estar logado para aprovar');
      return;
    }

    const success = await approve(scriptData, userId);
    if (success) {
      router.push('/dashboard/production');
    } else {
      alert('Erro ao aprovar roteiro');
    }
  };

  const handleRegenerate = () => {
    // Implement regeneration logic
    console.log('Regenerate script for video:', videoId);
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Edit3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Editor de Roteiro</h1>
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
        <ScriptEditor
          video={video}
          articleContent={video?.article_content || null}
          loading={loading}
          onApprove={handleApprove}
          onRegenerate={handleRegenerate}
        />
      </div>
    </div>
  );
}

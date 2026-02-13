// ============================================
// PÁGINA: EDITOR DE ROTEIRO
// /dashboard/editor/[id]
// ============================================

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ScriptEditor } from '@/control-tower/components/ScriptEditor';
import { useVideo } from '@/control-tower/hooks/useControlTower';
import { useUser } from '@clerk/nextjs';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const { user } = useUser();
  
  const { video, loading, approve } = useVideo(videoId);

  const handleApprove = async (scriptData: {
    hook: string;
    intro: string;
    body: string;
    cta: string;
    full: string;
  }) => {
    if (!user) {
      alert('Você precisa estar logado');
      return;
    }
    
    const success = await approve(scriptData, user.id);
    if (success) {
      alert('Roteiro aprovado! Vídeo enviado para produção.');
      router.push('/dashboard/production');
    } else {
      alert('Erro ao aprovar roteiro');
    }
  };

  const handleRegenerate = () => {
    // Trigger n8n webhook to regenerate script
    alert('Solicitando regeneração do roteiro via n8n...');
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
          <h1 className="text-2xl font-bold text-gray-900">Editor de Roteiro</h1>
          <p className="text-gray-500">
            {video?.article_title || 'Carregando...'}
          </p>
        </div>
      </div>

      {/* Editor */}
      <ScriptEditor
        video={video}
        articleContent={video?.article_content || null}
        loading={loading}
        onApprove={handleApprove}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}

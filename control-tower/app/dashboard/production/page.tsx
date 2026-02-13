// ============================================
// PÁGINA: PRODUÇÃO (Kanban Board)
// /dashboard/production
// ============================================

'use client';

import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { KanbanBoard } from '@/control-tower/components/KanbanBoard';
import { useVideos, useCreateVideo } from '@/control-tower/hooks/useControlTower';
import { VideoStatus } from '@/control-tower/services/control-tower-service';

export default function ProductionPage() {
  const [selectedStatus, setSelectedStatus] = useState<VideoStatus | undefined>();
  const { videos, total, loading, refresh, moveStatus } = useVideos({ status: selectedStatus });
  const { create, loading: creating } = useCreateVideo();

  const handleMoveStatus = async (videoId: string, newStatus: VideoStatus) => {
    await moveStatus(videoId, newStatus);
  };

  const handleRetry = async (videoId: string) => {
    // Implement retry logic
    await refresh();
  };

  const handleCreateVideo = async () => {
    // Mock: criar de um artigo exemplo
    // Na prática, seria um modal para selecionar artigo
    alert('Funcionalidade: Selecionar artigo do FaceBrasil para criar vídeo');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline de Produção</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Carregando...' : `${total} vídeos no total`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="p-2 border rounded-lg hover:bg-gray-50"
            title="Atualizar"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleCreateVideo}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Novo Vídeo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Filtrar por status:</span>
        <select
          value={selectedStatus || 'all'}
          onChange={(e) => setSelectedStatus(e.target.value === 'all' ? undefined : e.target.value as VideoStatus)}
          className="px-3 py-1.5 border rounded-lg text-sm"
        >
          <option value="all">Todos</option>
          <option value="intake">Intake</option>
          <option value="scripting">Roteirização</option>
          <option value="rendering">Produção</option>
          <option value="review">Revisão</option>
          <option value="published">Publicados</option>
          <option value="error">Erros</option>
        </select>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        videos={videos}
        loading={loading}
        onMoveStatus={handleMoveStatus}
        onRetry={handleRetry}
      />
    </div>
  );
}

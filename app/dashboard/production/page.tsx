// ============================================
// PÁGINA: DASHBOARD DE PRODUÇÃO (Kanban)
// /dashboard/production
// ============================================

import React from 'react';
import { Metadata } from 'next';
import { Film, Plus } from 'lucide-react';
import { KanbanBoard } from '@/control-tower/components/KanbanBoard';
import { MetricsDashboard } from '@/control-tower/components/MetricsDashboard';
import { 
  useVideos, 
  useDashboardStats, 
  usePipelineMetrics 
} from '@/control-tower/hooks/useControlTower';

export const metadata: Metadata = {
  title: 'Produção - Control Tower',
  description: 'Pipeline de produção de vídeos da TV Facebrasil',
};

export default function ProductionPage() {
  const { videos, total, loading: videosLoading, moveStatus, refresh: refreshVideos } = useVideos();
  const { stats, loading: statsLoading, refresh: refreshStats } = useDashboardStats();
  const { metrics, loading: metricsLoading, refresh: refreshMetrics } = usePipelineMetrics();

  const handleRefresh = async () => {
    await Promise.all([refreshVideos(), refreshStats(), refreshMetrics()]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Film className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Produção de Vídeos</h1>
                <p className="text-sm text-gray-500">{total} vídeos no pipeline</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
              >
                Atualizar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Novo Vídeo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Metrics Dashboard */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas</h2>
          <MetricsDashboard 
            stats={stats} 
            metrics={metrics} 
            loading={statsLoading || metricsLoading} 
          />
        </div>

        {/* Kanban Board */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline</h2>
          <KanbanBoard 
            videos={videos}
            loading={videosLoading}
            onMoveStatus={moveStatus}
            onRetry={(videoId) => {
              // Implement retry logic here
              console.log('Retry video:', videoId);
            }}
          />
        </div>
      </div>
    </div>
  );
}

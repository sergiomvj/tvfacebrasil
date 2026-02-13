// ============================================
// PÁGINA: MÉTRICAS DETALHADAS
// /dashboard/metrics
// ============================================

'use client';

import React from 'react';
import { BarChart3, Download, RefreshCw } from 'lucide-react';
import { MetricsDashboard } from '@/control-tower/components/MetricsDashboard';
import { 
  useDashboardStats, 
  usePipelineMetrics,
  useVideos 
} from '@/control-tower/hooks/useControlTower';

export default function MetricsPage() {
  const { stats, loading: statsLoading, refresh: refreshStats } = useDashboardStats();
  const { metrics, loading: metricsLoading, refresh: refreshMetrics } = usePipelineMetrics();
  const { videos, loading: videosLoading } = useVideos({ status: 'published', limit: 10 });

  const handleRefresh = async () => {
    await Promise.all([refreshStats(), refreshMetrics()]);
  };

  const handleExport = () => {
    // Export data to CSV
    const csvContent = [
      ['ID', 'Título', 'Status', 'Data', 'Custo'].join(','),
      ...videos.map(v => [
        v.id,
        `"${v.article_title}"`,
        v.status,
        new Date(v.created_at).toISOString(),
        v.ai_cost_estimate || 0
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metricas-tvfacebrasil-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Métricas e Analytics</h1>
                <p className="text-sm text-gray-500">Acompanhe a produção de vídeos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MetricsDashboard 
          stats={stats} 
          metrics={metrics} 
          loading={statsLoading || metricsLoading} 
        />
        
        {/* Additional detailed tables can be added here */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vídeos Publicados Recentemente</h3>
          {videosLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
            </div>
          ) : videos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum vídeo publicado ainda</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {videos.map((video) => (
                  <tr key={video.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{video.article_title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{video.category_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(video.published_at || video.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      ${video.ai_cost_estimate?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

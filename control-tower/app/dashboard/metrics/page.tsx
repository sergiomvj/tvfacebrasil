// ============================================
// PÁGINA: MÉTRICAS E ANALYTICS
// /dashboard/metrics
// ============================================

'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { MetricsDashboard } from '@/control-tower/components/MetricsDashboard';
import { useDashboardStats, usePipelineMetrics } from '@/control-tower/hooks/useControlTower';

export default function MetricsPage() {
  const { stats, loading: statsLoading, refresh: refreshStats } = useDashboardStats();
  const { metrics, loading: metricsLoading, refresh: refreshMetrics } = usePipelineMetrics();

  const handleRefresh = () => {
    refreshStats();
    refreshMetrics();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Métricas e Analytics</h1>
          <p className="text-gray-500 mt-1">
            Acompanhe a performance da produção de vídeos
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Metrics Dashboard */}
      <MetricsDashboard
        stats={stats}
        metrics={metrics}
        loading={statsLoading || metricsLoading}
      />
    </div>
  );
}

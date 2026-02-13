// ============================================
// COMPONENTE: METRICS DASHBOARD
// Dashboard de Métricas de Produção
// ============================================

'use client';

import React from 'react';
import { 
  Film, 
  CheckCircle, 
  Clock, 
  DollarSign,
  AlertCircle,
  BarChart3,
  PieChart,
  TrendingUp,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardStats, PipelineMetrics } from '@/control-tower/services/control-tower-service';

interface MetricsDashboardProps {
  stats: DashboardStats | null;
  metrics: PipelineMetrics[];
  loading: boolean;
}

// Simple Bar Chart Component
const SimpleBarChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all", item.color)}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Simple Line Chart Component
const SimpleLineChart = ({ data }: { data: { date: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((d.value / max) * 80 + 10),
  }));
  
  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  return (
    <div className="h-48 bg-gray-50 rounded-lg p-4">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}
        
        {/* Line */}
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" />
        
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#3b82f6" />
        ))}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((d, i) => (
          <span key={i}>{d.date.split('-')[2]}</span>
        ))}
      </div>
    </div>
  );
};

export function MetricsDashboard({ stats, metrics, loading }: MetricsDashboardProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Prepare pipeline data for chart
  const pipelineData = metrics.map(m => ({
    label: m.status.charAt(0).toUpperCase() + m.status.slice(1),
    value: m.count,
    color: {
      intake: 'bg-gray-400',
      scripting: 'bg-blue-500',
      rendering: 'bg-purple-500',
      review: 'bg-yellow-500',
      published: 'bg-green-500',
      error: 'bg-red-500',
      cancelled: 'bg-gray-300',
    }[m.status] || 'bg-gray-400',
  }));

  // Mock production data for line chart (last 30 days)
  const productionData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: Math.floor(Math.random() * 5) + (i > 20 ? 2 : 0), // Mais vídeos nos últimos dias
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Videos */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Vídeos</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalVideos || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Film className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {stats?.videosThisMonth || 0} este mês
          </div>
        </div>

        {/* Published */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Publicados</p>
              <p className="text-2xl font-bold text-green-600">{stats?.publishedVideos || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            {stats?.totalVideos ? Math.round((stats.publishedVideos / stats.totalVideos) * 100) : 0}% do total
          </div>
        </div>

        {/* In Production */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Em Produção</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.inProduction || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {stats?.pendingReview || 0} aguardando revisão
          </div>
        </div>

        {/* Cost & Errors */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Custo Estimado</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats?.totalCost?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          {stats?.errorCount ? (
            <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {stats.errorCount} erros
            </div>
          ) : (
            <div className="mt-2 text-sm text-green-600">
              Sem erros
            </div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Distribuição do Pipeline</h3>
          </div>
          <SimpleBarChart data={pipelineData} />
        </div>

        {/* Production Trend */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Produção (Últimos 30 dias)</h3>
          </div>
          <SimpleLineChart data={productionData} />
        </div>
      </div>

      {/* AI Score & Details */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Detalhes da Produção</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Score */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Score Médio da IA</p>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-amber-500">
                {stats?.avgAiScore || 0}
              </div>
              <div className="text-sm text-gray-500">/ 100</div>
            </div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${stats?.avgAiScore || 0}%` }}
              />
            </div>
          </div>

          {/* Pending by Stage */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Pendentes por Etapa</p>
            <div className="space-y-2">
              {metrics.filter(m => ['intake', 'scripting', 'rendering', 'review'].includes(m.status)).map(m => (
                <div key={m.status} className="flex justify-between text-sm">
                  <span className="capitalize">{m.status}</span>
                  <span className="font-medium">{m.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Estatísticas Rápidas</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Taxa de Sucesso</span>
                <span className="font-medium text-green-600">
                  {stats?.totalVideos 
                    ? Math.round((stats.publishedVideos / stats.totalVideos) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Erro</span>
                <span className={cn(
                  "font-medium",
                  (stats?.errorCount || 0) > (stats?.totalVideos || 0) * 0.1 ? "text-red-600" : "text-green-600"
                )}>
                  {stats?.totalVideos 
                    ? Math.round(((stats.errorCount || 0) / stats.totalVideos) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Custo médio/vídeo</span>
                <span className="font-medium">
                  ${stats?.totalVideos 
                    ? (stats.totalCost / stats.totalVideos).toFixed(2) 
                    : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

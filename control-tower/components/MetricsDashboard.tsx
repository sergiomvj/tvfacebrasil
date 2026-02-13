// ============================================
// COMPONENTE: METRICS DASHBOARD
// Dashboard de Analytics do Control Tower
// ============================================

'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Video, 
  CheckCircle, 
  AlertCircle,
  Clock,
  DollarSign,
  Star,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardStats, PipelineMetrics } from '@/control-tower/services/control-tower-service';

interface MetricsDashboardProps {
  stats: DashboardStats | null;
  metrics: PipelineMetrics[];
  loading: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  change?: number; 
  icon: any;
  color: string;
}) => (
  <div className="bg-white rounded-lg border p-6 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-sm",
            change >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-400">vs mês anterior</span>
          </div>
        )}
      </div>
      <div className={cn("p-3 rounded-lg", color)}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const PipelineBar = ({ metrics }: { metrics: PipelineMetrics[] }) => {
  const total = metrics.reduce((acc, m) => acc + m.count, 0);
  
  const colors: Record<string, string> = {
    intake: 'bg-gray-400',
    scripting: 'bg-blue-500',
    rendering: 'bg-purple-500',
    review: 'bg-yellow-500',
    published: 'bg-green-500',
    error: 'bg-red-500',
    cancelled: 'bg-gray-300',
  };

  const labels: Record<string, string> = {
    intake: 'Intake',
    scripting: 'Roteiro',
    rendering: 'Produção',
    review: 'Revisão',
    published: 'Publicado',
    error: 'Erro',
    cancelled: 'Cancelado',
  };

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Pipeline de Produção
      </h3>
      
      {/* Progress Bar */}
      <div className="h-8 rounded-full overflow-hidden flex mb-4">
        {metrics.map((m) => (
          <div
            key={m.status}
            className={cn("h-full transition-all", colors[m.status])}
            style={{ width: `${total > 0 ? (m.count / total) * 100 : 0}%` }}
            title={`${labels[m.status]}: ${m.count}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.status} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", colors[m.status])} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{labels[m.status]}</p>
              <p className="text-xs text-gray-500">{m.count} vídeos</p>
            </div>
          </div>
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

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        Não foi possível carregar as métricas
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Vídeos"
          value={stats.totalVideos}
          change={12}
          icon={Video}
          color="bg-blue-100 text-blue-600"
        />
        
        <StatCard
          title="Publicados"
          value={stats.publishedVideos}
          change={8}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />
        
        <StatCard
          title="Em Revisão"
          value={stats.pendingReview}
          icon={Clock}
          color="bg-yellow-100 text-yellow-600"
        />
        
        <StatCard
          title="Erros"
          value={stats.errorCount}
          change={stats.errorCount > 0 ? -5 : undefined}
          icon={AlertCircle}
          color="bg-red-100 text-red-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Em Produção"
          value={stats.inProduction}
          icon={Video}
          color="bg-purple-100 text-purple-600"
        />
        
        <StatCard
          title="Score AI Médio"
          value={`${stats.avgAiScore}/100`}
          icon={Star}
          color="bg-amber-100 text-amber-600"
        />
        
        <StatCard
          title="Custo Total Estimado"
          value={`$${stats.totalCost.toFixed(2)}`}
          icon={DollarSign}
          color="bg-emerald-100 text-emerald-600"
        />
      </div>

      {/* Pipeline Visualization */}
      <PipelineBar metrics={metrics} />

      {/* Monthly Progress */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Produção do Mês</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Vídeos criados este mês</span>
              <span className="text-lg font-semibold">{stats.videosThisMonth}</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((stats.videosThisMonth / 30) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Meta: 30 vídeos/mês
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

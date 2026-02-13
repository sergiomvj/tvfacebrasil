// ============================================
// PÁGINA: DASHBOARD PRINCIPAL (Overview)
// /dashboard
// ============================================

'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Video, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { 
  useDashboardStats, 
  useVideos 
} from '@/control-tower/hooks/useControlTower';
import { MetricsDashboard } from '@/control-tower/components/MetricsDashboard';
import { usePipelineMetrics } from '@/control-tower/hooks/useControlTower';

const QuickStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  href 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string;
  href: string;
}) => (
  <Link href={href}>
    <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={cn("p-3 rounded-lg", color)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-blue-600">
        <span>Ver detalhes</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  </Link>
);

import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { metrics, loading: metricsLoading } = usePipelineMetrics();
  const { videos: recentVideos, loading: videosLoading } = useVideos({ limit: 5 });

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo ao Control Tower
        </h1>
        <p className="text-gray-500 mt-1">
          Gerencie a produção de vídeos da TV Facebrasil
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard
          title="Em Produção"
          value={stats?.inProduction || 0}
          icon={Video}
          color="bg-purple-100 text-purple-600"
          href="/dashboard/production"
        />
        <QuickStatCard
          title="Para Revisar"
          value={stats?.pendingReview || 0}
          icon={Clock}
          color="bg-yellow-100 text-yellow-600"
          href="/dashboard/production"
        />
        <QuickStatCard
          title="Publicados"
          value={stats?.publishedVideos || 0}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
          href="/dashboard/production"
        />
        <QuickStatCard
          title="Erros"
          value={stats?.errorCount || 0}
          icon={AlertCircle}
          color="bg-red-100 text-red-600"
          href="/dashboard/production"
        />
      </div>

      {/* Metrics Dashboard */}
      <MetricsDashboard
        stats={stats}
        metrics={metrics}
        loading={statsLoading || metricsLoading}
      />

      {/* Recent Videos */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Vídeos Recentes</h3>
            <Link
              href="/dashboard/production"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="divide-y">
          {videosLoading ? (
            <div className="p-6 text-center text-gray-500">Carregando...</div>
          ) : recentVideos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum vídeo encontrado
            </div>
          ) : (
            recentVideos.slice(0, 5).map((video) => (
              <div key={video.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{video.article_title}</p>
                  <p className="text-sm text-gray-500">
                    {video.category_name} • {new Date(video.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    video.status === 'published' && "bg-green-100 text-green-700",
                    video.status === 'review' && "bg-yellow-100 text-yellow-700",
                    video.status === 'rendering' && "bg-purple-100 text-purple-700",
                    video.status === 'error' && "bg-red-100 text-red-700",
                    video.status === 'intake' && "bg-gray-100 text-gray-700",
                    video.status === 'scripting' && "bg-blue-100 text-blue-700",
                  )}>
                    {video.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/production">
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 hover:bg-blue-100 transition-colors">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Pipeline de Produção
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Visualize e gerencie todos os vídeos em produção
            </p>
          </div>
        </Link>

        <Link href="/dashboard/metrics">
          <div className="bg-green-50 rounded-lg border border-green-200 p-6 hover:bg-green-100 transition-colors">
            <h3 className="font-semibold text-green-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analytics e Métricas
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Acompanhe a performance da produção
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

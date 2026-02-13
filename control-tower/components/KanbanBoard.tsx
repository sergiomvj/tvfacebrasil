// ============================================
// COMPONENTE: KANBAN BOARD
// Pipeline de Produção de Vídeos
// ============================================

'use client';

import React from 'react';
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Play, 
  Edit3, 
  Film,
  RotateCcw,
  MoreHorizontal,
  ArrowRight,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Video, VideoStatus } from '@/control-tower/services/control-tower-service';
import Link from 'next/link';

interface KanbanBoardProps {
  videos: Video[];
  loading: boolean;
  onMoveStatus: (videoId: string, newStatus: VideoStatus) => void;
  onRetry?: (videoId: string) => void;
}

const COLUMNS: { id: VideoStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'intake', label: 'Intake', icon: <Clock className="w-4 h-4" />, color: 'bg-gray-100 border-gray-200' },
  { id: 'scripting', label: 'Roteirização', icon: <Edit3 className="w-4 h-4" />, color: 'bg-blue-50 border-blue-200' },
  { id: 'rendering', label: 'Produção', icon: <Film className="w-4 h-4" />, color: 'bg-purple-50 border-purple-200' },
  { id: 'review', label: 'Revisão', icon: <Play className="w-4 h-4" />, color: 'bg-yellow-50 border-yellow-200' },
  { id: 'published', label: 'Publicados', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-50 border-green-200' },
  { id: 'error', label: 'Erros', icon: <AlertCircle className="w-4 h-4" />, color: 'bg-red-50 border-red-200' },
];

const StatusBadge = ({ status }: { status: VideoStatus }) => {
  const styles = {
    intake: 'bg-gray-100 text-gray-700',
    scripting: 'bg-blue-100 text-blue-700',
    rendering: 'bg-purple-100 text-purple-700',
    review: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", styles[status])}>
      {status}
    </span>
  );
};

const VideoCard = ({ 
  video, 
  onMoveStatus, 
  onRetry 
}: { 
  video: Video; 
  onMoveStatus: (videoId: string, newStatus: VideoStatus) => void;
  onRetry?: (videoId: string) => void;
}) => {
  const isError = video.status === 'error';
  const isPublished = video.status === 'published';
  
  const nextStatus: Record<VideoStatus, VideoStatus | null> = {
    intake: 'scripting',
    scripting: 'rendering',
    rendering: 'review',
    review: 'published',
    published: null,
    error: 'rendering',
    cancelled: null,
  };

  const handleMove = () => {
    const next = nextStatus[video.status];
    if (next) {
      onMoveStatus(video.id, next);
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow",
      isError && "border-red-300 bg-red-50"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 truncate" title={video.article_title}>
            {video.article_title}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {video.category_name || 'Sem categoria'}
          </p>
        </div>
        {video.ai_score && (
          <div className="flex items-center gap-1 text-xs text-amber-600 ml-2">
            <Star className="w-3 h-3 fill-current" />
            {video.ai_score}
          </div>
        )}
      </div>

      {/* Error Message */}
      {isError && video.error_message && (
        <div className="mb-3 p-2 bg-red-100 rounded text-xs text-red-700">
          {video.error_message}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={video.status} />
          {video.retry_count > 0 && (
            <span className="text-xs text-gray-500">
              Retry: {video.retry_count}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Action Buttons */}
          {video.status === 'scripting' && (
            <Link
              href={`/dashboard/editor/${video.id}`}
              className="p-1.5 hover:bg-gray-100 rounded text-blue-600"
              title="Editar Roteiro"
            >
              <Edit3 className="w-4 h-4" />
            </Link>
          )}

          {video.status === 'review' && (
            <Link
              href={`/dashboard/review/${video.id}`}
              className="p-1.5 hover:bg-gray-100 rounded text-green-600"
              title="Revisar Vídeo"
            >
              <Play className="w-4 h-4" />
            </Link>
          )}

          {isError && onRetry && (
            <button
              onClick={() => onRetry(video.id)}
              className="p-1.5 hover:bg-red-100 rounded text-red-600"
              title="Tentar Novamente"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Move Button */}
          {nextStatus[video.status] && (
            <button
              onClick={handleMove}
              className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
              title={`Mover para ${nextStatus[video.status]}`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="mt-2 text-xs text-gray-400">
        {new Date(video.created_at).toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
};

export function KanbanBoard({ videos, loading, onMoveStatus, onRetry }: KanbanBoardProps) {
  const videosByColumn = React.useMemo(() => {
    const grouped: Record<VideoStatus, Video[]> = {
      intake: [],
      scripting: [],
      rendering: [],
      review: [],
      published: [],
      error: [],
      cancelled: [],
    };
    
    videos.forEach(video => {
      if (grouped[video.status]) {
        grouped[video.status].push(video);
      }
    });
    
    return grouped;
  }, [videos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => (
        <div 
          key={column.id} 
          className={cn(
            "flex-shrink-0 w-80 rounded-lg border-2",
            column.color
          )}
        >
          {/* Column Header */}
          <div className="p-3 border-b border-inherit">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {column.icon}
                <span className="font-semibold text-sm">{column.label}</span>
              </div>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-medium">
                {videosByColumn[column.id]?.length || 0}
              </span>
            </div>
          </div>

          {/* Column Content */}
          <div className="p-3 space-y-3 min-h-[200px]">
            {videosByColumn[column.id]?.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onMoveStatus={onMoveStatus}
                onRetry={onRetry}
              />
            ))}
            
            {videosByColumn[column.id]?.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Nenhum vídeo
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

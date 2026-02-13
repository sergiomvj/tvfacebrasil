'use client';

import React from 'react';
import { 
  Loader2, 
  AlertCircle, 
  Clock, 
  Play, 
  CheckCircle, 
  Edit3, 
  Video,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Video, VideoStatus } from '../services/control-tower-service';

interface KanbanBoardProps {
  columns: Record<VideoStatus, Video[]>;
  loading: boolean;
  onCardClick: (video: Video) => void;
  onMoveCard: (videoId: string, newStatus: VideoStatus) => void;
  onRetry?: (videoId: string) => void;
}

interface KanbanColumn {
  id: VideoStatus;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const COLUMNS: KanbanColumn[] = [
  { 
    id: 'intake', 
    title: 'Novos', 
    icon: <Clock className="w-4 h-4" />,
    color: 'border-gray-300',
    bgColor: 'bg-gray-50'
  },
  { 
    id: 'scripting', 
    title: 'Roteirização', 
    icon: <Edit3 className="w-4 h-4" />,
    color: 'border-blue-300',
    bgColor: 'bg-blue-50'
  },
  { 
    id: 'rendering', 
    title: 'Produção', 
    icon: <Play className="w-4 h-4" />,
    color: 'border-purple-300',
    bgColor: 'bg-purple-50'
  },
  { 
    id: 'review', 
    title: 'Revisão', 
    icon: <Video className="w-4 h-4" />,
    color: 'border-yellow-300',
    bgColor: 'bg-yellow-50'
  },
  { 
    id: 'published', 
    title: 'Publicados', 
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'border-green-300',
    bgColor: 'bg-green-50'
  },
  { 
    id: 'error', 
    title: 'Erros', 
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'border-red-300',
    bgColor: 'bg-red-50'
  },
];

const StatusBadge = ({ status }: { status: VideoStatus }) => {
  const variants: Record<VideoStatus, string> = {
    intake: 'bg-gray-100 text-gray-700',
    scripting: 'bg-blue-100 text-blue-700',
    rendering: 'bg-purple-100 text-purple-700',
    review: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  const labels: Record<VideoStatus, string> = {
    intake: 'Novo',
    scripting: 'Roteiro',
    rendering: 'Produzindo',
    review: 'Revisão',
    published: 'Publicado',
    error: 'Erro',
    cancelled: 'Cancelado',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium",
      variants[status]
    )}>
      {labels[status]}
    </span>
  );
};

const AIScoreBadge = ({ score }: { score: number | null }) => {
  if (score === null) return null;
  
  const color = score >= 80 ? 'bg-green-100 text-green-700' :
                score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700';
  
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", color)}>
      AI: {score}
    </span>
  );
};

const VideoCard = ({ 
  video, 
  onClick, 
  onRetry 
}: { 
  video: Video; 
  onClick: () => void;
  onRetry?: () => void;
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
          {video.article_title}
        </h4>
        {video.status === 'error' && onRetry && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
            className="p-1 hover:bg-red-100 rounded transition-colors"
            title="Tentar novamente"
          >
            <RefreshCw className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 mb-2">
        <AIScoreBadge score={video.ai_score} />
        {video.retry_count > 0 && (
          <span className="text-xs text-orange-600">
            Retry: {video.retry_count}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{video.category_name || 'Sem categoria'}</span>
        <span>{new Date(video.created_at).toLocaleDateString('pt-BR')}</span>
      </div>

      {/* Progress indicator for rendering */}
      {video.status === 'rendering' && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 animate-pulse w-3/4" />
          </div>
          <Loader2 className="w-3 h-3 animate-spin text-purple-500" />
        </div>
      )}

      {/* Error message */}
      {video.status === 'error' && video.error_message && (
        <div className="mt-2 text-xs text-red-600 line-clamp-2">
          {video.error_message}
        </div>
      )}
    </div>
  );
};

export function KanbanBoard({ 
  columns, 
  loading, 
  onCardClick, 
  onMoveCard,
  onRetry 
}: KanbanBoardProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(column => {
        const videos = columns[column.id] || [];
        
        return (
          <div 
            key={column.id}
            className={cn(
              "flex-shrink-0 w-72 rounded-lg border-2",
              column.bgColor,
              column.color
            )}
          >
            {/* Column Header */}
            <div className={cn(
              "p-3 border-b rounded-t-lg",
              column.bgColor
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {column.icon}
                  <h3 className="font-semibold text-sm">{column.title}</h3>
                </div>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-medium">
                  {videos.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="p-2 space-y-2 min-h-[200px]">
              {videos.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Nenhum vídeo
                </div>
              ) : (
                videos.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => onCardClick(video)}
                    onRetry={onRetry ? () => onRetry(video.id) : undefined}
                  />
                ))
              )}
            </div>

            {/* Column Footer with quick actions */}
            {videos.length > 0 && column.id !== 'published' && column.id !== 'error' && (
              <div className="p-2 border-t">
                <button
                  onClick={() => {
                    const nextColumn = COLUMNS[COLUMNS.findIndex(c => c.id === column.id) + 1];
                    if (nextColumn && videos[0]) {
                      onMoveCard(videos[0].id, nextColumn.id);
                    }
                  }}
                  className="w-full py-1.5 text-xs text-center text-gray-600 hover:bg-white/50 rounded transition-colors"
                >
                  Mover todos →
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

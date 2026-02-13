// ============================================
// COMPONENTE: VIDEO REVIEW PLAYER
// Revisão Final antes da Publicação
// ============================================

'use client';

import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize,
  CheckCircle,
  XCircle,
  RotateCcw,
  ExternalLink,
  Clock,
  Tag,
  FileText,
  Film
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Video } from '@/control-tower/services/control-tower-service';

interface VideoReviewPlayerProps {
  video: Video | null;
  loading: boolean;
  onApprove: (data: {
    video_title: string;
    video_description: string;
    video_tags: string[];
    youtube_video_id?: string;
  }) => void;
  onReject: (reason: string) => void;
  onRetry: () => void;
}

export function VideoReviewPlayer({
  video,
  loading,
  onApprove,
  onReject,
  onRetry,
}: VideoReviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Initialize from video data
  React.useEffect(() => {
    if (video) {
      setTitle(video.video_title || video.article_title);
      setDescription(video.video_description || video.article_excerpt || '');
      setTags(video.video_tags?.join(', ') || '');
      setYoutubeId(video.youtube_video_id || '');
    }
  }, [video?.id]);

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApprove = () => {
    onApprove({
      video_title: title,
      video_description: description,
      video_tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      youtube_video_id: youtubeId || undefined,
    });
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
      setShowRejectForm(false);
      setRejectReason('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        Selecione um vídeo para revisar
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Video Player */}
      <div className="lg:col-span-2 space-y-4">
        {/* Video Container */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {video.video_url ? (
            <video
              ref={videoRef}
              src={video.video_url}
              className="w-full h-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Vídeo em processamento...</p>
              </div>
            </div>
          )}

          {/* Custom Controls */}
          {video.video_url && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="w-full bg-white/30 h-1 rounded-full mb-3 cursor-pointer">
                <div 
                  className="bg-white h-full rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="text-white hover:text-blue-400">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <button onClick={toggleMute} className="text-white hover:text-blue-400">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button 
                  onClick={() => videoRef.current?.requestFullscreen()}
                  className="text-white hover:text-blue-400"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail */}
        {video.thumbnail_url && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img 
              src={video.thumbnail_url} 
              alt="Thumbnail"
              className="w-32 h-18 object-cover rounded"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Thumbnail gerada</p>
              <p className="text-xs text-gray-500">Usada para preview e SEO</p>
            </div>
          </div>
        )}

        {/* Script Reference */}
        {video.script_full && (
          <div className="bg-gray-50 rounded-lg border p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Roteiro Aprovado
            </h4>
            <div className="text-sm text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
              {video.script_full}
            </div>
          </div>
        )}
      </div>

      {/* Right: Metadata & Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Detalhes da Publicação</h3>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do Vídeo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="imigração, eua, dicas..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />
              YouTube Video ID (opcional)
            </label>
            <input
              type="text"
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              placeholder="dQw4w9WgXcQ"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4">
          <button
            onClick={handleApprove}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Aprovar e Publicar
          </button>

          <button
            onClick={() => setShowRejectForm(!showRejectForm)}
            className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Rejeitar / Refazer
          </button>

          <button
            onClick={onRetry}
            className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Tentar Novamente
          </button>
        </div>

        {/* Reject Form */}
        {showRejectForm && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <label className="block text-sm font-medium text-red-700 mb-2">
              Motivo da rejeição:
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Ex: Áudio desincronizado, erro na narração..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
            />
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Confirmar Rejeição
            </button>
          </div>
        )}

        {/* Info */}
        <div className="pt-4 text-sm text-gray-500 space-y-1">
          <p className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Criado em: {new Date(video.created_at).toLocaleDateString('pt-BR')}
          </p>
          {video.ai_cost_estimate && (
            <p>Custo estimado: ${video.ai_cost_estimate.toFixed(2)}</p>
          )}
        </div>
      </div>
    </div>
  );
}

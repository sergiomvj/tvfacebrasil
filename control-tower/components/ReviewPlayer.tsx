'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Edit3,
  ExternalLink,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Video } from '../services/control-tower-service';

interface ReviewPlayerProps {
  video: Video;
  onApprove: (data: {
    video_title: string;
    video_description: string;
    video_tags: string[];
    youtube_video_id?: string;
  }) => void;
  onReject: (reason: string) => void;
  onBack: () => void;
  loading: boolean;
}

export function ReviewPlayer({
  video,
  onApprove,
  onReject,
  onBack,
  loading
}: ReviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [metadata, setMetadata] = useState({
    video_title: video.video_title || video.article_title,
    video_description: video.video_description || video.article_excerpt || '',
    video_tags: video.video_tags?.join(', ') || '',
    youtube_video_id: video.youtube_video_id || '',
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApprove = () => {
    onApprove({
      video_title: metadata.video_title,
      video_description: metadata.video_description,
      video_tags: metadata.video_tags.split(',').map(t => t.trim()).filter(Boolean),
      youtube_video_id: metadata.youtube_video_id,
    });
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason);
      setShowRejectModal(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Revisão Final</h1>
            <p className="text-sm text-gray-500">{video.article_title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Rejeitar
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            Aprovar e Publicar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center p-8">
          {video.video_url ? (
            <div className="w-full max-w-4xl">
              {/* Video Player */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  src={video.video_url}
                  className="w-full h-full"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onEnded={() => setIsPlaying(false)}
                  muted={isMuted}
                />
                
                {/* Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
                    <div 
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:text-gray-300"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-gray-300"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="mt-4 text-white">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Duração: {formatTime(duration || video.video_duration || 0)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Vídeo não disponível para preview</p>
            </div>
          )}
        </div>

        {/* Right: Metadata Editor */}
        <div className="w-96 border-l bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Metadados para Publicação
            </h2>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Título do Vídeo
              </label>
              <input
                type="text"
                value={metadata.video_title}
                onChange={(e) => setMetadata(prev => ({ ...prev, video_title: e.target.value }))}
                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Descrição
              </label>
              <textarea
                value={metadata.video_description}
                onChange={(e) => setMetadata(prev => ({ ...prev, video_description: e.target.value }))}
                rows={4}
                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                value={metadata.video_tags}
                onChange={(e) => setMetadata(prev => ({ ...prev, video_tags: e.target.value }))}
                placeholder="imigração, eua, brasileiros..."
                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Thumbnail Preview */}
            {video.thumbnail_url && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Thumbnail
                </label>
                <img
                  src={video.thumbnail_url}
                  alt="Thumbnail"
                  className="w-full aspect-video object-cover rounded-lg border"
                />
              </div>
            )}

            {/* YouTube ID */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                YouTube Video ID
              </label>
              <input
                type="text"
                value={metadata.youtube_video_id}
                onChange={(e) => setMetadata(prev => ({ ...prev, youtube_video_id: e.target.value }))}
                placeholder="dQw4w9WgXcQ"
                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Roteiro used */}
            {video.script_full && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" />
                  Roteiro Utilizado
                </h3>
                <div className="bg-white p-3 rounded-lg border text-xs text-gray-600 max-h-32 overflow-y-auto">
                  {video.script_full}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Rejeitar Vídeo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Informe o motivo da rejeição. O vídeo voltará para a fase de produção.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Áudio desincronizado, thumbnail ruim..."
              className="w-full h-24 p-3 border rounded-lg mb-4 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

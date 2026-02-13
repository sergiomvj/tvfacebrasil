// ============================================
// VIDEO PORTAL - HERO CARROSSEL
// Vitrine principal da TV Facebrasil
// ============================================

'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Video } from '@/control-tower/services/control-tower-service';

interface HeroCarouselProps {
  videos: Video[];
  autoPlayInterval?: number;
}

export function HeroCarousel({ videos, autoPlayInterval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const featuredVideos = videos.filter(v => v.status === 'published').slice(0, 5);

  useEffect(() => {
    if (!isAutoPlaying || isHovering || featuredVideos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredVideos.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovering, featuredVideos.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredVideos.length);
    setIsAutoPlaying(false);
  };

  const currentVideo = featuredVideos[currentIndex];

  if (featuredVideos.length === 0) {
    return (
      <div className="relative h-[500px] bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Bem-vindo à TV Facebrasil</h2>
          <p className="text-white/70">Em breve novos vídeos!</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-[500px] rounded-xl overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        {currentVideo?.thumbnail_url ? (
          <img 
            src={currentVideo.thumbnail_url}
            alt={currentVideo.article_title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900" />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-3xl">
          {/* Category Badge */}
          <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full mb-3">
            {currentVideo?.category_name || 'Destaque'}
          </span>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {currentVideo?.article_title}
          </h2>

          {/* Excerpt */}
          <p className="text-white/80 text-lg mb-6 line-clamp-2">
            {currentVideo?.article_excerpt || 'Assista agora na TV Facebrasil'}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a 
              href={`/video/${currentVideo?.article_slug}`}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Play className="w-5 h-5" />
              Assistir Agora
            </a>
            
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {featuredVideos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {featuredVideos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {featuredVideos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsAutoPlaying(false);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentIndex ? "bg-white w-6" : "bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

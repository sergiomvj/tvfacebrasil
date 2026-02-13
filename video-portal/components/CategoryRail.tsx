// ============================================
// VIDEO PORTAL - CATEGORY RAIL
// Trilho de vídeos por categoria (estilo Netflix)
// ============================================

'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Video } from '@/control-tower/services/control-tower-service';

interface CategoryRailProps {
  title: string;
  videos: Video[];
  color?: string;
}

const VideoCard = ({ video }: { video: Video }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={`/video/${video.article_slug}`}
      className="flex-shrink-0 w-[280px] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
        {/* Thumbnail */}
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url}
            alt={video.article_title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
            <Play className="w-12 h-12 text-white/50" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-gray-900 ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.video_duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
            {Math.floor(video.video_duration / 60)}:{(video.video_duration % 60).toString().padStart(2, '0')}
          </div>
        )}

        {/* AI Score Badge */}
        {video.ai_score && video.ai_score >= 80 && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs rounded font-medium">
            ⭐ {video.ai_score}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2">
        <h3 className="text-white font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
          {video.article_title}
        </h3>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {Math.floor(Math.random() * 5000) + 500}
          </span>
          <span>{video.category_name}</span>
        </div>
      </div>
    </a>
  );
};

export function CategoryRail({ title, videos, color = "bg-blue-600" }: CategoryRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (videos.length === 0) return null;

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 px-4 sm:px-6 lg:px-8">
        <div className={cn("w-1 h-6 rounded-full", color)} />
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <span className="text-gray-400 text-sm">({videos.length})</span>
      </div>

      {/* Rail Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={cn(
            "absolute left-0 top-0 bottom-0 w-16 z-10 flex items-center justify-center transition-opacity",
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="p-2 bg-black/70 rounded-full text-white hover:bg-black/90">
            <ChevronLeft className="w-8 h-8" />
          </div>
        </button>

        {/* Videos Track */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={cn(
            "absolute right-0 top-0 bottom-0 w-16 z-10 flex items-center justify-center transition-opacity",
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="p-2 bg-black/70 rounded-full text-white hover:bg-black/90">
            <ChevronRight className="w-8 h-8" />
          </div>
        </button>
      </div>
    </div>
  );
}

// ============================================
// CONTROL TOWER - REACT HOOKS
// TV Facebrasil
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchVideos,
  fetchVideoById,
  updateVideoStatus,
  approveScript,
  publishVideo,
  retryVideo,
  fetchVideoLogs,
  fetchDashboardStats,
  fetchPipelineMetrics,
  fetchAdvertisers,
  createVideoFromArticle,
  Video,
  VideoStatus,
  VideoLog,
  Advertiser,
  DashboardStats,
  PipelineMetrics,
} from '@/control-tower/services/control-tower-service';

// ============================================
// HOOK: useVideos
// ============================================
export function useVideos(params?: {
  status?: VideoStatus;
  page?: number;
  limit?: number;
} | { limit?: number }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVideos(params);
      setVideos(data.videos);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading videos');
    } finally {
      setLoading(false);
    }
  }, [params?.status, params?.page, params?.limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const moveStatus = useCallback(async (videoId: string, newStatus: VideoStatus, notes?: string) => {
    const success = await updateVideoStatus(videoId, newStatus, notes);
    if (success) {
      await refresh();
    }
    return success;
  }, [refresh]);

  return { videos, total, loading, error, refresh, moveStatus };
}

// ============================================
// HOOK: useVideo
// ============================================
export function useVideo(videoId: string | null) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!videoId) {
      setVideo(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVideoById(videoId);
      setVideo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading video');
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const approve = useCallback(async (scriptData: {
    hook: string;
    intro: string;
    body: string;
    cta: string;
    full: string;
  }, userId: string) => {
    if (!videoId) return false;
    const success = await approveScript(videoId, scriptData, userId);
    if (success) await refresh();
    return success;
  }, [videoId, refresh]);

  const publish = useCallback(async (publishData: {
    video_title: string;
    video_description: string;
    video_tags: string[];
    youtube_video_id?: string;
  }, userId: string) => {
    if (!videoId) return false;
    const success = await publishVideo(videoId, publishData, userId);
    if (success) await refresh();
    return success;
  }, [videoId, refresh]);

  const retry = useCallback(async () => {
    if (!videoId) return false;
    const success = await retryVideo(videoId);
    if (success) await refresh();
    return success;
  }, [videoId, refresh]);

  return { video, loading, error, refresh, approve, publish, retry };
}

// ============================================
// HOOK: useVideoLogs
// ============================================
export function useVideoLogs(videoId: string | null) {
  const [logs, setLogs] = useState<VideoLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!videoId) {
      setLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVideoLogs(videoId);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading logs');
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { logs, loading, error, refresh };
}

// ============================================
// HOOK: useDashboardStats
// ============================================
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}

// ============================================
// HOOK: usePipelineMetrics
// ============================================
export function usePipelineMetrics() {
  const [metrics, setMetrics] = useState<PipelineMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPipelineMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { metrics, loading, error, refresh };
}

// ============================================
// HOOK: useAdvertisers
// ============================================
export function useAdvertisers() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdvertisers();
      setAdvertisers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading advertisers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { advertisers, loading, error, refresh };
}

// ============================================
// HOOK: useCreateVideo
// ============================================
export function useCreateVideo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (articleId: string): Promise<Video | null> => {
    setLoading(true);
    setError(null);
    try {
      const video = await createVideoFromArticle(articleId);
      return video;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating video');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

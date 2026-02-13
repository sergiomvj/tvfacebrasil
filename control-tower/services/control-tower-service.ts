// ============================================
// CONTROL TOWER - SERVICE LAYER
// TV Facebrasil - Gerenciamento de Pipeline
// ============================================

import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

// ============================================
// TYPES
// ============================================

export type VideoStatus = 'intake' | 'scripting' | 'rendering' | 'review' | 'published' | 'error' | 'cancelled';

export interface Video {
  id: string;
  article_id: string;
  article_title: string;
  article_slug: string;
  article_content: string | null;
  article_excerpt: string | null;
  article_category_id: string | null;
  category_name?: string;
  author_name?: string;
  
  status: VideoStatus;
  ai_score: number | null;
  
  // Script
  script_hook: string | null;
  script_intro: string | null;
  script_body: string | null;
  script_cta: string | null;
  script_full: string | null;
  script_approved: boolean;
  script_approved_at: string | null;
  script_approved_by: string | null;
  
  // Produção
  audio_url: string | null;
  video_url: string | null;
  video_duration: number | null;
  thumbnail_url: string | null;
  
  // Metadados
  video_title: string | null;
  video_description: string | null;
  video_tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  
  // Métricas
  ai_cost_estimate: number | null;
  api_calls_count: number;
  processing_time_seconds: number | null;
  
  // Erro/Retry
  error_message: string | null;
  retry_count: number;
  
  // Publicação
  published_at: string | null;
  published_by: string | null;
  youtube_video_id: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface VideoLog {
  id: string;
  video_id: string;
  user_id: string | null;
  user_name: string | null;
  previous_status: string | null;
  new_status: string | null;
  action: string;
  notes: string | null;
  metadata: any;
  created_at: string;
}

export interface Advertiser {
  id: string;
  company_name: string;
  company_description: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  logo_url: string | null;
  website_url: string | null;
  ad_type: 'pre_roll' | 'mid_roll' | 'banner' | 'sponsorship' | null;
  ad_video_url: string | null;
  status: 'active' | 'paused' | 'inactive';
  target_categories: string[] | null;
  target_keywords: string[] | null;
  total_impressions: number;
  total_clicks: number;
  created_at: string;
  updated_at: string;
}

export interface PipelineMetrics {
  status: VideoStatus;
  count: number;
  avg_score: number;
}

export interface DashboardStats {
  totalVideos: number;
  publishedVideos: number;
  pendingReview: number;
  inProduction: number;
  errorCount: number;
  avgAiScore: number;
  totalCost: number;
  videosThisMonth: number;
}

// ============================================
// VIDEOS - CRUD & PIPELINE
// ============================================

export async function fetchVideos(params?: {
  status?: VideoStatus;
  page?: number;
  limit?: number;
}): Promise<{ videos: Video[]; total: number }> {
  try {
    let query = supabaseAdmin
      .from('videos')
      .select(`
        *,
        category:categories(name),
        author:profiles(name)
      `, { count: 'exact' });

    if (params?.status) {
      query = query.eq('status', params.status);
    }

    query = query.order('created_at', { ascending: false });

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw error;

    const videos: Video[] = (data || []).map((row: any) => ({
      ...row,
      category_name: row.category?.name,
      author_name: row.author?.name,
    }));

    return { videos, total: count || 0 };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { videos: [], total: 0 };
  }
}

export async function fetchVideoById(id: string): Promise<Video | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .select(`
        *,
        category:categories(name),
        author:profiles(name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      category_name: data.category?.name,
      author_name: data.author?.name,
    };
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}

export async function createVideoFromArticle(articleId: string): Promise<Video | null> {
  try {
    // Buscar artigo do FaceBrasil
    const { data: article, error: articleError } = await supabaseAdmin
      .from('articles')
      .select('*, category:categories(id, name)')
      .eq('id', articleId)
      .single();

    if (articleError || !article) {
      console.error('Article not found:', articleError);
      return null;
    }

    // Criar vídeo
    const { data: video, error } = await supabaseAdmin
      .from('videos')
      .insert({
        article_id: articleId,
        article_title: article.title,
        article_slug: article.slug,
        article_content: article.content,
        article_excerpt: article.excerpt,
        article_category_id: article.category_id,
        status: 'intake',
        ai_score: Math.floor(Math.random() * 40) + 60, // Mock: 60-100
      })
      .select()
      .single();

    if (error) throw error;

    // Criar log
    await supabaseAdmin.from('video_logs').insert({
      video_id: video.id,
      action: 'created',
      notes: `Vídeo criado a partir do artigo: ${article.title}`,
    });

    return video;
  } catch (error) {
    console.error('Error creating video:', error);
    return null;
  }
}

export async function updateVideoStatus(
  videoId: string,
  newStatus: VideoStatus,
  notes?: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('videos')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', videoId);

    if (error) throw error;

    // Log é criado automaticamente pelo trigger
    // Mas podemos adicionar notas extras
    if (notes) {
      await supabaseAdmin
        .from('video_logs')
        .insert({
          video_id: videoId,
          action: 'status_changed',
          notes,
        });
    }

    return true;
  } catch (error) {
    console.error('Error updating video status:', error);
    return false;
  }
}

export async function approveScript(
  videoId: string,
  scriptData: {
    hook: string;
    intro: string;
    body: string;
    cta: string;
    full: string;
  },
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('videos')
      .update({
        script_hook: scriptData.hook,
        script_intro: scriptData.intro,
        script_body: scriptData.body,
        script_cta: scriptData.cta,
        script_full: scriptData.full,
        script_approved: true,
        script_approved_at: new Date().toISOString(),
        script_approved_by: userId,
        status: 'rendering', // Avança para produção
      })
      .eq('id', videoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error approving script:', error);
    return false;
  }
}

export async function publishVideo(
  videoId: string,
  publishData: {
    video_title: string;
    video_description: string;
    video_tags: string[];
    youtube_video_id?: string;
  },
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('videos')
      .update({
        ...publishData,
        status: 'published',
        published_at: new Date().toISOString(),
        published_by: userId,
      })
      .eq('id', videoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error publishing video:', error);
    return false;
  }
}

export async function retryVideo(videoId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('videos')
      .update({
        status: 'rendering',
        retry_count: supabaseAdmin.rpc('increment_retry', { video_id: videoId }),
        error_message: null,
      })
      .eq('id', videoId);

    if (error) {
      // Fallback se RPC não existir
      const { data: video } = await supabaseAdmin
        .from('videos')
        .select('retry_count')
        .eq('id', videoId)
        .single();
      
      await supabaseAdmin
        .from('videos')
        .update({
          status: 'rendering',
          retry_count: (video?.retry_count || 0) + 1,
          error_message: null,
        })
        .eq('id', videoId);
    }

    return true;
  } catch (error) {
    console.error('Error retrying video:', error);
    return false;
  }
}

// ============================================
// LOGS
// ============================================

export async function fetchVideoLogs(videoId: string): Promise<VideoLog[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('video_logs')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
}

// ============================================
// METRICS & DASHBOARD
// ============================================

export async function fetchPipelineMetrics(): Promise<PipelineMetrics[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('v_pipeline_metrics')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    // Total metrics
    const { data: videos, error } = await supabaseAdmin
      .from('videos')
      .select('status, ai_score, ai_cost_estimate, created_at');

    if (error) throw error;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: DashboardStats = {
      totalVideos: videos?.length || 0,
      publishedVideos: videos?.filter(v => v.status === 'published').length || 0,
      pendingReview: videos?.filter(v => v.status === 'review').length || 0,
      inProduction: videos?.filter(v => ['scripting', 'rendering'].includes(v.status)).length || 0,
      errorCount: videos?.filter(v => v.status === 'error').length || 0,
      avgAiScore: videos?.length 
        ? Math.round(videos.reduce((acc, v) => acc + (v.ai_score || 0), 0) / videos.length)
        : 0,
      totalCost: videos?.reduce((acc, v) => acc + (v.ai_cost_estimate || 0), 0) || 0,
      videosThisMonth: videos?.filter(v => new Date(v.created_at) >= firstDayOfMonth).length || 0,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalVideos: 0,
      publishedVideos: 0,
      pendingReview: 0,
      inProduction: 0,
      errorCount: 0,
      avgAiScore: 0,
      totalCost: 0,
      videosThisMonth: 0,
    };
  }
}

export async function fetchMonthlyProduction() {
  try {
    const { data, error } = await supabaseAdmin
      .from('v_monthly_production')
      .select('*')
      .limit(12);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching monthly production:', error);
    return [];
  }
}

// ============================================
// ADVERTISERS
// ============================================

export async function fetchAdvertisers(): Promise<Advertiser[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('advertisers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching advertisers:', error);
    return [];
  }
}

export async function createAdvertiser(advertiser: Omit<Advertiser, 'id' | 'created_at' | 'updated_at'>): Promise<Advertiser | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('advertisers')
      .insert(advertiser)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating advertiser:', error);
    return null;
  }
}

export async function updateAdvertiser(id: string, updates: Partial<Advertiser>): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('advertisers')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating advertiser:', error);
    return false;
  }
}

export async function deleteAdvertiser(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('advertisers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting advertiser:', error);
    return false;
  }
}

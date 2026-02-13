// ============================================
// YOUTUBE API INTEGRATION SERVICE
// TV Facebrasil - Upload e Gerenciamento de Vídeos
// ============================================

import { google, youtube_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// ============================================
// TYPES
// ============================================

export interface YouTubeUploadOptions {
  title: string;
  description: string;
  tags: string[];
  categoryId?: string; // Default: 27 (Education) ou 25 (News & Politics)
  privacyStatus?: 'private' | 'unlisted' | 'public';
}

export interface YouTubeVideoMetadata {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

// ============================================
// YOUTUBE SERVICE CLASS
// ============================================

export class YouTubeService {
  private oauth2Client: OAuth2Client;
  private youtube: youtube_v3.Youtube;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
    this.youtube = google.youtube({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }

  // ============================================
  // AUTHENTICATION
  // ============================================

  /**
   * Gera URL de autorização OAuth2
   */
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.readonly',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Força refresh_token
    });
  }

  /**
   * Troca código de autorização por tokens
   */
  async getTokensFromCode(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  /**
   * Seta tokens manualmente (do banco de dados)
   */
  setCredentials(tokens: {
    access_token?: string;
    refresh_token?: string;
    expiry_date?: number;
  }) {
    this.oauth2Client.setCredentials(tokens);
  }

  // ============================================
  // VIDEO UPLOAD
  // ============================================

  /**
   * Faz upload de vídeo para o YouTube
   */
  async uploadVideo(
    videoBuffer: Buffer,
    options: YouTubeUploadOptions
  ): Promise<string> {
    const { title, description, tags, categoryId = '27', privacyStatus = 'private' } = options;

    const response = await this.youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId,
          defaultLanguage: 'pt',
          defaultAudioLanguage: 'pt',
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: videoBuffer,
      },
    });

    if (!response.data.id) {
      throw new Error('Falha ao fazer upload do vídeo');
    }

    return response.data.id;
  }

  /**
   * Faz upload de thumbnail para um vídeo
   */
  async uploadThumbnail(videoId: string, thumbnailBuffer: Buffer): Promise<void> {
    await this.youtube.thumbnails.set({
      videoId,
      media: {
        body: thumbnailBuffer,
      },
    });
  }

  // ============================================
  // VIDEO MANAGEMENT
  // ============================================

  /**
   * Atualiza metadados de um vídeo
   */
  async updateVideoMetadata(
    videoId: string,
    updates: Partial<YouTubeUploadOptions>
  ): Promise<void> {
    await this.youtube.videos.update({
      part: ['snippet'],
      requestBody: {
        id: videoId,
        snippet: {
          title: updates.title,
          description: updates.description,
          tags: updates.tags,
        } as any,
      },
    });
  }

  /**
   * Altera status de privacidade (private/unlisted/public)
   */
  async updateVideoPrivacy(videoId: string, privacyStatus: 'private' | 'unlisted' | 'public'): Promise<void> {
    await this.youtube.videos.update({
      part: ['status'],
      requestBody: {
        id: videoId,
        status: {
          privacyStatus,
        },
      },
    });
  }

  /**
   * Deleta um vídeo
   */
  async deleteVideo(videoId: string): Promise<void> {
    await this.youtube.videos.delete({
      id: videoId,
    });
  }

  // ============================================
  // VIDEO RETRIEVAL
  // ============================================

  /**
   * Busca vídeo por ID
   */
  async getVideoById(videoId: string): Promise<YouTubeVideoMetadata | null> {
    const response = await this.youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: [videoId],
    });

    const video = response.data.items?.[0];
    if (!video) return null;

    return {
      id: video.id!,
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      publishedAt: video.snippet?.publishedAt || '',
      thumbnails: video.snippet?.thumbnails || {},
      statistics: {
        viewCount: video.statistics?.viewCount || '0',
        likeCount: video.statistics?.likeCount || '0',
        commentCount: video.statistics?.commentCount || '0',
      },
    };
  }

  /**
   * Lista vídeos do canal
   */
  async getChannelVideos(channelId: string, maxResults: number = 50): Promise<YouTubeVideoMetadata[]> {
    // Primeiro, busca IDs dos vídeos
    const searchResponse = await this.youtube.search.list({
      part: ['id'],
      channelId,
      type: ['video'],
      order: 'date',
      maxResults,
    });

    const videoIds = searchResponse.data.items
      ?.map(item => item.id?.videoId)
      .filter((id): id is string => !!id) || [];

    if (videoIds.length === 0) return [];

    // Depois, busca detalhes dos vídeos
    const videosResponse = await this.youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: videoIds,
    });

    return videosResponse.data.items?.map(video => ({
      id: video.id!,
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      publishedAt: video.snippet?.publishedAt || '',
      thumbnails: video.snippet?.thumbnails || {},
      statistics: {
        viewCount: video.statistics?.viewCount || '0',
        likeCount: video.statistics?.likeCount || '0',
        commentCount: video.statistics?.commentCount || '0',
      },
    })) || [];
  }

  // ============================================
  // PLAYLISTS
  // ============================================

  /**
   * Cria uma playlist
   */
  async createPlaylist(title: string, description: string, privacyStatus: 'private' | 'unlisted' | 'public' = 'public'): Promise<string> {
    const response = await this.youtube.playlists.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus,
        },
      },
    });

    return response.data.id!;
  }

  /**
   * Adiciona vídeo a uma playlist
   */
  async addVideoToPlaylist(playlistId: string, videoId: string): Promise<void> {
    await this.youtube.playlistItems.insert({
      part: ['snippet'],
      requestBody: {
        snippet: {
          playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId,
          },
        },
      },
    });
  }
}

// ============================================
// SINGLETON INSTANCE (para uso na aplicação)
// ============================================

let youtubeService: YouTubeService | null = null;

export function getYouTubeService(): YouTubeService {
  if (!youtubeService) {
    const clientId = process.env.YOUTUBE_DATA_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_DATA_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`;

    if (!clientId || !clientSecret) {
      throw new Error('YouTube API credentials not configured');
    }

    youtubeService = new YouTubeService(clientId, clientSecret, redirectUri);
  }

  return youtubeService;
}

// ============================================
// API ROUTES HELPERS (Next.js)
// ============================================

/**
 * Handler para iniciar autenticação OAuth
 * GET /api/auth/youtube
 */
export function getYouTubeAuthUrl(): string {
  const service = getYouTubeService();
  return service.getAuthUrl();
}

/**
 * Handler para callback OAuth
 * GET /api/auth/youtube/callback?code=...
 */
export async function handleYouTubeCallback(code: string) {
  const service = getYouTubeService();
  const tokens = await service.getTokensFromCode(code);
  return tokens;
}

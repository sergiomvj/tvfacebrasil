// ============================================
// HEYGEN SERVICE
// Geração de Vídeos com Avatares de IA
// ============================================

interface HeyGenVideoOptions {
  script: string;
  avatarId?: string;
  voiceId?: string;
  background?: string;
  width?: number;
  height?: number;
}

interface HeyGenVideoStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  error?: string;
}

export class HeyGenService {
  private apiKey: string;
  private baseUrl = 'https://api.heygen.com/v2';
  private defaultAvatarId: string;
  private defaultVoiceId: string;

  constructor(apiKey?: string, defaultAvatarId?: string, defaultVoiceId?: string) {
    this.apiKey = apiKey || process.env.HEYGEN_API_KEY || '';
    this.defaultAvatarId = defaultAvatarId || process.env.HEYGEN_AVATAR_ID || '';
    this.defaultVoiceId = defaultVoiceId || '';
    
    if (!this.apiKey) {
      throw new Error('HeyGen API key not configured');
    }
  }

  /**
   * Lista avatares disponíveis
   */
  async listAvatars(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/avatars`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch avatars: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.avatars || [];
  }

  /**
   * Lista vozes disponíveis
   */
  async listVoices(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.voices || [];
  }

  /**
   * Cria um vídeo com avatar
   */
  async createVideo(options: HeyGenVideoOptions): Promise<string> {
    const {
      script,
      avatarId = this.defaultAvatarId,
      voiceId = this.defaultVoiceId,
      background = '#ffffff',
      width = 1080,
      height = 1920,  // 9:16 para Reels/Stories
    } = options;

    if (!avatarId) {
      throw new Error('Avatar ID is required. Set HEYGEN_AVATAR_ID in env or pass as parameter.');
    }

    const response = await fetch(`${this.baseUrl}/video/generate`, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: avatarId,
              avatar_style: 'normal',  // ou 'circular'
            },
            voice: {
              type: 'text',
              input_text: script,
              voice_id: voiceId || undefined,
              speed: 1.0,
            },
            background: {
              type: 'color',
              value: background,
            },
          },
        ],
        dimension: {
          width,
          height,
        },
        caption: false,  // Podemos adicionar legendas depois
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HeyGen video creation failed: ${error}`);
    }

    const data = await response.json();
    const videoId = data.data?.video_id;

    if (!videoId) {
      throw new Error('No video ID returned from HeyGen');
    }

    return videoId;
  }

  /**
   * Verifica status do vídeo
   */
  async getVideoStatus(videoId: string): Promise<HeyGenVideoStatus> {
    const response = await fetch(`${this.baseUrl}/video/status?video_id=${videoId}`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get video status: ${response.statusText}`);
    }

    const data = await response.json();
    const videoData = data.data;

    return {
      id: videoId,
      status: videoData.status,
      video_url: videoData.video_url,
      thumbnail_url: videoData.thumbnail_url,
      duration: videoData.duration,
      error: videoData.error,
    };
  }

  /**
   * Aguarda vídeo ficar pronto (polling)
   */
  async waitForVideo(
    videoId: string,
    options: {
      maxAttempts?: number;
      intervalMs?: number;
      onProgress?: (status: HeyGenVideoStatus) => void;
    } = {}
  ): Promise<HeyGenVideoStatus> {
    const { maxAttempts = 60, intervalMs = 10000, onProgress } = options;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.getVideoStatus(videoId);
      
      if (onProgress) {
        onProgress(status);
      }

      if (status.status === 'completed') {
        return status;
      }

      if (status.status === 'failed') {
        throw new Error(`Video generation failed: ${status.error}`);
      }

      // Aguarda antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error('Video generation timeout');
  }

  /**
   * Deleta um vídeo
   */
  async deleteVideo(videoId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/video/delete?video_id=${videoId}`, {
      method: 'DELETE',
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete video: ${response.statusText}`);
    }
  }

  /**
   * Estima custo (aproximado)
   */
  estimateCost(durationMinutes: number): number {
    // HeyGen: ~$2-3 por minuto de vídeo (plano Creator)
    const costPerMinute = 2.5;
    return durationMinutes * costPerMinute;
  }
}

// Singleton instance
let heyGenService: HeyGenService | null = null;

export function getHeyGenService(): HeyGenService {
  if (!heyGenService) {
    heyGenService = new HeyGenService();
  }
  return heyGenService;
}

// Export
export { HeyGenService };
export type { HeyGenVideoOptions, HeyGenVideoStatus };

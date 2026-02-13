// ============================================
// META (FACEBOOK/INSTAGRAM) API INTEGRATION
// TV Facebrasil - Upload para Instagram/Facebook
// ============================================

import axios from 'axios';

// ============================================
// TYPES
// ============================================

export interface InstagramPublishOptions {
  caption: string;
  mediaType: 'REELS' | 'STORIES' | 'CAROUSEL';
  hashtags?: string[];
  locationId?: string;
}

export interface FacebookPublishOptions {
  message: string;
  link?: string;
}

export interface MetaTokens {
  accessToken: string;
  expiresAt?: Date;
}

// ============================================
// INSTAGRAM SERVICE
// ============================================

export class InstagramService {
  private accessToken: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';
  private accountId: string;

  constructor(accessToken: string, accountId: string) {
    this.accessToken = accessToken;
    this.accountId = accountId;
  }

  /**
   * Verifica se o token é válido
   */
  async validateToken(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          access_token: this.accessToken,
        },
      });
      return !!response.data.id;
    } catch (error) {
      console.error('Invalid Instagram token:', error);
      return false;
    }
  }

  /**
   * Busca informações da conta
   */
  async getAccountInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/${this.accountId}`, {
        params: {
          fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count',
          access_token: this.accessToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  /**
   * Faz upload de vídeo para Reels
     * 
   * Fluxo:
   * 1. Cria container de mídia
   * 2. Faz upload do vídeo (ou fornece URL)
   * 3. Publica o container
   */
  async uploadReel(
    videoUrl: string,
    options: InstagramPublishOptions
  ): Promise<string> {
    try {
      // 1. Criar container
      const caption = this.buildCaption(options.caption, options.hashtags);
      
      const containerResponse = await axios.post(
        `${this.baseUrl}/${this.accountId}/media`,
        null,
        {
          params: {
            media_type: 'REELS',
            video_url: videoUrl,
            caption: caption,
            access_token: this.accessToken,
          },
        }
      );

      const containerId = containerResponse.data.id;
      console.log('Reel container created:', containerId);

      // 2. Aguardar processamento
      await this.waitForMediaProcessing(containerId);

      // 3. Publicar
      const publishResponse = await axios.post(
        `${this.baseUrl}/${this.accountId}/media_publish`,
        null,
        {
          params: {
            creation_id: containerId,
            access_token: this.accessToken,
          },
        }
      );

      const mediaId = publishResponse.data.id;
      console.log('Reel published successfully:', mediaId);

      return mediaId;
    } catch (error) {
      console.error('Error uploading reel:', error);
      throw error;
    }
  }

  /**
   * Faz upload de vídeo para Stories
   */
  async uploadStory(
    videoUrl: string,
    caption?: string
  ): Promise<string> {
    try {
      const containerResponse = await axios.post(
        `${this.baseUrl}/${this.accountId}/media`,
        null,
        {
          params: {
            media_type: 'STORIES',
            video_url: videoUrl,
            caption: caption || '',
            access_token: this.accessToken,
          },
        }
      );

      const containerId = containerResponse.data.id;
      await this.waitForMediaProcessing(containerId);

      const publishResponse = await axios.post(
        `${this.baseUrl}/${this.accountId}/media_publish`,
        null,
        {
          params: {
            creation_id: containerId,
            access_token: this.accessToken,
          },
        }
      );

      return publishResponse.data.id;
    } catch (error) {
      console.error('Error uploading story:', error);
      throw error;
    }
  }

  /**
   * Publica post no feed (imagem ou carrossel)
   */
  async uploadFeed(
    mediaUrls: string[],
    options: InstagramPublishOptions
  ): Promise<string> {
    try {
      const caption = this.buildCaption(options.caption, options.hashtags);

      // Se for carrossel (múltiplas imagens)
      if (mediaUrls.length > 1) {
        // Criar containers para cada imagem
        const containerIds: string[] = [];
        
        for (const url of mediaUrls) {
          const response = await axios.post(
            `${this.baseUrl}/${this.accountId}/media`,
            null,
            {
              params: {
                image_url: url,
                is_carousel_item: true,
                access_token: this.accessToken,
              },
            }
          );
          containerIds.push(response.data.id);
        }

        // Criar container do carrossel
        const carouselResponse = await axios.post(
          `${this.baseUrl}/${this.accountId}/media`,
          null,
          {
            params: {
              media_type: 'CAROUSEL',
              children: containerIds.join(','),
              caption: caption,
              access_token: this.accessToken,
            },
          }
        );

        await this.waitForMediaProcessing(carouselResponse.data.id);

        const publishResponse = await axios.post(
          `${this.baseUrl}/${this.accountId}/media_publish`,
          null,
          {
            params: {
              creation_id: carouselResponse.data.id,
              access_token: this.accessToken,
            },
          }
        );

        return publishResponse.data.id;
      } 
      
      // Post único
      else {
        const containerResponse = await axios.post(
          `${this.baseUrl}/${this.accountId}/media`,
          null,
          {
            params: {
              image_url: mediaUrls[0],
              caption: caption,
              access_token: this.accessToken,
            },
          }
        );

        await this.waitForMediaProcessing(containerResponse.data.id);

        const publishResponse = await axios.post(
          `${this.baseUrl}/${this.accountId}/media_publish`,
          null,
          {
            params: {
              creation_id: containerResponse.data.id,
              access_token: this.accessToken,
            },
          }
        );

        return publishResponse.data.id;
      }
    } catch (error) {
      console.error('Error uploading to feed:', error);
      throw error;
    }
  }

  /**
   * Busca métricas de um post
   */
  async getMediaInsights(mediaId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/${mediaId}/insights`, {
        params: {
          metric: 'impressions,reach,engagement,saved,video_views',
          access_token: this.accessToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Aguarda processamento do vídeo
   */
  private async waitForMediaProcessing(
    containerId: string,
    maxAttempts: number = 30
  ): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await axios.get(`${this.baseUrl}/${containerId}`, {
          params: {
            fields: 'status_code',
            access_token: this.accessToken,
          },
        });

        const status = response.data.status_code;
        console.log(`Media processing status: ${status} (attempt ${i + 1})`);

        if (status === 'FINISHED') {
          return;
        } else if (status === 'ERROR') {
          throw new Error('Media processing failed');
        }

        // Aguarda 5 segundos
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error('Error checking media status:', error);
        throw error;
      }
    }

    throw new Error('Media processing timeout');
  }

  /**
   * Constrói legenda com hashtags
   */
  private buildCaption(caption: string, hashtags?: string[]): string {
    if (!hashtags || hashtags.length === 0) {
      return caption;
    }

    const hashtagString = hashtags.map(h => `#${h}`).join(' ');
    return `${caption}\n\n${hashtagString}`;
  }
}

// ============================================
// FACEBOOK SERVICE (Opcional)
// ============================================

export class FacebookService {
  private accessToken: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';
  private pageId: string;

  constructor(accessToken: string, pageId: string) {
    this.accessToken = accessToken;
    this.pageId = pageId;
  }

  /**
   * Publica vídeo na página do Facebook
   */
  async uploadVideo(
    videoUrl: string,
    options: FacebookPublishOptions
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.pageId}/videos`,
        null,
        {
          params: {
            file_url: videoUrl,
            description: options.message,
            access_token: this.accessToken,
          },
        }
      );

      return response.data.id;
    } catch (error) {
      console.error('Error uploading Facebook video:', error);
      throw error;
    }
  }

  /**
   * Publica post com link na página
   */
  async publishPost(options: FacebookPublishOptions): Promise<string> {
    try {
      const params: any = {
        message: options.message,
        access_token: this.accessToken,
      };

      if (options.link) {
        params.link = options.link;
      }

      const response = await axios.post(
        `${this.baseUrl}/${this.pageId}/feed`,
        null,
        { params }
      );

      return response.data.id;
    } catch (error) {
      console.error('Error publishing Facebook post:', error);
      throw error;
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let instagramService: InstagramService | null = null;
let facebookService: FacebookService | null = null;

export function getInstagramService(accountId?: string): InstagramService {
  if (!instagramService) {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const instaAccountId = accountId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    if (!accessToken || !instaAccountId) {
      throw new Error('Instagram credentials not configured');
    }

    instagramService = new InstagramService(accessToken, instaAccountId);
  }

  return instagramService;
}

export function getFacebookService(pageId?: string): FacebookService {
  if (!facebookService) {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const fbPageId = pageId || process.env.FACEBOOK_PAGE_ID;

    if (!accessToken || !fbPageId) {
      throw new Error('Facebook credentials not configured');
    }

    facebookService = new FacebookService(accessToken, fbPageId);
  }

  return facebookService;
}

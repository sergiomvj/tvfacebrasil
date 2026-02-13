// ============================================
// ELEVENLABS SERVICE
// Text-to-Speech / Narração em Português
// ============================================

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  preview_url: string;
}

interface ElevenLabsTTSOptions {
  text: string;
  voiceId?: string;
  stability?: number;      // 0-1, default 0.5
  similarityBoost?: number; // 0-1, default 0.75
  style?: number;          // 0-1, default 0
}

export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private defaultVoiceId: string;

  constructor(apiKey?: string, defaultVoiceId?: string) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY || '';
    this.defaultVoiceId = defaultVoiceId || process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
    
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }
  }

  /**
   * Lista vozes disponíveis em português
   */
  async listVoices(): Promise<ElevenLabsVoice[]> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filtra vozes que suportam português
    return data.voices.filter((voice: any) => 
      voice.labels?.language === 'pt' || 
      voice.name.toLowerCase().includes('portuguese') ||
      voice.name.toLowerCase().includes('brazil')
    );
  }

  /**
   * Converte texto em áudio (narração)
   */
  async textToSpeech(options: ElevenLabsTTSOptions): Promise<Buffer> {
    const {
      text,
      voiceId = this.defaultVoiceId,
      stability = 0.5,
      similarityBoost = 0.75,
      style = 0,
    } = options;

    const response = await fetch(
      `${this.baseUrl}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',  // Melhor para português
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs TTS failed: ${error}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer);
  }

  /**
   * Gera áudio para um roteiro completo
   */
  async generateScriptAudio(script: {
    hook: string;
    intro: string;
    body: string;
    cta: string;
  }): Promise<{
    fullAudio: Buffer;
    segments: {
      hook: Buffer;
      intro: Buffer;
      body: Buffer;
      cta: Buffer;
    };
  }> {
    // Gera cada segmento separadamente
    const [hookAudio, introAudio, bodyAudio, ctaAudio] = await Promise.all([
      this.textToSpeech({ text: script.hook }),
      this.textToSpeech({ text: script.intro }),
      this.textToSpeech({ text: script.body }),
      this.textToSpeech({ text: script.cta }),
    ]);

    // Combina todos os segmentos
    const fullAudio = Buffer.concat([hookAudio, introAudio, bodyAudio, ctaAudio]);

    return {
      fullAudio,
      segments: {
        hook: hookAudio,
        intro: introAudio,
        body: bodyAudio,
        cta: ctaAudio,
      },
    };
  }

  /**
   * Estima uso de caracteres
   */
  estimateCharacterUsage(text: string): number {
    return text.length;
  }

  /**
   * Estima custo (para controle)
   */
  estimateCost(characters: number): number {
    // ElevenLabs: $5 por 1M caracteres no plano starter
    const costPerMillion = 5;
    return (characters / 1000000) * costPerMillion;
  }
}

// Singleton instance
let elevenLabsService: ElevenLabsService | null = null;

export function getElevenLabsService(): ElevenLabsService {
  if (!elevenLabsService) {
    elevenLabsService = new ElevenLabsService();
  }
  return elevenLabsService;
}

// Export util functions
export { ElevenLabsService };

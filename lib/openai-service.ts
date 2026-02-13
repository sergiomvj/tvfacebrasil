// ============================================
// OPENAI SERVICE
// Geração de Roteiros com GPT-4
// ============================================

import OpenAI from 'openai';

interface ScriptGenerationOptions {
  articleTitle: string;
  articleContent: string;
  category: string;
  tone?: 'professional' | 'casual' | 'enthusiastic';
  targetDuration?: number;
}

interface GeneratedScript {
  hook: string;
  intro: string;
  body: string;
  cta: string;
  fullScript: string;
  suggestedTitle: string;
  suggestedTags: string[];
  estimatedDuration: number;
}

export class OpenAIService {
  private client: OpenAI;
  private model = 'gpt-4-turbo-preview';

  constructor(apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OpenAI API key not configured');
    this.client = new OpenAI({ apiKey: key });
  }

  async generateScript(options: ScriptGenerationOptions): Promise<GeneratedScript> {
    const { articleTitle, articleContent, category, tone = 'professional', targetDuration = 120 } = options;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: `Você é roteirista da TV Facebrasil. Crie roteiros para brasileiros nos EUA.
Estrutura: HOOK (5s) → INTRO (10s) → BODY (90s) → CTA (15s)
Tom: ${tone}. Duração: ${targetDuration}s. Categoria: ${category}`
        },
        {
          role: 'user',
          content: `TÍTULO: ${articleTitle}\n\nCONTEÚDO: ${articleContent?.substring(0, 4000)}\n\nGere em JSON: {hook, intro, body, cta, suggestedTitle, suggestedTags[], estimatedDuration}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      ...result,
      fullScript: `${result.hook}\n\n${result.intro}\n\n${result.body}\n\n${result.cta}`,
    };
  }

  estimateCost(inputTokens: number, outputTokens: number): number {
    return (inputTokens / 1000) * 0.01 + (outputTokens / 1000) * 0.03;
  }
}

let openAIService: OpenAIService | null = null;
export function getOpenAIService(): OpenAIService {
  if (!openAIService) openAIService = new OpenAIService();
  return openAIService;
}

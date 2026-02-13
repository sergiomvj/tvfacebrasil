# TV Facebrasil - APIs Externas Necessárias
## Lista Completa para Funcionamento 100%

---

## 🎬 **1. GERAÇÃO DE CONTEÚDO (AI/ML)**

### ✅ OpenAI API (GPT-4, DALL-E)
**Para:** Geração de roteiros, títulos, descrições
```
Uso: Scripting automático de vídeos
Custo: ~$0.03-0.06 por 1K tokens
Endpoint: api.openai.com
```

### ✅ ElevenLabs API (Text-to-Speech)
**Para:** Narração em voz natural em português
```
Uso: Converter roteiro em áudio
Custo: ~$5 por 1M caracteres
Endpoint: api.elevenlabs.io
Planos: Free (10K chars/mês) / Starter ($5)
```

### ✅ HeyGen API (Avatares de IA)
**Para:** Criar apresentador virtual falando
```
Uso: Gerar vídeo com avatar sincronizado ao áudio
Custo: ~$2-3 por vídeo (1-2 min)
Endpoint: api.heygen.com
Planos: Free trial / Creator ($29/mês)
```

### ⏳ Replicate API (Alternativa HeyGen)
**Para:** Modelos open-source de vídeo/áudio
```
Uso: Backup se HeyGen falhar
Custo: Por segundo de processamento
Endpoint: api.replicate.com
```

---

## 📺 **2. DISTRIBUIÇÃO (YouTube + Meta)**

### ✅ YouTube Data API v3 (TEMOS!)
**Para:** Upload automático de vídeos
```
Uso: Publicar vídeos no canal TV Facebrasil
Quota: 10.000 unidades/dia (grátis)
Endpoint: youtube.googleapis.com
Status: ✅ CONFIGURADO!
```

### ✅ YouTube Analytics API (TEMOS!)
**Para:** Métricas de views, likes, comentários
```
Uso: Dashboard de performance
Custo: Grátis
Status: ✅ CONFIGURADO!
```

### ⏳ Meta Instagram Graph API (PENDENTE)
**Para:** Publicar Reels e Stories
```
Uso: Distribuição Instagram
Custo: Grátis
Endpoint: graph.facebook.com
Status: ⏳ CRIANDO CREDENCIAIS
```

### ⏳ Meta Facebook Graph API (PENDENTE)
**Para:** Publicar na página do Facebook
```
Uso: Distribuição Facebook
Custo: Grátis
Endpoint: graph.facebook.com
Status: ⏳ CRIANDO CREDENCIAIS
```

---

## 🎵 **3. ASSETS E MÍDIA**

### ⏳ Pexels API (Stock Photos/Videos)
**Para:** B-roll e imagens de fundo
```
Uso: Download gratuito de vídeos stock
Custo: Grátis (200 requests/hora)
Endpoint: api.pexels.com
```

### ⏳ Pixabay API (Stock Assets)
**Para:** Imagens e vídeos complementares
```
Uso: Assets para composição de vídeos
Custo: Grátis (100 requests/minuto)
Endpoint: pixabay.com/api
```

### ⏳ Unsplash API (Fotos)
**Para:** Thumbnails e imagens estáticas
```
Uso: Fotos de alta qualidade
Custo: Grátis (50 requests/hora)
Endpoint: api.unsplash.com
```

---

## 🎨 **4. EDIÇÃO E PRODUÇÃO**

### ⏳ Cloudinary API (Opcional)
**Para:** Processamento de imagens em tempo real
```
Uso: Redimensionar thumbnails, overlays
Custo: Grátis (25K transforms/mês)
Endpoint: api.cloudinary.com
```

### ⏳ Remotion (Self-hosted)
**Para:** Renderização programática de vídeos
```
Uso: Criar vídeos com React + Node.js
Custo: $0 (open source, usa sua infra)
Repo: github.com/remotion-dev/remotion
```

---

## 📊 **5. ANALYTICS E MONITORAMENTO**

### ✅ Supabase (Já temos!)
**Para:** Database, Auth, Storage, Realtime
```
Uso: Todo backend da aplicação
Plano: Free tier (500MB, 2GB egress)
Status: ✅ CONFIGURADO!
```

### ⏳ Google Analytics 4
**Para:** Tracking de usuários no portal
```
Uso: Métricas de acesso, comportamento
Custo: Grátis
ID: G-XXXXXXXXXX
```

### ⏳ Sentry (Opcional)
**Para:** Error tracking e monitoramento
```
Uso: Capturar erros em produção
Custo: Grátis (5K errors/mês)
```

---

## 💰 **6. PAGAMENTOS (Monetização)**

### ⏳ Stripe API (Opcional)
**Para:** Assinaturas FB Academy (Premium)
```
Uso: Cobrança de usuários premium
Custo: 2.9% + $0.30 por transação
Endpoint: api.stripe.com
```

---

## 🌐 **7. INFRAESTRUTURA**

### ⏳ Cloudflare R2 (Storage)
**Para:** Armazenar vídeos gerados
```
Uso: CDN para entrega de vídeos
Custo: $0.015/GB/mês (muito barato!)
Alternativa: AWS S3, Backblaze B2
```

### ⏳ n8n (Self-hosted)
**Para:** Automação de workflows
```
Uso: Orquestrar pipeline de produção
Custo: $0 (self-hosted) ou $20/mês (cloud)
```

---

## 📋 **RESUMO POR PRIORIDADE**

### 🔴 CRÍTICO (Sem isso não funciona)
| API | Status | Custo Estimado |
|-----|--------|----------------|
| **OpenAI** | ⏳ Pendente | ~$50-100/mês |
| **ElevenLabs** | ⏳ Pendente | ~$20-50/mês |
| **HeyGen** | ⏳ Pendente | ~$100-200/mês |
| **YouTube Data API** | ✅ OK | Grátis |
| **Supabase** | ✅ OK | Grátis |

### 🟡 ALTO (Melhora muito o produto)
| API | Status | Custo Estimado |
|-----|--------|----------------|
| **Meta Instagram** | ⏳ Criando | Grátis |
| **Meta Facebook** | ⏳ Criando | Grátis |
| **Pexels/Pixabay** | ⏳ Pendente | Grátis |
| **Cloudflare R2** | ⏳ Pendente | ~$10-20/mês |

### 🟢 MÉDIO (Nice to have)
| API | Status | Custo Estimado |
|-----|--------|----------------|
| Google Analytics 4 | ⏳ Pendente | Grátis |
| Cloudinary | ⏳ Pendente | Grátis |
| Stripe | ⏳ Pendente | Por transação |

---

## 💵 **CUSTO TOTAL ESTIMADO (Mensal)**

### Mínimo viável (MVP):
```
OpenAI:           $50
ElevenLabs:       $20
HeyGen:           $100
Cloudflare R2:    $10
Supabase:         $0 (free tier)
-----------------------
TOTAL:           ~$180/mês
```

### Escala (100 vídeos/mês):
```
OpenAI:           $150
ElevenLabs:       $80
HeyGen:           $300
Cloudflare R2:    $50
Supabase:         $25
-----------------------
TOTAL:           ~$605/mês
```

---

## 🎯 **PRÓXIMOS PASSOS RECOMENDADOS:**

1. **Agora:** Criar conta ElevenLabs (free trial)
2. **Agora:** Criar conta HeyGen (free trial)
3. **Agora:** Criar Meta APIs (você já está fazendo!)
4. **Depois:** Configurar OpenAI billing
5. **Depois:** Configurar Cloudflare R2

---

**Quer que eu crie os arquivos de configuração para as APIs críticas (OpenAI, ElevenLabs, HeyGen)?** 🚀

# Task List - TV Facebrasil

## Fase 1: Fundação e MVP (Mês 1-2)
**Objetivo**: Validar o fluxo completo de um único artigo até um vídeo finalizado e publicado manualmente.

### 1.1. Configuração do Ambiente
- [x] Setup do servidor n8n (Instalado) <!-- id: 0 -->
- [x] Configuração de credenciais no n8n <!-- id: 1 -->
    - [x] OpenAI API <!-- id: 2 -->
    - [x] ElevenLabs API <!-- id: 3 -->
    - [x] HeyGen/Synthesia API <!-- id: 4 -->
    - [ ] YouTube Data API <!-- id: 5 -->
    - [x] API Facebrasil <!-- id: 6 -->
- [x] Modelagem e Criação do Banco de Dados (PostgreSQL) <!-- id: 7 -->
    - [x] Tabela `videos` (metadados, status) <!-- id: 8 -->
    - [x] Tabela `jobs` (rastreio de execução n8n) <!-- id: 9 -->
    - [x] Tabela `articles` (cache de artigos importados) <!-- id: 10 -->
    - [x] Configuração de Vector DB (pgvector ou Pinecone) <!-- id: 11 -->

### 1.2. Intake Engine (Editor Chefe)
- [x] Criar Workflow A: Webhook de Entrada em Lote (JSON Gerado) <!-- id: 12 -->
    - [x] Processamento de 5 artigos por batch (a cada 60 min) <!-- id: 13 -->
- [x] Criar Workflow B: Editor Chefe AI (JSON Gerado) <!-- id: 15 -->
    - [x] Decisão de Formato: Short (1-3 min) vs Doc (10 min) <!-- id: 16 -->
    - [x] Scoring de viralidade e priorização <!-- id: 17 -->
    - [x] Gravação dos resultados e metadados no BD <!-- id: 18 -->

### 1.3. Processing Engine (n8n + IA)
- [x] Criar Workflow C: Gerador de Roteiros (AI Agent) (JSON Gerado) <!-- id: 19 -->
    - [x] Prompt "Role: Roteirista Sênior" <!-- id: 20 -->
    - [x] Estruturação em blocos (Hook, Intro, Desenvolvimento, CTA) <!-- id: 21 -->
    - [x] Geração de descrição para B-Rolls <!-- id: 22 -->
- [x] Criar Workflow D: Revisor de Roteiros (AI Agent) (JSON Gerado) <!-- id: 23 -->
    - [x] Prompt de crítica e refinamento <!-- id: 24 -->
    - [x] Implementação de loop de feedback <!-- id: 25 -->

### 1.4. Control Tower (Frontend MVP)
- [x] Setup do projeto React/Next.js com Tailwind CSS <!-- id: 26 -->
- [x] Implementação de Autenticação (Supabase ou similar) <!-- id: 27 -->
- [x] UI: Dashboard de Visão Geral <!-- id: 28 -->
- [x] UI: Lista de "Fila de Produção" (Kanban) <!-- id: 29 -->
- [x] UI: Editor de Roteiros (Markdown/Rich Text) <!-- id: 30 -->
    - [x] Visualização do roteiro gerado <!-- id: 31 -->
    - [x] Botão de "Aprovar para Produção" <!-- id: 32 -->

## Fase 2: Produção e Distribuição (Mês 3-4)
**Objetivo**: Automatizar a geração de vídeo e a publicação multicanal.

### 2.1. Production Engine
- [x] Integração n8n com ElevenLabs (Geração de Áudio) (JSON Gerado) <!-- id: 33 -->
    - [x] Mapeamento de vozes para tipos de roteiro (News vs Doc) <!-- id: 34 -->
- [x] Integração n8n com HeyGen/Synthesia (Geração de Avatar) (JSON Gerado) <!-- id: 35 -->
    - [x] Configuração de avatar padrão <!-- id: 36 -->
- [x] Workflow de Montagem (Media Assembly) (JSON Gerado) <!-- id: 37 -->
    - [x] Orquestração paralela de áudio e vídeo <!-- id: 38 -->
    - [x] Integração com Stock Assets (**Unsplash/Pixabay/Pexels**) <!-- id: 39 -->
    - [x] Renderização final (FFmpeg ou Remotion via script) (Implementado em `media-engine/`) <!-- id: 40 -->
    - [x] Upload do artefato final para S3/R2 (Simulado no workflow) <!-- id: 41 -->

### 2.2. Distribution Engine
- [x] Criar Workflow E: Publicador YouTube (JSON Gerado) <!-- id: 42 -->
    - [x] Upload de vídeo via API <!-- id: 43 -->
    - [x] Geração de Título SEO e Tags via IA <!-- id: 44 -->
    - [x] Upload de Thumbnail customizada <!-- id: 45 -->
- [x] Criar Workflow F: Publicador Redes Sociais (JSON Gerado) <!-- id: 46 -->
    - [x] Adaptação para formato vertical (Shorts/Reels) <!-- id: 47 -->
    - [x] Publicação no Youtube Shorts <!-- id: 48 -->
    - [x] Publicação no TikTok/Instagram (via API ou ferramentas intermediárias) <!-- id: 49 -->

### 2.3. Portal de Vídeos
- [x] Redesign da Landing Page "Claymorphism" (Soft 3D / Floating) <!-- id: 50 -->
- [x] Integração com Player de Vídeo (Visual) <!-- id: 51 -->
- [x] Páginas de Categoria e Busca (Mockadas) <!-- id: 52 -->
- [x] SEO para Vídeo (Schema markup inicial) <!-- id: 53 -->

## Fase 3: Escala e Produtos Premium (Mês 5-6) [/]
**Objetivo**: Aumentar volume, introduzir novos formatos e monetização.

### 3.1. Engine de Engajamento
- [x] Workflow G: Notificações Push/WhatsApp (Twilio/WPP) (JSON Gerado) <!-- id: 54 -->
    - [x] Alerta de vídeo novo para inscritos <!-- id: 55 -->
- [/] Sistema de Legendagem Personalizada (Burn-in via FFmpeg) (Em andamento) <!-- id: 56 -->

### 3.2. Monetização e Escala
- [x] Implementação de Planos Premium (Stripe) (Backend Pronto) <!-- id: 57 -->
    - [x] Conteúdo exclusivo / Acesso antecipado (Mock UI) <!-- id: 58 -->
- [x] Integração de Ads no Portal de Vídeos (Placeholders) <!-- id: 59 -->
- [x] Analytics Avançado (Página Gerada) <!-- id: 60 -->
- [/] Monitoramento de Custos de API em Tempo Real (Iniciando) <!-- id: 61 -->
- [x] Sistema de Alertas de Falha nos Workflows n8n (JSON Gerado) <!-- id: 62 -->

## Phase 4: Admin Dashboard & Content Management
**Objetivo**: Interface administrativa para gestão de conteúdo e anúncios.

### 4.1. Database & Backend
- [ ] Criar Tabela `ads` no Supabase <!-- id: 63 -->
- [ ] Configurar Policies RLS (Admin Write / Public Read) <!-- id: 64 -->
- [ ] Instalar `@supabase/supabase-js` no `control-tower` <!-- id: 65 -->
- [ ] Criar cliente Supabase em `lib/supabase.ts` <!-- id: 66 -->

### 4.2. Admin UI (Anúncios)
- [ ] Criar Página de Listagem de Anúncios (`/dashboard/ads`) <!-- id: 67 -->
- [ ] Criar Formulário de Criação/Edição de Anúncios <!-- id: 68 -->
- [ ] Adicionar Item "Anúncios" no Menu Lateral <!-- id: 69 -->

### 4.3. Video Portal Integration
- [ ] Refatorar `components/ads.tsx` para buscar do Supabase <!-- id: 70 -->

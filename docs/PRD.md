# Documento de Requisitos do Produto (PRD) - TV Facebrasil

OBJETIVO PRINCIPAL DO PROJETO: TRANSFORMAR ARTIGOS DA REVISTA FACEBRASIL EM VIDEOS E PUBLICA-LOS AUTOMATICAMENTE NO CANAL DO YOUTUBE E NAS REDES SOCIAIS

## 1. Visão Geral
O projeto **TV Facebrasil** visa transformar o acervo de 16 anos de jornalismo comunitário da Facebrasil em uma experiência audiovisual dinâmica e multicanal. O objetivo é criar uma "fábrica de conteúdo" automatizada que converte artigos de texto em vídeos informativos (mini-documentários, bancadas de notícias, shorts) utilizando Inteligência Artificial, mantendo a autoridade e a conexão emocional com a comunidade brasileira nos EUA.

## 2. Tecnologias e Habilidades (Skills)
Este projeto utilizará um conjunto específico de competências e frameworks para garantir qualidade de produção e eficiência operacional.

### Skills Principais
*   **`workflow-automation`**: Automação de todos os fluxos de trabalho backend utilizando **n8n**. A orquestração dos serviços de IA, banco de dados e publicação será feita através de workflows visuais e robustos no n8n, garantindo observabilidade e tratamento de erros.
*   **`frontend-design`**: Criação de interfaces (Dashboard Administrativo "Control Tower" e Portal de Vídeos) com estética distinta e profissional, fugindo do design genérico. Foco em tipografia marcante, layouts inteligentes e micro-interações que elevam a percepção de valor da marca.
*   **`ui-ux-pro-max`**: Garantia de usabilidade e acessibilidade. Aplicação de regras rigorosas para contraste, hierarquia visual, feedback de interação e design responsivo, assegurando que tanto os operadores do sistema quanto os espectadores tenham a melhor experiência possível.

### Skills Complementares Recomendadas
*   **`ai-agents-architect`**: Design dos agentes autônomos dentro do n8n (ex: Agente Roteirista, Agente de Curadoria). Aplicação de padrões como "ReAct" ou loops de reflexão para garantir que os roteiros gerados pela IA sejam de alta qualidade antes de passarem para a produção de vídeo.
*   **`web-performance-optimization`**: Essencial para o portal de vídeos e para o carregamento rápido dos assets no player proprietário.

## 3. Arquitetura da Solução
A solução seguirá uma arquitetura horizontalizada dividida em 4 motores principais, orquestrados por uma "Control Tower".

**Stack Tecnológico:**
*   **Orquestração**: n8n (Self-hosted ou Cloud).
*   **Backend/API**: Python (FastAPI) ou Node.js (integrado via n8n).
*   **Frontend**: React / Next.js com Tailwind CSS (para Portal e Dashboard).
*   **Banco de Dados**: PostgreSQL (Metadados, Usuários) + Vector DB (para busca semântica de artigos).
*   **IA & Serviços**: OpenAI/Claude (Texto), ElevenLabs (Voz), HeyGen/Synthesia (Avatar), Remotion (Motion Graphics).

## 4. Etapas do Projeto e Entregáveis

### Fase 1: Fundação e MVP (Mês 1-2)
**Objetivo**: Validar o fluxo completo de um único artigo até um vídeo finalizado e publicado manualmente.

*   **1.1. Configuração do Ambiente n8n**
    *   Setup do servidor n8n.
    *   Configuração de credenciais (OpenAI, ElevenLabs, HeyGen, Youtube, WP).
    *   Criação da estrutura de banco de dados para rastreio de status (tabela `videos`, `jobs`).

*   **1.2. Desenvolvimento do Intake Engine (Editor Chefe)**
    *   **Workflow A**: Webhook de Entrada em Lote (recebe lista de 5 artigos).
    *   **Workflow B**: Editor Chefe AI (Analisa cada artigo e define se o destino é **Short (1-3 min)** ou **Doc (10 min)**).
    *   **Entregável**: Pipeline que popula a Fila de Produção já com a recomendação de formato do "Editor Chefe".

*   **1.3. Desenvolvimento do Processing Engine (n8n + IA)**
    *   **Workflow C**: Gerador de Roteiros. Agente IA que recebe o texto e transforma em roteiro estruturado (Hook, Intro, Desenvolvimento, CTA).
    *   **Workflow D**: Revisor de Roteiros. Agente IA que critica e refina o roteiro (ex: "Tom muito formal", "Falta CTA").
    *   **Entregável**: Roteiros prontos para aprovação humana ou produção automática.

*   **1.4. Prototipagem da Control Tower (Frontend)**
    *   Design da interface de administração (Lista de artigos, aprovação de roteiros).
    *   Implementação básica em Next.js/React conectada ao banco de dados.

### Fase 2: Produção e Distribuição (Mês 3-4)
**Objetivo**: Automatizar a geração de vídeo e a publicação multicanal.

*   **2.1. Production Engine (Video Generation)**
    *   Integração com API de Avatar (HeyGen/Synthesia) via n8n.
    *   Integração com API de Voz (ElevenLabs).
    *   Pipeline de montagem (FFmpeg ou Remotion render) disparado pelo n8n.
    *   **Entregável**: Arquivo `.mp4` gerado e salvo no Storage (S3/R2).

*   **2.2. Distribution Engine (n8n)**
    *   **Workflow E**: Publicador YouTube (Upload, Thumbnail, Título SEO, Tags).
    *   **Workflow F**: Publicador Redes Sociais (Shorts para Instagram/TikTok/Youtube Shorts).
    *   **Entregável**: Vídeos publicados automaticamente após aprovação na Control Tower.

*   **2.3. Portal de Vídeos (Frontend)**
    *   Desenvolvimento do site "TV Facebrasil" com player proprietário ou embed.
    *   Implementação de categorias (Notícias, Imigração, Entrevistas).
    *   Aplicação de SEO para vídeo.

### Fase 3: Escala e Produtos Premium (Mês 5-6)
**Objetivo**: Aumentar volume, introduzir novos formatos e monetização.

*   **3.1. Otimização de Formatos**
    *   Modelos para "FB News Daily" (Bancada) vs "Mini-Doc".
    *   Automação de Shorts verticais (corte inteligente do vídeo horizontal).

*   **3.2. Implementação do Modelo de Receita**
    *   Inserção dinâmica de anúncios (Mid-roll) na edição.
    *   Área de membros (FB Academy) no portal.

*   **3.3. Refinamento da Control Tower**
    *   Analytics unificado (Views do YouTube, Site, Sociais em um único dashboard).
    *   Gestão de falhas e retentativas (Error handling avançado no n8n).

## 5. Detalhamento dos Workflows (n8n)

### Workflow: Intake & Scoring
1.  **Trigger**: Webhook (Novo Post WP) ou Cron (A cada 4h).
2.  **Action**: Ler conteúdo do artigo.
3.  **Agent (AI)**: "Article Analyzer".
    *   Input: Texto do artigo.
    *   Prompt: Analisar sentimento, extrair entidades, verificar atualidade.
    *   Output: JSON `{score: 0-10, recommended_format: 'news|doc', reasoning: '...'}`.
4.  **Action**: Salvar no BD.
5.  **Logic**: Se `score > 8`, disparar notificação ou iniciar produção imediata.

### Workflow: Scriptwriter Agent
1.  **Trigger**: Novo item na fila "Ready for Script".
2.  **Agent (AI)**: "Role: Roteirista Sênior".
    *   Task: Converter notícia em roteiro de TV.
    *   Constraints: Linguagem falada, frases curtas, marcação visual `[CÂMERA 1]`, `[B-ROLL: IMAGEM DE DÓLAR]`.
3.  **Action**: Gerar Prompt de Imagem (para B-Rolls) baseado no roteiro.
4.  **Action**: Salvar Roteiro e Prompts no BD.

### Workflow: Media Assembly
1.  **Trigger**: Roteiro Aprovado.
2.  **Parallel Execution**:
    *   Branch A: Gerar Áudio (TTS ElevenLabs).
    *   Branch B: Gerar Vídeo Avatar (HeyGen).
    *   Branch C: Buscar/Gerar B-Rolls (Stock footage API ou AI Image Gen).
3.  **Action**: Unificar assets.
4.  **Code**: Renderizar vídeo final (usando serviço de render ou script Python acionado via n8n).
5.  **Output**: URL do vídeo final.

## 6. Requisitos de Frontend (Control Tower)
*   **Tech**: React, Tailwind, Shadcn/UI (conforme `ui-ux-pro-max`).
*   **Features**:
    *   **Kanban de Produção**: Colunas (Intake, Scripting, Rendering, Review, Published).
    *   **Editor de Roteiro**: Interface para humano ajustar o texto gerado pela IA antes da renderização.
    *   **Player de Review**: Assistir o vídeo gerado e clicar em "Aprovar" ou solicitar ajustes.
    *   **Dashboard de Métricas**: Gráficos de erro do n8n, custos de API, engajamento dos vídeos.

## 7. Critérios de Sucesso
*   **Automação**: 90% do processo deve ocorrer sem intervenção humana (apenas revisão final).
*   **Qualidade**: O tempo de retenção dos vídeos deve superar 40%.
*   **Custo**: O custo de produção por minuto de vídeo deve ser monitorado e otimizado (uso eficiente de tokens e APIs de vídeo).

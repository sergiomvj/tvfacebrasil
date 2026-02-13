# Sprint Final: Video Portal (TV Facebrasil)

Este documento detalha **tudo** que falta implementar no **Video Portal** para que ele cumpra seu papel de plataforma primária de consumo de conteúdo da TV Facebrasil, conforme definido nos documentos `Conceito.md` e `PRD.md`.

## 1. Visão Geral
O **Video Portal** é a "Netflix da Facebrasil". Ele deve oferecer uma experiência premium, focada no consumo de vídeo, com navegação intuitiva por categorias e forte apelo visual.

## 2. Página Inicial (Home) - Implementação da "Vitrine"
A Home deve ser dinâmica e visualmente rica.

- [ ] **Hero Section (Carrossel)**
    - Destaque para vídeos mais recentes ou "Featured".
    - Autoplay de preview (mudo) ao passar o mouse.
- [ ] **Seções de Categorias (Trilhos)**
    - "Últimas Notícias"
    - "Imigração & Legal"
    - "Entrevistas Exclusivas"
    - "Séries Originais"
- [ ] **Design Responsivo**
    - Garantir que funcione perfeitamente em Mobile (app-like experience).

## 3. Player de Vídeo Proprietário
A experiência principal do usuário.

- [ ] **Página de Vídeo (`/video/[slug]`)**
    - Player HTML5 customizado (ou integração com player robusto como Video.js / Plyr).
    - Suporte a legendas (CC).
    - Controle de qualidade (1080p, 720p - se houver transcodificação).
- [ ] **Interatividade**
    - Seção de "Comentários" (integrado com Auth/Clerk ou Disqus/sistema próprio).
    - Botões de Share (WhatsApp, Facebook, LinkedIn).
    - Botão de "Salvar para depois" (Watch Later).
- [ ] **Recomendação (Up Next)**
    - Sidebar ou lista abaixo do player com vídeos relacionados (baseado em tags ou categoria).

## 4. Navegação e SEO
Para garantir descoberta orgânica e facilidade de uso.

- [ ] **Categorias (`/category/[slug]`)**
    - Páginas dedicadas para cada tópico (ex: `/category/imigracao`).
    - Filtros por data, popularidade.
- [ ] **Busca Global**
    - Barra de busca no header.
    - Implementar busca semântica (se possível com Vector DB) ou full-text search no Supabase.
- [ ] **SEO Técnico**
    - Implementar `Next.js Metadata API` em todas as páginas dinâmicas.
    - Dados estruturados (`VideoObject`) para Google Search.
    - Open Graph tags para compartilhamento rico (imagem do thumbnail playável).

## 5. Monetização e Fidelidade
Implementar as features que sustentam o modelo de negócio.

- [ ] **Área de Membros (FB Academy / Premium)**
    - Integração com Stripe (Checkout e Portal do Cliente).
    - Bloqueio de conteúdo exclusivo (apenas para assinantes).
    - Login/Cadastro unificado com o Control Tower (Clerk).
- [ ] **Anúncios (Client-Side)**
    - Espaços para banners (Display Ads).
    - Integração para pre-roll ou mid-roll (se usando player customizado).

## 6. Performance (Core Web Vitals)
- [ ] **Otimização de Imagens**
    - Uso de `next/image` para todos os thumbnails.
- [ ] **Lazy Loading**
    - Carregar trilhos de vídeo abaixo da dobra sob demanda.
- [ ] **CDN de Vídeo**
    - Garantir que os vídeos sejam servidos via CDN (Cloudflare R2 ou similar) para baixa latência.

## 7. Workflow Detalhado: Ciclo de Vida do Conteúdo (Visão do Usuário)
Este fluxo descreve como o conteúdo transformado impacta a experiência final no portal.

### Passo 1: Publicação e Ingestão
*   **Gatilho**: O Control Tower marca o vídeo como `Published`.
*   **Impacto**: O vídeo torna-se acessível via URL pública e entra no índice de busca do portal.

### Passo 2: Descoberta (Homepage & Categorias)
*   **Impacto Visual**:
    *   **Carrossel (`Hero`)**: Se for marcado como "Destaque", aparece no topo com autoplay.
    *   **Trilhos (`Rails`)**: Aparece automaticamente na primeira posição do trilho de sua categoria (ex: "Notícias").
    *   **"Recentes"**: Entra na lista geral de novidades.

### Passo 3: Consumo (Página de Vídeo)
*   **Experiência**:
    *   O usuário acessa `/video/[slug]`.
    *   O player carrega o vídeo otimizado (CDN).
    *   Metadados (Título, Descrição) são renderizados para SEO.
    *   Relacionados na barra lateral sugerem o próximo vídeo para manter engajamento.

### Passo 4: Engajamento Social
*   **Ação do Usuário**:
    *   Pode comentar (integrado ao Auth).
    *   Pode compartilhar no WhatsApp (link com imagem de preview correta).
    *   Pode salvar em "Minha Lista" (função de bookmarks).

## Checklist de Arquivos a Criar/Modificar
- `app/(public)/video/[slug]/page.tsx` (Página de Vídeo Principal)
- `app/(public)/category/[slug]/page.tsx` (Página de Categoria)
- `app/(public)/search/page.tsx` (Página de Resultados de Busca)
- `components/video-player/Player.tsx`
- `components/home/CategoryRail.tsx`
- `components/shared/Header.tsx` (Com busca e login)
- `lib/seo.ts` (Helpers para metadados)

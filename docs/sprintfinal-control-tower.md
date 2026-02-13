# Sprint Final: Control Tower (Dashboard Administrativo)

Este documento detalha **tudo** que precisa ser implementado no **Control Tower** para que ele cumpra seu papel de orquestrador central da "fábrica de conteúdo" da TV Facebrasil, conforme definido nos documentos `Conceito.md` e `PRD.md`.

## 1. Visão Geral
O **Control Tower** é o cérebro da operação. Ele não gera o vídeo (quem faz isso é o n8n/AI), mas é onde os humanos gerenciam, aprovam e monitoram o fluxo. O objetivo final é permitir que uma equipe enxuta gerencie centenas de vídeos mensais.

## 2. Implementação do "Kanban de Produção" (Prioridade Alta)
A funcionalidade principal é visualizar o status de cada artigo/vídeo no pipeline e permitir intervenção humana.

- [ ] **Integração com Banco de Dados de Jobs/Vídeos**
    - Conectar com a tabela `videos` (ou `jobs`) no Supabase.
    - Ler estados: `Intake`, `Scripting`, `Rendering`, `Review`, `Published`, `Error`.
- [ ] **Interface de Kanban (Board)**
    - Criar colunas visuais para cada estado.
    - Cards devem mostrar: Título do Artigo, Data, Score AI, e Status atual.
    - *Sugestão*: Usar biblioteca `dnd-kit` ou similar se houver drag-and-drop, ou apenas listas visuais se for transição automática via n8n.
- [ ] **Tratamento de Erros**
    - Cards em estado de `Error` devem ter destaque (vermelho).
    - Botão de "Retry" que dispara webhook para o n8n tentar novamente.

## 3. Editor de Roteiro (Human-in-the-loop)
Antes de gerar o vídeo, o roteiro criado pela IA precisa de aprovação ou ajuste.

- [ ] **Página de Detalhe do Job (Fase Scripting)**
    - Exibir o texto original do artigo (lado esquerdo).
    - Exibir o roteiro gerado pela IA (lado direito) em formato editável.
    - Campos do Roteiro: `Hook`, `Intro`, `Corpo`, `CTA`.
- [ ] **Funcionalidade de Edição**
    - Permitir edição de texto rico ou blocos.
    - Permitir ajustar prompts visuais (ex: `[B-ROLL: Drone view of Miami]`).
- [ ] **Ações de Aprovação**
    - Botão "Aprovar Roteiro": Salva alterações no Supabase e dispara webhook para fase de `Rendering` (Audio/Video).
    - Botão "Regenerar": Solicita ao n8n uma nova versão do roteiro.

## 4. Player de Review (Controle de Qualidade)
A etapa final antes da publicação.

- [ ] **Página de Review (Fase Review)**
    - Player de vídeo nativo HTML5 para reproduzir o `.mp4` gerado (hospedado no R2/S3).
    - Exibir metadados gerados: Título otimizado, Descrição, Tags, Thumbnail.
- [ ] **Ações de Publicação**
    - Botão "Aprovar e Publicar": Dispara webhook de distribuição (YouTube/Redes Sociais).
    - Botão "Rejeitar/Refazer": Permite enviar feedback (ex: "Áudio desincronizado") e voltar para fase de `Rendering` ou `Scripting`.

## 5. Dashboard de Métricas (Analytics)
Para gestão estratégica da operação.

- [ ] **Overview** (Usando `recharts`)
    - Gráfico: Vídeos Produzidos vs Publicados (Semanal/Mensal).
    - Card: Custo estimado de API (OpenAI + ElevenLabs + HeyGen).
    - Card: Tempo médio de produção (Artigo -> Vídeo).
- [ ] **Performance de Conteúdo** (Integração Futura)
    - Tabela com Top Vídeos por Views (consolidado do YouTube/Site).

## 6. Gestão de Anúncios (Monetização)
Infraestrutura para inserir ads nos vídeos.

- [ ] **CRUD de Anunciantes**
    - Cadastro de empresas parceiras.
    - Upload de assets (Logos, Vídeos de 15s para mid-roll).
- [ ] **Associação**
    - Permitir definir regras (ex: "Inserir Ad da Florida Blue em todos os vídeos de Saúde").

## 7. Configurações e Sistema
- [ ] **Gestão de Usuários (Clerk)** (Já instalado, verificar roles)
    - Roles: `Admin` (Acesso total), `Editor` (Aprova roteiros/vídeos), `Viewer` (Só visualiza).
- [ ] **Configuração de API Keys**
    - Interface segura para atualizar chaves de API do n8n ou serviços externos (opcional, pode ser via .env, mas UI ajuda).

## 8. Workflow Detalhado: Do Artigo ao Vídeo (Visão do Admin)
Este fluxo descreve o passo a passo da operação dentro do Control Tower.

### Passo 1: Ingestão (Intake)
*   **Ação do Sistema**: O n8n monitora novos artigos no WordPress/Site e cria um registro no Supabase com status `Intake`.
*   **Visualização no Dashboard**: O artigo aparece na primeira coluna do Kanban ("Novos").
*   **Ação do Admin**: Nenhuma ação imediata necessária, a menos que queira priorizar ou cancelar um job.

### Passo 2: Roteirização (Scripting) - *Human-in-the-Loop*
*   **Ação do Sistema**: Agente de IA gera o roteiro. Status muda para `Scripting` (ou `Ready for Approval`).
*   **Visualização**: Card move para a coluna "Aprovação de Roteiro".
*   **Ação do Admin**:
    1.  Clica no card para abrir o **Editor de Roteiro**.
    2.  Lê o roteiro gerado ao lado do artigo original.
    3.  Faz ajustes finos (tom de voz, correção de dados).
    4.  Clica em **"Aprovar Roteiro"**.

### Passo 3: Produção (Rendering)
*   **Ação do Sistema**: Ao aprovar, o status muda para `Rendering`. O n8n inicia a geração de áudio e vídeo (ElevenLabs/HeyGen).
*   **Visualização**: Card na coluna "Processando" (com indicador de loading se possível).
*   **Ação do Admin**: Monitorar. Se der erro, o card fica vermelho e permite "Retry".

### Passo 4: Revisão Final (Review)
*   **Ação do Sistema**: Vídeo pronto é salvo no Storage. Status muda para `Review`.
*   **Visualização**: Card na coluna "Revisão Final".
*   **Ação do Admin**:
    1.  Clica no card para abrir o **Player de Review**.
    2.  Assiste ao vídeo completo.
    3.  Verifica título, descrição e thumbnail geradas.
    4.  Clica em **"Publicar"** (ou "Rejeitar" para refazer).

### Passo 5: Distribuição (Published)
*   **Ação do Sistema**: Dispara upload para YouTube e atualiza status para `Published`.
*   **Visualização**: Card move para coluna "Publicados" (histórico).
*   **Ação do Admin**: Pode clicar para ver o link do vídeo ao vivo.

## Checklist de Arquivos a Criar/Modificar
- `app/dashboard/production/page.tsx` (Kanban)
- `app/dashboard/editor/[id]/page.tsx` (Editor de Roteiro)
- `app/dashboard/review/[id]/page.tsx` (Player de Review)
- `components/kanban/Board.tsx`
- `components/script-editor/ScriptEditor.tsx`
- `services/supabase.ts` (Garantir funções tipadas para buscar jobs)

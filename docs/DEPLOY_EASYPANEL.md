# 🚀 Guia de Deploy - TV Facebrasil (Monorepo) no Easypanel

Este projeto agora é um **Monorepo**. Isso significa que ambos os projetos (`control-tower` e `video-portal`) estão no mesmo repositório do GitHub.

Para fazer o deploy no Easypanel, você precisará criar **2 Serviços de Aplicação (App Services)** separados.

---

## 1. Configuração do GitHub
Conecte sua conta do GitHub ao Easypanel (Project Settings -> GitHub).

---

## 2. Serviço 1: Control Tower (Admin)

### ⚙️ Configurações de Build (Build Source)
- **Source**: GitHub
- **Repository**: `sergiomvj/tvfacebrasil`
- **Branch**: `main`
- **Build Type**: Dockerfile
- **Build Context**: `/control-tower`  <-- **MUITO IMPORTANTE**
- **Dockerfule Path**: `/Dockerfile` (ou deixe vazio se usar o padrão)

### 🌐 Configurações de Domínio
- **Domain**: `admin.tvfacebrasil.com`
- **Port**: `3000`

### 🔑 Variáveis de Ambiente (Environment)
Adicione estas chaves na aba "Environment". Elas são necessárias para o build e runtime.

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Outros
SEO_API_URL=http://seo.fbrapps.com:8000
SEO_API_KEY=sk_live_...
NODE_ENV=production
```

---

## 3. Serviço 2: Video Portal (Site Público)

### ⚙️ Configurações de Build (Build Source)
- **Source**: GitHub
- **Repository**: `sergiomvj/tvfacebrasil`
- **Branch**: `main`
- **Build Type**: Dockerfile
- **Build Context**: `/video-portal`  <-- **MUITO IMPORTANTE**
- **Dockerfule Path**: `/Dockerfile` (ou deixe vazio se usar o padrão)

### 🌐 Configurações de Domínio
- **Domain**: `tvfacebrasil.com`
- **Port**: `3000`

### 🔑 Variáveis de Ambiente (Environment)
Adicione estas chaves na aba "Environment".

```env
# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Outros
SEO_API_URL=http://seo.fbrapps.com:8000
SEO_API_KEY=sk_live_...
NEXT_PUBLIC_APP_URL=https://tvfacebrasil.com
NODE_ENV=production
```

---

## ⚠️ Detalhes Cruciais

1.  **Build Context / Root Directory**: O campo "Build Context" (às vezes chamado de "Root Directory" no menu do Easypanel) é o segredo. Ele diz ao Docker para iniciar o build **dentro** da pasta do serviço (`/control-tower` ou `/video-portal`). Se você não configurar isso, o build vai falhar procurando o `package.json`.

2.  **Environment Variables**: O Next.js "queima" (bakes in) as variáveis `NEXT_PUBLIC_` durante o build. Por isso, se você mudar uma variável `NEXT_PUBLIC_` no Easypanel, você precisa clicar em **"Rebuild"** (Recriar), e não apenas "Deploy" ou "Restart".

3.  **Porta 3000**: Ambos os Dockerfiles expõem a porta 3000 internamente. O Easypanel vai mapear isso para a porta 80/443 do seu domínio automaticamente se a porta estiver correta na configuração do App Service.

# 🚀 Guia de Deploy - TV Facebrasil (Versão Unificada)

O sistema foi unificado! Agora temos **apenas um projeto** que contem tanto o site público quanto o painel administrativo.

- **Site Público**: `https://tvfacebrasil.com`
- **Admin**: `https://tvfacebrasil.com/admin` (ou um subdomínio apontando para a mesma rota)

---

## 🏗️ Configuração no Easypanel

Você precisará de **apenas 1 Serviço de Aplicação**.

### ⚙️ Configurações de Build (Build Source)
- **Source**: GitHub
- **Repository**: `sergiomvj/tvfacebrasil`
- **Branch**: `main`
- **Build Type**: Dockerfile
- **Build Context**: `/video-portal`  <-- **IMPORTANTE**
- **Dockerfule Path**: `/Dockerfile`

### 🌐 Domínios
Configure seus domínios no mesmo serviço:

1. `tvfacebrasil.com` -> Porta 3000
2. `www.tvfacebrasil.com` -> Porta 3000
3. `admin.tvfacebrasil.com` -> Porta 3000 (Opcional, se quiser redirecionar)

### 🔑 Variáveis de Ambiente (Environment)

Copie o conteúdo de `video-portal/.env` e cole na aba de Environment do Easypanel.

> **Nota:** Certifique-se de incluir tanto as chaves do site público (Stripe, Supabase, SEO) quanto as chaves do Admin (Clerk, etc).

```env
# Exemplo Essencial
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Auth (Admin)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Pagamentos
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...

# APIs
SEO_API_URL=...
SEO_API_KEY=...
```

---

## 🛠️ O que mudou?

1.  **Pasta `control-tower` removida**: O código do admin agora vive em `video-portal/app/admin`.
2.  **Layout Compartilhado**: O projeto usa um único `package.json` e `Dockerfile`.
3.  **Rotas**:
    - `/` -> Site Público
    - `/admin` -> Painel de Controle (Protegido por Clerk)

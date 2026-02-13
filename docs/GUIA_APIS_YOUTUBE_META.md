# GUIA: YouTube Data API v3 + Meta APIs
# TV Facebrasil - Configuração Completa

## ============================================
## PARTE 1: YOUTUBE DATA API v3 (ESSENCIAL!)
## ============================================

### O que você tem atualmente:
✅ YouTube Analytics API (só métricas)
✅ YouTube Reporting API (só relatórios)
❌ YouTube Data API v3 (UPLOAD - FALTANDO!)

### Como criar:

#### Passo 1: Acessar Google Cloud Console
1. Vá para: https://console.cloud.google.com/apis/credentials
2. Selecione o projeto "project-dab7f50c-f056-4215-84a"

#### Passo 2: Habilitar a API
1. Clique em "Enable APIs and Services"
2. Procure por "YouTube Data API v3"
3. Clique "Enable"

#### Passo 3: Criar Credencial OAuth
1. Vá para "Credentials" → "Create Credentials" → "OAuth client ID"
2. Application type: "Web application"
3. Name: "TV Facebrasil Web"
4. Authorized redirect URIs:
   - http://localhost:3000/api/auth/youtube/callback
   - https://tvfacebrasil.com/api/auth/youtube/callback
5. Clique "Create"
6. Copie o **Client ID** e **Client Secret**

#### Passo 4: Configurar .env.local
```bash
YOUTUBE_DATA_CLIENT_ID=seu-novo-client-id.apps.googleusercontent.com
YOUTUBE_DATA_CLIENT_SECRET=seu-novo-client-secret
```

---

## ============================================
## PARTE 2: META APIs (Facebook/Instagram)
## ============================================

### URLs:
- Developers: https://developers.facebook.com
- Graph API Explorer: https://developers.facebook.com/tools/explorer

### APIs necessárias:

#### Opção A: Instagram Graph API (Recomendado)
- Publicar posts no feed
- Publicar stories
- Publicar reels

#### Opção B: Facebook Graph API
- Publicar no perfil/página
- Publicar vídeos

### Como criar:

#### Passo 1: Criar App
1. Acesse: https://developers.facebook.com/apps/
2. Clique "Create App"
3. Selecione "Business" → "Business"
4. Nome: "TV Facebrasil"
5. Email de contato: seu-email
6. Clique "Create App"

#### Passo 2: Adicionar Produtos
1. No dashboard do app, clique "Add Product"
2. Procure e adicione:
   - "Instagram Graph API"
   - "Facebook Graph API" (opcional)

#### Passo 3: Configurar Permissões
1. Vá para "App Review" → "Permissions and Features"
2. Solicite as permissões:
   - `instagram_basic` (obrigatório)
   - `instagram_content_publish` (obrigatório)
   - `pages_read_engagement` (para páginas)
   - `publish_video` (para vídeos)

#### Passo 4: Configurar OAuth
1. Vá para "Settings" → "Basic"
2. Adicione "Website" URL: https://tvfacebrasil.com
3. Salve

#### Passo 5: Obter Credenciais
1. App ID: mostrado em Settings → Basic
2. App Secret: clique "Show" para revelar

#### Passo 6: Gerar Access Token
1. Vá para: https://developers.facebook.com/tools/explorer
2. Selecione seu app "TV Facebrasil"
3. Selecione permissões:
   - instagram_basic
   - instagram_content_publish
4. Clique "Generate Access Token"
5. Copie o token (começa com EAA...)

#### Passo 7: Configurar .env.local
```bash
# Meta/Facebook
META_APP_ID=seu-app-id
META_APP_SECRET=seu-app-secret
META_ACCESS_TOKEN=EAA... (token gerado no explorer)

# Instagram Business Account ID (obter via API)
INSTAGRAM_BUSINESS_ACCOUNT_ID=seu-account-id
```

---

## ============================================
## PARTE 3: ONDE OBTER CADA CREDENCIAL
## ============================================

### Resumo de todas as credenciais necessárias:

| Serviço | Onde Obter | URL | Status |
|---------|------------|-----|--------|
| YouTube Analytics | Google Cloud Console | console.cloud.google.com | ✅ Temos |
| YouTube Reporting | Google Cloud Console | console.cloud.google.com | ✅ Temos |
| **YouTube Data API v3** | **Google Cloud Console** | **console.cloud.google.com** | ❌ **PENDENTE!** |
| Meta App ID | Facebook Developers | developers.facebook.com/apps | ❌ Pendente |
| Meta App Secret | Facebook Developers | developers.facebook.com/apps | ❌ Pendente |
| Meta Access Token | Graph API Explorer | developers.facebook.com/tools/explorer | ❌ Pendente |
| Instagram Account ID | API ou Business Manager | business.facebook.com | ❌ Pendente |

---

## ============================================
## PARTE 4: TESTAR CONEXÕES
## ============================================

### Testar YouTube:
```bash
# Acesse no navegador:
http://localhost:3000/api/auth/youtube

# Deve redirecionar para Google OAuth
# Após autorizar, redireciona de volta
```

### Testar Meta (Instagram):
```bash
# Usar Graph API Explorer:
https://developers.facebook.com/tools/explorer

# Query de teste:
GET /me/accounts
GET /{instagram-account-id}/media
```

---

## ⚠️ IMPORTANTE!

### YouTube Data API v3:
- **Quota limitada**: 10.000 unidades/dia
- Upload de vídeo: ~1600 unidades
- **~6 vídeos/dia no plano gratuito**
- Para mais: solicitar aumento de quota

### Meta Instagram:
- **Rate limits**: 200 chamadas/hora por usuário
- Vídeos devem ser < 1GB
- Formatos aceitos: MP4, MOV

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS:

1. **AGORA**: Criar YouTube Data API v3 no Google Cloud
2. **Depois**: Criar app no Facebook Developers
3. **Final**: Preencher .env.local e testar!

Quer que eu crie o código de integração com a Meta também? 🚀

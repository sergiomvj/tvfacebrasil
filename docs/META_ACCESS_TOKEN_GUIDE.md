# ============================================
# META ACCESS TOKEN - PASSO A PASSO
# TV Facebrasil
# ============================================

## ✅ Credenciais do App (JÁ TEMOS!)
```
META_APP_ID=882862487691544
META_APP_SECRET=3a45930ce0a55884555f64703aadf9c4
```

## ⏳ PASSO 1: Gerar Access Token

### 1. Acesse o Graph API Explorer:
https://developers.facebook.com/tools/explorer

### 2. Configure:
- **Facebook App**: Selecione "TV Facebrasil" (ID: 882862487691544)
- **User or Page**: Selecione "User Token"

### 3. Adicione permissões (clique "Add a Permission"):
```
instagram_basic
instagram_content_publish
instagram_manage_comments
instagram_manage_insights
pages_read_engagement
pages_manage_posts
public_profile
```

### 4. Clique "Generate Access Token"

### 5. Copie o token (começa com EAA...)

---

## ⏳ PASSO 2: Obter Instagram Business Account ID

### No Graph API Explorer, execute esta query:
```
GET /me/accounts
```

### Você verá algo assim:
```json
{
  "data": [
    {
      "id": "1234567890",  // ← PAGE ID
      "name": "TV Facebrasil",
      "access_token": "...",
      "instagram_business_account": {
        "id": "9876543210"  // ← INSTAGRAM BUSINESS ACCOUNT ID!
      }
    }
  ]
}
```

### Copie o `instagram_business_account.id`

---

## ⏳ PASSO 3: Adicionar ao .env.local

```bash
META_ACCESS_TOKEN=EAA... (cole o token aqui)
INSTAGRAM_BUSINESS_ACCOUNT_ID=9876543210 (cole o ID aqui)
```

---

## ⚠️ IMPORTANTE: Token de Longa Duração

O token gerado no Explorer dura apenas **1 hora**!

Para produção, troque por um token de longa duração (60 dias):

```bash
# Endpoint para trocar token
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=882862487691544&client_secret=3a45930ce0a55884555f64703aadf9c4&fb_exchange_token=EAA..."
```

---

## 🧪 TESTAR CONEXÃO

Depois de configurar, acesse:
```
/dashboard/settings
```

Deve aparecer "Conectado" no card do Instagram! 🎉

---

## 📝 NOTAS

- O Instagram Business Account deve estar vinculado a uma Página do Facebook
- A página deve ser "Business" ou "Creator"
- O usuário deve ser admin da página
- Em produção, use token de longa duração (60 dias)

---

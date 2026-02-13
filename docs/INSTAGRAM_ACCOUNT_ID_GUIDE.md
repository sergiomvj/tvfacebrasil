# Obter Instagram Business Account ID

## Passo 1: No Graph API Explorer
URL: https://developers.facebook.com/tools/explorer

## Passo 2: Configure:
- **App**: fabr-tv (ou TV Facebrasil)
- **User Token**: (já tem o token EAA...)

## Passo 3: Execute esta query:
```
GET /me/accounts
```

## Passo 4: Procure no resultado:
```json
{
  "data": [
    {
      "id": "1234567890",
      "name": "TV Facebrasil",
      "instagram_business_account": {
        "id": "9876543210"  ← COPIE ESTE ID!
      }
    }
  ]
}
```

## Passo 5: Adicione ao .env.local:
```
INSTAGRAM_BUSINESS_ACCOUNT_ID=9876543210
```

---

**Importante:** O token que você gerou dura apenas **1 hora**! Para produção, precisamos trocar por um token de longa duração (60 dias).

**Teste rápido:** Depois de adicionar o ID, acesse `/dashboard/settings` para verificar se está tudo conectado! ✅

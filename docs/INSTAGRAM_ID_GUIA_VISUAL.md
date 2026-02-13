# GUIA DETALHADO: Instagram Business Account ID
## Passo a passo com imagens

---

## 🎯 PASSO 1: Acesse o Graph API Explorer

**URL:** https://developers.facebook.com/tools/explorer

Você verá esta tela:

```
┌─────────────────────────────────────────────┐
│  Graph API Explorer                         │
├─────────────────────────────────────────────┤
│                                             │
│  [Token de acesso]                          │
│  [📋] EAAP... (seu token já aparece aqui)   │
│                                             │
│  [Generate Access Token]  ← NÃO CLIQUE!     │
│                                             │
├─────────────────────────────────────────────┤
│  App da Meta                                │
│  [fabr-tv ▼]          ← Já selecionado      │
├─────────────────────────────────────────────┤
│  Usuário ou Página                          │
│  [Obter token ▼]      ← CLIQUE AQUI!        │
│                                             │
│  ⚠️ Selecione: "Obter token de acesso       │
│     da Página" (não de usuário!)            │
└─────────────────────────────────────────────┘
```

---

## 🎯 PASSO 2: Selecione a Página

Depois de clicar em "Obter token de acesso da Página":

```
┌─────────────────────────────────────────────┐
│  Selecione uma página:                      │
├─────────────────────────────────────────────┤
│                                             │
│  ⚪ TV Facebrasil                           │
│     Tipo: Página comercial                  │
│                                             │
│  ⚪ Outra página...                          │
│                                             │
│  [Confirmar]                                │
└─────────────────────────────────────────────┘
```

**Selecione a página "TV Facebrasil"** (ou o nome da sua página)

---

## 🎯 PASSO 3: Adicione a Permissão

Clique em **"Adicionar uma permissão"**:

```
┌─────────────────────────────────────────────┐
│  Permissões disponíveis:                    │
├─────────────────────────────────────────────┤
│  ☑️ instagram_basic                         │
│  ☑️ instagram_content_publish               │
│  ☑️ pages_read_engagement                   │
│                                             │
│  [+ Adicionar permissões]                   │
└─────────────────────────────────────────────┘
```

Marque: `instagram_basic` e `instagram_content_publish`

---

## 🎯 PASSO 4: Execute a Query

Agora no campo de query (meio da tela):

```
┌─────────────────────────────────────────────┐
│  [GET ▼] [ /me/accounts                    ]│
│                                             │
│  [▼ JSON ▼]                                 │
│                                             │
│  {                                          │
│    "data": [                                │
│      {                                      │
│        "id": "123456789",                   │
│        "name": "TV Facebrasil",             │
│        "instagram_business_account": {      │
│          "id": "17841405309211830"  ← ID!   │
│        }                                    │
│      }                                      │
│    ]                                        │
│  }                                          │
└─────────────────────────────────────────────┘
```

**Clique em "Submit"** (botão azul)

---

## 🎯 PASSO 5: Encontre o ID

No resultado JSON, procure por:

```json
{
  "data": [
    {
      "id": "178414XXXXXX",           ← Page ID (NÃO É ESSE!)
      "name": "TV Facebrasil",
      "instagram_business_account": {
        "id": "178414YYYYYYYYY"       ← ✓ É ESSE! (Instagram ID)
      }
    }
  ]
}
```

**Copie o número dentro de `instagram_business_account.id`**

---

## ⚠️ PROBLEMAS COMUNS:

### ❌ "Não aparece instagram_business_account"
**Solução:** A página não está vinculada a um Instagram Business
- Vá no Facebook → Sua página → Configurações
- Vincule ao Instagram

### ❌ "A página não aparece na lista"
**Solução:** Você não é admin da página
- Peça para o dono te adicionar como admin

### ❌ "Token inválido"
**Solução:** Gere um novo token
- Token dura só 1 hora

---

## ✅ COPIADO? Agora adicione ao .env.local:

```bash
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841405309211830
```

(Substitua pelo número que você copiou)

---

## 🚀 TESTAR

Depois de salvar, acesse:
```
http://localhost:3000/dashboard/settings
```

Deve aparecer:
```
✅ Meta (Instagram) Conectado!
   App ID: 882862487691544
   Account: @tvfacebrasil
```

---

**Conseguiu encontrar? Me manda o ID!** 🎯

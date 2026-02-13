-- ============================================
-- USER INTEGRATIONS TABLE (YouTube, Meta, etc.)
-- ============================================

-- Tabela para armazenar tokens OAuth de integrações externas
CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Provedor da integração
  provider VARCHAR(50) NOT NULL, -- 'youtube', 'meta', 'google', etc.
  provider_account_id VARCHAR(255), -- ID da conta no provedor (opcional)
  
  -- Tokens OAuth
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Dados adicionais (JSON)
  metadata JSONB DEFAULT '{}',
  
  -- Scopes/permissões concedidas
  scope TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, provider)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_integrations_user ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_provider ON user_integrations(provider);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_user_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_integrations_updated_at ON user_integrations;
CREATE TRIGGER trigger_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_user_integrations_updated_at();

-- RLS Policies
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own integrations" ON user_integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integrations" ON user_integrations
  FOR ALL USING (auth.uid() = user_id);

COMMENT ON TABLE user_integrations IS 'Armazena tokens OAuth de integrações externas (YouTube, Meta, etc.)';

-- ============================================
-- YOUTUBE CHANNELS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS youtube_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Canal do YouTube
  channel_id VARCHAR(255) NOT NULL UNIQUE,
  channel_title VARCHAR(255) NOT NULL,
  channel_description TEXT,
  thumbnail_url TEXT,
  
  -- Proprietário (usuário que conectou)
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Estatísticas (atualizadas periodicamente)
  subscriber_count INTEGER DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  view_count BIGINT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_youtube_channels_user ON youtube_channels(user_id);
CREATE INDEX IF NOT EXISTS idx_youtube_channels_channel_id ON youtube_channels(channel_id);

-- Trigger
DROP TRIGGER IF EXISTS trigger_youtube_channels_updated_at ON youtube_channels;
CREATE TRIGGER trigger_youtube_channels_updated_at
  BEFORE UPDATE ON youtube_channels
  FOR EACH ROW
  EXECUTE FUNCTION update_user_integrations_updated_at();

-- RLS
ALTER TABLE youtube_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own channels" ON youtube_channels
  FOR SELECT USING (auth.uid() = user_id);

COMMENT ON TABLE youtube_channels IS 'Canais do YouTube conectados pelos usuários';

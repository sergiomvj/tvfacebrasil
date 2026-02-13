-- ============================================
-- CONTROL TOWER - SCHEMA COMPLETO
-- TV Facebrasil - Pipeline de Produção de Vídeos
-- ============================================

-- ============================================
-- 1. TABELA VIDEOS (Pipeline de Produção)
-- ============================================
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referência ao artigo original do FaceBrasil
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  article_title TEXT NOT NULL,
  article_slug TEXT NOT NULL,
  article_content TEXT,
  article_excerpt TEXT,
  article_category_id UUID REFERENCES categories(id),
  
  -- Status do pipeline
  status VARCHAR(50) NOT NULL DEFAULT 'intake' 
    CHECK (status IN ('intake', 'scripting', 'rendering', 'review', 'published', 'error', 'cancelled')),
  
  -- Dados do roteiro (Scripting)
  script_hook TEXT,
  script_intro TEXT,
  script_body TEXT,
  script_cta TEXT,
  script_full TEXT,
  script_approved BOOLEAN DEFAULT FALSE,
  script_approved_at TIMESTAMP WITH TIME ZONE,
  script_approved_by UUID REFERENCES profiles(id),
  
  -- Dados de produção (Rendering)
  audio_url TEXT,
  video_url TEXT,
  video_duration INTEGER, -- em segundos
  thumbnail_url TEXT,
  
  -- Metadados para publicação
  video_title TEXT,
  video_description TEXT,
  video_tags TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  
  -- Métricas e custos
  ai_cost_estimate DECIMAL(10,2),
  api_calls_count INTEGER DEFAULT 0,
  processing_time_seconds INTEGER,
  
  -- Retry e erro
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Publicação
  published_at TIMESTAMP WITH TIME ZONE,
  published_by UUID REFERENCES profiles(id),
  youtube_video_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Score AI (qualidade do artigo para vídeo)
  ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100)
);

-- ============================================
-- 2. TABELA VIDEO_LOGS (Histórico de mudanças)
-- ============================================
CREATE TABLE IF NOT EXISTS video_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  
  -- Quem fez a mudança
  user_id UUID REFERENCES profiles(id),
  user_name TEXT,
  
  -- Mudança
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  action VARCHAR(100) NOT NULL, -- 'created', 'status_changed', 'script_approved', 'published', etc
  
  -- Detalhes
  notes TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. TABELA ADVERTISERS (Gestão de Anunciantes)
-- ============================================
CREATE TABLE IF NOT EXISTS advertisers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados da empresa
  company_name TEXT NOT NULL,
  company_description TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Assets
  logo_url TEXT,
  website_url TEXT,
  
  -- Configurações de anúncio
  ad_type VARCHAR(50) CHECK (ad_type IN ('pre_roll', 'mid_roll', 'banner', 'sponsorship')),
  ad_video_url TEXT, -- Para pre-roll/mid-roll (15-30s)
  
  -- Status
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'inactive')),
  
  -- Regras de veiculação
  target_categories UUID[], -- Categorias onde o anúncio deve aparecer
  target_keywords TEXT[], -- Palavras-chave
  
  -- Métricas
  total_impressions INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. TABELA VIDEO_ADS (Associação vídeo-anunciante)
-- ============================================
CREATE TABLE IF NOT EXISTS video_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  advertiser_id UUID NOT NULL REFERENCES advertisers(id) ON DELETE CASCADE,
  
  -- Configuração do anúncio neste vídeo
  ad_position VARCHAR(50) CHECK (ad_position IN ('pre_roll', 'mid_roll', 'post_roll')),
  ad_timestamp INTEGER, -- Para mid-roll: momento em segundos
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Métricas
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_article_id ON videos(article_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(article_category_id);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_video_logs_video_id ON video_logs(video_id);
CREATE INDEX IF NOT EXISTS idx_video_logs_created_at ON video_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_advertisers_status ON advertisers(status);
CREATE INDEX IF NOT EXISTS idx_video_ads_video ON video_ads(video_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para atualizar updated_at em videos
CREATE OR REPLACE FUNCTION update_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_videos_updated_at ON videos;
CREATE TRIGGER trigger_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_videos_updated_at();

-- Trigger para atualizar updated_at em advertisers
CREATE OR REPLACE FUNCTION update_advertisers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_advertisers_updated_at ON advertisers;
CREATE TRIGGER trigger_advertisers_updated_at
  BEFORE UPDATE ON advertisers
  FOR EACH ROW
  EXECUTE FUNCTION update_advertisers_updated_at();

-- Trigger para log automático de mudanças de status
CREATE OR REPLACE FUNCTION log_video_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO video_logs (video_id, previous_status, new_status, action, notes, created_at)
    VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      'status_changed',
      'Status alterado de ' || OLD.status || ' para ' || NEW.status,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_video_status_log ON videos;
CREATE TRIGGER trigger_video_status_log
  AFTER UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION log_video_status_change();

-- ============================================
-- VIEWS (Dashboards)
-- ============================================

-- View: Métricas do pipeline
CREATE OR REPLACE VIEW v_pipeline_metrics AS
SELECT 
  status,
  COUNT(*) as count,
  AVG(ai_score) as avg_score
FROM videos
GROUP BY status;

-- View: Vídeos prontos para revisão
CREATE OR REPLACE VIEW v_videos_ready_for_review AS
SELECT 
  v.*,
  a.name as category_name,
  p.name as author_name
FROM videos v
LEFT JOIN categories a ON v.article_category_id = a.id
LEFT JOIN profiles p ON v.published_by = p.id
WHERE v.status = 'review'
ORDER BY v.created_at DESC;

-- View: Produção mensal
CREATE OR REPLACE VIEW v_monthly_production AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_videos,
  COUNT(*) FILTER (WHERE status = 'published') as published_videos,
  SUM(ai_cost_estimate) as total_cost
FROM videos
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_ads ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ver tudo
CREATE POLICY "Allow authenticated read" ON videos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read" ON video_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read" ON advertisers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política: Apenas admins podem modificar
CREATE POLICY "Allow admin write" ON videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admin write" ON video_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admin write" ON advertisers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

COMMENT ON TABLE videos IS 'Pipeline de produção de vídeos da TV Facebrasil';
COMMENT ON TABLE video_logs IS 'Histórico de mudanças no pipeline';
COMMENT ON TABLE advertisers IS 'Anunciantes e parceiros';
COMMENT ON TABLE video_ads IS 'Associação de anúncios aos vídeos';

-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enums for status tracking
CREATE TYPE video_status AS ENUM ('draft', 'scripting', 'ready_to_render', 'rendering', 'completed', 'published', 'error');
CREATE TYPE video_format AS ENUM ('news', 'doc', 'short');
CREATE TYPE job_status AS ENUM ('pending', 'running', 'completed', 'failed');

-- Articles table: Stores raw content from WordPress/RSS
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE, -- WP Post ID
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    content TEXT,
    summary TEXT,
    source TEXT DEFAULT 'wordpress',
    published_at TIMESTAMP WITH TIME ZONE,
    score FLOAT DEFAULT 0.0, -- AI calculated score for virality/urgency
    analysis_result JSONB, -- Full AI analysis (sentiment, entities, etc.)
    embedding VECTOR(1536), -- For semantic search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table: The core content unit
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id),
    title TEXT NOT NULL,
    description TEXT,
    status video_status DEFAULT 'draft',
    format video_format DEFAULT 'news',
    
    -- Scripting
    script_content JSONB, -- Structured script (blocks: hook, intro, etc.)
    script_version INT DEFAULT 1,
    
    -- Assets
    audio_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    
    -- Metadata
    duration_seconds INT,
    tags TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table: Tracking n8n workflow executions
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES videos(id),
    workflow_id TEXT NOT NULL, -- Logical name or ID of the n8n workflow
    status job_status DEFAULT 'pending',
    
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_articles_score ON articles(score DESC);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_jobs_video_id ON jobs(video_id);

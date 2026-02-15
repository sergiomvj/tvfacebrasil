-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  external_id text UNIQUE,
  title text NOT NULL,
  url text NOT NULL,
  content text,
  summary text,
  source text DEFAULT 'wordpress'::text,
  published_at timestamp with time zone,
  score double precision DEFAULT 0.0,
  analysis_result jsonb,
  embedding USER-DEFINED,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT articles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.drafts (
  id integer NOT NULL DEFAULT nextval('drafts_id_seq'::regclass),
  trend_id integer NOT NULL,
  type text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'draft'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT drafts_pkey PRIMARY KEY (id),
  CONSTRAINT drafts_trend_id_fkey FOREIGN KEY (trend_id) REFERENCES public.trends(id)
);
CREATE TABLE public.jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  video_id uuid,
  workflow_id text NOT NULL,
  status USER-DEFINED DEFAULT 'pending'::job_status,
  input_data jsonb,
  output_data jsonb,
  error_message text,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT jobs_pkey PRIMARY KEY (id),
  CONSTRAINT jobs_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id)
);
CREATE TABLE public.publications (
  id integer NOT NULL DEFAULT nextval('publications_id_seq'::regclass),
  name text NOT NULL,
  description text,
  keywords jsonb DEFAULT '[]'::jsonb,
  active_sources jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'active'::text,
  org_id text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT publications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sources (
  id integer NOT NULL DEFAULT nextval('sources_id_seq'::regclass),
  name text NOT NULL,
  type text NOT NULL,
  url text,
  config jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_scraped_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  publication_id integer,
  CONSTRAINT sources_pkey PRIMARY KEY (id),
  CONSTRAINT sources_publication_id_publications_id_fk FOREIGN KEY (publication_id) REFERENCES public.publications(id)
);
CREATE TABLE public.trend_snapshots (
  id integer NOT NULL DEFAULT nextval('trend_snapshots_id_seq'::regclass),
  trend_id integer NOT NULL,
  score integer,
  volume integer,
  snapshot_at timestamp without time zone DEFAULT now(),
  CONSTRAINT trend_snapshots_pkey PRIMARY KEY (id),
  CONSTRAINT trend_snapshots_trend_id_trends_id_fk FOREIGN KEY (trend_id) REFERENCES public.trends(id)
);
CREATE TABLE public.trends (
  id integer NOT NULL DEFAULT nextval('trends_id_seq'::regclass),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  score integer DEFAULT 0,
  volume integer DEFAULT 0,
  category text DEFAULT 'General'::text,
  source_id integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  first_seen_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  publication_id integer,
  growth integer,
  sentiment text,
  why_trending text,
  is_viral boolean DEFAULT false,
  CONSTRAINT trends_pkey PRIMARY KEY (id),
  CONSTRAINT trends_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(id),
  CONSTRAINT trends_publication_id_publications_id_fk FOREIGN KEY (publication_id) REFERENCES public.publications(id)
);
CREATE TABLE public.videos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  article_id uuid,
  title text NOT NULL,
  description text,
  status USER-DEFINED DEFAULT 'draft'::video_status,
  format USER-DEFINED DEFAULT 'news'::video_format,
  script_content jsonb,
  script_version integer DEFAULT 1,
  audio_url text,
  video_url text,
  thumbnail_url text,
  duration_seconds integer,
  tags ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT videos_pkey PRIMARY KEY (id),
  CONSTRAINT videos_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id)
);
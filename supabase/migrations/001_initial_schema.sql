-- ══════════════════════════════════════════════════════════
-- ASTROLOGIA — Supabase Migration v1.0
-- Proyecto: AstrologIA (rrxwijbzmpxhbopwvcjt)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════

-- ─── EXTENSIONES ──────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- búsqueda fuzzy
-- CREATE EXTENSION IF NOT EXISTS "vector"; -- activar cuando hagamos Knowledge Base RAG

-- ─── 1. PERFILES DE USUARIO ───────────────────────────────
-- Se crea automáticamente cuando el user completa su primer módulo
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT,
  name            TEXT,
  avatar_url      TEXT,
  plan            TEXT DEFAULT 'free' CHECK (plan IN ('free','esencial','maestro')),
  stripe_customer TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-crear perfil cuando se registra un usuario
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_on_signup();

-- ─── 2. CARTAS NATALES GUARDADAS ──────────────────────────
CREATE TABLE IF NOT EXISTS natal_charts (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id  TEXT,                         -- para usuarios anónimos
  name        TEXT,                          -- nombre de la persona
  birth_date  DATE NOT NULL,
  birth_time  TIME,
  birth_city  TEXT,
  birth_lat   NUMERIC(10,6),
  birth_lng   NUMERIC(10,6),
  -- Big Three calculados
  sun_sign    TEXT,
  moon_sign   TEXT,
  asc_sign    TEXT,
  -- Datos completos de la carta (JSON del backend Swiss Ephemeris)
  chart_data  JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. RESULTADOS DE MÓDULOS ─────────────────────────────
-- Guarda el resultado de cualquier módulo (Oráculo, Numerología, Match...)
CREATE TABLE IF NOT EXISTS module_results (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id  TEXT,
  module      TEXT NOT NULL,               -- 'oraculo', 'numerologia', 'match_astral', etc.
  inputs      JSONB,                        -- qué datos metió el usuario
  result      JSONB,                        -- qué resultado obtuvo
  score       NUMERIC(5,2),                 -- score numérico si aplica
  archetype   TEXT,                         -- arquetipo resultante si aplica
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. ANALYTICS PROPIOS (first-party Supabase) ──────────
-- Complementa GA4 — datos 100% nuestros, sin cookies de terceros
CREATE TABLE IF NOT EXISTS module_events (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id  TEXT NOT NULL,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event       TEXT NOT NULL,               -- 'module_enter', 'calculate_click', 'gate_hit', etc.
  module      TEXT,
  properties  JSONB,                        -- datos adicionales del evento
  url         TEXT,
  referrer    TEXT,
  ua          TEXT,                         -- user agent (anonimizado)
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. MATCH ASTRAL SESSIONS ─────────────────────────────
CREATE TABLE IF NOT EXISTS match_sessions (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id  TEXT,
  person1     JSONB NOT NULL,              -- {name, sun, moon, asc, birth_date}
  person2     JSONB NOT NULL,
  score       NUMERIC(5,2),
  dimensions  JSONB,                        -- 5 dimensiones de compatibilidad
  archetype1  TEXT,
  archetype2  TEXT,
  dynamic     TEXT,
  shared_at   TIMESTAMPTZ,                  -- null = no compartido
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. EMAIL LEADS (pre-auth) ────────────────────────────
CREATE TABLE IF NOT EXISTS email_leads (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  source      TEXT,                         -- qué módulo captó el lead
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  converted   BOOLEAN DEFAULT FALSE,        -- true cuando se convierte a usuario
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. BLOG POSTS (para el futuro SEO engine) ─────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  meta_description TEXT,
  content     TEXT,
  content_json JSONB,
  category    TEXT,
  tags        TEXT[],
  published   BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  author      TEXT DEFAULT 'AstrologIA',
  seo_score   NUMERIC(5,2),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ÍNDICES (performance) ────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_natal_charts_user ON natal_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_module_results_user ON module_results(user_id);
CREATE INDEX IF NOT EXISTS idx_module_results_module ON module_results(module);
CREATE INDEX IF NOT EXISTS idx_module_events_session ON module_events(session_id);
CREATE INDEX IF NOT EXISTS idx_module_events_event ON module_events(event);
CREATE INDEX IF NOT EXISTS idx_module_events_created ON module_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_match_sessions_user ON match_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE natal_charts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts     ENABLE ROW LEVEL SECURITY;

-- profiles: cada uno solo ve el suyo
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);

-- natal_charts: cada uno ve las suyas (o las anónimas de su sesión)
CREATE POLICY "natal_own" ON natal_charts FOR ALL USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- module_results: cada uno ve los suyos
CREATE POLICY "results_own" ON module_results FOR ALL USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- module_events: insert público (todos pueden registrar eventos sin auth)
CREATE POLICY "events_insert" ON module_events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_select" ON module_events FOR SELECT USING (auth.uid() = user_id);

-- match_sessions: cada uno ve las suyas
CREATE POLICY "match_own" ON match_sessions FOR ALL USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- email_leads: solo service_role puede leer (admin)
CREATE POLICY "leads_service" ON email_leads FOR ALL USING (auth.role() = 'service_role');

-- blog_posts: todos pueden leer los publicados
CREATE POLICY "blog_read" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "blog_write" ON blog_posts FOR ALL USING (auth.role() = 'service_role');

-- ─── VISTAS ANALYTICS ─────────────────────────────────────
-- Módulos más populares (últimos 30 días)
CREATE OR REPLACE VIEW analytics_module_popularity AS
SELECT
  module,
  COUNT(DISTINCT session_id) AS unique_sessions,
  COUNT(*) AS total_events,
  COUNT(CASE WHEN event = 'calculate_click' THEN 1 END) AS calculations,
  COUNT(CASE WHEN event = 'gate_hit' THEN 1 END) AS gate_hits,
  COUNT(CASE WHEN event = 'upgrade_click' THEN 1 END) AS upgrade_clicks,
  ROUND(
    100.0 * COUNT(CASE WHEN event = 'upgrade_click' THEN 1 END) /
    NULLIF(COUNT(CASE WHEN event = 'gate_hit' THEN 1 END), 0)
  , 1) AS gate_to_upgrade_pct
FROM module_events
WHERE created_at > NOW() - INTERVAL '30 days'
  AND module IS NOT NULL
GROUP BY module
ORDER BY unique_sessions DESC;

-- Embudo diario
CREATE OR REPLACE VIEW analytics_daily_funnel AS
SELECT
  DATE(created_at) AS day,
  COUNT(DISTINCT session_id) AS sessions,
  COUNT(DISTINCT CASE WHEN event = 'calculate_click' THEN session_id END) AS calculators,
  COUNT(DISTINCT CASE WHEN event = 'gate_hit' THEN session_id END) AS gate_hits,
  COUNT(DISTINCT CASE WHEN event = 'upgrade_click' THEN session_id END) AS upgrade_clicks
FROM module_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY day DESC;

-- ══════════════════════════════════════════════════════════
-- FIN MIGRATION v1.0
-- ══════════════════════════════════════════════════════════
SELECT 'Migration v1.0 completada ✅' AS status,
  (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') AS tablas_creadas;

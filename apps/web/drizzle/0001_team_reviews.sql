-- Team members & client reviews (YourHomeCare)
-- Apply via: psql $DATABASE_URL -f apps/web/drizzle/0001_team_reviews.sql

DO $$ BEGIN
  CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  rank VARCHAR(100),
  biography TEXT,
  department VARCHAR(255),
  photo_url VARCHAR(500),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS team_members_active_order_idx
  ON team_members (is_active, display_order);

CREATE TABLE IF NOT EXISTS client_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status review_status NOT NULL DEFAULT 'pending',
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_reviews_status_created_idx
  ON client_reviews (status, created_at DESC);

CREATE INDEX IF NOT EXISTS client_reviews_ip_hash_created_idx
  ON client_reviews (ip_hash, created_at DESC);

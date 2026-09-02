-- YourHomeCare Row Level Security (RLS) policies
-- Purpose: enforce least-privilege public access via Supabase anon key.
-- Apply via: psql $DATABASE_URL -f apps/web/drizzle/0002_rls_policies.sql
--
-- IMPORTANT:
-- - Additive and idempotent (safe to re-run).
-- - Does NOT drop tables or delete data.
-- - Server CMS/admin operations use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- - Do NOT apply to production until service-role client is configured in the app.

/* -------------------------------------------------------------------------- */
/*  Public review view (excludes email, ip_hash, moderation fields)           */
/* -------------------------------------------------------------------------- */

CREATE OR REPLACE VIEW public_client_reviews AS
SELECT
  id,
  name,
  rating,
  comment,
  created_at
FROM client_reviews
WHERE status = 'approved';

GRANT SELECT ON public_client_reviews TO anon, authenticated;

/* -------------------------------------------------------------------------- */
/*  Enable RLS on application tables                                          */
/* -------------------------------------------------------------------------- */

ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS client_reviews ENABLE ROW LEVEL SECURITY;

/* -------------------------------------------------------------------------- */
/*  TEAM — public read active members only                                    */
/* -------------------------------------------------------------------------- */

DROP POLICY IF EXISTS team_members_public_read ON team_members;
CREATE POLICY team_members_public_read ON team_members
  FOR SELECT TO anon
  USING (is_active = true);

/* -------------------------------------------------------------------------- */
/*  REVIEWS — public insert pending only; no public read on base table        */
/* -------------------------------------------------------------------------- */

DROP POLICY IF EXISTS client_reviews_public_insert ON client_reviews;
CREATE POLICY client_reviews_public_insert ON client_reviews
  FOR INSERT TO anon
  WITH CHECK (status = 'pending');

/* -------------------------------------------------------------------------- */
/*  BLOGS — published content only                                            */
/* -------------------------------------------------------------------------- */

DROP POLICY IF EXISTS blog_posts_public_read ON blog_posts;
CREATE POLICY blog_posts_public_read ON blog_posts
  FOR SELECT TO anon
  USING (published = true);

/* -------------------------------------------------------------------------- */
/*  TESTIMONIALS — approved and visible only                                  */
/* -------------------------------------------------------------------------- */

DROP POLICY IF EXISTS testimonials_public_read ON testimonials;
CREATE POLICY testimonials_public_read ON testimonials
  FOR SELECT TO anon
  USING (visible = true AND approved = true);

/* -------------------------------------------------------------------------- */
/*  SERVICES / SOLUTIONS / PARTNERS / FAQ — visible only                      */
/* -------------------------------------------------------------------------- */

DROP POLICY IF EXISTS services_public_read ON services;
CREATE POLICY services_public_read ON services
  FOR SELECT TO anon
  USING (visible = true);

DROP POLICY IF EXISTS solutions_public_read ON solutions;
CREATE POLICY solutions_public_read ON solutions
  FOR SELECT TO anon
  USING (visible = true);

DROP POLICY IF EXISTS partners_public_read ON partners;
CREATE POLICY partners_public_read ON partners
  FOR SELECT TO anon
  USING (visible = true);

DROP POLICY IF EXISTS faq_items_public_read ON faq_items;
CREATE POLICY faq_items_public_read ON faq_items
  FOR SELECT TO anon
  USING (visible = true);

/* -------------------------------------------------------------------------- */
/*  JOBS — open listings only                                                 */
/* -------------------------------------------------------------------------- */

DROP POLICY IF EXISTS job_listings_public_read ON job_listings;
CREATE POLICY job_listings_public_read ON job_listings
  FOR SELECT TO anon
  USING (is_open = true);

/* -------------------------------------------------------------------------- */
/*  NEWSLETTERS — insert subscriptions only                                   */
/* -------------------------------------------------------------------------- */

DROP POLICY IF EXISTS newsletters_public_insert ON newsletters;
CREATE POLICY newsletters_public_insert ON newsletters
  FOR INSERT TO anon
  WITH CHECK (consent = true);

/* -------------------------------------------------------------------------- */
/*  CAREERS — submit applications only                                        */
/* -------------------------------------------------------------------------- */

DROP POLICY IF EXISTS careers_public_insert ON careers;
CREATE POLICY careers_public_insert ON careers
  FOR INSERT TO anon
  WITH CHECK (true);

/* -------------------------------------------------------------------------- */
/*  SITE CONTENT — public read for rendered pages                             */
/* -------------------------------------------------------------------------- */

DROP POLICY IF EXISTS page_contents_public_read ON page_contents;
CREATE POLICY page_contents_public_read ON page_contents
  FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS site_settings_public_read ON site_settings;
CREATE POLICY site_settings_public_read ON site_settings
  FOR SELECT TO anon
  USING (true);

/* -------------------------------------------------------------------------- */
/*  CONTACTS / ASSESSMENTS — public insert for form submissions               */
/* -------------------------------------------------------------------------- */

DROP POLICY IF EXISTS contacts_public_insert ON contacts;
CREATE POLICY contacts_public_insert ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS assessments_public_insert ON assessments;
CREATE POLICY assessments_public_insert ON assessments
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS referrals_public_insert ON referrals;
CREATE POLICY referrals_public_insert ON referrals
  FOR INSERT TO anon
  WITH CHECK (true);

/* -------------------------------------------------------------------------- */
/*  Explicitly blocked for anon (no policies created):
      users, audit_logs, patients, appointments, referrals (SELECT),
      notifications, media_assets, analytics_events, blog_categories
    Service role bypasses RLS for CMS/admin server operations.
*/

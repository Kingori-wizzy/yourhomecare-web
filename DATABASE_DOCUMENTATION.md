# YourHomeCare — Database Documentation

## 1. Overview

- **Engine:** PostgreSQL (works with Supabase-hosted Postgres or any standard Postgres 14+ instance)
- **ORM:** Drizzle ORM (`drizzle-orm/postgres-js`)
- **Schema source of truth:** `apps/web/src/server/schema.ts`
- **Migration file:** `apps/web/drizzle/0000_init.sql`
- **Migration config:** `drizzle.config.ts` (repo root)
- **Connection:** `apps/web/src/server/db.ts` — reads `process.env.DATABASE_URL`; if unset, `db` is `null` and the app runs on an in-memory fallback (see [ARCHITECTURE.md](./ARCHITECTURE.md#4-data-access-strategy-triple-fallback)).

All tables use `UUID` primary keys generated with `gen_random_uuid()` (requires the `pgcrypto` extension, created automatically by the init script) and `TIMESTAMPTZ` audit columns (`created_at`, `updated_at`, defaulting to `now()`).

## 2. Enums

| Enum | Values |
|---|---|
| `user_role` | `super_admin`, `administrator`, `operations`, `hr`, `marketing`, `content_manager`, `read_only`, `admin`, `care_manager`, `staff`, `patient` |
| `appointment_status` | `scheduled`, `completed`, `cancelled`, `rescheduled` |
| `referral_status` | `new`, `reviewed`, `accepted`, `declined` |
| `publish_status` | `draft`, `published`, `scheduled`, `archived` |

> The last four `user_role` values (`admin`, `care_manager`, `staff`, `patient`) are legacy/compatibility roles. `lib/roles.ts` normalizes them into the current 7-role model at runtime (see [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md)).

## 3. Tables

### 3.1 `users`
Portal staff accounts and authentication state.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `name` | varchar(255) NOT NULL | |
| `email` | varchar(255) NOT NULL UNIQUE | indexed (`idx_users_email`) |
| `password_hash` | text | `scrypt` salt:hash, nullable until first password set |
| `role` | user_role NOT NULL DEFAULT `read_only` | |
| `avatar_url` | varchar(500) | |
| `is_active` | boolean NOT NULL DEFAULT true | |
| `failed_login_attempts` | integer NOT NULL DEFAULT 0 | |
| `locked_until` | timestamptz | set 15 min after 5th failed attempt |
| `remember_token` | varchar(255) | reserved |
| `reset_token` | varchar(255) | forgot-password flow |
| `reset_token_expires` | timestamptz | 1-hour TTL |
| `two_factor_secret` | varchar(255) | reserved, no UI yet |
| `two_factor_enabled` | boolean NOT NULL DEFAULT false | reserved, no UI yet |
| `last_login_at` | timestamptz | |
| `created_at` / `updated_at` | timestamptz | |

### 3.2 `patients`
Care recipients managed by operations staff.

`id`, `full_name`, `email`, `phone`, `address`, `care_plan` (text), `notes`, `status` (varchar, default `active`), `created_at`, `updated_at`.

### 3.3 `appointments`
`id`, `patient_id` → `patients.id`, `title`, `scheduled_at` (timestamptz NOT NULL), `status` (`appointment_status`, default `scheduled`), `notes`, timestamps.

### 3.4 `assessments`
Public "Book an Assessment" submissions.

`id`, `full_name`, `email`, `phone`, `patient_name`, `patient_age`, `location`, `service`, `preferred_date`, `preferred_time`, `notes`, `status` (varchar, default `new`), timestamps. Indexed on `created_at` (`idx_assessments_created`).

### 3.5 `referrals`
Partner/clinician referral submissions.

`id`, `organization`, `contact_name`, `email`, `phone`, `patient_name`, `diagnosis`, `service`, `location`, `notes`, `status` (`referral_status`, default `new`), timestamps.

### 3.6 `contacts`
General contact form submissions.

`id`, `full_name`, `email`, `phone`, `category`, `subject`, `message` (text NOT NULL), `status` (varchar, default `new`), timestamps. Indexed on `created_at` (`idx_contacts_created`).

### 3.7 `job_listings`
Open positions shown on `/careers`.

`id`, `title`, `department`, `location`, `employment_type`, `description` (text NOT NULL), `requirements` (jsonb string array), `is_open` (boolean, default true), `display_order`, timestamps.

### 3.8 `careers`
Job applications submitted against a listing.

`id`, `job_id` → `job_listings.id`, `full_name`, `email`, `phone`, `role`, `experience`, `cover_letter`, `resume_url`, `status` (varchar, default `new`), timestamps.

### 3.9 `newsletters`
Email subscribers.

`id`, `email` UNIQUE, `name`, `consent` (boolean, default true), timestamps.

### 3.10 `blog_categories`
`id`, `name`, `slug` UNIQUE, `created_at`.

### 3.11 `blog_posts`
`id`, `title`, `slug` UNIQUE (indexed: `idx_blog_posts_slug`), `excerpt`, `content` (text NOT NULL), `featured_image_url`, `author_name`, `category_id` → `blog_categories.id`, `tags` (jsonb string array), `status` (`publish_status`, default `draft`), `published` (boolean), `published_at`, `scheduled_at`, `seo_title`, `seo_description`, timestamps.

### 3.12 `partners`
`id`, `name`, `description`, `website_url`, `logo_url`, `category`, `featured` (boolean), `visible` (boolean, default true), `display_order`, timestamps.

### 3.13 `testimonials`
`id`, `author`, `role`, `quote` (text NOT NULL), `photo_url`, `rating` (integer, default 5), `featured`, `approved` (boolean, default false — requires staff approval before public display), `visible` (boolean, default true), `display_order`, timestamps.

### 3.14 `services`
`id`, `name`, `slug` UNIQUE (indexed: `idx_services_slug`), `description`, `features` (jsonb string array), `icon`, `image_url`, `banner_url`, `seo_title`, `seo_description`, `visible` (boolean, default true), `display_order`, timestamps.

### 3.15 `solutions`
`id`, `title`, `slug` UNIQUE (indexed: `idx_solutions_slug`), `description`, `features` (jsonb string array), `icon`, `image_url`, `seo_title`, `seo_description`, `visible` (boolean, default true), `display_order`, timestamps.

### 3.16 `faq_items`
`id`, `question` (text NOT NULL), `answer` (text NOT NULL), `category` (varchar, default `General`), `visible` (boolean, default true), `display_order`, timestamps.

### 3.17 `media_assets`
Cloudinary-backed media library entries.

`id`, `name`, `url` (varchar(1000) NOT NULL), `public_id` (Cloudinary ID, used for deletion), `resource_type` (default `image`), `mime_type`, `size` (bytes), `folder` (default `yourhomecare`), `alt`, `tags` (jsonb string array), timestamps.

### 3.18 `site_settings`
Key/value store for global site configuration (branding, contact info, socials, SEO defaults, analytics IDs, theme colors).

`id`, `key` (varchar(100) UNIQUE), `value` (jsonb NOT NULL), `updated_at`.

Known keys (seeded by `buildSiteSettingsSeedEntries()`): `branding`, `contact`, `socials`, `seo`, `analytics`, `colors`.

### 3.19 `page_contents`
Per-page CMS content, keyed by page.

`id`, `page_key` (varchar(100) UNIQUE — e.g. `home`, `about`, `services`), `title`, `sections` (jsonb NOT NULL, default `{}` — the full nested content object for that page), `seo` (jsonb, default `{}`), `section_visibility` (jsonb boolean map, default `{}`), `display_order` (jsonb string array, default `[]`), `updated_at`.

`page_key` values correspond to `PageKey` in `server/cms.ts`: `home`, `about`, `services`, `solutions`, `technology`, `contact`, `careers`, `faq`, `blog`, `partners`, `testimonials`.

### 3.20 `analytics_events`
Lightweight event capture (not currently wired to a client-side tracker; reserved for future use).

`id`, `event_name`, `user_id`, `metadata` (jsonb), `created_at`.

### 3.21 `audit_logs`
Immutable log of authentication and admin mutation events.

`id`, `user_id`, `user_email`, `action` (varchar — e.g. `login_success`, `login_failed`, `create`, `update`, `delete`, `bulk_delete`, `password_reset_requested`), `resource`, `resource_id`, `details` (jsonb), `ip_address`, `created_at`. Indexed on `created_at DESC` (`idx_audit_logs_created`) for fast recent-activity queries.

### 3.22 `notifications`
In-portal notification feed.

`id`, `title`, `message` (text NOT NULL), `type` (varchar, default `info`), `read` (boolean, default false), `user_id`, `created_at`.

## 4. Entity Relationship Summary

```
users ─────────────┐
                    │ (id referenced informally by audit_logs.user_id, notifications.user_id)
patients ──< appointments (patient_id)

job_listings ──< careers (job_id)

blog_categories ──< blog_posts (category_id)

page_contents, site_settings   → standalone key/value CMS stores
services, solutions, faq_items,
partners, testimonials, media_assets,
newsletters, contacts, assessments,
referrals                       → standalone collections, no FKs
```

Foreign keys are intentionally minimal — most content tables are independent so an admin can delete/reorder freely without cascading constraints. `patient_id` and `job_id` references do **not** specify `ON DELETE CASCADE`, so deleting a referenced patient/job leaves historical appointments/applications with a dangling reference rather than silently deleting them (verify before hard-deleting patients or job listings in production).

## 5. Indexes

| Index | Table | Column(s) | Purpose |
|---|---|---|---|
| `idx_users_email` | users | email | Login lookups |
| `idx_blog_posts_slug` | blog_posts | slug | Public blog detail page lookups |
| `idx_services_slug` | services | slug | Service detail lookups |
| `idx_solutions_slug` | solutions | slug | `/solutions/[slug]` lookups |
| `idx_audit_logs_created` | audit_logs | created_at DESC | Recent activity feed in `/portal/logs` |
| `idx_contacts_created` | contacts | created_at DESC | Recent contacts in `/portal/contacts` |
| `idx_assessments_created` | assessments | created_at DESC | Recent assessments in `/portal/assessments` |

Unique constraints double as indexes on: `users.email`, `newsletters.email`, `blog_categories.slug`, `blog_posts.slug`, `services.slug`, `solutions.slug`, `site_settings.key`, `page_contents.page_key`.

## 6. Migrations

- **Tool:** `drizzle-kit` (`^0.31.0`)
- **Config:** `drizzle.config.ts` — schema at `apps/web/src/server/schema.ts`, output at `apps/web/drizzle/`.
- **Current migration:** `apps/web/drizzle/0000_init.sql` — full initial schema, idempotent (`CREATE TABLE IF NOT EXISTS`, enum creation wrapped in `DO $$ ... EXCEPTION WHEN duplicate_object THEN null; END $$;`), safe to re-run.

### Generating a new migration after a schema change

```bash
npm run db:generate   # drizzle-kit generate — diffs schema.ts against drizzle/ and emits a new SQL file
```

### Applying migrations

Two supported paths:

```bash
# Option A — drizzle-kit push (applies schema.ts directly, good for early-stage/dev)
npm run db:push

# Option B — apply the raw SQL file directly (recommended for production, auditable)
psql "$DATABASE_URL" -f apps/web/drizzle/0000_init.sql
```

Both require `DATABASE_URL` to be set in the environment (or in a `.env` picked up by `drizzle-kit`).

## 7. Seeding

There is no standalone seed script (e.g., `db:seed`) — content seeding is **lazy and automatic**:

- `server/seed.ts` exports `ensureCmsSeeded()`, which is called by every CMS getter in `server/cms.ts` (`getPageContent`, `getSiteSettings`, `getPublishedServices`, etc.) and by the seed-triggering demo functions.
- On first invocation per server process, it checks each CMS-relevant table (`page_contents`, `site_settings`, `services`, `solutions`, `faq_items`, `testimonials`, `partners`, `job_listings`, `blog_posts`) and, **only if empty**, inserts default records built from the static `src/content/*.ts` files.
- This means a brand-new production database will self-populate with sensible default content the first time any public page or portal module is loaded — no manual seed step is required, though content editors should review and customize the seeded copy afterward via `/portal/cms` and `/portal/settings`.
- **`users` are not auto-seeded into the database.** The bootstrap admin (`ADMIN_EMAIL`/`ADMIN_PASSWORD`) only exists as an in-memory/env-based login fallback (see [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md#bootstrap-admin-account)). For a durable production admin account, insert a row into `users` with a real `password_hash` — see [DEPLOYMENT_GUIDE_HOSTINGER.md](./DEPLOYMENT_GUIDE_HOSTINGER.md#seeding-the-first-admin-user).

## 8. Backup & Maintenance Recommendations

- If using Supabase: enable **Point-in-Time Recovery (PITR)** or scheduled daily backups from the Supabase dashboard.
- If self-hosting Postgres on the Hostinger VPS: schedule `pg_dump` via cron, rotate backups off-box (e.g., to object storage), and test restores periodically.
- Monitor `audit_logs` growth — it has no automatic pruning; consider a periodic archival job once volume grows.
- `media_assets.url`/`public_id` reference Cloudinary; deleting a `media_assets` row via `/api/admin/media` also calls `cloudinary.uploader.destroy()` — verify Cloudinary credentials are correct before bulk-deleting media in production to avoid orphaned Cloudinary assets or failed cleanups.

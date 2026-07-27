# YourHomeCare — CMS Documentation

## 1. Concept

YourHomeCare uses a lightweight, database-backed CMS rather than a third-party headless CMS product. Two tables drive all editable content:

| Table | Purpose |
|---|---|
| `page_contents` | Structured JSON content for each marketing page (hero copy, section text, arrays of features/steps, etc.) plus per-page SEO metadata. |
| `site_settings` | Global, site-wide key/value settings — branding, contact details, social links, default SEO, analytics IDs, theme colors. |

Every public page reads its content through typed getter functions in `apps/web/src/server/cms.ts` (`getPageContent()`, `getSiteSettings()`, `getPublishedServices()`, etc.) rather than importing static content directly. This is what makes the site "CMS-driven" while still shipping with complete, production-quality default copy.

## 2. Static Fallback + Deep Merge

Each `PageKey` (`home`, `about`, `services`, `solutions`, `technology`, `contact`, `careers`, `faq`, `blog`, `partners`, `testimonials`) has a corresponding **default builder** (e.g. `buildHomeDefaults()`) that reads from the static, typed content modules in `src/content/*.ts`.

When a page is requested:

1. `getPageContent(pageKey)` computes the static default object.
2. It fetches the matching `page_contents` row (if any) from the database/Supabase/in-memory store.
3. If a row exists with non-empty `sections`, it is **deep-merged** on top of the default (`deepMerge()` in `cms.ts`) — meaning a partial edit (e.g., only changing the hero title) does not blow away the rest of the page's default structure.
4. If no row exists, or the merge/query fails for any reason, the static default is returned unchanged — **public pages never break due to missing or malformed CMS data.**

The same pattern applies to `getSiteSettings()` (merged against `buildSiteSettingsDefaults()`) and to catalog collections (`getPublishedServices()`, `getPublishedSolutions()`, `getPublishedFaqs()`, `getPublishedTestimonials()`, `getPublishedPartners()`, `getPublishedJobs()`, `getPublishedBlogPosts()`), which fall back to seed records built from `content/*.ts` if their table is empty.

## 3. Lazy Auto-Seeding

`server/seed.ts` exports `ensureCmsSeeded()`, invoked automatically by every CMS getter. The first time it runs in a given server process, it checks each CMS-relevant table and — **only if the table is currently empty** — inserts default rows generated from `content/*.ts`:

- `page_contents` ← `buildPageContentSeedEntries()` (one row per `PageKey`)
- `site_settings` ← `buildSiteSettingsSeedEntries()` (keys: `branding`, `contact`, `socials`, `seo`, `analytics`, `colors`)
- `services`, `solutions`, `faq_items`, `testimonials`, `partners`, `job_listings`, `blog_posts` ← their respective `build*SeedRecords()` functions

This means a fresh production database populates itself with real, on-brand content on first load — no manual data-entry step is required before the site can go live, though editors should review/customize the seeded copy.

## 4. Editing Content — Portal Workflow

### 4.1 CMS Pages module (`/portal/cms`)

Managed by `components/portal/cms-editor.tsx`, backed by `GET|POST|PATCH|DELETE /api/admin/pages` (the `pages` resource maps to the `page_contents` table via the generic admin CRUD route).

Workflow:
1. Staff select or create a page by its **page key** (a datalist suggests the known keys: `home`, `about`, `services`, `solutions`, `technology`, `careers`, `contact`, `faq`, `testimonials`, `partners`, `appointments`, `blog`).
2. **Sections** are edited as raw **JSON** in a textarea — the shape must match the `PageSectionsMap` interface for that page (defined in `server/cms.ts`). There is no visual/WYSIWYG section builder; this is a deliberate trade-off for flexibility and simplicity (see [Known Limitations](./PROJECT_AUDIT.md#9-known-limitations)).
3. **SEO title** and **SEO description** fields are stored in the row's `seo` JSON column and override the page's default metadata.
4. Saving calls `PATCH /api/admin/pages` (existing) or `POST /api/admin/pages` (new), which persists the record and is picked up by the corresponding public page on next request (no caching layer to invalidate).

> **Access:** `super_admin`, `administrator`, `content_manager`, `marketing` (see [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md#rbac-matrix)). `read_only` can view but not save.

### 4.2 Website Settings module (`/portal/settings`)

Managed by `components/portal/settings-editor.tsx`, backed by `/api/admin/settings` (the `settings` resource maps to `site_settings`). Used to edit:

- **Branding** — site name, tagline, description, logo URL
- **Contact** — phone, WhatsApp, email, address, business hours
- **Socials** — list of `{ name, href, icon }`
- **SEO** — default keywords, default title/description, canonical URL
- **Analytics** — Google Analytics ID, Facebook Pixel ID
- **Colors** — primary/secondary/accent/background/surface/muted/text theme tokens

Each setting is its own row (`key` + `value` JSON), so partial saves don't risk corrupting unrelated settings.

> **Access:** `super_admin`, `administrator` only.

### 4.3 SEO module (`/portal/seo`)

Managed by `components/portal/seo-editor.tsx`. This is a **focused, form-based editor** (not raw JSON) for a single `site_settings` row with key `seo_global`, covering: site title, title template (e.g. `%s | YourHomeCare`), meta description, comma-separated keywords, default Open Graph image URL, and Twitter handle. The editor explicitly notes that page-level SEO overrides (set via CMS Pages) take precedence over these global defaults.

> **Access:** `super_admin`, `administrator`, `marketing`, `content_manager`.

### 4.4 Catalog content modules

Services, Solutions, FAQ, Testimonials, Partners, Blog, and Jobs each have a dedicated portal module (`/portal/services`, `/portal/solutions`, `/portal/faq`, `/portal/testimonials`, `/portal/partners`, `/portal/blog`, `/portal/jobs`) using a shared `ResourceManager` component pattern for list/create/edit/delete against their respective `/api/admin/[resource]` endpoint. These are simpler, structured-field forms (name, description, features list, display order, visibility toggle, etc.) rather than raw JSON, since each maps 1:1 to a Drizzle table (see [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md)).

### 4.5 Media Library (`/portal/media`)

Managed by `components/portal/media-library.tsx`, backed by `/api/admin/media`. Uploads go directly to Cloudinary; the resulting `media_assets` record (URL, public ID, dimensions/size, alt text, tags) can then be referenced by URL in CMS content or catalog records (e.g., `imageUrl`, `logoUrl`, `photoUrl` fields). Requires `CLOUDINARY_*` environment variables — see [Known Limitations](./PROJECT_AUDIT.md#9-known-limitations).

## 5. Content Model Reference

| Page key | Public route(s) | Section shape defined in |
|---|---|---|
| `home` | `/` | `HomeSections` (`server/cms.ts`) |
| `about` | `/about` | `AboutSections` |
| `services` | `/services` | `ServicesSections` (catalog items come from the `services` table, not this page's `sections`) |
| `solutions` | `/solutions`, `/solutions/[slug]` | `SolutionsSections` (+ `solutions` table for individual items) |
| `technology` | `/technology` | `TechnologySections` |
| `contact` | `/contact` | `ContactSections` |
| `careers` | `/careers` | `CareersSections` (+ `job_listings` table) |
| `faq` | `/faq` | `FaqSections` (+ `faq_items` table) |
| `blog` | `/blog`, `/blog/[slug]` | `BlogSections` (+ `blog_posts` table) |
| `partners` | `/partners` | `PartnersSections` (+ `partners` table) |
| `testimonials` | `/testimonials` | `TestimonialsSections` (+ `testimonials` table) |

## 6. Editorial Guidance

- **JSON validity matters:** the CMS Pages editor will reject invalid JSON client-side (`toast.error("Sections must be valid JSON.")`) before it ever reaches the API, but it does **not** validate that the JSON matches the expected shape for that page. Editors should keep a copy of the existing structure before making large edits and change values in place rather than restructuring keys.
- **Visibility flags:** most catalog tables (`services`, `solutions`, `faq_items`, `partners`, `testimonials`) have a `visible` boolean — unpublishing an item is a metadata toggle, not a delete, so content can be safely staged and re-enabled later.
- **Testimonials require approval:** `testimonials.approved` defaults to `false` for anything not part of the initial seed; only `approved` (and `visible`) testimonials should be expected to appear publicly — review this field when moderating new submissions.
- **No page cache to bust:** because pages read directly from the database/repository layer on each request (no CDN/ISR cache layer configured for CMS content), changes made in the portal are visible on the public site immediately after saving.
- **Rich text is plain text/HTML strings, not a WYSIWYG editor** — blog post `content` and similar long-text fields are edited as plain textareas. Authors comfortable with basic HTML can embed simple markup; there is no rich text toolbar.

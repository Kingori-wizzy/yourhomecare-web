# YourHomeCare — SEO Report

## 1. Summary

The public site implements solid foundational SEO: per-page metadata via a shared `buildMetadata()` helper, dynamic sitemap and robots.txt generation, Open Graph/Twitter card tags, and a portal editor for global SEO defaults. One gap was identified (missing per-page metadata on `/solutions/[slug]`) and is documented below with a recommended fix.

## 2. Global Metadata (`app/layout.tsx`)

The root layout defines site-wide defaults consumed by every page that doesn't override them:

- **Title template:** `%s | YourHomeCare` with default title `YourHomeCare`.
- **Description:** "Bringing UK healthcare standards to Kenyan homes through compassionate, professional and affordable home healthcare services."
- **`metadataBase`:** set to `https://yourhomecare.co.ke` — ensures relative OG/Twitter image URLs resolve correctly.
- **Open Graph:** title, description, url, site name, `locale: en_KE`, `type: website`.
- **Twitter:** `summary_large_image` card with title/description.
- **Robots:** `index: true, follow: true` by default.

## 3. Per-Page Metadata

Most public routes call `buildMetadata({ title, description, path })` (`lib/metadata.ts`) to set a page-specific title, description, canonical URL, Open Graph, and Twitter tags:

| Page | Has custom metadata? |
|---|---|
| `/` (home) | Uses layout defaults (no override defined) |
| `/about` | ✅ `buildMetadata` |
| `/services` | ✅ `buildMetadata` |
| `/solutions` | ✅ `buildMetadata` |
| `/solutions/[slug]` | ⚠️ **No per-slug metadata** — inherits layout defaults for every solution page |
| `/technology` | ✅ `buildMetadata` |
| `/contact` | ✅ `buildMetadata` |
| `/careers` | ✅ `buildMetadata` |
| `/blog` | ✅ `buildMetadata` |
| `/blog/[slug]` | ✅ `generateMetadata()` — dynamic per-post title/description via `buildMetadata` |
| `/faq` | ✅ `buildMetadata` |
| `/partners` | ✅ `buildMetadata` |
| `/testimonials` | ✅ `buildMetadata` |
| `/appointments` | ✅ `buildMetadata` |

`buildMetadata()` sets `alternates.canonical` to `${siteConfig.url}${path}`, avoiding duplicate-content ambiguity, and applies `robots: { index: true, follow: true }` consistently.

### Identified gap: `/solutions/[slug]`

Unlike `/blog/[slug]`, the solution detail page (`app/solutions/[slug]/page.tsx`) does not export a `generateMetadata()` function, so every individual solution page (e.g., `/solutions/post-hospital-care`) shares the generic site-wide title/description in search results and social shares rather than a title/description specific to that solution.

**Recommendation:** add a `generateMetadata({ params })` function to `app/solutions/[slug]/page.tsx`, mirroring the pattern already used in `app/blog/[slug]/page.tsx`, using the solution's `title`/`description` (and optionally its `seoTitle`/`seoDescription` fields from the `solutions` table) to populate `buildMetadata()`. This is a small, low-risk follow-up.

## 4. Structured Content for Search Engines

### `robots.txt` (`app/robots.txt/route.ts`)
```
User-agent: *
Allow: /
Disallow: /portal
Disallow: /admin
Disallow: /api/
Sitemap: https://yourhomecare.co.ke/sitemap.xml
```
Correctly blocks the private portal, legacy admin path, and all API routes from crawling, while allowing full access to the public marketing content.

### `sitemap.xml` (`app/sitemap.ts`)
Dynamically generated on each request, combining:
- 12 static marketing routes (home, about, services, solutions, technology, partners, testimonials, appointments, contact, blog, faq, careers) with sensible `changeFrequency`/`priority` values (home = weekly/1.0, core pages = monthly/0.6–0.8, blog = weekly/0.7).
- Live **solution** slugs (`/solutions/[slug]`) pulled from `getPublishedSolutions()`, with `lastModified` set to each record's `updatedAt`.
- Live **blog post** slugs (`/blog/[slug]`) pulled from `getPublishedBlogPosts()`, with `lastModified` set to each post's `updatedAt`.

This ensures new blog posts and solutions are automatically discoverable by search engines without any manual sitemap maintenance.

## 5. Portal SEO Controls

Content editors have two levels of SEO control without needing a code change:

1. **Global SEO defaults** (`/portal/seo`) — site title, title template, meta description, keywords, default Open Graph image, Twitter handle (stored under the `seo_global` key in `site_settings`).
2. **Per-page SEO overrides** (`/portal/cms`) — each `page_contents` row has a `seo` JSON field (`{ title, description }`) that can override the page's static metadata for pages driven through the CMS content model (see [CMS_DOCUMENTATION.md](./CMS_DOCUMENTATION.md)).

> Note: the CMS `seo` override on `page_contents` and the `buildMetadata()` calls in each page component are two separate mechanisms today — verify that content-managed SEO overrides are actually read by each page's `generateMetadata`/metadata export before relying on the portal SEO editor as the sole source of truth for a given page's live `<title>`/`<meta description>`. This wiring should be validated page-by-page during QA.

## 6. Site Structure & Crawlability

- Clean, human-readable URLs throughout (`/services`, `/solutions/[slug]`, `/blog/[slug]`, no query-string-based routing for primary content).
- Semantic HTML via Next.js App Router conventions and component structure (headings, landmark regions via `layout`/`Section`/`Container` components).
- No admin/portal links anywhere in public navigation — keeps crawl budget focused on public content and avoids leaking private URLs via internal links.
- `output: "standalone"` + server rendering means content is present in the initial HTML response (not client-rendered-only), which is favorable for search engine indexing.

## 7. Recommendations

1. **Fix the `/solutions/[slug]` metadata gap** (see above) — highest-impact, lowest-effort item.
2. **Verify canonical/OG image strategy** — confirm a default Open Graph image is set (via `/portal/seo` `ogImage` field) so social shares of pages without a specific image still render a branded preview.
3. **Add `alt` text discipline** for all `media_assets` used in public content — the media library supports an `alt` field; ensure editors populate it for accessibility and image search visibility.
4. **Consider structured data (JSON-LD)** for `LocalBusiness`/`MedicalOrganization` schema on the homepage/contact page and `Article` schema on blog posts, to improve rich-result eligibility. Not currently implemented.
5. **Monitor with Google Search Console** post-launch — submit `sitemap.xml`, verify robots.txt is respected, and watch for coverage/indexing issues in the first weeks after go-live.
6. **Populate `NEXTAUTH_URL`/`siteConfig.url` consistently in production** — confirm the production domain matches `siteConfig.url` (`https://yourhomecare.co.ke`) exactly (including `www` vs. apex preference) to avoid canonical URL mismatches.

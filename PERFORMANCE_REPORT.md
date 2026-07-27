# YourHomeCare — Performance Report

## 1. Methodology & Scope

This report is based on analysis of the **Next.js production build output** (`npm run build`, Turbopack) — specifically the per-route JavaScript bundle diagnostics Next.js generates during build — combined with a review of the rendering strategy used across the app. It is **not** a Lighthouse/Core Web Vitals audit against a live deployment; that is listed as a recommended follow-up in Section 5. All figures below reflect build-time bundle analysis performed on this codebase.

## 2. Rendering Strategy

| Strategy | Routes | Impact |
|---|---|---|
| Static prerendering (`○`) | 22 routes — home, about, services, solutions, technology, contact, careers, faq, partners, testimonials, appointments, login, forgot/reset password, robots.txt, sitemap.xml, not-found | Fastest possible TTFB — served as pre-rendered HTML, no per-request server compute. |
| Static with generated params (`●`) | `/blog/[slug]` | Each known blog post is prerendered at build time; new posts render on-demand and are cached thereafter. |
| Server-rendered on demand (`ƒ`) | 35 routes — all `/api/*`, all `/portal/*` modules, `/admin` redirect, `/solutions/[slug]` | Required for authenticated/personalized content (portal) and dynamic data (solutions); each request executes server logic. |

This mix is appropriate for the app's needs: the highest-traffic, SEO-critical public pages are static, while the low-traffic, always-personalized portal is server-rendered per request (its performance profile matters far less than the public site's).

## 3. JavaScript Bundle Size

Per-route **first-load JS** (uncompressed, as reported by the Next.js build) across all 43 analyzed routes:

| Metric | Value (uncompressed) |
|---|---|
| Minimum | ~703 KB |
| Median | ~894 KB |
| Average | ~853 KB |
| Maximum | ~1,062 KB (`/portal/login`) |

**Interpretation:**
- These are **uncompressed** sizes; real-world network transfer is substantially smaller after gzip/brotli compression (typically 60–75% reduction for JS), so actual bytes-over-the-wire are meaningfully lower than the figures above.
- The bundle sizes are fairly uniform across routes (roughly 700 KB–1.06 MB), which indicates a large **shared chunk** (framework runtime, design system, animation library, form/query libraries) common to nearly every page rather than route-specific bloat — expected for an app using Framer Motion, TanStack Query, React Hook Form, and a shared UI kit across both public and portal surfaces.
- The single highest bundle (`/portal/login`) is still an authenticated-portal route, not a public marketing page, which is the more performance-sensitive surface for SEO and conversion.

## 4. Architectural Factors Favoring Performance

- **`output: "standalone"`** produces a minimal, self-contained server bundle for fast cold starts on the production VPS.
- **Server Components by default** for public pages minimize client-side JavaScript for non-interactive content; only forms, carousels, menus, and portal data tables are client components.
- **CMS reads are direct repository calls with no extra network hop** — no separate CMS API/service to add latency; data is fetched in the same server process rendering the page.
- **Image optimization** is configured via `next.config.ts` `images.remotePatterns` (Cloudinary, Supabase, production domain), enabling Next.js's built-in responsive image optimization for any CMS-managed images.
- **Long-lived caching for static assets** at the Nginx layer (`deploy/nginx.yourhomecare.conf` sets `Cache-Control: public, immutable` with 7-day `expires` for JS/CSS/image/font extensions).
- **Rate limiting and input validation run in-process** with negligible overhead (no external service round-trip for these checks).

## 5. Known Performance Considerations & Recommendations

1. **No CDN in front of the origin server yet** — for a Kenya-based/global audience, placing a CDN (e.g., Cloudflare) in front of the Hostinger VPS would reduce latency for static assets and provide edge caching, plus DDoS mitigation. Not currently configured.
2. **No formal Core Web Vitals baseline captured** — recommend running Lighthouse (mobile + desktop) and/or PageSpeed Insights against the live production URL immediately after launch to establish a baseline for LCP, CLS, and INP, then track over time.
3. **Large shared JS chunk** — consider auditing whether Framer Motion and other heavier client libraries can be more aggressively code-split or deferred (e.g., dynamic `import()` for below-the-fold animated sections) if a future Lighthouse audit flags JS payload as a bottleneck.
4. **Database query performance** — indexes exist on the highest-traffic lookup columns (`email`, `slug` fields, `created_at` on high-volume tables — see [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md#5-indexes)). No N+1 query patterns were identified in the repository/service layer (each list/get call is a single query or in-memory operation).
5. **In-memory fallback is not a production performance concern** as long as `DATABASE_URL` is properly configured — it exists purely for local development ergonomics.
6. **Cloudinary offloads image delivery/transformation** from the app server entirely, which is a strong performance choice for media-heavy pages (partner logos, testimonial photos, blog featured images).

## 6. Recommended Post-Launch Performance Actions

- [ ] Run Lighthouse/PageSpeed Insights against the production domain and record baseline scores.
- [ ] Set up Real User Monitoring (RUM) or Vercel/Sentry performance tracing if deeper visibility is needed.
- [ ] Evaluate adding a CDN in front of the Hostinger origin.
- [ ] Re-run `npm run build` bundle diagnostics after any major dependency addition to catch regressions early.
- [ ] Monitor PM2 process memory (`max_memory_restart: "512M"` is currently configured) and adjust VPS resources if the app approaches this ceiling under real traffic.

# YourHomeCare — Release Notes

## v1.0.0 — Production Launch Candidate (July 2026)

First production-ready release of the YourHomeCare platform: a public marketing website paired with a private staff management portal, built on Next.js 16.

### Highlights

**Public Website**
- 14 marketing routes: home, about, services, solutions (+ detail pages), technology, contact, careers, blog (+ post pages), FAQ, partners, testimonials, appointments.
- Lead-capture forms for contact, free assessment booking, partner/clinician referrals, job applications, and newsletter signup — each validated, rate-limited, persisted, and notified by email.
- CMS-driven content with static-content fallback, so pages always render complete, on-brand copy even before an editor has touched the CMS.
- Dynamic `sitemap.xml` and `robots.txt` that correctly exclude the portal, legacy admin path, and API routes from search indexing.

**Private Staff Portal**
- Single entry point at `/portal/login`; legacy `/admin` URLs redirect automatically.
- 24 management modules: Dashboard, Analytics, Reports, Patients, Appointments, Assessments, Referrals, Contacts, Users, Careers, Jobs, Blog, Partners, Testimonials, Services, Solutions, FAQ, Newsletters, Media, CMS, SEO, Settings, Notifications, and System Logs.
- 7-role RBAC model (`super_admin`, `administrator`, `operations`, `hr`, `marketing`, `content_manager`, `read_only`) enforced at middleware, page, and API layers.
- Secure credential-based authentication: scrypt password hashing, account lockout after repeated failures, forgot/reset password flow, and a full audit log of authentication and content-change events.

**Platform & Infrastructure**
- Drizzle ORM schema covering 22 tables across CRM, content, and platform concerns, with an initial idempotent SQL migration.
- Triple-fallback data layer (Postgres → Supabase client → in-memory) so the app runs fully functional with zero configuration for local development, and durably in production once `DATABASE_URL` is set.
- Resend-powered transactional email and Cloudinary-powered media management, both designed to fail gracefully (no crashes) when unconfigured.
- Production deployment tooling: PM2 process definition (`ecosystem.config.cjs`), example Nginx reverse-proxy config, and a documented `.env.example`.

### Verification

- `npm run type-check` — 0 errors
- `npm run lint` — 0 errors, 0 warnings
- `npm run build` — successful production build, 58 routes generated

See [TESTING_REPORT.md](./TESTING_REPORT.md) for full detail.

### Known Limitations (carried into this release)

- In-memory data fallback is not durable; a configured `DATABASE_URL` is required for production data persistence.
- Cloudinary environment variables are required for the media library to accept uploads (returns `503` otherwise).
- Two-factor authentication is schema-ready (`users.two_factor_enabled`/`two_factor_secret`) but has no enrollment/verification UI yet.
- Rich text/blog content editing uses plain textareas rather than a WYSIWYG editor.
- No automated test suite yet (verification is via static analysis + build + manual review — see [TESTING_REPORT.md](./TESTING_REPORT.md)).
- `/solutions/[slug]` pages do not yet generate per-slug SEO metadata (see [SEO_REPORT.md](./SEO_REPORT.md)).

See [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md) for the full go-live checklist and remaining manual tasks.

---

## Development History (pre-v1.0.0)

The following commits represent the incremental build-out that led to this release:

- `chore`: initialize project structure
- `chore(web)`: scaffold frontend architecture and core dependencies
- `refactor(ui)`: establish layout system and design foundation
- Home, About, and Services pages built out with full content
- All public pages completed and polished
- Staff portal, CMS layer, authentication, database schema, and API surface added to reach production readiness (this release)

---

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org/). Future releases should append new entries above this line, grouped by **Added / Changed / Fixed / Security**, with the date and a short summary, so this file remains a running changelog for the platform.

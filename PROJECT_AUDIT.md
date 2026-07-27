# YourHomeCare — Project Audit

**Audit date:** July 2026
**Repository:** `yourhomecare-web` (npm workspaces monorepo)
**Scope:** Full-stack marketing website + private staff portal (CMS/admin) for a Kenyan home healthcare provider.

---

## 1. Executive Summary

YourHomeCare is a production-ready Next.js 16 application combining:

- A **public marketing site** (14 routes) covering services, solutions, company info, careers, blog, and lead-capture forms.
- A **private staff portal** (`/portal/*`, 24 modules) for operations, HR, marketing, and content management, gated behind NextAuth credentials + role-based access control (RBAC).
- A **headless-style CMS layer** (`page_contents` / `site_settings` tables) that lets non-technical staff edit page copy, SEO metadata, and branding without a deploy.
- A **Postgres (Supabase-compatible) database** via Drizzle ORM, with an automatic in-memory fallback when `DATABASE_URL` is not configured (useful for local development and demos).

The codebase passes `tsc --noEmit`, `eslint`, and `next build` with **zero errors** at the time of this audit (see [TESTING_REPORT.md](./TESTING_REPORT.md)). Overall production readiness is estimated at **~92%** — see [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md) for the remaining manual steps.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack build) |
| UI runtime | React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4, `tw-animate-css`, `class-variance-authority` |
| Animation | Framer Motion |
| Forms | React Hook Form + `@hookform/resolvers` |
| Validation | Zod 4 |
| Data fetching / cache | TanStack Query |
| Client state | Zustand |
| ORM | Drizzle ORM (`drizzle-orm`, `drizzle-kit`) |
| Database | PostgreSQL (Supabase-hosted or self-managed) |
| Auth | NextAuth 4 (Credentials provider, JWT sessions) |
| Password hashing | Node.js `crypto.scrypt` (salted, timing-safe compare) |
| Transactional email | Resend |
| Media storage | Cloudinary |
| Error monitoring (optional) | Sentry (`@sentry/nextjs`) |
| Icons | Lucide React, React Icons |
| Package management | npm workspaces (`apps/*`, `packages/*`) |
| Process manager (prod) | PM2 (`ecosystem.config.cjs`) |
| Reverse proxy (prod) | Nginx (`deploy/nginx.yourhomecare.conf`) |

---

## 3. Repository Structure

```
yourhomecare-web/
├── apps/
│   └── web/                     # Next.js application (only app in the workspace today)
│       ├── src/
│       │   ├── app/             # App Router: public routes, /portal, /admin redirect, /api
│       │   ├── components/      # UI, layout, portal, and marketing section components
│       │   ├── content/         # Static fallback copy (content/*.ts) used to seed the CMS
│       │   ├── config/          # Site-wide config (siteConfig, nav, etc.)
│       │   ├── design/          # Design tokens (colors.ts)
│       │   ├── lib/             # auth, roles, security, email, cloudinary, supabase, validations
│       │   ├── server/          # Drizzle schema, db client, repositories, services, cms, seed
│       │   ├── styles/          # Global Tailwind theme (theme.css, globals.css)
│       │   └── middleware.ts    # Portal/API auth guard + security headers
│       ├── drizzle/0000_init.sql
│       ├── next.config.ts
│       └── package.json
├── deploy/
│   └── nginx.yourhomecare.conf  # Example reverse-proxy config for Hostinger VPS
├── ecosystem.config.cjs         # PM2 process definition
├── drizzle.config.ts            # drizzle-kit config (schema, migrations output)
├── .env.example                 # Documented environment variables
├── package.json                 # Workspace root scripts
└── *.md                         # Production documentation (this set of files)
```

---

## 4. Application Surface

### 4.1 Public site (14 routes)

`/`, `/about`, `/services`, `/solutions`, `/solutions/[slug]`, `/technology`, `/contact`, `/careers`, `/blog`, `/blog/[slug]`, `/faq`, `/partners`, `/testimonials`, `/appointments`

All public routes are indexable, statically prerendered where possible, and pull copy through the CMS layer (`server/cms.ts`) with static fallbacks in `src/content/*.ts`. No admin/portal links appear anywhere in public navigation, headers, or footers.

### 4.2 Private portal (single entry point, 24 modules)

Entry point: **`/portal/login`** (the only unauthenticated portal page besides forgot/reset password).

Modules under `/portal/(dashboard)/*`: Dashboard, Analytics, Reports, Patients, Appointments, Assessments, Referrals, Contacts, Users, Careers, Jobs, Blog, Partners, Testimonials, Services, Solutions, FAQ, Newsletters, Media, CMS, SEO, Settings, Notifications, Logs.

The legacy `/admin` path issues a 307 redirect to the equivalent `/portal` path via `middleware.ts`.

### 4.3 API surface

- **Public write endpoints** (rate-limited, Zod-validated, persist + send email): `POST /api/contact`, `/api/assessment`, `/api/referral`, `/api/careers`, `/api/newsletter`
- **Admin generic CRUD:** `GET|POST|PATCH|DELETE /api/admin/[resource]` (14 resources)
- **Admin specialized:** `/api/admin` (legacy dashboard snapshot), `/api/admin/analytics`, `/api/admin/media` (Cloudinary upload/delete), `/api/admin/email`
- **Auth:** `/api/auth/[...nextauth]`, `/api/admin/auth/forgot`, `/api/admin/auth/reset`
- **Infra:** `/api/health`, `/robots.txt`, `/sitemap.xml`

Full request/response contracts are documented in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## 5. Data Layer

23 Drizzle-defined tables covering CRM (patients, appointments, assessments, referrals, contacts, careers, job_listings, newsletters), content (blog_posts, blog_categories, services, solutions, faq_items, testimonials, partners, page_contents, site_settings, media_assets), and platform concerns (users, audit_logs, analytics_events, notifications).

When `DATABASE_URL` is unset, `server/db.ts` returns `null` and every repository (`server/repositories.ts`) transparently falls back to an in-process array so the app remains fully functional for local development and demos. Full schema reference in [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md).

---

## 6. Authentication & Authorization

- NextAuth Credentials provider with JWT sessions (8-hour max age).
- 11 roles in the schema enum; 7 are the current **portal roles** (`super_admin`, `administrator`, `operations`, `hr`, `marketing`, `content_manager`, `read_only`); the remaining 4 (`admin`, `care_manager`, `staff`, `patient`) are legacy values normalized for backward compatibility (`lib/roles.ts`).
- Per-module RBAC matrix (`MODULE_PERMISSIONS`) enforced both in UI (sidebar filtering) and API (`canAccessModule`, `canWrite`).
- Account lockout after 5 failed attempts (15-minute lockout), audit-logged.
- Forgot/reset password flow with time-limited, single-use tokens; generic responses to prevent user enumeration.
- `twoFactorEnabled` / `twoFactorSecret` columns exist on `users` but there is no 2FA UI yet (tracked as a known limitation).

Full detail in [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) and [ADMIN_GUIDE.md](./ADMIN_GUIDE.md).

---

## 7. CMS & Content Model

`page_contents` (per-page JSON sections) and `site_settings` (branding/contact/SEO/colors) are lazily seeded from `src/content/*.ts` on first read (`ensureCmsSeeded()`), then editable via `/portal/cms` and `/portal/settings`. See [CMS_DOCUMENTATION.md](./CMS_DOCUMENTATION.md).

---

## 8. Verification Performed During This Audit

| Check | Command | Result |
|---|---|---|
| Type safety | `npm run type-check` | ✅ 0 errors |
| Lint | `npm run lint` | ✅ 0 errors, 0 warnings |
| Production build | `npm run build` | ✅ Success — 58 routes generated |

See [TESTING_REPORT.md](./TESTING_REPORT.md) for full output and methodology.

---

## 9. Known Limitations

1. **In-memory data fallback** — without `DATABASE_URL`, all admin CRUD data resets on server restart. Required for a durable production deployment.
2. **Cloudinary is required for uploads** — the media library API returns `503` if Cloudinary env vars are missing; there is no local filesystem fallback for uploads.
3. **2FA is schema-ready but not UI-enabled** — `twoFactorEnabled`/`twoFactorSecret` exist on `users` but no enrollment or verification flow is implemented.
4. **Rich text editing is textarea-based** — the CMS/blog editors use plain multi-line text areas, not a WYSIWYG editor.

---

## 10. Related Documentation

| Document | Purpose |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, request flow, module boundaries |
| [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md) | Full schema, relationships, migrations |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Endpoint contracts, auth, examples |
| [CMS_DOCUMENTATION.md](./CMS_DOCUMENTATION.md) | Content model and editing workflow |
| [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) | Staff portal operator manual |
| [USER_GUIDE.md](./USER_GUIDE.md) | Public site visitor-facing guide |
| [DEPLOYMENT_GUIDE_HOSTINGER.md](./DEPLOYMENT_GUIDE_HOSTINGER.md) | Hostinger VPS deployment runbook |
| [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) | Security posture and hardening checklist |
| [TESTING_REPORT.md](./TESTING_REPORT.md) | Verification results |
| [SEO_REPORT.md](./SEO_REPORT.md) | SEO implementation review |
| [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md) | Performance characteristics |
| [RELEASE_NOTES.md](./RELEASE_NOTES.md) | Version history |
| [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md) | Go-live checklist and readiness score |

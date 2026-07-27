# YourHomeCare — Architecture

## 1. Overview

YourHomeCare is a single Next.js 16 application (App Router) serving three distinct surfaces from one codebase and one deployment:

1. **Public marketing site** — SEO-indexable, mostly static/SSR pages.
2. **Private staff portal** (`/portal`) — authenticated, role-gated SPA-like dashboard rendered with React Server Components + client islands.
3. **JSON API** (`/api/*`) — public lead-capture endpoints and an authenticated admin CRUD surface consumed by the portal's client components.

There is no separate backend service — Next.js Route Handlers act as the API layer, and Drizzle ORM talks directly to Postgres from server-side code (route handlers, server components, and server actions).

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser / Client                        │
│   Public pages (SSR/SSG)        Portal pages (auth'd, client)   │
└───────────────┬───────────────────────────┬─────────────────────┘
                │                           │
                ▼                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js 16 (apps/web)                        │
│  ┌───────────────┐   ┌────────────────┐   ┌──────────────────┐  │
│  │  middleware.ts │──▶│  App Router     │──▶│  Route Handlers  │  │
│  │ (auth + hdrs)  │   │  (pages/layouts)│   │  (/api/*)        │  │
│  └───────────────┘   └────────┬────────┘   └────────┬─────────┘  │
│                                │                     │            │
│                                ▼                     ▼            │
│                     ┌────────────────────────────────────────┐   │
│                     │            server/ layer                │   │
│                     │  cms.ts · services.ts · repositories.ts │   │
│                     │  auth-store.ts · seed.ts · schema.ts    │   │
│                     └───────────────┬────────────────────────┘   │
└─────────────────────────────────────┼─────────────────────────────┘
                                       ▼
                    ┌──────────────────────────────────┐
                    │   Drizzle ORM (drizzle-orm/pg)    │
                    └──────────────────┬─────────────────┘
                                       ▼
                    ┌──────────────────────────────────┐
                    │  PostgreSQL (Supabase or self-    │
                    │  managed) — or in-memory fallback │
                    │  when DATABASE_URL is unset       │
                    └──────────────────────────────────┘

        External services: Resend (email) · Cloudinary (media) · Sentry (optional)
```

## 2. Request Flow

### 2.1 Public page request (e.g. `GET /services`)

1. `middleware.ts` runs first for every request, but only adds security headers for non-portal routes (no auth check needed for public pages).
2. The App Router renders `app/services/page.tsx` as a Server Component.
3. The page calls `getPageContent("services")` / `getPublishedServices()` from `server/cms.ts`.
4. `server/cms.ts` calls `ensureCmsSeeded()` (lazy, one-time per server process) then reads from the relevant repository (`server/services.ts` → `server/repositories.ts`).
5. `repositories.ts` queries Supabase (if configured) or falls back to an in-memory array; the resulting record is deep-merged over the static default from `content/services.ts` so the page always renders even with partial CMS data.
6. HTML is streamed to the client; static pages are prerendered at build time where no request-specific data is required.

### 2.2 Public form submission (e.g. `POST /api/contact`)

1. Client component (`components/sections/contact/contact-form.tsx`) uses React Hook Form + Zod resolver for client-side validation, then calls `useSubmit` (`lib/hooks/use-submit.ts`) to POST JSON.
2. The route handler (`app/api/contact/route.ts`):
   - Applies an in-memory rate limit keyed by `x-forwarded-for` (`lib/security.ts`).
   - Re-validates the payload server-side with the same Zod schema (`lib/validations/contact.ts`) — never trusts the client.
   - Sanitizes free-text fields (strips `<`/`>`).
   - Persists the record via `contactService.create()`.
   - Sends a notification email via Resend (`lib/email.ts` → `lib/resend.ts`); silently no-ops if `RESEND_API_KEY` is absent.
   - Returns a JSON success/error envelope.

### 2.3 Authenticated portal request (e.g. `GET /portal/patients`)

1. `middleware.ts` matches `/portal/:path*`, extracts the NextAuth JWT via `getToken()`.
2. If no token → redirect to `/portal/login?callbackUrl=...`. If token role isn't a recognized portal/legacy role → redirect to login.
3. The page (`app/portal/(dashboard)/patients/page.tsx`) additionally calls `requirePortalAccess("patients")` (`lib/portal-guard.ts`) as defense-in-depth, which re-checks the session server-side and the module-level RBAC (`canAccessModule`).
4. The page renders a `ResourceManager` client component that fetches/mutates data through `/api/admin/patients` (the generic `[resource]` handler).
5. Every write (`POST`/`PATCH`/`DELETE`) on `/api/admin/[resource]` re-authorizes the session, checks `canWrite(role)`, performs the mutation, and writes an `audit_logs` entry.

### 2.4 Login flow

1. `app/portal/login/page.tsx` renders `LoginForm`, which calls NextAuth's `signIn("credentials", ...)`.
2. `lib/auth.ts` `authorize()`:
   - Looks up the user via `findUserByEmail()` (`server/auth-store.ts`), which tries Drizzle → Supabase client → in-memory map, in that order.
   - Rejects inactive or locked accounts (audit-logged).
   - Verifies password with `verifyPassword()` (scrypt + timing-safe compare).
   - On failure, increments `failedLoginAttempts`; locks the account for 15 minutes after 5 failures.
   - On success, resets failure counters, stamps `lastLoginAt`, and issues a JWT session with `role` embedded.
   - **Bootstrap fallback:** if no DB user matches, but the email/password match `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars, a `super_admin` session is issued anyway — this lets a fresh deployment log in before the first real admin user is seeded in the database.

## 3. Module Boundaries

| Directory | Responsibility |
|---|---|
| `src/app` | Routing only — pages, layouts, route handlers. Should stay thin; delegates to `server/` and `lib/`. |
| `src/components` | Presentational and client-interactive UI, grouped by `ui/` (primitives), `layout/` (chrome), `sections/` (marketing page sections), `portal/` (dashboard widgets). |
| `src/content` | Static, typed fallback copy for every public page — the CMS "source of truth" when the DB has no record yet. |
| `src/config` | Cross-cutting site configuration (name, URL, socials, SEO defaults). |
| `src/lib` | Stateless utilities and cross-cutting concerns: `auth.ts` (NextAuth config), `roles.ts` (RBAC), `security.ts` (rate limiting, sanitization, headers), `email.ts`/`resend.ts`, `cloudinary.ts`, `supabase.ts`, `password.ts`, `env.ts`, `validations/*.ts` (Zod schemas shared by client + server). |
| `src/server` | Data access layer: `schema.ts` (Drizzle table defs), `db.ts` (connection factory), `repositories.ts` (generic Supabase/in-memory CRUD), `services.ts` (typed per-entity repositories + admin registry), `cms.ts` (page content/settings getters with deep-merge fallback), `seed.ts` (lazy demo/CMS seeding), `auth-store.ts` (user + audit log persistence with DB/Supabase/memory fallback). |
| `middleware.ts` | Edge-compatible request gate: security headers on every response, `/admin` → `/portal` redirect, auth + RBAC enforcement for `/portal/*` and `/api/admin/*`. |

## 4. Data Access Strategy: Triple Fallback

Nearly every data-access function in `server/` follows the same pattern, in priority order:

1. **Drizzle + Postgres** (`db` from `server/db.ts`) — used directly for `users` and `audit_logs` in `auth-store.ts`.
2. **Supabase JS client** (`lib/supabase.ts`) — used by the generic `createCrudRepository()` for all other entities (patients, blog posts, services, etc.) via `.from(table).select()/.insert()/.update()/.delete()`.
3. **In-memory array** — always available, seeded with a small amount of demo data (or seeded from `content/*.ts` via `ensureCmsSeeded()` for CMS-managed collections). Used automatically whenever no DB/Supabase client is configured or a query fails.

This design lets the app boot and demo fully functional in a laptop/CI environment with zero configuration, while transacting against real Postgres in production once `DATABASE_URL` (and optionally `SUPABASE_URL`/`SUPABASE_ANON_KEY`) are set. See [Known Limitations](./PROJECT_AUDIT.md#9-known-limitations) — the in-memory path is **not** durable and must not be relied on in production.

## 5. Authentication & Session Architecture

- **Provider:** NextAuth Credentials (email + password), JWT session strategy, 8-hour max age.
- **Session cookie:** `__Secure-next-auth.session-token` in production (secure, httpOnly, `sameSite=lax`); unprefixed in development.
- **Authorization model:** role stored in the JWT (`token.role`), refreshed only on login or explicit `session.update()` call — role changes for an already-logged-in user take effect on their next login or manual session refresh.
- **RBAC enforcement layers** (defense-in-depth):
  1. `middleware.ts` — coarse allow-list of valid role strings for `/portal/*` and `/api/admin/*`.
  2. `lib/portal-guard.ts` `requirePortalAccess(module)` — per-page server-side module check.
  3. `lib/roles.ts` `canAccessModule()` / `canWrite()` — used inside every `/api/admin/*` route handler before reading or mutating data.
  4. `components/portal/sidebar.tsx` — hides navigation items the current role cannot access (UX only, not a security boundary).

## 6. Rendering Strategy

- Public marketing pages are Server Components by default; interactive pieces (forms, carousels, mobile menu) are isolated `"use client"` components.
- `sitemap.ts` and `robots.txt/route.ts` are dynamically generated route handlers that pull live slugs (blog posts, solutions) from the CMS layer.
- Portal pages are Server Components that gate access, then hand off to client-side data tables/forms (`ResourceManager`, `CmsEditor`, `SettingsEditor`, etc.) that talk to `/api/admin/*` using TanStack Query for caching/mutations.
- `next.config.ts` sets `output: "standalone"`, producing a self-contained `server.js` bundle for containerless VPS deployment (see [DEPLOYMENT_GUIDE_HOSTINGER.md](./DEPLOYMENT_GUIDE_HOSTINGER.md)).

## 7. Cross-Cutting Concerns

| Concern | Implementation |
|---|---|
| Security headers | Set in both `middleware.ts` (runtime, all responses) and `next.config.ts` `headers()` (build-time, portal/admin API paths) — belt-and-suspenders. |
| Rate limiting | In-process `Map`-based token bucket per client IP (`lib/security.ts`). Resets on server restart; adequate for abuse-deterrence, not a substitute for a WAF/CDN rate limiter at scale. |
| Input validation | Zod schemas in `lib/validations/*.ts`, shared between client forms (via `@hookform/resolvers/zod`) and server route handlers. |
| Audit logging | Every admin create/update/delete/bulk-delete and every login attempt writes to `audit_logs` via `createAuditLog()`. |
| Email | `lib/email.ts` wraps Resend and is a safe no-op when `RESEND_API_KEY` is unset (returns `{ skipped: true }`) so forms don't fail in environments without email configured. |
| Media | `lib/cloudinary.ts` configures the Cloudinary SDK from `lib/env.ts`; the media API returns `503` if Cloudinary credentials are missing. |
| Monitoring | `lib/sentry.ts` + `@sentry/nextjs` — enabled only when `SENTRY_DSN` is set. |

## 8. Why This Architecture

- **Single deploy unit** keeps operational overhead low for a small team — one Node process, one PM2 entry, one Nginx vhost.
- **Server-first rendering** keeps the public site fast and SEO-friendly without a separate static site generator.
- **CMS-over-database with static-content fallback** means the site is never "broken" by missing CMS data and content editors can safely test empty states.
- **RBAC layered at multiple levels** ensures that even if one guard is bypassed (e.g., a client-side check), the API layer still enforces authorization.

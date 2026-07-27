# YourHomeCare — Security Checklist

## 1. Authentication

| Control | Status | Detail |
|---|---|---|
| Password hashing | ✅ Implemented | Node.js `crypto.scrypt` with a random 16-byte salt per password, stored as `salt:hash` hex; verification uses `timingSafeEqual` (`lib/password.ts`) — no plaintext or reversible storage. |
| Session strategy | ✅ Implemented | NextAuth JWT sessions, 8-hour max age, `httpOnly` + `sameSite=lax` cookie, `secure` flag enforced in production, `__Secure-` cookie name prefix in production. |
| Account lockout | ✅ Implemented | 5 failed attempts → 15-minute lockout (`lib/auth.ts`), enforced server-side on every login attempt. |
| Forgot/reset password | ✅ Implemented | Time-limited (1 hour), single-use, cryptographically random (32-byte) reset tokens; generic response prevents user enumeration; rate-limited (5/15min for request, 10/15min for completion). |
| Two-factor authentication | ⚠️ Schema-ready, not enabled | `users.two_factor_enabled` / `two_factor_secret` columns exist but there is no enrollment/verification UI yet. **Not a current attack surface** since it's unused, but also not yet providing additional protection. |
| Bootstrap admin account | ⚠️ Review before go-live | `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars provide a login fallback when no DB user matches, so a fresh deployment can be accessed immediately. **Action required:** set a strong, unique `ADMIN_PASSWORD` in production and seed a real database-backed admin user promptly (see [DEPLOYMENT_GUIDE_HOSTINGER.md](./DEPLOYMENT_GUIDE_HOSTINGER.md#seeding-the-first-admin-user)) so the bootstrap credential is not the only path to `super_admin` access long-term. |

## 2. Authorization (RBAC)

Role model (`lib/roles.ts`): 7 active portal roles (`super_admin`, `administrator`, `operations`, `hr`, `marketing`, `content_manager`, `read_only`) plus 4 legacy-compatible roles (`admin`, `care_manager`, `staff`, `patient`) normalized at runtime via `normalizeRole()`.

**Defense in depth** — authorization is checked at three independent layers, so a failure in one layer does not grant access:

1. `middleware.ts` — allow-lists known role strings for `/portal/*` and `/api/admin/*`, redirects/blocks otherwise.
2. `lib/portal-guard.ts` (`requirePortalAccess`) — per-page server-side module check, redirects to `/portal` if the role can't access that module.
3. Route handlers (`canAccessModule`, `canWrite` in every `/api/admin/*` endpoint) — the authoritative check; even a compromised/bypassed UI cannot read or write data the role isn't permitted to touch.

### RBAC Matrix

| Module | super_admin | administrator | operations | hr | marketing | content_manager | read_only |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| analytics | ✅ | ✅ | ✅ | | ✅ | | ✅ |
| users | ✅ | ✅ | | | | | |
| patients | ✅ | ✅ | ✅ | | | | ✅ |
| appointments | ✅ | ✅ | ✅ | | | | ✅ |
| assessments | ✅ | ✅ | ✅ | | | | ✅ |
| referrals | ✅ | ✅ | ✅ | | | | ✅ |
| contacts | ✅ | ✅ | ✅ | | ✅ | | ✅ |
| careers | ✅ | ✅ | | ✅ | | | ✅ |
| jobs | ✅ | ✅ | | ✅ | | | ✅ |
| blog | ✅ | ✅ | | | ✅ | ✅ | ✅ |
| partners | ✅ | ✅ | | | ✅ | ✅ | ✅ |
| testimonials | ✅ | ✅ | | | ✅ | ✅ | ✅ |
| services | ✅ | ✅ | | | | ✅ | |
| solutions | ✅ | ✅ | | | | ✅ | |
| faq | ✅ | ✅ | | | | ✅ | |
| media | ✅ | ✅ | | ✅ | ✅ | ✅ | |
| newsletters | ✅ | ✅ | | | ✅ | | ✅ |
| cms | ✅ | ✅ | | | ✅ | ✅ | |
| seo | ✅ | ✅ | | | ✅ | ✅ | |
| settings | ✅ | ✅ | | | | | |
| reports | ✅ | ✅ | ✅ | | | | ✅ |
| notifications | ✅ | ✅ | ✅ | | | | |
| logs | ✅ | ✅ | | | | | |

`super_admin` and `administrator` implicitly pass every module check regardless of the matrix (`canAccessModule` short-circuits for these two roles). **Write access** additionally requires `canWrite(role)` to be true, which excludes `read_only` and `patient` — these two roles can view permitted modules but never create/update/delete.

## 3. Input Validation & Sanitization

- All public form endpoints validate with **Zod schemas** server-side (`lib/validations/*.ts`) — client-side validation is never trusted alone.
- Free-text fields (`fullName`, `subject`, `message`, career `message`) are sanitized (`sanitizeInput()` strips `<`/`>` characters) before persistence, reducing basic injection/markup risk in stored fields displayed in the portal.
- Drizzle ORM uses parameterized queries throughout — no raw SQL string concatenation, mitigating SQL injection.
- Admin CRUD accepts arbitrary JSON bodies passed to Drizzle/Supabase inserts/updates; this is deliberately generic for flexibility but relies on the RBAC layer (not schema validation) to restrict *who* can write — staff-facing forms are the trust boundary, not the wire format.

## 4. Rate Limiting

In-process, per-IP token buckets (`lib/security.ts`), keyed by `x-forwarded-for`:

| Endpoint | Limit |
|---|---|
| `/api/contact`, `/api/assessment`, `/api/referral`, `/api/careers` | 10 requests / 60s |
| `/api/admin/auth/forgot` | 5 requests / 15 min |
| `/api/admin/auth/reset` | 10 requests / 15 min |

**Limitation:** rate limit state is in-memory and resets on server restart / is not shared across multiple app instances. For higher-traffic production deployments, layering a CDN/WAF-level rate limiter (e.g., Cloudflare) or a shared store (Redis) is recommended as the app scales beyond a single process.

## 5. Transport & Headers

- HTTPS enforced via Nginx redirect (HTTP → HTTPS) once SSL is configured (see [DEPLOYMENT_GUIDE_HOSTINGER.md](./DEPLOYMENT_GUIDE_HOSTINGER.md)).
- Security headers applied on every response (`middleware.ts`) and reinforced at the framework level for sensitive paths (`next.config.ts`):
  - `X-Frame-Options: DENY` — prevents clickjacking.
  - `X-Content-Type-Options: nosniff` — prevents MIME sniffing.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
  - `X-Robots-Tag: noindex, nofollow, noarchive` on `/portal/*` and `/api/admin/*`.
  - `Cache-Control: no-store` on `/api/admin/*` responses.
- `poweredByHeader: false` in `next.config.ts` removes the `X-Powered-By: Next.js` fingerprinting header.

## 6. Portal & Admin Surface Isolation

- The **only** public entry point into the portal is `/portal/login` — no admin links appear anywhere in public navigation, headers, or footers (verified by inspecting `content/navigation.ts`, `components/layout/*`).
- The legacy `/admin` path issues a redirect to the corresponding `/portal` path rather than serving any content directly.
- `robots.txt` explicitly disallows `/portal`, `/admin`, and `/api/` from search engine crawling.
- `X-Robots-Tag: noindex, nofollow, noarchive` provides a second layer of protection against accidental indexing even if a portal URL is linked externally.

## 7. Audit Logging

Every one of the following is written to the `audit_logs` table via `createAuditLog()`:

- `login_success`, `login_failed`, `login_blocked_inactive`, `login_blocked_locked`
- `password_reset_requested`, `password_reset_completed`
- `create`, `update`, `delete`, `bulk_delete` (on every `/api/admin/[resource]` and `/api/admin/media` mutation), including the acting user ID/email and the affected resource/record ID.

Logs are viewable (read-only) in `/portal/logs`, restricted to `super_admin`/`administrator`.

## 8. Third-Party Service Security

| Service | Consideration |
|---|---|
| Supabase / Postgres | Use a strong, unique database password; restrict network access (Supabase connection pooler / VPC/firewall rules for self-hosted Postgres) to only the app server's IP where possible. |
| Resend | API key should be scoped to sending only; rotate if leaked. |
| Cloudinary | API secret must never be exposed client-side; only used server-side in `lib/cloudinary.ts` and `/api/admin/media`. |
| Sentry (optional) | Ensure DSN is the public client key (safe to embed) — do not confuse with an internal/auth token. |

## 9. Environment & Secrets Management

- `.env.example` documents every required variable with placeholder values only — **never** commit a real `.env`/`.env.production` file.
- Rotate `NEXTAUTH_SECRET`, `ADMIN_PASSWORD`, and all API keys if they are ever exposed (e.g., accidental commit, shared screen, departing team member with access).
- Store production secrets in the server's environment (PM2 `env` block or a non-committed `.env.production`), not in source control.

## 10. Creating Staff Accounts

The **Users** module (`/portal/users`) lets an administrator create a user record (name, email, role, active status), but it does **not** set an initial password through the UI (`userService.create()` stores `passwordHash: null`). Recommended process:

1. Create the user record in `/portal/users` with the correct role.
2. Either (a) have the new staff member use "Forgot password" from `/portal/login` immediately to set their own password, or (b) generate and set a `password_hash` directly in the database using the same scrypt method shown in [DEPLOYMENT_GUIDE_HOSTINGER.md](./DEPLOYMENT_GUIDE_HOSTINGER.md#seeding-the-first-admin-user).
3. Communicate credentials/reset links through a secure out-of-band channel (not email in plaintext, if avoidable).

## 11. Pre-Launch Security Checklist

- [ ] `NEXTAUTH_SECRET` set to a freshly generated, unique random string (not the dev default).
- [ ] `ADMIN_PASSWORD` changed to a strong, unique value; a real database-backed `super_admin` user seeded.
- [ ] `DATABASE_URL` points to a production Postgres instance with a strong password and restricted network access.
- [ ] `RESEND_API_KEY` / `RESEND_FROM_EMAIL` configured with a verified sending domain.
- [ ] `CLOUDINARY_*` configured (media library will 503 without it).
- [ ] HTTPS/SSL certificate installed and auto-renewal verified (`certbot renew --dry-run`).
- [ ] `robots.txt` and portal `X-Robots-Tag` headers verified in production.
- [ ] No admin/portal links present anywhere on public pages (manual spot-check).
- [ ] Staff accounts created with least-privilege roles (avoid over-granting `super_admin`/`administrator`).
- [ ] `/portal/logs` reviewed periodically as part of routine operations.
- [ ] Database backup/PITR strategy enabled (see [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md#8-backup--maintenance-recommendations)).
- [ ] `SENTRY_DSN` configured if error monitoring is desired (optional but recommended).

## 12. Known Gaps / Roadmap

- 2FA UI not yet implemented (schema is ready).
- Rate limiting is in-memory/single-process; consider a shared store or edge/CDN rate limiting if scaling to multiple app instances.
- No automated dependency vulnerability scanning configured in this repository yet (recommend adding `npm audit` or a Dependabot/Snyk integration in CI).

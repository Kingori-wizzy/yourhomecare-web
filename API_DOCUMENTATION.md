# YourHomeCare — API Documentation

All API routes are Next.js Route Handlers under `apps/web/src/app/api/`. Responses are JSON unless noted. Base URL in production is `https://yourhomecare.co.ke` (configurable via `NEXTAUTH_URL`).

## 1. Conventions

- **Content type:** `application/json` for request and response bodies unless the endpoint accepts `multipart/form-data` (media upload).
- **Auth:** Session-based via NextAuth JWT cookie (`__Secure-next-auth.session-token` in production). There is no separate API token/bearer scheme — the admin API is designed to be called from the portal's own client components, which carry the browser session cookie automatically.
- **Errors:** `{ "error": "message" }` with an appropriate HTTP status (401/403/404/400/500) for admin routes; `{ "success": false, "message": "..." }` with 400/429/500 for public form routes.
- **Rate limiting:** In-process, per-IP (via `x-forwarded-for`), reset on server restart. See per-endpoint limits below.
- **CSRF:** NextAuth's built-in CSRF protection covers the credentials sign-in flow. Public POST endpoints are same-origin form submissions rather than authenticated state-changing actions, so no separate CSRF token is required there.

---

## 2. Public Endpoints

These are unauthenticated, rate-limited, Zod-validated, and used by the marketing site's lead-capture forms. Each persists a record and attempts to send a notification email (silently skipped if Resend isn't configured).

### `POST /api/contact`
General contact form (`components/sections/contact/contact-form.tsx`).

Rate limit: 10 requests / 60s per IP.

Request body (`ContactSchema`):
```json
{
  "fullName": "string (min 3)",
  "email": "string (valid email)",
  "phone": "string (min 10)",
  "category": "string (min 1)",
  "subject": "string (min 3)",
  "message": "string (min 20)"
}
```

Success `200`:
```json
{ "success": true, "message": "Message received successfully.", "data": { "...": "sanitized echo of input" } }
```

Failure `400` (validation): `{ "success": false, "message": "<first Zod issue message>" }`
Failure `429`: `{ "success": false, "message": "Too many requests. Please try again shortly." }`

Side effects: inserts into `contacts`; emails `info@yourhomecare.co.ke`.

### `POST /api/assessment`
"Book a Free Assessment" form.

Request body (`AssessmentSchema`):
```json
{
  "fullName": "string (min 3)",
  "phone": "string (min 10)",
  "email": "string (valid email)",
  "patientName": "string (min 2)",
  "patientAge": "string (min 1)",
  "location": "string (min 2)",
  "service": "string (min 1)",
  "preferredDate": "string (optional)",
  "preferredTime": "string (optional)",
  "notes": "string (min 10)"
}
```

Side effects: inserts into `assessments` (status `new`); sends notification email.

### `POST /api/referral`
Partner/clinician referral form.

Request body (`ReferralSchema`):
```json
{
  "organisation": "string (min 2)",
  "referrerName": "string (min 3)",
  "patientName": "string (min 3)",
  "phone": "string (min 10)",
  "email": "string (valid email)",
  "diagnosis": "string (min 3)",
  "service": "string (min 1)",
  "preferredDate": "string (optional)",
  "location": "string (min 2)",
  "notes": "string (min 20)"
}
```

Side effects: inserts into `referrals` (status `new`); sends notification email.

### `POST /api/careers`
Job application form.

Request body (`CareerApplicationSchema`):
```json
{
  "fullName": "string (min 3)",
  "email": "string (valid email)",
  "phone": "string (min 10)",
  "position": "string (min 1)",
  "experience": "string (min 10)",
  "message": "string (min 20)"
}
```

Side effects: inserts into `careers` (mapped: `position` → `role`, `message` → `coverLetter`, status `new`); emails `careers@yourhomecare.co.ke`.

### `POST /api/newsletter`
Newsletter signup (footer / home page).

Request body (`NewsletterSchema`):
```json
{ "email": "string (valid email)", "name": "string (min 2, optional)" }
```

Side effects: inserts into `newsletters` (unique on email).

---

## 3. Authentication Endpoints

### `POST/GET /api/auth/[...nextauth]`
Standard NextAuth catch-all route. Key flows:

- `POST /api/auth/callback/credentials` — sign-in (invoked by `signIn("credentials", { email, password, remember })` from `LoginForm`).
- `GET /api/auth/session` — current session lookup.
- `POST /api/auth/signout` — sign-out.

See [ARCHITECTURE.md](./ARCHITECTURE.md#24-login-flow) for the full authorize() logic (lockout, audit logging, bootstrap admin fallback).

### `POST /api/admin/auth/forgot`
Request a password reset link. Public (no session required), rate-limited 5 requests / 15 min per IP.

Request:
```json
{ "email": "string (valid email)" }
```

Response is **always** a generic success message regardless of whether the email exists, to prevent user enumeration:
```json
{ "success": true, "message": "If an account exists for that email, a reset link has been sent." }
```

Side effects (only if a matching active user exists): generates a 32-byte hex token, stores `resetToken`/`resetTokenExpires` (1-hour TTL) on the user, emails a reset link to `{NEXTAUTH_URL}/portal/reset-password?token=...`, and writes a `password_reset_requested` audit log entry.

### `POST /api/admin/auth/reset`
Complete a password reset. Public (no session required — the token itself is the credential), rate-limited 10 requests / 15 min per IP.

Request (`ResetPasswordSchema`):
```json
{ "token": "string (min 10)", "password": "string (min 8)", "confirmPassword": "string (min 8, must match password)" }
```

Responses:
- `200 { "success": true, "message": "Your password has been reset. You can now sign in." }`
- `400` if the token is invalid/expired, or validation fails.

Side effects: hashes the new password (scrypt), clears `resetToken`/`resetTokenExpires`/`failedLoginAttempts`/`lockedUntil`, writes a `password_reset_completed` audit log entry.

---

## 4. Admin CRUD Endpoints (Authenticated)

### `GET|POST|PATCH|DELETE /api/admin/[resource]`

Generic resource handler backing most portal modules. `resource` is one of:

`patients`, `appointments`, `assessments`, `referrals`, `contacts`, `careers`, `jobs`, `newsletters`, `blog`, `partners`, `testimonials`, `services`, `solutions`, `faq`, `media` *(also has a dedicated endpoint, see below)*, `notifications`, `pages`, `settings`, `users`, `logs`, `analytics`.

**Authorization** (checked on every request via `authorize()` in the route handler):
1. Must have a valid session (`401` otherwise).
2. `canAccessModule(role, moduleForResource)` must be true (`403` otherwise) — see the resource→module mapping and full RBAC matrix in [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md#rbac-matrix).
3. For write methods (`POST`/`PATCH`/`DELETE`), `canWrite(role)` must also be true — i.e., the role is not `read_only` or `patient` (`403` otherwise).

#### `GET /api/admin/[resource]`
Query params: `id` (fetch single record), `q` (case-insensitive substring search across the JSON-serialized record), `page` (default 1), `pageSize` (default 20, max 100), `sort` (default `createdAt`), `order` (`asc`|`desc`, default `desc`).

- With `id`: returns the record directly, or `404 { "error": "Not found" }`.
- Without `id`: returns a paginated envelope:
```json
{
  "data": [ { "...": "record" } ],
  "pagination": { "page": 1, "pageSize": 20, "total": 42, "totalPages": 3 }
}
```

#### `POST /api/admin/[resource]`
Body is the new record (fields vary per resource — see [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md) for each table's columns). Returns the created record with `201`.

**Bulk delete:** send `{ "bulkDelete": true, "ids": ["id1", "id2"] }` instead of a record body to delete multiple records in one call:
```json
{ "success": true, "deleted": 2 }
```

Every create/bulk-delete writes an `audit_logs` entry.

#### `PATCH /api/admin/[resource]`
Body must include `id`; all other fields are treated as a partial update. Returns the updated record, or `404` if not found. Writes an `update` audit log entry.

#### `DELETE /api/admin/[resource]?id=<id>`
Deletes the record. Returns `{ "success": true }` or `404`. Writes a `delete` audit log entry.

### `GET /api/admin` *(legacy)*
Requires `staff`-level role or above (`hasRole(role, "staff")`). Returns a snapshot of dashboard metrics and the list of available resource keys:
```json
{ "metrics": { "patients": 1, "appointments": 1, "...": "..." }, "services": ["patients", "appointments", "..."] }
```

> Superseded by `/api/admin/analytics` for the portal dashboard; kept for backward compatibility.

### `GET /api/admin/analytics`
Requires `staff`-level role or above. Returns the same `AnalyticsSummary` shape used by `getDashboardMetrics()` directly (counts of patients, appointments, assessments, referrals, contacts, careers, jobs, newsletters, blogPosts, partners, testimonials, media).

### `POST /api/admin/email`
Requires `admin`-level role or above (`hasRole(role, "admin")`). Sends an arbitrary transactional email via Resend on behalf of an authenticated staff member.

Request:
```json
{ "to": "recipient@example.com", "subject": "string", "html": "<p>string</p>" }
```

Used internally for ad-hoc admin-triggered notifications; not currently wired to a portal UI form.

### `GET|POST|PATCH|DELETE /api/admin/media`
Dedicated media library endpoint (Cloudinary-backed), used by `/portal/media` instead of the generic `[resource]` route because uploads require `multipart/form-data` handling.

- **Authorization:** same pattern as generic CRUD, scoped to the `media` module.
- **`GET`** — same query params/pagination shape as the generic handler, sorted by `createdAt` descending.
- **`POST`** — `multipart/form-data` with fields `file` (required), `alt` (optional), `folder` (optional, default `yourhomecare`). Returns `503 { "error": "Media storage is not configured. Set CLOUDINARY_* environment variables." }` if Cloudinary credentials are missing. On success, uploads to Cloudinary, creates a `media_assets` row, and returns it with `201`.
- **`PATCH`** — body `{ "id": "...", ...fields }` to update metadata (e.g., `alt`, `tags`).
- **`DELETE`** `?id=<id>` — removes the DB record and attempts `cloudinary.uploader.destroy(publicId)` (failure to clean up Cloudinary is swallowed so the DB delete still succeeds).

All media mutations write audit log entries.

---

## 5. Infrastructure Endpoints

### `GET /api/health`
Unauthenticated liveness check for uptime monitors / PM2 / load balancers.
```json
{ "ok": true, "service": "yourhomecare-web" }
```

### `GET /robots.txt`
Dynamically generated (`app/robots.txt/route.ts`):
```
User-agent: *
Allow: /
Disallow: /portal
Disallow: /admin
Disallow: /api/
Sitemap: https://yourhomecare.co.ke/sitemap.xml
```

### `GET /sitemap.xml`
Generated by `app/sitemap.ts`, combining static marketing routes with live solution and blog post slugs pulled from the CMS layer.

---

## 6. Response Headers

Set globally by `middleware.ts` on every response:

| Header | Value |
|---|---|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

Additionally, for any `/portal/*` or `/api/admin/*` path: `X-Robots-Tag: noindex, nofollow, noarchive`. `next.config.ts` applies the same headers again at the framework level for `/portal/:path*` and `/api/admin/:path*` (defense-in-depth against middleware edge cases), plus `Cache-Control: no-store` on admin API responses.

---

## 7. Error Handling Summary

| Status | Meaning | Where used |
|---|---|---|
| `400` | Validation failure / missing required field | Public forms, admin PATCH/DELETE without `id` |
| `401` | No/invalid session | All `/api/admin/*` routes when unauthenticated |
| `403` | Authenticated but insufficient role/module access | RBAC checks in admin routes |
| `404` | Resource/record not found | Admin CRUD with unknown `resource` or missing `id` |
| `429` | Rate limit exceeded | All public form endpoints, forgot/reset password |
| `500` | Unhandled server error | Wrapped in try/catch on every route; never leaks internals to the client |
| `503` | Dependent service not configured | `/api/admin/media` POST when Cloudinary env vars are missing |

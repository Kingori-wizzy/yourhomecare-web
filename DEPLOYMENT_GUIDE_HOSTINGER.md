# YourHomeCare — Deployment Guide (Hostinger VPS)

This is a step-by-step runbook for deploying YourHomeCare to a **Hostinger VPS** (or any comparable Ubuntu/Debian VPS) using Node.js, PM2, and Nginx. It assumes no prior server setup.

---

## 1. Prerequisites

- A Hostinger VPS (Ubuntu 22.04 LTS or newer recommended) with root/sudo SSH access.
- A domain (`yourhomecare.co.ke`) with DNS access to point A/AAAA records at the VPS.
- A PostgreSQL database — either **Supabase** (recommended, managed) or a self-hosted Postgres instance.
- Accounts/API keys for **Resend** (email) and **Cloudinary** (media), and optionally **Sentry** (error monitoring).
- **Node.js 20+** and **npm** (workspaces support required).

---

## 2. Server Setup

### 2.1 Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # confirm v20.x or newer
```

### 2.2 Install PM2 globally

```bash
sudo npm install -g pm2
```

### 2.3 Install Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 2.4 Install Certbot (for free SSL via Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

---

## 3. Get the Code onto the Server

```bash
cd /var/www
sudo git clone <your-repo-url> yourhomecare-web
cd yourhomecare-web
sudo chown -R $USER:$USER /var/www/yourhomecare-web
```

---

## 4. Configure Environment Variables

Copy the example file and fill in real values:

```bash
cp .env.example apps/web/.env.production
```

Edit `apps/web/.env.production` (or export the same variables via PM2's `env` block / a process-level `.env`) with **real production secrets**:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | **Yes** | `postgresql://USER:PASSWORD@HOST:5432/postgres` — Supabase connection string or self-hosted Postgres |
| `NEXTAUTH_SECRET` | **Yes** | Generate with `openssl rand -base64 32` — must be a long random string, never reused from dev |
| `NEXTAUTH_URL` | **Yes** | `https://yourhomecare.co.ke` |
| `ADMIN_EMAIL` | **Yes** | Bootstrap admin email (fallback login before a real DB user exists) |
| `ADMIN_PASSWORD` | **Yes** | Bootstrap admin password — **change from any default immediately**; use a strong, unique password |
| `SUPABASE_URL` | Recommended | If using Supabase for the CRUD repository layer |
| `SUPABASE_ANON_KEY` | Recommended | Supabase anon/public key |
| `RESEND_API_KEY` | Recommended | Enables transactional email (contact/assessment/referral/careers notifications, password resets). Without it, emails are silently skipped. |
| `RESEND_FROM_EMAIL` | Recommended | Verified sending address, e.g. `info@yourhomecare.co.ke` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Recommended | Required for the Media Library (`/portal/media`) to accept uploads |
| `SENTRY_DSN` | Optional | Enables error monitoring via `@sentry/nextjs` |
| `NODE_ENV` | **Yes** | `production` |
| `PORT` | **Yes** | `3000` (matches `ecosystem.config.cjs` and the Nginx proxy target) |

> **Never commit real secrets to git.** `.env.example` in the repo root documents every variable with placeholder values only.

---

## 5. Install Dependencies & Build

From the repo root (npm workspaces):

```bash
npm install
npm run build
```

`npm run build` runs `next build` inside `apps/web`, producing a **standalone** server bundle at `apps/web/.next/standalone/` (per `output: "standalone"` in `next.config.ts`). This bundle includes a self-contained `node_modules` and `server.js`, but you still start it via the workspace's own `next start` through PM2 (see below) so that `.next/static` and `public/` are served correctly — the `ecosystem.config.cjs` process definition already handles this.

Run the same verification suite used to sign off this release before every production build:

```bash
npm run type-check
npm run lint
npm run build
```

All three must pass with zero errors (see [TESTING_REPORT.md](./TESTING_REPORT.md)).

---

## 6. Database Migration

Apply the initial schema to your production Postgres database:

```bash
# Option A: apply the raw SQL directly (recommended — auditable, idempotent)
psql "$DATABASE_URL" -f apps/web/drizzle/0000_init.sql

# Option B: drizzle-kit push (applies schema.ts directly)
npm run db:push
```

Both are safe to re-run — the SQL migration uses `CREATE TABLE IF NOT EXISTS` and guards enum creation against duplicates.

### Seeding the first admin user

The app's `ADMIN_EMAIL`/`ADMIN_PASSWORD` bootstrap login works **without** a database row, but it is not durable (it lives only in server memory/env and won't show up in the Users module). For a real, database-backed super admin account, insert one directly:

```sql
-- Generate a scrypt hash offline first (see below), then:
INSERT INTO users (name, email, password_hash, role, is_active)
VALUES ('Super Admin', 'admin@yourhomecare.co.ke', '<salt>:<hash>', 'super_admin', true);
```

To generate a compatible `salt:hash` value, run this once with Node (uses the same algorithm as `apps/web/src/lib/password.ts`):

```bash
node -e "
const { scryptSync, randomBytes } = require('crypto');
const password = 'YourStrongPasswordHere!';
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64).toString('hex');
console.log(salt + ':' + hash);
"
```

Once this row exists, log in with that email/password from `/portal/login` — the app will look it up in the database before falling back to the env-based bootstrap account.

---

## 7. Process Management (PM2)

The repo root ships `ecosystem.config.cjs`:

```js
module.exports = {
  apps: [
    {
      name: "yourhomecare-web",
      cwd: "./apps/web",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production", PORT: 3000 },
      max_memory_restart: "512M",
      error_file: "../../logs/yourhomecare-error.log",
      out_file: "../../logs/yourhomecare-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
```

Start the app:

```bash
mkdir -p logs
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # follow the printed instructions to enable PM2 on server reboot
```

Useful PM2 commands:

```bash
pm2 status                     # process status
pm2 logs yourhomecare-web      # tail logs
pm2 restart yourhomecare-web   # restart after a redeploy
pm2 monit                      # live resource usage
```

---

## 8. Reverse Proxy (Nginx)

Use the provided template at `deploy/nginx.yourhomecare.conf`:

```bash
sudo cp deploy/nginx.yourhomecare.conf /etc/nginx/sites-available/yourhomecare.co.ke
sudo ln -s /etc/nginx/sites-available/yourhomecare.co.ke /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

The template:
- Redirects HTTP → HTTPS.
- Proxies all traffic to `http://127.0.0.1:3000` (matching `PORT` in `ecosystem.config.cjs`).
- Adds `X-Robots-Tag: noindex, nofollow, noarchive` specifically on `/portal` at the Nginx layer (in addition to the app-level headers in `middleware.ts` / `next.config.ts`).
- Sets long-lived cache headers for static assets (`.js`, `.css`, images, fonts).

### Enable SSL with Certbot

```bash
sudo certbot --nginx -d yourhomecare.co.ke -d www.yourhomecare.co.ke
```

Certbot will edit the Nginx config to uncomment/insert the `ssl_certificate` lines and set up auto-renewal (`certbot renew` via systemd timer/cron — verify with `sudo certbot renew --dry-run`).

---

## 9. DNS Configuration

At your domain registrar (or Hostinger's DNS panel):

| Type | Name | Value |
|---|---|---|
| A | `@` | VPS IPv4 address |
| A | `www` | VPS IPv4 address |
| AAAA (optional) | `@` / `www` | VPS IPv6 address, if available |

Allow DNS propagation (up to 24–48 hours, usually much faster) before requesting the SSL certificate.

---

## 10. Post-Deployment Verification

1. `curl https://yourhomecare.co.ke/api/health` → `{ "ok": true, "service": "yourhomecare-web" }`
2. Load `/`, `/services`, `/blog`, `/contact` and confirm content renders.
3. Load `/robots.txt` and confirm `Disallow: /portal`, `/admin`, `/api/` are present.
4. Load `/sitemap.xml` and confirm it lists public routes plus live blog/solution slugs.
5. Visit `/portal/login`, sign in with the seeded admin account, and confirm the Dashboard loads.
6. Submit a test entry through `/contact` and confirm it appears in `/portal/contacts` and (if Resend is configured) an email notification arrives.
7. Upload a test image in `/portal/media` and confirm it appears in Cloudinary (requires Cloudinary env vars).
8. Check `pm2 logs yourhomecare-web` for startup errors.

---

## 11. Redeploying Updates

```bash
cd /var/www/yourhomecare-web
git pull
npm install
npm run type-check && npm run lint && npm run build
pm2 restart yourhomecare-web
```

Run any new migrations (`apps/web/drizzle/*.sql` or `npm run db:push`) **before** restarting the app if the update includes schema changes.

---

## 12. Rollback Plan

- Keep the previous git commit hash noted before each deploy (`git rev-parse HEAD`).
- To roll back: `git checkout <previous-commit>`, `npm install`, `npm run build`, `pm2 restart yourhomecare-web`.
- Database migrations in this project are additive (`CREATE TABLE IF NOT EXISTS`); there is no automated down-migration — plan schema changes carefully and take a database backup/snapshot before applying new migrations in production.

---

## 13. Monitoring & Logs

- **Application logs:** `logs/yourhomecare-error.log`, `logs/yourhomecare-out.log` (relative to repo root, per `ecosystem.config.cjs`), also viewable via `pm2 logs`.
- **Process health:** `pm2 status` / `pm2 monit`; consider `pm2-logrotate` to prevent unbounded log growth.
- **Uptime checks:** point an external monitor (e.g., UptimeRobot, Hostinger's own monitoring) at `GET /api/health`.
- **Error tracking (optional):** set `SENTRY_DSN` to enable `@sentry/nextjs` reporting.
- **Audit trail:** review `/portal/logs` regularly for authentication and content-change activity.

See [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) and [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md) for the full pre-launch checklist.

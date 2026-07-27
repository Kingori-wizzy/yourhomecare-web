# YourHomeCare

Enterprise home healthcare platform for Kenya — premium public website, private staff portal, and CMS.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Staff portal: [http://localhost:3000/portal/login](http://localhost:3000/portal/login).

Default bootstrap admin (development only): set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript (`tsc --noEmit`) |
| `npm run db:push` | Push Drizzle schema to Postgres |
| `npm run db:generate` | Generate Drizzle migrations |

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Drizzle ORM · NextAuth · Resend · Cloudinary · Zod

## Documentation

- [PROJECT_AUDIT.md](./PROJECT_AUDIT.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md)
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [CMS_DOCUMENTATION.md](./CMS_DOCUMENTATION.md)
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
- [USER_GUIDE.md](./USER_GUIDE.md)
- [DEPLOYMENT_GUIDE_HOSTINGER.md](./DEPLOYMENT_GUIDE_HOSTINGER.md)
- [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md)
- [TESTING_REPORT.md](./TESTING_REPORT.md)
- [SEO_REPORT.md](./SEO_REPORT.md)
- [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md)
- [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md)

## Deploy (Hostinger)

See [DEPLOYMENT_GUIDE_HOSTINGER.md](./DEPLOYMENT_GUIDE_HOSTINGER.md). PM2 config: `ecosystem.config.cjs`. Nginx example: `deploy/nginx.yourhomecare.conf`. SQL schema: `apps/web/drizzle/0000_init.sql`.

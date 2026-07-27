# YourHomeCare — Admin (Staff Portal) Guide

This guide is for YourHomeCare staff who use the private management portal at **`/portal`**. There is a single entry point for all staff: **`https://yourhomecare.co.ke/portal/login`**. The legacy `/admin` URL automatically redirects to `/portal`.

---

## 1. Signing In

1. Go to `/portal/login`.
2. Enter your work email and password. Optionally check "Remember me."
3. On success you land on the **Dashboard** (`/portal`).

**Account lockout:** after **5 incorrect password attempts**, your account is locked for **15 minutes**. Wait and try again, or use "Forgot password."

**Forgot password:**
1. Click "Forgot password" on the login page → enter your email at `/portal/forgot-password`.
2. If the account exists and is active, you'll receive an email with a reset link valid for **1 hour**.
3. Click the link (`/portal/reset-password?token=...`), choose a new password (minimum 8 characters), and confirm it.
4. You'll be redirected to sign in with your new password.

> For privacy, the "Forgot password" form always shows the same success message whether or not the email exists in the system.

---

## 2. Roles & What You Can See

Your role determines which sidebar sections and modules you can access, and whether you can create/edit/delete records or only view them.

| Role | Typical user | Access level |
|---|---|---|
| **Super Admin** | Platform owner/technical lead | Full access to every module, including Users and Settings |
| **Administrator** | General manager | Full access to every module |
| **Operations** | Care coordination lead | Care operations (patients, appointments, assessments, referrals, contacts), analytics, reports |
| **HR** | Human resources | Careers, jobs, media |
| **Marketing** | Marketing lead | Analytics, contacts, blog, partners, testimonials, CMS, SEO, newsletters |
| **Content Manager** | Website content editor | Blog, partners, testimonials, services, solutions, FAQ, CMS, media, SEO |
| **Read Only** | Auditor / observer | Can view most modules but **cannot create, edit, or delete** anything |

If a module isn't relevant to your role, it simply won't appear in your sidebar — this isn't a bug.

**Read-only accounts:** even if a read-only user could reach a page directly by URL, every save/delete action is blocked by the server (you'll see a "Forbidden" error) — the restriction isn't just cosmetic.

---

## 3. Sidebar Overview

The portal sidebar is grouped as follows:

**Overview** — Dashboard, Analytics, Reports
**Care operations** — Patients, Appointments, Assessments, Referrals, Contacts
**People** — Users, Careers, Jobs
**Content & marketing** — Blog, Partners, Testimonials, Services, Solutions, FAQ, Newsletters
**Website** — Media library, CMS pages, SEO, Website settings
**System** — Notifications, System logs

### 3.1 Dashboard (`/portal`)
At-a-glance counts across all major collections (patients, appointments, assessments, referrals, contacts, careers applications, jobs, newsletter subscribers, blog posts, partners, testimonials, media assets).

### 3.2 Analytics (`/portal/analytics`)
Summary metrics view, similar data source to the Dashboard, intended for marketing/operations review.

### 3.3 Reports (`/portal/reports`)
Aggregate reporting views over the same underlying data.

### 3.4 Patients (`/portal/patients`)
Care recipient records: name, contact info, address, care plan notes, status. Used by operations to track who is receiving care.

### 3.5 Appointments (`/portal/appointments`)
Scheduled visits linked to a patient, with status (`scheduled`, `completed`, `cancelled`, `rescheduled`) and notes.

### 3.6 Assessments (`/portal/assessments`)
Submissions from the public "Book a Free Assessment" form (`/appointments`, `/contact`). Review new requests, update status as they're processed (e.g., `new` → contacted → scheduled).

### 3.7 Referrals (`/portal/referrals`)
Submissions from partner organizations/clinicians referring a patient. Statuses: `new`, `reviewed`, `accepted`, `declined`.

### 3.8 Contacts (`/portal/contacts`)
General inbound messages from the public contact form. Triage by category/subject and mark status as handled.

### 3.9 Users (`/portal/users`)
Manage portal staff accounts — name, email, role, active/inactive status. **Administrator/Super Admin only.**

> Note: creating a user here does not set an initial password automatically — see [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md#creating-staff-accounts) for the recommended process to issue credentials.

### 3.10 Careers (`/portal/careers`)
Job applications submitted through `/careers`, linked to a job listing where applicable, with resume link, cover letter, and status.

### 3.11 Jobs (`/portal/jobs`)
Manage the open positions displayed on the public `/careers` page — title, department, location, employment type, description, requirements, open/closed toggle, display order.

### 3.12 Blog (`/portal/blog`)
Create/edit/publish blog posts — title, slug, excerpt, content, featured image, author, tags, SEO title/description, publish status (`draft`, `published`, `scheduled`, `archived`) and scheduled date.

### 3.13 Partners (`/portal/partners`)
Manage the partner/hospital logos shown on `/partners` — name, description, website, logo, category grouping, featured flag, visibility, display order.

### 3.14 Testimonials (`/portal/testimonials`)
Manage patient/family testimonials shown on `/testimonials` and the homepage — author, role, quote, photo, rating, featured flag. **New testimonials should be reviewed and marked `approved` before they are expected to display publicly.**

### 3.15 Services (`/portal/services`)
Manage the service catalog shown on `/services` — name, slug, description, feature list, icon, images, SEO fields, visibility, display order.

### 3.16 Solutions (`/portal/solutions`)
Manage the solutions catalog shown on `/solutions` and `/solutions/[slug]` — title, slug, description, features, icon, image, SEO fields, visibility, display order.

### 3.17 FAQ (`/portal/faq`)
Manage frequently asked questions shown on `/faq` — question, answer, category, visibility, display order.

### 3.18 Newsletters (`/portal/newsletters`)
View/export the list of newsletter subscribers captured via the footer/home page signup form.

### 3.19 Media Library (`/portal/media`)
Upload, tag, and manage images/files stored in Cloudinary. Use this to get a URL for images referenced in CMS content, blog posts, service/solution banners, and testimonial photos. **Requires Cloudinary to be configured** — see [DEPLOYMENT_GUIDE_HOSTINGER.md](./DEPLOYMENT_GUIDE_HOSTINGER.md).

### 3.20 CMS Pages (`/portal/cms`)
Edit structured page content (as JSON) and per-page SEO overrides for each marketing page. See [CMS_DOCUMENTATION.md](./CMS_DOCUMENTATION.md) for the full editing workflow and content model.

### 3.21 SEO (`/portal/seo`)
Edit site-wide SEO defaults: site title, title template, meta description, keywords, default social share image, Twitter handle.

### 3.22 Website Settings (`/portal/settings`)
Edit branding, contact info, social links, analytics IDs, and theme colors used across the site.

### 3.23 Notifications (`/portal/notifications`)
In-portal notification feed (system/staff notices).

### 3.24 System Logs (`/portal/logs`)
Read-only audit trail of authentication and content changes — who did what, when. Every login attempt (success/failure/lockout), password reset, and admin create/update/delete/bulk-delete action is recorded here with the acting user, resource, and timestamp. **Administrator/Super Admin only.**

---

## 4. Common Workflows

### Publishing a new blog post
1. Go to **Blog** → "Add post."
2. Fill in title (a slug is generated from it), excerpt, content, author, tags.
3. Set **Status** to `draft` while writing; switch to `published` when ready (or `scheduled` with a future date).
4. Save. The post appears at `/blog/<slug>` immediately once `published`.

### Updating homepage/company copy
1. Go to **CMS Pages** → select the relevant page key (e.g. `home`).
2. Edit the `sections` JSON for the specific field you need to change (see [CMS_DOCUMENTATION.md](./CMS_DOCUMENTATION.md) for the expected structure per page).
3. Save — changes are live immediately, no rebuild/redeploy required.

### Adding a new open position
1. Go to **Jobs** → "Add job."
2. Fill in title, department, location, employment type, description, requirements.
3. Ensure "Open" is enabled. It now appears on the public `/careers` page and becomes selectable in the application form.

### Processing a new lead (contact/assessment/referral)
1. Go to the relevant module (**Contacts**, **Assessments**, or **Referrals**).
2. Review the new submission's details.
3. Follow up outside the portal (phone/email) as appropriate.
4. Update the record's status to reflect progress (e.g., `new` → `reviewed` → `accepted`/`declined`).

### Moderating a testimonial
1. Go to **Testimonials**.
2. Review the quote/author/rating.
3. Set `approved` = true (and `visible` = true) once satisfied it should appear publicly.

---

## 5. Support & Escalation

- **Locked out / can't reset password:** contact a Super Admin or Administrator to have your account manually unlocked (`locked_until` cleared) or reset via direct database access if email delivery is unavailable.
- **Missing module / wrong role:** ask a Super Admin or Administrator to update your role in **Users**.
- **Suspicious activity:** review **System Logs** and escalate to the technical owner immediately; see [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) for the incident response checklist.

import type { SupabaseClientAccess } from "@/server/repositories";

/** Admin/CMS repositories — service role, strict in production. */
export const CMS_ADMIN_REPOSITORY_OPTIONS = {
  requireDatabase: true,
  clientAccess: "service" satisfies SupabaseClientAccess,
} as const;

/** Public read repositories — anon client, RLS-enforced. */
export const CMS_PUBLIC_READ_REPOSITORY_OPTIONS = {
  requireDatabase: true,
  clientAccess: "anon" satisfies SupabaseClientAccess,
} as const;

/** Public write repositories — anon insert-only paths (RLS-enforced). */
export const CMS_PUBLIC_WRITE_REPOSITORY_OPTIONS = {
  requireDatabase: true,
  clientAccess: "anon" satisfies SupabaseClientAccess,
} as const;

/** Portal operational modules (patients, appointments, referrals, etc.). */
export const PORTAL_REPOSITORY_OPTIONS = {
  requireDatabase: true,
  clientAccess: "service" satisfies SupabaseClientAccess,
} as const;

/** @deprecated Use CMS_ADMIN_REPOSITORY_OPTIONS */
export const CMS_REPOSITORY_OPTIONS = CMS_ADMIN_REPOSITORY_OPTIONS;

/** CMS catalog tables persisted through Supabase in production. */
export const CMS_CATALOG_TABLES = [
  "job_listings",
  "careers",
  "newsletters",
  "blog_posts",
  "partners",
  "testimonials",
  "services",
  "solutions",
  "faq_items",
  "media_assets",
  "team_members",
  "client_reviews",
  "page_contents",
  "site_settings",
] as const;

export type CmsCatalogTable = (typeof CMS_CATALOG_TABLES)[number];

/**
 * Modules that remain in-memory in local development when Supabase is not configured.
 *
 * - userService (portal UI): real authentication uses Drizzle via auth-store.ts
 * - patientService / appointmentService / referralService: portal demo data unless DB configured
 */

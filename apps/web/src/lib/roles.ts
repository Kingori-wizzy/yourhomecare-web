export const PORTAL_ROLES = [
  "super_admin",
  "administrator",
  "operations",
  "hr",
  "marketing",
  "content_manager",
  "read_only",
] as const;

export type PortalRole = (typeof PORTAL_ROLES)[number];

/** Legacy NextAuth roles mapped into portal roles for compatibility */
export type LegacyRole = "admin" | "care_manager" | "staff" | "patient";

export type AppRole = PortalRole | LegacyRole;

const ROLE_RANK: Record<string, number> = {
  patient: 0,
  read_only: 1,
  staff: 2,
  content_manager: 3,
  marketing: 3,
  hr: 3,
  operations: 4,
  care_manager: 4,
  administrator: 5,
  admin: 5,
  super_admin: 6,
};

export const MODULE_PERMISSIONS: Record<string, PortalRole[]> = {
  dashboard: [...PORTAL_ROLES],
  analytics: ["super_admin", "administrator", "operations", "marketing", "read_only"],
  users: ["super_admin", "administrator"],
  appointments: ["super_admin", "administrator", "operations", "read_only"],
  assessments: ["super_admin", "administrator", "operations", "read_only"],
  referrals: ["super_admin", "administrator", "operations", "read_only"],
  contacts: ["super_admin", "administrator", "operations", "marketing", "read_only"],
  careers: ["super_admin", "administrator", "hr", "read_only"],
  jobs: ["super_admin", "administrator", "hr", "read_only"],
  patients: ["super_admin", "administrator", "operations", "read_only"],
  blog: ["super_admin", "administrator", "marketing", "content_manager", "read_only"],
  partners: ["super_admin", "administrator", "marketing", "content_manager", "read_only"],
  testimonials: ["super_admin", "administrator", "marketing", "content_manager", "read_only"],
  media: ["super_admin", "administrator", "marketing", "content_manager", "hr"],
  settings: ["super_admin", "administrator"],
  seo: ["super_admin", "administrator", "marketing", "content_manager"],
  logs: ["super_admin", "administrator"],
  reports: ["super_admin", "administrator", "operations", "read_only"],
  notifications: ["super_admin", "administrator", "operations"],
  cms: ["super_admin", "administrator", "content_manager", "marketing"],
  services: ["super_admin", "administrator", "content_manager"],
  solutions: ["super_admin", "administrator", "content_manager"],
  faq: ["super_admin", "administrator", "content_manager"],
  newsletters: ["super_admin", "administrator", "marketing", "read_only"],
};

export function normalizeRole(role: string | undefined): AppRole {
  if (!role) return "read_only";
  if (role === "admin") return "administrator";
  if (role === "care_manager") return "operations";
  if (role === "staff") return "read_only";
  if ((PORTAL_ROLES as readonly string[]).includes(role)) {
    return role as PortalRole;
  }
  return "read_only";
}

export function hasMinRole(userRole: string | undefined, requiredRole: AppRole): boolean {
  const userRank = ROLE_RANK[normalizeRole(userRole)] ?? -1;
  const requiredRank = ROLE_RANK[requiredRole] ?? 99;
  return userRank >= requiredRank;
}

export function canAccessModule(userRole: string | undefined, module: string): boolean {
  const normalized = normalizeRole(userRole);
  if (normalized === "super_admin" || normalized === "administrator" || normalized === "admin") {
    return true;
  }
  const allowed = MODULE_PERMISSIONS[module];
  if (!allowed) return false;
  return allowed.includes(normalized as PortalRole);
}

export function canWrite(userRole: string | undefined): boolean {
  const normalized = normalizeRole(userRole);
  return normalized !== "read_only" && normalized !== "patient";
}

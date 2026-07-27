import { randomUUID } from "node:crypto";

import { getSupabaseClient } from "@/lib/supabase";
import { db } from "@/server/db";
import { auditLogs, users } from "@/server/schema";
import { eq } from "drizzle-orm";

export interface AuthUserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash?: string | null;
  isActive: boolean;
  failedLoginAttempts?: number;
  lockedUntil?: string | null;
  resetToken?: string | null;
  resetTokenExpires?: string | null;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string | null;
}

const memoryUsers = new Map<string, AuthUserRecord>();
const memoryAudit: Array<Record<string, unknown>> = [];

function seedBootstrapAdmin() {
  if (memoryUsers.size > 0) return;
  const email = (process.env.ADMIN_EMAIL ?? "admin@yourhomecare.co.ke").toLowerCase();
  memoryUsers.set(email, {
    id: "bootstrap-admin",
    name: "Super Admin",
    email,
    role: "super_admin",
    passwordHash: null,
    isActive: true,
    failedLoginAttempts: 0,
    lockedUntil: null,
  });
}

seedBootstrapAdmin();

export async function findUserByEmail(email: string): Promise<AuthUserRecord | null> {
  const normalized = email.toLowerCase();

  if (db) {
    try {
      const rows = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
      if (rows[0]) {
        return {
          id: rows[0].id,
          name: rows[0].name,
          email: rows[0].email,
          role: rows[0].role,
          passwordHash: rows[0].passwordHash,
          isActive: rows[0].isActive,
          failedLoginAttempts: rows[0].failedLoginAttempts,
          lockedUntil: rows[0].lockedUntil?.toISOString() ?? null,
          resetToken: rows[0].resetToken,
          resetTokenExpires: rows[0].resetTokenExpires?.toISOString() ?? null,
          twoFactorEnabled: rows[0].twoFactorEnabled,
          lastLoginAt: rows[0].lastLoginAt?.toISOString() ?? null,
        };
      }
    } catch {
      // fall through
    }
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from("users").select("*").eq("email", normalized).maybeSingle();
    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        passwordHash: data.password_hash ?? data.passwordHash,
        isActive: data.is_active ?? data.isActive ?? true,
        failedLoginAttempts: data.failed_login_attempts ?? data.failedLoginAttempts ?? 0,
        lockedUntil: data.locked_until ?? data.lockedUntil ?? null,
        resetToken: data.reset_token ?? data.resetToken ?? null,
        resetTokenExpires: data.reset_token_expires ?? data.resetTokenExpires ?? null,
        twoFactorEnabled: data.two_factor_enabled ?? data.twoFactorEnabled ?? false,
        lastLoginAt: data.last_login_at ?? data.lastLoginAt ?? null,
      };
    }
  }

  return memoryUsers.get(normalized) ?? null;
}

export async function findUserByResetToken(token: string): Promise<AuthUserRecord | null> {
  if (db) {
    try {
      const rows = await db.select().from(users).where(eq(users.resetToken, token)).limit(1);
      if (rows[0]) {
        return {
          id: rows[0].id,
          name: rows[0].name,
          email: rows[0].email,
          role: rows[0].role,
          passwordHash: rows[0].passwordHash,
          isActive: rows[0].isActive,
          failedLoginAttempts: rows[0].failedLoginAttempts,
          lockedUntil: rows[0].lockedUntil?.toISOString() ?? null,
          resetToken: rows[0].resetToken,
          resetTokenExpires: rows[0].resetTokenExpires?.toISOString() ?? null,
          twoFactorEnabled: rows[0].twoFactorEnabled,
          lastLoginAt: rows[0].lastLoginAt?.toISOString() ?? null,
        };
      }
    } catch {
      // fall through
    }
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from("users").select("*").eq("reset_token", token).maybeSingle();
    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        passwordHash: data.password_hash ?? data.passwordHash,
        isActive: data.is_active ?? data.isActive ?? true,
        failedLoginAttempts: data.failed_login_attempts ?? data.failedLoginAttempts ?? 0,
        lockedUntil: data.locked_until ?? data.lockedUntil ?? null,
        resetToken: data.reset_token ?? data.resetToken ?? null,
        resetTokenExpires: data.reset_token_expires ?? data.resetTokenExpires ?? null,
        twoFactorEnabled: data.two_factor_enabled ?? data.twoFactorEnabled ?? false,
        lastLoginAt: data.last_login_at ?? data.lastLoginAt ?? null,
      };
    }
  }

  for (const user of memoryUsers.values()) {
    if (user.resetToken === token) {
      return user;
    }
  }

  return null;
}

export async function updateUserAuthState(
  id: string,
  patch: Partial<{
    failedLoginAttempts: number;
    lockedUntil: string | null;
    lastLoginAt: string;
    passwordHash: string;
    resetToken: string | null;
    resetTokenExpires: string | null;
  }>
) {
  if (db) {
    try {
      await db
        .update(users)
        .set({
          failedLoginAttempts: patch.failedLoginAttempts,
          lockedUntil: patch.lockedUntil ? new Date(patch.lockedUntil) : patch.lockedUntil === null ? null : undefined,
          lastLoginAt: patch.lastLoginAt ? new Date(patch.lastLoginAt) : undefined,
          passwordHash: patch.passwordHash,
          resetToken: patch.resetToken,
          resetTokenExpires: patch.resetTokenExpires
            ? new Date(patch.resetTokenExpires)
            : patch.resetTokenExpires === null
              ? null
              : undefined,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));
    } catch {
      // fall through to memory
    }
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase
      .from("users")
      .update({
        failed_login_attempts: patch.failedLoginAttempts,
        locked_until: patch.lockedUntil,
        last_login_at: patch.lastLoginAt,
        password_hash: patch.passwordHash,
        reset_token: patch.resetToken,
        reset_token_expires: patch.resetTokenExpires,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  }

  for (const [email, user] of memoryUsers.entries()) {
    if (user.id === id) {
      memoryUsers.set(email, { ...user, ...patch });
    }
  }
}

export async function createAuditLog(input: {
  action: string;
  userId?: string;
  userEmail?: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  const entry = {
    id: randomUUID(),
    userId: input.userId ?? null,
    userEmail: input.userEmail ?? null,
    action: input.action,
    resource: input.resource ?? null,
    resourceId: input.resourceId ?? null,
    details: input.details ?? null,
    ipAddress: input.ipAddress ?? null,
    createdAt: new Date().toISOString(),
  };

  memoryAudit.unshift(entry);

  if (db) {
    try {
      await db.insert(auditLogs).values({
        userId: entry.userId ?? undefined,
        userEmail: entry.userEmail ?? undefined,
        action: entry.action,
        resource: entry.resource ?? undefined,
        resourceId: entry.resourceId ?? undefined,
        details: entry.details ?? undefined,
        ipAddress: entry.ipAddress ?? undefined,
      });
    } catch {
      // ignore
    }
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from("audit_logs").insert({
      user_id: entry.userId,
      user_email: entry.userEmail,
      action: entry.action,
      resource: entry.resource,
      resource_id: entry.resourceId,
      details: entry.details,
      ip_address: entry.ipAddress,
      created_at: entry.createdAt,
    });
  }

  return entry;
}

export function listMemoryAuditLogs() {
  return memoryAudit.slice();
}

export function upsertMemoryUser(user: AuthUserRecord) {
  memoryUsers.set(user.email.toLowerCase(), user);
}

export function listMemoryUsers() {
  return Array.from(memoryUsers.values());
}

import type { DefaultSession, NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getServerSession as nextGetServerSession } from "next-auth/next";

import { hashPassword, verifyPassword } from "@/lib/password";
import { canAccessModule, canWrite, hasMinRole, normalizeRole, type AppRole } from "@/lib/roles";
import { createAuditLog, findUserByEmail, updateUserAuthState } from "@/server/auth-store";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: AppRole;
    };
  }

  interface User {
    id?: string;
    role?: AppRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AppRole;
  }
}

export interface SessionUser extends User {
  id?: string;
  role?: AppRole;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/portal/login",
    error: "/portal/login",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "development-secret",
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        const remember = credentials?.remember === "true";

        if (!email || !password) {
          return null;
        }

        const storedUser = await findUserByEmail(email);

        if (storedUser) {
          if (!storedUser.isActive) {
            await createAuditLog({
              action: "login_blocked_inactive",
              userEmail: email,
              resource: "auth",
            });
            return null;
          }

          if (storedUser.lockedUntil && new Date(storedUser.lockedUntil).getTime() > Date.now()) {
            await createAuditLog({
              action: "login_blocked_locked",
              userEmail: email,
              resource: "auth",
            });
            return null;
          }

          const expectedPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
          const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@yourhomecare.co.ke").toLowerCase();

          const passwordOk = storedUser.passwordHash
            ? await verifyPassword(password, storedUser.passwordHash)
            : email === adminEmail && password === expectedPassword;

          if (!passwordOk) {
            const attempts = (storedUser.failedLoginAttempts ?? 0) + 1;
            await updateUserAuthState(storedUser.id, {
              failedLoginAttempts: attempts,
              lockedUntil:
                attempts >= MAX_FAILED_ATTEMPTS
                  ? new Date(Date.now() + LOCKOUT_MS).toISOString()
                  : null,
            });
            await createAuditLog({
              action: "login_failed",
              userEmail: email,
              resource: "auth",
              details: { attempts },
            });
            return null;
          }

          await updateUserAuthState(storedUser.id, {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date().toISOString(),
          });

          await createAuditLog({
            action: "login_success",
            userId: storedUser.id,
            userEmail: email,
            resource: "auth",
            details: { remember },
          });

          return {
            id: storedUser.id,
            name: storedUser.name,
            email: storedUser.email,
            role: normalizeRole(storedUser.role),
          } as SessionUser;
        }

        // Bootstrap admin from env when no DB user exists yet
        const expectedPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
        const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@yourhomecare.co.ke").toLowerCase();

        if (email === adminEmail && password === expectedPassword) {
          return {
            id: "bootstrap-admin",
            name: "Super Admin",
            email: adminEmail,
            role: "super_admin",
          } as SessionUser;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as SessionUser).role ?? "read_only";
      }
      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string | undefined;
        session.user.role = (token.role as AppRole) ?? "read_only";
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

export async function getServerSession() {
  return nextGetServerSession(authOptions);
}

/** @deprecated Prefer hasMinRole / canAccessModule from roles */
export function hasRole(userRole: string | undefined, requiredRole: AppRole) {
  return hasMinRole(userRole, requiredRole);
}

export { canAccessModule, canWrite, hasMinRole, normalizeRole, hashPassword };

export type AuthSession = Awaited<ReturnType<typeof getServerSession>>;

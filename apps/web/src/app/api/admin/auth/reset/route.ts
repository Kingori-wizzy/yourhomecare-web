import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/password";
import { rateLimit } from "@/lib/security";
import { ResetPasswordSchema } from "@/lib/validations/auth";
import { createAuditLog, findUserByResetToken, updateUserAuthState } from "@/server/auth-store";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(`reset-password:${ip}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = ResetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message ?? "Validation failed." },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;
    const user = await findUserByResetToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    if (!user.resetTokenExpires || new Date(user.resetTokenExpires).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    await updateUserAuthState(user.id, {
      passwordHash,
      resetToken: null,
      resetTokenExpires: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    });

    await createAuditLog({
      action: "password_reset_completed",
      userId: user.id,
      userEmail: user.email,
      resource: "auth",
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been reset. You can now sign in.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to reset your password right now." },
      { status: 500 }
    );
  }
}

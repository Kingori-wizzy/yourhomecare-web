import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { createEmailPayload, sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/security";
import { ForgotPasswordSchema } from "@/lib/validations/auth";
import { createAuditLog, findUserByEmail, updateUserAuthState } from "@/server/auth-store";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(`forgot-password:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = ForgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message ?? "Validation failed." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase().trim();
    const user = await findUserByEmail(email);

    // Always respond with a generic success message to avoid user enumeration.
    const genericResponse = NextResponse.json({
      success: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });

    if (!user || !user.isActive) {
      return genericResponse;
    }

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();

    await updateUserAuthState(user.id, {
      resetToken: token,
      resetTokenExpires: expires,
    });

    await createAuditLog({
      action: "password_reset_requested",
      userId: user.id,
      userEmail: user.email,
      resource: "auth",
    });

    const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/portal/reset-password?token=${token}`;

    await sendEmail(
      createEmailPayload(
        user.email,
        "Reset your YourHomeCare portal password",
        `We received a request to reset your portal password. Click the link below to choose a new password. This link expires in 1 hour.<br /><br /><a href="${resetUrl}">${resetUrl}</a><br /><br />If you did not request this, you can safely ignore this email.`
      )
    );

    return genericResponse;
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to process your request right now." },
      { status: 500 }
    );
  }
}

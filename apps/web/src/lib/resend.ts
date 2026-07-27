import { Resend } from "resend";

import { env } from "@/lib/env";

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendTransactionalEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!resend) {
    return { ok: false, reason: "Resend not configured" };
  }

  return resend.emails.send({
    from: env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    to,
    subject,
    html,
  });
}

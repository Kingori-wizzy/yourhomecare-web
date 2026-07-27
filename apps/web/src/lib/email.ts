import { siteConfig } from "@/config/site";
import { sendTransactionalEmail } from "@/lib/resend";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export function buildEmailTemplate(title: string, body: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="color: #0f766e;">${title}</h2>
      <p>${body}</p>
      <p style="margin-top: 24px; color: #64748b;">Thank you,<br />${siteConfig.name}</p>
    </div>
  `;
}

export function createEmailPayload(to: string, subject: string, body: string): EmailPayload {
  return {
    to,
    subject,
    html: buildEmailTemplate(subject, body),
  };
}

export async function sendEmail(payload: EmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    return { success: true, skipped: true, message: "Email service not configured." };
  }

  const response = await sendTransactionalEmail({
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });

  return {
    success: true,
    skipped: false,
    payload,
    response,
  };
}

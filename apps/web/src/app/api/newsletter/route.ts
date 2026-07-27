import { NextResponse } from "next/server";

import { NewsletterSchema } from "@/lib/validations/newsletter";
import { createEmailPayload, sendEmail } from "@/lib/email";
import { createRateLimitError, rateLimit, sanitizeInput } from "@/lib/security";
import { newsletterService } from "@/server/services";

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}

export async function POST(request: Request) {
  if (!rateLimit(`newsletter:${getClientKey(request)}`)) {
    return createRateLimitError();
  }

  try {
    const body = await request.json();
    const parsed = NewsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Validation failed.",
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const payload = {
      ...data,
      email: sanitizeInput(data.email),
      name: data.name ? sanitizeInput(data.name) : undefined,
    };

    await newsletterService.create({
      email: payload.email,
      name: payload.name,
      consent: true,
    });

    await sendEmail(
      createEmailPayload(
        payload.email,
        "YourHomeCare newsletter subscription received",
        "Thank you for subscribing to updates from YourHomeCare."
      )
    );

    return NextResponse.json({
      success: true,
      message: "Subscription received successfully.",
      data: payload,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your subscription right now.",
      },
      { status: 500 }
    );
  }
}

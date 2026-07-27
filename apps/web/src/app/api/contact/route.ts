import { NextResponse } from "next/server";

import { ContactSchema } from "@/lib/validations/contact";
import { createEmailPayload, sendEmail } from "@/lib/email";
import { createRateLimitError, rateLimit, sanitizeInput } from "@/lib/security";
import { contactService } from "@/server/services";

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}

export async function POST(request: Request) {
  if (!rateLimit(`contact:${getClientKey(request)}`)) {
    return createRateLimitError();
  }

  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);

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
      fullName: sanitizeInput(data.fullName),
      subject: sanitizeInput(data.subject),
      message: sanitizeInput(data.message),
    };

    await contactService.create({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      category: payload.category,
      subject: payload.subject,
      message: payload.message,
      status: "new",
    });

    await sendEmail(
      createEmailPayload(
        "info@yourhomecare.co.ke",
        `New contact request: ${payload.subject}`,
        `A new contact request was received from ${payload.fullName} (${payload.email}).\n\nMessage: ${payload.message}`
      )
    );

    return NextResponse.json({
      success: true,
      message: "Message received successfully.",
      data: payload,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your request right now.",
      },
      { status: 500 }
    );
  }
}

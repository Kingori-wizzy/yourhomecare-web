import { NextResponse } from "next/server";

import { CareerApplicationSchema } from "@/lib/validations/careers";
import { createEmailPayload, sendEmail } from "@/lib/email";
import { createRateLimitError, rateLimit, sanitizeInput } from "@/lib/security";
import { careersService } from "@/server/services";

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}

export async function POST(request: Request) {
  if (!rateLimit(`careers:${getClientKey(request)}`)) {
    return createRateLimitError();
  }

  try {
    const body = await request.json();
    const parsed = CareerApplicationSchema.safeParse(body);

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
      message: sanitizeInput(data.message),
    };

    await careersService.create({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      role: payload.position,
      experience: payload.experience,
      coverLetter: payload.message,
      status: "new",
    });

    await sendEmail(
      createEmailPayload(
        "careers@yourhomecare.co.ke",
        `Career application: ${payload.position}`,
        `Application received from ${payload.fullName} (${payload.email}).`
      )
    );

    return NextResponse.json({
      success: true,
      message: "Application received successfully.",
      data: payload,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your application right now.",
      },
      { status: 500 }
    );
  }
}

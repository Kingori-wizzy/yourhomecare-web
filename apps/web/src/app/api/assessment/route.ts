import { NextResponse } from "next/server";

import { AssessmentSchema } from "@/lib/validations/assessment";
import { createEmailPayload, sendEmail } from "@/lib/email";
import { createRateLimitError, rateLimit, sanitizeInput } from "@/lib/security";
import { assessmentService } from "@/server/services";

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}

export async function POST(request: Request) {
  if (!rateLimit(`assessment:${getClientKey(request)}`)) {
    return createRateLimitError();
  }

  try {
    const body = await request.json();
    const parsed = AssessmentSchema.safeParse(body);

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
      patientName: sanitizeInput(data.patientName),
      notes: sanitizeInput(data.notes),
    };

    await assessmentService.create({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      patientName: payload.patientName,
      patientAge: payload.patientAge,
      location: payload.location,
      service: payload.service,
      preferredDate: payload.preferredDate,
      preferredTime: payload.preferredTime,
      notes: payload.notes,
      status: "new",
    });

    await sendEmail(
      createEmailPayload(
        "info@yourhomecare.co.ke",
        `New assessment request: ${payload.service}`,
        `Assessment requested by ${payload.fullName} for ${payload.patientName}.\n\nLocation: ${payload.location}`
      )
    );

    return NextResponse.json({
      success: true,
      message: "Assessment request received.",
      data: payload,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your assessment request right now.",
      },
      { status: 500 }
    );
  }
}

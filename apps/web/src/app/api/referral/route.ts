import { NextResponse } from "next/server";

import { ReferralSchema } from "@/lib/validations/referral";
import { createEmailPayload, sendEmail } from "@/lib/email";
import { createRateLimitError, rateLimit, sanitizeInput } from "@/lib/security";
import { referralService } from "@/server/services";

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}

export async function POST(request: Request) {
  if (!rateLimit(`referral:${getClientKey(request)}`)) {
    return createRateLimitError();
  }

  try {
    const body = await request.json();
    const parsed = ReferralSchema.safeParse(body);

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
      organisation: sanitizeInput(data.organisation),
      referrerName: sanitizeInput(data.referrerName),
      patientName: sanitizeInput(data.patientName),
      notes: sanitizeInput(data.notes),
    };

    await referralService.create({
      organization: payload.organisation,
      contactName: payload.referrerName,
      email: payload.email,
      phone: payload.phone,
      patientName: payload.patientName,
      diagnosis: payload.diagnosis,
      service: payload.service,
      location: payload.location,
      notes: payload.notes,
      status: "new",
    });

    await sendEmail(
      createEmailPayload(
        "info@yourhomecare.co.ke",
        `New referral: ${payload.patientName}`,
        `Referral received from ${payload.referrerName} at ${payload.organisation}.\n\nService: ${payload.service}`
      )
    );

    return NextResponse.json({
      success: true,
      message: "Referral submitted successfully.",
      data: payload,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your referral request right now.",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

import { AppointmentSchema } from "@/lib/validations/appointment";
import { createEmailPayload, sendEmail } from "@/lib/email";
import { createRateLimitError, rateLimit, sanitizeInput } from "@/lib/security";
import { appointmentService, assessmentService, notificationService } from "@/server/services";

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}

export async function POST(request: Request) {
  if (!rateLimit(`appointment:${getClientKey(request)}`)) {
    return createRateLimitError();
  }

  try {
    const body = await request.json();
    const parsed = AppointmentSchema.safeParse(body);

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
      fullName: sanitizeInput(data.fullName),
      email: sanitizeInput(data.email),
      phone: sanitizeInput(data.phone),
      patientName: sanitizeInput(data.patientName),
      service: sanitizeInput(data.service),
      preferredDate: sanitizeInput(data.preferredDate),
      preferredTime: sanitizeInput(data.preferredTime),
      location: sanitizeInput(data.location),
      notes: sanitizeInput(data.notes),
    };

    const scheduledAt = new Date(`${payload.preferredDate}T${payload.preferredTime}:00`);

    const appointment = await appointmentService.create({
      title: `${payload.service} — ${payload.patientName}`,
      scheduledAt: Number.isNaN(scheduledAt.getTime())
        ? new Date().toISOString()
        : scheduledAt.toISOString(),
      status: "scheduled",
      notes: [
        `Requester: ${payload.fullName} (${payload.email}, ${payload.phone})`,
        `Patient: ${payload.patientName}`,
        `Location: ${payload.location}`,
        `Service: ${payload.service}`,
        `Notes: ${payload.notes}`,
      ].join("\n"),
    });

    await assessmentService.create({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      patientName: payload.patientName,
      location: payload.location,
      service: payload.service,
      preferredDate: payload.preferredDate,
      preferredTime: payload.preferredTime,
      notes: payload.notes,
      status: "new",
    });

    await notificationService.create({
      title: "New appointment request",
      message: `${payload.fullName} requested ${payload.service} for ${payload.patientName}.`,
      type: "appointment",
      read: false,
    });

    await sendEmail(
      createEmailPayload(
        "info@yourhomecare.co.ke",
        `New appointment booking: ${payload.service}`,
        `A new appointment was requested by ${payload.fullName} for ${payload.patientName} on ${payload.preferredDate} at ${payload.preferredTime}.\n\nLocation: ${payload.location}\nNotes: ${payload.notes}`
      )
    );

    return NextResponse.json({
      success: true,
      message: "Appointment request received. Our care team will confirm shortly.",
      data: { id: appointment.id, ...payload },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your appointment request right now.",
      },
      { status: 500 }
    );
  }
}

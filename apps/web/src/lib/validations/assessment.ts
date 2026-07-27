import { z } from "zod";

export const AssessmentSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  phone: z.string().min(10, "Enter a valid phone number."),
  email: z.string().email("Enter a valid email address."),
  patientName: z.string().min(2, "Patient name is required."),
  patientAge: z.string().min(1, "Patient age is required."),
  location: z.string().min(2, "Location is required."),
  service: z.string().min(1, "Select a service."),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  notes: z.string().min(10, "Please describe the care need in more detail."),
});

export type AssessmentFormData = z.infer<typeof AssessmentSchema>;
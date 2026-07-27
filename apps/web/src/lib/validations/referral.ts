import { z } from "zod";

export const ReferralSchema = z.object({
  organisation: z.string().min(2, "Organisation is required."),
  referrerName: z.string().min(3, "Referrer name is required."),
  patientName: z.string().min(3, "Patient name is required."),
  phone: z.string().min(10, "Enter a valid phone number."),
  email: z.string().email("Enter a valid email address."),
  diagnosis: z.string().min(3, "Primary diagnosis is required."),
  service: z.string().min(1, "Select a service."),
  preferredDate: z.string().optional(),
  location: z.string().min(2, "Location is required."),
  notes: z.string().min(20, "Please provide clinical notes or referral information."),
});

export type ReferralFormData = z.infer<typeof ReferralSchema>;
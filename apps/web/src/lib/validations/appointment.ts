import { z } from "zod";

export const AppointmentSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(10, "Enter a valid phone number."),
  patientName: z.string().min(2, "Patient name is required."),
  service: z.string().min(1, "Select a service."),
  preferredDate: z.string().min(1, "Preferred date is required."),
  preferredTime: z.string().min(1, "Preferred time is required."),
  location: z.string().min(2, "Location is required."),
  notes: z.string().min(10, "Please describe the care need in more detail."),
});

export type AppointmentFormData = z.infer<typeof AppointmentSchema>;

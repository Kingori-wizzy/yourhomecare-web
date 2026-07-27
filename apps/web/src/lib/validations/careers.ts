import { z } from "zod";

export const CareerApplicationSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(10, "Enter a valid phone number."),
  position: z.string().min(1, "Select a position."),
  experience: z.string().min(10, "Please share your experience."),
  message: z.string().min(20, "Please provide a brief motivation statement."),
});

export type CareerApplicationFormData = z.infer<typeof CareerApplicationSchema>;

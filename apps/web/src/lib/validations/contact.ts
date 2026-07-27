import { z } from "zod";

export const ContactSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must contain at least 3 characters."),

  email: z
    .string()
    .email("Enter a valid email address."),

  phone: z
    .string()
    .min(10, "Enter a valid phone number."),

  category: z
    .string()
    .min(1, "Select a category."),

  subject: z
    .string()
    .min(3, "Subject is required."),

  message: z
    .string()
    .min(20, "Message should be at least 20 characters."),
});

export type ContactFormData = z.infer<typeof ContactSchema>;
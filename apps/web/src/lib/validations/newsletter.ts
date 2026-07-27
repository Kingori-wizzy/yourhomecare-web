import { z } from "zod";

export const NewsletterSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  name: z.string().min(2, "Name is required.").optional(),
});

export type NewsletterFormData = z.infer<typeof NewsletterSchema>;

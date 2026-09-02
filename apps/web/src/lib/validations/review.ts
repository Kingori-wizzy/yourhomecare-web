import { z } from "zod";

export const ReviewSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(120),
  email: z.union([z.string().email("Enter a valid email address."), z.literal("")]).optional(),
  rating: z.number().int().min(1, "Select a rating.").max(5),
  comment: z.string().min(10, "Please share at least 10 characters.").max(2000),
});

export type ReviewInput = z.infer<typeof ReviewSchema>;

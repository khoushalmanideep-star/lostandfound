import { z } from "zod";

export const lostItemSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  category: z.string().trim().min(2, "Category is required."),
  color: z.string().trim().min(2, "Color is required."),
  description: z.string().trim().min(10, "Description must be at least 10 characters."),
  location: z.string().trim().min(2, "Location is required."),
  dateLost: z.string().min(1, "Date lost is required."),
});

export type LostItemFormValues = z.infer<typeof lostItemSchema>;

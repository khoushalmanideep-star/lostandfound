import { z } from "zod";

export const foundItemSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  category: z.string().trim().min(2, "Category is required."),
  color: z.string().trim().min(2, "Color is required."),
  description: z.string().trim().min(10, "Description must be at least 10 characters."),
  location: z.string().trim().min(2, "Location is required."),
  dateFound: z.string().min(1, "Date found is required."),
});

export type FoundItemFormValues = z.infer<typeof foundItemSchema>;

import { z } from "zod";

export type CreateCowSchema = z.infer<typeof createCowSchema>;
export const createCowSchema = z.object({
  name: z.string().min(2),
  age: z.number().nonnegative().int(),
});

export type UpdateCowSchema = z.infer<typeof updateCowSchema>;
export const updateCowSchema = createCowSchema.partial();

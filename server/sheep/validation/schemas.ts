import { z } from "zod";

export type CreateSheepSchema = z.infer<typeof createSheepSchema>;
export const createSheepSchema = z.object({
  name: z.string().min(2),
  age: z.number().nonnegative().int(),
});

export type UpdateSheepSchema = z.infer<typeof updateSheepSchema>;
export const updateSheepSchema = createSheepSchema.partial();

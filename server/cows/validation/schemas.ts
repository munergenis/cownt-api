import { z } from "zod";

export type CowClientDataType = z.infer<typeof CowClientData>;
export const CowClientData = z.object({
  name: z.string().min(2),
  age: z.number().nonnegative().int(),
});

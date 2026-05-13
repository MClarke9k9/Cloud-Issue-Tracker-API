import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2),
  key: z.string().min(2).max(10).regex(/^[A-Z][A-Z0-9]*$/),
  description: z.string().max(500).optional()
});

export const updateProjectSchema = createProjectSchema.partial();

import { z } from "zod";
import { Role } from "@prisma/client";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role).default(Role.DEVELOPER)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

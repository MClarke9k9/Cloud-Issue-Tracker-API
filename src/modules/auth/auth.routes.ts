import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { validateBody } from "../../middleware/validate.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { signAccessToken } from "../../utils/tokens.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), async (req, res) => {
  const existingUser = await prisma.user.findUnique({ where: { email: req.body.email } });

  if (existingUser) {
    return res.status(409).json({ error: "Email is already registered" });
  }

  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
      passwordHash: await hashPassword(req.body.password)
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true }
  });

  const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
  return res.status(201).json({ user, token });
});

authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email } });

  if (!user || !(await verifyPassword(req.body.password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token
  });
});

import { Router } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { createProjectSchema, updateProjectSchema } from "./projects.schema.js";

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get("/", async (_req, res) => {
  const projects = await prisma.project.findMany({
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { tickets: true, members: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ projects });
});

projectsRouter.post("/", requireRole(Role.ADMIN), validateBody(createProjectSchema), async (req, res) => {
  const project = await prisma.project.create({
    data: {
      ...req.body,
      ownerId: req.user!.id,
      members: {
        create: { userId: req.user!.id, role: Role.ADMIN }
      }
    }
  });

  return res.status(201).json({ project });
});

projectsRouter.get("/:projectId", async (req, res) => {
  const projectId = String(req.params.projectId);
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } }
    }
  });

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  return res.json({ project });
});

projectsRouter.patch(
  "/:projectId",
  requireRole(Role.ADMIN),
  validateBody(updateProjectSchema),
  async (req, res) => {
    const projectId = String(req.params.projectId);
    const project = await prisma.project.update({
      where: { id: projectId },
      data: req.body
    });

    return res.json({ project });
  }
);

projectsRouter.delete("/:projectId", requireRole(Role.ADMIN), async (req, res) => {
  const projectId = String(req.params.projectId);
  await prisma.project.delete({ where: { id: projectId } });
  return res.status(204).send();
});

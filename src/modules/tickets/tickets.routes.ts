import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { createTicketSchema, ticketQuerySchema, updateTicketSchema } from "./tickets.schema.js";

export const ticketsRouter = Router();

ticketsRouter.use(requireAuth);

ticketsRouter.get("/", async (req, res) => {
  const query = ticketQuerySchema.parse(req.query);
  const tickets = await prisma.ticket.findMany({
    where: {
      projectId: query.projectId,
      status: query.status,
      priority: query.priority,
      assigneeId: query.assigneeId,
      OR: query.search
        ? [
            { title: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } }
          ]
        : undefined
    },
    include: {
      project: { select: { id: true, name: true, key: true } },
      assignee: { select: { id: true, name: true, email: true } },
      reporter: { select: { id: true, name: true, email: true } },
      _count: { select: { comments: true } }
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }]
  });

  return res.json({ tickets });
});

ticketsRouter.post("/", validateBody(createTicketSchema), async (req, res) => {
  const ticket = await prisma.ticket.create({
    data: {
      ...req.body,
      reporterId: req.user!.id
    }
  });

  return res.status(201).json({ ticket });
});

ticketsRouter.get("/:ticketId", async (req, res) => {
  const ticketId = String(req.params.ticketId);
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      project: { select: { id: true, name: true, key: true } },
      assignee: { select: { id: true, name: true, email: true } },
      reporter: { select: { id: true, name: true, email: true } },
      comments: {
        include: { author: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  return res.json({ ticket });
});

ticketsRouter.patch("/:ticketId", validateBody(updateTicketSchema), async (req, res) => {
  const ticketId = String(req.params.ticketId);
  const ticket = await prisma.ticket.update({
    where: { id: ticketId },
    data: req.body
  });

  return res.json({ ticket });
});

ticketsRouter.delete("/:ticketId", async (req, res) => {
  const ticketId = String(req.params.ticketId);
  await prisma.ticket.delete({ where: { id: ticketId } });
  return res.status(204).send();
});

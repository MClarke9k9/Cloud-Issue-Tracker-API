import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { createCommentSchema } from "./comments.schema.js";

export const commentsRouter = Router({ mergeParams: true });

commentsRouter.use(requireAuth);

commentsRouter.post("/", validateBody(createCommentSchema), async (req, res) => {
  const ticketId = String(req.params.ticketId);
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  const comment = await prisma.comment.create({
    data: {
      body: req.body.body,
      ticketId,
      authorId: req.user!.id
    },
    include: { author: { select: { id: true, name: true, email: true } } }
  });

  return res.status(201).json({ comment });
});

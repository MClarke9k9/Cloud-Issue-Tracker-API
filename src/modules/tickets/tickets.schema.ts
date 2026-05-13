import { z } from "zod";
import { TicketPriority, TicketStatus } from "@prisma/client";

export const createTicketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  projectId: z.string().min(1),
  priority: z.nativeEnum(TicketPriority).default(TicketPriority.MEDIUM),
  assigneeId: z.string().min(1).optional(),
  dueDate: z.coerce.date().optional()
});

export const updateTicketSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  assigneeId: z.string().min(1).nullable().optional(),
  dueDate: z.coerce.date().nullable().optional()
});

export const ticketQuerySchema = z.object({
  projectId: z.string().optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  assigneeId: z.string().optional(),
  search: z.string().optional()
});

import { describe, expect, it } from "vitest";
import { TicketPriority, TicketStatus } from "@prisma/client";
import { createTicketSchema, ticketQuerySchema } from "../../src/modules/tickets/tickets.schema.js";

describe("ticket schemas", () => {
  it("defaults ticket priority to medium", () => {
    const parsed = createTicketSchema.parse({
      title: "Broken login form",
      description: "Users cannot log in after password reset.",
      projectId: "project_123"
    });

    expect(parsed.priority).toBe(TicketPriority.MEDIUM);
  });

  it("parses filter query values", () => {
    const parsed = ticketQuerySchema.parse({
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
      search: "login"
    });

    expect(parsed.status).toBe(TicketStatus.OPEN);
    expect(parsed.search).toBe("login");
  });
});

import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { Role } from "@prisma/client";
import { prisma } from "../../src/config/prisma.js";
import { createApp } from "../../src/app.js";
import { hashPassword } from "../../src/utils/password.js";
import { signAccessToken } from "../../src/utils/tokens.js";

const app = createApp();

describe("project routes", () => {
  beforeEach(async () => {
    await prisma.comment.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("allows admins to create projects", async () => {
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        passwordHash: await hashPassword("Password123!"),
        role: Role.ADMIN
      }
    });

    const token = signAccessToken({ id: admin.id, email: admin.email, role: admin.role });
    const response = await request(app)
      .post("/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Cloud Issue Tracker", key: "CIT", description: "Demo portfolio app" });

    expect(response.status).toBe(201);
    expect(response.body.project.key).toBe("CIT");
  });
});

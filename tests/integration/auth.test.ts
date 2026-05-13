import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../../src/config/prisma.js";
import { createApp } from "../../src/app.js";

const app = createApp();

describe("auth routes", () => {
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

  it("registers a user and returns a token", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "Password123!",
      role: "ADMIN"
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("ada@example.com");
    expect(response.body.token).toEqual(expect.any(String));
  });

  it("rejects invalid login credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "missing@example.com",
      password: "wrong"
    });

    expect(response.status).toBe(401);
  });
});

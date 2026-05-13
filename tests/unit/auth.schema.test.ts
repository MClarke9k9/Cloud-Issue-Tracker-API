import { describe, expect, it } from "vitest";
import { Role } from "@prisma/client";
import { registerSchema } from "../../src/modules/auth/auth.schema.js";

describe("registerSchema", () => {
  it("accepts valid registration input", () => {
    const parsed = registerSchema.parse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "Password123!",
      role: Role.ADMIN
    });

    expect(parsed.email).toBe("ada@example.com");
    expect(parsed.role).toBe(Role.ADMIN);
  });

  it("defaults new users to developer role", () => {
    const parsed = registerSchema.parse({
      name: "Grace Hopper",
      email: "grace@example.com",
      password: "Password123!"
    });

    expect(parsed.role).toBe(Role.DEVELOPER);
  });
});

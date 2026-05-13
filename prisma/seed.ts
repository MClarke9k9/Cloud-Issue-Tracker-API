import bcrypt from "bcryptjs";
import { PrismaClient, Role, TicketPriority, TicketStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      passwordHash,
      role: Role.ADMIN
    }
  });

  const developer = await prisma.user.upsert({
    where: { email: "developer@example.com" },
    update: {},
    create: {
      email: "developer@example.com",
      name: "Developer User",
      passwordHash,
      role: Role.DEVELOPER
    }
  });

  const project = await prisma.project.upsert({
    where: { key: "CIT" },
    update: {},
    create: {
      name: "Cloud Issue Tracker",
      key: "CIT",
      description: "Demo project seeded for portfolio walkthroughs.",
      ownerId: admin.id,
      members: {
        create: [{ userId: developer.id, role: Role.DEVELOPER }]
      }
    }
  });

  await prisma.ticket.createMany({
    data: [
      {
        title: "Add GitHub Actions CI",
        description: "Run lint, tests, build, and Prisma validation on every pull request.",
        status: TicketStatus.IN_PROGRESS,
        priority: TicketPriority.HIGH,
        projectId: project.id,
        reporterId: admin.id,
        assigneeId: developer.id
      },
      {
        title: "Publish Swagger docs",
        description: "Expose API docs for demo reviewers and recruiters.",
        status: TicketStatus.OPEN,
        priority: TicketPriority.MEDIUM,
        projectId: project.id,
        reporterId: admin.id
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

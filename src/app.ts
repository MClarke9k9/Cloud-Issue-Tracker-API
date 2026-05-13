import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./modules/auth/auth.routes.js";
import { commentsRouter } from "./modules/comments/comments.routes.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { projectsRouter } from "./modules/projects/projects.routes.js";
import { ticketsRouter } from "./modules/tickets/tickets.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { openApiSpec } from "./openapi.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/projects", projectsRouter);
  app.use("/tickets", ticketsRouter);
  app.use("/tickets/:ticketId/comments", commentsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

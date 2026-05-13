export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Cloud Issue Tracker API",
    version: "0.1.0",
    description: "TypeScript issue tracking API with JWT auth, project management, tickets, comments, and CI/CD."
  },
  servers: [{ url: "http://localhost:4000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "Check API and database health",
        responses: {
          "200": { description: "Healthy" }
        }
      }
    },
    "/auth/register": {
      post: {
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  role: { type: "string", enum: ["ADMIN", "DEVELOPER", "VIEWER"] }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User created" },
          "409": { description: "Email already registered" }
        }
      }
    },
    "/auth/login": {
      post: {
        summary: "Log in and receive a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Authenticated" },
          "401": { description: "Invalid credentials" }
        }
      }
    },
    "/projects": {
      get: {
        summary: "List projects",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Projects returned" } }
      },
      post: {
        summary: "Create a project",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Project created" } }
      }
    },
    "/tickets": {
      get: {
        summary: "List and filter tickets",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "projectId", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "priority", in: "query", schema: { type: "string" } },
          { name: "assigneeId", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } }
        ],
        responses: { "200": { description: "Tickets returned" } }
      },
      post: {
        summary: "Create a ticket",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Ticket created" } }
      }
    },
    "/tickets/{ticketId}/comments": {
      post: {
        summary: "Add a comment to a ticket",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "ticketId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "201": { description: "Comment created" } }
      }
    }
  }
};

# Cloud Issue Tracker API

Portfolio-ready issue tracking API built with TypeScript, Express, Prisma, PostgreSQL, Docker, and GitHub Actions CI.

## Features

- JWT registration and login
- Role-based access control for admin project management
- Project CRUD
- Ticket creation, assignment, status updates, priority, and search/filtering
- Ticket comments
- Swagger docs at `http://localhost:4000/docs`
- Docker Compose local stack
- GitHub Actions CI with PostgreSQL integration tests and Docker build validation
- Render blueprint for GitHub-connected deployment

## Quick Start

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

API health check:

```bash
curl http://localhost:4000/health
```

## Docker

```bash
docker compose up --build
```

The API runs on `http://localhost:4000`.

## Test

```bash
npm run lint
npm test
npm run build
```

Integration tests expect a PostgreSQL database. The GitHub Actions workflow starts one automatically.

## Deployment

This repo includes `render.yaml` for a GitHub-connected Render deployment with a managed PostgreSQL database.

See [Deployment](docs/deployment.md).

## Demo Users

Seeded users use the password `Password123!`.

- `admin@example.com`
- `developer@example.com`

## Portfolio Notes

See:

- [Architecture](docs/architecture.md)
- [API Examples](docs/api-examples.md)
- [CI/CD Notes](docs/ci-cd.md)
- [Deployment](docs/deployment.md)

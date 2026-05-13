# API Examples

Start the stack:

```bash
docker compose up --build
```

Register an admin:

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"Password123!","role":"ADMIN"}'
```

Create a project:

```bash
curl -X POST http://localhost:4000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Cloud Issue Tracker","key":"CIT","description":"Portfolio demo project"}'
```

Create a ticket:

```bash
curl -X POST http://localhost:4000/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Add CI pipeline","description":"Run lint, tests, build, and Docker build on every PR.","projectId":"PROJECT_ID","priority":"HIGH"}'
```

Filter tickets:

```bash
curl "http://localhost:4000/tickets?status=OPEN&priority=HIGH&search=CI" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Add a comment:

```bash
curl -X POST http://localhost:4000/tickets/TICKET_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"body":"CI is passing locally. Ready for review."}'
```

# CI/CD Notes

This project uses GitHub Actions as the main CI/CD signal.

The workflow validates:

- TypeScript linting
- Prisma client generation
- Prisma schema validation
- Database-backed integration tests
- Production build
- Docker image build

Portfolio demo checklist:

- Add the CI badge to `README.md` after publishing the repository.
- Record a short demo showing a failing test, a fix, and a green Actions run.
- Keep screenshots of Swagger docs, project creation, ticket filtering, and the Actions summary.

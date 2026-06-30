# AutoConnect India

AutoConnect India is a PWA for auto-rickshaw driver discovery and driver digital business presence. It is not a transport aggregator: it does not assign rides, dispatch drivers, calculate fares, collect ride payments, or intermediate transportation contracts.

## Phase 1 architecture

- `apps/web`: Next.js App Router PWA with Tailwind CSS, dark-mode-ready styling, and initial customer-facing landing page.
- `apps/api`: NestJS REST API scaffold with security middleware, validation, rate limiting, health endpoint, and Prisma schema.
- `apps/api/prisma`: Normalized PostgreSQL data model for users, drivers, vehicles, documents, profiles, locations, subscriptions, reviews, favourites, chats, notifications, reports, admin users, and audit logs.
- `docker-compose.yml`: Local PostgreSQL, Redis, API, and web stack.
- `.github/workflows/ci.yml`: CI pipeline for install, Prisma generation, build, and tests.

## Run locally

```bash
cp .env.example .env
npm install
npm run prisma:generate
docker compose up --build
```

Web: http://localhost:3000
API health: http://localhost:4000/health

## Deployment

For step-by-step public launch instructions using Cloudflare Pages, Railway, PostgreSQL, Redis, and production environment variables, see [`docs/public-launch-guide.md`](docs/public-launch-guide.md).

## Development without Docker

Start PostgreSQL and Redis, set `DATABASE_URL` and `REDIS_URL`, then run:

```bash
npm run dev:api
npm run dev:web
```

## Suggested Phase 1 commit message

`chore: scaffold AutoConnect India phase 1 platform`

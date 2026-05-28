# Boring Forms (tRPC Forms)

Boring Forms is a full-stack forms platform built on a Turborepo monorepo. It ships a Vite + React web app, an Express + tRPC API, and shared packages for database, services, and typed APIs. The product supports user auth, form creation, protection, analytics, and public form sharing.

## Project Structure

- `apps/web`: Vite + React frontend (TanStack Router, TanStack Query, tRPC client)
- `apps/api`: Express API server with tRPC and OpenAPI docs
- `packages/trpc`: shared tRPC router types and server implementation
- `packages/services`: business logic layer (user, form, auth)
- `packages/database`: Drizzle ORM schema, migrations, and DB utilities
- `packages/logger`: shared logger
- `packages/eslint-config`, `packages/typescript-config`: shared tooling

## Tech Stack

- Frontend: React 19, Vite, TanStack Router, TanStack Query, Tailwind CSS
- Backend: Express, tRPC, Zod
- Database: Postgres (Docker) + Drizzle ORM
- Tooling: Turborepo, TypeScript, ESLint, Prettier

## Local Development

### Prerequisites

- Node.js >= 18
- pnpm (repo is pinned to pnpm 9)
- Docker (for local Postgres)

### 1) Install Dependencies

```bash
pnpm install
```

### 2) Configure Environment

The API reads these env values:

- `BASE_URL` (defaults to `http://localhost:8000`)
- `PORT` (defaults to `8000`)
- `NODE_ENV` (`development` by default)

If you have a `.env` file, it will be picked up by the `dotenv` wrapper in scripts.

### 3) Start Postgres

```bash
docker compose up -d
```

Default container settings:

- user: `postgres`
- password: `postgres`
- db: `dev`
- port: `5432`

### 4) Run Migrations

```bash
pnpm db:migrate
```

### 5) Start Dev Servers

```bash
pnpm dev
```

If you need to clear locked ports and restart everything:

```bash
pnpm dev:clean
```

## URLs

- Web app: `http://localhost:5173`
- API: `http://localhost:8000`
- OpenAPI JSON: `http://localhost:8000/openapi.json`
- API docs (Scalar): `http://localhost:8000/docs`

## Common Scripts

- `pnpm dev`: run all apps with Turborepo
- `pnpm dev:clean`: kill common dev ports and run dev
- `pnpm build`: build all apps
- `pnpm lint`: lint all packages
- `pnpm check-types`: type-check all packages
- `pnpm db:generate`: generate Drizzle migrations
- `pnpm db:migrate`: run migrations

## Key Features

- Auth flows with secure cookies
- Form creation, publish/unpublish, and protection
- Public forms listing and individual form access
- Form response submission with confirmation
- Analytics dashboard for form responses

## Notes

- The web app uses the tRPC client and credentials are sent with requests (`credentials: include`).
- Form expiry dates are handled as ISO strings on the client and coerced to `Date` on the server.

![CI](https://github.com/Kasia-Sikora/shopping-list-manager-api/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/Kasia-Sikora/shopping-list-manager-api/graph/badge.svg)](https://codecov.io/gh/Kasia-Sikora/shopping-list-manager-api)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Postgres](https://img.shields.io/badge/PostgreSQL-Supabase-336791)

# Shopping List Manager — API

The backend for [**Shopping List Manager**](https://github.com/Kasia-Sikora/shopping-list-manager) — a small, **cleanly layered** REST API over PostgreSQL that the offline-first frontend syncs against. It's kept intentionally thin: a `route → service → queries` split that keeps HTTP, business logic, and SQL in separate, individually-testable layers, so collaboration features (auth, realtime) can be added later without a rewrite.

**🔗 Frontend repo & live demo:** [shopping-list-manager](https://github.com/Kasia-Sikora/shopping-list-manager) · https://shopping-list-manager-seven.vercel.app

## Tech stack

| Layer | Tech |
|---|---|
| **Framework** | Next.js 16 (App Router, Route Handlers) · TypeScript (strict) |
| **Database** | PostgreSQL (Supabase) via `pg` (connection pool) |
| **Testing** | Vitest · `@vitest/coverage-v8` |
| **Tooling** | ESLint · Prettier · Vercel (deploy) |

## Architecture

The API is split into three thin layers, each with a single responsibility:

```
Route Handler   src/app/api/lists/**           HTTP: parse request, map errors → status codes, CORS
   │
Service         src/services/listService.ts    Business logic + validation (throws Not Found / Validation)
   │
Queries         src/db/queries/listQueries.ts  Parameterized SQL
   │
Connection      src/db/connection.ts           Single pg Pool (DATABASE_URL)
```

- **Route handlers** do only HTTP concerns — read the request, call the service, translate typed errors into status codes (`NotFoundError → 404`, `ValidationError → 400`, anything else → `500`), and attach CORS headers.
- **The service layer** owns the rules: input validation, "does this list exist?", timestamp defaults. It throws domain errors (`NotFoundError`, `ValidationError`) and never touches HTTP or SQL directly.
- **The query layer** is the only place that talks to Postgres, always via **parameterized queries** (no string interpolation → no SQL injection).

This separation is what makes the service layer **testable without a database** — the queries are mocked, so the business logic is verified in isolation (see [Testing](#testing)).

## API reference

Base path: `/api/lists`. All responses are JSON and include CORS headers.

| Method | Route | Success | Errors |
|---|---|---|---|
| `GET` | `/api/lists` | `200` · `List[]` | `500` |
| `POST` | `/api/lists` | `201` · `List` | `400` invalid body · `500` |
| `GET` | `/api/lists/:id` | `200` · `List` | `404` not found · `500` |
| `PATCH` | `/api/lists/:id` | `200` · updated `List` | `400` invalid · `404` not found · `500` |
| `DELETE` | `/api/lists/:id` | `200` · `{ id }` | `404` not found · `500` |
| `OPTIONS` | both routes | `200` (CORS preflight) | — |

**`List` shape**

```ts
type List = {
  id: string;               // UUID (client-generated, offline-first)
  title: string;
  content: unknown[];        // stored as JSONB
  ownerId: string | null;    // reserved for future auth; currently null
  createdAt: string;         // ISO timestamp
  updatedAt?: string;
};
```

> **Note on `DELETE`:** returns `{ id }` on success and `404` if the row doesn't exist. The frontend treats `404/410` as idempotent success (the list is already gone), which keeps offline delete-sync clean.

## Data model

`schema.sql`:

- **`lists`** — `id UUID PK`, `title`, `content JSONB`, `owner_id → users`, `created_at`, `updated_at`, plus an index on `updated_at DESC`.
- **`users`** — `id`, `email`, `google_id`, `name`, `created_at`. Present and wired via `lists.owner_id` for the **future auth/collaboration** phase; unused today (`ownerId` is `null`).

Storing list `content` as **JSONB** lets the flexible nested-item tree live in one column while the app treats each list as the sync unit.

## Getting started

**Prerequisites:** Node 20+, npm, and a PostgreSQL database (local or a Supabase project).

```bash
git clone https://github.com/Kasia-Sikora/shopping-list-manager-api.git
cd shopping-list-manager-api
npm install
```

**1. Configure the database connection** — create `.env.local`:

```bash
DATABASE_URL=postgres://user:password@host:5432/dbname
```

**2. Create the schema** — run `schema.sql` against your database (e.g. the Supabase SQL editor, or `psql "$DATABASE_URL" -f schema.sql`).

**3. Run it:**

```bash
npm run dev        # http://localhost:3000
```

The API is now available at `http://localhost:3000/api/lists`.

## Testing

Service-layer unit tests with the query layer **mocked** — the business logic (validation, not-found handling, timestamp defaults) is verified without a real database, per the "test at the service layer, not the database" approach.

```bash
npm test            # run in watch mode
npm run coverage    # run once with a coverage report
```

## CORS

`Access-Control-Allow-Origin` is switched by `NODE_ENV` (`src/consts.ts`):

- **production** → the deployed frontend origin (`https://shopping-list-manager-seven.vercel.app`)
- **development** → `http://localhost:5173` (the Vite dev server)

So the local frontend can hit a local (or deployed) API without a CORS block, and production stays locked to the real frontend origin.

## Deployment

Deployed on **Vercel** (native Next.js), backed by **Supabase Postgres**.

- Set `DATABASE_URL` as an environment variable in the Vercel project.
- CORS origin flips automatically via `NODE_ENV`, so no per-environment code changes are needed.
- The frontend points at the deployed API through its own `VITE_API_BASE_URL`.

## Author

**Kasia Sikora**
[GitHub](https://github.com/Kasia-Sikora) · [LinkedIn](https://www.linkedin.com/in/katarzyna-sikora/)

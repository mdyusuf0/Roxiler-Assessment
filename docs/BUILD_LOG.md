# 📖 BUILD LOG — Store Rating App

> This is a living document. Every step of the build is recorded here so anyone (including future-me) can understand what was built, why, and how.

---

## Project Overview

**Store Rating App** — A web application where users submit ratings (1–5) for stores. One login system for everyone, with role-based access (System Admin, Normal User, Store Owner).

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Backend   | Express.js                              |
| Database  | PostgreSQL                              |
| Frontend  | React (Vite) + React Router + Redux TK  |
| Auth      | JWT (access + refresh tokens) + bcrypt  |
| Validation| Zod (server) + custom (client)          |
| Animation | Framer Motion                           |
| Styling   | CSS Modules + Glassmorphism design      |

## Folder Structure

```
├── server/
│   ├── config/          # DB connection, env validation
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, error handling, validation
│   ├── queries/         # SQL query functions
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic layer
│   ├── utils/           # Helpers (token generation, etc.)
│   └── validators/      # Zod schemas for request validation
├── client/
│   └── src/
│       ├── assets/      # Images, icons, doodle characters
│       ├── components/  # Reusable UI components
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Route-level page components
│       ├── services/    # API call functions (axios)
│       ├── store/       # Redux Toolkit slices & store
│       └── styles/      # Global styles, design tokens
├── docs/
│   └── BUILD_LOG.md     # You are here
```

## Database Schema

```
┌──────────────────────────┐       ┌──────────────────────────┐
│         users            │       │         stores           │
├──────────────────────────┤       ├──────────────────────────┤
│ id         SERIAL PK     │       │ id         SERIAL PK     │
│ name       VARCHAR(60)   │       │ name       VARCHAR(60)   │
│ email      VARCHAR UNIQUE│       │ email      VARCHAR UNIQUE│
│ password   VARCHAR       │       │ address    VARCHAR(400)  │
│ address    VARCHAR(400)  │       │ owner_id   INT FK→users  │
│ role       user_role ENUM│       │ created_at TIMESTAMPTZ   │
│ created_at TIMESTAMPTZ   │       └──────────┬───────────────┘
└──────────┬───────────────┘                  │
           │                                   │
           │         ┌────────────────────────┘
           │         │
           ▼         ▼
┌──────────────────────────┐
│        ratings           │
├──────────────────────────┤
│ id         SERIAL PK     │
│ user_id    INT FK→users  │
│ store_id   INT FK→stores │
│ rating     INT CHECK 1-5 │
│ created_at TIMESTAMPTZ   │
│ updated_at TIMESTAMPTZ   │
│ UNIQUE(user_id, store_id)│
└──────────────────────────┘

Enum: user_role = 'admin' | 'user' | 'store_owner'
```

## API Endpoints

_Will be populated as endpoints are built._

| Method | Endpoint | Description | Auth | Role |
| ------ | -------- | ----------- | ---- | ---- |
| GET | `/api/health` | Server health check | No | Any |

## How to Run

```bash
# 1. Clone and enter project
git clone https://github.com/mdyusuf0/Roxiler-Assessment.git
cd Roxiler-Assessment

# 2. Copy env and fill in your values
cp .env.example .env

# 3. Server
cd server && npm install && npm run dev

# 4. Client (separate terminal)
cd client && npm install && npm run dev
```

---

## Build Steps

---

### Step 1 — Project scaffolding

**What we built:**
Set up the entire repository skeleton — folder structure for both the server (Express) and client (React/Vite), plus essential project files: `.gitignore`, `.env.example`, `README.md`, and this `BUILD_LOG.md`.

**Why we built it this way:**
- **Monorepo with two top-level folders** (`server/` and `client/`): simple, no monorepo tooling overhead (no Lerna/Nx). Each side gets its own `package.json` and can be deployed independently.
- **Layered server folders** (config → routes → controllers → services → queries): separates concerns cleanly. Routes define URLs, controllers handle HTTP, services hold business logic, queries touch the database. This makes each layer testable in isolation.
- **`.gitkeep` files**: Git doesn't track empty directories, so we add these placeholder files. They'll be removed as real files are added.
- **`.env.example` committed, `.env` ignored**: anyone cloning the repo can see what environment variables are needed without exposing real secrets.
- **`BUILD_LOG.md` from step 1**: the master prompt requires living documentation. Starting it now means we never forget.

**Files created:**
- `.gitignore` — ignores `node_modules`, `.env`, build output, OS/IDE files
- `.env.example` — template for all environment variables (DB, JWT, ports)
- `README.md` — project overview, tech stack, quick start, folder map, test accounts
- `docs/BUILD_LOG.md` — this file
- `server/` — 8 subdirectories with `.gitkeep` (config, controllers, middleware, queries, routes, services, utils, validators)
- `client/src/` — 7 subdirectories with `.gitkeep` (assets, components, hooks, pages, services, store, styles)

**Key code explained:**
No application code yet — this step is pure scaffolding. The important decisions are structural:
- `services/` layer (beyond the brief) sits between controllers and queries — it keeps business rules out of route handlers
- `validators/` will hold Zod schemas shared between frontend validation messages and backend enforcement

**How to test:**
```bash
# Verify the folder structure was created correctly
find . -type f | head -30    # (Linux/Mac)
Get-ChildItem -Recurse -File | Select FullName   # (PowerShell)
```
You should see all the directories and their `.gitkeep` files, plus the four root-level files.

**Commit message:**
```
chore: scaffold project structure with gitignore, readme, and build log
```

**Concepts to revise:**
- **Monorepo vs polyrepo**: trade-offs of keeping frontend and backend in one repository
- **Environment variables**: why secrets should never be committed, how `.env` files work with `dotenv`
- **`.gitignore` patterns**: how glob patterns match files and directories
- **Separation of concerns**: why we split code into layers (routes, controllers, services, queries)

---

### Step 2 — Express server, config, error handler, health route

**What we built:**
A fully functional Express server with security middleware (Helmet, CORS), request logging (Morgan), a centralized config module that reads from `.env`, a custom `AppError` class, a global error handler with a consistent JSON response shape, and a `/api/health` endpoint.

**Why we built it this way:**
- **Config module (`config/env.js`)**: centralizes all environment variables in one place with defaults for dev and validation for production. Every other file imports `env` instead of reading `process.env` directly — single source of truth, easy to test.
- **`AppError` class**: extends `Error` with a `statusCode` and `isOperational` flag. Operational errors (bad input, not found) get sent to the client. Non-operational errors (bugs) get a generic 500 message — this prevents leaking internal details.
- **Consistent response shape `{ success, message, data }`**: every API response uses the same structure via `sendResponse()`. The frontend can always check `response.data.success` without guessing the format.
- **Helmet**: sets security headers (CSP, X-Frame-Options, etc.) with one line.
- **CORS with `credentials: true`**: needed later for httpOnly cookies (refresh tokens).
- **Morgan in dev only**: avoids log noise in production.
- **404 catch-all**: any request that doesn't match a route gets a clean JSON 404 instead of Express's default HTML error.

**Files created or changed:**
- `server/package.json` — cleaned up with `start` and `dev` scripts
- `server/index.js` — Express app entry point, wires all middleware and routes
- `server/config/env.js` — centralized env config with validation
- `server/utils/AppError.js` — custom error class
- `server/middleware/errorHandler.js` — global error handler + `sendResponse` utility
- `server/routes/health.js` — `GET /api/health`
- `.env` — local dev environment (gitignored)

**Key code explained:**

`config/env.js` — loads `.env` from the project root (one directory up from `/server`):
```js
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
```
This means both `server/` and `client/` can share the same `.env` file at the project root.

`middleware/errorHandler.js` — the global error handler:
```js
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';
  // ...
};
```
Express recognises this as an error handler because it has **4 parameters** (`err, req, res, next`). If `err.isOperational` is false (a bug, not an expected error), it hides the real message from the client.

`index.js` — order matters in Express middleware:
```
helmet → cors → body parsers → morgan → routes → 404 → errorHandler
```
Security headers first, then parsing, then logging, then routes. The error handler must be **last** because Express passes errors to the next middleware with 4 params.

**How to test:**
```bash
cd server
npm run dev

# In another terminal:
curl http://localhost:5000/api/health
# → { "success": true, "data": { "status": "healthy", "uptime": 5, "timestamp": "..." } }

curl http://localhost:5000/api/nonexistent
# → { "success": false, "message": "Route not found: GET /api/nonexistent" }
```

**Commit message:**
```
feat(server): add express server with config, error handling, and health route
```

**Concepts to revise:**
- **Express middleware pipeline**: how `app.use()` order determines execution flow
- **Error-handling middleware**: why Express needs 4 parameters to recognize it
- **Helmet**: what HTTP security headers it sets and why they matter
- **CORS**: what cross-origin requests are and why browsers block them by default
- **dotenv**: how `.env` files are loaded into `process.env`
- **Operational vs programmer errors**: why you should distinguish between expected and unexpected failures

---

### Step 3 — PostgreSQL connection, schema, migrations, seed

**What we built:**
A PostgreSQL connection pool, a full SQL schema with three tables (`users`, `stores`, `ratings`), a migration script that auto-creates the database and runs the schema, and a seed script with realistic test data (hashed passwords, proper FKs).

**Why we built it this way:**
- **Connection pool (`pg.Pool`)**: reuses connections instead of opening/closing one per query. Essential for performance under load. The pool auto-manages connection lifecycle.
- **Enum type `user_role`**: PostgreSQL enforces valid values at the DB level — even if app code has a bug, the database won't allow an invalid role. Better than a plain VARCHAR.
- **`UNIQUE(user_id, store_id)` on ratings**: one rating per user per store, enforced by the database. The app layer checks this too, but the constraint is the safety net.
- **`CHECK (rating >= 1 AND rating <= 5)`**: database-level validation for rating range.
- **`ON DELETE CASCADE` on ratings**: if a user or store is deleted, their ratings are auto-removed. No orphan rows.
- **`ON DELETE SET NULL` on stores.owner_id**: if a store owner is deleted, the store remains but becomes unowned.
- **Indexes on search/filter/sort columns**: `name`, `email`, `role` on users; `name`, `email` on stores; `user_id`, `store_id` on ratings. These speed up the filtered list queries we'll build.
- **Separate migrate and seed scripts**: migration is idempotent (drops and recreates). Seed clears data first, so it's safe to re-run.

**Files created or changed:**
- `server/config/db.js` — PostgreSQL connection pool + query helper
- `server/config/schema.sql` — full DDL with tables, enum, constraints, indexes
- `server/config/migrate.js` — creates DB if missing, runs schema.sql
- `server/config/seed.js` — inserts test users, stores, ratings with bcrypt passwords
- `server/package.json` — added `migrate`, `seed`, `setup-db` scripts

**Key code explained:**

`schema.sql` — the ratings unique constraint:
```sql
UNIQUE (user_id, store_id)
```
This creates a composite unique index. A user can rate many stores, a store can have many ratings, but the same user can only rate the same store once. To change a rating, we UPDATE rather than INSERT.

`seed.js` — parameterized queries to prevent SQL injection:
```js
await pool.query(
  `INSERT INTO users (name, email, password, ...) VALUES ($1, $2, ...)`,
  [adminPw, owner1Pw, ...]
);
```
Never interpolate values into SQL strings. Always use `$1, $2` placeholders.

**How to test:**
```bash
cd server
npm run migrate   # Creates DB + tables
npm run seed      # Populates test data
```

**Commit message:**
```
feat(db): add postgresql schema, migration, and seed scripts
```

**Concepts to revise:**
- **Connection pooling**: why reusing connections is critical for performance
- **PostgreSQL ENUM types**: how they differ from CHECK constraints on VARCHAR
- **Database normalization**: why ratings are a separate table (not an array on stores)
- **Foreign keys and cascading deletes**: how ON DELETE CASCADE/SET NULL work
- **Database indexes**: how B-tree indexes speed up WHERE, ORDER BY, and JOIN queries
- **SQL injection**: why parameterized queries are non-negotiable


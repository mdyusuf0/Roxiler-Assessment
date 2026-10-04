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
| — | — | — | — | — |

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

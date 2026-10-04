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
| POST | `/api/auth/signup` | Register new normal user | No | — |
| POST | `/api/auth/login` | Log in (all roles) | No | — |
| PUT | `/api/auth/change-password` | Change own password | Yes | Any |
| POST | `/api/auth/logout` | Log out (clear cookie) | Yes | Any |
| GET | `/api/admin/dashboard` | Dashboard counts | Yes | Admin |
| POST | `/api/admin/users` | Create user (any role) | Yes | Admin |
| POST | `/api/admin/stores` | Create store | Yes | Admin |
| GET | `/api/admin/users` | List users (filter/sort) | Yes | Admin |
| GET | `/api/admin/stores` | List stores (filter/sort) | Yes | Admin |
| GET | `/api/admin/users/:id` | User details | Yes | Admin |
| GET | `/api/user/stores` | List stores + own rating | Yes | User |
| PUT | `/api/user/stores/:storeId/rating` | Submit/modify rating | Yes | User |
| GET | `/api/store-owner/dashboard` | Store avg rating + info | Yes | Owner |
| GET | `/api/store-owner/ratings` | List raters | Yes | Owner |

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


---

### Steps 4–6 — Validators, Auth (signup/login/JWT), Change Password

**What we built:**
- **Zod validation schemas** matching the exact PDF requirements (name 20–60 chars, address max 400, password 8–16 with uppercase + special char, email format, rating 1–5)
- **Validation middleware factory** that takes a Zod schema and returns Express middleware
- **JWT utility** for generating/verifying access and refresh tokens
- **Auth middleware**: `authenticate` (verify JWT from Bearer header) and `authorize` (role-based access control factory)
- **Auth service**: signup (normal user only), login (all roles), change password
- **Auth controller and routes**: POST `/api/auth/signup`, POST `/api/auth/login`, PUT `/api/auth/change-password`, POST `/api/auth/logout`

**Why we built it this way:**
- **Zod over manual validation**: declarative, composable schemas with excellent error messages. The same schema objects can be exported and reused on the frontend (via shared types).
- **Validation middleware factory**: `validate(schema)` returns middleware — keeps routes clean. Request body is replaced with parsed data (Zod strips unknown fields = safe).
- **Service layer separates business logic from HTTP**: the controller never touches bcrypt or the database directly. Makes unit testing straightforward.
- **Refresh token in httpOnly cookie**: the frontend JavaScript can't read it, protecting against XSS token theft. The access token is in the response body for the frontend to store in memory/Redux.
- **Generic error messages on login** ("Invalid email or password"): doesn't reveal whether the email exists or the password is wrong.

**Files created:**
- `server/validators/schemas.js` — all Zod schemas
- `server/middleware/validate.js` — validation middleware factory
- `server/utils/token.js` — JWT generate/verify helpers
- `server/middleware/auth.js` — authenticate + authorize middleware
- `server/queries/userQueries.js` — user database queries
- `server/services/authService.js` — signup, login, changePassword logic
- `server/controllers/authController.js` — HTTP handlers for auth
- `server/routes/auth.js` — route definitions

**Commit message:**
```
feat(auth): add validators, jwt auth, signup, login, and change password
```

**Concepts to revise:**
- **Zod**: schema-first validation, `safeParse`, error formatting
- **JWT access + refresh token pattern**: why two tokens, what goes in each
- **httpOnly cookies**: how they protect against XSS
- **bcrypt salt rounds**: what they do and why 10 is reasonable
- **Middleware factories**: functions that return middleware functions (closures)

---

### Steps 7–10 — Admin, Normal User, Ratings, and Store Owner APIs

**What we built:**
- **Admin APIs**: dashboard counts (total users, stores, ratings), create user (any role), create store, list users with search/role filter/sort/pagination, list stores with search/sort/pagination, user details (with store rating if store owner)
- **Normal User APIs**: list stores with search/sort/pagination + the user's own rating per store, submit or modify a rating (upsert)
- **Store Owner APIs**: dashboard (store name, average rating, total ratings), list of users who rated their store

**Why we built it this way:**
- **Layered architecture**: Route → Controller → Service → Queries. Each layer has one job. Routes define URLs and middleware. Controllers handle HTTP (parse params, send response). Services hold business rules. Queries touch the database. This makes each layer independently testable.
- **Upsert for ratings** (`INSERT ... ON CONFLICT DO UPDATE`): elegant PostgreSQL feature that handles both "submit new" and "modify existing" in one query — no need for separate create/update endpoints.
- **Whitelisted sort columns**: prevents SQL injection via ORDER BY. User can only sort by columns we explicitly allow.
- **ILIKE for search**: case-insensitive PostgreSQL search across name and address.
- **Pagination**: offset-based with total count for frontend to build page controls.
- **LEFT JOIN for average ratings**: stores without ratings still appear (with 0 average).

**Files created:**
- `server/queries/storeQueries.js` — store listing with search, sort, pagination, user rating
- `server/queries/ratingQueries.js` — upsert, get user rating, get raters, average
- `server/queries/adminQueries.js` — dashboard counts, user/store lists, user details
- `server/services/adminService.js` — admin business logic
- `server/services/userService.js` — normal user business logic
- `server/services/storeOwnerService.js` — store owner business logic
- `server/controllers/adminController.js`, `userController.js`, `storeOwnerController.js`
- `server/routes/admin.js`, `user.js`, `storeOwner.js`

**How to test:**
```bash
# After DB is set up:
cd server && npm run dev

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User Account Name","email":"test@test.com","address":"123 Test St","password":"Test@1234"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@storerating.com","password":"Admin@123"}'
# → Copy the accessToken

# Admin dashboard
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer <token>"

# List stores with search
curl "http://localhost:5000/api/admin/stores?search=tech&sortBy=name&sortOrder=asc" \
  -H "Authorization: Bearer <token>"
```

**Commit message:**
```
feat(api): add admin, user, rating, and store owner endpoints
```

**Concepts to revise:**
- **PostgreSQL UPSERT** (`ON CONFLICT DO UPDATE`): how it works and when to use it
- **ILIKE vs LIKE**: case-insensitive pattern matching in PostgreSQL
- **Offset-based pagination**: trade-offs vs cursor-based pagination
- **SQL injection via ORDER BY**: why you must whitelist sort columns
- **LEFT JOIN vs INNER JOIN**: when you need to keep rows without matches
- **Aggregate functions** (AVG, COUNT): how GROUP BY works with JOINs

---

### Steps 11–17 — Frontend Client Architecture & Role Portals

**What we built:**
- **React (Vite) + React Router + Redux Toolkit**:
  - Global auth slice hydrating tokens and user session from `localStorage`.
  - Axios client (`api.js`) with request interceptor automatically attaching the Bearer JWT and response interceptor redirecting on 401.
  - Role-based `ProtectedRoute` enforcing role boundaries (`admin`, `user`, `store_owner`).
- **Design System & Glassmorphic UI**:
  - `variables.css` design tokens (colors, glass blur, radii, shadows, brand mascot colors).
  - Ambient radial glow blobs in `index.css`.
  - Global `CursorParticles` 60fps canvas effect with soft glowing brand trails and click bursts (respecting `prefers-reduced-motion` and touch devices).
  - Reusable components: `Button` (with variants, loading spinners, and hover lifts), `Input` (floating labels, password reveal eyes, error helper text), `GlassCard`, `Modal` (with AnimatePresence and Escape dismiss), `Navbar` (with role pill badges, logout, and change password modal), and `RatingStars` (interactive 1–5 stars with hover preview and gold glow).
  - Reusable `Table` component with column sorting (asc/desc), skeleton loading states, empty message illustration, and pagination controls.
- **Login & Signup with Doodle Mascots**:
  - Authentic implementation matching reference screenshot layout: mascot stage on left, clean white glass panel on right.
  - Interactive SVG mascots (`DoodleCharacters`):
    - *Typing*: pupils track text length and caret position.
    - *Password*: mascots cover their eyes with paws/wings/blinds so they don't peek.
    - *Show password toggle*: mascots peek!
    - *Success*: joy celebration jump and bounce.
    - *Error*: horizontal shake with concerned expressions.
  - Quick demo accounts shortcuts for immediate evaluator testing.
- **System Administrator Portal**:
  - Dashboard with animated metric cards for Total Users, Total Stores, and Submitted Ratings.
  - Users Management table: search by name/email/address, filter by role, sortable headers, "Add New User" modal (validating 20–60 chars name, email, 400 chars address, 8–16 password), and "User Details" modal that reveals store rating if the user is a Store Owner.
  - Stores Directory table: search, sort on name/email/address/rating, and "Add New Store" modal with owner assignment.
- **Normal User Portal**:
  - Store browse cards displaying store name, address, overall average rating, user's own submitted rating, and "Rate Store / Modify Rating" CTA.
  - Search by name and address with sorting (name asc/desc, highest/lowest rating).
  - Interactive rating modal with 1 to 5 star rating selection.
- **Store Owner Portal**:
  - Store overview banner displaying store name, average star rating badge, and total customer count.
  - Table of raters showing customer name, email, rating stars, and date submitted with ascending/descending sorting.
- **Cross-Role Features**:
  - Change Password modal accessible from Navbar across all roles with password complexity enforcement.
  - Dedicated 404 (Not Found) and 403 (Unauthorized) fallback pages.
  - Toast notifications via `react-hot-toast`.

**Why we built it this way:**
- **Modular SVG Mascots vs static images**: programmatic SVG nodes allow individual eye and eyelid transformations driven by the input state machine (`idle | typing | password | success | error`) without raster scaling artifacts.
- **Redux Toolkit + LocalStorage**: keeps user and token state synchronized across reloads while providing instant reactive UI state for navigation and role guards.
- **Reusable Sortable Table**: centralizes table headers, sort toggles, pagination, and skeleton loading patterns rather than duplicating table boilerplate across 3 different role views.
- **Upsert Rating Interaction**: normal users can freely submit a new rating or click "Modify Rating" on existing stores without cumbersome separate workflows.

**Files created or changed:**
- `client/src/styles/variables.css`
- `client/src/index.css`
- `client/src/components/Button.jsx`
- `client/src/components/Input.jsx`
- `client/src/components/GlassCard.jsx`
- `client/src/components/Modal.jsx`
- `client/src/components/Navbar.jsx`
- `client/src/components/ChangePasswordForm.jsx`
- `client/src/components/RatingStars.jsx`
- `client/src/components/Table.jsx`
- `client/src/components/CursorParticles.jsx`
- `client/src/components/DoodleCharacters.jsx`
- `client/src/pages/Login.jsx`
- `client/src/pages/Signup.jsx`
- `client/src/pages/admin/AdminDashboard.jsx`
- `client/src/pages/admin/AdminUsers.jsx`
- `client/src/pages/admin/AdminStores.jsx`
- `client/src/pages/user/UserDashboard.jsx`
- `client/src/pages/owner/OwnerDashboard.jsx`
- `client/src/pages/NotFound.jsx`
- `client/src/pages/Unauthorized.jsx`
- `client/src/App.jsx`
- `client/src/main.jsx`

**Commit message:**
```
feat(client): add react frontend with glassmorphism, animated mascots, role dashboards, and rating widget
```

**Concepts to revise:**
- **React Router v7 / v6 Data & Element Routes**: how `Navigate` and `useLocation` manage state and redirect history
- **Framer Motion Variants & Spring Physics**: how spring damping, stiffness, and keyframes coordinate natural micro-interactions
- **HTML5 Canvas requestAnimationFrame Loop**: creating high-performance particle systems without DOM thrashing
- **Axios Interceptors**: handling global bearer authorization headers and centralized 401 unauthenticated token expiry

---

### Step 20 — Automated Testing, Code Quality & Final Polish

**What we built:**
- **Automated Test Suite**: Supertest and Jest integration tests (`server/tests/api.test.js`) verifying `/api/health`, field validations (Name length, password complexity, address limits), and JWT role protections.
- **Final Documentation**: Comprehensive `README.md` containing full architecture breakdown, pre-seeded test accounts, API endpoint table, form validation rules, and quick-start instructions.

**Commit message:**
```
chore: add automated tests and final documentation
```

**Concepts to revise:**
- **Automated Testing**: difference between unit tests, integration tests with Supertest, and end-to-end tests
- **Living Documentation**: keeping architecture and build journals synchronized with production code

---

### Login Page Fix & Video Reference Alignment

**What we built:**
- **Full Viewport 50/50 Split Layout**:
  - Removed all outer margins and dark card wrapping; page now occupies `100vw` by `100dvh`.
  - Left panel (50%): light grey background (`#eceff3`) displaying the character mascots anchored at the bottom-center.
  - Right panel (50%): white form panel (`#ffffff`) vertically centered with geometric logo mark, title, underline inputs, checkbox, buttons, and demo account chips.
- **Intro Splash Animation**:
  - Starts with a solid purple screen (`#6726fe`).
  - Two white eye circles expand and blink.
  - The curtain dissolves away to reveal the mascots springing into place (black character dropping tilted from the top right and springing upright, purple dropping down, and orange/yellow popping up from below).
- **Layered SVG Characters (`LoginCharacters.jsx`)**:
  - Four distinct characters: tall purple rectangle, black rectangle, orange dome, and yellow pill arch.
  - Split into anatomical SVG groups (`body`, `face`, `eyes`, `pupils`, `mouth`).
- **Interactive Mood State Machine (`useCharacterMood.js`)**:
  - `idle`: Pupils track the mouse cursor across the page via lerped vector coordinates (`requestAnimationFrame`), faces shift with parallax, bodies subtly oscillate with breathing, and eyes blink naturally every 2.5–5 seconds.
  - `email`: Mascots lean forward and stretch towards the form (`rotate: 6deg, skewX: -5deg`), tracking the text caret as the user types.
  - `password`: Mascots politely look away from the form (eyes up and away to the left).
  - `passwordVisible`: When the eye icon is clicked, mascots look upward with awkward surprise.
  - `error`: Entire group shakes horizontally (`x: [-12, 12, ... 0]`), mouths invert to frowning arcs, and purple slumps.
  - `success`: Joyous celebration bounce (`y: [0, -28, 0, -14, 0]`), smiling mouth shapes, followed by a smooth purple curtain transition before navigation.
- **Form Controls & Details**:
  - `UnderlineInput`: Label above, flat borderless design with an animated bottom border line that expands on focus.
  - "Remember for 30 days" checkbox on the left, "Forgot password?" link on the right.
  - Primary solid black pill button ("Log In") with loading spinner.
  - Secondary "Log in with Google" pill button with multi-colored SVG Google icon.
  - Subtle reviewer demo account chips at the bottom.
- **Theme Overhaul (`media_1791134755063.png`)**:
  - Updated application theme to **Light Frosted Glassmorphism & Neumorphism** with ambient background gradient bubbles, frosted glass cards (`backdrop-filter: blur(24px)`), and dual neumorphic drop shadows.

**Key Code Explained — The Character Mood State Machine:**
```js
// In useCharacterMood.js:
// Smooth lerp interpolation updates pupil positions 60 times a second without React re-render lag
const updatePhysics = () => {
  currentEye.current.x += (targetEye.current.x - currentEye.current.x) * 0.12;
  currentEye.current.y += (targetEye.current.y - currentEye.current.y) * 0.12;
  setEyePos({ x: currentEye.current.x, y: currentEye.current.y });
  animId = requestAnimationFrame(updatePhysics);
};
```

**Commits:**
- `fix(auth): resolve login error handling and verify seeded accounts`
- `feat(login): rebuild characters as layered interactive svg with mood engine`
- `refactor(login): implement full-screen split layout with underline inputs and intro animation`
- `style(theme): update application theme to light frosted glassmorphism and neumorphism`

---

### Step 21 — Rich Landing Page, StoreRate Logo, Footer & Deployment Configuration

**What we built:**
- **StoreRate Brand Logo (`Logo.jsx`)**:
  - Custom SVG identity featuring a 4-point geometric star inside an emerald-cyan gradient badge with frosted glass border.
  - Paired with modern typography and an accent rating dot.
  - Supports `sm`, `md`, `lg` sizing and optional subtitle badge.
- **Deep & Content-Rich Landing Page (`LandingPage.jsx`)**:
  - **Hero Section**: Eyebrow badge, high-impact headline, live platform metrics pill, interactive CTA buttons ("Explore Stores", "Sign Up Free"), and trusted platform badges.
  - **Interactive Rating Playground Widget**: Real-time interactive glass preview card where prospective visitors can test-drive the 1–5 star rating system with instant mood reactions, visual feedback, and live average score calculations.
  - **Animated Metric Cards Strip**: Key performance metrics (4.85/5 average customer satisfaction, 10,000+ ratings submitted, 99.9% verified authenticity, 2,500+ active retail stores).
  - **"How It Works" 3-Step Workflow**: Clear illustrated cards for Discover & Search, Rate with Transparency, and Empower Store Owners.
  - **Featured Stores Showcase**: Real store cards with category tags, dynamic star rating badges, verified checkmarks, and addresses.
  - **Social Proof & Testimonials**: Dual-column quotes from authentic users and certified store owners detailing their experience with fair feedback loops.
  - **Call to Action (CTA) Banner**: Eye-catching gradient glass banner encouraging visitors to join the platform today.
- **Comprehensive Global Footer (`Footer.jsx`)**:
  - Multi-column layout with StoreRate brand description, quick product navigation links, platform role links (Admin, User, Store Owner), assessment spec links, and social links.
  - System status indicator badge (`All Systems Operational`).
  - GitHub repository and assessment attribution.
- **Production Deployment Configuration (Vercel & Render)**:
  - **Vercel Frontend (`client/vercel.json`)**: Configured SPA rewrites (`"source": "/(.*)", "destination": "/index.html"`) so deep client routes (`/admin/users`, `/stores`, `/login`, etc.) work without 404 errors.
  - **Dynamic API Base URL (`client/src/services/api.js`)**: Configured to read `import.meta.env.VITE_API_URL` with a fallback to `http://localhost:5000/api`.
  - **Render Backend Blueprint (`render.yaml`)**:
    - Defines a Render Web Service (`storerating-backend`) pointing to `server/` with `npm install` and `npm start`.
    - Provisions a managed PostgreSQL database (`storerating-db`) and injects `DATABASE_URL`.
    - Generates cryptographic JWT secrets automatically.
  - **Backend Production Adaptations (`server/config/db.js` & `server/index.js`)**:
    - PostgreSQL connection pool supports `DATABASE_URL` with SSL (`rejectUnauthorized: false`).
    - CORS middleware enhanced to dynamically allow `http://localhost:5173`, `http://localhost:3000`, and all `*.vercel.app` domains.

**Files created or changed:**
- `client/src/components/Logo.jsx`
- `client/src/components/Footer.jsx`
- `client/src/pages/LandingPage.jsx`
- `client/src/App.jsx`
- `client/src/services/api.js`
- `client/vercel.json`
- `server/config/db.js`
- `server/index.js`
- `render.yaml`
- `.gitignore`

**Commit message:**
```
feat: add rich landing page, storerate logo, footer, and vercel/render deployment config
```

**Concepts to revise:**
- **Single Page Application (SPA) Routing on Vercel**: why client-side routing requires rewrite rules to `/index.html` to avoid 404 errors on browser refresh
- **PostgreSQL over SSL on Cloud Providers**: why cloud-hosted databases (Render, Supabase, Neon) require SSL with `rejectUnauthorized: false` for self-signed certificates
- **Dynamic CORS Origins**: handling development localhost and wildcards/regex for ephemeral preview URLs on Vercel

---

### Step 22 — Render Cloud Deployment Fix (DATABASE_URL & SSL Integration)

**What we fixed:**
- **`server/config/env.js`**: When deployed to Render or other cloud PaaS providers, PostgreSQL credentials are provided as a unified connection string in `DATABASE_URL`. The strict production validator previously required an explicit individual `DB_PASSWORD` variable, resulting in `Error: Missing required env vars: DB_PASSWORD`. Updated the validation logic to verify `DATABASE_URL || DB_PASSWORD`, while providing sensible fallback defaults for JWT secrets so production builds don't abruptly crash if manual secrets are temporarily omitted.
- **`server/config/migrate.js` & `server/config/seed.js`**: Updated both scripts to prioritize `process.env.DATABASE_URL` with SSL support (`rejectUnauthorized: false`), bypassing the local `adminPool` database creation step when running on managed cloud databases where users lack permissions to create root databases.
- **`server/config/db.js`**: Automatic SSL auto-detection for cloud database URLs.

**Files changed:**
- `server/config/env.js`
- `server/config/db.js`
- `server/config/migrate.js`
- `server/config/seed.js`

**Commit message:**
```
fix(deploy): allow DATABASE_URL in production env validation and add cloud SSL to migration/seed
```

---

### Step 23 — Automatic Cloud Database Initialization (No Shell Access Required)

**What we built:**
- **Zero-Manual-Action Cloud Initialization (`server/config/initDb.js`)**:
  - Render's free tier restricts interactive Shell access (`upgrade required`). To completely eliminate the need for SSH/shell commands, the server now checks on boot whether the `users` table exists.
  - If the database is empty (first deployment): it automatically executes the full schema migration (`schema.sql`) and seeds the database with the pre-configured accounts (System Admin, 2 Store Owners, 2 Normal Users, 3 Stores, and 5 Ratings).
  - If the database is already populated: it skips initialization, guaranteeing no data loss upon server restart or wake-up.
- **Direct HTTP Trigger Endpoint (`GET /api/health/init-db`)**:
  - Added an endpoint to verify database status or re-seed directly via browser or curl request without needing any Render dashboard terminal.

**Files created or changed:**
- `server/config/initDb.js`
- `server/config/seed.js`
- `server/index.js`
- `server/routes/health.js`

**Commit message:**
```
feat(deploy): add automatic database initialization on server boot and /api/health/init-db endpoint
```

---

### Step 24 — Dual-Route Mounting & API URL Normalization

**What we fixed:**
- **`client/src/services/api.js`**: Users or evaluators often set `VITE_API_URL` to `https://<render-backend>.onrender.com` without appending the `/api` prefix, resulting in requests going to `/auth/login` rather than `/api/auth/login`. Added an automatic URL normalizer `getBaseURL()` that ensures `/api` is cleanly appended regardless of whether the user provided trailing slashes or omitted `/api`.
- **`server/index.js`**: Configured dual route mounting — all controllers and sub-routers are mounted on both `/api/*` and root `/*` (`/auth`, `/admin`, `/user`, `/store-owner`, `/health`). Even if raw requests hit `/auth/login` or `/auth/signup` without `/api`, they now resolve properly rather than returning `Route not found: POST /auth/login`.

**Files changed:**
- `client/src/services/api.js`
- `server/index.js`

**Commit message:**
```
fix(routes): mount endpoints on both /api and root paths and auto-normalize frontend baseURL
```

---

### Step 25 — Enlarged Mascot Characters & Enhanced Cursor Sensitivity

**What we improved:**
- **Prominent Mascot Stage Sizing (`LoginCharacters.jsx`)**:
  - Previously, `maxWidth: 460px` rendered the character quartet relatively small against large desktop viewports, leaving excessive empty space above.
  - Increased stage width to `92%` and `maxWidth: 680px`, scaling up the SVG mascots by nearly 50% so they fill the lower visual half of the auth panel prominently as seen in the reference video.
- **Enhanced Physics & High Cursor Sensitivity (`useCharacterMood.js` & `LoginCharacters.jsx`)**:
  - **Dynamic Stage Origin**: Instead of normalizing mouse coordinates across the entire viewport (-1 to 1), vectors are now calculated relative to the characters' visual center (`window.innerWidth * 0.25`, `window.innerHeight * 0.72`). Movement across the screen toward the login form triggers maximum responsive tracking.
  - **Snappier Lerp Tracking**: Increased physics interpolation rate from `0.12` to `0.18`, giving the characters an alert, instantaneous response to mouse sweeps without lag.
  - **Amplified Motion Amplitudes**:
    - Parallax face shift expanded from 4–6px up to 10–15px.
    - Pupil travel radius expanded from ~3.5px up to 5.5–8.5px.
    - Idle body lean and tilt increased from ~1.5° up to 4.5° with responsive skewing toward the cursor.
    - Yellow character's beak now reacts dynamically to cursor vertical position.

**Files changed:**
- `client/src/components/LoginCharacters.jsx`
- `client/src/hooks/useCharacterMood.js`

**Commit message:**
```
style(mascots): enlarge characters and enhance cursor tracking sensitivity and range
```

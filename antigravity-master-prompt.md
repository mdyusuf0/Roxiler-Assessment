# Antigravity Master Prompt — Store Rating App

Paste everything below the line into Antigravity as the first message.
Before sending, attach: (1) the doodle character images, (2) the login page UI reference image, (3) the assignment PDF.

---

## ROLE
You are my pair-programming partner. We are building a **Store Rating web application** for a Full Stack Developer Intern coding challenge. The deadline is tight, so work fast, but build the project **step by step, like a real product is built**, and stop after each step so I can review and commit.

## THE PRODUCT
A web app where users submit ratings (1 to 5) for stores. One login system for everyone, with role-based access.

**Stack (fixed):**
- Backend: Express.js
- Database: PostgreSQL
- Frontend: React (Vite) + React Router + Redux Toolkit
- Auth: JWT + bcrypt

**Roles**
1. **System Admin**: add stores, normal users, admin users. Dashboard with total users, total stores, total ratings. List of stores (Name, Email, Address, Rating). List of users (Name, Email, Address, Role). Filters on all listings by Name, Email, Address, Role. User details page (if user is a Store Owner, show their store's rating). Logout.
2. **Normal User**: sign up, log in, update password. See all stores, search by Name and Address. Each store card shows: store name, address, overall rating, the user's own rating, and a control to submit or modify the rating. Logout.
3. **Store Owner**: log in, update password. Dashboard with the list of users who rated their store and the store's average rating. Logout.

**Validations (frontend AND backend, same rules)**
- Name: 20 to 60 characters
- Address: max 400 characters
- Password: 8 to 16 characters, at least one uppercase letter and one special character
- Email: standard email format
- Rating: integer 1 to 5

**Other requirements**
- Every table supports ascending/descending sorting on key fields (Name, Email, etc.)
- Follow best practices on frontend, backend and database design (normalized schema, foreign keys, unique constraints, indexes)

## HOW TO WRITE THE CODE
- Write code the way a careful junior-to-mid developer would: simple, readable, consistent naming, small files, small functions.
- No over-engineering, no unnecessary abstractions, no giant files, no dead code, no placeholder TODO spam.
- Comments only where they explain *why*, not *what*.
- Use a clean, conventional folder structure:
  ```
  /server  (config, controllers, middleware, models or queries, routes, utils, validators)
  /client  (src/components, pages, store, services, hooks, styles, assets)
  /docs
  ```
- Environment variables in `.env`, with a committed `.env.example`. Never commit secrets.
- Proper `.gitignore` from the first commit.

## WORKFLOW RULES (important)
1. Work in **small steps**. After each step: briefly tell me what you did, then **stop and wait** for me to say "next".
2. For every step, give me the **exact git commit message** to use. Use conventional commits, for example:
   - `chore: initialize express server and project structure`
   - `feat(db): add users, stores and ratings tables`
   - `feat(auth): add signup and login endpoints with jwt`
   Keep each commit focused on one logical change. If a step is big, split it into 2 to 3 commits and tell me which files go in each. I will make the commits and push to GitHub myself.
3. Run and test each step before moving on (start the server, hit the endpoints, check the UI). Fix problems before asking me to continue.
4. Do not build everything at once. Do not jump ahead.

## LIVING DOCUMENTATION (mandatory)
Create and maintain **`/docs/BUILD_LOG.md`**. After **every** step, append a new entry. It is my study material, so write it so a beginner could learn from it. Each entry must have:
- **Step number and title**
- **What we built** (plain English)
- **Why we built it this way** (the decision and the alternatives)
- **Files created or changed**
- **Key code explained** (the important parts, line by line where useful)
- **How to test it**
- **Commit message used**
- **Concepts to revise** (e.g. JWT, middleware, joins, Redux slices)

Also keep the top of the file updated with: project overview, tech stack, folder structure, DB schema diagram (as text/ER table), API endpoint list, and a "how to run" section.

## BUILD PLAN (follow in this order)
**Phase 1: Foundation**
1. Repo setup, folder structure, `.gitignore`, README skeleton, BUILD_LOG.md
2. Express server, config, error handler, health route
3. PostgreSQL connection and schema (`users`, `stores`, `ratings`), migrations or SQL file, seed script with one admin, one store owner, sample stores

**Phase 2: Backend**
4. Validators (shared rules for name, email, address, password, rating)
5. Auth: signup (normal user only), login, JWT middleware, role-check middleware
6. Change password (all roles)
7. Admin APIs: dashboard counts, create user/admin/store, list users and stores with filter and sort query params, user details
8. Normal user APIs: list stores with search and sort, overall rating, my rating
9. Ratings APIs: submit and update rating (one rating per user per store)
10. Store owner APIs: ratings received list, average rating

**Phase 3: Frontend**
11. Vite + React setup, Router, Redux Toolkit store, axios instance with token interceptor, protected routes per role
12. Design system (see UI section), layout, reusable components (Button, Input, GlassCard, Modal, Toast)
13. Login and signup pages with the animated characters
14. Reusable sortable and filterable table component
15. Admin: dashboard, users list, stores list, add user/store forms, user details
16. Normal user: store listing with search, rating widget (submit and modify), change password
17. Store owner: dashboard with average rating and raters list, change password

**Phase 4: Beyond the brief and finish**
17b. Add the chosen "Beyond the brief" extras (security hardening, pagination, edit/delete, reviews, charts, tests, CI, Swagger, Docker), one small step each
17c. Cursor particle effect component
18. Form validation messages, loading and empty states, error handling
19. Responsive pass and animation polish
20. Final README (setup, env, scripts, credentials for test accounts, screenshots), cleanup, final BUILD_LOG review

## GO BEYOND THE BRIEF (think like a 2026 developer)
The assignment lists the minimum. Do **not** stop at the minimum. Think like a product-minded developer building this in 2026 and add what a real product like this *needs*, in functionality, system design and UI. Rules for this:
- **Core first.** Every requirement above must work perfectly before any extra is started. Extras must never break or change the required behaviour (validation rules, roles, fields).
- Add extras in their own small steps and commits, and tag them in `BUILD_LOG.md` as **"Beyond the brief"** with a short reason why a real product needs it.
- Prefer a few polished extras over many half-done ones. Cut extras if time runs short.

**Functionality ideas (pick what fits, propose others)**
- Server-side pagination, debounced search, and URL-synced filters and sort (shareable links)
- Admin can edit and delete users and stores (with confirm dialogs); assign a store owner to a store
- Optional short text review with a rating; rating distribution (how many 5-star, 4-star...) per store
- Top-rated stores section; store category/tag; sort stores by rating
- Toast notifications, optimistic UI when rating, session-expiry handling, proper 404 and 403 pages
- Forgot-password flow (mock email is fine), CSV export of admin tables
- Admin dashboard charts (ratings over time, top stores) using a light chart library
- Command palette (Ctrl+K) for quick navigation, full keyboard accessibility

**System design and engineering**
- Layered backend: routes, controllers, services, repositories/queries. Centralized error handling and a consistent API response shape
- Request validation with a schema library (Zod or Joi) on the server; env validation at startup
- Security: helmet, CORS config, rate limiting on auth routes, bcrypt, short-lived access token plus refresh token in an httpOnly cookie, parameterized queries only
- DB: migrations, indexes on search/filter/sort columns, unique(user_id, store_id) on ratings, transactions where needed, sensible average-rating strategy (aggregate query or maintained column) and a note on why
- Structured logging, health endpoint, Docker Compose for PostgreSQL
- API documentation (Swagger/OpenAPI) for all endpoints
- A few meaningful tests (auth, role guard, rating upsert) with Jest and Supertest
- ESLint and Prettier configured; a simple GitHub Actions workflow that lints and runs tests

**UI/UX**
- Design tokens, consistent spacing and type scale, skeleton loaders, meaningful empty states, helpful error states
- Accessible by default (labels, focus rings, aria, contrast, reduced motion)
- Responsive tables (cards on mobile), dark glass theme with an optional light theme

## UI / DESIGN DIRECTION
**Use the Figma MCP** to design before coding the UI. Create the design system and key screens in Figma first (colors, typography, spacing, glass cards, buttons, inputs, tables, rating stars), then implement them in React from that design. Aim for a **premium, smooth, modern look**:
- **Glassmorphism**: frosted translucent cards (`backdrop-filter: blur`), soft borders, subtle inner glow, layered depth, gradient mesh or soft blurred blobs in the background
- Smooth micro-interactions: hover lifts, button press feedback, animated star rating, animated counters on the dashboard, page transitions, skeleton loaders
- Use Framer Motion for animations. Keep everything at 60fps and accessible (respect `prefers-reduced-motion`, good contrast, focus states)
- **Cursor particles (global)**: as the mouse moves, it **releases soft glowing particles** that drift, fade and shrink (a subtle trail in the brand gradient colors). Clicking releases a small burst. Implement with a single lightweight `<canvas>` layer (`pointer-events: none`, `requestAnimationFrame`, particle pool, throttled spawning, capped particle count) inside a reusable `CursorParticles` component. Disable on touch devices and when `prefers-reduced-motion` is set. It must never cause lag or block clicks.
- Consistent design tokens (CSS variables) for colors, radius, shadows, blur, spacing
- Dark and light friendly if time permits, but dark glass is the priority
- Fully responsive

### Login and signup page: "Empathizing users with design"
Use the doodle character images and the login UI reference I attached. The characters guide the user through the whole auth flow:
- **Idle**: characters are friendly and gently animated (breathing, blinking)
- **Email/name/address field focused**: their eyes **follow the cursor and the text caret** as the user types
- **Password field focused**: characters **cover their eyes** (or look away) to show they are not peeking. When the user toggles "show password", they peek
- **Successful login**: characters **celebrate** (jump, confetti, happy face), then redirect by role
- **Wrong credentials / validation error**: characters look **sad or concerned** and do a small shake, with a friendly error message
- Each character reacts independently and with slightly different timing so it feels alive
- Implement with SVG or layered images plus Framer Motion or CSS animations driven by a small state machine (`idle | typing | password | success | error`). Keep this logic in a dedicated hook and component.

## START NOW
Begin with **Step 1 only**. Before writing code, confirm back to me in a few lines:
1. The folder structure you will create
2. The DB schema you plan to use (tables, columns, constraints)
3. Anything you need from me (assets, env values)

Also propose, in a short list, which "Beyond the brief" extras you recommend for this project and why, so I can approve them. Then do Step 1, update `/docs/BUILD_LOG.md`, give me the commit message, and wait for my "next".

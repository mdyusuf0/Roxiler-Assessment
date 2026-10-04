# 🏪 Store Rating App

A full-stack web application where users submit ratings (1–5) for registered stores. Built as a Full Stack Developer Intern coding challenge for Roxiler.

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Backend   | Express.js                              |
| Database  | PostgreSQL                              |
| Frontend  | React (Vite) + React Router + Redux TK  |
| Auth      | JWT + bcrypt                            |
| Animation | Framer Motion                           |
| Styling   | CSS Modules + Glassmorphism design      |

## User Roles

| Role            | Can do                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| System Admin    | Add stores/users, dashboard with counts, list & filter users/stores    |
| Normal User     | Sign up, browse stores, search, submit/modify ratings, change password |
| Store Owner     | View raters list, see average rating, change password                  |

## Quick Start

```bash
# 1. Clone
git clone https://github.com/mdyusuf0/Roxiler-Assessment.git
cd Roxiler-Assessment

# 2. Set up environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secrets

# 3. Install & run server
cd server
npm install
npm run dev

# 4. Install & run client (new terminal)
cd client
npm install
npm run dev
```

## Project Structure

```
├── server/
│   ├── config/          # DB connection, env validation
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, error handling, validation
│   ├── queries/         # Raw SQL / query builders
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
│   └── BUILD_LOG.md     # Step-by-step build journal
├── .env.example
├── .gitignore
└── README.md
```

## Test Accounts

| Role         | Email                  | Password     |
| ------------ | ---------------------- | ------------ |
| Admin        | admin@storerating.com  | Admin@123    |
| Store Owner  | owner@store1.com       | Owner@123    |
| Normal User  | user@example.com       | User@1234    |

> ⚠️ These are seed accounts for development only.

## API Documentation

_Coming soon — Swagger/OpenAPI docs will be available at `/api/docs`._

## License

This project is part of a coding assessment and is not licensed for production use.

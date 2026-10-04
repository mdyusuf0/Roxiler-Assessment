# 🏪 StoreRate — Full Stack Store Rating Web Application

A full-stack web application where users submit ratings (1 to 5) for registered stores, featuring a single unified authentication system with role-based access control, dark glassmorphic styling, interactive empathy doodle mascots, and a 60fps canvas cursor particle effect.

Built for the **Roxiler Systems Full Stack Developer Intern (FSDI) Assessment**.

---

## 🌟 Features Overview

### 1. 👥 Unified Role-Based System
- **System Administrator**:
  - Interactive dashboard with real-time aggregate metrics: **Total Users**, **Total Stores**, **Total Ratings**.
  - **User Management**: Sortable & filterable table of all normal users, admin users, and store owners. Filters by search query (Name, Email, Address) and Role.
  - **User Details View**: Inspect full profile; if the user is a Store Owner, dynamically displays their **Store Name** and **Store Rating**.
  - **Add Users**: Form validation for creating new System Admins, Normal Users, or Store Owners.
  - **Store Directory**: Sortable & filterable list of all stores with average ratings and rater counts. Register new stores and assign Store Owners.
- **Normal User**:
  - Register with strict validation rules and instant auto-login.
  - Browse registered stores with instant search by **Name** and **Address**.
  - Sort stores by Name (A–Z, Z–A) and Rating (Highest/Lowest).
  - Store cards showing **Overall Rating**, **User's Submitted Rating**, and a **Submit / Modify Rating** widget.
  - Upsert ratings (1 to 5 stars) with interactive star hover preview.
- **Store Owner**:
  - Overview card showing their owned store, overall average star rating badge, and total customer review count.
  - Dedicated raters table displaying customer name, email, rating stars, and submission date with column sorting (asc/desc) and pagination.
- **All Users**:
  - Update password modal from the navigation header with password complexity enforcement.
  - Secure JWT authentication with httpOnly refresh token cookie and bearer access token in memory.

### 2. 🎨 Empathizing Users with Design
- **Interactive Doodle Mascots**:
  - SVG mascots inspired by the design mockup reacting in real-time to user focus:
    - **Idle**: Gentle breathing and random natural blinking.
    - **Typing**: Eyes follow input text length and cursor caret position.
    - **Password Focus**: Mascots cover their eyes with cute hands, wings, and paws so they don't peek.
    - **Show Password**: Mascots peek through their fingers!
    - **Success**: Joy celebration jump with bounce physics.
    - **Error / Bad Credentials**: Mascots shake horizontally with concerned frowns.
- **Glassmorphic Aesthetic**: Translucent frosted cards (`backdrop-filter: blur`), glowing gradient radial blobs, accessible contrast, and Framer Motion micro-interactions.
- **Global Cursor Particles**: Smooth glowing canvas particle trail that drifts, fades, and bursts upon click (auto-disabled for touch devices and `prefers-reduced-motion`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Express.js, Node.js |
| **Database** | PostgreSQL, `pg` connection pool |
| **Validation** | Zod (shared schema validation) |
| **Authentication** | JWT (access + refresh tokens), bcryptjs |
| **Frontend** | React 19, Vite, React Router v7, Redux Toolkit |
| **Styling & Motion** | CSS Modules, Glassmorphism, Framer Motion, HTML5 Canvas |
| **Icons & Alerts** | React Icons (`react-icons/fi`), React Hot Toast |
| **Testing & CI** | Jest, Supertest, GitHub Actions |
| **DevOps** | Docker Compose |

---

## 📐 Database Schema

```
┌─────────────────────────────────────────┐       ┌─────────────────────────────────────────┐
│                 users                   │       │                 stores                  │
├─────────────────────────────────────────┤       ├─────────────────────────────────────────┤
│ id          SERIAL PRIMARY KEY          │       │ id          SERIAL PRIMARY KEY          │
│ name        VARCHAR(60) NOT NULL        │       │ name        VARCHAR(60) NOT NULL        │
│ email       VARCHAR(255) UNIQUE NOT NULL│       │ email       VARCHAR(255) UNIQUE NOT NULL│
│ password    VARCHAR(255) NOT NULL       │       │ address     VARCHAR(400) NOT NULL       │
│ address     VARCHAR(400) NOT NULL       │       │ owner_id    INT REFERENCES users(id)    │
│ role        user_role ENUM NOT NULL     │       │ created_at  TIMESTAMPTZ DEFAULT NOW()   │
│ created_at  TIMESTAMPTZ DEFAULT NOW()   │       └────────────────────┬────────────────────┘
└────────────────────┬────────────────────┘                            │
                     │                                                 │
                     │         ┌───────────────────────────────────────┘
                     │         │
                     ▼         ▼
┌─────────────────────────────────────────┐
│                ratings                  │
├─────────────────────────────────────────┤
│ id          SERIAL PRIMARY KEY          │
│ user_id     INT REFERENCES users(id)    │
│ store_id    INT REFERENCES stores(id)   │
│ rating      INT CHECK (rating 1-5)      │
│ created_at  TIMESTAMPTZ DEFAULT NOW()   │
│ updated_at  TIMESTAMPTZ DEFAULT NOW()   │
│ UNIQUE (user_id, store_id)              │
└─────────────────────────────────────────┘

Enum user_role = 'admin' | 'user' | 'store_owner'
Indexes created on: users(name, email, role), stores(name, email), ratings(user_id, store_id)
```

---

## 🔒 Form Validation Rules (Frontend & Backend)

| Field | Rule |
|---|---|
| **Name** | Min 20 characters, Max 60 characters |
| **Address** | Max 400 characters |
| **Password** | 8 to 16 characters, at least 1 uppercase letter, at least 1 special character |
| **Email** | Standard email validation (`^[^\s@]+@[^\s@]+\.[^\s@]+$`) |
| **Rating** | Integer between 1 and 5 inclusive |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local instance running on port 5432)

---

### Step 1: Clone & Configure Environment
```bash
git clone https://github.com/mdyusuf0/Roxiler-Assessment.git
cd Roxiler-Assessment

# Configure your local .env with your PostgreSQL credentials
```

### Step 2: Setup Server & Seed Database
```bash
cd server
npm install

# Run migration and seeds:
npm run migrate
npm run seed

# Run automated test suite:
npm test

# Start backend development server:
npm run dev
# Server running at http://localhost:5000
```

### Step 3: Start Frontend Client
In a new terminal:
```bash
cd client
npm install
npm run dev
# Vite client running at http://localhost:5173
```

---

## 🔑 Pre-Seeded Test Accounts

| Role | Email | Password | Details |
|---|---|---|---|
| **System Admin** | `admin@storerating.com` | `Admin@123` | Full dashboard, user/store management |
| **Store Owner 1** | `owner@store1.com` | `Owner@123` | Owns *TechMart Electronics Store* |
| **Store Owner 2** | `owner@store2.com` | `Owner@123` | Owns *Fresh Grocers Supermarket* |
| **Normal User 1** | `user@example.com` | `User@1234` | Has submitted sample ratings |
| **Normal User 2** | `user2@example.com` | `User@1234` | Has submitted sample ratings |

*Tip: The Login page features one-click demo account buttons to test any role instantly.*

---

## 📡 API Endpoints Reference

### Public
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & uptime |
| `POST` | `/api/auth/signup` | Register new normal user |
| `POST` | `/api/auth/login` | Unified login for all roles |

### Authenticated (All Roles)
| Method | Endpoint | Description |
|---|---|---|
| `PUT` | `/api/auth/change-password` | Update current user's password |
| `POST` | `/api/auth/logout` | Clear refresh token cookie |

### System Administrator (`admin`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Aggregate counts (users, stores, ratings) |
| `GET` | `/api/admin/users` | List users with search, role filter, sort, pagination |
| `POST` | `/api/admin/users` | Create user with assigned role |
| `GET` | `/api/admin/users/:id` | User details (including store rating if owner) |
| `GET` | `/api/admin/stores` | List stores with search, sort, pagination |
| `POST` | `/api/admin/stores` | Register new store with optional owner assignment |

### Normal User (`user`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user/stores` | List stores with overall rating and user's submitted rating |
| `PUT` | `/api/user/stores/:storeId/rating`| Submit or update store rating (1–5) |

### Store Owner (`store_owner`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/store-owner/dashboard` | Store summary with average rating and review count |
| `GET` | `/api/store-owner/ratings` | List of customers who rated the store with sort & pagination |

---

## 🧪 Testing

Run backend unit and integration tests using Jest and Supertest:
```bash
cd server
npm test
```

---

## 🌐 Cloud Deployment Guide

The application is pre-configured for seamless 1-click cloud deployment:

### Backend Deployment (Render)
1. **Create Render PostgreSQL Database**:
   - Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **PostgreSQL**.
   - Name it `storerating-db`. Copy the **Internal Database URL** (or External Database URL if needed).
2. **Deploy Express Web Service**:
   - In Render, click **New** -> **Web Service** and link this repository (`Roxiler-Assessment`).
   - Configure settings:
     - **Root Directory**: `server`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     - `DATABASE_URL`: *(Your Render PostgreSQL connection string)*
     - `JWT_SECRET`: *(A secure random string, e.g. `openssl rand -hex 32`)*
     - `JWT_REFRESH_SECRET`: *(A secure random string)*
     - `PORT`: `5000`
     - `NODE_ENV`: `production`
3. **Run Database Migrations & Seeds**:
   - In the Render Web Service dashboard, go to the **Shell** tab and run:
     ```bash
     npm run migrate
     npm run seed
     ```
   - Your backend will now be live at `https://<your-render-app>.onrender.com`.

---

### Frontend Deployment (Vercel)
1. **Import Repository to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/) -> **Add New** -> **Project**.
   - Import your `Roxiler-Assessment` GitHub repository.
2. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `client`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables**:
   - Add `VITE_API_URL`: `https://<your-render-app>.onrender.com/api`
4. **Deploy**:
   - Click **Deploy**. Vercel will bundle the React SPA. Single Page Application route rewrites are automatically handled by `client/vercel.json`.

---

## 📜 Detailed Build Log

For a detailed step-by-step log of design choices, architectural decisions, and concepts to revise, check [`docs/BUILD_LOG.md`](./docs/BUILD_LOG.md).

<!-- ================================================================== -->
<!--                    FINLYTICSX — CLASSIFIED README                    -->
<!-- ================================================================== -->

<div align="center">

```
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║    ███████╗██╗███╗   ██╗██╗  ██╗   ██╗████████╗██╗ ██████╗███████╗     ║
║    ██╔════╝██║████╗  ██║██║  ╚██╗ ██╔╝╚══██╔══╝██║██╔════╝██╔════╝     ║
║    █████╗  ██║██╔██╗ ██║██║   ╚████╔╝    ██║   ██║██║     ███████╗     ║
║    ██╔══╝  ██║██║╚██╗██║██║    ╚██╔╝     ██║   ██║██║     ╚════██║     ║
║    ██║     ██║██║ ╚████║███████╗██║       ██║   ██║╚██████╗███████║     ║
║    ╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝       ╚═╝   ╚═╝ ╚═════╝╚══════╝     ║
║                                                                          ║
║                    ██╗  ██╗                                              ║
║                     ╚██╗██╔╝                                             ║
║                      ╚███╔╝                                              ║
║                      ██╔██╗                                              ║
║                     ██╔╝ ██╗                                             ║
║                     ╚═╝  ╚═╝                                             ║
║                                                                          ║
║           FINANCIAL INTELLIGENCE PLATFORM — CASE FILE v2.0              ║
║                  CLASSIFICATION: OPEN SOURCE                             ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

<br/>

![FinlyticsX](https://img.shields.io/badge/FinlyticsX-v2.0-ff2a2a?style=for-the-badge&labelColor=0a0a0f)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black&labelColor=0a0a0f)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white&labelColor=0a0a0f)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white&labelColor=0a0a0f)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white&labelColor=0a0a0f)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge&labelColor=0a0a0f)

<br/>

```
► SYSTEM STATUS: ONLINE          ► ENCRYPTION: ACTIVE          ► SESSION: SECURE
► USERS: AUTHENTICATED           ► DATABASE: SUPABASE          ► BUILD: PRODUCTION
```

**[Live Demo](#) · [Report Bug](#) · [Request Feature](#) · [Documentation](#)**

</div>

---

<div align="center">

```
┌─────────────────────────────────────────────────────────────────────┐
│                    EXECUTIVE INTELLIGENCE BRIEF                      │
│                                                                      │
│  FinlyticsX is a full-stack personal finance intelligence platform   │
│  engineered for students and freelancers. It combines a CIA          │
│  red-alert terminal aesthetic with production-grade financial        │
│  tooling — real authentication, a live PostgreSQL database,          │
│  multi-currency support, and cinematic data visualisation.           │
│                                                                      │
│  EVERY rupee tracked. EVERY pattern surfaced. EVERY insight          │
│  actionable. For EVERY user — isolated, secured, and persistent.     │
└─────────────────────────────────────────────────────────────────────┘
```

</div>

---

## 📋 TABLE OF CONTENTS

```
01 ── MISSION OVERVIEW ───────────────── What FinlyticsX does
02 ── THREAT LANDSCAPE ───────────────── The problem it solves
03 ── FIELD ASSETS ───────────────────── Feature manifest
04 ── INTELLIGENCE STACK ─────────────── Technology decisions
05 ── SYSTEM ARCHITECTURE ────────────── How it's all wired together
06 ── DATABASE SCHEMA ────────────────── Supabase PostgreSQL tables
07 ── AUTHENTICATION PROTOCOL ────────── Clerk auth flow
08 ── DEPLOYMENT BRIEFING ────────────── Getting started
09 ── ENVIRONMENT VARIABLES ──────────── Secrets & keys
10 ── PAGE-BY-PAGE DOSSIER ───────────── Every route documented
11 ── COMPONENT HIERARCHY ────────────── File structure
12 ── CUSTOM HOOKS ────────────────────── Reusable logic
13 ── DESIGN SYSTEM ───────────────────── Tokens, colours, typography
14 ── API INTEGRATIONS ────────────────── External data sources
15 ── DATA PERSISTENCE ────────────────── Supabase + localStorage
16 ── ANIMATION DOCTRINE ─────────────── Motion philosophy
17 ── HOW WE BUILT THIS ───────────────── The full build story
18 ── KEY TECHNICAL DECISIONS ────────── Engineering choices explained
19 ── CONTRIBUTING ────────────────────── How to contribute
```

---

## 01 — MISSION OVERVIEW

<div align="center">

```
╔═══════════════════════════════════════════════════════╗
║              OPERATION: FINLYTICS/X                   ║
║                                                       ║
║  OBJECTIVE: Personal Finance Intelligence Platform    ║
║  STATUS:    Active — v2.0 Full Stack                  ║
║  TARGETS:   Students · Freelancers                    ║
║  BACKEND:   Supabase PostgreSQL                       ║
║  AUTH:      Clerk (Email + Google OAuth)              ║
║  FRONTEND:  React 19 + Vite 5                         ║
╚═══════════════════════════════════════════════════════╝
```

</div>

FinlyticsX is a **full-stack personal finance and expense analytics dashboard** engineered from the ground up for two underserved groups: **students** tracking every rupee of a tight budget, and **freelancers** juggling irregular income, unpaid invoices, and long-term savings goals.

Version 2 elevates the platform from a client-side prototype to a **production-grade full-stack application** — every user gets their own secure, isolated data environment backed by a real PostgreSQL database, authenticated via Clerk's enterprise-grade auth system, and accessed through a cinematic intelligence-grade interface that sets the aesthetic standard for what a finance app can look like.

---

## 02 — THREAT LANDSCAPE

```
THE PROBLEM ──────────────────────────────────────────────────────────────────

  Traditional finance apps fail students and freelancers in three ways:

  ① COMPLEXITY   → Too many features designed for salaried adults with
                    stable, predictable income. Students don't need pension
                    planning. Freelancers don't need payroll tools.

  ② AESTHETICS   → Every finance app looks the same. Grey. Corporate.
                    Boring. FinlyticsX treats your financial data like
                    classified intelligence — because it is.

  ③ ISOLATION    → Most tools are either fully cloud (privacy concerns) or
                    fully local (no sync). FinlyticsX gives you a personal
                    database — your data, behind your auth, in the cloud.

THE SOLUTION ─────────────────────────────────────────────────────────────────

  A cinematic intelligence dashboard that makes managing money feel less
  like accounting and more like running an operation.
```

---

## 03 — FIELD ASSETS (FEATURES)

### 🔴 CORE FINANCIAL TRACKING

| Asset                            | Status    | Description                                                                   |
| -------------------------------- | --------- | ----------------------------------------------------------------------------- |
| Add / Edit / Delete Transactions | ✅ ACTIVE | Full CRUD with react-hook-form + Yup validation                               |
| Income & Expense Tracking        | ✅ ACTIVE | Type-segregated with recurring transaction support                            |
| 8 Expense Categories             | ✅ ACTIVE | Food, Travel, Rent, Shopping, Entertainment, Health, Utilities, Subscriptions |
| Notes & Metadata                 | ✅ ACTIVE | Per-transaction notes up to 200 chars                                         |
| Supabase Persistence             | ✅ ACTIVE | All data stored in PostgreSQL, synced per user                                |
| Optimistic Updates               | ✅ ACTIVE | UI changes instantly, DB syncs in background                                  |

### 🔴 INTELLIGENCE & FILTERING

| Asset              | Status    | Description                                            |
| ------------------ | --------- | ------------------------------------------------------ |
| Real-time Search   | ✅ ACTIVE | 260ms debounce across title, category, notes           |
| Type Toggle Filter | ✅ ACTIVE | All / Income / Expense                                 |
| Category Filter    | ✅ ACTIVE | Animated dropdown with colour-coded icons              |
| Custom Date Range  | ✅ ACTIVE | 4 presets + fully custom React calendar (no native UI) |
| Sort Controls      | ✅ ACTIVE | Newest, Oldest, Highest, Lowest, A→Z                   |
| List & Grid Views  | ✅ ACTIVE | Toggle between row list and card grid                  |
| CSV Export         | ✅ ACTIVE | One-click export of filtered transactions              |

### 🔴 BUDGET COMMAND

| Asset                   | Status    | Description                                   |
| ----------------------- | --------- | --------------------------------------------- |
| Monthly Budget          | ✅ ACTIVE | Animated circular SVG dial showing % used     |
| Spending Velocity       | ✅ ACTIVE | Actual vs expected pace based on days elapsed |
| Daily Allowance         | ✅ ACTIVE | Remaining ÷ days left in month                |
| End-of-Month Projection | ✅ ACTIVE | Will you overshoot at current pace?           |
| Per-Category Limits     | ✅ ACTIVE | Individual progress bars per category         |
| Over-Limit Alerts       | ✅ ACTIVE | Chip notifications for exceeded limits        |

### 🔴 ANALYTICS INTELLIGENCE

| Asset                | Status    | Description                                                |
| -------------------- | --------- | ---------------------------------------------------------- |
| 6 KPI Cards          | ✅ ACTIVE | Income, Expenses, Balance, Savings Rate, Avg Tx, Recurring |
| Monthly Bar Chart    | ✅ ACTIVE | 6-month Income vs Expense (Recharts)                       |
| Net Worth Area Chart | ✅ ACTIVE | Cumulative trajectory over all time                        |
| Category Radar       | ✅ ACTIVE | Spending balance across 8 categories                       |
| 7×24 Heatmap         | ✅ ACTIVE | Day × Hour spending intensity grid                         |
| 6 Insight Cards      | ✅ ACTIVE | AI-surfaced patterns from your data                        |
| GSAP Animations      | ✅ ACTIVE | Per-character title, scroll-triggered reveals              |

### 🔴 SAVINGS GOALS

| Asset                | Status    | Description                                       |
| -------------------- | --------- | ------------------------------------------------- |
| 12 Goal Types        | ✅ ACTIVE | Rocket, Laptop, Travel, Home, Vehicle, and 7 more |
| SVG Arc Progress     | ✅ ACTIVE | Animated circular arc per goal                    |
| Milestone Confetti   | ✅ ACTIVE | Particle burst at 25 / 50 / 75 / 100%             |
| Contribute Modal     | ✅ ACTIVE | Quick presets + custom amount                     |
| Projected Completion | ✅ ACTIVE | Date estimate based on contribution velocity      |
| Overdue Detection    | ✅ ACTIVE | Red accent when past target date                  |

### 🔴 INVOICE TRACKER

| Asset                  | Status    | Description                               |
| ---------------------- | --------- | ----------------------------------------- |
| Kanban Pipeline        | ✅ ACTIVE | Draft → Sent → Overdue → Paid columns     |
| List Table View        | ✅ ACTIVE | 7-column sortable table                   |
| Auto Invoice Numbers   | ✅ ACTIVE | INV-0001, INV-0002... sequential          |
| Auto-Overdue Detection | ✅ ACTIVE | Flags sent invoices past due date on load |
| One-Click Mark Paid    | ✅ ACTIVE | No friction from Sent to Paid             |
| CSV Export             | ✅ ACTIVE | Tax-ready spreadsheet export              |

### 🔴 AUTH & ACCOUNTS (v2 ADDITIONS)

| Asset                   | Status    | Description                                      |
| ----------------------- | --------- | ------------------------------------------------ |
| Landing Page            | ✅ ACTIVE | Full marketing page with hero, features, CTA     |
| Sign Up / Sign In       | ✅ ACTIVE | Clerk modal — Email + Google OAuth               |
| User Profiles           | ✅ ACTIVE | Edit name, username via Clerk                    |
| Account Settings Page   | ✅ ACTIVE | `/account` — profile, security, sign out, delete |
| Protected Routes        | ✅ ACTIVE | All app routes require authentication            |
| Per-User Data Isolation | ✅ ACTIVE | Every query scoped to `clerk_user_id`            |
| Session Management      | ✅ ACTIVE | Clerk handles JWTs, refresh, logout              |

### 🔴 CURRENCY & NEWS

| Asset                    | Status    | Description                                       |
| ------------------------ | --------- | ------------------------------------------------- |
| 6-Currency Support       | ✅ ACTIVE | INR, USD, EUR, GBP, JPY, AED                      |
| Live Exchange Rates      | ✅ ACTIVE | exchangerate-api.com, no key required             |
| Global Currency Switcher | ✅ ACTIVE | Navbar dropdown — all amounts update instantly    |
| Financial News Ticker    | ✅ ACTIVE | NewsAPI live headlines on Dashboard               |
| Boot Sequence            | ✅ ACTIVE | GSAP-powered terminal animation, once per session |

---

## 04 — INTELLIGENCE STACK

```
TECHNOLOGY MANIFEST ──────────────────────────────────────────────────────────
```

| Layer                  | Technology                    | Version | Purpose                                          |
| ---------------------- | ----------------------------- | ------- | ------------------------------------------------ |
| **Frontend Framework** | React                         | 19      | Concurrent rendering, hooks-first                |
| **Build Tool**         | Vite                          | 5       | Sub-second HMR, optimised production builds      |
| **Routing**            | React Router DOM              | v6      | Declarative routing, nested protected routes     |
| **Authentication**     | Clerk                         | Latest  | Email + OAuth, user management, session handling |
| **Database**           | Supabase (PostgreSQL)         | Latest  | Per-user data isolation, real-time capable       |
| **Forms**              | React Hook Form + Yup         | Latest  | Performance forms, schema-based validation       |
| **Animation**          | Framer Motion                 | Latest  | Spring-based enter/exit animations               |
| **Animation**          | GSAP + ScrollTrigger          | 3.12.5  | Cinematic scroll-driven sequences                |
| **Charts**             | Recharts                      | Latest  | Composable, responsive React chart library       |
| **HTTP Client**        | Axios                         | Latest  | Promise-based HTTP for external APIs             |
| **Date Utilities**     | date-fns                      | Latest  | Tree-shakeable date functions                    |
| **Icons**              | React Icons                   | Latest  | MD + Fi icon sets                                |
| **IDs**                | UUID v4                       | Latest  | Collision-proof transaction identifiers          |
| **Styling**            | Plain CSS + Custom Properties | —       | Zero-runtime, token-based design system          |

---

## 05 — SYSTEM ARCHITECTURE

```
FULL STACK DATA FLOW ─────────────────────────────────────────────────────────

  ┌──────────────────────────────────────────────────────────────────────┐
  │                        BROWSER (CLIENT)                              │
  │                                                                      │
  │  ┌──────────┐   ┌─────────────────────────────────────────────────┐ │
  │  │ Landing  │   │              AUTHENTICATED APP                   │ │
  │  │  Page    │   │                                                  │ │
  │  │ /        │   │  ┌─────────┐  ┌──────────────────────────────┐  │ │
  │  └──────────┘   │  │  Navbar │  │        app-layout flex       │  │ │
  │                 │  │ + Auth  │  │  ┌─────────┐  ┌───────────┐  │  │ │
  │  ┌──────────┐   │  └─────────┘  │  │ Sidebar │  │  Pages    │  │  │ │
  │  │  Clerk   │   │               │  └─────────┘  │ /dash     │  │  │ │
  │  │  Modal   │   │               │               │ /tx       │  │  │ │
  │  │ Sign In  │   │               │               │ /budget   │  │  │ │
  │  └──────────┘   │               │               │ /analytics│  │  │ │
  │                 │               │               │ /goals    │  │  │ │
  └─────────────────┴───────────────┴───────────────┴───────────┴──┴──┘
                              │                           │
                    ┌─────────▼──────────┐    ┌──────────▼──────────┐
                    │   FinanceContext    │    │   Page-Local State  │
                    │   (global state)   │    │   (filters, modals) │
                    │                    │    └─────────────────────┘
                    │  transactions[]    │
                    │  budget{}          │
                    │  derived values    │
                    └─────────┬──────────┘
                              │  optimistic update (instant)
                              │  + async sync
                              ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                     SUPABASE (BACKEND)                            │
  │                                                                   │
  │  ┌─────────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────┐   │
  │  │transactions │  │ budgets  │  │category_    │  │  goals   │   │
  │  │             │  │          │  │limits       │  │          │   │
  │  │clerk_user_id│  │clerk_uid │  │clerk_uid    │  │clerk_uid │   │
  │  │title        │  │monthly_  │  │category     │  │name      │   │
  │  │amount       │  │budget    │  │limit_amount │  │target    │   │
  │  │category     │  │updated_at│  └─────────────┘  │saved     │   │
  │  │type         │  └──────────┘                   └──────────┘   │
  │  │date         │                                                  │
  │  │notes        │  ┌──────────────────────────┐                   │
  │  │recurring    │  │        invoices          │                   │
  │  └─────────────┘  │  clerk_user_id           │                   │
  │                   │  number · client · amount │                   │
  │                   │  issue_date · due_date    │                   │
  │                   │  status · notes           │                   │
  │                   └──────────────────────────┘                   │
  └───────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   CLERK (AUTH)      │
                    │                    │
                    │  userId (JWT)       │
                    │  email verified    │
                    │  OAuth providers   │
                    │  session mgmt      │
                    └────────────────────┘
```

### Optimistic Update Pattern

```
USER ACTION (e.g. Add Transaction)
        │
        ▼
 ① UI updates INSTANTLY         ← User sees change in <1ms
        │
        ▼
 ② Supabase INSERT fires        ← Async, background
        │
        ├── SUCCESS → cache updated, nothing more needed
        │
        └── FAILURE → state rolls back, UI reverts automatically
```

---

## 06 — DATABASE SCHEMA

```sql
-- ════════════════════════════════════════════════════════════
-- FINLYTICSX — SUPABASE POSTGRESQL SCHEMA
-- All tables scoped per user via clerk_user_id
-- RLS disabled — manual .eq('clerk_user_id', userId) filtering
-- ════════════════════════════════════════════════════════════

CREATE TABLE transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,          -- Clerk user identifier
  title         TEXT NOT NULL,          -- 2–60 characters
  amount        NUMERIC NOT NULL,       -- Positive, max 10,000,000
  category      TEXT NOT NULL,          -- One of 8 categories or 'Income'
  type          TEXT NOT NULL           -- 'income' | 'expense'
                CHECK (type IN ('income','expense')),
  date          TIMESTAMPTZ NOT NULL,   -- ISO 8601 timestamp
  notes         TEXT DEFAULT '',        -- Optional, max 200 chars
  recurring     BOOLEAN DEFAULT FALSE,  -- Repeats monthly
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE budgets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id   TEXT NOT NULL UNIQUE,  -- One budget per user
  monthly_budget  NUMERIC NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE category_limits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  category      TEXT NOT NULL,
  limit_amount  NUMERIC NOT NULL DEFAULT 0,
  UNIQUE(clerk_user_id, category)        -- One limit per category per user
);

CREATE TABLE goals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id  TEXT NOT NULL,
  name           TEXT NOT NULL,
  target_amount  NUMERIC NOT NULL,
  saved_amount   NUMERIC NOT NULL DEFAULT 0,
  target_date    DATE,
  icon_id        TEXT NOT NULL DEFAULT 'rocket',
  notes          TEXT DEFAULT '',
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE invoices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  number        TEXT NOT NULL,           -- INV-0001, INV-0002...
  client        TEXT NOT NULL,
  amount        NUMERIC NOT NULL,
  description   TEXT DEFAULT '',
  issue_date    DATE,
  due_date      DATE,
  status        TEXT NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','sent','overdue','paid')),
  notes         TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

### Row-Level Security

RLS is **disabled** on all tables. Instead, every query uses manual Clerk user ID filtering:

```javascript
// Every Supabase query is scoped to the current user
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('clerk_user_id', userId) // ← isolation enforced here
  .order('date', { ascending: false });
```

This pattern is simpler than RLS for client-side Vite apps (no backend to set session variables) and equally secure as long as the **service role key is never exposed in the frontend**. Only the `VITE_SUPABASE_ANON_KEY` lives in the client bundle.

---

## 07 — AUTHENTICATION PROTOCOL

```
CLERK AUTH FLOW ──────────────────────────────────────────────────────────────

  ┌─────────┐          ┌──────────┐          ┌──────────────┐
  │  User   │          │  Clerk   │          │  FinlyticsX  │
  └────┬────┘          └────┬─────┘          └──────┬───────┘
       │                    │                        │
       │ Visit / (Landing)  │                        │
       │ ─────────────────► │                        │
       │                    │  isSignedIn = false    │
       │ ◄─────────────────  │                        │
       │                    │                        │
       │ Click "Get Started" │                        │
       │ ─────────────────► │                        │
       │   Clerk Modal opens │                        │
       │                    │                        │
       │ Email / Google Auth│                        │
       │ ─────────────────► │                        │
       │                    │  JWT issued            │
       │ ◄─────────────────  │                        │
       │                    │                        │
       │ Navigate to /dashboard                      │
       │ ─────────────────────────────────────────► │
       │                    │                        │
       │                    │  useAuth() → userId    │
       │                    │ ◄─────────────────────  │
       │                    │                        │
       │                    │  fetchAll() → Supabase │
       │                    │  .eq('clerk_user_id',  │
       │                    │    userId)             │
       │                    │ ◄─────────────────────  │
       │                    │                        │
       │  Dashboard renders with user's data         │
       │ ◄─────────────────────────────────────────  │
```

### Protected Route Wrapper

```jsx
// src/components/Auth/ProtectedRoute.jsx
export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <div>INITIALISING...</div>;
  if (!isSignedIn) return <Navigate to="/" replace />;

  return children;
}
```

### User Isolation in FinanceContext

```javascript
// Every user gets their own localStorage cache namespace
const txCacheKey = `fx_tx_${userId}`; // e.g. fx_tx_user_abc123
const budgetKey = `fx_budget_${userId}`; // e.g. fx_budget_user_abc123

// On mount: load from localStorage cache (instant) then
// fetch from Supabase (replaces cache with fresh data)
useEffect(() => {
  if (!userId) return;
  fetchAll(); // hits Supabase with .eq('clerk_user_id', userId)
}, [userId]);
```

---

## 08 — DEPLOYMENT BRIEFING

### Prerequisites

```
Node.js  ≥ 18.0
npm      ≥ 9.0
Supabase account (free tier works)
Clerk account    (free tier works)
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/finlyticsx-v2.git
cd finlyticsx-v2

# Install all dependencies
npm install

# Copy environment template
cp .env.example .env

# Fill in your keys (see Environment Variables section)
# Then start the dev server
npm run dev
```

App will be live at `http://localhost:5173`

### Supabase Setup

```bash
# 1. Create a new Supabase project at supabase.com
# 2. Go to SQL Editor and run the schema from Section 06
# 3. Go to Project Settings → API and copy:
#    - Project URL
#    - anon/public key (NOT the service role key)
```

### Clerk Setup

```bash
# 1. Create a new application at clerk.com
# 2. Enable: Email/Password + Google OAuth + Username
# 3. Go to API Keys and copy the Publishable Key
#    (starts with pk_test_ or pk_live_)
```

### Build for Production

```bash
npm run build    # outputs to /dist
npm run preview  # preview the production build locally
```

---

## 09 — ENVIRONMENT VARIABLES

```bash
# ════════════════════════════════════════
# FILE: .env
# NEVER commit this file to git
# ════════════════════════════════════════

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Supabase Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your_anon_key

# NewsAPI (optional — falls back to placeholder ticker)
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_NEWS_COUNTRY=in
```

| Variable                     | Required    | Source                            | Notes                                 |
| ---------------------------- | ----------- | --------------------------------- | ------------------------------------- |
| `VITE_CLERK_PUBLISHABLE_KEY` | ✅ Yes      | clerk.com → API Keys              | Starts with `pk_test_` or `pk_live_`  |
| `VITE_SUPABASE_URL`          | ✅ Yes      | Supabase → Project Settings → API | Format: `https://xxx.supabase.co`     |
| `VITE_SUPABASE_ANON_KEY`     | ✅ Yes      | Supabase → Project Settings → API | Use ANON key only, never service role |
| `VITE_NEWS_API_KEY`          | ⚠️ Optional | newsapi.org                       | Without it, placeholder ticker runs   |
| `VITE_NEWS_COUNTRY`          | ⚠️ Optional | —                                 | `in` for India, `us` for US           |

> ⚠️ **NEVER use the Supabase service role key in the frontend.** It bypasses all security. Only `VITE_SUPABASE_ANON_KEY` belongs in `.env`.

The **Exchange Rate API** (`exchangerate-api.com`) is completely free with no key required.

---

## 10 — PAGE-BY-PAGE DOSSIER

```
ROUTE MAP ────────────────────────────────────────────────────────────────────

  /                   → Landing Page          (public)
  /dashboard          → Mission Control       (protected)
  /transactions       → Intelligence Ledger   (protected)
  /transactions/new   → Log Transaction       (protected)
  /transactions/:id/edit → Edit Transaction   (protected)
  /budget             → Financial Command     (protected)
  /analytics          → Intelligence Report   (protected)
  /goals              → Savings Intelligence  (protected)
  /invoices           → Freelancer Intel      (protected)
  /account            → Account Settings      (protected)
```

---

### `/` — LANDING PAGE

```
┌──────────────────────────────────────────────────────────┐
│  FINLYTICS/X                        [Sign In] [Get Started]│
├──────────────────────────────────────────────────────────┤
│                                                          │
│         Your Finances. Decoded.                          │
│   Intelligence-grade finance for students & freelancers  │
│                                                          │
│       [Get Started Free]    [View Dashboard →]           │
│                                                          │
│  ● 14,200 users  ● 2.4M transactions  ● 99.9% uptime    │
├──────────────────────────────────────────────────────────┤
│  FEATURES: Track · Budget · Analyse · Goals · Invoices   │
├──────────────────────────────────────────────────────────┤
│  HOW IT WORKS: 3-step process with animated timeline     │
├──────────────────────────────────────────────────────────┤
│  WHO IT'S FOR: Students ────────── Freelancers           │
├──────────────────────────────────────────────────────────┤
│  MOCK DASHBOARD PREVIEW (animated bar charts, stat cards)│
├──────────────────────────────────────────────────────────┤
│  FINAL CTA: Take control of your financial intelligence. │
└──────────────────────────────────────────────────────────┘
```

The landing page is a fully self-contained marketing page — no Navbar, no Sidebar, no app chrome. The fixed navbar contains the logo, navigation anchors, and **Clerk's `SignInButton` and `SignUpButton`** set to `mode="modal"` so clicking them opens Clerk's auth modal without navigating away. On successful sign-in, the app redirects to `/dashboard`.

A live ticker rotates through 6 feature names. An animated mock dashboard preview shows bar charts and stat cards — all built in raw SVG/CSS, not Recharts — so there's no dependency on FinanceContext or real data.

---

### `/dashboard` — MISSION CONTROL

```
┌─── BOOT SEQUENCE (first visit per session) ─────────────┐
│  › FINLYTICS/X KERNEL v4.1.7                            │
│  › INITIALIZING SECURE ENCLAVE...                        │
│  › LOADING FINANCIAL INTELLIGENCE MODULES...            │
│  ████████████████████████░░░░  LOADING SYSTEM           │
│  ● ACCESS GRANTED — SECURE SESSION ACTIVE               │
└─────────────────────────────────────────────────────────┘

┌─── LIVE TICKER ─────────────────────────────────────────┐
│  ● LIVE  REUTERS: Market volatility // MINT: RBI data.. │
└─────────────────────────────────────────────────────────┘

┌─── SUMMARY CARDS (animated count-up) ──────────────────┐
│  ↑ Income    ↓ Expenses    = Balance    ◎ Budget Left   │
│  ₹1,24,000   ₹67,400       ₹56,600     ₹32,600          │
└─────────────────────────────────────────────────────────┘

┌─── MICRO STATS ─────────────────────────────────────────┐
│  45.6% savings · ₹2,246/day · Food · 47 tx · 8 recurring│
└─────────────────────────────────────────────────────────┘

┌─── CHARTS ──────────────────────┬── RECENT TRANSACTIONS ┐
│  Spending Donut │ Monthly Trend  │  ● Salary    +₹50,000 │
│  (Recharts Pie) │ (Recharts Area)│  ● Food       -₹1,240 │
└─────────────────┴────────────────┴────────────────────────┘
```

The boot sequence uses **GSAP** (imported directly, not CDN for Dashboard) — 12 distinct animation steps: noise burst, grid expansion, scanline fade-in, logo line draw, terminal text stagger, progress bar fill, glitch flash, and fade-out. It fires once per session via `sessionStorage` and is initialised synchronously in `useState` to eliminate any flash before the overlay appears.

---

### `/transactions` — INTELLIGENCE LEDGER

```
┌─── SUMMARY STRIP ──────────────────────────────────────┐
│  ↑ Total Inflow  ↓ Total Outflow  = Net Flow  # Records │
│  ₹1,24,000       ₹67,400          ₹56,600      47       │
└─────────────────────────────────────────────────────────┘

┌─── FILTER BAR ─────────────────────────────────────────┐
│  🔍 Search...  [All|Income|Expense]  [Category▾]       │
│  [📅 Date Range▾]  [Sort▾]  [≡|⊞]   34 / 47 results   │
│  Active: This Month ✕  Food ✕                          │
└─────────────────────────────────────────────────────────┘

┌─── MARCH 2026 ────────────── ↑₹50,000 ↓₹23,420 ───────┐
│  📍 Salary         Income    ₹50,000    15 Mar  ···     │
│  🍔 Groceries      Food      ₹2,340     14 Mar  ···     │
│  ✈️  Flight         Travel    ₹8,200     12 Mar  ···     │
└─────────────────────────────────────────────────────────┘
```

**Critical CSS Decision — `margin-left` vs `transform`:**

Transaction rows use `margin-left: 3px` on hover instead of `transform: translateX(2px)`. This is intentional — any CSS `transform` creates a new stacking context, which scopes child `z-index` values inside the row, permanently trapping the context menu (z-index: 9999) below other elements. `margin-left` gives the same visual nudge with zero stacking side effects.

The **EditTransactionDrawer** renders outside `.tx-page` entirely and starts at `top: var(--nav-height)` so it slides in below the sticky navbar without overlapping it.

The **custom date range picker** is built entirely in React — month grid navigation, range selection with hover preview, preset buttons. No native `<input type="date">` is used because the browser's native calendar popup is rendered by the OS and cannot be styled with CSS regardless of surrounding rules.

---

### `/transactions/new` — LOG TRANSACTION

```
┌─── TYPE SELECTOR ──────────────────────────────────────┐
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │  ↓ EXPENSE      │  │  ↑ INCOME        │              │
│  │  Money out      │  │  Money in        │              │
│  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────┘

┌─── AMOUNT INPUT ────────────────────────────────────────┐
│                    ₹  12,500                            │
│                  (glow red = expense)                   │
└─────────────────────────────────────────────────────────┘

┌─── DETAILS ────────────────────┬── LIVE PREVIEW ────────┐
│  Title: [_________________]   │  ↓ EXPENSE              │
│                                │  Groceries              │
│  Category picker (icon grid):  │  Food · 15 Mar 2026    │
│  🍔 🚗 🏠 🛍️ 🎬 💊 ⚡ 📱      │  ₹12,500               │
│                                │                         │
│  Date: [custom React calendar] │                         │
│  Notes: [___________________] │                         │
│  🔄 Recurring  [toggle]        │                         │
└─────────────────────────────┴──┴─────────────────────────┘
```

The same component handles both create (`/transactions/new`) and edit (`/transactions/:id/edit`) — the edit route reads the `:id` param and pre-fills all form fields via `reset()` from react-hook-form.

On submit, a **full-screen success overlay** appears: radial glow, animated icon ring with rotating border, transaction title in Georgia serif, amount in large glowing monospace, a scanning sweep line. After 2.8 seconds, React Router navigates to `/transactions`.

---

### `/budget` — FINANCIAL COMMAND

```
                ┌──────────────┐
                │    ◉ 68%     │   ← Animated SVG arc
                │    USED      │      amber → red at 85%
                │              │
                └──────────────┘

┌── Monthly  ┐  ┌── Spent ─┐  ┌── Remaining ┐  ┌── Daily ──┐
│ ₹1,00,000  │  │ ₹67,400  │  │  ₹32,600    │  │  ₹2,042  │
└────────────┘  └──────────┘  └─────────────┘  └───────────┘

SPENDING VELOCITY ──────────────────────────────────────────
₹0  ════════════════▌         ░░░░░░░░░░░░  ₹1,00,000
                   ↑EXP                         ▲ Actual
                   Expected pace               68% spent / 52% elapsed
                   → Ahead of pace ▲

CATEGORY LIMITS ────────────────────────────────────────────
🍔 Food        ₹14,200 / ₹20,000  ████████████░░░░  71% ✏️
🚗 Travel      ₹8,200  / ₹10,000  ██████████████░░  82% ⚠️✏️
🏠 Rent        ₹25,000 / ₹25,000  ████████████████  100% 🔴✏️
```

The circular SVG dial uses `strokeDasharray` and `strokeDashoffset` to draw the arc. Tick dots at 25/50/75/100% are positioned using trigonometry (`Math.cos`, `Math.sin` on the arc radius). The entire animation runs on Framer Motion's `animate` prop — GPU-composited, no JS per-frame.

---

### `/analytics` — INTELLIGENCE REPORT

```
FINANCIAL ANALYTICS ──── EVERY RUPEE DECODED ────────────────

KPI GRID ──────────────────────────────────────────────────
┌──Income──┐ ┌─Expenses─┐ ┌──Balance─┐ ┌─Savings─┐ ┌─Avg─┐ ┌─Recur─┐
│₹1,24,000 │ │ ₹67,400  │ │ ₹56,600  │ │  45.6%  │ │₹1,434│ │₹8,200│
└──────────┘ └──────────┘ └──────────┘ └─────────┘ └─────┘ └──────┘

01 — TEMPORAL ANALYSIS ─────────────────────────────────────
     Income █████████████ Expenses ███████
Oct  ████████████████████ ███████████████
Nov  ████████████████████ ██████████████
Dec  ██████████████████████ ███████████
Jan  ████████████████████████ ████████
Feb  █████████████████████████████ █████
Mar  ████████████████████████████████ ██

02 — WEALTH TRAJECTORY (Area Chart — running net worth) ─────

03 — SPENDING BALANCE (Radar) │ 04 — CATEGORY INTEL (bars) ──

05 — TEMPORAL HEAT (7×24 Heatmap) ─────────────────────────
      12am 1am ... 12pm ... 11pm
Mon   ░░░░░░░  ░████░░  ░░░░░░
Tue   ░░░░░░░  ░░░░░░░  ████░░
...

06 — KEY INTELLIGENCE (6 insight cards) ─────────────────────
```

GSAP loads **dynamically from CDN** inside a `useEffect` with an `if (!window.gsap)` guard. This avoids adding ~60KB to the npm bundle while keeping GSAP available after the first Analytics visit. Subsequent navigations reuse the already-loaded global.

---

### `/goals` — SAVINGS INTELLIGENCE

```
┌─── ACTIVE GOALS ───────────────────────────────────────────┐
│                                                            │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │    🚀           │  │    💻           │                 │
│  │   ◉ 67%         │  │   ◉ 33%         │                 │
│  │  Emergency Fund │  │  New Laptop     │                 │
│  │  ₹33,500/₹50,000│  │  ₹16,500/₹50,000│                 │
│  │  Due: Jun 2026  │  │  Target: Aug 26 │                 │
│  │  [+ Contribute] │  │  [+ Contribute] │                 │
│  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘

MILESTONE CONFETTI SYSTEM:
  25% ─── 🎊 burst (18 particles, 1.2s animation)
  50% ─── 🎊 burst
  75% ─── 🎊 burst
 100% ─── 🎊 burst → moved to "Achieved" section with 🏆
```

---

### `/invoices` — FREELANCER INTELLIGENCE

```
PIPELINE VIEW ───────────────────────────────────────────────
┌── DRAFT ──────┐  ┌── SENT ───────┐  ┌── OVERDUE ────┐  ┌── PAID ──┐
│  INV-0001     │  │  INV-0003     │  │  INV-0002     │  │ INV-0004 │
│  Acme Corp    │  │  TechCo       │  │  StartupXY    │  │ MegaCorp │
│  ₹45,000      │  │  ₹1,20,000    │  │  ₹80,000 ⚠️   │  │ ₹2,00,000│
│  Due: Apr 10  │  │  Due: Mar 25  │  │  Was: Mar 20  │  │  ✅ Paid  │
│  [···]        │  │  [Mark Paid]  │  │  [···]        │  │  [···]   │
└───────────────┘  └───────────────┘  └───────────────┘  └──────────┘
```

On every page load, a `useEffect` scans all invoices with `status: 'sent'` and compares their `dueDate` against today using `date-fns/isPast`. Any overdue invoices are silently upgraded to `status: 'overdue'` — no user action required, no notification spam.

---

### `/account` — ACCOUNT SETTINGS

```
┌─── ACCOUNT SETTINGS ───────────────────────────────────────┐
│  ACCOUNT SETTINGS                                          │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │  [FX]  ● ACTIVE SESSION                            │   │
│  │        John Doe                                    │   │
│  │        john@example.com ✓ Verified                 │   │
│  │        Joined March 2026 · user_abc123...          │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  01 — IDENTITY                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  👤  First Name      John                    [✏️]  │   │
│  │  👤  Last Name       Doe                     [✏️]  │   │
│  │  🏷️   Username        @johndoe                [✏️]  │   │
│  │  📧  Email           john@example.com     (locked) │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  02 — SECURITY                                             │
│  │  🔑  Change Password        Update credentials   [›] │  │
│  │  🔒  Two-Factor Auth         Extra security layer  [›] │  │
│  │  🛡️   Connected Accounts      OAuth providers      [›] │  │
│                                                            │
│  03 — ACTIVE SESSION                                       │
│  │  ● john@example.com · Session active  [Sign Out]   │  │
│                                                            │
│  04 — DANGER ZONE                                          │
│  │  🗑️  Delete Account   Permanently removes all data [›] │  │
└─────────────────────────────────────────────────────────────┘
```

Security actions (Change Password, 2FA, Connected Accounts) open **Clerk's native `UserProfile` modal** via `openUserProfile({ routing: 'hash' })`. This offloads all sensitive credential handling to Clerk's hardened UI — FinlyticsX never handles raw passwords.

---

## 11 — COMPONENT HIERARCHY

```
src/
├── components/
│   ├── Auth/
│   │   └── ProtectedRoute.jsx       ← Clerk auth gate for all app routes
│   ├── Charts/
│   │   ├── SpendingDonut.jsx         ← Recharts PieChart for Dashboard
│   │   └── MonthlyTrend.jsx          ← Recharts AreaChart for Dashboard
│   ├── EditTransactionDrawer/
│   │   ├── EditTransactionDrawer.jsx ← Slide-in edit panel (right side)
│   │   └── EditTransactionDrawer.css
│   ├── Layout/
│   │   ├── Navbar.jsx                ← Sticky top bar + currency + avatar
│   │   ├── Navbar.css
│   │   ├── Sidebar.jsx               ← Left nav + quick stats
│   │   └── Sidebar.css
│   └── TransactionCard/
│       ├── TransactionCard.jsx       ← Compact row for Dashboard recent list
│       └── TransactionCard.css
│
├── context/
│   └── FinanceContext.jsx            ← Global state + Supabase sync
│
├── hooks/
│   ├── useBudget.js                  ← Budget context wrapper
│   ├── useCountUp.js                 ← Animated number from 0 to target
│   ├── useCurrency.js                ← Singleton FX rates + formatter
│   ├── useDebounce.js                ← Delay value updates (260ms search)
│   ├── useToast.js                   ← Custom notification state
│   └── useTransactions.js            ← Transaction context wrapper
│
├── lib/
│   └── supabase.js                   ← Supabase client initialisation
│
├── pages/
│   ├── Account.jsx / .css            ← Profile, security, danger zone
│   ├── AddTransaction.jsx / .css     ← Create + edit form
│   ├── Analytics.jsx / .css          ← 4 charts + GSAP + heatmap
│   ├── Budget.jsx / .css             ← Dial + velocity + category limits
│   ├── Dashboard.jsx / .css          ← Boot + ticker + cards + charts
│   ├── Goals.jsx / .css              ← Arc progress + confetti
│   ├── Invoices.jsx / .css           ← Kanban + list view
│   ├── Landing.jsx / .css            ← Public marketing page
│   ├── Transactions.jsx / .css       ← Full ledger + drawer
│   └── Transactions.css
│
├── routes/
│   └── AppRoutes.jsx                 ← All route definitions
│
├── services/
│   └── api.js                        ← NewsAPI + exchangerate-api.com
│
├── styles/
│   ├── global.css                    ← Reset + design tokens
│   └── theme.css                     ← Extended theme utilities
│
├── App.jsx                           ← Layout: Navbar + Sidebar + Routes
├── App.css                           ← app-layout flex container
└── main.jsx                          ← ClerkProvider + BrowserRouter + root
```

---

## 12 — CUSTOM HOOKS

### `useCurrency()` — Singleton FX Pattern

```javascript
// Module-level shared state — not a React Context
let _currency = 'INR';
let _rates = { INR: 1 };
let _listeners = new Set();

// Every useCurrency() call subscribes to the same state.
// Calling setCurrency('USD') from the Navbar re-renders
// every component that called useCurrency() — instantly.

export default function useCurrency() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    _listeners.add(() => forceUpdate((n) => n + 1));
    return () => _listeners.delete(/* ... */);
  }, []);

  const formatCurrency = (amountInINR) => {
    const rate = _rates[_currency] ?? 1;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: _currency,
    }).format(amountInINR * rate);
  };

  return { formatCurrency, setCurrency, selectedCurrency /* ... */ };
}
```

**Why not a Context?** React Context requires a Provider at the tree root. The singleton module pattern means `_currency` and `_rates` are shared across all `useCurrency()` instances with zero provider boilerplate, and re-renders are surgical — only components that call `useCurrency()` re-render when currency changes.

### `useCountUp(target, duration)` — Animated Numbers

```javascript
// Uses requestAnimationFrame with ease-out cubic: 1 - (1-p)³
// Returns animated value from 0 → target over duration ms
export default function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}
```

### `useDebounce(value, delay)` — Search Optimisation

```javascript
// Prevents Supabase/filter calls on every keystroke
// 260ms delay = fast enough to feel instant, slow enough not to spam
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

---

## 13 — DESIGN SYSTEM

```
COLOUR PALETTE ───────────────────────────────────────────────────────────────

  Background layers:
  ██ #050507  bg-primary      The void. Deepest dark.
  ██ #0b0b10  bg-secondary    Cards, panels
  ██ #111118  bg-elevated     Modals, dropdowns
  ██ #1a1a24  bg-raised       Hover states

  Accent system:
  ██ #ff2a2a  accent          Primary red — CTA, active nav, borders
  ██ #ff5050  accent-bright   Hover states, text on dark
  ██ #00ff88  accent-green    Income, success, Goals completion
  ██ #ff4444  accent-red      Expenses, errors, overdue items
  ██ #00f5ff  accent-cyan     Date range, Invoices page, verified badges
  ██ #ffaa00  accent-amber    Budget page, Goals page, Account page
  ██ #8877ff  accent-violet   Analytics radar, record count badges
  ██ #30d158  accent-success  Active session, savings health
```

### Per-Page Aesthetic Identity

```
PAGE          BACKGROUND    PRIMARY ACCENT    SECONDARY    FEEL
──────────────────────────────────────────────────────────────────
Landing       #050505       Red #ff2a2a       Multi        Cinematic onboard
Dashboard     #0a0a0f       Red #ff2a2a       Cyan         Command center
Transactions  #0b0b12       Red + Category    Multi        Intelligence ledger
Budget        #09090f       Amber #ffaa00     Gold         Gold vault
Analytics     #060a08       Emerald #00ff88   Multi        Biometric scan
Goals         #09090f       Gold #ffaa00      Emerald      Treasure map
Invoices      #080910       Cyan #00f5ff      Teal         Operations center
Account       #09090f       Amber #ffaa00     Cyan/Green   Personnel file
```

### Typography

```
DISPLAY FONT:  Georgia, serif
  → Used for: page titles, section headers, large stat numbers
  → Example:  "Financial Analytics"  "Your Finances. Decoded."
  → Why:      Cinematic gravitas. Unexpected in a finance app.
              Serif at large sizes signals intelligence, authority.

SYSTEM FONT:   JetBrains Mono, monospace
  → Used for:  body text, labels, badges, nav links, all UI chrome
  → Example:   "INTELLIGENCE LEDGER"  "01 — TEMPORAL ANALYSIS"
  → Why:       Terminal aesthetic. Every label feels like a classified
               document header. Mono spacing creates visual rhythm.

RULE: No other fonts. Zero exceptions.
      Georgia for headlines. JetBrains Mono for everything else.
```

### Animation Tokens

```css
--transition-spring: cubic-bezier(0.16, 1, 0.3, 1) /* Snap into place */
  --transition-fast: 160ms ease /* Hover states */ --transition-base: 240ms ease
  /* State changes */;
```

The spring easing `cubic-bezier(0.16, 1, 0.3, 1)` is used on virtually every entrance animation. It accelerates quickly, slightly overshoots the target, then settles — the "snap" feel that makes the UI feel physical rather than digital.

---

## 14 — API INTEGRATIONS

### NewsAPI

```
Endpoint:  https://newsapi.org/v2/top-headlines
Params:    country=in, category=business, apiKey=VITE_NEWS_API_KEY
Fallback:  Static array of 4 placeholder headlines (if key missing / API fails)
Fetch:     Once on Dashboard mount via useEffect
Shape:     { source: string, title: string }[]
```

### Exchange Rate API

```
Endpoint:  https://api.exchangerate-api.com/v4/latest/INR
Auth:      None required — completely free public endpoint
Fetch:     Once at module load time (useCurrency.js module level)
Caches:    In _rates module variable for the entire session
Returns:   { base: 'INR', rates: { USD: 0.012, EUR: 0.011, GBP: 0.0095, ... } }
```

### Supabase Client

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
```

All queries follow the same pattern — select, insert, update, delete — always filtered by `clerk_user_id`:

```javascript
// READ
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('clerk_user_id', userId)
  .order('date', { ascending: false });

// CREATE
await supabase.from('transactions').insert({ clerk_user_id: userId, ...tx });

// UPDATE
await supabase
  .from('transactions')
  .update({ ...fields })
  .eq('id', id)
  .eq('clerk_user_id', userId);

// DELETE
await supabase
  .from('transactions')
  .delete()
  .eq('id', id)
  .eq('clerk_user_id', userId);

// UPSERT (budget — one row per user)
await supabase
  .from('budgets')
  .upsert(
    { clerk_user_id: userId, monthly_budget: amount },
    { onConflict: 'clerk_user_id' },
  );
```

---

## 15 — DATA PERSISTENCE

```
DATA FLOW ────────────────────────────────────────────────────────────────────

  ┌──────────────┐     instant     ┌─────────────────┐
  │   UI State   │◄────────────────│  React useState  │
  │  (visible)   │─────────────────►  (in memory)     │
  └──────────────┘                 └────────┬────────┘
                                            │
                        sync (fast, <100ms) │
                                            ▼
                                   ┌────────────────┐
                                   │  localStorage  │
                                   │  (per-user key)│
                                   │  fx_tx_userId  │
                                   └────────┬───────┘
                                            │
                      async (network, ~200ms)│
                                            ▼
                                   ┌────────────────┐
                                   │    Supabase    │
                                   │  PostgreSQL    │
                                   │  (permanent)   │
                                   └────────────────┘
```

### localStorage Cache Keys (per user)

| Key                  | Contents                                  |
| -------------------- | ----------------------------------------- |
| `fx_tx_{userId}`     | Transaction array cache                   |
| `fx_budget_{userId}` | Budget object cache                       |
| `bdg_cat_limits`     | Category limits (not yet per-user scoped) |

### Supabase Tables (permanent)

| Table             | Scope             | Notes                         |
| ----------------- | ----------------- | ----------------------------- |
| `transactions`    | Per clerk_user_id | All income + expense records  |
| `budgets`         | Per clerk_user_id | One row per user, upserted    |
| `category_limits` | Per clerk_user_id | One row per category per user |
| `goals`           | Per clerk_user_id | Savings goals                 |
| `invoices`        | Per clerk_user_id | Freelancer invoices           |

### Goals & Invoices

Goals and Invoices are self-contained pages that still manage their own `localStorage` state (`finlyticsx_goals`, `finlyticsx_invoices`). They are not yet wired to Supabase — the tables exist in the schema and can be connected in a future iteration without touching any other part of the codebase.

---

## 16 — ANIMATION DOCTRINE

```
RULE: Every animation must earn its place.
      Motion without purpose is noise.
      Purposeful motion is information.
```

### Framer Motion — Component Layer

Used for all element enter/exit animations throughout the app:

| Pattern         | Code                                                         | Purpose                 |
| --------------- | ------------------------------------------------------------ | ----------------------- |
| Page sections   | `initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}` | Progressive reveal      |
| Staggered lists | `custom={i}` + `delay: i * 0.08`                             | Sequential cascade      |
| Modals          | `scale: 0.88→1` + `y: 24→0`                                  | "Pop up from below"     |
| Drawers         | `x: '100%'→0`                                                | Slide in from right     |
| List items      | `AnimatePresence mode="popLayout"`                           | Smooth reflow on delete |

### GSAP — Cinematic Layer

Used exclusively for Dashboard boot sequence and Analytics scroll-driven sequences:

```
Dashboard Boot (12 steps):
  noise burst → grid expand → scanlines → logo line draw →
  logo text rise → terminal stagger → progress fill →
  glitch flash → status line → hold → exit fade

Analytics (scroll-triggered):
  ① Per-character title: rotateX -60→0, stagger 30ms/char
  ② KPI cards: y 32→0, scale 0.94→1, stagger 0.1s
  ③ Chart panels: y 50→0, scale 0.97→1, ScrollTrigger start:'top 80%'
  ④ Chart scan lines: left -5%→105% sweep
  ⑤ Heatmap cells: scale 0.5→1, stagger:{from:'random', amount:1.2s}
  ⑥ Insight cards: x -20→0, stagger 0.08s
```

### GPU Compositing — Performance Guarantee

All animations use only `transform` and `opacity`. These two properties run entirely on the GPU compositor — they never trigger layout recalculation or paint. This guarantees 60fps on any device.

**Exception**: `margin-left` is used on transaction row hover (instead of `transform`) specifically to avoid creating a CSS stacking context that would trap child `z-index` values.

---

## 17 — HOW WE BUILT THIS

```
BUILD TIMELINE ───────────────────────────────────────────────────────────────

  Phase 1 ── FOUNDATION
    Vite + React 19 scaffold
    Global CSS token system (global.css)
    React Router v6 setup
    Navbar component with scanline texture

  Phase 2 ── CORE PAGES (v1)
    Dashboard (boot sequence + NewsAPI + GSAP)
    AddTransaction (react-hook-form + Yup + custom calendar)
    Transactions (full CRUD + search/filter/sort + drawer)
    Budget (SVG dial + velocity bar + category limits)
    Analytics (4 Recharts charts + GSAP ScrollTrigger)

  Phase 3 ── HOOKS & POLISH
    useCurrency singleton (singleton pattern)
    useCountUp (rAF animation)
    useDebounce (260ms search)
    useToast (custom centered overlay)
    EditTransactionDrawer (z-index stacking fix)

  Phase 4 ── BONUS PAGES
    Goals (arc progress + confetti milestones)
    Invoices (Kanban pipeline + auto-overdue detection)
    Sidebar (quick stats)

  Phase 5 ── v2: FULL STACK
    Clerk integration (ClerkProvider in main.jsx)
    Landing page (public marketing page)
    Protected routes (ProtectedRoute wrapper)
    Supabase schema (5 tables, SQL Editor)
    FinanceContext rewrite (Supabase + optimistic updates)
    Per-user localStorage cache keys (fx_tx_{userId})
    Account settings page (/account)
    Avatar wired to account page

  Phase 6 ── CURRENCY & POLISH
    Live exchange rate API integration
    6-currency navbar switcher
    All pages updated to use {formatCurrency}

  Phase 7 ── DATE RANGE & FILTERING
    Custom React calendar (replaced native <input type="date">)
    Date range presets + custom range
    Active filter chips with dismiss
```

---

## 18 — KEY TECHNICAL DECISIONS

### `margin-left` vs `transform` on hover

**Problem**: Transaction rows used `transform: translateX(2px)` on hover. CSS spec states any element with a non-`none` transform value becomes a **stacking context root** — its children's `z-index` values are scoped inside it and never evaluated against elements outside.

Result: The three-dot context menu (z-index: 9999) inside a transformed row could never visually escape the row's bounding box, no matter how high its z-index.

**Solution**: `margin-left: 3px` — identical visual nudge, zero stacking context side effects.

---

### Custom React calendar vs `<input type="date">`

**Problem**: `<input type="date">` renders a native OS calendar popup. This popup is drawn by the browser/OS UI layer, completely outside the DOM's CSS cascade. No CSS rule — not even `!important` or `::webkit-calendar-picker-indicator` — can change the popup's background, colours, or layout to match custom design tokens.

**Solution**: A fully custom React calendar component with month navigation, day grid, range selection with hover preview, and keyboard navigation. Zero native browser UI involved.

---

### Singleton pattern for `useCurrency`

**Problem**: If `useCurrency` used React Context, switching currency in the Navbar would require the Context Provider at the root level. Components outside the provider tree wouldn't update. Re-rendering the entire tree on every currency switch is expensive.

**Solution**: Module-level variables (`_currency`, `_rates`, `_listeners`) shared across all `useCurrency()` instances. `setCurrency` notifies all listener callbacks, causing only components that called `useCurrency()` to re-render — surgical, zero-boilerplate.

---

### Optimistic updates in FinanceContext

**Problem**: Waiting for Supabase round-trip (100–300ms) before updating the UI makes the app feel laggy compared to localStorage.

**Solution**: State updates instantly (< 1ms), then Supabase syncs asynchronously. If Supabase returns an error, the state rolls back automatically. The user never waits for the network.

---

### localStorage as cache, Supabase as truth

**Problem**: Supabase fetch takes ~200ms on every page load — users see a blank state before data arrives.

**Solution**: On mount, state is seeded from `localStorage` cache (instant). Supabase fetch fires asynchronously and updates state when it resolves. On return visits, users see their data immediately — the cloud sync happens invisibly in the background.

---

### GSAP via CDN, not npm

**Problem**: GSAP + ScrollTrigger adds ~60KB to the production bundle. The full GSAP animation system is only used on one page (Analytics).

**Solution**: `<script>` tags injected dynamically in a `useEffect` with an `if (!window.gsap)` guard. First visit to Analytics loads GSAP from Cloudflare CDN. Subsequent visits (same session) skip the load — `window.gsap` already exists.

---

## 19 — CONTRIBUTING

```
CONTRIBUTION PROTOCOL ────────────────────────────────────────────────────────
```

Pull requests are welcome. For major changes, open an issue first.

```bash
# Fork → Clone → Branch → Build → Test → PR

git clone https://github.com/yourusername/finlyticsx-v2.git
cd finlyticsx-v2
git checkout -b feature/your-feature-name
npm install
npm run dev
# ... make changes ...
git commit -m "feat: describe what you built"
git push origin feature/your-feature-name
# Open PR on GitHub
```

### Code Standards

```
✅ Functional components with hooks only (no class components)
✅ CSS uses BEM-inspired scoped prefixes:
     tx-  → Transactions
     bdg- → Budget
     anx- → Analytics
     gl-  → Goals
     inv- → Invoices
     acc- → Account
     lnd- → Landing
✅ No inline styles except CSS custom property values:
     style={{ '--accent': color }}  ← OK
     style={{ color: '#ff2a2a' }}   ← BAD
✅ Framer Motion for enter/exit animations
✅ GSAP only for scroll-driven sequences
✅ Every Supabase query must include .eq('clerk_user_id', userId)
✅ Optimistic updates for all CRUD operations
✅ formatCurrency() for all monetary display values (never hardcode ₹)
```

---

<div align="center">

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║    ◈ FINLYTICSX — CASE FILE CLOSED                                   ║
║                                                                      ║
║    Every rupee tracked.                                              ║
║    Every pattern surfaced.                                           ║
║    Every insight actionable.                                         ║
║                                                                      ║
║    Built with obsessive attention to detail.                         ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

**Acknowledgements**

[Clerk](https://clerk.com) · [Supabase](https://supabase.com) · [Recharts](https://recharts.org) · [Framer Motion](https://www.framer.com/motion/) · [GSAP](https://greensock.com/gsap/) · [date-fns](https://date-fns.org) · [React Icons](https://react-icons.github.io/react-icons/) · [exchangerate-api.com](https://www.exchangerate-api.com) · [NewsAPI](https://newsapi.org) · [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

---

_MIT License — see LICENSE for details_

```
► SESSION TERMINATED          ► DATA ENCRYPTED          ► SIGNING OFF
```

</div>

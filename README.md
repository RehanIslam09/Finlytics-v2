# FinlyticsX

> **Personal Finance & Expense Analytics Platform for Students and Freelancers**

<div align="center">

![FinlyticsX Banner](https://img.shields.io/badge/FinlyticsX-Finance%20Intelligence-ff2a2a?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0xIDE1aC0ydi02aDJ2NnptMC04aC0yVjdoMnYyeiIvPjwvc3ZnPg==)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![PRD](https://img.shields.io/badge/PRD%20Coverage-100%25-brightgreen?style=for-the-badge)

**[Live Demo](#) · [Report Bug](#) · [Request Feature](#)**

</div>

---

## What is FinlyticsX?

FinlyticsX is a full-featured personal finance and expense analytics dashboard built entirely in the browser — no backend, no database, no server. It combines a **dystopian terminal aesthetic** (think CIA red-alert command center) with deeply practical financial tooling designed specifically for two groups of people who often get overlooked by traditional finance apps: **students** tracking limited budgets across categories, and **freelancers** managing irregular income, chasing invoices, and saving toward goals.

Every rupee you earn or spend is tracked, visualised, and surfaced as an insight. The app runs completely client-side — all data lives in `localStorage`, all charts are computed in real time, all exchange rates are fetched live from a free API. No account required, no data leaves your machine.

---

## Table of Contents

- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Page-by-Page Breakdown](#page-by-page-breakdown)
- [Component Architecture](#component-architecture)
- [Custom Hooks](#custom-hooks)
- [State Management](#state-management)
- [Design System](#design-system)
- [API Integrations](#api-integrations)
- [Data Persistence](#data-persistence)
- [Animations & Motion](#animations--motion)
- [How We Built This](#how-we-built-this)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Screenshots

| Dashboard                                              | Transactions                                        | Analytics                               |
| ------------------------------------------------------ | --------------------------------------------------- | --------------------------------------- |
| Boot sequence, live news ticker, summary cards, charts | Full CRUD ledger, date range filter, list/grid view | GSAP-animated charts, heatmap, KPI grid |

| Budget                                       | Goals                                    | Invoices                    |
| -------------------------------------------- | ---------------------------------------- | --------------------------- |
| Circular dial, velocity bar, category limits | Savings arc progress, milestone confetti | Kanban pipeline + list view |

---

## Features

### Core Financial Tracking

- ✅ **Add, edit, delete transactions** with full form validation (react-hook-form + Yup)
- ✅ **Income and expense tracking** with recurring transaction support
- ✅ **Category system** — 8 expense categories (Food, Travel, Rent, Shopping, Entertainment, Health, Utilities, Subscriptions) + Income
- ✅ **Notes and metadata** per transaction
- ✅ **Persistent storage** — all data survives page refreshes via localStorage
- ✅ **40-transaction seed data** on first load so the app looks full immediately

### Intelligence & Filtering

- ✅ **Real-time search** with 260ms debounce across title, category, and notes
- ✅ **Filter by type** — All / Income / Expense toggle
- ✅ **Filter by category** — animated dropdown with icons
- ✅ **Custom date range filter** — presets (This week, This month, Last month, Last 3 months) + custom calendar picker
- ✅ **Sort** — Newest, Oldest, Highest amount, Lowest amount, A→Z
- ✅ **List and Grid view modes** for transactions
- ✅ **CSV export** of filtered transactions with one click

### Budget System

- ✅ **Monthly budget** with animated circular progress dial
- ✅ **Spending velocity bar** — shows actual vs expected pace based on days elapsed
- ✅ **Daily allowance** — remaining budget ÷ days left in month
- ✅ **End-of-month projection** — at current pace, will you stay within budget?
- ✅ **Per-category spending limits** with individual progress bars
- ✅ **Over-limit alerts** — chip notifications when any category exceeds its limit
- ✅ **Savings rate** calculation based on income vs expenses

### Analytics Dashboard

- ✅ **6 KPI cards** — Total Income, Total Expenses, Net Balance, Savings Rate, Avg Transaction, Recurring Cost
- ✅ **Monthly Income vs Expense bar chart** — 6-month history (Recharts)
- ✅ **Cumulative Net Worth area chart** — trajectory over all time (Recharts)
- ✅ **Category Radar chart** — spending balance across all 8 categories (Recharts)
- ✅ **Spending breakdown** with animated progress bars per category
- ✅ **Day × Hour heatmap** — 7×24 grid showing when you spend most
- ✅ **6 insight cards** — Best month, Top category, Net worth trend, Most balanced month, Peak day, Recurring burden
- ✅ **GSAP ScrollTrigger animations** — every section animates in on scroll
- ✅ **Cinematic hero** with per-character text animation on page load

### Savings Goals

- ✅ **12 goal types** — each with a distinct icon and colour (Rocket, Laptop, Travel, Home, Vehicle, Health, Education, Emergency, Gift, Business, Wishlist, Milestone)
- ✅ **Animated circular arc** progress indicator per goal
- ✅ **Milestone confetti burst** at 25%, 50%, 75%, and 100% completion
- ✅ **Quick-contribute modal** with preset contribution amounts
- ✅ **Projected completion** date based on contribution history
- ✅ **Overdue detection** — turns red when target date has passed
- ✅ **Achieved section** — completed goals displayed separately in emerald green

### Invoice Tracker (Freelancer)

- ✅ **Kanban pipeline view** — four columns (Draft → Sent → Overdue → Paid)
- ✅ **List table view** with sorting and status filters
- ✅ **Auto-generated invoice numbers** — INV-0001, INV-0002...
- ✅ **Auto-overdue detection** — on load, any sent invoice past its due date is flagged automatically
- ✅ **Quick "Mark Paid"** button on sent invoices — one click, zero friction
- ✅ **Status transitions** via context menu — move any invoice to any stage
- ✅ **CSV export** for tax records
- ✅ **Summary strip** — Total Invoiced, Collected, Pending, Overdue amounts

### Currency & News

- ✅ **Live currency conversion** — 6 currencies (INR, USD, EUR, GBP, JPY, AED)
- ✅ **Real-time exchange rates** from exchangerate-api.com
- ✅ **Global currency switcher** in the navbar — all amounts update instantly across every page
- ✅ **Live financial news ticker** on Dashboard — NewsAPI integration with animated scroll
- ✅ **Boot sequence animation** — terminal-style text on first load

### UX & Polish

- ✅ **Slide-in edit drawer** for transactions — opens from the right, below the navbar
- ✅ **Custom toast notifications** — centered overlay, 3 types (success, error, export)
- ✅ **Custom date picker** — fully styled calendar, no native browser picker
- ✅ **Live transaction preview card** — updates in real time as you fill the Add Transaction form
- ✅ **Success overlay** on transaction submit — radial glow + scanning line animation
- ✅ **Empty states** on every page — informative CTAs when there's no data
- ✅ **Sidebar** with quick stats — income, expenses, balance, recurring count
- ✅ **Fully responsive** — all pages work on mobile, tablet, and desktop
- ✅ **Scanline overlay** — subtle CRT-style texture on every page background

---

## Tech Stack

| Category           | Technology                           | Why                                           |
| ------------------ | ------------------------------------ | --------------------------------------------- |
| **Framework**      | React 19                             | Latest concurrent features, hooks-first       |
| **Build Tool**     | Vite 5                               | Instant HMR, fast production builds           |
| **Routing**        | React Router DOM v6                  | Declarative routing, nested routes            |
| **Forms**          | React Hook Form + Yup                | Performance forms, schema validation          |
| **Animation**      | Framer Motion                        | Declarative spring animations                 |
| **Animation**      | GSAP + ScrollTrigger                 | Cinematic scroll-driven sequences (Analytics) |
| **Charts**         | Recharts                             | Composable React chart library                |
| **HTTP Client**    | Axios                                | Promise-based HTTP for API calls              |
| **Date Utilities** | date-fns                             | Tree-shakeable date manipulation              |
| **Icons**          | React Icons (MD + Fi sets)           | Consistent Material + Feather icon system     |
| **IDs**            | UUID v4                              | Collision-proof unique identifiers            |
| **Toasts**         | react-toastify                       | (installed, root-level ToastContainer)        |
| **Styling**        | Plain CSS with CSS custom properties | Zero-runtime, full control, token-based       |

---

## Project Architecture

```
FinlyticsX is a single-page application with the following data flow:

┌─────────────────────────────────────────────────────────┐
│                        App.jsx                          │
│  ┌─────────┐  ┌──────────────────────────────────────┐  │
│  │ Navbar  │  │           app-layout flex            │  │
│  └─────────┘  │  ┌──────────┐  ┌──────────────────┐  │  │
│               │  │ Sidebar  │  │   <AppRoutes/>    │  │  │
│               │  └──────────┘  │  (page content)  │  │  │
│               │                └──────────────────┘  │  │
│               └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                ┌─────────▼──────────┐
                │   FinanceContext   │
                │  (global state)    │
                │  - transactions    │
                │  - budget          │
                │  - derived values  │
                └────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
   useCurrency      useDebounce       useToast
  (global rates)   (search input)   (notifications)
```

The state architecture follows a **single context + derived values** pattern. `FinanceContext` holds the raw `transactions` array and `budget` object. All derived values (totalIncome, totalExpenses, netBalance, transactionsByCategory, monthlyData, budgetRemaining, budgetUsedPercent) are computed inside the context and exposed directly — no selectors, no reducers, no boilerplate.

Goals and Invoices are self-contained pages that manage their own localStorage keys (`finlyticsx_goals` and `finlyticsx_invoices`) independently of FinanceContext, keeping the core context lean.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/finlyticsx.git
cd finlyticsx

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your API keys (see Environment Variables section)

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_NEWS_COUNTRY=in
```

| Variable            | Required | Description                                                                                                                                               |
| ------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_NEWS_API_KEY` | Optional | NewsAPI.org key for live financial news ticker. Without it, a fallback placeholder ticker runs. Free tier available at [newsapi.org](https://newsapi.org) |
| `VITE_NEWS_COUNTRY` | Optional | Country code for news headlines (`in` for India, `us` for US). Defaults to `in`.                                                                          |

The **currency exchange API** (`exchangerate-api.com`) requires no key — it uses the free public endpoint.

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## Page-by-Page Breakdown

### `/dashboard` — Mission Control

The dashboard is the first thing users see and sets the tone for the entire app. It opens with a **boot sequence** — a typewriter animation that runs once per session (`sessionStorage` flag prevents it repeating on navigation). A **live news ticker** scrolls financial headlines fetched from NewsAPI asynchronously; while loading, a placeholder string keeps the ticker occupied so there's no layout shift.

**Summary cards** show Total Income, Total Expenses, Net Balance, and Budget Remaining — all animated with a custom `useCountUp` hook that eases the number up from zero on mount. The Budget card includes an inline progress bar.

**Micro stats** below show five quick-glance numbers: Savings Rate, Avg Daily Spend, Top Category, Total Transactions, and Recurring count.

**Charts** sit in a two-column grid — a SpendingDonut (Recharts pie) and a MonthlyTrend (Recharts area). Both pull data from FinanceContext.

The **bottom grid** splits into Category Breakdown (horizontal bar rows, sorted by spend) and Recent Transactions (the 5 most recent, using the shared TransactionCard component). Both sections animate in via Framer Motion stagger.

**Empty state:** when `transactions.length === 0`, the entire dashboard content is replaced with a centered empty state that prompts the user to add their first transaction.

---

### `/transactions` — Intelligence Ledger

The most feature-rich page in the app. Every transaction ever recorded lives here, grouped by month with per-group income/expense/net totals in the header.

**Summary strip** at the top shows 4 animated stat cards — Total Inflow, Total Outflow, Net Flow, and total Records — all with count-up animations scoped to the _filtered_ set.

**Filter bar** chains 6 controls:

1. Debounced search (260ms) — searches title, category, and notes
2. Type toggle — All / ↑ Income / ↓ Expense
3. Category dropdown — 8 categories with colour-coded icons
4. Date range picker — 4 presets + custom calendar (no native browser picker)
5. Sort dropdown — 5 sort options
6. List / Grid view toggle

Active filters appear as dismissible chips. The results counter shows `filtered / total` at all times.

**Transaction rows** use a `margin-left` hover nudge instead of `transform: translateX` — a critical CSS decision that prevents transform from creating a stacking context that would trap the context menu's `z-index: 9999` inside the row.

**Edit drawer** renders outside the `.tx-page` div entirely, starting at `top: var(--nav-height)` so it slides in below the navbar without covering it. It accepts the transaction object as props and calls `updateTransaction` from FinanceContext on save.

**Grid view** switches the list layout to a `repeat(auto-fill, minmax(240px, 1fr))` card grid — grid cards safely use `transform: translateY(-2px)` on hover because they contain no absolutely-positioned menus.

---

### `/transactions/new` and `/transactions/:id/edit` — Add Transaction

Both the new and edit flows use the same `AddTransaction` component. The edit route reads the `:id` param from the URL and pre-fills the form.

The form is split into two zones:

- **Hero zone** — full-width type toggle (Expense / Income) and large amount input
- **Details zone** — two-column grid with title, category picker, date picker, notes, and recurring toggle

**react-hook-form + Yup** handles all validation. The schema enforces: title 2–60 chars, amount positive and ≤ 10,000,000, category required, date required, notes ≤ 200 chars.

**Category picker** uses a `Controller` from react-hook-form rendering an animated button grid. Switching type (income/expense) automatically filters the visible categories — Income type shows only the Income category, Expense hides it.

**Custom date picker** is a completely from-scratch calendar built in React — month navigation, day grid, today shortcut, zero native browser UI. This was built after discovering that `<input type="date">` renders a native browser calendar popup that cannot be styled with CSS regardless of the surrounding styles.

**Live preview card** appears as soon as either title or amount has a value, showing exactly how the transaction will look in the ledger.

**Success overlay** — on submit, a full-screen overlay fades in with an animated icon ring, the transaction title and amount, and a scanning-line animation. After 2.8 seconds, the user is redirected to `/transactions`.

---

### `/budget` — Financial Command

The budget page is built around a large **circular SVG dial** that shows percentage of monthly budget used. The dial uses `strokeDasharray` and `strokeDashoffset` for the arc, animated with Framer Motion on mount. Tick dots appear at 25/50/75/100% positions.

The dial colour shifts from amber → amber → red based on threshold: normal (< 85%) stays gold, critical (≥ 85%) turns amber/warning, over budget turns red with a pulsing status badge.

**Velocity bar** visualises spending pace — a gold gradient fill shows actual spend, an expected-pace marker (a thin vertical line) shows where you _should_ be based on days elapsed in the month. Being ahead of the expected marker means you're spending too fast.

**Four stat cards** sit beside the dial: Monthly Budget, Spent, Remaining, and Daily Allowance (remaining ÷ days left). All use `useCountUp` for animated number reveals.

**Category limits** let users set per-category monthly caps. Each row has its own animated progress bar, an expected-pace marker, and a remaining amount. The edit button opens a `CategoryLimitModal` with a colour-matched accent. Limits are stored in `localStorage` under `bdg_cat_limits`, separate from the main FinanceContext so they persist independently.

**Over-limit alerts** render as a dismissible row of chips at the top of the category section when any category has exceeded its set limit.

**Empty state:** when no budget is set, the dial shows 0%, and a centered CTA prompts the user to set their first budget.

---

### `/analytics` — Intelligence Report

The most visually complex page in the app. It uses **GSAP + ScrollTrigger** loaded dynamically from CDN (so no npm install is required) for all scroll-triggered animations. GSAP is initialised in a `useEffect` that checks `window.gsap` before loading — subsequent navigations to the page reuse the already-loaded GSAP global.

The **hero** runs a per-character text entrance animation — the title is split into `<span class="anx-char">` elements by GSAP, each animated with `rotateX: -60 → 0` for a 3D fold-in effect.

**6 KPI cards** stagger in on load using `gsap.fromTo` with a 0.1s stagger.

**4 charts** using Recharts, each inside a `data-anx-chart` panel that ScrollTrigger reveals with a `y: 50 → 0, scale: 0.97 → 1` entrance. Each panel also has a cyan/violet/green scan line that sweeps across from left to right using `gsap.fromTo` on the `.anx-chart-scan` element.

1. **Monthly Bar Chart** — 6 months of income vs expense, gradient fills, custom tooltip
2. **Cumulative Area Chart** — running net worth over all time with a zero-line reference
3. **Category Radar** — Recharts `RadarChart`, normalised 0–100 scale
4. **Spending Breakdown** — per-category rows with CSS-transition-animated bars (not GSAP — this was changed after discovering GSAP's scroll trigger fired too late for the two-column layout)

**Heatmap** — a 7×24 CSS grid (7 days × 24 hours) where each cell's `rgba` alpha encodes spending intensity. Cells stagger in with `gsap.fromTo` using `stagger: { from: 'random' }` for a scattered reveal effect.

**6 insight cards** at the bottom stagger in via `[data-anx-insight]` scroll trigger.

---

### `/goals` — Savings Intelligence

Fully self-contained — zero imports from other pages. All state lives in `localStorage` under `finlyticsx_goals`.

Each goal has: name, target amount, saved amount, target date (optional), icon type (12 options), notes (optional). The `GoalArc` component renders a custom SVG arc using `strokeDasharray/strokeDashoffset` identical in approach to the Budget dial, but scoped to `120×120px` per card.

**Milestone confetti** — a `useRef` tracks the previous percentage. On every render, it checks whether the new percentage has crossed a 25/50/75/100 threshold. If so, it triggers a `showConfetti` state that renders `<Confetti>` — 18 `motion.div` particles with randomised x/y/color trajectories that fade and shrink over 1.2 seconds.

**Contribute modal** — adds an amount to `goal.savedAmount`. It shows quick-preset buttons (₹500, ₹1000, ₹2000, ₹5000 filtered to amounts ≤ remaining) plus a "Full amount" button that fills exactly to the target.

**Completed goals** render in a separate "Achieved 🎉" section with emerald green accents, replacing the goal's icon with `MdEmojiEvents` and adding a sliding "GOAL ACHIEVED" banner at the bottom of the card.

**Overdue detection** — if `targetDate` is in the past and the goal isn't complete, the card switches to red accent colours with an overdue day count.

---

### `/invoices` — Freelancer Intelligence

Fully self-contained — all state in `localStorage` under `finlyticsx_invoices`. Zero connection to FinanceContext.

On mount, a `useEffect` scans all invoices with `status: 'sent'` and checks if their `dueDate` is in the past using `date-fns/isPast`. Any that qualify are automatically upgraded to `status: 'overdue'` and saved back to localStorage. This happens silently every time the page loads.

**Pipeline view** renders 4 columns (Draft, Sent, Overdue, Paid) using CSS Grid. Each column shows a colour-matched header, a thin accent bar, a total amount, and stacked `PipelineCard` components. Each card has a right-click context menu (via `MdMoreVert` button) for status transitions, edit, and delete. Sent cards also show a "Mark Paid" button directly on the card surface.

**List view** renders a standard table-style layout with 7 columns (Invoice#, Client, Amount, Issue Date, Due Date, Status, Actions). Rows use `margin-left: 3px` on hover (not transform) to avoid stacking context issues with the context menu, consistent with the Transactions page pattern.

**Invoice form modal** — includes a status picker rendered as 4 styled toggle buttons with per-status colours. Dates use `<input type="date">` with `color-scheme: dark` — the form is modal-based (not inline) so the native calendar popup appearance is acceptable here and doesn't conflict with page layout.

**CSV export** generates a formatted spreadsheet-ready CSV with all invoice fields, named `invoices-YYYY-MM-DD.csv`.

---

## Component Architecture

### Shared Components

```
src/components/
├── Layout/
│   ├── Navbar.jsx          # Top navigation, currency switcher, mobile menu
│   ├── Navbar.css
│   ├── Sidebar.jsx         # Left sidebar, nav links, quick stats
│   └── Sidebar.css
├── Charts/
│   ├── SpendingDonut.jsx   # Recharts pie chart for Dashboard
│   └── MonthlyTrend.jsx    # Recharts area chart for Dashboard
├── TransactionCard/
│   ├── TransactionCard.jsx # Compact transaction row for Dashboard
│   └── TransactionCard.css
└── EditTransactionDrawer/
    ├── EditTransactionDrawer.jsx  # Slide-in edit panel
    └── EditTransactionDrawer.css
```

### Custom Components (Page-Scoped)

Each page owns its sub-components directly in the page file to keep things self-contained:

| Page                 | Internal Components                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Transactions.jsx`   | `SummaryStrip`, `FilterBar`, `DateRangePicker`, `TransactionRow`, `GroupedTransactions`, `EmptyState`              |
| `Budget.jsx`         | `CircularDial`, `VelocityBar`, `BudgetEditModal`, `CategoryBudgetRow`, `CategoryLimitModal`, `InsightCard`         |
| `Analytics.jsx`      | `ChartTooltip`, `SectionHeader`, `HeatmapCell`, `AnalyticsEmpty`                                                   |
| `Goals.jsx`          | `GoalArc`, `Confetti`, `GoalCard`, `GoalModal`, `ContributeModal`, `SummaryStrip`, `EmptyState`                    |
| `Invoices.jsx`       | `StatusBadge`, `SummaryStrip`, `PipelineView`, `PipelineCard`, `ListView`, `ListRow`, `InvoiceModal`, `EmptyState` |
| `AddTransaction.jsx` | `CustomDatePicker`, `SuccessOverlay`                                                                               |

---

## Custom Hooks

### `useFinance()` — Context Consumer

Exposes the full FinanceContext: transactions array, CRUD operations, and all derived values.

### `useCurrency()`

A **singleton pattern** hook that shares state across all instances without a Context provider. Module-level variables (`_currency`, `_rates`, `_listeners`) are shared across all `useCurrency()` calls. When `setCurrency` is called anywhere in the app, all instances re-render synchronously via a Set of listener callbacks.

Rates are fetched from `exchangerate-api.com/v4/latest/INR` on module initialisation (called once when the JS module first loads) and cached in `_rates`. `formatCurrency(amountInINR)` converts from INR using the cached rate and formats with `Intl.NumberFormat` for correct locale and currency symbol.

### `useDebounce(value, delay)`

Returns a debounced version of `value` that only updates after `delay` milliseconds of no changes. Used on the Transactions search input with a 260ms delay to avoid re-filtering on every keystroke.

### `useCountUp(target, duration)`

An animation hook that counts from 0 to `target` over `duration` milliseconds using `requestAnimationFrame` and an ease-out cubic function `1 - (1-p)³`. Returns the current animated value. Used on summary cards across Dashboard, Transactions, Budget, and Analytics.

### `useBudget()`

Wraps `useFinance()` and exposes budget-specific derived values: `budget`, `setBudget`, `budgetRemaining`, `budgetUsedPercent`, `isOverBudget`.

### `useToast()`

Returns `{ toast, showToast, hideToast }`. `toast` is `{ message, type, visible }`. `showToast(message, type)` sets visible to true; an internal `setTimeout` calls `hideToast` after 2200ms. Used to drive the custom `ToastNotification` component (centered overlay, `z-index: 99999`).

---

## State Management

FinlyticsX uses **React Context API** as its only global state mechanism — no Redux, no Zustand, no external state library.

### FinanceContext

```
State:
  transactions: Transaction[]  ← raw array, source of truth
  budget: { monthlyBudget: number }

Derived (computed on every render):
  totalIncome          ← sum of all income transactions
  totalExpenses        ← sum of all expense transactions
  netBalance           ← totalIncome - totalExpenses
  budgetRemaining      ← monthlyBudget - totalExpenses
  budgetUsedPercent    ← (totalExpenses / monthlyBudget) × 100
  transactionsByCategory ← { [category]: total }
  monthlyData          ← last 6 months of { month, income, expenses }

Persistence:
  useEffect on transactions → localStorage.setItem('transactions', ...)
  useEffect on budget       → localStorage.setItem('budget', ...)
```

### Page-Level State

Each page manages its own UI state locally with `useState`:

- Filter values (search, category, type, date range, sort) in Transactions
- Modal open/close states in Budget, Goals, Invoices
- View mode (pipeline vs list) in Invoices
- Active tab / section state where needed

### External State (localStorage only)

- `transactions` — main transaction array
- `budget` — `{ monthlyBudget: number }`
- `bdg_cat_limits` — `{ [category]: number }` per-category budget limits
- `finlyticsx_goals` — `Goal[]` savings goals
- `finlyticsx_invoices` — `Invoice[]` invoices

---

## Design System

FinlyticsX uses a **token-based CSS custom properties** system defined in `src/styles/global.css` and extended per-page with local scoped tokens.

### Colour System

| Token                   | Value     | Usage                                    |
| ----------------------- | --------- | ---------------------------------------- |
| `--color-accent`        | `#ff2a2a` | Primary red — CTA buttons, active states |
| `--color-accent-bright` | `#ff5050` | Hover states, text on dark               |
| `--accent-green`        | `#00ff88` | Income, success, Goals completion        |
| `--accent-red`          | `#ff4444` | Expenses, errors, overdue                |
| `--accent-cyan`         | `#00f5ff` | Date range, Invoices page                |
| `--accent-amber`        | `#ffaa00` | Budget page, Goals page, warnings        |
| `--accent-purple`       | `#8877ff` | Analytics radar, record count            |

### Typography

| Token            | Value                       | Usage                                       |
| ---------------- | --------------------------- | ------------------------------------------- |
| `--font-display` | `Georgia, serif`            | Page titles, section headers, large numbers |
| `--font-primary` | `JetBrains Mono, monospace` | Body text, labels, badges, all UI chrome    |

Two font families only — the entire design system uses either Georgia for headlines or JetBrains Mono for everything else. This deliberate constraint creates the terminal/intelligence aesthetic.

### Spacing & Shape

```css
--nav-height: 64px /* Navbar height — used for sticky positioning */
  --content-max: 1300px /* Max content width */ --space-lg: 32px
  /* Standard page padding */ --space-md: 20px /* Reduced padding (mobile) */
  --radius-sm: 8px /* Buttons, inputs */ --radius-md: 10px
  /* Cards, dropdowns */ --radius-lg: 14px /* Large cards */ --radius-xl: 16px
  /* Chart panels, modals */ --radius-full: 9999px /* Pills, badges */;
```

### Animation Tokens

```css
--transition-spring: cubic-bezier(0.16, 1, 0.3, 1)
  /* Spring ease for all entrances */ --fast: 160ms /* Hover transitions */
  --base: 240ms /* State changes */;
```

The spring easing `cubic-bezier(0.16, 1, 0.3, 1)` is used on virtually every entrance animation — it creates the characteristic "snap into place" feel where elements accelerate quickly and overshoot slightly before settling.

### Page Aesthetics

Each page has a distinct colour temperature to create visual variety:

| Page         | Background | Primary Accent    | Feel                |
| ------------ | ---------- | ----------------- | ------------------- |
| Dashboard    | `#0a0a0f`  | Red `#ff2a2a`     | Command center      |
| Transactions | `#0b0b12`  | Red + multi-cat   | Intelligence ledger |
| Budget       | `#09090f`  | Amber `#ffaa00`   | Gold vault          |
| Analytics    | `#060a08`  | Emerald `#00ff88` | Biometric scan      |
| Goals        | `#09090f`  | Gold `#ffaa00`    | Treasure map        |
| Invoices     | `#080910`  | Cyan `#00f5ff`    | Operations center   |

---

## API Integrations

### NewsAPI (`src/services/api.js`)

```
Endpoint: https://newsapi.org/v2/top-headlines
Params:   country={VITE_NEWS_COUNTRY}, category=business, apiKey={VITE_NEWS_API_KEY}
Fallback: Static array of 4 placeholder headlines
```

Fetched once on Dashboard mount via `useEffect`. Results are mapped to `{ source, title }` shape. The ticker renders whatever array is in state — if the API fails or the key is missing, `fetchNews()` catches the error and returns the fallback array.

### Exchange Rate API (`src/services/api.js`)

```
Endpoint: https://api.exchangerate-api.com/v4/latest/INR
No API key required — free public endpoint
Returns:  { base: 'INR', rates: { USD: 0.012, EUR: 0.011, ... } }
```

Fetched once when the `useCurrency` module first loads (module-level `loadRates()` call). Results are cached in the `_rates` module variable. All `formatCurrency` calls divide by the INR rate to convert. The singleton pattern means the fetch happens exactly once per page session regardless of how many components call `useCurrency()`.

---

## Data Persistence

All data is stored in the browser's `localStorage` as serialised JSON. There is no backend, no cloud sync, no account system.

### Storage Keys

| Key                   | Type                        | Contents                       |
| --------------------- | --------------------------- | ------------------------------ |
| `transactions`        | `Transaction[]`             | All income and expense records |
| `budget`              | `{ monthlyBudget: number }` | Monthly budget amount          |
| `bdg_cat_limits`      | `Record<string, number>`    | Per-category spending limits   |
| `finlyticsx_goals`    | `Goal[]`                    | All savings goals              |
| `finlyticsx_invoices` | `Invoice[]`                 | All invoices                   |

### Transaction Schema

```typescript
interface Transaction {
  id: string; // UUID v4
  title: string; // 2–60 characters
  amount: number; // Positive number, max 10,000,000
  category: string; // One of 8 categories or 'Income'
  type: 'income' | 'expense';
  date: string; // ISO 8601 datetime string
  notes: string; // Optional, max 200 characters
  recurring: boolean; // Whether this transaction repeats monthly
}
```

### Seed Data

On first load (when `localStorage` has no `transactions` key), FinanceContext generates 40 seeded transactions spanning the past 120 days — one income transaction every 5th entry (simulating bi-weekly salary credits) and categorised expenses in between. This ensures the app looks and feels populated immediately without requiring the user to enter any data.

---

## Animations & Motion

FinlyticsX uses two animation libraries for different purposes:

### Framer Motion — Component Animations

Every element that enters or exits the DOM uses Framer Motion. The consistent patterns used across the app:

**Page entrance** — each major section animates in with `initial={{ opacity: 0, y: 16-24 }}` and `animate={{ opacity: 1, y: 0 }}` with staggered delays.

**List items** — `AnimatePresence` wraps all dynamic lists with `mode="popLayout"` so items animate out when deleted and others reflow smoothly.

**Modal entrance** — `scale: 0.88 → 1` with `y: 32 → 0` creates a "pop up from below" feel.

**Spring easing** — `ease: [0.16, 1, 0.3, 1]` is used on all layout transitions for the characteristic snap.

**Drawer** — `x: '100%' → 0` with `top: var(--nav-height)` anchors it below the navbar.

### GSAP + ScrollTrigger — Analytics Cinematic

GSAP is used exclusively on the Analytics page for scroll-driven sequences that Framer Motion can't easily handle:

- **Per-character title animation** — GSAP splits the hero title into individual `<span>` elements and animates each with `rotateX: -60 → 0` and `stagger: 0.03`
- **ScrollTrigger reveals** — `start: 'top 85%'` fires when 85% of the viewport reaches the element's top
- **Chart scan line** — a `div` swept across each chart panel from `-5%` to `105%` left position
- **Heatmap stagger** — 168 cells (7×24) animate in with `stagger: { from: 'random', amount: 1.2 }`
- **Number counters** — data-attribute-driven counter animations read `data-anx-num` values

GSAP is loaded dynamically via CDN `<script>` injection inside a `useEffect` with an `if (!window.gsap)` guard. This avoids adding GSAP to the npm bundle while keeping it available after the first Analytics visit.

---

## How We Built This

### Phase 1 — Foundation

Started with Vite + React 19, set up the global CSS token system, built `FinanceContext` with localStorage persistence and seed data, established routing with React Router, and created the base `Navbar` component.

### Phase 2 — Core Pages

Built all 5 required pages in sequence: Dashboard (with boot sequence and NewsAPI), AddTransaction (full form with react-hook-form + Yup + custom date picker), Transactions (full CRUD with search/filter/sort), Budget (circular dial + velocity bar + category limits), Analytics (4 Recharts charts + GSAP).

### Phase 3 — Custom Hooks

Extracted reusable logic into `useCurrency` (singleton global state for FX), `useDebounce` (for search), `useCountUp` (animated numbers), `useToast` (notification state), `useBudget` and `useTransactions` (context convenience wrappers).

### Phase 4 — Polish

Added the `EditTransactionDrawer` (required solving a `z-index` stacking context bug — `transform: translateX` on row hover was creating a stacking context that trapped the context menu, fixed by switching to `margin-left` instead). Built the custom `ToastNotification` overlay. Added `TransactionCard` for Dashboard. Wired Sidebar into the App layout.

### Phase 5 — Currency & FX

Built the `useCurrency` singleton hook, integrated `exchangerate-api.com`, wired the FX dropdown in Navbar, updated all pages to destructure `{ formatCurrency }` correctly.

### Phase 6 — Date Range Filter

Built a fully custom calendar picker as a React component with no native browser UI. Initially attempted `<input type="date">` with CSS overrides, discovered that the browser's native calendar popup is rendered by the OS and is completely unstyled by CSS — rebuilt as a pure React calendar.

### Phase 7 — Bonus Pages

Built `Goals.jsx` (gold/amber aesthetic, SVG arc progress, confetti milestones, contribute modal) and `Invoices.jsx` (cyan/teal aesthetic, Kanban pipeline view, list table view, auto-overdue detection, CSV export). Both are fully self-contained with their own localStorage namespaces.

### Key Technical Decisions

**Why `margin-left` instead of `transform` on hover?**
CSS `transform: translateX(2px)` creates a new stacking context on the element. This scopes all `z-index` values inside the transformed element to that context — meaning a `z-index: 9999` context menu inside a transformed row can never appear above elements outside the row. `margin-left: 3px` achieves the same visual nudge without creating a stacking context.

**Why a custom calendar instead of `<input type="date">`?**
The browser's native date picker is rendered by the OS/browser UI layer, completely bypassing the DOM's CSS cascade. No CSS rule can reach the calendar popup. `color-scheme: dark` can make it dark on supported browsers but cannot make it match custom design tokens. The only solution for a fully themed date picker is to build it from scratch in React.

**Why a singleton pattern for `useCurrency`?**
If `useCurrency` stored state inside a React Context, switching currency would require a Context provider at the root level, and any component outside the provider wouldn't receive updates. The module-level singleton (`_currency`, `_rates`, `_listeners`) means every `useCurrency()` call anywhere in the tree shares the same state and re-renders together when `setCurrency` is called — without any provider.

**Why Goals and Invoices don't touch FinanceContext?**
Keeping them self-contained means FinanceContext stays lean and predictable. Goals and invoices are logically separate domains — goals are aspirational (what you want to save toward), invoices are operational (what clients owe you). Neither needs to know about individual expense transactions. Separation of concerns also means these pages can be removed or extended without touching the core financial state.

---

## File Structure

```
finlyticsx/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Charts/
│   │   │   ├── SpendingDonut.jsx
│   │   │   └── MonthlyTrend.jsx
│   │   ├── EditTransactionDrawer/
│   │   │   ├── EditTransactionDrawer.jsx
│   │   │   └── EditTransactionDrawer.css
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.css
│   │   └── TransactionCard/
│   │       ├── TransactionCard.jsx
│   │       └── TransactionCard.css
│   ├── context/
│   │   └── FinanceContext.jsx
│   ├── hooks/
│   │   ├── useBudget.js
│   │   ├── useCountUp.js
│   │   ├── useCurrency.js
│   │   ├── useDebounce.js
│   │   ├── useToast.js
│   │   └── useTransactions.js
│   ├── pages/
│   │   ├── AddTransaction.jsx
│   │   ├── AddTransaction.css
│   │   ├── Analytics.jsx
│   │   ├── Analytics.css
│   │   ├── Budget.jsx
│   │   ├── Budget.css
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── Goals.jsx
│   │   ├── Goals.css
│   │   ├── Invoices.jsx
│   │   ├── Invoices.css
│   │   ├── Transactions.jsx
│   │   └── Transactions.css
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── global.css
│   │   └── theme.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- All components use functional React with hooks
- CSS uses BEM-inspired class naming scoped to each page (`tx-` for Transactions, `bdg-` for Budget, `anx-` for Analytics, `gl-` for Goals, `inv-` for Invoices)
- No inline styles except for dynamic CSS custom property values (`style={{ '--accent': color }}`)
- Framer Motion for all enter/exit animations, GSAP only for scroll-driven sequences

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [Recharts](https://recharts.org) — composable chart library for React
- [Framer Motion](https://www.framer.com/motion/) — production-ready animation library
- [GSAP](https://greensock.com/gsap/) — professional-grade animation platform
- [date-fns](https://date-fns.org) — modern JavaScript date utility library
- [React Icons](https://react-icons.github.io/react-icons/) — popular icon packs as React components
- [exchangerate-api.com](https://www.exchangerate-api.com) — free currency exchange rate API
- [NewsAPI](https://newsapi.org) — live news headlines API
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — monospace font built for developers

---

<div align="center">

**Built with obsessive attention to detail.**

_FinlyticsX — Every rupee tracked. Every pattern surfaced. Every insight actionable._

</div>

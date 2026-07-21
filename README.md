# Inventra — Inventory Management System

Premium **frontend-only** inventory management dashboard built with React 19 + Vite.

## Features

- Local + DummyJSON authentication
- Full inventory management for every signed-in account
- Product CRUD, categories, and stock-level tracking
- Supplier directory with product linking
- Warehouse receive / transfer operations and capacity view
- Intelligent reorder suggestions on the dashboard
- Dashboard with stats, Recharts visualizations, recent activity
- Local CRUD overlay (add / edit / delete persisted in `localStorage`)
- Glassmorphism SaaS UI, Framer Motion transitions, skeleton loaders

## Tech Stack

React 19 · Vite · React Router · Context API · Axios · React Hook Form · React Toastify · Framer Motion · React Loading Skeleton · React Icons · Recharts

## Getting Started

```bash
npm install
npm run dev
```

## Sign in

1. Open **/register** and create a local account, or
2. Sign in with any [DummyJSON user](https://dummyjson.com/users).

Local accounts are stored in this browser’s `localStorage`. Sign out before switching accounts.

Every signed-in account can use the dashboard, product CRUD, stock management,
suppliers, warehouses, and settings.

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |

## Notes

- Product catalog is loaded from [DummyJSON](https://dummyjson.com).
- Inventory changes are stored locally so the app remains frontend-only without a custom backend.
- Theme and auth session are stored in `localStorage`.

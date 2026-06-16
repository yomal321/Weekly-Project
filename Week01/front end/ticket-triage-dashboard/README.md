# PMO Ticket Triage Dashboard

BISTEC PMO internal tool for triaging inbound tickets from email, Slack, and spreadsheets.

**Tech stack:** React + TypeScript + Vite · `json-server` (data persistence)
**Spec:** [PRD v2.0](./PRD-ticket-triage-dashboard.md) · [ADR-001](./ADR-001-frontend-framework.md) · [ADR-002](./ADR-002-data-persistence.md)

---

## Prerequisites

- Node.js 20+
- npm 9+

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start both servers together
```bash
npm start
```

This runs two processes concurrently:
- `json-server` on **http://localhost:3001** (data API)
- Vite dev server on **http://localhost:5173** (the app)

### 3. Open the app
Navigate to **http://localhost:5173** in Chrome or Edge.

---

## Run servers individually

```bash
# Data server only
npm run server

# Frontend only (json-server must already be running)
npm run dev
```

---

## CI checks (run locally before pushing)

```bash
npm run typecheck   # TypeScript type check
npm run lint        # ESLint
npm run build       # Production build
```

These same checks run automatically on every push via GitHub Actions (`.github/workflows/ci.yml`).

---

## Project structure

```
src/
├── api/
│   └── tickets.ts        ← All fetch calls to json-server
├── components/
│   ├── AddTicketForm.tsx  ← New ticket form
│   ├── FilterBar.tsx      ← Priority filter + show resolved toggle
│   ├── TicketCard.tsx     ← Individual ticket display + actions
│   └── TicketList.tsx     ← Sorted, filtered list of tickets
├── types/
│   └── ticket.ts         ← Priority enum, TicketStatus, Ticket interface
├── App.tsx               ← Root component, state + API wiring
├── main.tsx              ← Entry point
└── index.css             ← All styles
db.json                   ← json-server data file (seed data included)
```

---

## Seed data

`db.json` includes 5 sample tickets (2 Critical, 1 High, 1 Low open + 1 Resolved) so the dashboard is useful from the first run.

---

## v2 migration note

When a real backend replaces `json-server`, update only `API_BASE` in `src/api/tickets.ts`. All fetch calls stay identical. See ADR-002 for the full reasoning.

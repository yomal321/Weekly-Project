# Ticket Triage Tool — PRD

**Version:** 2.0  
**Author:** Yomal  
**Date:** 2026-07-07  
**Status:** Accepted  
**Project:** BISTEC PMO Ticket Triage Dashboard  

---

## 1. Persona

### Amara — PMO Coordinator *(primary user)*

**Context:**  
Amara works at BISTEC as the primary PMO Coordinator. She sits at a desk from 9am–6pm Monday to Friday, using a Windows laptop running Chrome or Edge on a 1280px+ screen. She is not technical — she uses web apps daily but has never touched code or a terminal.

**Pain Point:**  
Every morning Amara opens three separate tools — her email inbox, the team Slack, and a shared spreadsheet — to collect inbound support tickets. She manually reads through them, tries to judge urgency from subject lines and message context, and builds a mental priority list. This takes 30–40 minutes and she frequently misses items buried in email threads or old Slack messages.

When something critical arrives mid-day, there is no single place to surface it. Amara may not see it for hours. The PMO Lead, Dinesh, cannot check status without interrupting her.

---

### Dinesh — PMO Lead *(secondary user)*

**Context:**  
Dinesh is semi-technical. He is accountable if a critical issue goes unhandled. He checks in on team workload several times a day and needs a quick read of what is currently on fire — without asking anyone.

**Pain Point:**  
No shared view of ticket state. Every status check requires interrupting Amara or manually scanning the same three fragmented sources.

---

## 2. Problem Statement

**What breaks today:**  
The BISTEC PMO team receives inbound support tickets from three sources — email, Slack, and spreadsheets. These sources are not connected. There is no single list, no shared priority order, and no way to mark something as done without editing a spreadsheet or replying to an email thread.

**Who is affected:**  
- Amara loses 30–40 minutes every morning to manual aggregation and mental prioritisation.
- Dinesh cannot get a status read without asking Amara directly.
- Critical tickets (system down, broken login) can sit unseen for hours if they arrive in a low-signal channel.

**Why now:**  
The team size is growing and ticket volume has increased. The manual process that worked at 5 tickets/day is breaking at 20–50 tickets/day. One missed critical ticket in the last quarter caused a client escalation that reached the BISTEC director.

---

## 3. Goals & Non-Goals

### Goals

| # | Goal | How We Measure |
|---|---|---|
| G1 | All manually entered tickets visible in one place | 100% of submitted tickets appear on the dashboard |
| G2 | Critical tickets always at the top | Default sort = P0 → P1 → P2, verified by AC-01 |
| G3 | Triage a ticket in under 30 seconds | Timed walkthrough with a first-time user |
| G4 | Zero critical tickets missed during working hours | No P0 ticket unseen for more than 1 hour, 9am–6pm Mon–Fri |
| G5 | PMO Lead gets full status in under 1 minute | Timed review with Dinesh, no assistance |

### Non-Goals

The following are explicitly out of scope for v1:

- **No external integrations** — tickets are entered manually; no Jira, Slack, or email sync
- **No authentication or RBAC** — no login screen, no per-user permissions
- **No notifications or alerts** — no email/Slack push when a P0 arrives
- **No ticket assignment** — tickets are not assigned to individual team members
- **No comments or activity log** — no per-ticket discussion thread
- **No reporting or analytics** — no charts, exports, or SLA tracking
- **No mobile support** — web browser on laptop only (1280px+)

---

## 4. Functional Requirements

### FR-1 — View all open tickets sorted by priority

The dashboard displays all unresolved tickets in a single list, sorted P0 → P1 → P2 by default.

**Acceptance Criteria:**
```
Given: the dashboard is open and tickets exist in the database
When:  the page loads
Then:  all unresolved tickets are displayed
And:   P0 tickets appear before P1, P1 before P2
And:   resolved tickets are not visible
```

---

### FR-2 — Create a new ticket

A user can create a ticket by providing a title, optional description, optional source, and a priority.

**Acceptance Criteria:**
```
Given: the user has filled in a title and selected a priority
When:  the user clicks "Add ticket"
Then:  the new ticket appears in the list at the correct priority position
And:   no full page reload occurs
And:   all entered fields are shown on the ticket card

Given: the user submits the form with no title
When:  the user clicks "Add ticket"
Then:  an inline error "Title is required" is shown
And:   no ticket is created
```

---

### FR-3 — Change ticket priority

A user can change the priority of any open ticket. The list re-sorts immediately.

**Acceptance Criteria:**
```
Given: a ticket with priority P1 is visible
When:  the user changes its priority to P0
Then:  the ticket moves to the top of the list immediately
And:   no page reload is required
And:   the change is persisted in the database
```

---

### FR-4 — Filter tickets by priority

A user can filter the list to show only tickets of a selected priority level.

**Acceptance Criteria:**
```
Given: tickets of multiple priorities are displayed
When:  the user clicks the "P0" filter button
Then:  only P0 tickets are visible
And:   P1 and P2 tickets are hidden

Given: a priority filter is active
When:  the user clicks "All"
Then:  all unresolved tickets are shown again sorted by priority
```

---

### FR-5 — Resolve a ticket and view resolved tickets

A user can mark any open ticket as resolved. Resolved tickets leave the default view. A toggle shows resolved tickets at the bottom of the list.

**Acceptance Criteria:**
```
Given: an open ticket is visible in the list
When:  the user clicks "Resolve"
Then:  the ticket disappears from the list immediately
And:   no page reload is required
And:   the ticket's resolved field is set to true in the database

Given: one or more resolved tickets exist
When:  the user enables "Show resolved"
Then:  resolved tickets appear below the open list
And:   they are visually distinct (greyed out, strikethrough title)
And:   the open ticket list is unchanged
```

---

## 5. Non-Functional Requirements

### Performance

| Target | Requirement |
|---|---|
| Page load | Dashboard fully interactive in under 2 seconds on a standard office connection (50 Mbps) |
| Priority change | List re-sorts in under 500ms after a priority dropdown change |
| Ticket capacity | No visible degradation up to 500 open tickets |

### Security

| Target | Requirement |
|---|---|
| Input validation | All API inputs validated with Zod before reaching the database; malformed payloads return 400 |
| SQL injection | Prisma ORM used for all queries — no raw SQL string interpolation |
| Secrets | `DATABASE_URL` stored in `.env`, never committed to the repository (`.gitignore` enforced) |
| v1 scope | No authentication required — tool is internal, network-access restricted to office |

### Observability

| Target | Requirement |
|---|---|
| Query logging | Prisma query log enabled in development (`log: ["query"]` in `db.ts`) |
| API errors | All API route handlers return structured JSON error objects with a `message` field |
| Build health | GitHub Actions CI runs typecheck + lint + build on every push to main or PR |
| TypeScript | Strict mode enabled, zero `any` types — type errors caught at build time, not runtime |

### Browser Support

Works correctly on Chrome and Edge (standard BISTEC office browsers) at 1280px and above.

---

## 6. Architecture Decision Records

---

### ADR-001 — Framework Choice: Next.js

**Status:** Accepted  
**Date:** 2026-06-22  

#### Context

The dashboard needs to:
- Render a live-sorted ticket list that re-orders immediately after priority changes (FR-3)
- Handle filter state without a page reload (FR-4)
- Serve API endpoints (`/api/tickets`) from the same project — no separate backend service
- Be simple enough to build and maintain by a single intern-level developer
- Run in Chrome/Edge on Windows office laptops

Three options were evaluated:

**Option A — Plain HTML + Vanilla JavaScript**  
No build tooling. DOM manipulation only.  
*Rejected:* Manual DOM diffing for live-sorted lists becomes unmaintainable past ~200 lines. No component model. No TypeScript without extra setup.

**Option B — React + Vite (SPA only)**  
Client-side React with a separate mock backend (json-server).  
*Rejected for v2:* Requires running two processes. API layer must be rewritten when json-server is replaced. Not suitable for the production-ready architecture required by Month 1.

**Option C — Next.js 15+ App Router**  
Full-stack React framework. API routes and UI live in the same project. TypeScript first-class.  
*Selected.*

#### Decision

**Next.js App Router** with TypeScript strict mode and Tailwind CSS.

#### Consequences

**Positive:**
- One project, one `npm run dev` — API routes (`src/app/api/`) and UI (`src/app/page.tsx`) run together
- TypeScript strict + Zod catch invalid priority values at compile time and at the API boundary
- App Router enables Server Components for future server-side data fetching
- Tailwind CSS removes the need for a separate CSS file
- Aligns with BISTEC's TypeScript stack

**Negative / trade-offs:**
- Next.js is heavier than plain React + Vite — slightly more than needed for a tool this small
- App Router has a steeper learning curve than Pages Router for developers new to Next.js
- Dynamic route `params` are Promises in Next.js 15+ — requires `await params` in every route handler, a breaking change from Next.js 14 that is easy to miss

---

### ADR-002 — Data Layer: Prisma + SQLite

**Status:** Accepted  
**Date:** 2026-06-22  

#### Context

The dashboard must persist ticket data across page refreshes and be accessible to multiple users (Amara and Dinesh on separate machines). Options evaluated:

**Option A — React state only (in-memory)**  
Ticket data lives in `useState`. Refreshing the page wipes everything.  
*Rejected:* Data loss on refresh is a hard blocker. Violates G4 immediately.

**Option B — localStorage**  
Tickets serialised to `localStorage` on every change.  
*Rejected:* Data is per-browser, per-device. Amara's tickets are invisible to Dinesh unless they share a machine.

**Option C — json-server (mock REST API from a flat file)**  
Used in the v1 React prototype.  
*Rejected for v2:* Not a real database. No type-safe queries. No migration workflow. Replacing it requires rewriting the entire data layer.

**Option D — Prisma ORM + SQLite**  
Prisma provides a type-safe query API. SQLite is a single file — no separate database server required.  
*Selected.*

**Option E — Prisma + PostgreSQL**  
Production-grade relational database.  
*Deferred to v2:* Requires a hosted database instance and ops overhead. Out of scope for a v1 deliverable.

#### Decision

**Prisma ORM with SQLite** (`prisma/dev.db`), with a documented migration path to PostgreSQL in v2.

#### Consequences

**Positive:**
- Zero infrastructure — SQLite is a single file on disk, no server to provision
- Prisma generates a fully type-safe client from `schema.prisma` — TypeScript knows the exact shape of every row
- Migration workflow (`npx prisma migrate dev`) tracks schema changes like git commits
- `prisma/seed.ts` provides repeatable sample data for demos and CI
- v2 migration to PostgreSQL is a one-line change in `schema.prisma` — all query code stays identical

**Negative / trade-offs:**
- SQLite is a single-writer database — concurrent writes from two browsers simultaneously are not safe. Acceptable at PMO scale (one active triager at a time)
- SQLite file is local to the machine running the server — Amara and Dinesh must access the same running instance
- Prisma v6 deprecates `package.json#prisma` config in favour of `prisma.config.ts` — migration required before Prisma v7

**Migration path to v2:**
```prisma
datasource db {
  provider = "postgresql"        // was "sqlite"
  url      = env("DATABASE_URL") // point to hosted Postgres
}
```
All `db.ticket.findMany()` and `db.ticket.create()` calls remain unchanged.

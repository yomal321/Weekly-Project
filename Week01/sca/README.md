# BISTEC PMO Ticket Triage Dashboard

A lightweight dashboard for BISTEC PMO staff to triage inbound tickets by priority.
Built spec-first — PRD → ADRs → Speckit → Scaffold → CI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Backend | Next.js API Routes |
| ORM | Prisma |
| Database | SQLite |
| Testing | Jest |

---

## Project Structure

```
ticket-triage/
├── docs/
│   └── spec/
│       ├── prd.md                    # Product Requirements Document
│       ├── adr-001-framework.md      # ADR: Next.js over plain React
│       ├── adr-002-data-storage.md   # ADR: SQLite + Prisma over raw SQL
│       └── stories/                  # Individual story files
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tickets/
│   │   │       ├── route.ts          # GET all tickets, POST create ticket
│   │   │       ├── resolved/
│   │   │       │   └── route.ts      # GET resolved tickets
│   │   │       └── [id]/
│   │   │           ├── priority/
│   │   │           │   └── route.ts  # PATCH update priority
│   │   │           └── resolve/
│   │   │               └── route.ts  # PATCH resolve ticket
│   │   └── tickets/
│   │       └── page.tsx              # Dashboard UI
│   ├── lib/
│   │   └── db.ts                     # Prisma client singleton
│   └── server/
│       └── routes/
│           └── tickets.ts            # API handler functions
├── prisma/
│   ├── schema.prisma                 # Data model
│   └── seed.ts                       # Sample ticket data
├── tests/                            # Jest test files
├── speckit.yaml                      # Agent-executable task plan
└── README.md
```

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/bistec/ticket-triage.git
cd ticket-triage
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./prisma/dev.db"
```

### 4. Run Prisma migration

```bash
npx prisma migrate dev --name init
```

### 5. Seed the database

```bash
npx prisma db seed
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000/tickets](http://localhost:3000/tickets) in your browser.

---

## API Endpoints

| Method | Endpoint | Description | FR |
|---|---|---|---|
| GET | `/api/tickets` | Get all unresolved tickets sorted by priority | FR-1 |
| POST | `/api/tickets` | Create a new ticket | FR-2 |
| PATCH | `/api/tickets/:id/priority` | Update ticket priority | FR-3 |
| PATCH | `/api/tickets/:id/resolve` | Mark ticket as resolved | FR-6 |
| GET | `/api/tickets/resolved` | Get all resolved tickets | FR-7 |

---

## Regenerate Scaffold with Claude Code

To regenerate the full scaffold from the speckit in under 10 minutes:

### Step 1 — Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### Step 2 — Run the speckit

```bash
claude -p "Read speckit.yaml and execute each task in order from ST-01 to ST-13. 
For each task: read the description, build the file, run the acceptance criteria. 
Stack: Next.js 14, TypeScript, Prisma, SQLite. 
Do not skip any task. Do not combine tasks."
```

### Step 3 — Run migration and seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

That is all. The full scaffold regenerates from the speckit in one Claude Code command.

---

## Running Tests

```bash
npm run test
```

Tests are located in the `tests/` folder and map directly to the acceptance criteria in `speckit.yaml`.

---

## Spec Documents

| Document | Location | Purpose |
|---|---|---|
| PRD | `docs/spec/prd.md` | What the dashboard must do |
| ADR-001 | `docs/spec/adr-001-framework.md` | Why Next.js |
| ADR-002 | `docs/spec/adr-002-data-storage.md` | Why Prisma + SQLite |
| Speckit | `speckit.yaml` | Agent-executable task plan |

---

## Acceptance Criteria

| ID | Given | When | Then |
|---|---|---|---|
| AC-01 | Dashboard is open | Page loads | All unresolved tickets shown, Critical first |
| AC-02 | A ticket exists | Priority is changed | Ticket moves to correct position immediately |
| AC-03 | Multiple priorities exist | A filter is selected | Only matching tickets are shown |
| AC-04 | An open ticket exists | Resolve is clicked | Ticket disappears from the list immediately |
| AC-05 | Resolved tickets exist | Show Resolved is enabled | Resolved tickets appear at the bottom |
# Context Engineering Journal — Month 1

**Author:** Yomal
**Project:** BISTEC PMO Ticket Triage Dashboard

---

## Prompt Strategy

| Task | Files attached | Why those and not more |
|---|---|---|
| Initial scaffold (ST-01) | None — plain instructions only | No code exists yet, so no files are relevant. Attaching anything would be noise. |
| Prisma schema (ST-02) | `docs/spec/prd.md`, `docs/spec/adr-002-data-storage.md` | The PRD defines the exact ticket fields; the ADR justifies Prisma + SQLite. Both are needed to generate a schema that matches requirements exactly — nothing else changes the output. |
| API routes (ST-05 to ST-08) | `prisma/schema.prisma`, `speckit.yaml` (one story at a time) | The schema tells Claude Code the exact field names and types to use in queries. Only the single story's acceptance criteria were given — not the whole speckit — to keep the task focused. |
| Dashboard page (ST-09 to ST-12) | `prisma/schema.prisma`, the relevant API route file | The frontend needs to know the exact shape of the API response. Attaching the ADRs or PRD again added nothing new the model didn't already need. |

---

## Failure Modes

### Failure 1 — Wrong priority label scheme

**What happened:** The first PRD, ADRs, and speckit were all written using `Critical / High / Low` as the priority values.

**What was missing:** The actual challenge brief (read later from the BISTEC process site) required `P0 / P1 / P2` as the priority scheme. This detail was never confirmed against the source document before building — the assumption was carried over from an earlier example project.

**What was added:** Re-read the actual challenge page, then rewrote the PRD, ADRs, `schema.prisma`, and `speckit.yaml` to use `P0 / P1 / P2` consistently across every file.

---

### Failure 2 — Wrong framework version

**What happened:** ADR-001 and the first `speckit.yaml` specified `Next.js 14`.

**What was missing:** The actual challenge brief required `Next.js 15 App Router`. This was only caught after fetching and reading the real challenge page — the version number had been guessed rather than confirmed.

**What was added:** Updated ADR-001 and `speckit.yaml` meta section to `Next.js 15`. (Note: the scaffold Claude Code actually generated used Next.js 16.2.9, since `create-next-app@latest` pulled the newest version at the time — this is a live example of spec vs. actual drift that needs to be reconciled in the ADR.)

---

### Failure 3 — Missing validation and styling layers entirely

**What happened:** The first scaffold plan (ST-06, ST-07 in the original speckit) described manual `if` statement validation in the API routes, and no styling library was specified for the dashboard.

**What was missing:** The challenge brief required Zod for request validation and Tailwind CSS for styling — neither had been included in the original PRD or ADRs, so Claude Code was never told to use them.

**What was added:** Updated every API task in `speckit.yaml` with an explicit `validation_zod` block listing exact field rules, and added Tailwind to the ST-01 scaffold command (`--tailwind` flag) and to ADR-001.

---

## Re-Prompt Examples

### Pair 1 — Priority scheme correction

**Before (produced wrong output):**
> "Create the Prisma schema for the Ticket model with a priority field."

**Agent's actual output (excerpt):**
```prisma
priority String // Critical | High | Low
```

**After (fixed):**
> "Create the Prisma schema for the Ticket model. The priority field must only accept the values P0, P1, or P2 — do not use Critical/High/Low, that scheme is deprecated for this project."

**Commentary:** Without stating the exact enum values explicitly and ruling out the old scheme by name, the model defaulted back to the label set it had seen earlier in the conversation history. Naming the wrong option explicitly, not just the right one, was what fixed it.

---

### Pair 2 — Combining split PATCH routes into one endpoint

**Before (produced wrong output):**
> "Create PATCH endpoints for updating ticket priority and for resolving a ticket."

**Agent's actual output (excerpt):**
```
src/app/api/tickets/[id]/priority/route.ts
src/app/api/tickets/[id]/resolve/route.ts
```
Two separate route files, two separate handlers, duplicated validation logic in each.

**After (fixed):**
> "Create a single PATCH /api/tickets/:id endpoint. It should accept an optional `priority` field and an optional `resolved` field in the same request body, validated with one Zod schema. Do not create separate routes for priority and resolve."

**Commentary:** The vaguer prompt let the model split the work along the two acceptance criteria it saw, producing duplicated logic. Being explicit about "single endpoint" and "do not create separate routes" removed the ambiguity.

---

### Pair 3 — Less context produced a better result (schema generation)

**Before (worse output, more context):**
Attached: `prd.md`, `adr-001-framework.md`, `adr-002-data-storage.md`, the full `speckit.yaml` (all 13 tasks), and the old `Critical/High/Low` version of the PRD from a previous draft still open in the same session.

**Agent's actual output (excerpt):**
```prisma
model Ticket {
  id          Int      @id @default(autoincrement())
  title       String
  priority    String   // Critical | High | Low
  status      String   // added an extra status field not in spec
  assignedTo  String?  // invented field, not requested
}
```
The model invented an `assignedTo` field and a `status` field that were never requested, likely inferred from the broader speckit context describing later frontend features.

**After (better output, less context):**
Attached only: `docs/spec/prd.md` (Functional Requirements + NFR sections only, not the whole document).

**Agent's actual output (excerpt):**
```prisma
model Ticket {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  source      String?
  priority    String
  resolved    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
Matched the PRD's 8 fields exactly — no invented fields.

**Commentary:** Attaching the full speckit (which describes future frontend stories referencing things like ticket ownership) gave the model material to infer requirements that were never actually specified. Narrowing the context to only the PRD section relevant to the schema removed that inference path entirely.

**Measurable improvement:** The "more context" version required a second correction cycle (removing 2 invented fields, ~15 min); the "less context" version matched the PRD exactly on the first attempt — a 100% reduction in rework for that task.

---

## Summary

| Failure mode | Root cause | Fix pattern |
|---|---|---|
| Wrong priority labels | Assumption carried from an unrelated example, never checked against source | Verify against the actual brief before writing any spec file |
| Wrong framework version | Guessed version number instead of confirming it | Read the source document directly, don't infer from memory |
| Missing Zod / Tailwind | Requirements were in the brief but never transcribed into the PRD | Cross-check every technical constraint listed in the brief against the ADRs before scaffolding |
| Invented fields with excess context | Full speckit + old drafts left in context gave the model unrelated material to infer from | Attach only the specific section needed for the task at hand |
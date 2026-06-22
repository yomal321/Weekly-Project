meta:
  project: BISTEC PMO Ticket Triage Dashboard
  version: 1.0
  author: Yomal
  date: 2026-06-09
  stack:
    frontend: Next.js 14 (App Router)
    backend: Next.js API Routes
    orm: Prisma
    database: SQLite
    language: TypeScript
  repo_structure:
    - ticket-triage/
    - ticket-triage/docs/spec/prd.md
    - ticket-triage/docs/spec/adr-001-framework.md
    - ticket-triage/docs/spec/adr-002-data-storage.md
    - ticket-triage/docs/spec/stories/
    - ticket-triage/prisma/schema.prisma
    - ticket-triage/src/app/tickets/page.tsx
    - ticket-triage/src/lib/db.ts
    - ticket-triage/src/server/routes/tickets.ts
    - ticket-triage/tests/
    - ticket-triage/speckit.yaml
    - ticket-triage/README.md

tasks:

  - id: ST-01
    title: Project Scaffold
    layer: foundation
    estimate: 15min
    depends_on: []
    description: >
      Initialise a Next.js 14 project with TypeScript, Prisma, and SQLite.
      Install all required dependencies. Verify the dev server starts without errors.
    commands:
      - npx create-next-app@latest ticket-triage --typescript --app --no-tailwind --eslint
      - cd ticket-triage
      - npm install prisma @prisma/client
      - npx prisma init --datasource-provider sqlite
    acceptance_criteria:
      - given: the project is cloned and dependencies installed
        when: npm run dev is executed
        then: the Next.js dev server starts on localhost:3000 without errors
      - given: prisma is installed
        when: npx prisma --version is run
        then: prisma version is printed without errors

  - id: ST-02
    title: Prisma Schema + Migration
    layer: data
    estimate: 20min
    depends_on: [ST-01]
    description: >
      Define the Ticket model in prisma/schema.prisma matching the PRD entities exactly.
      Run the migration to create the SQLite database. Verify the table is created.
    schema:
      model: Ticket
      fields:
        - name: id          | type: Int      | attributes: "@id @default(autoincrement())"
        - name: title       | type: String
        - name: description | type: String?
        - name: source      | type: String?
        - name: priority    | type: String   | note: "Critical | High | Low"
        - name: resolved    | type: Boolean  | attributes: "@default(false)"
        - name: createdAt   | type: DateTime | attributes: "@default(now())"
    commands:
      - npx prisma migrate dev --name init
    acceptance_criteria:
      - given: the prisma schema is defined
        when: npx prisma migrate dev is run
        then: migration runs clean with no errors and dev.db is created in prisma/
      - given: the migration has run
        when: npx prisma studio is opened
        then: the Ticket table is visible with all fields matching the schema

  - id: ST-03
    title: Prisma Client + DB Helper
    layer: data
    estimate: 10min
    depends_on: [ST-02]
    description: >
      Create src/lib/db.ts that exports a singleton Prisma client instance.
      This file is imported by all API routes — do not create multiple Prisma instances.
    file: src/lib/db.ts
    acceptance_criteria:
      - given: src/lib/db.ts exists
        when: it is imported in any API route
        then: it returns a single shared PrismaClient instance without warnings

  - id: ST-04
    title: Seed Data
    layer: data
    estimate: 10min
    depends_on: [ST-02]
    description: >
      Create prisma/seed.ts with at least 6 sample tickets covering all three
      priority levels (Critical, High, Low) and a mix of resolved and unresolved.
      Register the seed script in package.json.
    file: prisma/seed.ts
    sample_tickets:
      - title: Login page broken | priority: Critical | resolved: false
      - title: Dashboard loads slowly | priority: High | resolved: false
      - title: Wrong label on settings | priority: Low | resolved: false
      - title: API returns 500 on export | priority: Critical | resolved: false
      - title: Email notifications delayed | priority: High | resolved: false
      - title: Footer link is broken | priority: Low | resolved: true
    commands:
      - npx prisma db seed
    acceptance_criteria:
      - given: the seed script is run
        when: npx prisma db seed is executed
        then: 6 tickets are inserted into the database without errors

  - id: ST-05
    title: "API: GET /api/tickets"
    layer: api
    estimate: 20min
    depends_on: [ST-03]
    description: >
      Create the GET /api/tickets route in src/server/routes/tickets.ts.
      Returns all unresolved tickets sorted by priority: Critical first, then High, then Low.
      Maps to FR: "Staff must be able to view all tickets sorted by priority."
    file: src/app/api/tickets/route.ts
    priority_sort_order:
      Critical: 1
      High: 2
      Low: 3
    acceptance_criteria:
      - given: unresolved tickets exist in the database
        when: GET /api/tickets is called
        then: returns 200 with a JSON array of unresolved tickets sorted Critical first
      - given: no tickets exist
        when: GET /api/tickets is called
        then: returns 200 with an empty array

  - id: ST-06
    title: "API: POST /api/tickets"
    layer: api
    estimate: 20min
    depends_on: [ST-03]
    description: >
      Create the POST /api/tickets route.
      Validates that title is present and priority is one of Critical, High, Low.
      Maps to FR: "Staff must be able to create a new ticket."
    file: src/app/api/tickets/route.ts
    validation:
      - title is required — return 400 if missing
      - priority must be Critical | High | Low — return 400 if invalid
    acceptance_criteria:
      - given: a valid ticket payload with title and priority
        when: POST /api/tickets is called
        then: returns 201 with the created ticket as JSON
      - given: a payload with no title
        when: POST /api/tickets is called
        then: returns 400 with an error message and does not save the ticket

  - id: ST-07
    title: "API: PATCH /api/tickets/:id/priority"
    layer: api
    estimate: 15min
    depends_on: [ST-03]
    description: >
      Create the PATCH /api/tickets/[id]/priority route.
      Updates the priority of a specific ticket.
      Maps to FR: "Staff must be able to assign a priority to a ticket."
    file: src/app/api/tickets/[id]/priority/route.ts
    acceptance_criteria:
      - given: a ticket with id 1 exists
        when: PATCH /api/tickets/1/priority is called with body { "priority":"Low" }
        then: returns 200 with the updated ticket showing the new priority
      - given: an invalid priority value is sent
        when: PATCH /api/tickets/1/priority is called with body { "priority":"Urgent" }
        then: returns 400 with a validation error

  - id: ST-08
    title: "API: PATCH /api/tickets/:id/resolve"
    layer: api
    estimate: 15min
    depends_on: [ST-03]
    description: >
      Create the PATCH /api/tickets/[id]/resolve route.
      Sets resolved = true on the specified ticket.
      Maps to FR: "Staff must be able to mark a ticket as resolved."
    file: src/app/api/tickets/[id]/resolve/route.ts
    acceptance_criteria:
      - given: an open ticket with id 1 exists
        when: PATCH /api/tickets/1/resolve is called
        then: returns 200 and the ticket no longer appears in GET /api/tickets
      - given: a ticket that is already resolved
        when: PATCH /api/tickets/1/resolve is called again
        then: returns 200 with no change — idempotent

  - id: ST-09
    title: "API: GET /api/tickets/resolved"
    layer: api
    estimate: 15min
    depends_on: [ST-03]
    description: >
      Create the GET /api/tickets/resolved route.
      Returns all tickets where resolved = true.
      Maps to FR: "Resolved tickets must be accessible via a filter."
    file: src/app/api/tickets/resolved/route.ts
    acceptance_criteria:
      - given: resolved tickets exist
        when: GET /api/tickets/resolved is called
        then: returns 200 with a JSON array of only resolved tickets
      - given: no resolved tickets exist
        when: GET /api/tickets/resolved is called
        then: returns 200 with an empty array

  - id: ST-10
    title: Dashboard Page — Ticket List
    layer: frontend
    estimate: 25min
    depends_on: [ST-05]
    description: >
      Create src/app/tickets/page.tsx.
      Fetch all tickets from GET /api/tickets on load.
      Render each ticket as a card showing: title, description, source,
      createdAt date, and a priority badge.
      Priority badge colours: Critical=red, High=amber, Low=green.
    file: src/app/tickets/page.tsx
    acceptance_criteria:
      - given: the dashboard is open and tickets exist
        when: the page loads
        then: all unresolved tickets are displayed with Critical tickets at the top
      - given: the page is loaded
        when: a ticket card is rendered
        then: it shows title, description, source, date, and a coloured priority badge

  - id: ST-11
    title: Add Ticket Form
    layer: frontend
    estimate: 25min
    depends_on: [ST-06, ST-10]
    description: >
      Add a form on the dashboard page to create a new ticket.
      On submit call POST /api/tickets and refresh the ticket list without a full page reload.
      Show an inline error if title is missing.
    fields:
      - title (text input, required)
      - description (textarea, optional)
      - source (text input, optional)
      - priority (select: Critical / High / Low, required)
    acceptance_criteria:
      - given: the form is filled with a title and priority
        when: the PMO member submits the form
        then: the new ticket appears in the list in the correct priority position immediately
      - given: the form is submitted with no title
        when: the PMO member clicks submit
        then: an inline error is shown and the form is not submitted

  - id: ST-12
    title: Priority Filter
    layer: frontend
    estimate: 20min
    depends_on: [ST-10]
    description: >
      Add filter buttons above the ticket list: All / Critical / High / Low.
      Filtering happens client-side — no additional API call needed.
    acceptance_criteria:
      - given: tickets of multiple priorities are displayed
        when: the PMO member clicks the High filter button
        then: only High priority tickets are visible
      - given: a filter is active
        when: the PMO member clicks All
        then: all unresolved tickets are shown again

  - id: ST-13
    title: Resolve Ticket + Show Resolved Toggle
    layer: frontend
    estimate: 25min
    depends_on: [ST-08, ST-09, ST-10]
    description: >
      Add a Resolve button to each ticket card. On click call PATCH /api/tickets/:id/resolve
      and remove the ticket from the list immediately.
      Add a Show Resolved toggle. When enabled fetch GET /api/tickets/resolved and display
      those tickets at the bottom of the list visually greyed out.
    acceptance_criteria:
      - given: an open ticket is visible
        when: the PMO member clicks Resolve
        then: the ticket disappears from the list immediately without a page reload
      - given: resolved tickets exist
        when: the PMO member enables Show Resolved
        then: resolved tickets appear at the bottom greyed out and distinct from open tickets
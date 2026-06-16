# PRD — BISTEC PMO Ticket Triage Dashboard

**Version:** 2.0
**Author:** Yomal
**Date:** 2026-06-16
**Status:** Draft
**Replaces:** v1.0 (2026-06-09)

---

## 1. Problem Statement

The BISTEC PMO team receives inbound tickets from multiple sources — emails, Slack messages, and spreadsheets. There is no single place to see all tickets together, no way to sort or filter by priority, and no shared view of what is urgent.

As a result:
- Critical issues are missed or handled too late.
- The team wastes 30+ minutes every morning just deciding what to work on first.
- The PMO Lead cannot get a quick status read without interrupting the team.

The core problem is **decision paralysis caused by fragmented, unsorted ticket information.** This dashboard solves it by putting every ticket in one view, sorted by priority, with triage actions that take under 30 seconds.

---

## 2. Goals

| # | Goal | How we measure it |
|---|------|------------------|
| G1 | All tickets visible in one place | 100% of manually entered tickets appear on the dashboard |
| G2 | Critical tickets always at the top | Default sort = Critical → High → Low, verified by AC-01 |
| G3 | Triage in under 30 seconds | Timed walkthrough with a new PMO member |
| G4 | Zero critical tickets missed | No critical ticket unseen for more than 1 hour during working hours |
| G5 | PMO Lead gets full status in under 1 minute | Timed review with Dinesh without asking anyone |

---

## 3. Personas

### Amara — PMO Coordinator *(primary user)*

- **Role:** Receives and triages 20–50 inbound tickets per day from email, Slack, and spreadsheets.
- **Technical level:** Non-technical. Comfortable with web apps, not with code or CLI tools.
- **Device:** Laptop, Chrome or Edge browser, 1280px+ screen.
- **Current pain:** Spends 30+ minutes every morning manually sorting through three different sources to build a mental picture of what is urgent. Frequently misses items buried in email threads.
- **What she needs:** One screen that shows everything sorted by urgency, where she can assign a priority and mark tickets done without navigating away.
- **Goal:** Finish morning triage in under 10 minutes and feel confident nothing critical is hiding.

---

### Dinesh — PMO Lead *(secondary user)*

- **Role:** Reviews triage decisions. Accountable if a critical issue is missed.
- **Technical level:** Semi-technical. Can read dashboards and basic reports.
- **Device:** Laptop or desktop, Chrome.
- **Current pain:** Has to interrupt Amara or check multiple tools to know the team's current workload and what is on fire.
- **What he needs:** A read-only-style overview of what is Critical right now, without needing to ask anyone.
- **Goal:** Get a full status read in under 1 minute at any point during the day.

---

## 4. User Stories

### Epic 1 — Ticket Visibility

**US-01**
As **Amara**, I want to see all open tickets in one list sorted by priority, so that I know immediately what the team should work on first.

**US-02**
As **Amara**, I want to add a new ticket with a title, description, source, and date, so that items from email and Slack are captured in one place.

**US-03**
As **Dinesh**, I want to open the dashboard and see the current Critical tickets without clicking anything, so that I can do a status check in under 1 minute.

---

### Epic 2 — Triage Actions

**US-04**
As **Amara**, I want to assign a priority (Critical / High / Low) to any ticket, so that the team always works on the most important thing first.

**US-05**
As **Amara**, I want the ticket list to re-sort immediately after I change a priority, so that I do not have to manually refresh or reorder anything.

---

### Epic 3 — Filtering & Resolution

**US-06**
As **Amara**, I want to filter the ticket list by priority level, so that I can focus on a specific group when needed.

**US-07**
As **Amara**, I want to mark a ticket as resolved, so that it leaves the default view and does not clutter the active list.

**US-08**
As **Dinesh**, I want to toggle a "show resolved" view, so that I can review what was completed today without it mixing with open tickets.

---

## 5. Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | The dashboard displays all unresolved tickets in a single list view. |
| FR-02 | Each ticket card shows: title, description, source, date received, and current priority. |
| FR-03 | Tickets are sorted by priority by default: Critical → High → Low. |
| FR-04 | A user can create a new ticket by providing: title, description, source (Email / Slack / Spreadsheet / Other), and date received. |
| FR-05 | A user can assign or change the priority of any ticket: Critical, High, or Low. |
| FR-06 | The list re-sorts immediately after a priority change — no page reload required. |
| FR-07 | A user can filter the list to show only tickets of a selected priority. |
| FR-08 | A user can mark any open ticket as Resolved. |
| FR-09 | Resolved tickets are hidden from the default view. |
| FR-10 | A user can toggle a "Show Resolved" mode to view resolved tickets, displayed below the open list. |

---

## 6. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | Dashboard loads within 2 seconds on a standard office connection. |
| NFR-02 | Usability | A new PMO member can triage a ticket with zero training or documentation. |
| NFR-03 | Reliability | Available during BISTEC working hours: 9am – 6pm, Mon–Fri. |
| NFR-04 | Scalability | Supports up to 500 tickets without performance degradation. |
| NFR-05 | Browser support | Works correctly on Chrome and Edge (standard BISTEC office browsers). |
| NFR-06 | Responsiveness | Usable on screens 1280px wide and above. |
| NFR-07 | Accessibility | All interactive elements are keyboard-navigable and have visible focus states. |

---

## 7. Out of Scope (v1)

- No integration with external tools (Jira, Slack, email) — tickets are entered manually.
- No user authentication or role-based access control.
- No notifications or alerts.
- No reporting, analytics, or data export.
- No mobile native app — web browser only.
- No ticket assignment to individual team members.
- No commenting or activity log on a ticket.

---

## 8. Acceptance Criteria

### AC-01 — Default view shows all unresolved tickets sorted by priority

```
Given the dashboard is open,
When a PMO member loads the page,
Then all unresolved tickets are displayed,
And they are sorted Critical first, then High, then Low,
And resolved tickets are not visible.
```

### AC-02 — Create a new ticket

```
Given the dashboard is open,
When a PMO member fills in the title, description, source, and date,
And clicks "Add Ticket",
Then the new ticket appears in the list at the correct priority position,
And all entered fields are visible on the ticket card.
```

### AC-03 — Assign or change priority

```
Given a ticket exists in the dashboard,
When a PMO member changes its priority,
Then the ticket immediately moves to the correct position in the sorted list,
And no page reload is required.
```

### AC-04 — Filter by priority

```
Given tickets of multiple priorities exist,
When a PMO member selects "Critical" from the priority filter,
Then only Critical tickets are shown,
And High and Low tickets are hidden.
```

### AC-05 — Clear filter returns full list

```
Given a priority filter is active,
When a PMO member selects "All" or clears the filter,
Then all unresolved tickets are shown again sorted by priority.
```

### AC-06 — Resolve a ticket

```
Given an open ticket exists,
When a PMO member marks it as resolved,
Then it disappears from the default view immediately,
And no page reload is required.
```

### AC-07 — Show resolved tickets

```
Given one or more resolved tickets exist,
When a PMO member enables "Show Resolved",
Then all resolved tickets appear below the open tickets,
And they are visually distinguished (e.g. greyed out or labelled "Resolved").
```

### AC-08 — Triage speed

```
Given a new ticket has just been added with no priority,
When a PMO member assigns a priority and confirms,
Then the full interaction takes under 30 seconds,
Verified by a timed walkthrough with a first-time user.
```

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| Triage time per ticket | < 30 seconds |
| Critical ticket visibility delay | < 1 hour during working hours |
| PMO Lead status read time | < 1 minute without asking anyone |
| Morning triage time (Amara) | < 10 minutes (down from 30+) |
| Missed critical tickets in first month | 0 |

---

## 10. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| OQ-01 | Should tickets have a "Medium" priority or is High/Low enough alongside Critical? | Yomal + PMO | Before dev start |
| OQ-02 | Where does ticket data persist — localStorage, backend DB, or in-memory only for v1? | Yomal | ADR required |
| OQ-03 | Should the date field default to today or be manually entered every time? | Yomal | Before dev start |
| OQ-04 | Is there a ticket ID / reference number needed for cross-referencing? | PMO | Before dev start |
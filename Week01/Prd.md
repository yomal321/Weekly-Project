# PRD — BISTEC PMO Ticket Triage Dashboard

**Version:** 1.0  
**Author:** Yomal  
**Date:** 2026-06-09  
**Status:** Draft

---

## 1. Problem Statement

The BISTEC PMO team receives inbound tickets from multiple sources — emails, Slack messages, and spreadsheets. There is no single place to see all tickets together. There is no way to sort or filter by priority. As a result, critical issues are missed or handled too late, and the team wastes time deciding what to work on first instead of actually working.

---

## 2. Goals

1. PMO staff can see all inbound tickets in one place.
2. Tickets are sorted by priority so the most critical issue is always at the top.
3. A PMO member can triage a ticket (mark it as urgent, normal, or low) in under 30 seconds.
4. Zero critical tickets are missed or left unseen.

---

## 3. Users

**Amara — PMO Coordinator**  
Receives 20–50 tickets per day from different sources. Non-technical. Uses a laptop. Needs to quickly decide what the team works on next. Currently spends 30+ minutes every morning sorting through emails and Slack to build a mental picture of what is urgent.

**Dinesh — PMO Lead**  
Reviews the triage decisions made by the team. Needs a quick overview of what is critical right now without asking anyone.

---

## 4. Functional Requirements

- Staff must be able to view all tickets in a single dashboard.
- Each ticket must display: title, description, source, date received, and current priority.
- Staff must be able to assign a priority to a ticket: **Critical**, **High**, **Low**.
- The dashboard must sort tickets by priority — Critical at the top by default.
- Staff must be able to filter tickets by priority level.
- Staff must be able to mark a ticket as **resolved**.
- Resolved tickets must be hidden from the default view but accessible via a filter.

---

## 5. Non-Functional Requirements (NFR)

- **Performance:** The dashboard must load within 2 seconds on a standard office connection.
- **Usability:** A new PMO member must be able to triage a ticket without any training or documentation.
- **Reliability:** The dashboard must be available during BISTEC working hours (9am – 6pm, Mon – Fri).
- **Scalability:** Must support up to 500 tickets without any performance degradation.
- **Browser support:** Must work correctly on Chrome and Edge — the standard BISTEC office browsers.
- **Responsiveness:** Must be usable on a standard laptop screen (1280px width and above).

---

## 6. Out of Scope (v1)

- No integration with external tools (Jira, Slack, email) in v1 — tickets are entered manually.
- No user authentication or role-based access.
- No notifications or alerts.
- No reporting or analytics.
- No mobile native app — web only.

---

## 7. Acceptance Criteria

**AC-01 — View all tickets**  
Given the dashboard is open,  
When a PMO member loads the page,  
Then all unresolved tickets are displayed sorted by priority, Critical first.

**AC-02 — Assign priority**  
Given a ticket exists in the dashboard,  
When a PMO member changes its priority,  
Then the ticket immediately moves to the correct position in the sorted list.

**AC-03 — Filter by priority**  
Given tickets of multiple priorities exist,  
When a PMO member selects a priority filter,  
Then only tickets matching that priority are shown.

**AC-04 — Resolve a ticket**  
Given an open ticket exists,  
When a PMO member marks it as resolved,  
Then it disappears from the default view immediately.

**AC-05 — View resolved tickets**  
Given resolved tickets exist,  
When a PMO member enables the "show resolved" filter,  
Then all resolved tickets appear at the bottom of the list.

---

## 8. Success Metrics

- A PMO member can triage a new ticket in under 30 seconds.
- No critical ticket remains unseen for more than 1 hour during working hours.
- PMO lead can get a full picture of current ticket status in under 1 minute without asking anyone.
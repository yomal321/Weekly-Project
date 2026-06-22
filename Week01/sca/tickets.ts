// src/server/routes/tickets.ts
// All ticket API handlers — imported by Next.js API routes
// Covers ST-05 to ST-09 from speckit.yaml
// ADR-002: Prisma + SQLite

import { db } from "@/lib/db";

// Priority sort order — Critical first, then High, then Low
// FR: dashboard must sort tickets by priority
const PRIORITY_ORDER: Record<string, number> = {
  Critical: 1,
  High: 2,
  Low: 3,
};

// Valid priority values — FR: priority must be Critical | High | Low
const VALID_PRIORITIES = ["Critical", "High", "Low"];

// ─────────────────────────────────────────────
// ST-05: GET all unresolved tickets
// FR: Staff must be able to view all tickets sorted by priority
// AC-01: returns unresolved tickets sorted Critical first
// ─────────────────────────────────────────────
export async function getAllTickets() {
  const tickets = await db.ticket.findMany({
    where: { resolved: false },
  });

  return tickets.sort(
    (a, b) =>
      (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99)
  );
}

// ─────────────────────────────────────────────
// ST-06: POST create a new ticket
// FR: Staff must be able to create a new ticket
// AC: returns 400 if title missing or priority invalid
// ─────────────────────────────────────────────
export async function createTicket(data: {
  title: string;
  description?: string;
  source?: string;
  priority: string;
}) {
  // Validation — title is required
  if (!data.title || data.title.trim() === "") {
    throw new Error("VALIDATION_ERROR: title is required");
  }

  // Validation — priority must be Critical | High | Low
  if (!VALID_PRIORITIES.includes(data.priority)) {
    throw new Error(
      "VALIDATION_ERROR: priority must be Critical, High, or Low"
    );
  }

  return await db.ticket.create({
    data: {
      title: data.title.trim(),
      description: data.description ?? null,
      source: data.source ?? null,
      priority: data.priority,
    },
  });
}

// ─────────────────────────────────────────────
// ST-07: PATCH update ticket priority
// FR: Staff must be able to assign a priority to a ticket
// AC-02: ticket immediately moves to correct position after update
// ─────────────────────────────────────────────
export async function updatePriority(id: number, priority: string) {
  // Validation — priority must be Critical | High | Low
  if (!VALID_PRIORITIES.includes(priority)) {
    throw new Error(
      "VALIDATION_ERROR: priority must be Critical, High, or Low"
    );
  }

  return await db.ticket.update({
    where: { id },
    data: { priority },
  });
}

// ─────────────────────────────────────────────
// ST-08: PATCH resolve a ticket
// FR: Staff must be able to mark a ticket as resolved
// AC-04: ticket disappears from default view immediately
// ─────────────────────────────────────────────
export async function resolveTicket(id: number) {
  return await db.ticket.update({
    where: { id },
    data: { resolved: true },
  });
}

// ─────────────────────────────────────────────
// ST-09: GET all resolved tickets
// FR: Resolved tickets must be accessible via a filter
// AC-05: resolved tickets visible when Show Resolved is enabled
// ─────────────────────────────────────────────
export async function getResolvedTickets() {
  return await db.ticket.findMany({
    where: { resolved: true },
    orderBy: { updatedAt: "desc" },
  });
}
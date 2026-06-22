import { z } from "zod";
import { db } from "@/lib/db";

export const PRIORITY_ORDER: Record<string, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
};

export const VALID_PRIORITIES = ["P0", "P1", "P2"] as const;
export type Priority = (typeof VALID_PRIORITIES)[number];

export const CreateTicketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  source: z.string().optional(),
  priority: z.enum(VALID_PRIORITIES),
});

export const UpdatePrioritySchema = z.object({
  priority: z.enum(VALID_PRIORITIES),
});

export const UpdateTicketSchema = z.object({
  priority: z.enum(VALID_PRIORITIES).optional(),
  resolved: z.boolean().optional(),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

export async function getAllTickets() {
  const tickets = await db.ticket.findMany({
    where: { resolved: false },
  });
  return tickets.sort(
    (a, b) =>
      (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99)
  );
}

export async function createTicket(data: CreateTicketInput) {
  return db.ticket.create({ data });
}

export async function updatePriority(id: number, priority: Priority) {
  return db.ticket.update({ where: { id }, data: { priority } });
}

export async function resolveTicket(id: number) {
  return db.ticket.update({ where: { id }, data: { resolved: true } });
}

export async function getResolvedTickets() {
  return db.ticket.findMany({
    where: { resolved: true },
    orderBy: { updatedAt: "desc" },
  });
}

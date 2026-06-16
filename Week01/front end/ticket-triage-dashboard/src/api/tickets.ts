import { Ticket, Priority, TicketStatus } from "../types/ticket";

const API_BASE = "http://localhost:3001";

export async function getAllTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_BASE}/tickets`);
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

export async function createTicket(
  ticket: Omit<Ticket, "id">
): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });
  if (!res.ok) throw new Error("Failed to create ticket");
  return res.json();
}

export async function updateTicketPriority(
  id: string,
  priority: Priority
): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priority }),
  });
  if (!res.ok) throw new Error("Failed to update priority");
  return res.json();
}

export async function resolveTicket(id: string): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: TicketStatus.Resolved }),
  });
  if (!res.ok) throw new Error("Failed to resolve ticket");
  return res.json();
}

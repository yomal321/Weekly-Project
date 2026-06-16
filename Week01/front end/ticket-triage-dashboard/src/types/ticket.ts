export enum Priority {
  Critical = "Critical",
  High = "High",
  Low = "Low",
}

export enum TicketStatus {
  Open = "Open",
  Resolved = "Resolved",
}

export type TicketSource = "Email" | "Slack" | "Spreadsheet" | "Other";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  source: TicketSource;
  dateReceived: string; // ISO date string
  priority: Priority;
  status: TicketStatus;
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  [Priority.Critical]: 0,
  [Priority.High]: 1,
  [Priority.Low]: 2,
};

import { Ticket, Priority, TicketStatus, PRIORITY_ORDER } from "../types/ticket";
import { TicketCard } from "./TicketCard";

interface TicketListProps {
  tickets: Ticket[];
  showResolved: boolean;
  selectedPriority: Priority | "All";
  onPriorityChange: (id: string, priority: Priority) => void;
  onResolve: (id: string) => void;
}

export function TicketList({
  tickets,
  showResolved,
  selectedPriority,
  onPriorityChange,
  onResolve,
}: TicketListProps) {
  const openTickets = tickets
    .filter((t) => t.status === TicketStatus.Open)
    .filter((t) => selectedPriority === "All" || t.priority === selectedPriority)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const resolvedTickets = tickets.filter(
    (t) => t.status === TicketStatus.Resolved
  );

  if (openTickets.length === 0 && !showResolved) {
    return <p className="empty-state">No open tickets. All clear!</p>;
  }

  return (
    <div className="ticket-list">
      {openTickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onPriorityChange={onPriorityChange}
          onResolve={onResolve}
        />
      ))}

      {showResolved && resolvedTickets.length > 0 && (
        <>
          <div className="resolved-divider">Resolved Tickets</div>
          {resolvedTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onPriorityChange={onPriorityChange}
              onResolve={onResolve}
            />
          ))}
        </>
      )}
    </div>
  );
}

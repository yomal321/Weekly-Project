import { Ticket, Priority, TicketStatus } from "../types/ticket";

interface TicketCardProps {
  ticket: Ticket;
  onPriorityChange: (id: string, priority: Priority) => void;
  onResolve: (id: string) => void;
}

export function TicketCard({ ticket, onPriorityChange, onResolve }: TicketCardProps) {
  const isResolved = ticket.status === TicketStatus.Resolved;

  return (
    <div className={`ticket-card priority-${ticket.priority.toLowerCase()} ${isResolved ? "resolved" : ""}`}>
      <div className="ticket-header">
        <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
          {ticket.priority}
        </span>
        <span className="ticket-source">{ticket.source}</span>
        <span className="ticket-date">{ticket.dateReceived}</span>
      </div>

      <h3 className="ticket-title">{ticket.title}</h3>
      <p className="ticket-description">{ticket.description}</p>

      {!isResolved && (
        <div className="ticket-actions">
          <select
            className="priority-select"
            value={ticket.priority}
            onChange={(e) => onPriorityChange(ticket.id, e.target.value as Priority)}
          >
            {Object.values(Priority).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <button
            className="resolve-btn"
            onClick={() => onResolve(ticket.id)}
          >
            Mark Resolved
          </button>
        </div>
      )}

      {isResolved && (
        <span className="resolved-badge">Resolved</span>
      )}
    </div>
  );
}

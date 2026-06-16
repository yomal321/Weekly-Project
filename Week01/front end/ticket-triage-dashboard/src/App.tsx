import { useState, useEffect } from "react";
import { Ticket, Priority, TicketStatus } from "./types/ticket";
import {
  getAllTickets,
  createTicket,
  updateTicketPriority,
  resolveTicket,
} from "./api/tickets";
import { FilterBar } from "./components/FilterBar";
import { TicketList } from "./components/TicketList";
import { AddTicketForm } from "./components/AddTicketForm";
import "./index.css";

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<Priority | "All">("All");
  const [showResolved, setShowResolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllTickets()
      .then(setTickets)
      .catch(() => setError("Could not connect to the ticket server. Is json-server running?"))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(newTicket: Omit<Ticket, "id">) {
    const created = await createTicket(newTicket);
    setTickets((prev) => [...prev, created]);
  }

  async function handlePriorityChange(id: string, priority: Priority) {
    const updated = await updateTicketPriority(id, priority);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function handleResolve(id: string) {
    const updated = await resolveTicket(id);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  const openCount = tickets.filter((t) => t.status === TicketStatus.Open).length;
  const criticalCount = tickets.filter(
    (t) => t.status === TicketStatus.Open && t.priority === Priority.Critical
  ).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <h1>PMO Ticket Triage</h1>
          <div className="header-stats">
            <span className="stat">{openCount} open</span>
            {criticalCount > 0 && (
              <span className="stat critical">{criticalCount} critical</span>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {loading && <p className="loading">Loading tickets...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <>
            <AddTicketForm onAdd={handleAdd} />

            <FilterBar
              selectedPriority={selectedPriority}
              showResolved={showResolved}
              onPriorityChange={setSelectedPriority}
              onShowResolvedChange={setShowResolved}
            />

            <TicketList
              tickets={tickets}
              showResolved={showResolved}
              selectedPriority={selectedPriority}
              onPriorityChange={handlePriorityChange}
              onResolve={handleResolve}
            />
          </>
        )}
      </main>
    </div>
  );
}

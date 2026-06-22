"use client";

// src/app/tickets/page.tsx
// BISTEC PMO Ticket Triage Dashboard
// Covers ST-10 to ST-13 from speckit.yaml
// ADR-001: Next.js 14 App Router + React

import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// Types — matches Prisma Ticket model exactly
// ─────────────────────────────────────────────
type Priority = "Critical" | "High" | "Low";
type Filter = "All" | Priority;

interface Ticket {
  id: number;
  title: string;
  description: string | null;
  source: string | null;
  priority: Priority;
  resolved: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Priority badge colours
// Critical=red, High=amber, Low=green
// ─────────────────────────────────────────────
const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: "background:#FECACA; color:#7F1D1D; padding:2px 8px; border-radius:12px; font-size:12px; font-weight:500;",
  High: "background:#FDE68A; color:#78350F; padding:2px 8px; border-radius:12px; font-size:12px; font-weight:500;",
  Low: "background:#BBF7D0; color:#14532D; padding:2px 8px; border-radius:12px; font-size:12px; font-weight:500;",
};

// ─────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────
export default function TicketsPage() {
  // ST-10: ticket list state
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resolved, setResolved] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // ST-12: filter state
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  // ST-13: show resolved toggle
  const [showResolved, setShowResolved] = useState(false);

  // ST-11: add ticket form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    source: "",
    priority: "High" as Priority,
  });
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // ─────────────────────────────────────────────
  // ST-10: Fetch all unresolved tickets on load
  // AC-01: displays tickets sorted Critical first
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    setLoading(true);
    const res = await fetch("/api/tickets");
    const data = await res.json();
    setTickets(data);
    setLoading(false);
  }

  async function fetchResolved() {
    const res = await fetch("/api/tickets/resolved");
    const data = await res.json();
    setResolved(data);
  }

  // ─────────────────────────────────────────────
  // ST-13: Show Resolved toggle handler
  // AC-05: resolved tickets appear at the bottom
  // ─────────────────────────────────────────────
  async function handleShowResolved() {
    if (!showResolved) await fetchResolved();
    setShowResolved(!showResolved);
  }

  // ─────────────────────────────────────────────
  // ST-11: Submit new ticket form
  // AC: shows error if title missing, refreshes list on success
  // ─────────────────────────────────────────────
  async function handleSubmit() {
    setFormError("");

    if (!form.title.trim()) {
      setFormError("Title is required");
      return;
    }

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      setFormError(err.message);
      return;
    }

    // Reset form and refresh list
    setForm({ title: "", description: "", source: "", priority: "High" });
    setShowForm(false);
    fetchTickets();
  }

  // ─────────────────────────────────────────────
  // ST-07: Update priority handler
  // AC-02: ticket immediately moves to correct position
  // ─────────────────────────────────────────────
  async function handlePriorityChange(id: number, priority: Priority) {
    await fetch(`/api/tickets/${id}/priority`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    });
    fetchTickets();
  }

  // ─────────────────────────────────────────────
  // ST-13: Resolve ticket handler
  // AC-04: ticket disappears from list immediately
  // ─────────────────────────────────────────────
  async function handleResolve(id: number) {
    await fetch(`/api/tickets/${id}/resolve`, { method: "PATCH" });
    fetchTickets();
  }

  // ─────────────────────────────────────────────
  // ST-12: Filter tickets client-side
  // AC-03: only matching priority tickets shown
  // ─────────────────────────────────────────────
  const filteredTickets =
    activeFilter === "All"
      ? tickets
      : tickets.filter((t) => t.priority === activeFilter);

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>PMO Ticket Triage</h1>
          <p style={{ color: "#6B7280", margin: "4px 0 0", fontSize: 14 }}>
            {tickets.length} open ticket{tickets.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 500 }}
        >
          {showForm ? "Cancel" : "+ Add Ticket"}
        </button>
      </div>

      {/* ST-11: Add Ticket Form */}
      {showForm && (
        <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>New Ticket</h2>
          {formError && (
            <p style={{ color: "#DC2626", fontSize: 13, marginBottom: 8 }}>{formError}</p>
          )}
          <input
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #D1D5DB", marginBottom: 8, fontSize: 14, boxSizing: "border-box" }}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #D1D5DB", marginBottom: 8, fontSize: 14, resize: "vertical", boxSizing: "border-box" }}
          />
          <input
            placeholder="Source (e.g. Slack, Email)"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #D1D5DB", marginBottom: 8, fontSize: 14, boxSizing: "border-box" }}
          />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #D1D5DB", marginBottom: 12, fontSize: 14 }}
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
          <button
            onClick={handleSubmit}
            style={{ background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 500 }}
          >
            Submit Ticket
          </button>
        </div>
      )}

      {/* ST-12: Priority Filter Buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
        {(["All", "Critical", "High", "Low"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: activeFilter === f ? "#0F766E" : "#D1D5DB",
              background: activeFilter === f ? "#CCFBF1" : "transparent",
              color: activeFilter === f ? "#0F766E" : "#6B7280",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeFilter === f ? 500 : 400,
            }}
          >
            {f}
          </button>
        ))}
        {/* ST-13: Show Resolved Toggle */}
        <button
          onClick={handleShowResolved}
          style={{
            padding: "5px 14px",
            borderRadius: 20,
            border: "1px solid",
            borderColor: showResolved ? "#7C3AED" : "#D1D5DB",
            background: showResolved ? "#EDE9FE" : "transparent",
            color: showResolved ? "#7C3AED" : "#6B7280",
            cursor: "pointer",
            fontSize: 13,
            marginLeft: "auto",
          }}
        >
          {showResolved ? "Hide Resolved" : "Show Resolved"}
        </button>
      </div>

      {/* ST-10: Ticket List */}
      {loading ? (
        <p style={{ color: "#9CA3AF", textAlign: "center", padding: "2rem" }}>Loading tickets...</p>
      ) : filteredTickets.length === 0 ? (
        <p style={{ color: "#9CA3AF", textAlign: "center", padding: "2rem" }}>No tickets found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onPriorityChange={handlePriorityChange}
              onResolve={handleResolve}
              priorityStyles={PRIORITY_STYLES}
            />
          ))}
        </div>
      )}

      {/* ST-13: Resolved Tickets Section */}
      {showResolved && resolved.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <p style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500, marginBottom: 8 }}>RESOLVED</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {resolved.map((ticket) => (
              <div
                key={ticket.id}
                style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 16px", opacity: 0.6 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 14, textDecoration: "line-through", color: "#6B7280" }}>
                    {ticket.title}
                  </p>
                  <span style={{ ...Object.fromEntries(PRIORITY_STYLES[ticket.priority].split(";").filter(Boolean).map(s => s.split(":").map(x => x.trim()) as [string, string])) }}>
                    {ticket.priority}
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9CA3AF" }}>
                  {ticket.source && `${ticket.source} · `}
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

// ─────────────────────────────────────────────
// Ticket Card Component
// ST-10: displays title, description, source, date, priority badge
// ST-07: priority dropdown to update priority
// ST-13: resolve button
// ─────────────────────────────────────────────
function TicketCard({
  ticket,
  onPriorityChange,
  onResolve,
  priorityStyles,
}: {
  ticket: Ticket;
  onPriorityChange: (id: number, priority: Priority) => void;
  onResolve: (id: number) => void;
  priorityStyles: Record<Priority, string>;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 16px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{ticket.title}</p>
          {ticket.description && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>{ticket.description}</p>
          )}
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#9CA3AF" }}>
            {ticket.source && `${ticket.source} · `}
            {new Date(ticket.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Priority badge + change dropdown */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          <select
            value={ticket.priority}
            onChange={(e) => onPriorityChange(ticket.id, e.target.value as Priority)}
            style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 500, color: ticket.priority === "Critical" ? "#7F1D1D" : ticket.priority === "High" ? "#78350F" : "#14532D" }}
          >
            <option value="Critical">🔴 Critical</option>
            <option value="High">🟡 High</option>
            <option value="Low">🟢 Low</option>
          </select>
          <button
            onClick={() => onResolve(ticket.id)}
            style={{ background: "transparent", border: "1px solid #D1D5DB", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 12, color: "#6B7280" }}
          >
            Resolve
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useCallback } from "react";

type Priority = "P0" | "P1" | "P2";
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

const BADGE_CLASS: Record<Priority, string> = {
  P0: "bg-red-50 text-red-700 ring-1 ring-red-200",
  P1: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  P2: "bg-green-50 text-green-700 ring-1 ring-green-200",
};

const BORDER_CLASS: Record<Priority, string> = {
  P0: "border-l-red-400",
  P1: "border-l-amber-400",
  P2: "border-l-green-400",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  P0: "P0 — Critical",
  P1: "P1 — High",
  P2: "P2 — Low",
};

const FILTERS: Filter[] = ["All", "P0", "P1", "P2"];

const EMPTY_FORM = { title: "", description: "", source: "", priority: "P1" as Priority };

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resolved, setResolved] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("All");
  const [showResolved, setShowResolved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/tickets");
    const data = (await res.json()) as Ticket[];
    setTickets(data);
    setLoading(false);
  }, []);

  const fetchResolved = useCallback(async () => {
    const res = await fetch("/api/tickets/resolved");
    setResolved((await res.json()) as Ticket[]);
  }, []);

  useEffect(() => { void fetchTickets(); }, [fetchTickets]);

  async function handleSubmit() {
    setFormError("");
    if (!form.title.trim()) { setFormError("Title is required"); return; }
    setSubmitting(true);
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const err = (await res.json()) as { message: string };
      setFormError(err.message);
      setSubmitting(false);
      return;
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSubmitting(false);
    await fetchTickets();
  }

  async function handlePriorityChange(id: number, priority: Priority) {
    await fetch(`/api/tickets/${id}/priority`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    });
    await fetchTickets();
  }

  async function handleResolve(id: number) {
    await fetch(`/api/tickets/${id}/resolve`, { method: "PATCH" });
    await fetchTickets();
    if (showResolved) await fetchResolved();
  }

  async function toggleResolved() {
    if (!showResolved) await fetchResolved();
    setShowResolved((v) => !v);
  }

  const displayed = filter === "All" ? tickets : tickets.filter((t) => t.priority === filter);
  const p0Count = tickets.filter((t) => t.priority === "P0").length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">PT</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-900 leading-none">PMO Ticket Triage</h1>
              <p className="text-xs text-slate-500 mt-0.5">BISTEC internal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {p0Count > 0 && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-700 ring-1 ring-red-200">
                {p0Count} P0
              </span>
            )}
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
              {tickets.length} open
            </span>
            <button
              onClick={() => { setShowForm((v) => !v); setFormError(""); }}
              className="ml-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-700 transition-colors"
            >
              {showForm ? "Cancel" : "+ New ticket"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6">

        {/* Add ticket form */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">New ticket</h2>
            {formError && (
              <p className="text-xs text-red-600 mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && void handleSubmit()}
                className="col-span-2 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="col-span-2 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400 resize-none"
              />
              <input
                type="text"
                placeholder="Source (Slack, Email…)"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400"
              />
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-slate-700"
              >
                <option value="P0">P0 — Critical</option>
                <option value="P1">P1 — High</option>
                <option value="P2">P2 — Low</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Adding…" : "Add ticket"}
              </button>
              <button
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError(""); }}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filter === f
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => void toggleResolved()}
            className={`ml-auto px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showResolved
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            {showResolved ? "Hide resolved" : "Show resolved"}
          </button>
        </div>

        {/* Ticket list */}
        {loading ? (
          <div className="py-20 text-center text-sm text-slate-400">Loading…</div>
        ) : displayed.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-slate-400">No tickets</p>
            {filter !== "All" && (
              <button onClick={() => setFilter("All")} className="mt-2 text-xs text-slate-500 underline">
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {displayed.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onPriorityChange={(id, p) => void handlePriorityChange(id, p)}
                onResolve={(id) => void handleResolve(id)}
              />
            ))}
          </div>
        )}

        {/* Resolved section */}
        {showResolved && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Resolved ({resolved.length})
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            {resolved.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-4">No resolved tickets</p>
            ) : (
              <div className="flex flex-col gap-2">
                {resolved.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white border border-slate-100 rounded-xl px-4 py-3 opacity-50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-400 line-through">{ticket.title}</p>
                      <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-md ${BADGE_CLASS[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    {ticket.source && (
                      <p className="text-xs text-slate-400 mt-1">
                        {ticket.source} · {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function TicketCard({
  ticket,
  onPriorityChange,
  onResolve,
}: {
  ticket: Ticket;
  onPriorityChange: (id: number, priority: Priority) => void;
  onResolve: (id: number) => void;
}) {
  return (
    <div className={`group bg-white border border-slate-200 border-l-4 ${BORDER_CLASS[ticket.priority]} rounded-xl px-4 py-3.5 hover:shadow-sm transition-shadow`}>
      <div className="flex items-start gap-4">

        {/* Left: content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${BADGE_CLASS[ticket.priority]}`}>
              {ticket.priority}
            </span>
            {ticket.source && (
              <span className="text-xs text-slate-400">{ticket.source}</span>
            )}
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">
              {new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-800 leading-snug">{ticket.title}</p>
          {ticket.description && (
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{ticket.description}</p>
          )}
        </div>

        {/* Right: controls */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <select
            value={ticket.priority}
            onChange={(e) => onPriorityChange(ticket.id, e.target.value as Priority)}
            className={`text-xs font-medium px-2 py-0.5 rounded-md border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300 ${BADGE_CLASS[ticket.priority]}`}
          >
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
          </select>
          <button
            onClick={() => onResolve(ticket.id)}
            className="text-xs text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1 transition-colors"
          >
            Resolve
          </button>
        </div>

      </div>
    </div>
  );
}

import { Priority, TicketStatus } from "../types/ticket";

interface FilterBarProps {
  selectedPriority: Priority | "All";
  showResolved: boolean;
  onPriorityChange: (priority: Priority | "All") => void;
  onShowResolvedChange: (show: boolean) => void;
}

export function FilterBar({
  selectedPriority,
  showResolved,
  onPriorityChange,
  onShowResolvedChange,
}: FilterBarProps) {
  const priorities: Array<Priority | "All"> = [
    "All",
    Priority.Critical,
    Priority.High,
    Priority.Low,
  ];

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">Priority:</span>
        {priorities.map((p) => (
          <button
            key={p}
            className={`filter-btn ${selectedPriority === p ? "active" : ""} ${p !== "All" ? p.toLowerCase() : ""}`}
            onClick={() => onPriorityChange(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <label className="resolved-toggle">
        <input
          type="checkbox"
          checked={showResolved}
          onChange={(e) => onShowResolvedChange(e.target.checked)}
        />
        Show Resolved
      </label>
    </div>
  );
}

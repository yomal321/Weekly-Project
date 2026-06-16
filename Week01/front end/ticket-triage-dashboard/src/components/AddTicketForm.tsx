import { useState } from "react";
import { Priority, TicketStatus, TicketSource, Ticket } from "../types/ticket";

interface AddTicketFormProps {
  onAdd: (ticket: Omit<Ticket, "id">) => void;
}

export function AddTicketForm({ onAdd }: AddTicketFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<TicketSource>("Email");
  const [priority, setPriority] = useState<Priority>(Priority.Low);
  const [dateReceived, setDateReceived] = useState(
    new Date().toISOString().split("T")[0]
  );

  function handleSubmit() {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      source,
      priority,
      dateReceived,
      status: TicketStatus.Open,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setSource("Email");
    setPriority(Priority.Low);
    setDateReceived(new Date().toISOString().split("T")[0]);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button className="add-ticket-btn" onClick={() => setIsOpen(true)}>
        + Add Ticket
      </button>
    );
  }

  return (
    <div className="add-ticket-form">
      <h2>New Ticket</h2>

      <label>
        Title *
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of the issue"
        />
      </label>

      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="More detail about the issue"
          rows={3}
        />
      </label>

      <div className="form-row">
        <label>
          Source
          <select value={source} onChange={(e) => setSource(e.target.value as TicketSource)}>
            <option value="Email">Email</option>
            <option value="Slack">Slack</option>
            <option value="Spreadsheet">Spreadsheet</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            {Object.values(Priority).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label>
          Date Received
          <input
            type="date"
            value={dateReceived}
            onChange={(e) => setDateReceived(e.target.value)}
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="submit-btn" onClick={handleSubmit} disabled={!title.trim()}>
          Add Ticket
        </button>
        <button className="cancel-btn" onClick={() => setIsOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}

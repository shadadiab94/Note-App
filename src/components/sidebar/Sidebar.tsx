import { Link, useParams } from "react-router-dom";
import type { Note } from "../../types";
import "./Sidebar.css";

interface SidebarProps {
  notes: Note[];
  onAddNote: () => void;
}

const priorityOrder: Record<string, number> = { high: 1, medium: 2, low: 3 };

export default function Sidebar({ notes, onAddNote }: SidebarProps) {
 
  const { id: activeId } = useParams();

  const sortedNotes = [...notes].sort((a, b) => {
    const pa = priorityOrder[a.priority] ?? 4;
    const pb = priorityOrder[b.priority] ?? 4;
    return pa - pb;
  });

  return (
    <div className="sidebar">
      <button className="add-note-btn" onClick={onAddNote}>
        New Note
      </button>

      <ul className="note-list">
        {sortedNotes.length === 0 && <li>No notes yet</li>}
        {sortedNotes.map((note) => (
          <li key={note.id}>
            <Link
              to={`/note/${note.id}`}
              className={note.id === activeId ? "active" : undefined}
            >
              {note.title || "Untitled"} — <em>{note.priority}</em>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

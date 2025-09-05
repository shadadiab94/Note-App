import { Link, useParams } from "react-router-dom";
import type { Note } from "../../types";
import "./Sidebar.css";

interface SidebarProps {
  notes: Note[];
  onAddNote: () => void;
  currentUser: string | null;
  onOpenModal: () => void;
}

export default function Sidebar({ notes, onAddNote, currentUser, onOpenModal }: SidebarProps) {

  const { id: activeId } = useParams();

  const groupByPriority = (priority: string) =>
    notes.filter((note) => note.priority === priority);

  const renderNoteList = (priority: string, title: string) => {
    const groupedNotes = groupByPriority(priority);

    if (groupedNotes.length === 0) return null;

    return (
      <div className="priority-section">
        <h3>{title}</h3>
        <ul className="note-list">
          {groupedNotes.map((note) => (
            <li key={note.id}>
              <Link
                to={`/note/${note.id}`}
                className={note.id === activeId ? "active" : undefined}
              >
                {note.title || "Untitled"}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    
    <div className="sidebar">
   

    {/* user selector */}
    <div className="user-info">
      <button onClick={onOpenModal}>
        {currentUser ? ` ${currentUser}` : 'Select User'}
      </button>
    </div>
  

    <button className="add-note-btn" onClick={onAddNote}>
      + Add Note
    </button>

    {renderNoteList("high", "High Priority")}
    {renderNoteList("medium", "Medium Priority")}
    {renderNoteList("low", "Low Priority")}
  </div>
  );
}

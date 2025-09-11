import { useParams } from "react-router-dom";
import { useState } from "react";
import type { Note, Priority } from "../../types";
import "./NoteEditor.css"

interface NoteEditorProps {
  notes: Note[];
  onSave: (id: string, updated: Pick<Note, "title" | "content" | "priority">) => void;
}

export default function NoteEditor({ notes, onSave }: NoteEditorProps) {
  const { id } = useParams();
  const note = notes.find((n) => n.id === id) ?? null;

  if (!note) return <div>Note not found</div>;


  const [title, setTitle] = useState<string>(note.title ?? "");
  const [content, setContent] = useState<string>(note.content ?? "");
  const [priority, setPriority] = useState<Priority>(note.priority ?? "low");
  const [saved, setSaved] = useState<boolean>(false);

  

  const handleSaveClick = () => {
    onSave(id!, { title, content, priority });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="note-editor">
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Write your note here..."
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <label>
        Priority:
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <button onClick={handleSaveClick}>Save</button>
      {saved && <p className="saved-indicator">Saved!</p>}
    </div>
  );
}

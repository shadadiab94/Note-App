import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import NoteEditor from "./components/NoteEditor/NoteEditor";
import type { Note } from "./types";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      priority: "low",
    };
    setNotes((prev) => [newNote, ...prev]); 
    navigate(`/note/${newNote.id}`);
  };


  const handleSaveNote = (
    id: string,
    updated: Pick<Note, "title" | "content" | "priority">
  ) => {
    setNotes((prev) => {
      const i = prev.findIndex((n) => n.id === id);
      if (i === -1) return [...prev, { ...updated, id }];
      const next = [...prev];
      next[i] = { ...next[i], ...updated, id };
      return next;
    });
  };

  return (
    <div className="app-container">
      <Sidebar notes={notes} onAddNote={handleAddNote} />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<div>No notes yet. Click "New Note".</div>} />
          <Route
            path="/note/:id"
            element={<NoteEditorWithKey notes={notes} onSave={handleSaveNote} />}
          />
        </Routes>
      </div>
    </div>
  );
}


function NoteEditorWithKey(props: {
  notes: Note[];
  onSave: (id: string, updated: Pick<Note, "title" | "content" | "priority">) => void;
}) {
  const { id } = useParams();
  return <NoteEditor key={id} {...props} />;
}

export default App;

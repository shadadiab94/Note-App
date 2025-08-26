import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

import Sidebar from "./components/sidebar/Sidebar";
import NoteEditor from "./components/NoteEditor/NoteEditor";
import type { Note } from "./types";
import "./App.css";

function App() {
  const navigate = useNavigate();


  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "notes"));
        const fetchedNotes: Note[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedNotes.push({
            id: data.id,
            title: data.title,
            content: data.content,
            priority: data.priority || "low",
          });
        });

        setNotes(fetchedNotes);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error loading notes:", error);
      }
    };

    fetchNotes();
  }, []);


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


  const handleSaveNote = async (
    id: string,
    updatedNote: Pick<Note, "title" | "content" | "priority">
  ) => {
    try {
      await setDoc(doc(db, "notes", id), {
        ...updatedNote,
        id,
        createdAt: new Date().toISOString(),
      });

  
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...updatedNote } : note
        )
      );

      console.log("✅ Saved to Firestore:", updatedNote);
    } catch (error) {
      console.error("❌ Error saving note:", error);
    }
  };

  return (
    <div className="app-container">
      {loading ? (
        <p>Loading notes from Firestore...</p>
      ) : (
        <>
          <Sidebar notes={notes} onAddNote={handleAddNote} />
          <div className="main-content">
            <Routes>
              <Route
                path="/"
                element={<div>No notes yet. Click "New Note".</div>}
              />
              <Route
                path="/note/:id"
                element={
                  <NoteEditorWithKey notes={notes} onSave={handleSaveNote} />
                }
              />
            </Routes>
          </div>
        </>
      )}
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

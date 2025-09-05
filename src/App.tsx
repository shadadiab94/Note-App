import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { useUser } from './context/UserContext';
import Sidebar from "./components/sidebar/Sidebar";
import NoteEditor from "./components/NoteEditor/NoteEditor";
import type { Note } from "./types";
import UserModal from './components/UserModal/UserModal';

import "./App.css";



function App() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [users, setUsers] = useState<string[]>(['user1', 'user2']); // could come from Firestore later

  const navigate = useNavigate();
  const [currentUser] = useState<string | null>(null);


  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUser) return;
  
    const fetchNotes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users", currentUser, "notes"));
        const fetchedNotes: Note[] = [];
  
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedNotes.push({
            id: docSnap.id,
            title: data.title,
            content: data.content,
            priority: data.priority || "low",
          });
        });
  
        setNotes(fetchedNotes);
        setLoading(false);
      } catch (error) {
        console.error("Error loading:", error);
      }
    };
  
    fetchNotes();
  }, [currentUser]); 

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
      await setDoc(doc(db, 'users', currentUser!, 'notes', id), {

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
  
      
  
       
  {(!currentUser || isModalOpen) && (
  <UserModal
    users={users}
    onAddUser={(id) => setUsers((prev) => [...prev, id])}
    onClose={() => setIsModalOpen(false)}
  />
)}

     
      {loading ? (
        <p>Loading notes from Firestore...</p>
      ) : (
        <>
          <Sidebar
  notes={notes}
  onAddNote={handleAddNote}
  currentUser={currentUser}
  onOpenModal={() => setIsModalOpen(true)}
/>
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
  

function NoteEditorWithKey(props: {
  notes: Note[];
  onSave: (id: string, updated: Pick<Note, "title" | "content" | "priority">) => void;
}) {
  const { id } = useParams();
  return <NoteEditor key={id} {...props} />;
}
}
export default App;

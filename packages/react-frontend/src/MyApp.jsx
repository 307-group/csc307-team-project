// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import HomeScreen from "./components/HomeScreen";
import NotesScreen from "./components/NotesScreen";
import ToDoScreen from "./components/ToDoScreen";
import NavBar from "./components/NavBar";

const API = "http://localhost:8000";


function MyApp() {
  const [notes, setNotes] = useState([]);
  const [screen, setScreen] = useState("home");
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Fetch all notes on load
  useEffect(() => {
    fetch(`${API}/notes`)
      .then((res) => res.json())
      .then((json) => setNotes(json["notes_list"]))
      .catch((err) => console.log(err));
  }, []);

  // Add a note
  function addNote(note) {
    fetch(`${API}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    })
      .then((res) => (res.status === 201 ? res.json() : undefined))
      .then((json) => {
        if (json) setNotes([...notes, json]);
      })
      .catch((err) => console.log(err));
  }

  // Delete a note
  function deleteNote(id) {
    fetch(`${API}/notes/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.status === 200) {
          setNotes(notes.filter((n) => n.id !== id));
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <NavBar activeScreen={screen} onNavigate={setScreen} />

      <div style={{ flex: 1 }}>
        {screen === "home" && (
          <HomeScreen
            notes={notes}
            labels={[]}
            todos={[]}
            onOpenNote={(id) => { setSelectedNoteId(id); setScreen("notes"); }}
            onGoToNotes={() => setScreen("notes")}
            onGoToTodos={() => setScreen("todos")}
            onToggleTodo={() => {}}
          />
        )}
        {screen === "notes" && (
          <NotesScreen
            notes={notes}
            onAdd={addNote}
            onDelete={deleteNote}
            initialNoteId={selectedNoteId}
          />
        )}
      </div>
    </div>
  );
}

export default MyApp;
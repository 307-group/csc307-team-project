// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import HomeScreen from "./components/HomeScreen";
import NotesScreen from "./components/NotesScreen";
import ToDoScreen from "./components/ToDoScreen";
import NavBar from "./components/NavBar";

const API = "http://localhost:8000";

const INVALID_TOKEN = "INVALID_TOKEN";


function MyApp() {
  const [notes, setNotes] = useState([]);
  const [screen, setScreen] = useState("home");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState("");
  
  function addAuthHeader(otherHeaders = {}) {
    if (token === INVALID_TOKEN) {
      return otherHeaders;
    } else {
      return {
        ...otherHeaders,
        Authorization: `Bearer ${token}`
      };
    }
  }
  // Fetch all notes on load
 
  function signupUser() {
    fetch(`${API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "testuser", pwd: "1234" }),
    })
      .then((res) => {
        if (res.status === 201) return res.json();
        throw new Error(`Signup failed: ${res.status}`);
      })
      .then((data) => {
        setToken(data.token);
        setMessage("Signup successful. Token saved.");
      })
      .catch((err) => setMessage(err.message));
  }
  function loginUser() {
    fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "testuser", pwd: "1234" }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Login Error ${response.status}`);
        }
      })
      .then((payload) => {
        setToken(payload.token);
        setMessage("Login successful; auth token saved");
      })
      .catch((error) => {
        setMessage(`Login Error: ${error.message}`);
      });
  }
  function fetchNotes() {
    fetch(`${API}/notes`, {
      headers: addAuthHeader(),
    })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setNotes(json["notes_list"]);
          setMessage("Notes loaded.");
        } else {
          setNotes([]);
          setMessage("Data unavailable. Please login or signup.");
        }
      })
      .catch((err) => setMessage(err.message));
  }

  useEffect(() => {
    fetchNotes();
  }, [token]);
  
  // Add a note
  function addNote(note) {
    fetch(`${API}/notes`, {
      method: "POST",
      headers: addAuthHeader({ "Content-Type": "application/json" }),
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
    fetch(`${API}/notes/${id}`, {
      method: "DELETE",
      headers: addAuthHeader()
    })
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
        <div style={{ padding: "10px" }}>
          <button onClick={signupUser}>Sign Up Test User</button>
          <button onClick={loginUser}>Log In Test User</button>
          <button onClick={fetchNotes}>Load Notes</button>
          <p>{message}</p>
        </div>

        {screen === "home" && (
          <HomeScreen
            notes={notes}
            labels={[]}
            todos={[]}
            onOpenNote={(id) => {
              setSelectedNoteId(id);
              setScreen("notes");
            }}
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
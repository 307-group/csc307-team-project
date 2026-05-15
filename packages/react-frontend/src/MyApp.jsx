// src/MyApp.jsx
import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import NotesScreen from './components/NotesScreen';
import ToDoScreen from './components/ToDoScreen';
import NavBar from './components/NavBar';
import Login from './Login';

const API = 'http://localhost:8000';

const INVALID_TOKEN = 'INVALID_TOKEN';

function MyApp() {
  const [notes, setNotes] = useState([]);
  const [screen, setScreen] = useState('home');
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState('');

  // Fetch all notes on load
  useEffect(() => {
    fetch(`${API}/notes`, {
      headers: addAuthHeader(),
    })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setNotes(json['notes_list']);
        } else {
          setNotes([]);
          setMessage('Data unavailable. Please log in.');
        }
      })
      .catch((err) => console.log(err));
  }, [token]);

  function addAuthHeader(otherHeaders = {}) {
    if (token === INVALID_TOKEN) {
      return otherHeaders;
    } else {
      return {
        ...otherHeaders,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  function loginUser(creds) {
    const promise = fetch(`${API}/login`, {
      method: 'POST',
      headers: addAuthHeader({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(creds),
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((payload) => setToken(payload.token));
          setMessage(`Login successful; auth token saved`);
        } else {
          setMessage(`Login Error ${response.status}: ${response.data}`);
        }
      })
      .catch((error) => {
        setMessage(`Login Error: ${error}`);
      });

    return promise;
  }
  function signupUser(creds) {
    const promise = fetch(`${API}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds),
    })
      .then((response) => {
        if (response.status === 201) {
          response.json().then((payload) => setToken(payload.token));
          setMessage(
            `Signup successful for user: ${creds.username}; auth token saved`
          );
        } else {
          setMessage(`Signup Error ${response.status}: ${response.data}`);
        }
      })
      .catch((error) => {
        setMessage(`Signup Error: ${error}`);
      });

    return promise;
  }

  // Add a note
  function addNote(note) {
    fetch(`${API}/notes`, {
      method: 'POST',
      headers: addAuthHeader({
        'Content-Type': 'application/json',
      }),
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
      method: 'DELETE',
      headers: addAuthHeader(),
    })
      .then((res) => {
        if (res.status === 200) {
          setNotes(notes.filter((n) => n.id !== id));
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavBar activeScreen={screen} onNavigate={setScreen} />

      <div style={{ flex: 1 }}>
        <div style={{ padding: '10px' }}>
          <Login handleSubmit={signupUser} buttonLabel="Sign Up" />
          <Login handleSubmit={loginUser} />
          <p>{message}</p>
        </div>
        {screen === 'home' && (
          <HomeScreen
            notes={notes}
            labels={[]}
            todos={[]}
            onOpenNote={(id) => {
              setSelectedNoteId(id);
              setScreen('notes');
            }}
            onGoToNotes={() => setScreen('notes')}
            onGoToTodos={() => setScreen('todos')}
            onToggleTodo={() => {}}
          />
        )}
        {screen === 'notes' && (
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

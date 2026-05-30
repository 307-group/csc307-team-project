// src/MyApp.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import NotesScreen from './components/NotesScreen';
import ToDoScreen from './components/ToDoScreen';
import NavBar from './components/NavBar';
import { SignInScreen } from './components/SignInScreen';
import { AccountScreen } from './components/AccountScreen';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const INVALID_TOKEN = 'INVALID_TOKEN';
const DARK_KEY = 'notes-app-dark';

function MyApp() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [labels, setLabels] = useState([]);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || INVALID_TOKEN;
    } catch {
      return INVALID_TOKEN;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem(DARK_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(DARK_KEY, darkMode);
    } catch {
      // ignore: localstorage unavailable
    }
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const isLoggedIn = token !== INVALID_TOKEN;

  const addAuthHeader = useCallback(
    (otherHeaders = {}) => {
      if (token === INVALID_TOKEN) return otherHeaders;
      return { ...otherHeaders, Authorization: `Bearer ${token}` };
    },
    [token]
  );

  function handleAuth(newToken, user) {
    setToken(newToken);
    setCurrentUser(user);

    try {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));
    } catch {
      // ignore localStorage errors
    }

    navigate('/');
  }

  function handleLogout() {
    setToken(INVALID_TOKEN);
    setCurrentUser(null);
    setNotes([]);
    setTodos([]);
    setLabels([]);

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {
      // ignore localStorage errors
    }

    navigate('/account');
  }

  useEffect(() => {
    if (token === INVALID_TOKEN) return;
    fetch(`${API}/notes`, { headers: addAuthHeader() })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) setNotes(json['notes_list']);
        else {
          setNotes([]);
          //setMessage('Could not load notes.');
        }
      })
      .catch((err) => console.log(err));
  }, [token, addAuthHeader]);

  useEffect(() => {
    if (token === INVALID_TOKEN) return;
    fetch(`${API}/todos`, { headers: addAuthHeader() })
      .then((res) => res.json())
      .then((json) => setTodos(json['todos_list']))
      .catch((err) => console.log(err));
  }, [token, addAuthHeader]);

  useEffect(() => {
    if (token === INVALID_TOKEN) return;
    fetch(`${API}/labels`, { headers: addAuthHeader() })
      .then((res) => res.json())
      .then((json) => setLabels(json['labels_list'] || json || []))
      .catch((err) => console.log('Error fetching labels:', err));
  }, [token, addAuthHeader]);

  function addNote({ formData }) {
    fetch(`${API}/notes`, {
      method: 'POST',
      headers: addAuthHeader(),
      body: formData,
    })
      .then((res) => (res.status === 201 ? res.json() : undefined))
      .then((json) => {
        if (json) setNotes((prev) => [...prev, json]);
      })
      .catch((err) => console.log(err));
  }

  function deleteNote(id) {
    fetch(`${API}/notes/${id}`, { method: 'DELETE', headers: addAuthHeader() })
      .then((res) => {
        if (res.status === 200)
          setNotes(notes.filter((n) => String(n._id || n.id) !== String(id)));
      })
      .catch((err) => console.log(err));
  }

  function createTodo(title, description) {
    fetch(`${API}/todos`, {
      method: 'POST',
      headers: addAuthHeader({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ title, description }),
    })
      .then((res) => (res.status === 201 ? res.json() : undefined))
      .then((json) => {
        if (json) setTodos([...todos, json]);
      })
      .catch((err) => console.log(err));
  }

  function toggleTodo(id) {
    fetch(`${API}/todos/${id}`, { method: 'PATCH', headers: addAuthHeader() })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((updated) => {
        if (updated)
          setTodos(
            todos.map((t) =>
              String(t._id || t.id) === String(id) ? updated : t
            )
          );
      })
      .catch((err) => console.log(err));
  }

  function deleteTodo(id) {
    fetch(`${API}/todos/${id}`, { method: 'DELETE', headers: addAuthHeader() })
      .then((res) => {
        if (res.status === 200)
          setTodos(todos.filter((t) => String(t._id || t.id) !== String(id)));
      })
      .catch((err) => console.log(err));
  }

  function createLabel(label) {
    fetch(`${API}/labels`, {
      method: 'POST',
      headers: addAuthHeader({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(label),
    })
      .then((res) => (res.status === 201 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setLabels([...labels, json]);
        }
      })
      .catch((err) => console.log(err));
  }
  function deleteLabel(id) {
    fetch(`${API}/labels/${id}`, { method: 'DELETE', headers: addAuthHeader() })
      .then((res) => {
        if (res.status === 200) {
          setLabels(
            labels.filter(
              (label) => String(label._id || label.id) !== String(id)
            )
          );
        }
      })
      .catch((err) => console.log(err));
  }

  async function downloadNotePdf(note) {
    try {
      const noteId = note._id || note.id;

      const response = await fetch(`${API}/notes/${noteId}/pdf`, {
        method: 'GET',
        headers: addAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const safeTitle =
        note.title
          ?.replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-') || 'note';

      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeTitle}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Could not download PDF.');
    }
  }
  return (
    <div className="flex min-h-screen">
      <NavBar
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((v) => !v)}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen
                notes={notes}
                todos={todos}
                labels={labels}
                onToggleTodo={toggleTodo}
              />
            }
          />
          <Route
            path="/notes"
            element={
              <NotesScreen
                notes={notes}
                labels={labels}
                onAdd={addNote}
                onDelete={deleteNote}
                onCreateLabel={createLabel}
                onDeleteLabel={deleteLabel}
                onDownloadPdf={downloadNotePdf}
              />
            }
          />
          <Route
            path="/todos"
            element={
              <ToDoScreen
                todos={todos}
                onCreateTodo={createTodo}
                onToggleTodo={toggleTodo}
                onDeleteTodo={deleteTodo}
              />
            }
          />
          <Route
            path="/account"
            element={
              isLoggedIn ? (
                <AccountScreen user={currentUser} onLogout={handleLogout} />
              ) : (
                <SignInScreen onAuth={handleAuth} />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default MyApp;

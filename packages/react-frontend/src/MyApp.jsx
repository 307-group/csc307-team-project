// src/MyApp.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import NotesScreen from './components/NotesScreen';
import ToDoScreen from './components/ToDoScreen';
import NavBar from './components/NavBar';
import { SignInScreen } from './components/SignInScreen';
import { AccountScreen } from './components/AccountScreen';

const API = 'http://localhost:8000';
const INVALID_TOKEN = 'INVALID_TOKEN';

function MyApp() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [labels, setLabels] = useState([]);
  const [token, setToken] = useState(INVALID_TOKEN);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');

  const isLoggedIn = token !== INVALID_TOKEN;

  const addAuthHeader = useCallback(
    (otherHeaders = {}) => {
      if (token === INVALID_TOKEN) return otherHeaders;
      return { ...otherHeaders, Authorization: `Bearer ${token}` };
    },
    [token]
  );

  // Handle successful auth (login or signup)
  function handleAuth(newToken, user) {
    setToken(newToken);
    setCurrentUser(user);
    setMessage('');
    navigate('/');
  }

  function handleLogout() {
    setToken(INVALID_TOKEN);
    setCurrentUser(null);
    setNotes([]);
    setTodos([]);
    setMessage('');
    navigate('/');
  }

  // Fetch notes when logged in
  useEffect(() => {
    if (token === INVALID_TOKEN) return;
    fetch(`${API}/notes`, { headers: addAuthHeader() })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) setNotes(json['notes_list']);
        else {
          setNotes([]);
          setMessage('Could not load notes.');
        }
      })
      .catch((err) => console.log(err));
  }, [token, addAuthHeader]);

  // Fetch todos when logged in
  useEffect(() => {
    if (token === INVALID_TOKEN) return;
    fetch(`${API}/todos`, { headers: addAuthHeader() })
      .then((res) => res.json())
      .then((json) => setTodos(json['todos_list']))
      .catch((err) => console.log(err));
  }, [token, addAuthHeader]);

  // Fetch labels
  useEffect(() => {
    if (token === INVALID_TOKEN) return;
    fetch(`${API}/labels`, { headers: addAuthHeader() })
      .then((res) => res.json())
      .then((json) => setLabels(json['labels_list'] || json || []))
      .catch((err) => console.log('Error fetching labels:', err));
  }, [token, addAuthHeader]);

  function addNote(note) {
    fetch(`${API}/notes`, {
      method: 'POST',
      headers: addAuthHeader({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(note),
    })
      .then((res) => (res.status === 201 ? res.json() : undefined))
      .then((json) => {
        if (json) setNotes([...notes, json]);
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavBar isLoggedIn={isLoggedIn} currentUser={currentUser} />

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
                onAdd={addNote}
                onDelete={deleteNote}
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

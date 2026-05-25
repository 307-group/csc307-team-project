// src/MyApp.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import NotesScreen from './components/NotesScreen';
import ToDoScreen from './components/ToDoScreen';
import NavBar from './components/NavBar';
import Login from './Login';

const API = 'https://markr-cvbwfhb9ecd2hjhr.eastus-01.azurewebsites.net';

const INVALID_TOKEN = 'INVALID_TOKEN';

function MyApp() {
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState('');
  const [labels, setLabels] = useState([]);

  const addAuthHeader = useCallback(
    (otherHeaders = {}) => {
      if (token === INVALID_TOKEN) {
        return otherHeaders;
      } else {
        return {
          ...otherHeaders,
          Authorization: `Bearer ${token}`,
        };
      }
    },
    [token]
  );

  // Fetch all notes on load
  useEffect(() => {
    if (token === INVALID_TOKEN) {
      return;
    }

    fetch(`${API}/notes`, {
      headers: addAuthHeader(),
    })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setNotes(json['notes_list']);
        } else {
          setNotes([]);
          setMessage('Please log in.');
        }
      })
      .catch((err) => console.log(err));
  }, [token, addAuthHeader]);

  // fetch all todos on load
  useEffect(() => {
    fetch(`${API}/todos`)
      .then((res) => res.json())
      .then((json) => setTodos(json['todos_list']))
      .catch((err) => console.log(err));
  }, []);

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
    }).then(async (response) => {
      if (response.status === 201) {
        const payload = await response.json();
        setToken(payload.token);
        setMessage(
          `Signup successful for user: ${creds.username}; auth token saved`
        );
      } else {
        const text = await response.text();
        setMessage(`Signup Error ${response.status}: ${text}`);
      }
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
          setNotes(notes.filter((n) => String(n._id || n.id) !== String(id)));
        }
      })
      .catch((err) => console.log(err));
  }

  // create a todo
  function createTodo(title, description) {
    fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => (res.status === 201 ? res.json() : undefined))
      .then((json) => {
        if (json) setTodos([...todos, json]);
      })
      .catch((err) => console.log(err));
  }

  // toggle a todo completed
  function toggleTodo(id) {
    fetch(`${API}/todos/${id}`, { method: 'PATCH' })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((updated) => {
        if (updated) {
          setTodos(
            todos.map((t) =>
              String(t._id || t.id) === String(id) ? updated : t
            )
          );
        }
      })
      .catch((err) => console.log(err));
  }

  // delete a todo
  function deleteTodo(id) {
    fetch(`${API}/todos/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.status === 200) {
          setTodos(todos.filter((t) => String(t._id || t.id) !== String(id)));
        }
      })
      .catch((err) => console.log(err));
  }

  // fetch all labels on load
  useEffect(() => {
    fetch(`${API}/labels`) // Or whatever your backend endpoint path is named
      .then((res) => res.json())
      .then((json) => setLabels(json['labels_list'] || json || []))
      .catch((err) => console.log('Error fetching labels:', err));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {token === INVALID_TOKEN && (
                  <div
                    style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '24px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Login handleSubmit={signupUser} buttonLabel="Sign Up" />
                      <Login handleSubmit={loginUser} buttonLabel="Log In" />
                    </div>
                    <p>{message}</p>
                  </div>
                )}
                <HomeScreen
                  notes={notes}
                  todos={todos}
                  labels={labels}
                  onToggleTodo={toggleTodo}
                />
              </>
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
        </Routes>
      </div>
    </div>
  );
}

export default MyApp;

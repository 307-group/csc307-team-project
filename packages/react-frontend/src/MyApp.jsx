// src/MyApp.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import NotesScreen from './components/NotesScreen';
import ToDoScreen from './components/ToDoScreen';
import NavBar from './components/NavBar';
import { SignInScreen } from './components/SignInScreen';
import { AccountScreen } from './components/AccountScreen';
import DeleteModal from './components/DeleteModal';
import UnsavedModal from './components/UnsavedModal';

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

  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
        if (json) setNotes((prev) => [json, ...prev]);
      })
      .catch((err) => console.log(err));
  }

  function updateNote(id, updatedFields) {
    const isFormData = updatedFields instanceof FormData;

    fetch(`${API}/notes/${id}`, {
      method: 'PUT',
      headers: isFormData
        ? addAuthHeader()
        : addAuthHeader({ 'Content-Type': 'application/json' }),
      body: isFormData ? updatedFields : JSON.stringify(updatedFields),
    })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((updated) => {
        if (updated) {
          setNotes((prevNotes) =>
            prevNotes.map((n) =>
              String(n._id || n.id) === String(id) ? updated : n
            )
          );
        }
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
  function handleConfirmDelete() {
    if (!pendingDelete) return;
    const id =
      pendingDelete.item._id || pendingDelete.item.id || pendingDelete.item;

    if (pendingDelete.type === 'task') {
      deleteTodo(id);
    }

    if (pendingDelete.type === 'label') {
      deleteLabel(id);
    }

    if (pendingDelete.type === 'note') {
      deleteNote(id);
    }

    setPendingDelete(null);
  }

  function handleDiscard() {
    setHasUnsavedChanges(false);
    if (pendingNavigation) {
      if (typeof pendingNavigation === 'function') {
        pendingNavigation();
      } else {
        navigate(pendingNavigation);
      }
    }
    setPendingNavigation(null);
  }

  function handleCancel() {
    setPendingNavigation(false);
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <NavBar
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((v) => !v)}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        hasUnsavedChanges={hasUnsavedChanges}
        setPendingNavigation={setPendingNavigation}
      />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <HomeScreen
                  notes={notes}
                  todos={todos}
                  labels={labels}
                  onToggleTodo={toggleTodo}
                />
              ) : (
                <Navigate to="/account" replace />
              )
            }
          />
          <Route
            path="/notes"
            element={
              isLoggedIn ? (
                <NotesScreen
                  notes={notes}
                  labels={labels}
                  onAdd={addNote}
                  onDelete={(note) =>
                    setPendingDelete({
                      type: 'note',
                      item: note,
                      title: 'Delete note',
                      message:
                        'Are you sure you want to delete this note? This action cannot be undone.',
                    })
                  }
                  onCreateLabel={createLabel}
                  onDeleteLabel={(label) =>
                    setPendingDelete({
                      type: 'label',
                      item: label,
                      title: 'Delete label',
                      message:
                        'Are you sure you want to delete this label? This action cannot be undone.',
                    })
                  }
                  onDownloadPdf={downloadNotePdf}
                  onUpdate={updateNote}
                  hasUnsavedChanges={hasUnsavedChanges}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                  setPendingNavigation={setPendingNavigation}
                />
              ) : (
                <Navigate to="/account" replace />
              )
            }
          />
          <Route
            path="/todos"
            element={
              isLoggedIn ? (
                <ToDoScreen
                  todos={todos}
                  onCreateTodo={createTodo}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={(todo) =>
                    setPendingDelete({
                      type: 'task',
                      item: todo,
                      title: 'Delete task',
                      message:
                        'Are you sure you want to delete this task? This action cannot be undone.',
                    })
                  }
                />
              ) : (
                <Navigate to="/account" replace />
              )
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
      {pendingDelete && (
        <DeleteModal
          title={pendingDelete.title}
          message={pendingDelete.message}
          confirmText="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
      {pendingNavigation && (
        <UnsavedModal onDiscard={handleDiscard} onCancel={handleCancel} />
      )}
    </div>
  );
}

export default MyApp;

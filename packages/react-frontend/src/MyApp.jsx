// src/MyApp.jsx
import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import NotesScreen from './components/NotesScreen';
import ToDoScreen from './components/ToDoScreen';
import NavBar from './components/NavBar';

const API = 'https://markr-cvbwfhb9ecd2hjhr.eastus-01.azurewebsites.net';

function MyApp() {
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [screen, setScreen] = useState('home');
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // fetch all notes on load
  useEffect(() => {
    fetch(`${API}/notes`)
      .then((res) => res.json())
      .then((json) => setNotes(json['notes_list']))
      .catch((err) => console.log(err));
  }, []);

  // fetch all todos on load
  useEffect(() => {
    fetch(`${API}/todos`)
      .then((res) => res.json())
      .then((json) => setTodos(json['todos_list']))
      .catch((err) => console.log(err));
  }, []);

  // add a note
  function addNote(note) {
    fetch(`${API}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    })
      .then((res) => (res.status === 201 ? res.json() : undefined))
      .then((json) => {
        if (json) setNotes([...notes, json]);
      })
      .catch((err) => console.log(err));
  }

  // delete a note
  function deleteNote(id) {
    fetch(`${API}/notes/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.status === 200) {
          setNotes(notes.filter((n) => n._id !== id));
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
          setTodos(todos.map((t) => (t._id === id ? updated : t)));
        }
      })
      .catch((err) => console.log(err));
  }

  // delete a todo
  function deleteTodo(id) {
    fetch(`${API}/todos/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.status === 200) {
          setTodos(todos.filter((t) => t._id !== id));
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavBar activeScreen={screen} onNavigate={setScreen} />

      <div style={{ flex: 1 }}>
        {screen === 'home' && (
          <HomeScreen
            notes={notes}
            labels={[]}
            todos={todos}
            onOpenNote={(id) => {
              setSelectedNoteId(id);
              setScreen('notes');
            }}
            onGoToNotes={() => setScreen('notes')}
            onGoToTodos={() => setScreen('todos')}
            onToggleTodo={toggleTodo}
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
        {screen === 'todos' && (
          <ToDoScreen
            todos={todos}
            onCreateTodo={createTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />
        )}
      </div>
    </div>
  );
}

export default MyApp;

// src/components/NotesScreen.jsx
import { useState } from "react";

function NotesScreen({ notes, onAdd, onDelete }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, body });
    setTitle("");
    setBody("");
  }

  return (
    <div style={{ padding: "2rem", flex: 1 }}>
      <h2>Notes</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: "0.5rem", width: "300px" }}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ display: "block", marginBottom: "0.5rem", width: "300px" }}
        />
        <button type="submit">Add Note</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map((note) => (
          <li
            key={note.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "0.75rem",
              width: "300px",
            }}
          >
            <strong>{note.title}</strong>
            <p style={{ margin: "0.25rem 0" }}>{note.body}</p>
            <button onClick={() => onDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotesScreen;
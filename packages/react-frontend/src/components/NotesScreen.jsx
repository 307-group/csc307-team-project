// src/components/NotesScreen.jsx
import { useState } from "react";
import { Plus, Trash2, StickyNote, FileText } from "lucide-react";

function NoteListItem({ note, isActive, onClick, onDelete }) {
  const preview = (note.body || "").slice(0, 55);
  return (
    <div
      onClick={onClick}
      className={`group relative w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
        isActive ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      <p className="text-sm font-medium text-gray-800 truncate">
        {note.title || "Untitled Note"}
      </p>
      <p className="text-xs text-gray-400 truncate mt-0.5">
        {preview || "No content"}
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function NotesScreen({ notes, onAdd, onDelete }) {
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const selectedNote = notes.find((n) => n.id === selectedId);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, body });
    setTitle("");
    setBody("");
    setShowForm(false);
  }

  function handleNewNote() {
    setShowForm(true);
    setSelectedId(null);
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Left Sidebar ───────────────────────────────────────── */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-700">Notes</span>
          <button
            onClick={handleNewNote}
            className="flex items-center gap-1 text-sm px-2.5 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            <Plus size={14} />
            New
          </button>
        </div>

        {/* Note list */}
        <div className="flex-1 overflow-y-auto p-2">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300 py-8">
              <StickyNote size={28} />
              <p className="text-xs">No notes yet</p>
            </div>
          ) : (
            notes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isActive={selectedId === note.id && !showForm}
                onClick={() => { setSelectedId(note.id); setShowForm(false); }}
                onDelete={() => {
                  onDelete(note.id);
                  if (selectedId === note.id) setSelectedId(null);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right Editor / Form Panel ──────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {showForm ? (
          /* New note form */
          <div className="flex-1 flex flex-col p-8 max-w-2xl w-full">
            <form onSubmit={handleSubmit} className="flex flex-col h-full gap-3">
              <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="text-2xl font-bold border-none outline-none bg-transparent text-gray-800 placeholder-gray-300"
              />
              <div className="h-px bg-gray-100" />
              <textarea
                placeholder="Start typing your note..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="flex-1 text-sm text-gray-700 border-none outline-none resize-none bg-transparent placeholder-gray-300 leading-relaxed"
              />
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Save Note
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

        ) : selectedNote ? (
          /* Note viewer */
          <div className="flex-1 flex flex-col p-8 max-w-2xl w-full overflow-y-auto">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-800">{selectedNote.title}</h1>
              <button
                onClick={() => { onDelete(selectedNote.id); setSelectedId(null); }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4 flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="h-px bg-gray-100 mb-4" />
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {selectedNote.body || <span className="text-gray-300 italic">No content</span>}
            </p>
          </div>

        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-300">
            <FileText size={44} />
            <p className="text-sm text-gray-400">Select a note or create a new one</p>
            <button
              onClick={handleNewNote}
              className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700 transition-colors"
            >
              + New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesScreen;
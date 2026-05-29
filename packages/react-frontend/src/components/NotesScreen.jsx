// src/components/NotesScreen.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, StickyNote, FileText, Download } from 'lucide-react';
import LabelsNotesBar from './LabelsNotesBar';

function NoteListItem({ note, isActive, onClick, onDelete }) {
  const preview = (note.body || '').slice(0, 55);
  return (
    <div
      onClick={onClick}
      className={`group relative w-full text-left px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? 'bg-gray-100 dark:bg-[var(--surface)]'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
        {note.title || 'Untitled Note'}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
        {preview || 'No content'}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function NotesScreen({ notes, labels, onAdd, onDelete, onCreateLabel,  onDownloadPdf }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const selectedId = searchParams.get('id');
  const selectedLabelId = searchParams.get('labelId');
  const unlabeledNotes = notes.filter((note) => !note.labelId);
  const selectedNote = notes.find(
    (n) => String(n._id || n.id) === String(selectedId)
  );

  function handleSelectNote(id) {
    setSearchParams({ id });
    setShowForm(false);
  }

  function handleNewNote() {
    setSearchParams({});
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, body, labelId: selectedLabelId });
    setTitle('');
    setBody('');
    setShowForm(false);
  }


  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[var(--background)] overflow-hidden">
      {/* ── Left Sidebar ───────────────────────────────────────── */}
      <div className="w-64 bg-white dark:bg-[var(--surface)] border-r border-gray-200 dark:border-[var(--border)] flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[var(--border)]">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Notes
          </span>
          <button
            onClick={handleNewNote}
            className="flex items-center gap-1 text-sm px-2.5 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
          >
            <Plus size={14} />
            New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <LabelsNotesBar
            labels={labels}
            notes={notes}
            onCreateLabel={onCreateLabel}
            onNewNoteForLabel={(labelId) => {
              setSearchParams({ labelId });
              setShowForm(true);
            }}
            onSelectNote={handleSelectNote}
            onDeleteNote={onDelete}
          />
          {unlabeledNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300 dark:text-gray-600 py-8">
              <StickyNote size={28} />
              <p className="text-xs">No notes yet</p>
            </div>
          ) : (
            unlabeledNotes.map((note) => (
              <NoteListItem
                key={note._id}
                note={note}
                isActive={
                  String(selectedId) === String(note._id || note.id) &&
                  !showForm
                }
                onClick={() => handleSelectNote(note._id || note.id)}
                onDelete={() => {
                  onDelete(note._id || note.id);
                  if (selectedId === (note._id || note.id)) setSearchParams({});
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right Editor / Form Panel ──────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showForm ? (
          <div className="flex-1 flex flex-col p-8 max-w-2xl w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full gap-3"
            >
              <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="text-2xl font-bold border-none outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600"
              />
              <div className="h-px bg-gray-100 dark:bg-gray-700" />
              <textarea
                placeholder="Start typing your note..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="flex-1 text-sm text-gray-700 dark:text-gray-300 border-none outline-none resize-none bg-transparent placeholder-gray-300 dark:placeholder-gray-600 leading-relaxed"
              />
              <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-[var(--border)]">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
                >
                  Save Note
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : selectedNote ? (
          <div className="flex-1 flex flex-col p-8 max-w-2xl w-full overflow-y-auto">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {selectedNote.title || 'Untitled Note'}
              </h1>

              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={() => onDownloadPdf(selectedNote)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  PDF
                </button>

                <button
                  onClick={() => {
                    onDelete(selectedNote._id || selectedNote.id);
                    setSearchParams({});
                    navigate('/notes');
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="h-px bg-gray-100 dark:bg-gray-700 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
              {selectedNote.body || (
                <span className="text-gray-300 dark:text-gray-600 italic">
                  No content
                </span>
              )}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-300 dark:text-gray-600">
            <FileText size={44} />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Select a note or create a new one
            </p>
            <button
              onClick={handleNewNote}
              className="text-sm text-gray-500 dark:text-gray-400 underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
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

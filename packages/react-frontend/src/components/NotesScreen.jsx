// src/components/NotesScreen.jsx
import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Trash2,
  StickyNote,
  FileText,
  Download,
  ImageIcon,
  X,
} from 'lucide-react';
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

function NotesScreen({
  notes,
  labels,
  onAdd,
  onDelete,
  onCreateLabel,
  onDeleteLabel,
  onDownloadPdf,
  onUpdate,
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageURL, setImageURL] = useState(null);
  const [rawFile, setRawFile] = useState(null);

  const fileUploadRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  const selectedId = searchParams.get('id');
  const selectedLabelId = searchParams.get('labelId');
  const unlabeledNotes = notes.filter((note) => !note.labelId);
  const selectedNote = notes.find(
    (n) => String(n._id || n.id) === String(selectedId)
  );

  function handleSelectNote(id) {
    setSearchParams({ id });
    setShowForm(false);
    setIsEditing(false);
  }

  function handleNewNote() {
    setSearchParams({});
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (selectedLabelId) {
      formData.append('labelId', selectedLabelId);
    }

    if (rawFile) {
      formData.append('image', rawFile);
    }

    onAdd({ formData });

    setTitle('');
    setBody('');
    setImageURL('');
    setRawFile(null);
    setShowForm(false);
  }

  function handleImageUpload(e) {
    e.preventDefault();
    fileUploadRef.current.value = null;
    fileUploadRef.current.click();
  }

  function uploadImageDisplay() {
    const uploadedFile = fileUploadRef.current.files[0];
    if (!uploadedFile) return;

    setRawFile(uploadedFile);
    const cachedURL = URL.createObjectURL(uploadedFile);
    setImageURL(cachedURL);
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
            onDeleteLabel={onDeleteLabel}
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
        {showForm && !selectedId ? (
          // new note form
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto">
              {/* Note Title */}
              <div className="p-8 w-full">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  className="text-2xl font-bold border-none outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600"
                />

                {/* Note Line Break */}
                <div className="h-px bg-gray-100 dark:bg-gray-700" />

                {/* Note Contents */}
                <div className="relative my-2 max-w-md">
                  {/* Optional Image */}
                  {imageURL && (
                    <div className="relative rounded-lg overflow-hidden bg-gray-50 mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setImageURL(null);
                          setRawFile(null);
                          if (fileUploadRef.current) {
                            fileUploadRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 z-10 p-1.5 rounded-full border dark:border-white bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-white hover:bg-gray-300 shadow dark:hover:bg-muted shadow transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <img
                        src={imageURL}
                        alt="Image"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Add Image Button */}
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="flex items-center gap-2 px-4 py-2 text-black text-sm text-foreground rounded-lg hover:bg-muted border border-border transition-colors"
                  >
                    <ImageIcon className="size-4" />
                    {imageURL ? 'Change Image' : 'Add Image'}
                  </button>
                  <input
                    type="file"
                    id="file"
                    ref={fileUploadRef}
                    onChange={uploadImageDisplay}
                    hidden
                  />
                </div>

                {/* Note Body */}
                <textarea
                  placeholder="Start typing your note..."
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  rows={1}
                  className="w-full min-h-[120px] text-sm text-gray-700 dark:text-gray-300 border-none outline-none resize-none overflow-hidden bg-transparent placeholder-gray-300 dark:placeholder-gray-600 leading-relaxed"
                />
              </div>
            </div>

            {/* Save Changes Footer */}
            <div className="border-t border-gray-100 dark:border-[var(--border)] p-4 bg-white dark:bg-[var(--surface)]">
              <div className="max-w-2xl flex gap-3">
                {/* Save */}
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
                >
                  Save Note
                </button>
                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : selectedNote ? (
          // selected note view
          <div className="flex-1 flex flex-col p-8 w-full overflow-y-auto">
            <div className="flex items-start justify-between mb-3">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                  className="text-2xl font-bold border-none outline-none bg-transparent text-gray-800 dark:text-gray-100 w-full"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {selectedNote.title || 'Untitled Note'}
                </h1>
              )}

              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        onUpdate(selectedNote._id || selectedNote.id, {
                          title: editTitle,
                          body: editBody,
                        });
                        setIsEditing(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditTitle(selectedNote.title || '');
                        setEditBody(selectedNote.body || '');
                        setIsEditing(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
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
                  </>
                )}
              </div>
            </div>
            <div className="h-px bg-gray-100 dark:bg-gray-700 mb-4" />
            {isEditing ? (
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="flex-1 text-sm text-gray-700 dark:text-gray-300 border-none outline-none resize-none bg-transparent leading-relaxed"
              />
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {selectedNote.body || (
                  <span className="text-gray-300 dark:text-gray-600 italic">
                    No content
                  </span>
                )}
              </p>
            )}
            {selectedNote.imageUrl && (
              <img
                src={selectedNote.imageUrl}
                alt={selectedNote.title}
                className="mt-4 rounded-lg max-w-lg w-full object-cover"
              />
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
              {selectedNote.body || (
                <span className="text-gray-300 dark:text-gray-600 italic">
                  No content
                </span>
              )}
            </p>
          </div>
        ) : (
          // no note selected (default)
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

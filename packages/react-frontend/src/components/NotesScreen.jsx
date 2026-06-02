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
  const displayTitle = note.title || 'Untitled Note';

  return (
    <div
      onClick={onClick}
      className={`group px-3 py-2 cursor-pointer transition-all border ${
      isActive ? 'bg-muted/90 border-gray-300 dark:border-gray-600 shadow-sm' : 'bg-white dark:bg-[var(--surface)] border-gray-200 dark:border-[var(--border)] hover:bg-muted/40 dark:hover:bg-muted/50 hover:shadow-sm'
      } mx-[8px] my-[4px] rounded-[12px]`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate text-foreground">{displayTitle}</h3>
          {preview && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{preview}</p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5 p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
        >
          <Trash2 size={13} />
        </button>
      </div>
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
      <div className="w-62 bg-white dark:bg-[var(--surface)] border-r border-gray-200 dark:border-[var(--border)] flex flex-col flex-shrink-0">
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
            selectedId={selectedId}
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
                  String(selectedId) === String(note._id || note.id) && !showForm
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
          // ── New note form ──
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            {/* Title + label area */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-[var(--border)]">
              <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full text-2xl font-bold border-none outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 focus:ring-0 shadow-none px-4"
              />
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-6">
              <textarea
                placeholder="Start typing your note..."
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={1}
                className="w-full min-h-[200px] text-sm text-gray-700 dark:text-gray-300 border-none outline-none resize-none overflow-hidden bg-transparent placeholder-gray-300 dark:placeholder-gray-600 leading-relaxed px-4 py-2"
              />

              {/* Action buttons */}
              <div className="mt-4 flex gap-2 px-4">
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted text-foreground transition-colors"
                >
                  <ImageIcon className="size-4" />
                  {imageURL ? 'Change Image' : 'Add Image'}
                </button>
              </div>

              <input
                type="file"
                id="file"
                ref={fileUploadRef}
                onChange={uploadImageDisplay}
                hidden
              />

              {/* Image preview */}
              {imageURL && (
                <div className="mt-6 px-4">
                  <div className="relative group border border-border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setImageURL(null);
                        setRawFile(null);
                        if (fileUploadRef.current) fileUploadRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-card shadow border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <img src={imageURL} alt="Attachment" className="w-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Save footer */}
            <div className="border-t border-gray-100 dark:border-[var(--border)] p-4 bg-white dark:bg-[var(--surface)]">
              <div className="flex gap-3 px-4">
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
            </div>
          </form>

        ) : selectedNote ? (
          // ── Selected note view ──
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Title + actions header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-[var(--border)]">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                  className="w-full text-2xl font-bold border-none outline-none bg-transparent text-gray-800 dark:text-gray-100 focus:ring-0 shadow-none px-4"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 px-4">
                  {selectedNote.title || 'Untitled Note'}
                </h1>
              )}

              <div className="mt-3 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
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
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
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
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDownloadPdf(selectedNote)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Download size={16} />
                        PDF
                      </button>
                    </>
                  )}
                </div>
                {!isEditing && (
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
                )}
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isEditing ? (
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full min-h-[200px] text-sm text-gray-700 dark:text-gray-300 border-none outline-none resize-none bg-transparent leading-relaxed px-4 py-2"
                />
              ) : (
                <>
                  {selectedNote.imageUrl && (
                    <div className="mb-6 px-4">
                      <div className="border border-border rounded-lg overflow-hidden">
                        <img
                          src={selectedNote.imageUrl}
                          alt={selectedNote.title}
                          className="w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap px-4">
                    {selectedNote.body || (
                      <span className="text-gray-300 dark:text-gray-600 italic">
                        No content
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>

        ) : (
          // ── No note selected ──
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-300 dark:text-gray-600">
            <FileText size={44} />
            <p className="text-lg text-gray-400 dark:text-gray-500">
              Select a note to start editing
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesScreen;

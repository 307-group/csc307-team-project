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
        isActive
          ? 'bg-muted/90 border-gray-300 dark:border-gray-600 shadow-sm'
          : 'bg-white dark:bg-[var(--surface)] border-gray-200 dark:border-[var(--border)] hover:bg-muted/20 dark:hover:bg-muted/20 hover:shadow-sm'
      } mx-[8px] my-[4px] rounded-[12px]`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate text-foreground">
            {displayTitle}
          </h3>
          {preview && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {preview}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
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
  const editFileUploadRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editImageURL, setEditImageURL] = useState(null);
  const [editRawFile, setEditRawFile] = useState(null);

  const selectedId = searchParams.get('id');
  const selectedLabelId = searchParams.get('labelId');
  const unlabeledNotes = notes.filter((note) => !note.labelId);
  const selectedNote = notes.find(
    (n) => String(n._id || n.id) === String(selectedId)
  );

  function resetEditDraft() {
    setEditImageURL(null);
    setEditRawFile(null);

    if (editFileUploadRef.current) {
      editFileUploadRef.current.value = '';
    }
  }

  function handleSelectNote(id) {
    setSearchParams({ id });
    setShowForm(false);
    setIsEditing(false);
    resetEditDraft();
  }

  function resetDraft() {
    setTitle('');
    setBody('');
    setImageURL(null);
    setRawFile(null);

    if (fileUploadRef.current) {
      fileUploadRef.current.value = '';
    }
  }

  function handleNewNote() {
    setSearchParams({});
    resetDraft();
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

    resetDraft();
    setShowForm(false);
  }

  function handleCancelCreate() {
    resetDraft();
    setShowForm(false);
  }

  function handleImageUpload(e) {
    e.preventDefault();

    if (!fileUploadRef.current) return;

    fileUploadRef.current.value = '';
    fileUploadRef.current.click();
  }

  function uploadImageDisplay() {
    const uploadedFile = fileUploadRef.current?.files?.[0];
    if (!uploadedFile) return;

    setRawFile(uploadedFile);
    const cachedURL = URL.createObjectURL(uploadedFile);
    setImageURL(cachedURL);
  }

  function handleEditImageUpload(e) {
    e.preventDefault();

    if (!editFileUploadRef.current) return;

    editFileUploadRef.current.value = '';
    editFileUploadRef.current.click();
  }

  function uploadEditImageDisplay() {
    const uploadedFile = editFileUploadRef.current?.files?.[0];
    if (!uploadedFile) return;

    setEditRawFile(uploadedFile);
    setEditImageURL(URL.createObjectURL(uploadedFile));
  }

  function handleEditImageUpload(e) {
    e.preventDefault();

    if (!editFileUploadRef.current) return;

    editFileUploadRef.current.value = '';
    editFileUploadRef.current.click();
  }

  function uploadEditImageDisplay() {
    const uploadedFile = editFileUploadRef.current?.files?.[0];
    if (!uploadedFile) return;

    setEditRawFile(uploadedFile);
    setEditImageURL(URL.createObjectURL(uploadedFile));
  }

  return (
    <div className="flex h-screen bg-white dark:bg-[var(--surface)] overflow-hidden">
      {/* ── Left Sidebar ───────────────────────────────────────── */}
      <div className="w-62 bg-gray-50 dark:bg-[var(--background)] border-r border-gray-200 dark:border-[var(--border)] flex flex-col flex-shrink-0">
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
              resetDraft();
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
          // ── New note form ──
          // new note form
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto flex flex-col"
          >
            <div className="flex w-full flex-col gap-5 p-4 md:p-6 h-full">
              {/* Note Title Block */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-[var(--border)] dark:bg-[var(--background)]">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  className="w-full border-none bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Note Content Block */}
              <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-[var(--border)] dark:bg-[var(--background)] flex flex-col">
                {imageURL && (
                  <div className="relative mb-4 w-fit max-w-full self-start">
                    <button
                      type="button"
                      onClick={() => {
                        setImageURL(null);
                        setRawFile(null);

                        if (fileUploadRef.current) {
                          fileUploadRef.current.value = '';
                        }
                      }}
                      className="absolute right-3 top-3 z-10 rounded-full border border-gray-200 bg-white p-1.5 text-gray-600 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-[var(--border)] dark:bg-[var(--surface)] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      <X size={16} />
                    </button>
                    <img
                      src={imageURL}
                      alt="Note attachment preview"
                      className="block h-auto max-h-[70vh] max-w-full rounded-xl object-contain"
                    />
                  </div>
                )}

                <textarea
                  placeholder="Start typing your note..."
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  className="flex-1 w-full resize-none border-none bg-transparent text-sm leading-relaxed text-gray-700 outline-none placeholder-gray-300 dark:text-gray-300 dark:placeholder-gray-600"
                />

                <div className="mt-24 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-[var(--border)] sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-[var(--border)] dark:bg-[var(--surface)] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    >
                      <ImageIcon size={16} />
                      {imageURL ? 'Change Image' : 'Add Image'}
                    </button>
                    <input
                      type="file"
                      id="file"
                      ref={fileUploadRef}
                      accept="image/*"
                      onChange={uploadImageDisplay}
                      hidden
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelCreate}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : selectedNote ? (
          // ── Selected note view ──
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex w-full flex-col gap-5 p-4 md:p-6 h-full">
              {/* Note Title Block */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-[var(--border)] dark:bg-[var(--background)]">
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                    className="w-full border-none bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground"
                  />
                ) : (
                  <h1 className="break-words text-2xl font-bold text-foreground">
                    {selectedNote.title || 'Untitled Note'}
                  </h1>
                )}
              </div>
              {/* Note Content Block */}
              <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-[var(--border)] dark:bg-[var(--background)] flex flex-col">
                {isEditing ? (
                  <>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      placeholder="Start typing your note..."
                      className="flex-1 w-full resize-none border-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
                    />

                    {editImageURL && (
                      <img
                        src={editImageURL}
                        alt={editTitle || 'Note attachment preview'}
                        className="mt-5 block h-auto w-auto max-w-full self-start rounded-xl"
                      />
                    )}

                    <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-[var(--border)] sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <button
                          type="button"
                          onClick={handleEditImageUpload}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-[var(--border)] dark:bg-[var(--surface)] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                        >
                          <ImageIcon size={16} />
                          {editImageURL ? 'Change Image' : 'Add Image'}
                        </button>

                        <input
                          type="file"
                          ref={editFileUploadRef}
                          accept="image/*"
                          onChange={uploadEditImageDisplay}
                          hidden
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            resetEditDraft();
                          }}
                          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const formData = new FormData();
                            formData.append('title', editTitle);
                            formData.append('body', editBody);

                            if (editRawFile) {
                              formData.append('image', editRawFile);
                            }

                            onUpdate(
                              selectedNote._id || selectedNote.id,
                              formData
                            );
                            setIsEditing(false);
                            resetEditDraft();
                          }}
                          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {selectedNote.imageUrl && (
                      <img
                        src={selectedNote.imageUrl}
                        alt={selectedNote.title || 'Note attachment'}
                        className="mb-5 block h-auto max-h-[70vh] max-w-full self-start rounded-xl object-contain"
                      />
                    )}

                    <div className="flex-1 text-sm leading-relaxed text-foreground overflow-y-auto">
                      {selectedNote.body ? (
                        <p className="whitespace-pre-wrap">
                          {selectedNote.body}
                        </p>
                      ) : (
                        <p className="italic text-muted-foreground">
                          No content
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-[var(--border)] sm:flex-row sm:items-center sm:justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setEditTitle(selectedNote.title || '');
                          setEditBody(selectedNote.body || '');
                          setEditImageURL(selectedNote.imageUrl || null);
                          setEditRawFile(null);
                          setIsEditing(true);
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-[var(--border)] dark:bg-[var(--surface)] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDownloadPdf(selectedNote)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-[var(--border)] dark:bg-[var(--surface)] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                      >
                        <Download size={16} />
                        Download PDF
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onDelete(selectedNote._id || selectedNote.id);
                          setSearchParams({});
                          navigate('/notes');
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-white px-4 py-2 text-sm font-medium text-red-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 dark:border-red-900/40 dark:bg-[var(--surface)] dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          // ── No note selected ──
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-300 dark:text-gray-600">
            <FileText size={44} />
            <p className="text-lg text-gray-400 dark:text-gray-500">
              Select a note to start editing
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              or create a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesScreen;

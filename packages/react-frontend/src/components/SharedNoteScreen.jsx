import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, LogOut, Save } from 'lucide-react';

function SharedNoteScreen({
  API,
  onJoinSharedNoteRoom,
  onEmitSharedNoteChange,
  onListenForSharedNoteChanges,
  onListenForNoteSaveErrors,
  onSaveSharedNoteToMyNotes,
}) {
  const navigate = useNavigate();
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSharedNote() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API}/notes/shared/${shareId}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`${response.status}: ${errorText}`);
        }

        const data = await response.json();

        setNote(data);
        setBody(data.body || '');

        onJoinSharedNoteRoom?.(shareId);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Could not load shared note.');
      } finally {
        setLoading(false);
      }
    }

    loadSharedNote();
  }, [API, shareId, onJoinSharedNoteRoom]);

  useEffect(() => {
    const cleanup = onListenForSharedNoteChanges?.((update) => {
      if (String(update.shareId) !== String(shareId)) return;

      setBody(update.body || '');

      setNote((currentNote) =>
        currentNote
          ? {
              ...currentNote,
              title: update.title || currentNote.title,
              body: update.body || '',
              imageUrl: update.imageUrl || currentNote.imageUrl,
            }
          : currentNote
      );
    });

    return cleanup;
  }, [shareId, onListenForSharedNoteChanges]);

  useEffect(() => {
    const cleanup = onListenForNoteSaveErrors?.((socketError) => {
      console.error(socketError.message);
    });

    return cleanup;
  }, [onListenForNoteSaveErrors]);

  function handleBodyChange(e) {
    const newBody = e.target.value;

    setBody(newBody);
    setNote((currentNote) =>
      currentNote ? { ...currentNote, body: newBody } : currentNote
    );

    onEmitSharedNoteChange?.(shareId, {
      body: newBody,
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        Loading shared note...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-gray-400">
        <FileText size={44} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-[var(--surface)] overflow-hidden">
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex w-full flex-col gap-5 p-4 md:p-6 h-full">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-[var(--border)] dark:bg-[var(--background)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">
                  Shared Note
                </p>

                <h1 className="break-words text-2xl font-bold text-foreground">
                  {note?.title || 'Untitled Note'}
                </h1>

                <p className="mt-2 text-xs text-gray-400">
                  Changes save automatically. Saved copies stay synced with this
                  shared note!
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onSaveSharedNoteToMyNotes?.(shareId)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-[var(--border)] dark:bg-[var(--surface)] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  <Save size={16} />
                  Save synced copy
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/notes')}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-[var(--border)] dark:bg-[var(--surface)] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  <LogOut size={16} />
                  Exit
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-[var(--border)] dark:bg-[var(--background)] flex flex-col">
            {note?.imageUrl && (
              <img
                src={note.imageUrl}
                alt={note.title || 'Shared note image'}
                className="mb-5 block h-auto max-h-[70vh] max-w-full self-start rounded-xl object-contain"
              />
            )}

            <textarea
              value={body}
              onChange={handleBodyChange}
              className="flex-1 w-full resize-none border-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Start typing..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharedNoteScreen;

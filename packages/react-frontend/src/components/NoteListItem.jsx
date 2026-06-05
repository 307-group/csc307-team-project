import { Trash2 } from 'lucide-react';

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
          type="button"
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

export default NoteListItem;

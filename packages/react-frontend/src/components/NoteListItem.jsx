import { Trash2 } from 'lucide-react';

export function NoteListItem({ note, isActive, onClick, onDelete }) {
  const preview = note.content.slice(0, 55);
  const displayTitle = note.title || 'Untitled Note';

  return (
    <div
      onClick={onClick}
      className={`group px-3 py-2 cursor-pointer border-b border-gray-100 transition-colors ${
        isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
      } mx-[16px] my-[0px] rounded-[14px]`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate text-gray-800">
            {displayTitle}
          </h3>

          {preview && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{preview}</p>
          )}
        </div>

        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

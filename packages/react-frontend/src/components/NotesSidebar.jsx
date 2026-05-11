import { useState, useRef, useEffect } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  Tag,
  Pencil,
} from "lucide-react";
import { NoteListItem } from "./NoteListItem";

const PRESET_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#ec4899",
  "#f97316",
  "#14b8a6",
];

function NewLabelForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, color);
  };

  return (
    <div className="mx-3 my-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Label name..."
        className="w-full text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 mb-2.5"
      />

      <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="size-5 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ backgroundColor: c }}
            type="button"
          >
            {color === c && (
              <Check className="size-3 text-white" strokeWidth={3} />
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={submit}
          disabled={!name.trim()}
          className="flex-1 text-xs py-1.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          Create label
        </button>

        <button
          onClick={onCancel}
          className="px-3 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function LabelGroup({
  label,
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onDeleteLabel,
  onRenameLabel,
}) {
  const [expanded, setExpanded] = useState(true);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(label?.name ?? "");
  const renameRef = useRef(null);

  useEffect(() => {
    if (renaming) renameRef.current?.focus();
  }, [renaming]);

  const submitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && onRenameLabel) onRenameLabel(trimmed);
    setRenaming(false);
  };

  const isUnlabeled = label === null;
  const color = label?.color ?? "#9ca3af";
  const displayName = label?.name ?? "Unlabeled";

  return (
    <div className="select-none">
      <div className="group/header flex items-center gap-1 px-3 py-1.5 hover:bg-gray-50 transition-colors">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 flex-1 min-w-0"
          type="button"
        >
          {expanded ? (
            <ChevronDown className="size-3.5 text-gray-400 shrink-0" />
          ) : (
            <ChevronRight className="size-3.5 text-gray-400 shrink-0" />
          )}

          <span
            className="size-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />

          {renaming ? (
            <input
              ref={renameRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRename();
                if (e.key === "Escape") {
                  setRenaming(false);
                  setRenameValue(label?.name ?? "");
                }
              }}
              onBlur={submitRename}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-sm font-medium bg-transparent outline-none border-b border-gray-300 min-w-0"
            />
          ) : (
            <span className="text-sm font-medium text-gray-700 truncate">
              {displayName}
            </span>
          )}

          <span className="text-xs text-gray-400 ml-1 shrink-0">
            {notes.length}
          </span>
        </button>

        <div className="flex items-center gap-0.5 opacity-0 group-hover/header:opacity-100 transition-opacity">
          {!isUnlabeled && onRenameLabel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRenaming(true);
                setRenameValue(label.name);
              }}
              className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Rename label"
              type="button"
            >
              <Pencil className="size-3" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateNote();
            }}
            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="New note in this label"
            type="button"
          >
            <Plus className="size-3.5" />
          </button>

          {!isUnlabeled && onDeleteLabel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteLabel();
              }}
              className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete label"
              type="button"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="pl-4">
          {notes.length === 0 ? (
            <p className="text-xs text-gray-400 px-4 py-1.5 italic">
              No notes
            </p>
          ) : (
            notes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isActive={note.id === activeNoteId}
                onClick={() => onSelectNote(note.id)}
                onDelete={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function NotesSidebar({
  notes,
  labels,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onCreateLabel,
  onDeleteLabel,
  onRenameLabel,
}) {
  const [showNewLabelForm, setShowNewLabelForm] = useState(false);

  const unlabeledNotes = notes.filter((n) => !n.labelId);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notes</h1>

        <button
          onClick={() => onCreateNote()}
          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          type="button"
        >
          <Plus className="size-3.5" />
          New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="flex items-center justify-between px-4 mb-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <Tag className="size-3" />
            Labels
          </div>

          <button
            onClick={() => setShowNewLabelForm((v) => !v)}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded p-0.5"
            title="Create new label"
            type="button"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        {showNewLabelForm && (
          <NewLabelForm
            onAdd={(name, color) => {
              onCreateLabel(name, color);
              setShowNewLabelForm(false);
            }}
            onCancel={() => setShowNewLabelForm(false)}
          />
        )}

        {labels.length === 0 && !showNewLabelForm && (
          <div className="mx-4 mb-3 rounded-xl border border-dashed border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-400">No labels yet</p>
            <button
              onClick={() => setShowNewLabelForm(true)}
              className="mt-1 text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700 transition-colors"
              type="button"
            >
              Create your first label
            </button>
          </div>
        )}

        {labels.map((label) => (
          <LabelGroup
            key={label.id}
            label={label}
            notes={notes.filter((n) => n.labelId === label.id)}
            activeNoteId={activeNoteId}
            onSelectNote={onSelectNote}
            onCreateNote={() => onCreateNote(label.id)}
            onDeleteNote={onDeleteNote}
            onDeleteLabel={() => onDeleteLabel(label.id)}
            onRenameLabel={(name) => onRenameLabel(label.id, name)}
          />
        ))}

        {unlabeledNotes.length > 0 && (
          <>
            {labels.length > 0 && (
              <div className="border-t border-gray-100 my-2" />
            )}

            <LabelGroup
              label={null}
              notes={unlabeledNotes}
              activeNoteId={activeNoteId}
              onSelectNote={onSelectNote}
              onCreateNote={() => onCreateNote(undefined)}
              onDeleteNote={onDeleteNote}
            />
          </>
        )}

        {notes.length === 0 && labels.length === 0 && (
          <div className="px-4 mt-2 text-center text-gray-400">
            <p className="text-sm">
              Create a label and start taking notes!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import {
  Tag,
  Plus,
  Check,
  ChevronDown,
  ChevronRight,
  X,
  Trash2,
} from 'lucide-react';

const LABEL_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#eab308',
  '#a855f7',
  '#ec4899',
  '#f97316',
  '#14b8a6',
];

function LabelsNotesBar({
  labels = [],
  notes = [],
  onCreateLabel,
  onDeleteLabel,
  onNewNoteForLabel,
  onSelectNote,
  onDeleteNote,
}) {
  const [showForm, setShowForm] = useState(false);
  const [labelName, setLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[0]);
  const [expandedLabels, setExpandedLabels] = useState({});

  function handleCreateLabel() {
    if (!labelName.trim()) return;

    onCreateLabel({
      name: labelName,
      color: selectedColor,
    });

    setLabelName('');
    setSelectedColor(LABEL_COLORS[0]);
    setShowForm(false);
  }

  return (
    <>
      <div className="flex items-center justify-between px-3 mb-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Tag className="size-3" />
          Labels
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="text-muted-foreground hover:text-foreground transition-colors rounded p-0.5"
          title="Create new label"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {showForm && (
        <div className="mx-2 my-2 rounded-xl border border-border bg-muted p-3">
          <input
            type="text"
            placeholder="Label name..."
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground mb-2.5"
          />

          <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
            {LABEL_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className="size-5 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && (
                  <Check className="size-3 text-white" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={!labelName.trim()}
              onClick={handleCreateLabel}
              className="flex-1 text-xs py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Create label
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 text-xs py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {labels.length === 0 && !showForm ? (
        <div className="mx-2 mb-3 rounded-xl border border-dashed border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">No labels yet</p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-1 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Create your first label
          </button>
        </div>
      ) : (
        <div className="px-3 space-y-1">
          {labels.map((label) => {
            const labelId = label._id || label.id;
            const isExpanded = expandedLabels[labelId];

            const labelNotes = notes.filter(
              (note) => String(note.labelId) === String(labelId)
            );

            return (
              <div key={labelId} className="select-none">
                <div className="group/header flex items-center gap-1 px-3 py-1.5 hover:bg-muted transition-colors">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedLabels({
                        ...expandedLabels,
                        [labelId]: !isExpanded,
                      })
                    }
                    className="flex items-center gap-1.5 flex-1 min-w-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                    )}

                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: label.color }}
                    />

                    <span className="text-sm font-medium text-foreground truncate">
                      {label.name}
                    </span>

                    <span className="text-xs text-muted-foreground ml-1 shrink-0">
                      {labelNotes.length}
                    </span>
                  </button>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover/header:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onNewNoteForLabel(labelId)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      title="New note in this label"
                    >
                      <Plus className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteLabel(label._id || label.id)}
                      className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete label"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="pl-4">
                    {labelNotes.length === 0 ? (
                      <p className="px-3 py-2 text-sm italic text-muted-foreground">
                        No notes
                      </p>
                    ) : (
                      labelNotes.map((note) => (
                        <div
                          key={note._id || note.id}
                          onClick={() => onSelectNote(note._id || note.id)}
                          className="group px-3 py-2 cursor-pointer border-b border-border transition-colors hover:bg-muted/50 mx-[16px] my-[0px] rounded-[14px]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium truncate text-foreground">
                                {note.title || 'Untitled Note'}
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteNote(note._id || note.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5 p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
export default LabelsNotesBar;

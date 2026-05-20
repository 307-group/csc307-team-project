import { Check, ArrowRight, StickyNote, ClipboardList } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// ── Helpers ───────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(ms) {
  const diff = Date.now() - new Date(ms).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;

  return new Date(ms).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function SectionHeader({ title, count, to }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </h2>
        <span className="text-xs text-gray-400">· {count}</span>
      </div>

      <Link
        to={to}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
      >
        View all <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}

function TodoRow({ todo, onToggle, onNavigate }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 group">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`mt-0.5 size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          todo.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {todo.completed && (
          <Check className="size-3 text-white" strokeWidth={3} />
        )}
      </button>

      <button onClick={onNavigate} className="flex-1 min-w-0 text-left">
        <p
          className={`text-sm font-medium ${
            todo.completed
              ? 'line-through text-gray-400'
              : 'text-gray-800 group-hover:text-gray-600'
          } transition-colors`}
        >
          {todo.title}
        </p>

        {todo.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {todo.description}
          </p>
        )}
      </button>
    </div>
  );
}

function NoteCard({ note, label, onClick }) {
  const title = note.title || 'Untitled Note';
  const preview = (note.body || '').slice(0, 120);

  return (
    <button
      onClick={onClick}
      className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all flex flex-col gap-2 min-w-0"
    >
      <div
        className="h-1 w-8 rounded-full"
        style={{ backgroundColor: label ? label.color : '#e5e7eb' }}
      />

      <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>

      {preview ? (
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {preview}
        </p>
      ) : (
        <p className="text-xs text-gray-300 italic">No content</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-1">
        {label ? (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: label.color + '1a',
              color: label.color,
            }}
          >
            {label.name}
          </span>
        ) : (
          <span />
        )}

        <span className="text-xs text-gray-300">{timeAgo(note.updatedAt)}</span>
      </div>
    </button>
  );
}

const MAX_TODOS = 5;
const MAX_NOTES = 6;

export default function HomeScreen({
  notes = [],
  labels = [],
  todos = [],
  onToggleTodo = () => {},
}) {
  const navigate = useNavigate();

  const activeTodos = todos.filter((t) => !t.completed).slice(0, MAX_TODOS);

  const recentNotes = [...notes]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, MAX_NOTES);

  const greeting = getGreeting();

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{greeting}</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Here's a quick look at what's going on.
          </p>
        </div>

        <section>
          <SectionHeader
            title="To-Do"
            count={todos.filter((t) => !t.completed).length}
            to="/todos"
          />

          {activeTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-2xl text-gray-400 bg-white">
              <ClipboardList className="size-7 mb-2 opacity-30" />
              <p className="text-sm">No active tasks right now.</p>

              <button
                onClick={() => navigate('/todos')}
                className="mt-1.5 text-xs underline underline-offset-2 hover:text-gray-600 transition-colors"
              >
                Go to To-Do
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl px-4 divide-y divide-gray-100">
              {activeTodos.map((todo) => (
                <TodoRow
                  key={todo._id || todo.id}
                  todo={todo}
                  onToggle={() => onToggleTodo(todo._id || todo.id)}
                  onNavigate={() => navigate('/todos')}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            title="Recent Notes"
            count={notes.length}
            to="/notes"
          />

          {recentNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-2xl text-gray-400 bg-white">
              <StickyNote className="size-7 mb-2 opacity-30" />
              <p className="text-sm">No notes yet.</p>

              <button
                onClick={() => navigate('/notes')}
                className="mt-1.5 text-xs underline underline-offset-2 hover:text-gray-600 transition-colors"
              >
                Go to Notes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {recentNotes.map((note) => (
                <NoteCard
                  key={note._id || note.id}
                  note={note}
                  label={labels.find((l) => note.labelId && String((l._id || l.id) === note.labelId))}
                  onClick={() => navigate(`/notes?id=${note._id || note.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

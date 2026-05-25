// ToDoScreen.jsx
import { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Check,
  Trash2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';

function NewTaskModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          New Task
        </h2>

        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Title
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="What needs to get done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') onClose();
          }}
          className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-transparent mb-3"
        />

        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Description{' '}
          <span className="font-normal text-gray-400 dark:text-gray-500">
            (optional)
          </span>
        </label>
        <textarea
          placeholder="Any extra details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
          }}
          rows={3}
          className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-transparent resize-none mb-5"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!title.trim()}
            className="px-4 py-2 text-sm rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

function TodoCard({ todo, onToggle, onDelete }) {
  return (
    <div
      className={`group flex items-start gap-3 p-4 rounded-xl border transition-all ${
        todo.completed
          ? 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
      }`}
    >
      <button
        onClick={onToggle}
        className={`mt-0.5 size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          todo.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-green-400'
        }`}
        title={todo.completed ? 'Mark as active' : 'Mark as done'}
      >
        {todo.completed && (
          <Check className="size-3 text-white" strokeWidth={3} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            todo.completed
              ? 'line-through text-gray-400 dark:text-gray-600'
              : 'text-gray-800 dark:text-gray-200'
          }`}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p
            className={`text-sm mt-1 leading-snug ${
              todo.completed
                ? 'text-gray-400 dark:text-gray-600'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {todo.description}
          </p>
        )}
      </div>

      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 shrink-0"
        title="Delete task"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

function ToDoScreen({ todos, onCreateTodo, onToggleTodo, onDeleteTodo }) {
  const [showModal, setShowModal] = useState(false);
  const [doneExpanded, setDoneExpanded] = useState(true);

  const activeTodos = todos.filter((t) => !t.completed);
  const doneTodos = todos.filter((t) => t.completed);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950 min-w-0 h-full overflow-y-auto">
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 px-8 py-5 flex items-center justify-between z-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          To-Do
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
        >
          <Plus className="size-4" />
          New Task
        </button>
      </div>

      <div className="px-8 py-6 w-full max-w-2xl mx-auto flex flex-col gap-8">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
            Tasks · {activeTodos.length}
          </h2>
          {activeTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 dark:text-gray-500">
              <ClipboardList className="size-8 mb-2 opacity-40" />
              <p className="text-sm">Nothing here — enjoy the break!</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-2 text-xs underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Add your first task
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {activeTodos.map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onToggle={() => onToggleTodo(todo._id)}
                  onDelete={() => onDeleteTodo(todo._id)}
                />
              ))}
            </div>
          )}
        </section>

        {doneTodos.length > 0 && (
          <section>
            <button
              onClick={() => setDoneExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {doneExpanded ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
              Done · {doneTodos.length}
            </button>
            {doneExpanded && (
              <div className="flex flex-col gap-2">
                {doneTodos.map((todo) => (
                  <TodoCard
                    key={todo._id}
                    todo={todo}
                    onToggle={() => onToggleTodo(todo._id)}
                    onDelete={() => onDeleteTodo(todo._id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {showModal && (
        <NewTaskModal
          onAdd={onCreateTodo}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default ToDoScreen;

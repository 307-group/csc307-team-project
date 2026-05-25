// src/components/NavBar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  House,
  StickyNote,
  CheckSquare,
  Sun,
  Moon,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: House },
  { to: '/notes', label: 'Notes', Icon: StickyNote },
  { to: '/todos', label: 'To-Do', Icon: CheckSquare },
];

function NavBar({ darkMode, onToggleDark }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`${expanded ? 'w-44' : 'w-14'} shrink-0 flex flex-col h-screen transition-all duration-200 overflow-hidden`}
      style={{
        borderRight: '1px solid var(--border)',
        backgroundColor: 'var(--background)',
      }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-center h-14 shrink-0 transition-colors"
        style={{ color: 'var(--muted-foreground)' }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = 'var(--surface)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = 'transparent')
        }
        title={expanded ? 'Collapse menu' : 'Expand menu'}
      >
        {expanded ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <nav className="flex flex-col gap-1 p-2 pt-1">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors whitespace-nowrap no-underline"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--surface)' : 'transparent',
              color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
            })}
            title={!expanded ? label : undefined}
          >
            <Icon className="size-5 shrink-0" />
            {expanded && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="p-2 pb-4">
        <button
          onClick={onToggleDark}
          className="flex items-center gap-3 px-2 py-2.5 rounded-lg w-full transition-colors"
          style={{ color: 'var(--muted-foreground)' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--surface)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <Sun className="size-5 shrink-0" />
          ) : (
            <Moon className="size-5 shrink-0" />
          )}
          {expanded && (
            <span className="text-sm font-medium">
              {darkMode ? 'Light mode' : 'Dark mode'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default NavBar;

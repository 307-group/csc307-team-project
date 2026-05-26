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

function NavBar({ darkMode, onToggleDark, isLoggedIn, currentUser }) {
  function avatarColor(str) {
    const colors = [
      '#3b82f6',
      '#ef4444',
      '#22c55e',
      '#eab308',
      '#a855f7',
      '#ec4899',
      '#f97316',
      '#14b8a6',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++)
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  function getInitials(name) {
    return name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  const [expanded, setExpanded] = useState(false);

  const color =
    isLoggedIn && currentUser ? avatarColor(currentUser.email) : null;
  const initials =
    isLoggedIn && currentUser ? getInitials(currentUser.name) : null;

  return (
    <div
      className={`${expanded ? 'w-44' : 'w-14'} shrink-0 flex flex-col h-screen transition-all duration-200 overflow-hidden`}
      style={{
        borderRight: '1px solid var(--border)',
        backgroundColor: 'var(--sidebar)',
      }}
    >
      {/* Hamburger */}
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

      {/* Divider */}
      <div style={{ borderBottom: '1px solid var(--border)' }} />

      {/* Account button */}
      <NavLink
        to="/account"
        className="flex items-center gap-3 px-2 py-2.5 m-2 rounded-lg transition-colors no-underline"
        style={({ isActive }) => ({
          backgroundColor: isActive ? 'var(--surface)' : 'transparent',
          color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
        })}
        title={
          !expanded ? (isLoggedIn ? currentUser?.name : 'Account') : undefined
        }
      >
        {isLoggedIn && color ? (
          <div
            className="size-5 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: color, fontSize: '9px', fontWeight: 700 }}
          >
            {initials}
          </div>
        ) : (
          <svg
            className="size-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        )}
        {expanded && (
          <span className="text-sm font-medium whitespace-nowrap">
            {isLoggedIn ? currentUser?.name : 'Account'}
          </span>
        )}
      </NavLink>

      {/* Divider */}
      <div
        style={{ borderBottom: '1px solid var(--border)', margin: '0 0.5rem' }}
      />

      {/* Nav items */}
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

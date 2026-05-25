// src/components/NavBar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, House, StickyNote, CheckSquare } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: House },
  { to: '/notes', label: 'Notes', Icon: StickyNote },
  { to: '/todos', label: 'To-Do', Icon: CheckSquare },
];

function NavBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`${
        expanded ? 'w-44' : 'w-14'
      } shrink-0 border-r border-gray-200 bg-white flex flex-col h-screen transition-all duration-200 overflow-hidden`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-center h-14 hover:bg-gray-100 transition-colors shrink-0 text-gray-400 hover:text-gray-700"
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
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors whitespace-nowrap no-underline ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`
            }
            title={!expanded ? label : undefined}
          >
            <Icon className="size-5 shrink-0" />
            {expanded && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />
    </div>
  );
}

export default NavBar;

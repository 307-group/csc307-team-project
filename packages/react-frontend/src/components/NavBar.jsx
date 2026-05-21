// src/components/NavBar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, House, StickyNote, CheckSquare, Icon } from 'lucide-react';

function NavBar() {
  const [expanded, setExpanded] = useState(false);

  const getNavClass = ({ isActive }) =>
    `flex items-center gap-3 p-2.5 px-4 rounded-lg transition-colors w-full no-underline ${isActive ? 'bg-gray-200 text-neutral-900' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`;

  return (
    <div
      className={
        'flex flex-col items-center border-r border-gray-200 p-2.5 pt-10 gap-3 bg-[#fafafa] h-screen transition-all duration-300 ${expanded ? "w-40" : "w-16"}'
      }
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center w-full gap-3 p-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors shrink-0 text-gray-600"
      >
        <div className="w-10 flex justify-center items-center shrink-0">
          {expanded ? (
            <X size={24} className="shrink-0" />
          ) : (
            <Menu size={24} className="shrink-0" />
          )}
        </div>

        {expanded && <span className="text-sm font-medium"> </span>}
      </button>
      <NavLink to="/" className={getNavClass}>
        <div className="w-10 flex justify-center items-center shrink-0">
          <House size={24} className="shrink-0" />
        </div>
        {expanded && <span className="text-sm font-medium">HOME</span>}
      </NavLink>

      <NavLink to="/notes" className={getNavClass}>
        <div className="w-10 flex justify-center items-center shrink-0">
          <StickyNote size={24} className="shrink-0" />
        </div>
        {expanded && <span className="text-sm font-medium">NOTES</span>}
      </NavLink>

      <NavLink to="/todos" className={getNavClass}>
        <div className="w-10 flex justify-center items-center shrink-0">
          <CheckSquare size={24} className="shrink-0" />
        </div>
        {expanded && <span className="text-sm font-medium">TODOS</span>}
      </NavLink>
    </div>
  );
}

export default NavBar;

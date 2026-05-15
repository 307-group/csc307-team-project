// src/components/NavBar.jsx
import { useState } from "react";
import { Menu, X, House, StickyNote, CheckSquare } from "lucide-react";

const NAV_ITEMS = [
  { screen: "home", label: "Home", Icon: House },
  { screen: "notes", label: "Notes", Icon: StickyNote },
  { screen: "todos", label: "To-Do", Icon: CheckSquare },
];

function NavBar({ activeScreen, onNavigate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-200 flex-shrink-0 ${
        expanded ? "w-44" : "w-14"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-center h-14 w-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-200"
        aria-label="Toggle navigation"
      >
        {expanded ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {NAV_ITEMS.map(({ screen, label }) => {
          const isActive = activeScreen === screen;
          return (
            <button
              key={screen}
              onClick={() => onNavigate(screen)}
              className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-colors w-full ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              }`}
              title={!expanded ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {expanded && (
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default NavBar;
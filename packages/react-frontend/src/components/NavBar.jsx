import { Menu, House, StickyNote, CheckSquare } from "lucide-react";
import { useState } from "react";

function NavBar({ activeScreen, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const getBtnStyle = (screenName) => {
    const isActive = activeScreen === screenName;

    return {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      width: "100%",
      border: "none",
      backgroundColor: isActive ? "#e5e7eb" : "transparent",
      cursor: "pointer",
      textAlign: "left",
      borderRadius: "8px",
      color: isActive ? "#1e40af" : "#4b5563",
    };
  };

  return (
    <div
      style={{
        width: isOpen ? "170px" : "64px",
        minHeight: "100vh",
        borderRight: "1px solid #e0e1e1",
        padding: "10px",
        paddingTop: "10px",
        backgroundColor: "#f9fafb",
        transition: "width 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          width: "100%",
          border: "none",
          backgroundColor: "transparent",
          cursor: "pointer",
          borderRadius: "8px",
          color: "#4b5563",
        }}
      >
        <Menu size={24} />
        {isOpen && <span>Menu</span>}
      </button>

      <button style={getBtnStyle("home")} onClick={() => onNavigate("home")}>
        <House size={24} />
        {isOpen && <span>Home</span>}
      </button>

      <button style={getBtnStyle("notes")} onClick={() => onNavigate("notes")}>
        <StickyNote size={24} />
        {isOpen && <span>Notes</span>}
      </button>

      <button style={getBtnStyle("todo")} onClick={() => onNavigate("todo")}>
        <CheckSquare size={24} />
        {isOpen && <span>To-Do</span>}
      </button>
    </div>
  );
}

export default NavBar;
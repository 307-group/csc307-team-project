import { X, House, StickyNote, CheckSquare } from "lucide-react";

function NavBar({ activeScreen, onNavigate }) {
  const getBtnStyle = (screenName) => {
    const isActive = activeScreen === screenName;

    return {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      width: "fit-content",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      textAlign: "left",
      borderRadius: "8px",
      backgroundColor: isActive ? "#e5e7eb" : "transparent",
      color: isActive ? "#1e40af" : "#4b5563",
    };
  };
  return (
    <div
      style= {{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      border: "1px solid #e0e1e1",
      padding: "10px",
      paddingTop: "40px",
      gap: "10px",
      backgroundColor: "#f9fafb",
      height: "100vh",
      }}
    >
      {/* Menu Button */}

      {/* Home Button */}
      <button style={getBtnStyle("home")} onClick={() => onNavigate("home")}>
        <House size={24} color="black"></House>
      </button>

      {/* Notes Button */}
      <button style={getBtnStyle("notes")} onClick={() => onNavigate("notes")}>
        <StickyNote size={24} color="black"></StickyNote>
      </button>

      {/* Todo Button */}
      <button style={getBtnStyle("todo")} onClick={() => onNavigate("todo")}>
        <CheckSquare size={24} color="black"></CheckSquare>
      </button>
    </div>
  );
}
export default NavBar;

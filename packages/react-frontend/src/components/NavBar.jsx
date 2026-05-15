// src/components/NavBar.jsx
import { NavLink } from 'react-router-dom';
import { Menu, X, House, StickyNote, CheckSquare } from 'lucide-react';

function NavBar() {
  const navStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    width: 'fit-content',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    borderRadius: '8px',
    backgroundColor: isActive ? '#e5e7eb' : 'transparent',
    color: isActive ? '#171717' : '#4d4d4d',
    textDecoration: 'none',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #e0e1e1',
        padding: '10px',
        paddingTop: '40px',
        gap: '10px',
        backgroundColor: '#fafafa',
        height: '100vh'
      }}
    >
      <NavLink to="/" style={navStyle}>
        <House size={24} />
      </NavLink>

      <NavLink to="/notes" style={navStyle}>
        <StickyNote size={24} />
      </NavLink>

      <NavLink to="/todos" style={navStyle}>
        <CheckSquare size={24} />
      </NavLink>
    </div>
  );
}

export default NavBar;

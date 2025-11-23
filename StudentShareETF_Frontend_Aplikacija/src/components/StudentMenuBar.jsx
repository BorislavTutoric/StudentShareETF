import { useState } from 'react';
import { LogOut } from 'lucide-react';

function StudentMenuBar({ onLogoutClick, onMenuClick }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    'Profil',
    'Početna',
    'Obavještenja',
    'Sačuvano',
    'Akademski kalendar',
    'Savjeti',
    'Događaji',
  ];

  return (
    <div style={styles.menuBar}>
      <div style={styles.menuHeader}>
        <div style={styles.menuAvatar}>👤</div>
      </div>

      <nav style={styles.menuNav}>
        {menuItems.map((item) => (
          <button
            key={item}
            onMouseEnter={() => setHoveredItem(item)}
            onMouseLeave={() => setHoveredItem(null)}
            style={styles.menuButton}
            onClick={() => onMenuClick(item)} // poziv funkcije iz StudentPage
          >
            <span
              style={{
                ...styles.menuItem,
                ...(hoveredItem === item ? styles.menuItemActive : {}),
              }}
            >
              {item}
            </span>
          </button>
        ))}
      </nav>

      <button
        onMouseEnter={() => setHoveredItem('Odjava')}
        onMouseLeave={() => setHoveredItem(null)}
        style={styles.menuOdjavaBtn}
        onClick={onLogoutClick}
      >
        <span
          style={{
            ...styles.menuOdjava,
            ...(hoveredItem === 'Odjava' ? styles.menuOdjavaActive : {}),
          }}
        >
          <LogOut size={20} />
          Odjava
        </span>
      </button>
    </div>
  );
}

const styles = {
  menuBar: {
    width: '300px',
    backgroundColor: '#071686ff',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'fixed',
    top: '16px',
    left: '16px',
    borderRadius: '16px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    maxHeight: 'calc(100vh - 32px)',
  },

  menuHeader: {
    marginBottom: '48px',
    textAlign: 'center',
  },

  menuAvatar: {
    backgroundColor: 'white',
    borderRadius: '50%',
    width: '96px',
    height: '96px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
  },

  menuNav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  menuButton: {
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    padding: 0,
    outline: 'none',
  },

  menuItem: {
    color: 'white',
    fontWeight: 700,
    transition: 'all 0.2s',
    display: 'inline-block',
    paddingBottom: '4px',
    fontSize: '17px',
  },

  menuItemActive: {
    color: '#0ed830ff',
    borderBottom: '2px solid #22c55e',
  },

  menuOdjavaBtn: {
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    padding: 0,
    outline: 'none',
  },

  menuOdjava: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'white',
    fontWeight: 500,
    transition: 'all 0.2s',
    paddingBottom: '4px',
    fontSize: '17px',
  },

  menuOdjavaActive: {
    color: '#22c55e',
    borderBottom: '2px solid #22c55e',
  },
};

export default StudentMenuBar;

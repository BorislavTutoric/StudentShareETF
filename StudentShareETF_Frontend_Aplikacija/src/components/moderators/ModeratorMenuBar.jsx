import { useState, useMemo } from 'react';
import { LogOut, Home, Users, FileText, Bell, UserCircle, BookOpen } from 'lucide-react';

function ModeratorMenuBar({ onLogoutClick, onMenuClick }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeItem, setActiveItem] = useState('Početna');

  const getRoleDisplayName = () => {
    const role = localStorage.getItem('userRole');
    
    switch(role) {
      case 'ROLE_MODERATOR_ZA_MATERIJALE':
        return 'Moderator za materijale';
      case 'ROLE_MODERATOR_ZA_DOGAĐAJE':
        return 'Moderator za događaje';
      default:
        return 'Moderator';
    }
  };

  const menuItems = useMemo(() => {
    const role = localStorage.getItem('userRole');
    
    const baseItems = [
      { name: 'Profil', icon: UserCircle },
      { name: 'Početna', icon: Home },
      { name: 'Studentski nalozi', icon: Users },
      { name: 'Zahtjevi', icon: FileText },
    ];

    if (role === 'ROLE_MODERATOR_ZA_MATERIJALE') {
      baseItems.push({ name: 'Događaji', icon: Bell });
    } else if (role === 'ROLE_MODERATOR_ZA_DOGAĐAJE') {
      baseItems.push({ name: 'Materijali', icon: BookOpen });
    } else {
      baseItems.push({ name: 'Događaji', icon: Bell });
    }

    return baseItems;
  }, []);

  return (
    <div style={styles.menuBar}>
      <div style={styles.menuHeader}>
        <div style={styles.menuAvatar}>👤</div>
        <div style={styles.menuTitle}>{localStorage.getItem("username")}</div>
        <div style={{color: '#6366f1', fontSize: '12px', marginTop: '5px'}}>
          {getRoleDisplayName()}
        </div>
      </div>

      <nav style={styles.menuNav}>
        {menuItems.map((item) => (
          <button
            key={item.name}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              ...styles.menuButton,
              ...(activeItem === item.name ? styles.menuButtonActive : {}),
              ...(hoveredItem === item.name && activeItem !== item.name ? styles.menuButtonHover : {})
            }}
            onClick={() => {
              setActiveItem(item.name);
              onMenuClick(item.name);
            }}
          >
            <div style={styles.menuItemContainer}>
              <span style={styles.menuIcon}>
                <item.icon size={20} color={activeItem === item.name ? '#6366f1' : 'white'} />
              </span>
              <span style={{
                  ...styles.menuItem,
                  ...(activeItem === item.name ? styles.menuItemActive : {}),
                }}>
                {item.name}
              </span>
            </div>
          </button>
        ))}
      </nav>

      <button style={styles.menuOdjavaBtn} onClick={onLogoutClick}>
        <span style={styles.menuOdjava}><LogOut size={20} /> Odjava</span>
      </button>
    </div>
  );
}

const styles = {
  menuBar: {
    width: '270px',
    background: 'linear-gradient(180deg, #0a1457 0%, #1a1f6b 100%)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'fixed',
    top: '16px',
    left: '16px',
    borderRadius: '20px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    maxHeight: 'calc(100vh - 32px)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(99, 102, 241, 0.1)',
  },

  menuHeader: {
    marginBottom: '40px',
    textAlign: 'center',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(99, 102, 241, 0.2)',
  },

  menuAvatar: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '50%',
    width: '96px',
    height: '96px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  },

  menuTitle: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },

  menuNav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  menuButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    padding: '12px 16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },

  menuButtonActive: {
    background: 'rgba(99, 102, 241, 0.15)',
    borderLeft: '4px solid #6366f1',
    paddingLeft: '12px',
  },

  menuButtonHover: {
    background: 'rgba(99, 102, 241, 0.15)',
    borderLeft: '4px solid #6366f1',
    paddingLeft: '12px',
  },

  menuItemContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  menuIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    transition: 'all 0.3s ease',
  },

  menuItem: {
    color: 'white',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '15px',
    letterSpacing: '0.3px',
  },

  menuItemActive: {
    color: '#6366f1',
    fontWeight: '700',
  },

  menuOdjavaBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    padding: '12px 16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    marginTop: '20px',
    backdropFilter: 'blur(10px)',
  },

  menuOdjavaBtnHover: {
    background: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.6)',
  },

  menuOdjava: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#ffffff',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '15px',
  },

  menuOdjavaActive: {
    color: '#ef4444',
  },
};

export default ModeratorMenuBar;
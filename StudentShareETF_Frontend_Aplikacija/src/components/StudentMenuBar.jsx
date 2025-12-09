import { useState } from 'react';
import { LogOut, Home, Bell, Bookmark, Calendar, Lightbulb, Users } from 'lucide-react';

function StudentMenuBar({ onLogoutClick, onMenuClick, onHomeCLick}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { name: 'Profil', icon: '👤' },
    { name: 'Početna', icon: Home },
    { name: 'Obavještenja', icon: Bell },
    { name: 'Sačuvano', icon: Bookmark },
    { name: 'Akademski kalendar', icon: Calendar },
    { name: 'Savjeti', icon: Lightbulb },
    { name: 'Događaji', icon: Users },
  ];

  const renderIcon = (icon) => {
    if (typeof icon === 'string') return icon;
    const IconComponent = icon;
    return <IconComponent size={20} />;
  };

  return (
    <div style={styles.menuBar}>
      <div style={styles.menuHeader}>
        <div style={styles.menuAvatar}>
          👤
        </div>
        <div style={styles.menuTitle}>{localStorage.getItem("username")}</div>
      </div>

      <nav style={styles.menuNav}>
        {menuItems.map((item) => (
          <button
            key={item.name}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              ...styles.menuButton,
              ...(hoveredItem === item.name ? styles.menuButtonHover : {})
            }}
            onClick={() => {
              if(item.name === "Početna")
              {
                onMenuClick(item.name)
                onHomeCLick();
              }else{
                onMenuClick(item.name)
              }}
            } 
          >
            <div style={styles.menuItemContainer}>
              <span style={styles.menuIcon}>
                {renderIcon(item.icon)}
              </span>
              <span
                style={{
                  ...styles.menuItem,
                  ...(hoveredItem === item.name ? styles.menuItemActive : {}),
                }}
              >
                {item.name}
              </span>
            </div>
          </button>
        ))}
      </nav>

      <button
        onMouseEnter={() => setHoveredItem('Odjava')}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          ...styles.menuOdjavaBtn,
          ...(hoveredItem === 'Odjava' ? styles.menuOdjavaBtnHover : {})
        }}
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
    border: '1px solid rgba(96, 224, 22, 0.1)',
  },

  menuHeader: {
    marginBottom: '40px',
    textAlign: 'center',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(96, 224, 22, 0.2)',
  },

  menuAvatar: {
    backgroundColor: 'linear-gradient(135deg, #60e016 0%, #4ec70f 100%)',
    borderRadius: '50%',
    width: '96px',
    height: '96px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    boxShadow: '0 6px 20px rgba(96, 224, 22, 0.3)',
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

  menuButtonHover: {
    background: 'rgba(96, 224, 22, 0.15)',
    borderLeft: '4px solid #60e016',
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
    color: '#60e016',
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

export default StudentMenuBar;
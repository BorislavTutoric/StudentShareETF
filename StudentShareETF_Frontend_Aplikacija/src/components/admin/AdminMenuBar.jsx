import { useState } from 'react';
import { LogOut, Home, FileText, Clock, Calendar, Zap, User, Shield } from 'lucide-react';

function AdminMenuBar({ onLogoutClick, onMenuClick, onMaterialsSectionClick }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeItem, setActiveItem] = useState('Početna');

  const menuItems = [
    { name: 'Profil', icon: User },
    { name: 'Početna', icon: Home },
    { name: 'Materijali', icon: FileText },
    { name: 'Događaji', icon: Calendar },
    { name: 'Akademski kalendar', icon: Clock },
    { name: 'Akcije moderatora', icon: Zap },
  ];

  const renderIcon = (icon) => {
    const IconComponent = icon;
    return <IconComponent size={20} />;
  };

  return (
    <div style={styles.menuBar}>
      <div style={styles.menuHeader}>
        <div style={{
          ...styles.menuAvatar,
          position: 'relative'
        }}>
          👨‍💼
          <div style={styles.shieldBadge}>
            <Shield size={24} color="#ff6b35" strokeWidth={2.5} />
          </div>
        </div>
        <div style={styles.menuTitle}>{localStorage.getItem("username")}</div>
        <div style={styles.adminBadge}>🛡️ Admin</div>
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
                if(item.name === "Materijali"){
                  onMaterialsSectionClick();
                  onMenuClick(item.name)
                }else{
                  onMenuClick(item.name)
                }
              } 
            }   
          >
            <div style={styles.menuItemContainer}>
              <span style={{
                ...styles.menuIcon,
                ...(activeItem === item.name ? styles.menuIconActive : {})
              }}>
                {renderIcon(item.icon)}
              </span>
              <span
                style={{
                  ...styles.menuItem,
                  ...(activeItem === item.name ? styles.menuItemActive : {}),
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
    width: '270px',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 107, 53, 0.05)',
    border: '1px solid rgba(255, 107, 53, 0.15)',
  },

  menuHeader: {
    marginBottom: '40px',
    textAlign: 'center',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(255, 107, 53, 0.2)',
  },

  menuAvatar: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    borderRadius: '50%',
    width: '96px',
    height: '96px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  },

  shieldBadge: {
    position: 'absolute',
    bottom: '-8px',
    right: '-8px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '50%',
    padding: '6px',
    boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)',
    border: '2px solid rgba(255, 107, 53, 0.4)',
  },

  menuTitle: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },

  adminBadge: {
    marginTop: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ff6b35',
    textTransform: 'uppercase',
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
    background: 'rgba(255, 107, 53, 0.15)',
    borderLeft: '4px solid #ff6b35',
    paddingLeft: '12px',
  },

  menuButtonHover: {
    background: 'rgba(255, 107, 53, 0.15)',
    borderLeft: '4px solid #ff6b35',
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

  menuIconActive: {
    color: '#ff6b35',
  },

  menuItem: {
    color: 'white',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '15px',
    letterSpacing: '0.3px',
  },

  menuItemActive: {
    color: '#ff6b35',
    fontWeight: '700',
  },

  menuOdjavaBtn: {
    background: 'rgba(255, 107, 53, 0.1)',
    border: '2px solid rgba(255, 107, 53, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    padding: '12px 16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    marginTop: '20px',
    backdropFilter: 'blur(10px)',
  },

  menuOdjavaBtnHover: {
    background: 'rgba(255, 107, 53, 0.2)',
    borderColor: 'rgba(255, 107, 53, 0.6)',
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
    color: '#ff6b35',
  },
};

export default AdminMenuBar;
import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

function ModeratorWelcomeHeader() {
  const [isHovered, setIsHovered] = useState(false);
  const [moderatorName, setModeratorName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem("moderatorName") || localStorage.getItem("studentName");
    setModeratorName(name || 'Moderatore');
  }, []);

  const getRoleDisplayName = () => {
    const role = localStorage.getItem('userRole'); 
    
    switch(role) {
      case 'ROLE_MODERATOR_ZA_MATERIJALE':
        return 'MODERATOR ZA MATERIJALE';
      case 'ROLE_MODERATOR_ZA_DOGAĐAJE':
        return 'MODERATOR ZA DOGAĐAJE';
      default:
        return 'MODERATOR';
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse-shield {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
        }
      `}</style>
      
      <div 
        style={{
          ...styles.header,
          ...(isHovered ? styles.headerHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.textContainer}>
          <div style={styles.greeting}>
            <span style={styles.greetingText}>Dobrodošli nazad,</span>
            <span style={styles.namePart}>
              {moderatorName}!
            </span>
          </div>
          <div style={styles.badgeRow}>
             <p style={styles.subtitle}>StudentShareETF 🎓 • {getRoleDisplayName()}</p>
          </div>
        </div>
        
        <div 
          style={{
            ...styles.avatarContainer,
            ...(isHovered ? styles.avatarContainerHover : {})
          }}
        >
          <div 
            style={{
              ...styles.avatar,
              animation: isHovered ? 'pulse-shield 2s ease-in-out infinite' : 'none'
            }}
          >
            <span style={{ fontSize: "40px", color: "#0a1457" }}>🛡️</span>
          </div>
          <div style={{
            ...styles.avatarGlow,
            ...(isHovered ? styles.avatarGlowActive : {})
          }}></div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    perspective: '1000px',
  },

  header: {
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 50%, #2a1f5e 100%)',
    borderRadius: "16px",
    padding: "24px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },

  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },

  greeting: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'baseline',
  },

  greetingText: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#ffffff",
    letterSpacing: "0.3px",
    margin: 0,
  },

  namePart: {
    fontSize: "28px",
    fontWeight: 900,
    color: '#6366f1', // Normalna plava boja
    letterSpacing: "0.5px",
    textShadow: '0 2px 10px rgba(99, 102, 241, 0.5)',
    margin: 0,
  },

  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  subtitle: {
    color: '#6366f1',
    fontSize: "13px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "1px",
    textTransform: 'uppercase',
  },

  separator: {
    color: 'rgba(255, 255, 255, 0.3)',
  },

  avatarContainer: {
    position: 'relative',
    width: "100px",
    height: "100px",
    marginLeft: '30px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarGlow: {
    position: 'absolute',
    width: "100px",
    height: "100px",
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
    borderRadius: "50%",
    filter: 'blur(15px)',
    transition: 'all 0.4s ease',
  },

  avatarGlowActive: {
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%)',
    filter: 'blur(20px)',
  },

  avatar: {
    position: 'relative',
    zIndex: 1,
    width: "85px",
    height: "85px",
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)',
    border: '3px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  avatarContainerHover: {
    filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))',
  },
};

export default ModeratorWelcomeHeader;
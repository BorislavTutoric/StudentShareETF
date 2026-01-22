import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

function AdminWelcomeHeader() {
  const [isHovered, setIsHovered] = useState(false);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem("name");
    setAdminName(name || 'Administratore');
  }, []);

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.05) rotate(-10deg);
          }
        }
        
        @keyframes shimmer {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
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
              {adminName}
            </span>
          </div>
          <p style={styles.subtitle}>🛡️ StudentShareETF</p>
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
              animation: isHovered ? 'pulse 2s ease-in-out infinite' : 'none'
            }}
          >
            👨‍💼
          </div>
          
          <div style={{
            ...styles.shieldIcon,
            animation: isHovered ? 'shimmer 1.5s ease-in-out infinite' : 'none'
          }}>
            <Shield size={32} color="#ff6b35" strokeWidth={2.5} />
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
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    borderRadius: "16px",
    padding: "24px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 107, 53, 0.1)',
    border: '1px solid rgba(255, 107, 53, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerHover: {
    boxShadow: '0 25px 80px rgba(255, 107, 53, 0.15), inset 0 1px 0 rgba(255, 107, 53, 0.15)',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 50%, #ff6b35 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: "0.5px",
    filter: 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.3))',
    margin: 0,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: "14px",
    fontWeight: 500,
    margin: 0,
    letterSpacing: "0.5px",
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
  },
  avatarContainer: {
    position: 'relative',
    width: "110px",
    height: "110px",
    marginLeft: '30px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    width: "110px",
    height: "110px",
    background: 'radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%)',
    borderRadius: "50%",
    filter: 'blur(15px)',
    transition: 'all 0.4s ease',
  },
  avatarGlowActive: {
    background: 'radial-gradient(circle, rgba(255, 107, 53, 0.6) 0%, transparent 70%)',
    filter: 'blur(20px)',
  },
  avatar: {
    position: 'relative',
    zIndex: 1,
    width: "85px",
    height: "85px",
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 50%, #ff6b35 100%)',
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "45px",
    boxShadow: '0 15px 40px rgba(255, 107, 53, 0.4), inset -2px -2px 8px rgba(0, 0, 0, 0.2)',
    border: '3px solid rgba(255, 255, 255, 0.15)',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  shieldIcon: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    zIndex: 2,
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: "50%",
    padding: '6px',
    boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)',
    border: '2px solid rgba(255, 107, 53, 0.4)',
    transition: 'all 0.4s ease',
  },
  avatarContainerHover: {
    filter: 'drop-shadow(0 0 25px rgba(255, 107, 53, 0.5))',
  },
};

export default AdminWelcomeHeader;
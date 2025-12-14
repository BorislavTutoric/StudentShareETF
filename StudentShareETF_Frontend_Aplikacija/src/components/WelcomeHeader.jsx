import { useState, useEffect } from 'react';

function WelcomeHeader() {
  const [isHovered, setIsHovered] = useState(false);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem("studentName");
    setStudentName(name || 'Studente');
  }, []);

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(15deg);
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
              {studentName}!
            </span>
          </div>
          <p style={styles.subtitle}>StudentShareETF 🎓</p>
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
              animation: isHovered ? 'float 2s ease-in-out infinite' : 'none'
            }}
          >
            👨‍🎓
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
    border: '1px solid rgba(96, 224, 22, 0.15)',
    position: 'relative',
    overflow: 'hidden',
  },

  headerHover: {
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
    background: 'linear-gradient(135deg, #60e016 0%, #4ec70f 50%, #3db808 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: "0.5px",
    textShadow: '0 0 30px rgba(96, 224, 22, 0.3)',
    filter: 'drop-shadow(0 0 8px rgba(96, 224, 22, 0.2))',
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
    background: 'radial-gradient(circle, rgba(96, 224, 22, 0.3) 0%, transparent 70%)',
    borderRadius: "50%",
    filter: 'blur(15px)',
    transition: 'all 0.4s ease',
  },

  avatarGlowActive: {
    background: 'radial-gradient(circle, rgba(96, 224, 22, 0.6) 0%, transparent 70%)',
    filter: 'blur(20px)',
  },

  avatar: {
    position: 'relative',
    zIndex: 1,
    width: "85px",
    height: "85px",
    background: 'linear-gradient(135deg, #60e016 0%, #4ec70f 50%, #3db808 100%)',
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "45px",
    boxShadow: '0 15px 40px rgba(96, 224, 22, 0.4), inset -2px -2px 8px rgba(0, 0, 0, 0.2)',
    border: '3px solid rgba(255, 255, 255, 0.15)',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  avatarContainerHover: {
    filter: 'drop-shadow(0 0 20px rgba(96, 224, 22, 0.4))',
  },
};

export default WelcomeHeader;
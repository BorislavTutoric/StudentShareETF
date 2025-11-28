import { useState } from 'react';

function WelcomeHeader() {
  const [isHovered, setIsHovered] = useState(false);

  const getGreeting = () => {
    return "Dobrodošli nazad!";
  };

  return (
    <div style={styles.container}>
      <div 
        style={{
          ...styles.header,
          ...(isHovered ? styles.headerHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.textContainer}>
          <h1 style={styles.title}>{getGreeting()}</h1>
          <p style={styles.subtitle}>StudentShareETF 🎓</p>
        </div>
        <div 
          style={{
            ...styles.avatar,
            ...(isHovered ? styles.avatarHover : {})
          }}
        >
          👨‍🎓
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
  },

  header: {
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 50%, #2a1f5e 100%)',
    borderRadius: "16px",
    padding: "35px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: 'all 0.4s ease',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(96, 224, 22, 0.1)',
  },

  headerHover: {
    boxShadow: '0 12px 32px rgba(96, 224, 22, 0.2)',
    border: '1px solid rgba(96, 224, 22, 0.3)',
    transform: 'translateY(-2px)',
  },

  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },

  title: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "0.5px",
    background: 'linear-gradient(135deg, #60e016 0%, #4ec70f 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: "15px",
    fontWeight: 500,
    margin: 0,
    letterSpacing: "0.3px",
    transition: 'all 0.3s ease',
  },

  avatar: {
    width: "110px",
    height: "110px",
    background: 'linear-gradient(135deg, #60e016 0%, #4ec70f 100%)',
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "55px",
    boxShadow: '0 8px 20px rgba(96, 224, 22, 0.3)',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.4s ease',
    marginLeft: '30px',
  },

  avatarHover: {
    transform: 'scale(1.12) rotate(5deg)',
    boxShadow: '0 12px 30px rgba(96, 224, 22, 0.5)',
  },
};

export default WelcomeHeader;
import React from "react";

function Navbar({ onLoginClick, username }) {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <span style={styles.logoText}>ETF</span>
        </div>
        <h2 style={styles.logo}>STUDENT SHARE ETF</h2>
      </div>
      
      <div style={styles.navCenter}>
        <button style={styles.navButton}>Početna</button>
        <button style={styles.navButton}>Materijali</button>
        <button style={styles.navButton}>Događaji</button>
      </div>

      <div style={styles.navRight}>
        {!username ? (
          <button style={styles.loginButton} onClick={onLoginClick}>
            <span style={styles.userIcon}>👤</span> Prijavi se!
          </button>
        ) : (
          <span style={styles.username}>Hej, {username}</span>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "80px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    backgroundColor: "#f5f5f5",
    borderBottom: "2px solid #e0e0e0",
    zIndex: 1000,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "50px",
    height: "50px",
    backgroundColor: "#4fc3f7",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  logoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
  },
  logo: {
    margin: 0,
    fontSize: "16px",
    color: "#333",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  navCenter: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  navButton: {
    padding: "12px 32px",
    backgroundColor: "#4fc3f7",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    marginRight: "60px",
  },
  loginButton: {
    padding: "12px 28px",
    backgroundColor: "#29b6f6",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
  },
  userIcon: {
    fontSize: "18px",
  },
  username: {
    fontWeight: "600",
    color: "#333",
    fontSize: "15px",
  },
};

export default Navbar;
import React, { useState } from "react";

function Navbar({ onInitialClick, onLoginClick, onMaterialsClick, onEventsClick, username }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const navItems = [
    { label: "Početna", onClick: onInitialClick },
    { label: "Materijali", onClick: onMaterialsClick },
    { label: "Događaji", onClick: onEventsClick },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <img
            src="src/assets/logoo.png"
            alt="Logo"
            style={{ width: "90px", height: "70px", objectFit: "contain" }}
          />
        </div>
        <h2 style={styles.logo}>STUDENT SHARE ETF</h2>
      </div>

      <div style={styles.navCenter}>
        {navItems.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.navLink,
              ...(hoveredIndex === index ? styles.navLinkHover : {}),
            }}
            onClick={item.onClick}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div style={styles.navRight}>
        {!username ? (
          <button style={styles.loginButton} onClick={onLoginClick}>
            👤 Prijavi se
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
    right: 0,
    width: "100%",
    height: "100px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "50 20px",
    backgroundColor: "#06105eff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
    zIndex: 1000,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: '20px 30px'
  },
  logoIcon: {
    width: "90px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    backgroundColor: "#ffffffaa",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  logo: {
    margin: 0,
    fontSize: "20px",
    color: "white",
    fontWeight: "700",
    letterSpacing: "1px",
  },
  navCenter: {
    display: "flex",
    gap: "25px",
    alignItems: "center",
  },
  navLink: {
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "500",
    color: "white",
    padding: "10px 0",
    borderBottom: "2px solid transparent",
    position: "relative",
    transition: "all 0.3s ease",
  },
  navLinkHover: {
    color: "#0ed830ff",
    borderBottom: "2px solid #1cc30cff",
    transform: "translateY(-2px)",
    textShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: '0px 30px'
  },
  loginButton: {
    padding: "15px 25px",
    backgroundColor: "#60e016ff",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },
  username: {
    fontWeight: "600",
    color: "white",
    fontSize: "16px",
  },
};

export default Navbar;

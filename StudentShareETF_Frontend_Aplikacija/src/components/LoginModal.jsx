import React, { useState } from "react";
import { login } from "../services/authService";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
        const data = await login(username, password);
        localStorage.setItem("jwtToken", data.token);
        onLoginSuccess(username);
        onClose();
    } catch (err) {
        setError(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeIcon} onClick={onClose}>✕</button>
        
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            <svg style={styles.avatarIcon} viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Korisničko ime</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Unesite korisničko ime"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>LOZINKA</label>
            <input
              style={styles.input}
              type="password"
              placeholder="•••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#" style={styles.forgotLink}>Zaboravili ste lozinku?</a>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitButton}>
            Prijava
          </button>

          <p style={styles.registerText}>
            Prvi put ste ovdje? <a href="#" style={styles.registerLink}>Registrujte se!</a>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#d4e7f5",
    padding: "40px 30px",
    borderRadius: "12px",
    width: "360px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    position: "relative",
    textAlign: "center",
  },
  closeIcon: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#ff5252",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px",
  },
  avatar: {
    width: "90px",
    height: "90px",
    backgroundColor: "#64b5f6",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  avatarIcon: {
    width: "50px",
    height: "50px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "6px",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "14px",
    border: "2px solid #b0bec5",
    borderRadius: "8px",
    outline: "none",
    backgroundColor: "white",
    color: "#333",
    boxSizing: "border-box",
    transition: "border 0.3s ease",
  },
  forgotLink: {
    display: "block",
    fontSize: "12px",
    color: "#1976d2",
    marginTop: "6px",
    textDecoration: "none",
    textAlign: "right",
  },
  error: {
    color: "#d32f2f",
    fontSize: "13px",
    margin: "0",
    backgroundColor: "#ffebee",
    padding: "8px",
    borderRadius: "6px",
  },
  submitButton: {
    padding: "14px",
    backgroundColor: "#90a4ae",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px",
    transition: "background 0.3s ease",
  },
  registerText: {
    fontSize: "13px",
    color: "#555",
    margin: "10px 0 0 0",
  },
  registerLink: {
    color: "#1976d2",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default LoginModal;
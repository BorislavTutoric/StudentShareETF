import React, { useState } from "react";
import { login } from "../services/authService";
import RegistrationModal from "../components/RegistrationModal";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleRegistrationClick = (e) => {
    e.preventDefault();
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationClose = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
        const data = await login(username, password); 
        // data sada sadrži: { token, role, username, name }

        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("studentName", data.name);
        localStorage.setItem("userRole", data.role); // Spasavamo ulogu radi provjere u dashboardu

        // LOGIKA PREUSMJERAVANJA
        if (data.role === "ROLE_STUDENT") {
            window.location.href = "/student";
        } 
        else if (data.role === "ROLE_MODERATOR_ZA_MATERIJALE") {
            window.location.href = "/moderator/materijali";
        } 
        else if (data.role === "ROLE_MODERATOR_ZA_DOGADJAJE") {
            window.location.href = "/moderator/dogadjaji";
        }
        else {
            // Ovdje možeš dodati defaultnu rutu ako uloga nije prepoznata
            console.warn("Nepoznata uloga:", data.role);
        }

    } catch (err) {
        setError(err);
    }
};

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setShowPassword(false);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const clearUsername = () => {
    setUsername("");
  };

  const clearPassword = () => {
    setPassword("");
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleClose}>
      {isRegistrationModalOpen && (
        <RegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
        />
      )}

      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeIcon} onClick={handleClose}>✕</button>
        {/* Avatar i form */}
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
            <div style={styles.inputWrapper}>
              <input
                style={styles.input}
                type="text"
                placeholder="Unesite korisničko ime"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {username && (
                <button
                  type="button"
                  style={styles.clearButton}
                  onClick={clearUsername}
                  title="Očisti"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>LOZINKA</label>
            <div style={styles.inputWrapper}>
              <input
                style={styles.input}
                type={showPassword ? "text" : "password"}
                placeholder="•••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <button
                  type="button"
                  style={styles.clearButton}
                  onClick={clearPassword}
                  title="Očisti"
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <a href="#" style={styles.forgotLink}>Zaboravili ste lozinku?</a>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitButton}>Prijava</button>

          <p style={styles.registerText}>
            Prvi put ste ovdje?{" "}
            <a style={styles.registerLink} onClick={handleRegistrationClick}>
              Registrujte se!
            </a>
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
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
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
    paddingRight: "70px",
  },
  clearButton: {
    position: "absolute",
    right: "40px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "16px",
    color: "#999",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s ease",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    cursor: "pointer"
  },
};

export default LoginModal;
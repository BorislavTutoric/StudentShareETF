import React, { useState } from "react";
import { forgottenPasswordRequest, login } from "../services/authService";
import RegistrationModal from "../components/RegistrationModal";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [loadingForgot, setLoadingForgot] = useState(false);

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
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userRole", data.role);
      if (data.role === "ROLE_STUDENT") {
        window.location.href = "/student";
      } else if (data.role === "ROLE_ADMIN") {
        window.location.href = "/admin";
      } else if (data.role === "ROLE_MODERATOR_ZA_MATERIJALE") {
        window.location.href = "/moderator/materijali";
      } else if (data.role === "ROLE_MODERATOR_ZA_DOGAĐAJE") {
        window.location.href = "/moderator/dogadjaji";
      } else {
        console.warn("Nepoznata uloga:", data.role);
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoadingForgot(true);
    setForgotMessage("");

    try {
      const response = await forgottenPasswordRequest(forgotEmail);
      setForgotMessage(response.message);
    } catch (err) {
      setForgotMessage(err.response.data);
    } finally {
      setLoadingForgot(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setShowPassword(false);
    setError("");
    setIsForgotPassword(false);
    setForgotEmail("");
    setForgotMessage("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const clearUsername = () => setUsername("");
  const clearPassword = () => setPassword("");

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

        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            <svg style={styles.avatarIcon} viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>

        {/* LOGIN FORM */}
        {!isForgotPassword && (
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
                  <button type="button" style={styles.clearButton} onClick={clearUsername} title="Očisti">✕</button>
                )}
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Lozinka</label>
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
                  <button type="button" style={styles.clearButton} onClick={clearPassword} title="Očisti">✕</button>
                )}
                <button type="button" style={styles.eyeButton} onClick={() => setShowPassword(!showPassword)} title={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <a
                href="#"
                style={styles.forgotLink}
                onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); setError(""); }}
              >
                Zaboravili ste lozinku?
              </a>
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
        )}

        {/* FORGOT PASSWORD FORM */}
        {isForgotPassword && (
          <form onSubmit={handleForgotPasswordSubmit} style={styles.form}>
            <h3 style={{ color: "#fff", marginBottom: "10px" }}>Izmjena zaboravljene lozinke</h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email adresa</label>
              <input
                style={styles.input}
                type="email"
                placeholder="Unesite email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            {forgotMessage && <p style={styles.error}>{forgotMessage}</p>}

            <button type="submit" style={styles.submitButton} disabled={loadingForgot}>
              {loadingForgot ? "Slanje..." : "Pošalji email"}
            </button>

            <p
              style={{ ...styles.registerText, cursor: "pointer" }}
              onClick={() => {
                setIsForgotPassword(false);
                setForgotEmail("");
                setForgotMessage("");
              }}
            >
              ← Nazad na prijavu
            </p>
          </form>
        )}

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
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
    padding: "40px 30px",
    borderRadius: "20px",
    width: "360px",
    boxShadow: "0 20px 60px rgba(30, 58, 138, 0.5), 0 0 1px rgba(0, 0, 0, 0.2)",
    position: "relative",
    textAlign: "center",
    border: "2px solid #3b82f6",
  },
  closeIcon: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "#00ff00",
    border: "2px solid #00cc00",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    color: "#1e3a8a",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 255, 0, 0.3)",
  },
  avatarContainer: { display: "flex", justifyContent: "center", marginBottom: "25px" },
  avatar: {
    width: "100px",
    height: "100px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    border: "3px solid #00ff00",
  },
  avatarIcon: { width: "55px", height: "55px", color: "white" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  inputGroup: { textAlign: "left" },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "8px",
    letterSpacing: "0.5px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  input: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "14px",
    border: "2px solid #1e3a8a",
    borderRadius: "12px",
    outline: "none",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    color: "#1a1a1a",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
    paddingRight: "70px",
    fontWeight: "500",
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
    fontSize: "13px",
    color: "#00ff00",
    marginTop: "6px",
    textDecoration: "none",
    textAlign: "right",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  error: {
    color: "#00ff00",
    fontSize: "13px",
    margin: "0",
    backgroundColor: "rgba(0, 255, 0, 0.15)",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(0, 255, 0, 0.4)",
    fontWeight: "500",
  },
  submitButton: {
    padding: "14px",
    background: "linear-gradient(135deg, #00ff00 0%, #00cc00 100%)",
    color: "#1e3a8a",
    border: "2px solid #00aa00",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(0, 255, 0, 0.35)",
  },
  registerText: { fontSize: "14px", color: "#e3f2fd", margin: "10px 0 0 0" },
  registerLink: {
    color: "#00ff00",
    fontWeight: "700",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default LoginModal;

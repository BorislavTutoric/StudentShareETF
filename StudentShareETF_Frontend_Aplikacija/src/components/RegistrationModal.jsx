import React, { useState } from 'react';
import { X } from 'lucide-react';
import { checkUsername, checkEmail, registration } from "../services/authService";

function RegistrationModal({ isOpen, onClose}) {
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    studyProgram: '',
    major: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const usernameCheck = async () => {
    try {
        const data = await checkUsername(formData.username);
        if (!data.available) {
            setUsernameError("Korisničko ime je zauzeto");
            setFormData({...formData, username: ''});
        } else {
            setUsernameError("");
        }
    } catch (err) {
        console.error(err);
    }
  };

  const emailCheck = async () => {
    try {
      const data = await checkEmail(formData.email);
      if(!data.available) {
        setEmailError("Email zauzet");
        setFormData({...formData,email: ''});
      } else {
        setEmailError("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
        setPasswordError("Lozinke se ne poklapaju");
        setFormData({...formData, confirmPassword: ''});
        return; 
    } else if (formData.password.length < 8) {
        setPasswordError("Lozinka mora imati najmanje 8 karaktera");
        return;
    } else {
        setPasswordError(""); 
    }

    const missingFields = [];
    if (!formData.name) missingFields.push("ime");
    if (!formData.surname) missingFields.push("prezime");
    if (!formData.studyProgram) missingFields.push("studijski program");
    if (!formData.major) missingFields.push("smjer");
    if (!formData.email) missingFields.push("email");
    if (!formData.username) missingFields.push("korisničko ime");
    if (!formData.password) missingFields.push("lozinka");
    if (!formData.confirmPassword) missingFields.push("potvrda lozinke");

    if (missingFields.length > 0) {
        setPasswordError(`⚠️ Niste popunili sva polja: ${missingFields.join(", ")}`);
        return;
    } else {
        setPasswordError("");
    }

    try {
        const data = await registration(
            formData.name,
            formData.surname,
            formData.email,
            formData.studyProgram,
            formData.major,
            formData.username,
            formData.password
        );
        setSuccessMessage("Uspješno ste se registrovali! Verifikujte vaš email.");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 5000);
    } catch (err) {
        console.error(err);
        alert(err); 
    }
  };

  const closeSuccessMessage = () => {
    setSuccessMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.container} onClick={(e) => e.stopPropagation()}>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>

          <div style={styles.avatarContainer}>
            <div style={styles.avatarCircle}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="32" r="12" fill="white"/>
                <path d="M20 60 C20 48, 28 44, 40 44 C52 44, 60 48, 60 60" fill="white"/>
              </svg>
            </div>
          </div>

          <div style={styles.formWrapper}>
            <div style={styles.formColumns}>
              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Ime: {!formData.name && <span style={{color: '#e53935'}}>!</span>}</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="name"
                    placeholder="Unesite ime"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Prezime: {!formData.surname && <span style={{color: '#e53935'}}>!</span>}</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="surname"
                    placeholder="Unesite prezime ime"
                    value={formData.surname}
                    onChange={handleChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Studijski program: {!formData.studyProgram && <span style={{color: '#e53935'}}>!</span>}</label>
                  <select
                      style={styles.select}
                      name="studyProgram"
                      value={formData.studyProgram}
                      onChange={handleChange}
                  >
                      <option value="">Odaberite studijski program</option>
                      <option value="Računarstvo i informatika">Računarstvo i informatika</option>
                      <option value="Elektronika i telekomunikacije">Elektronika i telekomunikacije</option>
                      <option value="Elektroenergetika i automatika">Elektroenergetika i automatika</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Smjer: {!formData.major && <span style={{color: '#e53935'}}>!</span>}</label>
                  <select
                      style={styles.select}
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                  >
                      <option value="">Odaberite smjer</option>
                      <option value="Softversko inzenjerstvo">Softversko inženjerstvo</option>
                      <option value="Računarsko inzenjerstvo">Računarsko inženjerstvo</option>
                      <option value="Elektronika">Elektronika</option>
                      <option value="Telekomunikacije">Telekomunijacije</option>
                      <option value="Elektroenergetika">Elektroenergetika</option>
                      <option value="Automatika">Automatika</option>
                  </select>
                </div>
              </div>

              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email: {!formData.email && <span style={{color: '#e53935'}}>!</span>}</label>
                  <input
                    style={{...styles.input, borderColor: emailError ? '#e53935' : '#90a4ae'}}
                    type="email"
                    name="email"
                    placeholder="someone@domena.tld"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={emailCheck}
                  />
                  {emailError && <p style={styles.errorMessage}>{emailError}</p>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Korisničko ime: {!formData.username && <span style={{color: '#e53935'}}>!</span>}</label>
                  <input
                    style={{...styles.input, borderColor: usernameError ? '#e53935' : '#90a4ae'}}
                    type="text"
                    name="username"
                    placeholder="Unesite korisničko ime"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={usernameCheck}
                  />
                  {usernameError && <p style={styles.errorMessage}>{usernameError}</p>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Lozinka: {!formData.password && <span style={{color: '#e53935'}}>!</span>}</label>
                  <div style={styles.passwordInputWrapper}>
                    <input
                      style={styles.passwordInput}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="•••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                      type="button"
                      style={styles.eyeButton}
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  <p style={{
                    color: formData.password.length < 8 && formData.password.length > 0 ? '#F44336' : formData.password.length >= 8 ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)',
                    fontSize: '12px',
                    margin: '4px 0 0 0',
                    fontWeight: '500'
                  }}>
                    {formData.password.length === 0 ? 'Minimalno 8 karaktera' : formData.password.length < 8 ? `${8 - formData.password.length} karaktera nedostaje` : '✓ Lozinka je ispravna'}
                  </p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Potvrda lozinke: {!formData.confirmPassword && <span style={{color: '#e53935'}}>!</span>}</label>
                  <div style={styles.passwordInputWrapper}>
                    <input
                      style={styles.passwordInput}
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="•••••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    <button
                      type="button"
                      style={styles.eyeButton}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      title={showConfirmPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {passwordError && <p style={styles.errorMessage}>{passwordError}</p>}
                </div>

              </div>
            </div>

            <button 
              onClick={handleSubmit} 
              style={styles.submitBtn}
            >
              Registruj se!
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <button style={styles.popupCloseBtn} onClick={closeSuccessMessage}>✕</button>
            <div style={styles.popupIconContainer}>
              <svg style={styles.popupIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 style={styles.popupTitle}>Registracija uspješna!</h2>
            <p style={styles.popupMessage}>{successMessage}</p>
            <button style={styles.popupBtn} onClick={closeSuccessMessage}>
              U redu
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
    borderRadius: "20px",
    padding: "30px 45px 40px 45px",
    width: "85%",
    maxWidth: "700px",
    position: "relative",
    boxShadow: "0 20px 60px rgba(30, 58, 138, 0.5), 0 0 1px rgba(0, 0, 0, 0.2)",
    border: "2px solid #3b82f6",
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "#00ff00",
    border: "2px solid #00cc00",
    borderRadius: "50%",
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#1e3a8a",
    fontSize: "24px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 255, 0, 0.3)",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },
  avatarCircle: {
    width: "120px",
    height: "120px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    border: "3px solid #00ff00",
  },
  formWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  formColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
  },
  formColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "15px",
    color: "#ffffff",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  input: {
    padding: "14px 18px",
    border: "2px solid #1e3a8a",
    borderRadius: "12px",
    color: "#1a1a1a",
    fontSize: "15px",
    background: "rgba(255, 255, 255, 0.95)",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    fontWeight: "500",
  },
  passwordInputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    padding: "14px 50px 14px 18px",
    border: "2px solid #1e3a8a",
    borderRadius: "12px",
    color: "#1a1a1a",
    fontSize: "15px",
    background: "rgba(255, 255, 255, 0.95)",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    fontWeight: "500",
    width: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  select: {
    padding: "14px 18px",
    border: "2px solid #1e3a8a",
    borderRadius: "12px",
    fontSize: "15px",
    color: "#1a1a1a",
    background: "rgba(255, 255, 255, 0.95)",
    transition: "all 0.3s ease",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
    fontWeight: "500",
  },
  errorMessage: {
    fontSize: "13px",
    color: "#00ff00",
    margin: "4px 0 0 0",
    padding: "8px 14px",
    backgroundColor: "rgba(0, 255, 0, 0.15)",
    borderRadius: "8px",
    border: "1px solid rgba(0, 255, 0, 0.4)",
    fontWeight: "500",
  },
  submitBtn: {
    marginTop: "15px",
    padding: "16px 50px",
    background: "linear-gradient(135deg, #00ff00 0%, #00cc00 100%)",
    color: "#1e3a8a",
    border: "2px solid #00aa00",
    borderRadius: "12px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    alignSelf: "center",
    minWidth: "240px",
    boxShadow: "0 10px 30px rgba(0, 255, 0, 0.4)",
    letterSpacing: "0.5px",
  },
  submitBtnDisabled: {
    background: "linear-gradient(135deg, #b8b8b8 0%, #9d9d9d 100%)",
    cursor: "not-allowed",
    opacity: "0.6",
  },
  // Popup styles
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  popup: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
    borderRadius: "20px",
    padding: "50px 40px",
    width: "90%",
    maxWidth: "400px",
    position: "relative",
    boxShadow: "0 25px 80px rgba(30, 58, 138, 0.6), 0 0 1px rgba(0, 0, 0, 0.2)",
    border: "2px solid #3b82f6",
    textAlign: "center",
    animation: "slideIn 0.3s ease-out",
  },
  popupCloseBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "#00ff00",
    border: "2px solid #00cc00",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#1e3a8a",
    fontSize: "20px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 255, 0, 0.3)",
  },
  popupIconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  popupIcon: {
    width: "70px",
    height: "70px",
    color: "#00ff00",
    filter: "drop-shadow(0 0 10px rgba(0, 255, 0, 0.4))",
  },
  popupTitle: {
    fontSize: "24px",
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: "15px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  popupMessage: {
    fontSize: "16px",
    color: "#e3f2fd",
    marginBottom: "30px",
    lineHeight: "1.5",
  },
  popupBtn: {
    padding: "14px 40px",
    background: "linear-gradient(135deg, #00ff00 0%, #00cc00 100%)",
    color: "#1e3a8a",
    border: "2px solid #00aa00",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(0, 255, 0, 0.35)",
  },
};

export default RegistrationModal;
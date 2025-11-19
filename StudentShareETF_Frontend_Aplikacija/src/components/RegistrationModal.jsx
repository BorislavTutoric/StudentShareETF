import React, { useState } from 'react';
import { X } from 'lucide-react';
import { checkUsername, registration } from "../services/authService";

function RegistrationModal({ isOpen, onClose}) {
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
        alert("Uspješno ste se registrovali! Verifikujte vaš email.");
        onClose(); 
    } catch (err) {
        console.error(err);
        alert(err); 
    }
  };

  if (!isOpen) return null;

  return (

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
                  style={styles.input}
                  type="email"
                  name="email"
                  placeholder="someone@domena.tld"
                  value={formData.email}
                  onChange={handleChange}
                />
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
                <input
                  style={styles.input}
                  type="password"
                  name="password"
                  placeholder="•••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Potvrda lozinke: {!formData.confirmPassword && <span style={{color: '#e53935'}}>!</span>}</label>
                <input
                  style={{...styles.input, borderColor: passwordError ? '#e53935' : '#90a4ae'}}
                  type="password"
                  name="confirmPassword"
                  placeholder="•••••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
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
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    background: "linear-gradient(180deg, #b8d8f0 0%, #d4e8f7 100%)",
    borderRadius: "20px",
    padding: "40px 60px",
    width: "90%",
    maxWidth: "800px",
    position: "relative",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
  },
  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "#e57373",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  avatarCircle: {
    width: "120px",
    height: "120px",
    background: "linear-gradient(135deg, #5dade2 0%, #3498db 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
  },
  formWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  formColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
  },
  formColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#2c3e50",
    fontWeight: "500",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #90a4ae",
    borderRadius: "8px",
    color: "black",
    fontSize: "14px",
    background: "rgba(255, 255, 255, 0.7)",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    padding: "12px 16px",
    border: "1px solid #90a4ae",
    borderRadius: "8px",
    fontSize: "14px",
    color: "black",
    background: "rgba(255, 255, 255, 0.7)",
    transition: "all 0.3s ease",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  errorMessage: {
    fontSize: "13px",
    color: "#e53935",
    margin: "4px 0 0 0",
    padding: "6px 12px",
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    borderRadius: "6px",
    border: "1px solid rgba(229, 57, 53, 0.3)",
  },
  submitBtn: {
    marginTop: "10px",
    padding: "14px 40px",
    background: "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)",
    color: "#2c3e50",
    border: "2px solid #5d6d7e",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    alignSelf: "center",
    minWidth: "200px",
  },
  submitBtnDisabled: {
    background: "linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)",
    cursor: "not-allowed",
    opacity: "0.6",
  },
};

export default RegistrationModal;
import { useState } from "react";
import { updatePersonalInfo, emailChange, passwordChange } from "../services/profileService";
import { checkEmail } from "../services/authService";

function EditProfileModal({ profile, onClose, onUpdated, showToast }) {
  const [activeSection, setActiveSection] = useState(null);

  const [name, setName] = useState(profile.name);
  const [surname, setSurname] = useState(profile.surname);
  const [studyProgram, setStudyProgram] = useState(profile.studyProgram);
  const [major, setMajor] = useState(profile.major);

  const [currentEmail] = useState(profile.email);
  const [pendingEmail, setPendingEmail] = useState(profile.pendingEmail || "");
  const [newEmail, setNewEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSavePersonal = async () => {
    if (!name || !surname || !studyProgram || !major) {
      showToast("Sva polja ličnih podataka moraju biti popunjena!", "warning");
      return;
    }

    try {
      const res = await updatePersonalInfo({ name, surname, studyProgram, major });
      onUpdated(res.data);
      showToast("Lični podaci su uspješno ažurirani!", "success");
    } catch (err) {
      showToast(err.response?.data || "Greška prilikom ažuriranja ličnih podataka", "error");
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail) {
      showToast("Polje novog emaila ne može biti prazno!", "warning");
      return;
    }

    try {
      const res = await checkEmail(newEmail);
      if (!res.available) {
        showToast("Ovaj email već postoji u sistemu!", "error");
        return;
      }

      await emailChange(newEmail);
      setPendingEmail(newEmail);
      showToast("Verifikacioni email je poslan. Provjerite inbox.", "success");
      setNewEmail("");
    } catch (err) {
      showToast(err.response?.data || "Greška pri promjeni emaila", "error");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast("Sva polja lozinke moraju biti popunjena!", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Nove lozinke se ne poklapaju!", "error");
      return;
    }

    try {
      await passwordChange(newPassword);
      showToast("Lozinka uspješno promijenjena!", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast(err.response?.data || "Greška prilikom promjene lozinke", "error");
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div style={styles.header}>
          <h2 style={styles.title}>✏️ Uredi profil</h2>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.section}>
          <div
            style={styles.sectionHeader}
            onClick={() => setActiveSection(activeSection === "personal" ? null : "personal")}
          >
            <span style={styles.sectionTitle}>Lični podaci</span>
            <span style={styles.arrow}>{activeSection === "personal" ? "▼" : "▶"}</span>
          </div>
          {activeSection === "personal" && (
            <div style={styles.sectionBody}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Ime</label>
                <input
                  style={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ime"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Prezime</label>
                <input
                  style={styles.input}
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Prezime"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Studijski program</label>
                <select
                  style={styles.select}
                  value={studyProgram}
                  onChange={(e) => setStudyProgram(e.target.value)}
                >
                  <option style={styles.option} value="">Odaberite studijski program</option>
                  <option style={styles.option} value="Računarstvo i informatika">Računarstvo i informatika</option>
                  <option style={styles.option} value="Elektronika i telekomunikacije">Elektronika i telekomunikacije</option>
                  <option style={styles.option} value="Elektroenergetika i automatika">Elektroenergetika i automatika</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Smjer</label>
                <select
                  style={styles.select}
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                >
                  <option style={styles.option} value="">Odaberite smjer</option>
                  <option style={styles.option} value="Softversko inženjerstvo">Softversko inženjerstvo</option>
                  <option style={styles.option} value="Računarsko inženjerstvo">Računarsko inženjerstvo</option>
                  <option style={styles.option} value="Elektronika">Elektronika</option>
                  <option style={styles.option} value="Telekomunikacije">Telekomunikacije</option>
                  <option style={styles.option} value="Elektroenergetika">Elektroenergetika</option>
                  <option style={styles.option} value="Automatika">Automatika</option>
                </select>
              </div>
              <button style={styles.saveButton} onClick={handleSavePersonal}>
                Sačuvaj lične podatke
              </button>
            </div>
          )}
        </div>

        <div style={styles.divider}></div>

        <div style={styles.section}>
          <div
            style={styles.sectionHeader}
            onClick={() => setActiveSection(activeSection === "email" ? null : "email")}
          >
            <span style={styles.sectionTitle}>Promjena email adrese</span>
            <span style={styles.arrow}>{activeSection === "email" ? "▼" : "▶"}</span>
          </div>
          {activeSection === "email" && (
            <div style={styles.sectionBody}>
              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Trenutni email</div>
                <div style={styles.infoValue}>{currentEmail}</div>
              </div>
              {pendingEmail && (
                <div style={styles.warningBox}>
                  <strong>⏳ Promjena u toku:</strong> {pendingEmail}
                </div>
              )}
              {!pendingEmail && (
                <>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Novi email</label>
                    <input
                      style={styles.input}
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Novi email"
                      type="email"
                    />
                  </div>
                  <button style={styles.saveButton} onClick={handleEmailChange}>
                    Pošalji verifikacioni link
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div style={styles.divider}></div>

        <div style={styles.section}>
          <div
            style={styles.sectionHeader}
            onClick={() => setActiveSection(activeSection === "password" ? null : "password")}
          >
            <span style={styles.sectionTitle}>Promjena lozinke</span>
            <span style={styles.arrow}>{activeSection === "password" ? "▼" : "▶"}</span>
          </div>
          {activeSection === "password" && (
            <div style={styles.sectionBody}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Stara lozinka</label>
                <input
                  type="password"
                  style={styles.input}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Stara lozinka"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nova lozinka</label>
                <input
                  type="password"
                  style={styles.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nova lozinka"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Potvrdi novu lozinku</label>
                <input
                  type="password"
                  style={styles.input}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Potvrdi novu lozinku"
                />
              </div>
              <button style={styles.saveButton} onClick={handlePasswordChange}>
                Promijeni lozinku
              </button>
            </div>
          )}
        </div>

        <div style={styles.divider}></div>

        <button style={styles.closeButton} onClick={onClose}>
          Zatvori
        </button>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: 'linear-gradient(135deg, #2a3f7e 0%, #1a2d5f 100%)',
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    border: '2px solid rgba(96, 224, 22, 0.3)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#ffffff",
  },
  header: {
    padding: "24px",
    background: 'rgba(96, 224, 22, 0.15)',
    color: "#ffffff",
    borderBottom: '1px solid rgba(96, 224, 22, 0.3)',
  },
  title: { 
    fontSize: "24px", 
    fontWeight: "700", 
    margin: 0, 
    letterSpacing: "0.5px",
    color: '#a3e635',
    textShadow: '0 2px 4px rgba(96, 224, 22, 0.3)',
  },
  divider: { 
    height: "1px", 
    background: 'rgba(96, 224, 22, 0.2)',
  },
  section: { padding: "0" },
  sectionHeader: { 
    padding: "20px 24px", 
    cursor: "pointer", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    transition: "background-color 0.2s ease", 
    userSelect: "none",
  },
  sectionTitle: { 
    fontSize: "16px", 
    fontWeight: "700", 
    color: '#a3e635',
    letterSpacing: '0.3px',
  },
  arrow: { 
    fontSize: "14px", 
    color: '#a3e635',
    transition: "transform 0.2s ease" 
  },
  sectionBody: { 
    padding: "0 24px 24px 24px", 
    display: "flex", 
    flexDirection: "column", 
    gap: "16px",
    background: 'rgba(96, 224, 22, 0.05)',
    borderRadius: '0 0 12px 12px',
  },
  inputGroup: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "8px" 
  },
  label: { 
    fontSize: "13px", 
    fontWeight: "700", 
    color: '#a3e635',
    textTransform: "uppercase", 
    letterSpacing: "0.8px",
  },
  input: { 
    padding: "12px 15px", 
    borderRadius: "8px", 
    border: '2px solid rgba(96, 224, 22, 0.4)',
    fontSize: "15px", 
    backgroundColor: 'rgba(96, 224, 22, 0.12)',
    color: '#e0f7e5',
    outline: "none", 
    transition: "all 0.2s ease", 
    fontWeight: "500",
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  select: { 
    padding: "12px 15px", 
    borderRadius: "8px", 
    border: '2px solid rgba(96, 224, 22, 0.4)',
    fontSize: "15px", 
    backgroundColor: 'rgba(96, 224, 22, 0.12)',
    color: '#e0f7e5',
    outline: "none", 
    cursor: "pointer", 
    fontWeight: "500",
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  infoBox: { 
    padding: "16px", 
    background: 'linear-gradient(135deg, rgba(96, 224, 22, 0.12) 0%, rgba(96, 224, 22, 0.08) 100%)',
    borderRadius: "10px", 
    border: '2px solid rgba(96, 224, 22, 0.3)',
    boxShadow: '0 2px 8px rgba(96, 224, 22, 0.1)',
  },
  infoLabel: { 
    fontSize: "12px", 
    fontWeight: "700", 
    color: '#a3e635',
    textTransform: "uppercase", 
    letterSpacing: "1px", 
    marginBottom: "8px",
  },
  infoValue: { 
    fontSize: "16px", 
    fontWeight: "600", 
    color: '#e0f7e5',
  },
  warningBox: { 
    padding: "14px 16px", 
    background: 'rgba(245, 158, 11, 0.15)',
    borderRadius: "10px", 
    border: "2px solid rgba(245, 158, 11, 0.4)", 
    fontSize: "14px", 
    color: '#fbbf24',
    fontWeight: "600",
  },
  saveButton: { 
    padding: "12px 20px", 
    border: "none", 
    borderRadius: "8px", 
    backgroundColor: '#60e016',
    color: '#0a1457',
    cursor: "pointer", 
    fontSize: "15px", 
    fontWeight: "700", 
    transition: "all 0.3s ease", 
    boxShadow: "0 4px 12px rgba(96, 224, 22, 0.3)" 
  },
  closeButton: { 
    width: "calc(100% - 48px)", 
    margin: "0 24px 24px 24px", 
    padding: "12px 20px", 
    border: "none", 
    borderRadius: "8px", 
    backgroundColor: "#ef4444", 
    color: "#ffffff", 
    cursor: "pointer", 
    fontSize: "15px", 
    fontWeight: "700", 
    transition: "all 0.3s ease", 
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" 
  },
    option: {
    backgroundColor: '#1a2d5f',
    color: '#e0f7e5',
    padding: '10px',
  },
};

export default EditProfileModal;
import { useState } from "react";
import { updatePersonalInfo, emailChange, passwordChange } from "../services/profileService";
import { checkEmail } from "../services/authService";

function EditProfileModal({ profile, onClose, onUpdated }) {
  const [activeSection, setActiveSection] = useState(null);

  const [name, setName] = useState(profile.name);
  const [surname, setSurname] = useState(profile.surname);
  const [studyProgram, setStudyProgram] = useState(profile.studyProgram);
  const [major, setMajor] = useState(profile.major);
  const [personalMessage, setPersonalMessage] = useState("");

  const [currentEmail] = useState(profile.email);
  const [pendingEmail, setPendingEmail] = useState(profile.pendingEmail || "");
  const [newEmail, setNewEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const handleSavePersonal = async () => {
    if (!name || !surname || !studyProgram || !major) {
      setPersonalMessage("⚠️ Sva polja ličnih podataka moraju biti popunjena!");
      return;
    }

    try {
      const res = await updatePersonalInfo({ name, surname, studyProgram, major });
      onUpdated(res.data);
      setPersonalMessage("✅ Lični podaci su ažurirani!");
    } catch (err) {
      setPersonalMessage(err.response?.data || "⚠️ Greška prilikom ažuriranja ličnih podataka");
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail) {
      setEmailMessage("⚠️ Polje novog emaila ne može biti prazno!");
      return;
    }

    try {
      const res = await checkEmail(newEmail);
      if (!res.available) {
        setEmailMessage("⚠️ Ovaj email već postoji u sistemu!");
        return;
      }

      await emailChange(newEmail);
      setPendingEmail(newEmail);
      setEmailMessage("✅ Verifikacioni email je poslan. Provjerite inbox.");
      setNewEmail("");
    } catch (err) {
      setEmailMessage(err.response?.data || "⚠️ Greška pri promjeni emaila");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("⚠️ Sva polja lozinke moraju biti popunjena!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("⚠️ Nove lozinke se ne poklapaju!");
      return;
    }

    try {
      await passwordChange(newPassword);
      setPasswordMessage("✅ Lozinka uspješno promijenjena!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage(err.response?.data || "⚠️ Greška prilikom promjene lozinke");
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>✏️ Uredi profil</h2>
        </div>

        <div style={styles.divider}></div>

        {/* Lični podaci */}
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
                  <option value="">Odaberite studijski program</option>
                  <option value="Računarstvo i informatika">Računarstvo i informatika</option>
                  <option value="Elektronika i telekomunikacije">Elektronika i telekomunikacije</option>
                  <option value="Elektroenergetika i automatika">Elektroenergetika i automatika</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Smjer</label>
                <select
                  style={styles.select}
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                >
                  <option value="">Odaberite smjer</option>
                  <option value="Softversko inzenjerstvo">Softversko inženjerstvo</option>
                  <option value="Računarsko inzenjerstvo">Računarsko inženjerstvo</option>
                  <option value="Elektronika">Elektronika</option>
                  <option value="Telekomunikacije">Telekomunikacije</option>
                  <option value="Elektroenergetika">Elektroenergetika</option>
                  <option value="Automatika">Automatika</option>
                </select>
              </div>
              <button style={styles.saveButton} onClick={handleSavePersonal}>
                Sačuvaj lične podatke
              </button>
              {personalMessage && (
                <div style={styles.messageBox}>{personalMessage}</div>
              )}
            </div>
          )}
        </div>

        <div style={styles.divider}></div>

        {/* Email */}
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
              {emailMessage && (
                <div style={styles.messageBox}>{emailMessage}</div>
              )}
            </div>
          )}
        </div>

        <div style={styles.divider}></div>

        {/* Lozinka */}
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
              {passwordMessage && (
                <div style={styles.messageBox}>{passwordMessage}</div>
              )}
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
    backgroundColor: "rgba(30, 58, 138, 0.4)",
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
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(30, 58, 138, 0.15)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#1E3A8A",
  },
  header: {
    padding: "30px 20px",
    background: "linear-gradient(135deg, #1E3A8A 0%, #3B5BDB 100%)",
    color: "#ffffff",
  },
  title: { fontSize: "24px", fontWeight: "600", margin: 0, letterSpacing: "-0.5px" },
  divider: { height: "1px", background: "#e5e7eb" },
  section: { padding: "0" },
  sectionHeader: { padding: "20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background-color 0.2s ease", userSelect: "none" },
  sectionTitle: { fontSize: "16px", fontWeight: "600", color: "#1E3A8A" },
  arrow: { fontSize: "12px", color: "#64748b", transition: "transform 0.2s ease" },
  sectionBody: { padding: "0 20px 20px 20px", display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { padding: "12px 15px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "15px", backgroundColor: "#f8fafc", color: "#1E3A8A", outline: "none", transition: "all 0.2s ease", fontWeight: "500" },
  select: { padding: "12px 15px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "15px", backgroundColor: "#f8fafc", color: "#1E3A8A", outline: "none", cursor: "pointer", fontWeight: "500" },
  infoBox: { padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" },
  infoLabel: { fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" },
  infoValue: { fontSize: "15px", fontWeight: "500", color: "#1E3A8A" },
  warningBox: { padding: "12px 15px", backgroundColor: "#fef3c7", borderRadius: "8px", border: "1px solid #fde047", fontSize: "14px", color: "#92400e" },
  messageBox: { padding: "12px 15px", backgroundColor: "#dbeafe", borderRadius: "8px", border: "1px solid #93c5fd", fontSize: "14px", color: "#1e40af", fontWeight: "500" },
  saveButton: { padding: "12px 20px", border: "none", borderRadius: "8px", backgroundColor: "#1E3A8A", color: "#ffffff", cursor: "pointer", fontSize: "15px", fontWeight: "600", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(30, 58, 138, 0.2)" },
  closeButton: { width: "calc(100% - 40px)", margin: "0 20px 20px 20px", padding: "12px 20px", border: "none", borderRadius: "8px", backgroundColor: "#dc2626", color: "#ffffff", cursor: "pointer", fontSize: "15px", fontWeight: "600", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(220, 38, 38, 0.2)" },
};

export default EditProfileModal;

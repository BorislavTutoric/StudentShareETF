import { useEffect, useState } from "react";
import { getProfileDetails } from "../services/profileService";
import EditProfileModal from "../components/EditProfileModal"; // putanja do modal-a

function ProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfileDetails();
      setProfile(data);
    } catch (err) {
      setError(err.message || "Greška prilikom učitavanja profila");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Učitavanje podataka...</p>
    </div>
  );

  if (error) return (
    <div style={styles.errorContainer}>
      <p style={styles.errorText}>⚠️ {error}</p>
    </div>
  );

  if (!profile) return (
    <div style={styles.emptyContainer}>
      <p style={styles.emptyText}>Nema podataka za prikaz</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            {profile.name.charAt(0)}{profile.surname.charAt(0)}
          </div>
        </div>
        <div style={styles.nameSection}>
          <h2 style={styles.name}>{profile.name} {profile.surname}</h2>
          <p style={styles.role}>{profile.role}</p>
          <p style={styles.username}>@{profile.username}</p>
        </div>
      </div>

      <div style={styles.divider}></div>

      <div style={styles.contentSection}>
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Email adresa</div>
            <div style={styles.infoValue}>{profile.email}</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Studijski program</div>
            <div style={styles.infoValue}>{profile.studyProgram}</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Smjer</div>
            <div style={styles.infoValue}>{profile.major}</div>
          </div>
        </div>
      </div>

      <div style={styles.divider}></div>

      <button
        style={styles.editButton}
        onClick={() => setIsModalOpen(true)}
      >
        <span style={styles.editIcon}>✏️</span> Uredi profil
      </button>

      {/* Modal */}
      {isModalOpen && (
        <EditProfileModal
          isOpen={isModalOpen}            // ← dodano ovdje
          profile={profile}
          onClose={() => setIsModalOpen(false)}
          onUpdated={fetchProfile}        // refresh profila nakon izmjene
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "500px",
    margin: "20px auto",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 20px rgba(30, 58, 138, 0.15)",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#1E3A8A",
  },
  header: {
    padding: "10px 20px",
    background: "#64aaf1ff",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    color: "#ffffff",
  },
  avatarContainer: { flexShrink: 0 },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(255, 255, 255, 0.5)",
  },
  nameSection: { flex: 1 },
  name: { fontSize: "24px", fontWeight: "600", margin: "0 0 5px 0", letterSpacing: "-0.5px" },
  role: { fontSize: "14px", margin: "5px 0", opacity: "0.9", fontWeight: "500" },
  username: { fontSize: "13px", margin: "5px 0 0 0", opacity: "0.85" },
  divider: { height: "1px", background: "#e5e7eb" },
  contentSection: { padding: "25px 20px" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" },
  infoCard: {
    padding: "15px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
  },
  infoLabel: { fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" },
  infoValue: { fontSize: "15px", fontWeight: "500", color: "#1E3A8A", wordBreak: "break-word" },
  editButton: {
    width: "calc(100% - 40px)",
    margin: "0 20px 20px 20px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#64aaf1ff",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(30, 58, 138, 0.2)",
  },
  editIcon: { fontSize: "16px" },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", color: "#1E3A8A" },
  spinner: { width: "40px", height: "40px", border: "4px solid #e5e7eb", borderTop: "4px solid #1E3A8A", borderRadius: "50%", animation: "spin 1s linear infinite" },
  loadingText: { marginTop: "15px", fontSize: "16px", fontWeight: "500" },
  errorContainer: { maxWidth: "500px", margin: "20px auto", padding: "20px", backgroundColor: "#fee2e2", borderRadius: "8px", border: "1px solid #fecaca" },
  errorText: { color: "#dc2626", margin: "0", fontSize: "15px", fontWeight: "500" },
  emptyContainer: { maxWidth: "500px", margin: "20px auto", padding: "40px 20px", textAlign: "center", backgroundColor: "#f0f9ff", borderRadius: "8px", border: "1px solid #bfdbfe" },
  emptyText: { color: "#1E3A8A", fontSize: "15px", margin: "0" },
};

export default ProfileDisplay;

import { useEffect, useState } from "react";
import { getProfileDetails } from "../services/profileService";
import EditProfileModal from "../components/EditProfileModal";
import Toast from "../components/Toast";

function ProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [toast, setToast] = useState(null);

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

  const showToast = (message, type = 'success', duration = 10000) => {
    setToast({ message, type });
  };

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
    <>
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsModalOpen(false)}
          onUpdated={(updatedProfile) => {
            setProfile(updatedProfile);
            fetchProfile();
          }}
          showToast={showToast}
        />
      )}

      {/* Toast Notifikacija */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "780px",
    margin: "20px auto",
    borderRadius: "20px",
    background: 'linear-gradient(135deg, #2a3f7e 0%, #1a2d5f 100%)',
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    border: '2px solid rgba(96, 224, 22, 0.3)',
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#ffffff",
  },
  header: {
    padding: "30px 24px",
    background: 'rgba(96, 224, 22, 0.15)',
    display: "flex",
    alignItems: "center",
    gap: "20px",
    color: "#ffffff",
    border: '1px solid rgba(96, 224, 22, 0.3)',
  },
  avatarContainer: { flexShrink: 0 },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: '#60e016',
    color: '#0a1457',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "700",
    border: "2px solid rgba(96, 224, 22, 0.4)",
  },
  nameSection: { flex: 1 },
  name: { 
    fontSize: "28px", 
    fontWeight: "700", 
    margin: "0 0 8px 0", 
    letterSpacing: "0.5px",
    color: '#60e016',
    textShadow: '0 2px 4px rgba(96, 224, 22, 0.3)',
  },
  role: { 
    fontSize: "15px", 
    margin: "5px 0", 
    opacity: "0.9", 
    fontWeight: "600",
    color: 'rgba(255, 255, 255, 0.8)',
  },
  username: { 
    fontSize: "14px", 
    margin: "5px 0 0 0", 
    opacity: "0.75",
    color: 'rgba(255, 255, 255, 0.6)',
  },
  divider: { 
    height: "1px", 
    background: 'rgba(96, 224, 22, 0.2)',
  },
  contentSection: { 
    padding: "25px 40px", 
    background: 'rgba(96, 224, 22, 0.05)', 
  },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" },
  infoCard: {
    padding: "18px",
    background: 'linear-gradient(135deg, rgba(96, 224, 22, 0.12) 0%, rgba(96, 224, 22, 0.08) 100%)', 
    borderRadius: "10px",
    border: '2px solid rgba(96, 224, 22, 0.3)',
    transition: "all 0.2s ease",
    boxShadow: '0 2px 8px rgba(96, 224, 22, 0.1)',
  },
  infoLabel: { 
    fontSize: "12px", 
    fontWeight: "700", 
    color: '#a3e635', 
    textTransform: "uppercase", 
    letterSpacing: "1px", 
    marginBottom: "10px",
  },
  infoValue: { 
    fontSize: "16px", 
    fontWeight: "600", 
    color: '#ffffff',
    wordBreak: "break-word" 
  },
  
  editButton: {
    width: "calc(100% - 48px)",
    margin: "0 24px 24px 24px",
    padding: "14px 20px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: '#60e016',
    color: '#0a1457',
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(96, 224, 22, 0.3)",
  },
  editIcon: { fontSize: "18px" },
  loadingContainer: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    minHeight: "300px", 
    color: "#ffffff" 
  },
  spinner: { 
    width: "40px", 
    height: "40px", 
    border: "4px solid rgba(96, 224, 22, 0.3)", 
    borderTop: "4px solid #60e016", 
    borderRadius: "50%", 
    animation: "spin 1s linear infinite" 
  },
  loadingText: { 
    marginTop: "15px", 
    fontSize: "16px", 
    fontWeight: "600",
    color: '#60e016',
  },
  errorContainer: { 
    maxWidth: "600px", 
    margin: "20px auto", 
    padding: "20px", 
    backgroundColor: "rgba(239, 68, 68, 0.1)", 
    borderRadius: "12px", 
    border: "2px solid rgba(239, 68, 68, 0.3)" 
  },
  errorText: { 
    color: "#ef4444", 
    margin: "0", 
    fontSize: "15px", 
    fontWeight: "600" 
  },
  emptyContainer: { 
    maxWidth: "600px", 
    margin: "20px auto", 
    padding: "40px 20px", 
    textAlign: "center", 
    background: 'linear-gradient(135deg, #1a2a5e 0%, #0a1457 100%)',
    borderRadius: "12px", 
    border: "2px solid rgba(96, 224, 22, 0.2)" 
  },
  emptyText: { 
    color: '#60e016',
    fontSize: "15px", 
    margin: "0",
    fontWeight: "600",
  },
};

export default ProfileDisplay;
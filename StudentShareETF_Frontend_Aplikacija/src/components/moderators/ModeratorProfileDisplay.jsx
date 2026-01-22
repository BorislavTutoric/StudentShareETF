import { useState, useEffect } from 'react';
import { Shield, Lock, X, Eye, EyeOff } from 'lucide-react';
import Toast from '../Toast';
import { passwordChange, checkPassword, getProfileDetails } from '../../services/profileService';

function ModeratorProfileDisplay() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [toast, setToast] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getRoleDisplayName = () => {
    const role = localStorage.getItem('userRole'); 
    
    switch(role) {
      case 'ROLE_MODERATOR_ZA_MATERIJALE':
        return 'MODERATOR ZA MATERIJALE';
      case 'ROLE_MODERATOR_ZA_DOGAĐAJE':
        return 'MODERATOR ZA DOGAĐAJE';
      default:
        return 'MODERATOR';
    }
  };

  const handleClose = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsModalOpen(false);
    setPasswordError("");
  }

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
        const data = await getProfileDetails();
        setProfileData(data);
    } catch (err) {
        console.log(err)
    } finally {
        setLoading(false);
    }
  };

  const passwordCheck = async () => {
    try {
      const data = await checkPassword(passwordData.currentPassword);
      if (!data) {
        setPasswordError("Netačna trenutna lozinka!");
        setPasswordData({...passwordData, currentPassword: ''});
      } else {
        setPasswordError("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      try{
        const response = await passwordChange(passwordData.currentPassword, passwordData.newPassword)
        setIsModalOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast("Lozinka uspješno izmijenjena!", 'success');
      } catch (err){
        console.log(err);
        showToast("Greška pri izmjeni lozinke", 'error');
      }
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
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

  return (
    <div style={styles.container}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        input:focus {
          border-color: rgba(99, 102, 241, 0.6) !important;
          background: rgba(99, 102, 241, 0.12) !important;
        }
      `}</style>

      <div style={styles.mainCard}>
        <div style={styles.topSection}>
          <div style={styles.avatarSection}>
            <div style={styles.avatarLarge}>
              {profileData.name.charAt(0)}{profileData.surname.charAt(0)}
            </div>
            <div style={styles.roleTag}>
              <Shield size={16} color="#6366f1" />
              <span>{getRoleDisplayName()}</span>
            </div>
          </div>

          <div style={styles.infoSection}>
            <div style={styles.nameContainer}>
              <h1 style={styles.fullName}>{profileData.name} {profileData.surname}</h1>
              <p style={styles.username}>@{profileData.username}</p>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>KORISNIČKO IME</span>
                <span style={styles.statValue}>{profileData.username}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>IME</span>
                <span style={styles.statValue}>{profileData.name}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>PREZIME</span>
                <span style={styles.statValue}>{profileData.surname}</span>
              </div>
            </div>

            <button
              style={styles.actionBtn}
              onClick={() => setIsModalOpen(true)}
            >
              <Lock size={20} />
              <span>Promjeni lozinku</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div 
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Promjeni lozinku</h2>
              <button
                style={styles.closeBtn}
                onClick={handleClose}
              >
                <X size={24} />
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <div style={styles.formField}>
                  <label style={styles.label}>Trenutna lozinka</label>
                  <div style={styles.passwordInputWrapper}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      style={styles.input}
                      placeholder="Unesite trenutnu lozinku"
                      onBlur={passwordCheck}
                    />
                    <button
                      style={styles.eyeBtn}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && <p style={styles.errorMessage}>{passwordError}</p>}
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>Nova lozinka</label>
                  <div style={styles.passwordInputWrapper}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      style={styles.input}
                      placeholder="Unesite novu lozinku"
                    />
                    <button
                      style={styles.eyeBtn}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>Potvrdi novu lozinku</label>
                  <div style={styles.passwordInputWrapper}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      style={styles.input}
                      placeholder="Potvrdite novu lozinku"
                    />
                    <button
                      style={styles.eyeBtn}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {passwordData.newPassword && passwordData.confirmPassword && 
                 passwordData.newPassword !== passwordData.confirmPassword && (
                  <div style={styles.errorMessage}>
                    Lozinke se ne poklapaju!
                  </div>
                )}
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={{...styles.modalBtn, ...styles.cancelBtn}}
                onClick={() => setIsModalOpen(false)}
              >
                Otkaži
              </button>
              <button
                style={{...styles.modalBtn, ...styles.saveBtn}}
                onClick={handlePasswordSave}
                disabled={passwordData.newPassword !== passwordData.confirmPassword || !passwordData.currentPassword}
              >
                Sačuvaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    padding: '0px',
    animation: 'slideUp 0.5s ease-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },

  mainCard: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    borderRadius: '0px',
    padding: '40px',
    boxShadow: 'none',
    border: 'none',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },

  topSection: {
    display: 'flex',
    gap: '50px',
    width: '100%',
    alignItems: 'center',
  },

  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    minWidth: '180px',
    flexShrink: 0,
  },

  avatarLarge: {
    width: '150px',
    height: '150px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
    fontWeight: '800',
    color: '#ffffff',
    boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)',
    border: '3px solid rgba(255, 255, 255, 0.15)',
    letterSpacing: '0.2px',
  },

  roleTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '12px',
    padding: '10px 16px',
    color: '#6366f1',
    fontWeight: '600',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  infoSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },

  nameContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  fullName: {
    fontSize: '40px',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '0.3px',
  },

  username: {
    fontSize: '16px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
    letterSpacing: '0.2px',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },

  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '18px',
    background: 'rgba(99, 102, 241, 0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(99, 102, 241, 0.1)',
  },

  statLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  statValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '0.2px',
  },

  actionBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 32px',
    background: '#6366f1',
    border: '2px solid #6366f1',
    borderRadius: '12px',
    cursor: 'pointer',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    letterSpacing: '0.2px',
    width: '100%',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out',
  },

  modal: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    animation: 'slideUp 0.3s ease-out',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
  },

  modalTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '0.3px',
  },

  closeBtn: {
    background: 'rgba(99, 102, 241, 0.1)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#6366f1',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },

  modalContent: {
    padding: '24px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  input: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '2px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
  },

  passwordInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    transition: 'all 0.3s ease',
  },

  errorMessage: {
    padding: '12px 16px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '10px',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.2px',
  },

  modalFooter: {
    display: 'flex',
    gap: '12px',
    padding: '24px',
    borderTop: '1px solid rgba(99, 102, 241, 0.15)',
  },

  modalBtn: {
    flex: 1,
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    letterSpacing: '0.2px',
  },

  cancelBtn: {
    background: 'rgba(99, 102, 241, 0.1)',
    border: '2px solid rgba(99, 102, 241, 0.3)',
    color: '#6366f1',
  },

  saveBtn: {
    background: 'rgba(76, 175, 80, 0.15)',
    border: '2px solid rgba(76, 175, 80, 0.3)',
    color: '#4cb050',
  },

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
    border: "4px solid rgba(99, 102, 241, 0.3)", 
    borderTop: "4px solid #6366f1", 
    borderRadius: "50%", 
    animation: "spin 1s linear infinite" 
  },
  loadingText: { 
    marginTop: "15px", 
    fontSize: "16px", 
    fontWeight: "600",
    color: '#a5b4fc',
  },
};

export default ModeratorProfileDisplay;
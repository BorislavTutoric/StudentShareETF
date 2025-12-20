import { useState, useEffect } from 'react';
import { Shield, Lock, Edit2, X, Eye, EyeOff } from 'lucide-react';
import { checkUsername } from '../../services/authService';
import Toast from '../Toast';
import { passwordChange, updatePersonalInfo, checkPassword, getProfileDetails } from '../../services/profileService';

function AdminProfileDisplay() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('info');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [toast, setToast] = useState(null);

  const [editData, setEditData] = useState(profileData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleClose = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsModalOpen(false);
    setPasswordError("");
    setUsernameError("");
  }

  const showToast = (message, type = 'success', duration = 5000) => {
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

  const usernameCheck = async () => {
    if(editData.username !== profileData.username){
      try {
        const data = await checkUsername(editData.username);
        if (!data.available) {
          setUsernameError("Korisničko ime je zauzeto");
          setEditData({...editData, username: ''});
        } else {
          setUsernameError("");
        }
      } catch (err) {
        console.error(err);
      }
    }else{
      setUsernameError("");
    }
  };
  

  const handleEdit = () => {
    setIsModalOpen(true);
    setModalTab('info');
    setEditData(profileData);
  };

  const handleSave = async () => {
    if(profileData.username === editData.username && 
      profileData.name === editData.name && profileData.surname === editData.surname){
        setIsModalOpen(false);
    }else{
      try{
        await updatePersonalInfo(editData.username, editData.name, editData.surname);
        setProfileData(editData);
        showToast("Podaci uspješno izmijenjeni", 'success');
      }catch(err){
        console.log(err);
        showToast("Greška pri izmjeni podataka!", 'error');
      }
      setIsModalOpen(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      try{
        const response = await passwordChange(passwordData.newPassword)
        setIsModalOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast("Lozinka uspješno izmijenjena!", 'success');
      } catch (err){
        console.log(err);
        showToast("Greška pri izmjeni lozinke", 'error');
      }
    }
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
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

        input:focus {
          border-color: rgba(255, 107, 53, 0.6) !important;
          background: rgba(255, 107, 53, 0.12) !important;
        }
      `}</style>

      <div style={styles.mainCard}>
        {/* Top Row - Avatar (left) and Profile Info (center) and Buttons (right) */}
        <div style={styles.topSection}>
          {/* Left - Avatar Section */}
          <div style={styles.avatarSection}>
            <div style={styles.avatarLarge}>
              {profileData.name.charAt(0)}{profileData.surname.charAt(0)}
            </div>
            <div style={styles.roleTag}>
              <Shield size={16} color="#ff6b35" />
              <span>SYSTEM ADMINISTRATOR</span>
            </div>
          </div>

          {/* Center - Profile Info */}
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

            {/* Edit Button - Below Info */}
            <button
              style={styles.actionBtn}
              onClick={handleEdit}
            >
              <Edit2 size={20} />
              <span>Uredi profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div 
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {modalTab === 'info' ? 'Izmjeni podatke' : 'Promjeni lozinku'}
              </h2>
              <button
                style={styles.closeBtn}
                onClick={handleClose}
              >
                <X size={24} />
              </button>
            </div>

            <div style={styles.modalTabs}>
              <button
                style={{
                  ...styles.tabBtn,
                  ...(modalTab === 'info' ? styles.tabBtnActive : {})
                }}
                onClick={() => setModalTab('info')}
              >
                <Edit2 size={18} />
                Osnovni podaci
              </button>
              <button
                style={{
                  ...styles.tabBtn,
                  ...(modalTab === 'password' ? styles.tabBtnActive : {})
                }}
                onClick={() => setModalTab('password')}
              >
                <Lock size={18} />
                Lozinka
              </button>
            </div>

            <div style={styles.modalContent}>
              {modalTab === 'info' ? (
                <div style={styles.formGroup}>
                  <div style={styles.formField}>
                    <label style={styles.label}>Korisničko ime</label>
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      style={styles.input}
                      placeholder="Korisničko ime"
                      onBlur={usernameCheck}
                    />
                    {usernameError && <p style={styles.errorMessage}>{usernameError}</p>}
                  </div>

                  <div style={styles.formField}>
                    <label style={styles.label}>Ime</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      style={styles.input}
                      placeholder="Ime"
                    />
                  </div>

                  <div style={styles.formField}>
                    <label style={styles.label}>Prezime</label>
                    <input
                      type="text"
                      value={editData.surname}
                      onChange={(e) => handleChange('surname', e.target.value)}
                      style={styles.input}
                      placeholder="Prezime"
                    />
                  </div>
                </div>
              ) : (
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

                  {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <div style={styles.errorMessage}>
                      Lozinke se ne poklapaju!
                    </div>
                  )}
                </div>
              )}
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
                onClick={modalTab === 'info' ? handleSave : handlePasswordSave}
                disabled={modalTab === 'password' && passwordData.newPassword !== passwordData.confirmPassword}
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
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
    fontWeight: '800',
    color: '#ffffff',
    boxShadow: '0 15px 40px rgba(255, 107, 53, 0.4)',
    border: '3px solid rgba(255, 255, 255, 0.15)',
    letterSpacing: '0.2px',
  },

  roleTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 107, 53, 0.15)',
    border: '1px solid rgba(255, 107, 53, 0.3)',
    borderRadius: '12px',
    padding: '10px 16px',
    color: '#ff6b35',
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
    background: 'rgba(255, 107, 53, 0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 107, 53, 0.1)',
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

  buttonsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '160px',
    flexShrink: 0,
  },

  actionBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 32px',
    background: '#ff6b35',
    border: '2px solid #ff6b35',
    borderRadius: '12px',
    cursor: 'pointer',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    letterSpacing: '0.2px',
    width: '100%',
  },

  passwordBtn: {
    background: 'rgba(76, 175, 80, 0.15)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
    color: '#4cb050',
  },

  // Modal Styles
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
    border: '1px solid rgba(255, 107, 53, 0.2)',
    animation: 'slideUp 0.3s ease-out',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid rgba(255, 107, 53, 0.15)',
  },

  modalTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '0.3px',
  },

  closeBtn: {
    background: 'rgba(255, 107, 53, 0.1)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#ff6b35',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },

  modalTabs: {
    display: 'flex',
    gap: '12px',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255, 107, 53, 0.1)',
  },

  tabBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'transparent',
    border: '2px solid rgba(255, 107, 53, 0.2)',
    borderRadius: '10px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.2px',
  },

  tabBtnActive: {
    background: 'rgba(255, 107, 53, 0.15)',
    borderColor: 'rgba(255, 107, 53, 0.5)',
    color: '#ff6b35',
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
    border: '2px solid rgba(255, 107, 53, 0.2)',
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
    color: '#ff6b35',
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
    borderTop: '1px solid rgba(255, 107, 53, 0.15)',
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
    background: 'rgba(255, 107, 53, 0.1)',
    border: '2px solid rgba(255, 107, 53, 0.3)',
    color: '#ff6b35',
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
    border: "4px solid rgba(96, 224, 22, 0.3)", 
    borderTop: "4px solid #dc7806ff", 
    borderRadius: "50%", 
    animation: "spin 1s linear infinite" 
  },
  loadingText: { 
    marginTop: "15px", 
    fontSize: "16px", 
    fontWeight: "600",
    color: '#ed9b0dff',
  },
};

export default AdminProfileDisplay;
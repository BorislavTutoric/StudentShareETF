import { useState } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';
import { checkUsername } from '../../services/authService';
import { createModeratorAccount } from '../../services/accountsService';

function CreateAccountModal({ isOpen, onClose, setModerators, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    password: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const usernameCheck = async () => {
    try {
        const data = await checkUsername(formData.username);
        if (!data.available) {
            setErrors({...errors, username: 'Korisničko ime je zauzeto!'})
            setFormData({...formData, username: ''});
        } else {
            setErrors({...errors, username: ''})
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleClose = () => {
    setFormData({
        name: '',
        surname: '',
        username: '',
        password: '',
        role: ''
      });
    setErrors({
        name: '',
        surname: '',
        username: '',
        password: '',
        role: '',
        submit: ''
    })
    onClose();
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ime je obavezno';
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Prezime je obavezno';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Korisničko ime je obavezno';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Lozinka je obavezna';
    }

    if (!formData.role) {
      newErrors.role = 'Vrsta naloga je obavezna';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createModeratorAccount(formData.name, formData.surname, formData.username,
        formData.password, formData.role);
      const newAccount = {
        id: response,
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        role: formData.role,
        active: true
      }
      setModerators(prev => [...prev, newAccount]);
      setFormData({
        name: '',
        surname: '',
        username: '',
        password: '',
        role: ''
      })
      onClose();
      showToast("Uspješno kreiran moderatorski nalog", 'success');
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Greška pri kreiranju naloga. Pokušaj ponovo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Dodaj moderatorski nalog</h2>
          <button style={styles.closeBtn} onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Ime */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Ime <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              style={{
                ...styles.input,
                ...(errors.name ? styles.inputError : {})
              }}
              placeholder="Unesite ime"
            />
            {errors.name && (
              <span style={styles.errorText}>{errors.name}</span>
            )}
          </div>

          {/* Prezime */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Prezime <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.surname}
              onChange={(e) => handleChange('surname', e.target.value)}
              style={{
                ...styles.input,
                ...(errors.surname ? styles.inputError : {})
              }}
              placeholder="Unesite prezime"
            />
            {errors.surname && (
              <span style={styles.errorText}>{errors.surname}</span>
            )}
          </div>

          {/* Korisničko ime */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Korisničko ime <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              style={{
                ...styles.input,
                ...(errors.username ? styles.inputError : {})
              }}
              placeholder="Unesite korisničko ime"
              onBlur={usernameCheck}
            />
            {errors.username && (
              <span style={styles.errorText}>{errors.username}</span>
            )}
          </div>

          {/* Lozinka */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Lozinka <span style={styles.required}>*</span>
            </label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                style={{
                  ...styles.input,
                  ...(errors.password ? styles.inputError : {}),
                  paddingRight: '45px'
                }}
                placeholder="Unesite lozinku"
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </div>

          {/* Vrsta naloga */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Vrsta naloga <span style={styles.required}>*</span>
            </label>
            <div style={styles.roleButtons}>
              <button
                type="button"
                style={{
                  ...styles.roleBtn,
                  ...(formData.role === 'MODERATOR_ZA_MATERIJALE' ? styles.roleBtnActive : {})
                }}
                onClick={() => handleChange('role', 'MODERATOR_ZA_MATERIJALE')}
              >
                <span style={styles.roleIcon}>📚</span>
                <span>Moderator za materijale</span>
              </button>
              <button
                type="button"
                style={{
                  ...styles.roleBtn,
                  ...(formData.role === 'MODERATOR_ZA_DOGAĐAJE' ? styles.roleBtnActive : {})
                }}
                onClick={() => handleChange('role', 'MODERATOR_ZA_DOGAĐAJE')}
              >
                <span style={styles.roleIcon}>🎉</span>
                <span>Moderator za događaje</span>
              </button>
            </div>
            {errors.role && (
              <span style={styles.errorText}>{errors.role}</span>
            )}
          </div>

          {/* Submit greška */}
          {errors.submit && (
            <div style={styles.submitError}>{errors.submit}</div>
          )}

          {/* Dugmad */}
          <div style={styles.formButtons}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Otkaži
            </button>
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                ...(isSubmitting ? styles.submitBtnDisabled : {})
              }}
              disabled={isSubmitting}
            >
              <Save size={18} />
              {isSubmitting ? 'Kreiranje...' : 'Kreiraj nalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
    padding: '20px',
  },

  modal: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    borderRadius: '16px',
    maxWidth: '480px',
    width: '100%',
    maxHeight: '85vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
    border: '2px solid rgba(255, 107, 53, 0.2)',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    borderBottom: '2px solid rgba(255, 107, 53, 0.1)',
  },

  modalTitle: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.3px',
  },

  closeBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '6px',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },

  form: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.3px',
  },

  required: {
    color: '#ff6b35',
  },

  input: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 107, 53, 0.2)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },

  inputError: {
    borderColor: '#F44336',
  },

  errorText: {
    color: '#F44336',
    fontSize: '12px',
    fontWeight: '500',
    marginTop: '4px',
  },

  passwordContainer: {
    position: 'relative',
  },

  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },

  roleButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  roleBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 107, 53, 0.2)',
    borderRadius: '10px',
    padding: '14px 16px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    textAlign: 'left',
    fontFamily: 'inherit',
  },

  roleBtnActive: {
    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(247, 166, 0, 0.1) 100%)',
    borderColor: '#ff6b35',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
  },

  roleIcon: {
    fontSize: '20px',
  },

  submitError: {
    background: 'rgba(244, 67, 54, 0.15)',
    border: '2px solid rgba(244, 67, 54, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#F44336',
    fontSize: '13px',
    fontWeight: '500',
    textAlign: 'center',
  },

  formButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },

  cancelBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: '12px 24px',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontFamily: 'inherit',
  },

  submitBtn: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },

  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};

// Demo wrapper za prikaz
function Demo() {
  const [showModal, setShowModal] = useState(true);

  const handleSuccess = (data) => {
    console.log('Kreiran moderator:', data);
    alert(`Uspješno kreiran moderator: ${data.name} ${data.surname}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {showModal && (
        <AddModeratorAccount 
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
      {!showModal && (
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            color: '#ffffff',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
          }}
        >
          Otvori formu ponovo
        </button>
      )}
    </div>
  );
}

export default CreateAccountModal;
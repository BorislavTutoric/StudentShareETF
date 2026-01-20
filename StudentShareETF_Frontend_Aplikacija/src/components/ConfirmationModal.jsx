import { CheckCircle, X } from 'lucide-react';

function ConfirmationModal({ 
  isOpen, 
  title = "Potvrda akcije", 
  message, 
  confirmText = "Potvrdi", 
  cancelText = "Otkaži",
  onConfirm, 
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onCancel}></div>
      
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <div style={styles.headerContent}>
            <div style={styles.iconContainer}>
              <CheckCircle size={24} style={{ color: '#60e016' }} />
            </div>
            <h2 style={styles.title}>{title}</h2>
          </div>
          <button 
            style={styles.closeBtn}
            onClick={onCancel}
          >
            <X size={20} />
          </button>
        </div>

        <p style={styles.message}>Jeste li sigurni da želite {message}</p>

        <div style={styles.buttonContainer}>
          <button 
            style={{
              ...styles.button,
              ...styles.cancelButton
            }}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            style={{
              ...styles.button,
              ...styles.confirmButton
            }}
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 999,
  },

  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, #0a1457 0%, #1a1f6b 100%)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(96, 224, 22, 0.1)',
    border: '1px solid rgba(96, 224, 22, 0.2)',
    maxWidth: '420px',
    width: '90%',
    zIndex: 1000,
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
  },

  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(96, 224, 22, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '0.3px',
  },

  closeBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '8px',
    color: '#ffffff',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0 0 28px 0',
    letterSpacing: '0.3px',
  },

  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },

  button: {
    border: 'none',
    borderRadius: '10px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    letterSpacing: '0.3px',
  },

  cancelButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },

  confirmButton: {
    background: 'linear-gradient(135deg, #60e016 0%, #4ec70f 100%)',
    color: '#000000',
    boxShadow: '0 8px 20px rgba(96, 224, 22, 0.3)',
  },
};

export default ConfirmationModal;
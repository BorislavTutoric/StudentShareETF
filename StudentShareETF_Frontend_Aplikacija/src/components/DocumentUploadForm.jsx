import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

function DocumentUploadForm({ isOpen, onClose}) {
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!fileName || !category) {
      alert('Molimo odaberite dokument i kategoriju!');
      return;
    }
    alert(`Dokument "${fileName}" je spremljen u kategoriji "${category}"!`);
    setFileName('');
    setCategory('');
    setDescription('');
    onClose();
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h1 style={styles.modalTitle}>📄 Dodaj novi materijal!</h1>
          <button 
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div style={styles.modalGrid}>
          <div 
            style={fileName ? {...styles.uploadArea, ...styles.uploadAreaActive} : styles.uploadArea}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#60e016'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(96, 224, 22, 0.3)'}
          >
            <input
              type="file"
              id="fileInput"
              style={styles.fileInput}
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput" style={styles.uploadLabel}>
              <Upload size={64} style={styles.uploadIcon} />
              <p style={styles.uploadText}>
                {fileName || 'Upload'}
              </p>
              {!fileName && (
                <p style={styles.uploadSubtext}>Klikni ovdje ili prevuci fajl</p>
              )}
              {fileName && (
                <p style={styles.uploadSuccess}>✓ Dokument odabran</p>
              )}
            </label>
          </div>

          <div style={styles.formSection}>
            <div>
              <label style={styles.label}>
                Kategorija:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.select}
                onFocus={(e) => e.target.style.borderColor = '#60e016'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(96, 224, 22, 0.3)'}
              >
                <option value="">Odaberi kategoriju</option>
                <option value="Predavanja">Predavanja</option>
                <option value="Vježbe">Vježbe</option>
                <option value="Rokovi">Rokovi</option>
                <option value="Ostalo">Ostalo</option>
              </select>
            </div>

            <div>
              <label style={styles.label}>
                Opis:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Unesite opis dokumenta..."
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#60e016'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(96, 224, 22, 0.3)'}
              />
            </div>
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={handleSubmit}
            style={styles.submitButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#50c012';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(96, 224, 22, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#60e016';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(96, 224, 22, 0.3)';
            }}
          >
            Sačuvaj
          </button>
        </div>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 50,
  },

  modalCard: {
    background: 'linear-gradient(135deg, #1a2a5e 0%, #0a1457 100%)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '2px solid rgba(96, 224, 22, 0.2)',
    maxWidth: '600px',
    width: '100%',
    padding: '24px',
  },

  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    background: 'rgba(96, 224, 22, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(96, 224, 22, 0.2)',
  },

  modalTitle: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '0.5px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  closeButton: {
    color: '#60e016',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
  },

  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed rgba(96, 224, 22, 0.3)',
    borderRadius: '12px',
    padding: '32px 24px',
    backgroundColor: 'rgba(26, 42, 94, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.3s',
    backdropFilter: 'blur(10px)',
  },

  uploadAreaActive: {
    backgroundColor: 'rgba(96, 224, 22, 0.05)',
    borderColor: '#60e016',
  },

  uploadLabel: {
    cursor: 'pointer',
    textAlign: 'center',
    width: '100%',
  },

  uploadIcon: {
    margin: '0 auto 12px',
    color: '#60e016',
    filter: 'drop-shadow(0 2px 4px rgba(96, 224, 22, 0.3))',
  },

  uploadText: {
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '16px',
    margin: '0 0 4px 0',
  },

  uploadSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '13px',
    margin: 0,
  },

  uploadSuccess: {
    fontSize: '14px',
    color: '#60e016',
    fontWeight: 600,
    marginTop: '8px',
    margin: 0,
  },

  fileInput: {
    display: 'none',
  },

  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  label: {
    display: 'block',
    color: '#ffffff',
    fontWeight: 600,
    marginBottom: '6px',
    fontSize: '15px',
  },

  select: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid rgba(96, 224, 22, 0.3)',
    borderRadius: '10px',
    backgroundColor: 'rgba(197, 224, 175, 1)',
    color: '#0a1457',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s',
    cursor: 'pointer',
    fontWeight: '500',
  },

  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid rgba(96, 224, 22, 0.3)',
    borderRadius: '10px',
    backgroundColor: 'rgba(197, 224, 175, 1)',
    color: '#0a1457',
    fontSize: '15px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
    fontWeight: '500',
  },

  buttonContainer: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
  },

  submitButton: {
    backgroundColor: '#60e016',
    color: '#0a1457',
    fontWeight: 700,
    fontSize: '15px',
    padding: '12px 36px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(96, 224, 22, 0.3)',
    transition: 'all 0.3s',
    letterSpacing: '0.5px',
  },
};

export default DocumentUploadForm;
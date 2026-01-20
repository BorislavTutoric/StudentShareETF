import React, { useEffect } from 'react';
import { X } from 'lucide-react';

function EventModalModeratorMaterials({ event, onClose }) {

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div style={styles.modalContent}>
          {event.slikaUrl && (
            <div style={styles.modalImageContainer}>
              <img
                src={event.slikaUrl}
                alt={event.naziv}
                style={styles.modalImage}
              />
            </div>
          )}

          <div style={styles.modalBody}>
            <h2 style={styles.modalTitle}>{event.naziv}</h2>

            <div style={styles.modalInfoGrid}>

              <div style={styles.modalInfoItem}>
                <span style={styles.modalLabel}>Datum:</span>
                <span style={styles.modalValue}>
                  {new Date(event.datumVrijeme).toLocaleDateString('sr-RS', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div style={styles.modalInfoItem}>
                <span style={styles.modalLabel}>Mjesto:</span>
                <span style={styles.modalValue}>{event.mjesto}</span>
              </div>

              <div style={styles.modalInfoItem}>
                <span style={styles.modalLabel}>Autor:</span>
                <span style={styles.modalValue}>{event.username}</span>
              </div>
            </div>

            <div style={styles.modalDescription}>
              <h3 style={styles.descriptionTitle}>Opis:</h3>
              <p style={styles.descriptionText}>{event.opis}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalBackdrop: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.75)', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 2000, 
    padding: '20px' },
  modal: { 
    position: 'relative', 
    backgroundColor: '#e0e7ff', 
    borderRadius: '10px', 
    maxWidth: '700px', 
    width: '100%', 
    maxHeight: '90vh', 
    overflowY: 'auto', 
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
  },
  closeButton: { 
    position: 'absolute', 
    top: '15px', 
    right: '15px', 
    width: '40px', 
    height: '40px', 
    borderRadius: '50%', 
    backgroundColor: '#ef4444', 
    border: 'none', 
    color: 'white', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 10, 
    transition: 'all 0.3s ease', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)', 
    padding: 0 
  },
  modalContent: { 
    width: '100%' 
  },
  modalImageContainer: { 
    width: '100%', 
    height: '300px', 
    overflow: 'hidden', 
    borderRadius: '10px 10px 0 0' 
  },
  modalImage: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' 
  },
  modalBody: { 
    padding: '30px' 
  },
  modalTitle: { 
    fontSize: '28px', 
    fontWeight: '800', 
    color: '#1f2937', 
    marginBottom: '20px', 
    lineHeight: '1.3' 
  },
  modalInfoGrid: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '15px', 
    marginBottom: '25px' 
  },
  modalInfoItem: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '5px', 
    padding: '15px', 
    backgroundColor: 'white', 
    borderRadius: '8px', 
    border: '1px solid rgba(0,0,0,0.1)' 
  },
  modalLabel: { 
    fontSize: '12px', 
    fontWeight: '600', 
    color: '#6b7280', 
    textTransform: 'uppercase', 
    letterSpacing: '0.5px' 
  },
  modalValue: { 
    fontSize: '16px', 
    fontWeight: '600', 
    color: '#1f2937' 
  },
  modalDescription: { 
    marginTop: '20px', 
    padding: '20px', 
    backgroundColor: 'white', 
    borderRadius: '8px', 
    border: '1px solid rgba(0,0,0,0.1)' 
  },
  descriptionTitle: { 
    fontSize: '18px', 
    fontWeight: '800', 
    color: '#1f2937', 
    marginBottom: '10px' 
  },
  descriptionText: { 
    fontSize: '15px', 
    lineHeight: '1.6', 
    color: '#4b5563', 
    margin: 0 
  },
};

export default EventModalModeratorMaterials;
import React, { useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { getComments, deleteEventCommentById, deleteEvent } from '../../../services/eventService';
import Toast from '../../Toast';

function EventModalModerator({ event, onClose, onEventDeleted }) {
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showDeleteEventConfirm, setShowDeleteEventConfirm] = useState(false);
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const loadData = async () => {
      try {
        setLoading(true);
        const commentsData = await getComments(event.dogadjajId);

        const sortedComments = commentsData.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setAllComments(sortedComments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [event.dogadjajId]);

  const showToast = (message, type = 'success', duration = 10000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleDeleteComment = async () => {
    if (!showDeleteCommentConfirm) return;
    
    try {
      await deleteEventCommentById(showDeleteCommentConfirm.id);
      setAllComments(prev => prev.filter(c => c.id !== showDeleteCommentConfirm.id));
      showToast('Uspješno ste obrisali komentar!', 'success');
      setShowDeleteCommentConfirm(null);
    } catch (err) {
      console.error(err);
      showToast('Greška pri brisanju komentara!', 'error');
      setShowDeleteCommentConfirm(null);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(event.dogadjajId);
      showToast('Događaj uspješno obrisan!', 'success');
      setShowDeleteEventConfirm(false);
      
      setTimeout(() => {
        if (onEventDeleted) {
          onEventDeleted(); 
        }
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      showToast('Greška pri brisanju događaja!', 'error');
      setShowDeleteEventConfirm(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.modalBackdrop}>
        <div style={styles.modal}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Učitavanje...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.modalBackdrop} onClick={handleBackdropClick}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          <X size={24} color="white" strokeWidth={2} />
        </button>

        <button 
          style={styles.deleteEventButton} 
          onClick={() => setShowDeleteEventConfirm(true)}
          title="Obriši događaj"
        >
          <Trash2 size={20} />
          <span>Obriši događaj</span>
        </button>

        <div style={styles.modalContent}>
          {event.slikaUrl && (
            <div style={styles.modalImageContainer}>
              <img src={event.slikaUrl} alt={event.naziv} style={styles.modalImage} />
            </div>
          )}

          <div style={styles.modalBody}>
            <h2 style={styles.modalTitle}>{event.naziv}</h2>

            <div style={styles.modalInfoGrid}>
              <div style={styles.modalInfoItem}>
                <span style={styles.modalLabel}>Datum:</span>
                <span style={styles.modalValue}>
                  {new Date(event.datumVrijeme).toLocaleString('sr-RS', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
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

            <div style={styles.listSection}>
              <h3 style={styles.sectionTitle}>💬 Komentari</h3>
              {allComments.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Nema komentara za ovaj događaj.</p>
                </div>
              ) : (
                <div style={styles.commentsList}>
                  {allComments.map((com) => (
                    <div key={com.id} style={styles.commentCard}>
                      <div style={styles.commentHeader}>
                        <div style={styles.avatarCircle}>
                          {com.name?.charAt(0)}{com.surname?.charAt(0)}
                        </div>
                        <div style={styles.commentMeta}>
                          <strong style={styles.commentAuthor}>
                            {com.name} {com.surname}
                          </strong>
                          <span style={styles.commentDate}>
                            {new Date(com.dateTime).toLocaleString('sr-RS')}
                          </span>
                        </div>
                        <button 
                          style={styles.deleteButton}
                          onClick={() => setShowDeleteCommentConfirm({ id: com.id, author: `${com.name} ${com.surname}` })}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.7)'}
                          title="Obriši komentar"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p style={styles.commentText}>{com.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {showDeleteEventConfirm && (
        <div style={styles.confirmOverlay} onClick={() => setShowDeleteEventConfirm(false)}>
          <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.confirmTitle}>Potvrda brisanja događaja</h3>
            <p style={styles.confirmText}>
              Da li ste sigurni da želite obrisati događaj <strong>"{event.naziv}"</strong>?
              <br /><br />
              Ova akcija je nepovratna i obrisaće sve komentare i recenzije vezane za događaj.
            </p>
            <div style={styles.confirmButtons}>
              <button 
                style={styles.confirmCancelBtn} 
                onClick={() => setShowDeleteEventConfirm(false)}
              >
                Otkaži
              </button>
              <button 
                style={styles.confirmDeleteBtn} 
                onClick={handleDeleteEvent}
              >
                Obriši događaj
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteCommentConfirm && (
        <div style={styles.confirmOverlay} onClick={() => setShowDeleteCommentConfirm(null)}>
          <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.confirmTitle}>Potvrda brisanja komentara</h3>
            <p style={styles.confirmText}>
              Da li ste sigurni da želite obrisati komentar korisnika <strong>{showDeleteCommentConfirm.author}</strong>?
              <br /><br />
              Ova akcija je nepovratna.
            </p>
            <div style={styles.confirmButtons}>
              <button 
                style={styles.confirmCancelBtn} 
                onClick={() => setShowDeleteCommentConfirm(null)}
              >
                Otkaži
              </button>
              <button 
                style={styles.confirmDeleteBtn} 
                onClick={handleDeleteComment}
              >
                Obriši komentar
              </button>
            </div>
          </div>
        </div>
      )}
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
    padding: '20px',
  },
  modal: {
    position: 'relative',
    backgroundColor: '#e0e7ff',
    borderRadius: '10px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
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
    padding: 0,
  },
  deleteEventButton: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    zIndex: 10,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(165, 180, 252, 0.3)',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '15px',
    fontSize: '16px',
    color: '#1f2937',
    fontWeight: '600',
  },
  modalContent: {
    width: '100%',
  },
  modalImageContainer: {
    width: '100%',
    height: '300px',
    overflow: 'hidden',
    borderRadius: '10px 10px 0 0',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  modalBody: {
    padding: '30px',
  },
  modalTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '20px',
    lineHeight: '1.3',
  },
  modalInfoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '25px',
  },
  modalInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.1)',
  },
  modalLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  modalValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
  },
  modalDescription: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.1)',
    marginBottom: '25px',
  },
  descriptionTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '10px',
  },
  descriptionText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#4b5563',
    margin: 0,
  },
  
  listSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.1)',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '15px',
  },
  
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  commentCard: {
    padding: '15px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  avatarCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#6366f1',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
  },
  commentMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  commentAuthor: {
    fontSize: '15px',
    color: '#1f2937',
    fontWeight: '700',
  },
  commentDate: {
    fontSize: '12px',
    color: '#6b7280',
  },
  commentText: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#4b5563',
    margin: 0,
  },

  deleteButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(239, 68, 68, 0.7)',
    cursor: 'pointer',
    padding: '4px',
    transition: 'color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '30px',
    color: '#6b7280',
  },

  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
  },
  confirmDialog: {
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 100%)',
    border: '2px solid rgba(138, 43, 226, 0.5)',
    borderRadius: '20px',
    padding: '35px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  },
  confirmTitle: {
    color: '#8a2be2',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 20px 0',
    textAlign: 'center',
  },
  confirmText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    margin: '0 0 30px 0',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  confirmButtons: {
    display: 'flex',
    gap: '15px',
  },
  confirmCancelBtn: {
    flex: 1,
    padding: '14px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  confirmDeleteBtn: {
    flex: 1,
    padding: '14px',
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    border: '2px solid #f87171',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default EventModalModerator;
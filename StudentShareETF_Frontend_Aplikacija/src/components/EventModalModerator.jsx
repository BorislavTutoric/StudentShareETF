import React, { useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { getEventComments, getEventReviews, deleteEventCommentById, deleteEvent } from '../services/eventService';
import Toast from './Toast';

function EventModalModerator({ event, onClose, onEventDeleted }) {
  const [allComments, setAllComments] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('comments');
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [toast, setToast] = useState(null);
  const [showDeleteEventConfirm, setShowDeleteEventConfirm] = useState(false);
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const loadData = async () => {
      try {
        setLoading(true);
        const commentsData = await getEventComments(event.dogadjajId);
        const reviewsData = await getEventReviews(event.dogadjajId);

        const sortedComments = commentsData.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setAllComments(sortedComments);
        
        const sortedReviews = reviewsData.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setAllReviews(sortedReviews);
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

  useEffect(() => {
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      const newAverageRating = (totalRating / allReviews.length).toFixed(1);
      setAverageRating(newAverageRating);
    } else {
      setAverageRating(0);
    }
  }, [allReviews]);

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

            <div style={styles.tabsContainer}>
              <button
                onClick={() => setActiveTab('comments')}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'comments' ? styles.activeTab : {})
                }}
              >
                💬 Komentari ({allComments.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'reviews' ? styles.activeTab : {})
                }}
              >
                ⭐ Recenzije ({allReviews.length})
              </button>
            </div>

            {activeTab === 'comments' && (
              <div style={styles.tabContent}>
                <div style={styles.listSection}>
                  <h3 style={styles.sectionTitle}>💬 Svi komentari</h3>
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
            )}

            {activeTab === 'reviews' && (
              <div style={styles.tabContent}>
                
                {allReviews.length > 0 && (
                  <div style={styles.averageRatingSection}>
                    <h3 style={styles.averageRatingTitle}>Prosječna ocjena</h3>
                    <div style={styles.averageRatingContent}>
                      <div style={styles.averageRatingNumber}>{averageRating}</div>
                      <div style={styles.averageRatingStarsWrapper}>
                        <div style={styles.averageRatingStars}>
                          {[1, 2, 3, 4, 5].map((star) => {
                            const fill = Math.min(Math.max(averageRating - star + 1, 0), 1);
                            return (
                              <span
                                key={star}
                                style={{
                                  background: `linear-gradient(90deg, #facc15 ${fill * 100}%, #d1d5db ${fill * 100}%)`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                }}
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>
                        <p style={styles.averageRatingText}>
                          na osnovu {allReviews.length} {allReviews.length === 1 ? 'ocjene' : allReviews.length < 5 ? 'ocjene' : 'ocjena'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div style={styles.listSection}>
                  <h3 style={styles.sectionTitle}>⭐ Sve recenzije</h3>

                  {allReviews.length === 0 ? (
                    <div style={styles.emptyState}>
                      <p>Nema recenzija za ovaj događaj.</p>
                    </div>
                  ) : (
                    <div style={styles.reviewsList}>
                      {allReviews.map((rev) => (
                        <div key={rev.id} style={styles.reviewCard}>
                          <div style={styles.reviewHeader}>
                            <div style={styles.avatarCircle}>
                              {rev.name?.charAt(0)}{rev.surname?.charAt(0)}
                            </div>
                            <div style={styles.reviewMeta}>
                              <strong style={styles.reviewAuthor}>
                                {rev.name} {rev.surname}
                              </strong>
                              <div style={styles.reviewStars}>
                                {'★'.repeat(rev.rating)}
                                {'☆'.repeat(5 - rev.rating)}
                              </div>
                              <span style={styles.reviewDate}>
                                {new Date(rev.dateTime).toLocaleString('sr-RS')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Potvrda za brisanje događaja */}
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

      {/* Potvrda za brisanje komentara */}
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
  
  tabsContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '30px',
    marginBottom: '20px',
  },
  tabButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '2px solid rgba(0,0,0,0.1)',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#4b5563',
  },
  activeTab: {
    backgroundColor: '#6366f1',
    color: 'white',
    borderColor: '#6366f1',
    transform: 'scale(1.02)',
  },
  
  tabContent: {
    marginTop: '20px',
  },
  
  listSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },

  averageRatingSection: {
    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    padding: '22px 26px',
    borderRadius: '14px',
    border: '2px solid #c4b5fd',
    marginBottom: '20px',
    textAlign: 'center',
    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
  },
  averageRatingTitle: {
    fontSize: '13px',
    fontWeight: '950',
    color: '#4c1d95',
    margin: '0 0 14px 0',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    textShadow: '0 2px 4px rgba(99, 102, 241, 0.1)',
    fontStyle: 'italic',
  },
  averageRatingContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '22px',
  },
  averageRatingNumber: {
    fontSize: '54px',
    fontWeight: '950',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1,
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    letterSpacing: '-2px',
    filter: 'drop-shadow(0 2px 6px rgba(99, 102, 241, 0.15))',
  },
  averageRatingStarsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  averageRatingStars: {
    fontSize: '22px',
    color: '#facc15',
    letterSpacing: '4px',
    textShadow: '0 3px 8px rgba(250, 204, 21, 0.25)',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
  },
  averageRatingText: {
    fontSize: '12px',
    color: '#5b21b6',
    margin: 0,
    fontWeight: '800',
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    letterSpacing: '0.8px',
    textTransform: 'lowercase',
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
  
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  reviewCard: {
    padding: '15px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  reviewMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  reviewAuthor: {
    fontSize: '15px',
    color: '#1f2937',
    fontWeight: '700',
  },
  reviewStars: {
    fontSize: '18px',
    color: '#facc15',
    letterSpacing: '2px',
  },
  reviewDate: {
    fontSize: '12px',
    color: '#6b7280',
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

  // Confirmation Dialog Styles
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000,
  },
  confirmDialog: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  confirmTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '15px',
    textAlign: 'center',
  },
  confirmText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#4b5563',
    marginBottom: '25px',
    textAlign: 'center',
  },
  confirmButtons: {
    display: 'flex',
    gap: '12px',
  },
  confirmCancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  confirmDeleteBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getEventComments, getEventReviews, addEventComment, addEventReview } from '../services/eventService';

function EventModalAuth({ event, onClose }) {
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('comments');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const loadData = async () => {
      try {
        setLoading(true);
        const commentsData = await getEventComments(event.dogadjajId);
        const reviewsData = await getEventReviews(event.dogadjajId);
        setComments(commentsData);
        setReviews(reviewsData);
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setSubmittingComment(true);
      const savedComment = await addEventComment(event.dogadjajId, newComment);
      setComments([savedComment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('Greška pri dodavanju komentara');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleAddReview = async (rating) => {
    try {
      setSubmittingReview(true);
      const savedReview = await addEventReview(event.dogadjajId, rating);
      setReviews([savedReview, ...reviews]);
      alert(`Uspješno ste dodali recenziju sa ${rating} zvjezdica!`);
    } catch (err) {
      console.error(err);
      alert('Greška pri dodavanju recenzije');
    } finally {
      setSubmittingReview(false);
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
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          <X size={24} />
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
                  {new Date(event.dateTime).toLocaleDateString('sr-RS', { 
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

            {/* TABOVI */}
            <div style={styles.tabsContainer}>
              <button
                onClick={() => setActiveTab('comments')}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'comments' ? styles.activeTab : {})
                }}
              >
                💬 Komentari ({comments.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'reviews' ? styles.activeTab : {})
                }}
              >
                ⭐ Recenzije ({reviews.length})
              </button>
            </div>

            {/* SADRŽAJ KOMENTARA */}
            {activeTab === 'comments' && (
              <div style={styles.tabContent}>
                {/* Forma za dodavanje komentara */}
                <div style={styles.addCommentSection}>
                  <h3 style={styles.sectionTitle}>✍️ Dodaj komentar</h3>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    style={styles.textarea}
                    placeholder="Napišite vaš komentar..."
                    disabled={submittingComment}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={submittingComment || !newComment.trim()}
                    style={{
                      ...styles.submitButton,
                      ...(submittingComment || !newComment.trim() ? styles.disabledButton : {})
                    }}
                  >
                    {submittingComment ? 'Dodavanje...' : 'Objavi komentar'}
                  </button>
                </div>

                {/* Lista komentara */}
                <div style={styles.listSection}>
                  <h3 style={styles.sectionTitle}>💬 Svi komentari</h3>
                  {comments.length === 0 ? (
                    <div style={styles.emptyState}>
                      <p>Još uvijek nema komentara.</p>
                      <p style={styles.emptyStateSubtext}>Budite prvi koji će komentarisati!</p>
                    </div>
                  ) : (
                    <div style={styles.commentsList}>
                      {comments.map((com) => (
                        <div 
                          key={com.id} 
                          style={{
                            ...styles.commentCard,
                            ...(com.isMyComment ? styles.myCommentCard : {})
                          }}
                        >
                          <div style={styles.commentHeader}>
                            <div style={{
                              ...styles.avatarCircle,
                              ...(com.isMyComment ? styles.myAvatar : {})
                            }}>
                              {com.name.charAt(0)}{com.surname.charAt(0)}
                            </div>
                            <div style={styles.commentMeta}>
                              <strong style={styles.commentAuthor}>
                                {com.name} {com.surname}
                                {com.isMyComment && <span style={styles.myBadge}> (Vi)</span>}
                              </strong>
                              <span style={styles.commentDate}>
                                {new Date(com.dateTime).toLocaleString('sr-RS')}
                              </span>
                            </div>
                          </div>
                          <p style={styles.commentText}>{com.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SADRŽAJ RECENZIJA */}
            {activeTab === 'reviews' && (
              <div style={styles.tabContent}>
                {/* Forma za dodavanje recenzije */}
                <div style={styles.addReviewSection}>
                  <h3 style={styles.sectionTitle}>⭐ Ocijenite događaj</h3>
                  <p style={styles.reviewSubtext}>Kliknite na broj zvjezdica za ocjenu:</p>
                  <div style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleAddReview(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        disabled={submittingReview}
                        style={{
                          ...styles.starButton,
                          color: star <= hoveredStar ? '#facc15' : '#d1d5db',
                          transform: star <= hoveredStar ? 'scale(1.2)' : 'scale(1)',
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {hoveredStar > 0 && (
                    <p style={styles.starLabel}>
                      {hoveredStar === 1 && '⭐ Loše'}
                      {hoveredStar === 2 && '⭐⭐ Osrednje'}
                      {hoveredStar === 3 && '⭐⭐⭐ Dobro'}
                      {hoveredStar === 4 && '⭐⭐⭐⭐ Vrlo dobro'}
                      {hoveredStar === 5 && '⭐⭐⭐⭐⭐ Odlično'}
                    </p>
                  )}
                </div>

                {/* Lista recenzija */}
                <div style={styles.listSection}>
                  <h3 style={styles.sectionTitle}>⭐ Sve recenzije</h3>
                  {reviews.length === 0 ? (
                    <div style={styles.emptyState}>
                      <p>Još uvijek nema recenzija.</p>
                      <p style={styles.emptyStateSubtext}>Budite prvi koji će ocijeniti!</p>
                    </div>
                  ) : (
                    <div style={styles.reviewsList}>
                      {reviews.map((rev, idx) => (
                        <div 
                          key={idx} 
                          style={{
                            ...styles.reviewCard,
                            ...(rev.isMyRating ? styles.myReviewCard : {})
                          }}
                        >
                          <div style={styles.reviewHeader}>
                            <div style={{
                              ...styles.avatarCircle,
                              ...(rev.isMyRating ? styles.myAvatar : {})
                            }}>
                              {rev.name.charAt(0)}{rev.surname.charAt(0)}
                            </div>
                            <div style={styles.reviewMeta}>
                              <strong style={styles.reviewAuthor}>
                                {rev.name} {rev.surname}
                                {rev.isMyRating && <span style={styles.myBadge}> (Vi)</span>}
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
    backgroundColor: '#d4f6daff',
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
    transition: 'all 0.2s ease',
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
    border: '4px solid rgba(96, 224, 22, 0.3)',
    borderTop: '4px solid #60e016',
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
    backgroundColor: '#60e016',
    color: 'white',
    borderColor: '#60e016',
    transform: 'scale(1.02)',
  },
  
  tabContent: {
    marginTop: '20px',
  },
  
  addCommentSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid rgba(0,0,0,0.1)',
  },
  addReviewSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    border: '1px solid rgba(0,0,0,0.1)',
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
  
  textarea: {
    width: '100%',
    borderRadius: '8px',
    padding: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '15px',
    marginBottom: '12px',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#60e016',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  
  starsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '5px',
    marginTop: '15px',
    marginBottom: '10px',
  },
  starButton: {
    fontSize: '48px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: '5px',
  },
  reviewSubtext: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '5px',
  },
  starLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginTop: '10px',
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
  myCommentCard: {
    backgroundColor: '#e0f7e5',
    border: '2px solid #60e016',
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
    backgroundColor: '#60e016',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
  },
  myAvatar: {
    backgroundColor: '#3ba519',
  },
  commentMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  commentAuthor: {
    fontSize: '15px',
    color: '#1f2937',
    fontWeight: '700',
  },
  myBadge: {
    color: '#60e016',
    fontSize: '13px',
    fontWeight: '800',
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
  myReviewCard: {
    backgroundColor: '#e0f7e5',
    border: '2px solid #60e016',
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
  
  emptyState: {
    textAlign: 'center',
    padding: '30px',
    color: '#6b7280',
  },
  emptyStateSubtext: {
    fontSize: '14px',
    marginTop: '5px',
    color: '#9ca3af',
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

export default EventModalAuth;
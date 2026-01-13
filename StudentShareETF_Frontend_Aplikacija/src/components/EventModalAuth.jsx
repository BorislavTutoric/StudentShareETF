import React, { useEffect, useState } from 'react';
import { X, Trash2, Flag } from 'lucide-react';
import { getEventComments, getEventReviews, addEventComment, addEventReview, deleteEventReview,
  reportEventComment,deleteEventComment } from '../services/eventService';
import Toast from './Toast';
import ConfirmationModal from './ConfirmationModal';

function EventModalAuth({ event, onClose }) {
  const [allComments, setAllComments] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [otherReviews, setOtherReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('comments');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [toast, setToast] = useState(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const loadData = async () => {
      try {
        setLoading(true);
        const commentsData = await getEventComments(event.dogadjajId);
        const reviewsData = await getEventReviews(event.dogadjajId);

        const myComments = commentsData.filter(c => c.isMyComment);
        const otherComments = commentsData
          .filter(c => !c.isMyComment)
          .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

        setAllComments([...myComments, ...otherComments]);
        setAllReviews(reviewsData);
        
        const myReviewFound = reviewsData.find(r => r.isMyRating) || null;
        const others = reviewsData.filter(r => !r.isMyRating);
        setMyReview(myReviewFound);
        setOtherReviews(others);
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
    const totalReviews = otherReviews.length + (myReview ? 1 : 0);
    if (totalReviews > 0) {
      const totalRating = otherReviews.reduce((sum, review) => sum + review.rating, 0) + (myReview ? myReview.rating : 0);
      const newAverageRating = (totalRating / totalReviews).toFixed(1);
      setAverageRating(newAverageRating);
    } else {
      setAverageRating(0);
    }
  }, [otherReviews, myReview]);

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const handleCloseConfirmModal = () => {
      setConfirmModalOpen(false);
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteEventComment(commentId);
      setAllComments(prev => prev.filter(c => c.id !== commentId));
      showToast('Uspješno ste obrisali vaš komentar!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Greška pri brisanju komentara!','error');
    }
  };

  const handleReportComment = async (commentId) => {
    try {
      await reportEventComment(commentId);
      showToast("Komentar je uspješno prijavljen!",'success');
    } catch (err) {
      console.error(err);
      showToast("Greška pri prijavljivanju komentara!",'error');
    }
  };


  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setSubmittingComment(true);
      const savedComment = await addEventComment(event.dogadjajId, newComment);
      setAllComments([savedComment, ...allComments]);
      setNewComment('');
      showToast("Komentar je uspješno dodan!",'success');
    } catch (err) {
      console.error(err);
      showToast('Greška pri dodavanju komentara.','error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleAddReview = async (rating) => {
    try {
      setSubmittingReview(true);
      const savedReview = await addEventReview(event.dogadjajId, rating);
      const newReview = {
        ...savedReview,
        isMyRating: true,
      };
      
      setAllReviews(prev => [...prev, newReview]);
      setMyReview(newReview);
      showToast(`Ocjenili ste događaj: ${event.naziv} sa ${rating} ${rating === 1 ? "zvjezdicom!" : "zvjezdica!"}`,'success');
    } catch (err) {
      console.error(err);
      showToast('Greška pri dodavanju recenzije','error');
    } finally {
      setSubmittingReview(false);
    }
  };


  const handleDeleteReview = async () => {
    try {
      await deleteEventReview(event.dogadjajId);
      
      setMyReview(null);
      setAllReviews(otherReviews);
      
      showToast(`Obrisali ste vašu recenziju za događaj: ${event.naziv}!`,'success');
    } catch (err) {
      console.error(err);
      showToast('Greška pri brisanju recenzije','error');
    }
  };

  const renderAverageStars = (rating) => {
    const ratingValue = parseFloat(rating);
    const fullStars = Math.floor(ratingValue);
    const decimal = ratingValue - fullStars;
    const stars = [];
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`}>★</span>);
    }
  
    if (decimal > 0) {
      const fillPercentage = Math.round(decimal * 100);
      stars.push(
        <span 
          key="partial" 
          style={{ 
            position: 'relative', 
            display: 'inline-block',
          }}
        >
          <span style={{ color: '#d1d5db' }}>★</span>
          <span 
            style={{ 
              position: 'absolute', 
              left: 0, 
              top: 0, 
              color: '#facc15',
              overflow: 'hidden',
              width: `${fillPercentage}%`,
            }}
          >
            ★
          </span>
        </span>
      );
    }
  
    const emptyStars = 5 - fullStars - (decimal > 0 ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`}>☆</span>);
    }
  
    return stars;
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
      <ConfirmationModal 
        isOpen={confirmModalOpen}
        onConfirm={onConfirm}
        message={message}
        onCancel={handleCloseConfirmModal}
      />
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          <X size={24} color="white" strokeWidth={2} />
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

                <div style={styles.listSection}>
                  <h3 style={styles.sectionTitle}>💬 Svi komentari</h3>
                  {allComments.length === 0 ? (
                    <div style={styles.emptyState}>
                      <p>Još uvijek nema komentara.</p>
                      <p style={styles.emptyStateSubtext}>Budite prvi koji će komentarisati!</p>
                    </div>
                  ) : (
                    <div style={styles.commentsList}>
                      {allComments.map((com) => (
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
                            {com.isMyComment ? (
                              <button 
                                style={styles.deleteButton}
                                onClick={() => {
                                    setMessage("obrisati komentar?");
                                    setOnConfirm(() => () => handleDeleteComment(com.id))
                                    setConfirmModalOpen(true)
                                  }
                                }
                                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.7)'}
                                title="Obriši komentar"
                              >
                                <Trash2 size={20} />
                              </button>
                            ) : (
                              <button 
                                style={styles.reportButton}
                                onClick={() => {
                                    setMessage(`prijaviti komentar korisnika ${com.name} ${com.surname}?`);
                                    setOnConfirm(() => () => handleReportComment(com.id))
                                    setConfirmModalOpen(true)
                                  }
                                }
                                onMouseEnter={(e) => e.currentTarget.style.color = '#f59e0b'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245, 158, 11, 0.7)'}
                                title="Prijavi komentar"
                              >
                                <Flag size={20} />
                              </button>
                            )}
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
                
                {(otherReviews.length > 0 || myReview) && (
                  <div style={styles.averageRatingSection}>
                    <h3 style={styles.averageRatingTitle}>Prosječna ocjena</h3>
                    <div style={styles.averageRatingContent}>
                      <div style={styles.averageRatingNumber}>{averageRating}</div>
                      <div style={styles.averageRatingStarsWrapper}>
                        <div style={styles.averageRatingStars}>
                          {renderAverageStars(averageRating)}
                        </div>
                        <p style={styles.averageRatingText}>
                          na osnovu {otherReviews.length + (myReview ? 1 : 0)} {otherReviews.length + (myReview ? 1 : 0) < 5 ? 'ocjene' : 'ocjena'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {myReview && (
                  <div style={styles.listSection}>
                    <h3 style={styles.sectionTitle}>Moja ocjena</h3>
                    <div style={styles.reviewsList}>
                      <div style={{...styles.reviewCard, ...styles.myReviewCard}}>
                        <div style={styles.reviewHeader}>
                          <div style={{...styles.avatarCircle, ...styles.myAvatar}}>
                            {myReview.name.charAt(0)}{myReview.surname.charAt(0)}
                          </div>
                          <div style={styles.reviewMeta}>
                            <strong style={styles.reviewAuthor}>
                              {myReview.name} {myReview.surname}
                              <span style={styles.myBadge}> (Vi)</span>
                            </strong>
                            <div style={styles.reviewStars}>
                              {'★'.repeat(myReview.rating)}
                              {'☆'.repeat(5 - myReview.rating)}
                            </div>
                            <span style={styles.reviewDate}>
                              {new Date(myReview.dateTime).toLocaleString('sr-RS')}
                            </span>
                          </div>
                          <button 
                            style={styles.deleteButton}
                            onClick={() => {
                                setMessage("obrisati recenziju?");
                                setOnConfirm(() => () => handleDeleteReview())
                                setConfirmModalOpen(true)
                              }
                            }
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.7)'}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!myReview && (
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
                )}

                  <div style={styles.listSection}>
                    <h3 style={styles.sectionTitle}>⭐ Sve recenzije</h3>

                    {otherReviews.length === 0 && !myReview && (
                      <div style={styles.emptyState}>
                        <p>Još uvijek nema recenzija.</p>
                        <p style={styles.emptyStateSubtext}>Budite prvi koji će ocijeniti!</p>
                      </div>
                    )}

                    {otherReviews.length > 0 && (
                      <div style={styles.reviewsList}>
                        {otherReviews.map((rev, idx) => (
                          <div key={idx} style={styles.reviewCard}>
                            <div style={styles.reviewHeader}>
                              <div style={styles.avatarCircle}>
                                {rev.name.charAt(0)}{rev.surname.charAt(0)}
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
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    padding: 0,
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
    marginBottom: '20px',
  },

  averageRatingSection: {
    background: 'linear-gradient(135deg, #f0fde8 0%, #e8fce0 100%)',
    padding: '22px 26px',
    borderRadius: '14px',
    border: '2px solid #d4f77d',
    marginBottom: '20px',
    textAlign: 'center',
    boxShadow: '0 6px 16px rgba(96, 224, 22, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    position: 'relative',
    overflow: 'hidden',
  },
  averageRatingTitle: {
    fontSize: '13px',
    fontWeight: '950',
    color: '#3ba519',
    margin: '0 0 14px 0',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    opacity: 1,
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    textShadow: '0 2px 4px rgba(96, 224, 22, 0.1)',
    transform: 'scale(1.02)',
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
    background: 'linear-gradient(135deg, #60e016 0%, #3ba519 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1,
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    letterSpacing: '-2px',
    filter: 'drop-shadow(0 2px 6px rgba(96, 224, 22, 0.15))',
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
    color: '#2d5016',
    margin: 0,
    fontWeight: '800',
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    letterSpacing: '0.8px',
    opacity: 1,
    textTransform: 'lowercase',
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
    flex: 1,
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
  
  reportButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(245, 158, 11, 0.7)',
    cursor: 'pointer',
    padding: '4px',
    fontSize: '20px',
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
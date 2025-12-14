import React, { useState, useEffect } from 'react';
import { Star, X, Trash2,  Flag } from 'lucide-react';
import { addCommentApi, addReview, deleteCommentApi, deleteReview, getReviews, reportCommentApi } from '../services/materialsService';

function CommentsSection({ isOpen, onClose, documentName, materialId, showToast, 
  allReviews, setAllReviews, setNewRating, allMaterialComments, setAllMaterialComments }) {

  const [otherReviews, setOtherReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [activeTab, setActiveTab] = useState('comments');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [materialComments, setMaterialComments] = useState(allMaterialComments);


  useEffect(() => {
    const newAverageRating = otherReviews.length > 0 || myReview
      ? ((otherReviews.reduce((sum, review) => sum + review.ocjena, 0) + (myReview ? myReview.ocjena : 0)) / (otherReviews.length + (myReview ? 1 : 0))).toFixed(1)
      : 0;
    setNewRating(materialId, newAverageRating);
    setAverageRating(newAverageRating);
  }, [otherReviews, myReview]);

  useEffect(() => {
    const sortedComments = allMaterialComments.sort((a, b) => {
      if (a.myComment && !b.myComment) return -1;
      if (!a.myComment && b.myComment) return 1;

      return new Date(b.datum) - new Date(a.datum);
    });
    setMaterialComments(sortedComments);
  }, [allMaterialComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setSubmittingComment(true);
      const response = await addCommentApi(materialId, newComment);
      const newCommentObj = {
        commentId: response.commentId,
        sadrzaj: newComment,
        datum: response.datum,
        name: response.name,
        surname: response.surname,
        myComment: true,
      };
      setAllMaterialComments(prevComments => [...prevComments, newCommentObj]);
      setNewComment('');
      showToast(`Dodali ste komentar za materijal: ${documentName}`, 'success')
    } catch (err) {
      console.error(err);
      showToast('Greška pri dodavanju komentara', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try{
      const response = await deleteCommentApi(commentId);
      setAllMaterialComments(allMaterialComments.filter(comment => comment.commentId !== commentId));
      showToast('Uspješno ste obrisali komentar!', 'success');
    }catch(err){
      console.error(err);
      showToast('Greška pri brisanju komentara', 'error');
    }
  };

  const handleCommentReport = async (commentId) => {
    try{
      const response = await reportCommentApi(commentId);
      showToast('Prijavili ste komentar!', 'success');
    }catch(err){
      console.error(err);
      showToast('Greška pri brisanju komentara', 'error');
    }
  }

  const handleAddReview = async (rating) => {
    try {
      setSubmittingReview(true);
      const response = await addReview(materialId, rating);

      const newReview = {
        ...response,
        isMyReview: response.myReview,
      };
      setAllReviews(prev => [...prev, newReview]);
      setMyReview(newReview);
      showToast(`Ocjenili ste materijal: ${documentName}`, 'success')
    } catch (err) {
      console.error(err);
      showToast(`Greška: ${err}`, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewTab = async () => {
    if (!Array.isArray(allReviews)) {
      console.error("Odgovor nije niz:", res);
      return;
    }

    const mappedReviews = allReviews.map(r => ({
      ...r,
      isMyReview: r.myReview, 
    }));

    const myReviewFound = mappedReviews.find(r => r.myReview) || null;
    const otherReviews = mappedReviews.filter(r => !r.myReview);

    setMyReview(myReviewFound);
    setOtherReviews(otherReviews);
  };

  const handleDeleteReview = async (materialId) => {
    try{
      const res = await deleteReview(materialId);
      setMyReview(null);
      setAllReviews(otherReviews);
      showToast(`Obrisali ste vašu recenziju za materijal: ${documentName}`, 'success')
    } catch (err) {
      console.error(err);
      showToast(`Greška: ${err}`, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
      
        <div style={styles.modalHeader}>
          <h1 style={styles.modalTitle}>💬 {documentName}</h1>
          <button 
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
            onClick={onClose}
          >
            <X size={24} />
          </button>
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
            💬 Komentari ({allMaterialComments.length})
          </button>
          <button
            onClick={() => {
                setActiveTab('reviews');
                handleReviewTab();
              }
            }
            style={{
              ...styles.tabButton,
              ...(activeTab === 'reviews' ? styles.activeTab : {})
            }}
          >
            ⭐ Recenzije ({allReviews.length})
          </button>
        </div>

        {/* KOMENTARI TAB */}
        {activeTab === 'comments' && (
          <div style={styles.tabContent}>
            {/* Forma za dodavanje komentara - UVIJEK VIDLJIVA */}
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
                onMouseEnter={(e) => {
                  if (!submittingComment && newComment.trim()) {
                    e.currentTarget.style.backgroundColor = '#50c012';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(96, 224, 22, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#60e016';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(96, 224, 22, 0.3)';
                }}
              >
                {submittingComment ? 'Dodavanje...' : 'Objavi komentar'}
              </button>
            </div>

            {/* SVI KOMENTARI - uključujući i moje */}
            <div style={styles.listSection}>
              <h3 style={styles.sectionTitle}>💬 Svi komentari</h3>
              {materialComments.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Još uvijek nema komentara.{materialComments.length}</p>
                  <p style={styles.emptyStateSubtext}>Budite prvi koji će komentarisati!</p>
                </div>
              ) : (
                <div style={styles.commentsList}>
                  {materialComments.map((comment) => (
                    <div 
                      key={comment.commentId} 
                      style={{
                        ...styles.commentCard,
                        ...(comment.myComment ? styles.myCommentCard : {})
                      }}
                    >
                      <div style={styles.commentHeader}>
                        <div style={{
                          ...styles.avatarCircle,
                          ...(comment.myComment ? styles.myAvatar : {})
                        }}>
                          {comment.name.charAt(0)}{comment.surname.charAt(0)}
                        </div>
                        <div style={styles.commentMeta}>
                          <strong style={styles.commentAuthor}>
                            {comment.name} {comment.surname}
                            {comment.myComment && <span style={styles.myBadge}> (Vi)</span>}
                          </strong>
                          <span style={styles.commentDate}>
                            {new Date(comment.datum).toLocaleString('sr-RS')}
                          </span>
                        </div>
                        {comment.myComment ? (
                          <button 
                            style={styles.deleteButton}
                            onClick={() => handleDeleteComment(comment.commentId)}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.7)'}
                          >
                            <Trash2 size={20} />
                          </button>
                        ) : (
                          <button 
                            style={styles.reportButton}
                            onClick={() => handleCommentReport(comment.commentId)}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#f59e0b'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245, 158, 11, 0.7)'}
                            title="Prijavi komentar"
                          >
                            <Flag size={20} />
                          </button>
                        )}
                      </div>
                      <p style={styles.commentText}>{comment.sadrzaj}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RECENZIJE TAB */}
        {activeTab === 'reviews' && (
          <div style={styles.tabContent}>
            
            {/* PROSJEČNA RECENZIJA */}
            {otherReviews.length > 0 && (
              <div style={styles.averageRatingSection}>
                <h3 style={styles.averageRatingTitle}>Prosječna ocjena</h3>
                <div style={styles.averageRatingContent}>
                  <div style={styles.averageRatingNumber}>{averageRating}</div>
                  <div style={styles.averageRatingStars}>
                    {'★'.repeat(Math.round(averageRating))}
                    {'☆'.repeat(5 - Math.round(averageRating))}
                  </div>
                  <p style={styles.averageRatingText}>na osnovu {otherReviews.length + (myReview ? 1 : 0)} {otherReviews.length + (myReview ? 1 : 0) < 5 ? 'ocjene' : 'ocjena'}</p>
                </div>
              </div>
            )}

            {/* Forma za dodavanje recenzije */}
            {!myReview ? (
              <div style={styles.addReviewSection}>
                <h3 style={styles.sectionTitle}>⭐ Ocijenite materijal</h3>
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
            ) : null}

            {/* MOJA RECENZIJA */}
            {myReview && (
              <div style={styles.listSection}>
                <h3 style={styles.sectionTitle}>Moja ocjena</h3>
                <div style={styles.reviewsList}>
                  <div 
                    style={{
                      ...styles.reviewCard,
                      ...styles.myReviewCard
                    }}
                  >
                    <div style={styles.reviewHeader}>
                      <div style={{
                        ...styles.avatarCircle,
                        ...styles.myAvatar
                      }}>
                        {myReview.name.charAt(0)}{myReview.surname.charAt(0)}
                      </div>
                      <div style={styles.reviewMeta}>
                        <strong style={styles.reviewAuthor}>
                          {myReview.name} {myReview.surname}
                          <span style={styles.myBadge}> (Vi)</span>
                        </strong>
                        <div style={styles.reviewStars}>
                          {'★'.repeat(myReview.ocjena)}
                          {'☆'.repeat(5 - myReview.ocjena)}
                        </div>
                        <span style={styles.reviewDate}>
                          {new Date(myReview.datum).toLocaleString('sr-RS')}
                        </span>
                      </div>
                      <button 
                        style={styles.deleteButton}
                        onClick={() => handleDeleteReview(materialId)}
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

            {/* SVE RECENZIJE */}
            <div style={styles.listSection}>
              <h3 style={styles.sectionTitle}>⭐ Sve recenzije</h3>
              {otherReviews.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Još uvijek nema recenzija.</p>
                  <p style={styles.emptyStateSubtext}>Budite prvi koji će ocijeniti!</p>
                </div>
              ) : (
                <div style={styles.reviewsList}>
                  {otherReviews.map((review) => (
                    <div key={review.id} style={styles.reviewCard}>
                      <div style={styles.reviewHeader}>
                        <div style={styles.avatarCircle}>
                          {review.name.charAt(0)}{review.surname.charAt(0)}
                        </div>
                        <div style={styles.reviewMeta}>
                          <strong style={styles.reviewAuthor}>
                            {review.name} {review.surname}
                          </strong>
                          <div style={styles.reviewStars}>
                            {'★'.repeat(review.ocjena)}
                            {'☆'.repeat(5 - review.ocjena)}
                          </div>
                          <span style={styles.reviewDate}>
                            {new Date(review.datum).toLocaleString('sr-RS')}
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
    overflowY: 'auto',
  },

  modalCard: {
    background: 'linear-gradient(135deg, #1a2a5e 0%, #0a1457 100%)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '2px solid rgba(96, 224, 22, 0.2)',
    maxWidth: '700px',
    width: '100%',
    padding: '24px',
    maxHeight: '90vh',
    overflowY: 'auto',
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
    color: '#ffffff',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabsContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },

  tabButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: 'rgba(26, 42, 94, 0.4)',
    borderRadius: '8px',
    border: '2px solid rgba(96, 224, 22, 0.2)',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: 'rgba(255, 255, 255, 0.6)',
  },

  activeTab: {
    backgroundColor: '#60e016',
    color: '#0a1457',
    borderColor: '#60e016',
    transform: 'scale(1.02)',
  },

  tabContent: {
    marginTop: '20px',
  },

  addCommentSection: {
    background: 'linear-gradient(135deg, rgba(26, 42, 94, 0.95) 0%, rgba(10, 20, 87, 0.95) 100%)',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid rgba(96, 224, 22, 0.3)',
    boxShadow: '0 4px 12px rgba(96, 224, 22, 0.15)',
  },

  addReviewSection: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },

  listSection: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
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

  averageRatingStars: {
    fontSize: '22px',
    color: '#facc15',
    letterSpacing: '4px',
    textShadow: '0 3px 8px rgba(250, 204, 21, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
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
    fontSize: '16px',
    fontWeight: '800',
    color: '#60e016',
    marginBottom: '15px',
    margin: 0,
    letterSpacing: '0.3px',
    textShadow: '0 2px 4px rgba(96, 224, 22, 0.3)',
  },

  textarea: {
    width: '100%',
    borderRadius: '8px',
    padding: '12px',
    border: '2px solid rgba(96, 224, 22, 0.3)',
    fontSize: '15px',
    marginBottom: '12px',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    color: '#ffffff',
    backgroundColor: 'rgba(10, 20, 87, 0.6)',
  },

  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#60e016',
    color: '#0a1457',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(96, 224, 22, 0.3)',
  },

  disabledButton: {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
    opacity: 0.6,
    boxShadow: 'none',
  },

  starsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
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
    fontWeight: '500',
  },

  starLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#60e016',
    marginTop: '12px',
  },

  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  commentCard: {
    padding: '14px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    transition: 'all 0.2s ease',
  },

  myCommentCard: {
    backgroundColor: '#f0fde8',
    border: '2px solid #60e016',
    boxShadow: '0 2px 8px rgba(96, 224, 22, 0.15)',
  },

  reviewCard: {
    padding: '14px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    transition: 'all 0.2s ease',
  },

  myReviewCard: {
    backgroundColor: '#f0fde8',
    border: '2px solid #60e016',
    boxShadow: '0 2px 8px rgba(96, 224, 22, 0.15)',
  },

  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },

  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  avatarCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#60e016',
    color: '#0a1457',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0,
  },

  myAvatar: {
    backgroundColor: '#3ba519',
    color: '#ffffff',
  },

  commentMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },

  reviewMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },

  commentAuthor: {
    fontSize: '15px',
    color: '#1f2937',
    fontWeight: '700',
  },

  reviewAuthor: {
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

  reviewDate: {
    fontSize: '12px',
    color: '#6b7280',
  },

  commentText: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#4b5563',
    margin: 0,
    paddingLeft: '52px',
  },

  reviewStars: {
    fontSize: '18px',
    color: '#facc15',
    letterSpacing: '2px',
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
    padding: '30px 20px',
    color: '#6b7280',
  },

  emptyStateSubtext: {
    fontSize: '14px',
    marginTop: '8px',
    color: '#9ca3af',
    fontWeight: '500',
  },

  reportButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(245, 158, 11, 0.7)',
    cursor: 'pointer',
    padding: '4px',
    transition: 'color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
};

export default CommentsSection;
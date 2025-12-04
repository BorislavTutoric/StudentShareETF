import React, { useState } from 'react';
import { Star, X, Trash2 } from 'lucide-react';
import { addReview, deleteReview, getReviews } from '../services/materialsService';

function CommentsSection({ isOpen, onClose, documentName, showToast, materialId }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Milan",
      surname: "Milanović",
      text: "Jako korisni materijali, sve lepo objašnjeno!",
      dateTime: new Date(),
      isMyComment: false,
    },
  ]);

  const [otherReviews, setOtherReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [activeTab, setActiveTab] = useState('comments');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setSubmittingComment(true);
      // TODO: Dodaj API call - await addMaterialComment(documentName, newComment);
      const newCommentObj = {
        id: Date.now(),
        name: "Vi",
        surname: "(Trenutni korisnik)",
        text: newComment,
        dateTime: new Date(),
        isMyComment: true,
      };
      setComments([newCommentObj, ...comments]);
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
      const response = await addReview(materialId, rating);

      const newReview = {
        ...response,
        isMyReview: response.myReview,
      };
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
    try {
      const res = await getReviews(materialId);

      if (!Array.isArray(res)) {
        console.error("Odgovor nije niz:", res);
        return;
      }

      const mappedReviews = res.map(r => ({
        ...r,
        isMyReview: r.myReview, 
      }));

      const myReviewFound = mappedReviews.find(r => r.myReview) || null;
      const otherReviews = mappedReviews.filter(r => !r.myReview);

      setMyReview(myReviewFound);
      setOtherReviews(otherReviews);

    } catch (err) {
      console.error(err);
      showToast(`Greška: ${err}`, "error");
    }
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter(c => c.id !== id));
    alert('Komentar uspješno obrisan!');
  };

  const handleDeleteReview = async (materialId) => {
    try{
      const res = await deleteReview(materialId);
      setMyReview(null);
      showToast(`Obrisali ste vašu recenziju za materijal: ${documentName}`, 'success')
    } catch (err) {
      console.error(err);
      showToast(`Greška: ${err}`, "error");
    }
  };

  if (!isOpen) return null;

  const otherComments = comments.filter(c => !c.isMyComment);
  const myComment = comments.find(c => c.isMyComment);


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
            💬 Komentari ({comments.length})
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
            ⭐ Recenzije ({otherReviews.length + (myReview ? 1 : 0)})
          </button>
        </div>

        {/* KOMENTARI TAB */}
        {activeTab === 'comments' && (
          <div style={styles.tabContent}>
            {/* Forma za dodavanje komentara */}
            {!myComment ? (
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
            ) : null}

            {/* MOJI KOMENTARI */}
            {myComment && (
              <div style={styles.listSection}>
                <h3 style={styles.sectionTitle}>Moj komentar</h3>
                <div style={styles.commentsList}>
                  <div 
                    style={{
                      ...styles.commentCard,
                      ...styles.myCommentCard
                    }}
                  >
                    <div style={styles.commentHeader}>
                      <div style={{
                        ...styles.avatarCircle,
                        ...styles.myAvatar
                      }}>
                        {myComment.name.charAt(0)}{myComment.surname.charAt(0)}
                      </div>
                      <div style={styles.commentMeta}>
                        <strong style={styles.commentAuthor}>
                          {myComment.name} {myComment.surname}
                          <span style={styles.myBadge}> (Vi)</span>
                        </strong>
                        <span style={styles.commentDate}>
                          {new Date(myComment.dateTime).toLocaleString('sr-RS')}
                        </span>
                      </div>
                      <button 
                        style={styles.deleteButton}
                        onClick={() => handleDeleteComment(myComment.id)}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.7)'}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <p style={styles.commentText}>{myComment.text}</p>
                  </div>
                </div>
              </div>
            )}

            {/* OSTALI KOMENTARI */}
            <div style={styles.listSection}>
              <h3 style={styles.sectionTitle}>💬 Svi komentari</h3>
              {otherComments.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Još uvijek nema komentara.</p>
                  <p style={styles.emptyStateSubtext}>Budite prvi koji će komentarisati!</p>
                </div>
              ) : (
                <div style={styles.commentsList}>
                  {otherComments.map((comment) => (
                    <div key={comment.id} style={styles.commentCard}>
                      <div style={styles.commentHeader}>
                        <div style={styles.avatarCircle}>
                          {comment.name.charAt(0)}{comment.surname.charAt(0)}
                        </div>
                        <div style={styles.commentMeta}>
                          <strong style={styles.commentAuthor}>
                            {comment.name} {comment.surname}
                          </strong>
                          <span style={styles.commentDate}>
                            {new Date(comment.dateTime).toLocaleString('sr-RS')}
                          </span>
                        </div>
                      </div>
                      <p style={styles.commentText}>{comment.text}</p>
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  },

  addReviewSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '25px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  },

  listSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '15px',
    margin: 0,
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
    color: '#1f2937',
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

  reviewsList: {
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
    padding: '30px',
    color: '#6b7280',
  },

  emptyStateSubtext: {
    fontSize: '14px',
    marginTop: '5px',
    color: '#9ca3af',
  },
};

export default CommentsSection;
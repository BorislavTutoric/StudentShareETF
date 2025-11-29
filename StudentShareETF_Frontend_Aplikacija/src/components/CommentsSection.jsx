import React, { useState } from 'react';
import { Star, MoreVertical, UserCircle2, X, MessageCircle, Trash2 } from 'lucide-react';

function CommentsSection({ isOpen, onClose, documentName = "Termodinamika.pdf" }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Milan Milanović",
      rating: 5,
      text: "Jako korisni materijali, sve lepo objašnjeno!",
      isCurrentUser: false,
    },
  ]);

  const [myRating, setMyRating] = useState(null);
  const [myComment, setMyComment] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const allCommentsForRating = comments.length > 0 
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : 0;

  const handleSubmit = () => {
    if (newComment.trim() && newRating > 0) {
      const newCommentObj = {
        id: Date.now(),
        author: "Vi (Trenutni korisnik)",
        rating: newRating,
        text: newComment,
        isCurrentUser: true,
      };
      setComments([...comments, newCommentObj]);
      setMyRating(newRating);
      setMyComment(newCommentObj);
      setNewComment("");
      setNewRating(0);
      setShowAddForm(false);
      alert('Komentar uspješno dodat!');
    } else {
      alert('Molimo odaberite ocjenu i unesite komentar!');
    }
  };

  const handleDeleteMyRating = () => {
    if (myComment) {
      setComments(comments.filter(c => c.id !== myComment.id));
    }
    setMyRating(null);
    setMyComment(null);
    alert('Vaša ocjena i komentar su obrisani!');
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter(c => c.id !== id));
    alert('Komentar uspješno obrisan!');
  };

  if (!isOpen) return null;

  const otherComments = comments.filter(c => !c.isCurrentUser);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
      
        <div style={styles.modalHeader}>
          <h1 style={styles.modalTitle}>💬 {documentName}</h1>
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

      
        <div style={styles.ratingCard}>
          <div style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                fill={i < Math.round(allCommentsForRating) ? '#facc15' : 'none'}
                color={i < Math.round(allCommentsForRating) ? '#facc15' : '#9ca3af'}
              />
            ))}
          </div>
          <p style={styles.averageText}>
            {allCommentsForRating} prosječna ocjena ({comments.length} {comments.length === 1 ? 'recenzija' : 'recenzija'})
          </p>
        </div>

        {/* MOJA OCJENA SEKCIJA */}
        <div style={styles.myRatingCard}>
          <h3 style={styles.myRatingTitle}>Moja ocjena</h3>
          <div style={styles.myRatingContent}>
            {myRating && (
              <div style={styles.myRatingStars}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={28}
                    fill={i < myRating ? '#60e016' : 'none'}
                    color={i < myRating ? '#60e016' : '#9ca3af'}
                  />
                ))}
              </div>
            )}
            {myRating ? (
              <button
                onClick={handleDeleteMyRating}
                style={styles.deleteRatingButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                }}
              >
                <Trash2 size={18} />
                Obriši ocjenu
              </button>
            ) : (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                style={styles.addCommentButton2}
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
                <MessageCircle size={18} />
                {showAddForm ? 'Otkaži' : 'Dodaj ocjenu'}
              </button>
            )}
          </div>
        </div>

       
        {showAddForm && (
          <div style={styles.addCommentForm}>
            <div style={styles.formSection}>
              <label style={styles.label}>Ocjena:</label>
              <div style={styles.ratingSelector}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={32}
                    style={styles.starButton}
                    fill={i < (hoverRating || newRating) ? '#60e016' : 'none'}
                    color={i < (hoverRating || newRating) ? '#60e016' : '#9ca3af'}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setNewRating(i + 1)}
                  />
                ))}
              </div>
            </div>

            <div style={styles.formSection}>
              <label style={styles.label}>Komentar:</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Napiši svoj komentar..."
                style={styles.textarea}
                rows={4}
                onFocus={(e) => e.target.style.borderColor = '#60e016'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(96, 224, 22, 0.3)'}
              />
            </div>

            <div style={styles.submitButtonContainer}>
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
                Objavi
              </button>
            </div>
          </div>
        )}

        {/* MOJI KOMENTARI - ODVOJENA SEKCIJA */}
        <div style={styles.section}>
          <div style={styles.commentsTitle}>
            <h2 style={styles.sectionTitle}>Moji komentari:</h2>
          </div>
          {myComment ? (
            <div style={styles.commentsList}>
              <div style={styles.commentItem}>
                <div style={styles.commentHeader}>
                  <div style={styles.commentAuthor}>
                    <div style={styles.avatar}>
                      <UserCircle2 size={24} color="#0a1457" />
                    </div>
                    <div style={styles.authorInfo}>
                      <p style={styles.authorName}>{myComment.author}</p>
                      <div style={styles.commentRating}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < myComment.rating ? '#60e016' : 'none'}
                            color={i < myComment.rating ? '#60e016' : '#9ca3af'}
                          />
                        ))}
                      </div>
                    </div>
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
          ) : (
            <p style={styles.noComments}>Još niste dodali komentar</p>
          )}
        </div>

        {/* KOMENTARI I RECENZIJE - ODVOJENA SEKCIJA */}
        <div style={styles.section}>
          <div style={styles.commentsTitle}>
            <h2 style={styles.sectionTitle}>Komentari i recenzije:</h2>
          </div>
          {otherComments.length > 0 ? (
            <div style={styles.commentsList}>
              {otherComments.map((comment) => (
                <div key={comment.id} style={styles.commentItem}>
                  <div style={styles.commentHeader}>
                    <div style={styles.commentAuthor}>
                      <div style={styles.avatar}>
                        <UserCircle2 size={24} color="#0a1457" />
                      </div>
                      <div style={styles.authorInfo}>
                        <p style={styles.authorName}>{comment.author}</p>
                        <div style={styles.commentRating}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < comment.rating ? '#facc15' : 'none'}
                              color={i < comment.rating ? '#facc15' : '#9ca3af'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <button 
                      style={styles.moreButton}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#60e016'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <p style={styles.commentText}>{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noComments}>Još nema komentara drugih korisnika</p>
          )}
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

  ratingCard: {
    background: 'rgba(96, 224, 22, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
    border: '1px solid rgba(96, 224, 22, 0.2)',
  },

  starsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },

  averageText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    margin: 0,
    fontWeight: 500,
  },

  myRatingCard: {
    background: 'rgba(96, 224, 22, 0.15)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
    border: '2px solid rgba(96, 224, 22, 0.3)',
  },

  myRatingTitle: {
    color: '#60e016',
    fontSize: '16px',
    fontWeight: 700,
    margin: '0 0 12px 0',
    letterSpacing: '0.5px',
  },

  myRatingContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  myRatingStars: {
    display: 'flex',
    gap: '6px',
  },

  addCommentButton2: {
    backgroundColor: '#60e016',
    color: '#0a1457',
    fontWeight: 700,
    fontSize: '14px',
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(96, 224, 22, 0.3)',
    transition: 'all 0.3s',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  deleteRatingButton: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '14px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
  },

  addCommentButton: {
    backgroundColor: '#60e016',
    color: '#0a1457',
    fontWeight: 700,
    fontSize: '15px',
    padding: '10px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(96, 224, 22, 0.3)',
    transition: 'all 0.3s',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    justifyContent: 'center',
  },

  addCommentForm: {
    background: 'rgba(26, 42, 94, 0.4)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid rgba(96, 224, 22, 0.2)',
    backdropFilter: 'blur(10px)',
  },

  formSection: {
    marginBottom: '16px',
  },

  label: {
    display: 'block',
    color: '#ffffff',
    fontWeight: 600,
    marginBottom: '8px',
    fontSize: '15px',
  },

  ratingSelector: {
    display: 'flex',
    gap: '8px',
  },

  starButton: {
    cursor: 'pointer',
    transition: 'transform 0.2s',
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

  submitButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px',
  },

  submitButton: {
    backgroundColor: '#60e016',
    color: '#0a1457',
    fontWeight: 700,
    fontSize: '15px',
    padding: '10px 32px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(96, 224, 22, 0.3)',
    transition: 'all 0.3s',
    letterSpacing: '0.5px',
  },

  section: {
    marginBottom: '20px',
    padding: '16px',
    background: 'rgba(26, 42, 94, 0.3)',
    borderRadius: '12px',
    border: '1px solid rgba(96, 224, 22, 0.15)',
  },

  commentsTitle: {
    marginBottom: '12px',
  },

  sectionTitle: {
    color: '#60e016',
    fontSize: '16px',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '0.5px',
  },

  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '300px',
    overflowY: 'auto',
  },

  noComments: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    padding: '16px',
    fontSize: '14px',
    margin: 0,
  },

  commentItem: {
    background: 'rgba(26, 42, 94, 0.5)',
    borderRadius: '10px',
    padding: '14px',
    border: '1px solid rgba(96, 224, 22, 0.15)',
  },

  commentHeader: {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },

  commentAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  avatar: {
    width: '36px',
    height: '36px',
    backgroundColor: '#60e016',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },

  authorName: {
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '14px',
    margin: 0,
  },

  commentRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },

  moreButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    padding: '4px',
    transition: 'color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
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
  },

  commentText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: 0,
    paddingLeft: '46px',
  },
};

export default CommentsSection;
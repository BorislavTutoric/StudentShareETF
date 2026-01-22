import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { deleteCommentApi } from '../../../services/materialsService';

function ModeratorCommentsSection({ isOpen, onClose, documentName, materialId, showToast, 
  allMaterialComments, setAllMaterialComments }) {
  const [materialComments, setMaterialComments] = useState(allMaterialComments);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(null);

  useEffect(() => {
    const sortedComments = allMaterialComments.sort((a, b) => {
      return new Date(b.datum) - new Date(a.datum);
    });
    setMaterialComments(sortedComments);
  }, [allMaterialComments]);

  const handleDeleteComment = async () => {
    if (!showDeleteCommentConfirm) return;
    
    try {
      setDeletingCommentId(showDeleteCommentConfirm.id);
      const response = await deleteCommentApi(showDeleteCommentConfirm.id);
      setAllMaterialComments(allMaterialComments.filter(comment => comment.commentId !== showDeleteCommentConfirm.id));
      showToast('Uspješno ste obrisali komentar!', 'success');
      setShowDeleteCommentConfirm(null);
    } catch (err) {
      console.error(err);
      showToast('Greška pri brisanju komentara', 'error');
      setShowDeleteCommentConfirm(null);
    } finally {
      setDeletingCommentId(null);
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
              e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.8)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8b5cf6';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div style={styles.listSection}>
          <h3 style={styles.sectionTitle}>💬 Svi komentari ({materialComments.length})</h3>
          {materialComments.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Nema komentara za ovaj materijal.</p>
            </div>
          ) : (
            <div style={styles.commentsList}>
              {materialComments.map((comment) => (
                <div 
                  key={comment.commentId} 
                  style={styles.commentCard}
                >
                  <div style={styles.commentHeader}>
                    <div style={styles.avatarCircle}>
                      {comment.name.charAt(0)}{comment.surname.charAt(0)}
                    </div>
                    <div style={styles.commentMeta}>
                      <strong style={styles.commentAuthor}>
                        {comment.name} {comment.surname}
                      </strong>
                      <span style={styles.commentDate}>
                        {new Date(comment.datum).toLocaleString('sr-RS')}
                      </span>
                    </div>
                    <button 
                      style={{
                        ...styles.deleteButton,
                        ...(deletingCommentId === comment.commentId ? styles.deletingButton : {})
                      }}
                      onClick={() => setShowDeleteCommentConfirm({ 
                        id: comment.commentId, 
                        author: `${comment.name} ${comment.surname}` 
                      })}
                      disabled={deletingCommentId === comment.commentId}
                      onMouseEnter={(e) => {
                        if (deletingCommentId !== comment.commentId) {
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(239, 68, 68, 0.7)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Obriši komentar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p style={styles.commentText}>{comment.sadrzaj}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
    border: '2px solid rgba(139, 92, 246, 0.3)',
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
    background: 'rgba(139, 92, 246, 0.15)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
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
    backgroundColor: '#8b5cf6',
    border: 'none',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#8b5cf6',
    marginBottom: '20px',
    margin: 0,
    letterSpacing: '0.3px',
    textShadow: '0 2px 4px rgba(139, 92, 246, 0.3)',
    paddingBottom: '15px',
    borderBottom: '2px solid rgba(139, 92, 246, 0.2)',
  },

  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '15px',
  },

  commentCard: {
    padding: '16px',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: '10px',
    border: '1.5px solid rgba(139, 92, 246, 0.2)',
    transition: 'all 0.2s ease',
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
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
  },

  commentMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },

  commentAuthor: {
    fontSize: '15px',
    color: '#ffffff',
    fontWeight: '700',
  },

  commentDate: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
  },

  commentText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.85)',
    margin: 0,
    paddingLeft: '52px',
  },

  deleteButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(239, 68, 68, 0.7)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },

  deletingButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'rgba(255, 255, 255, 0.5)',
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

export default ModeratorCommentsSection;
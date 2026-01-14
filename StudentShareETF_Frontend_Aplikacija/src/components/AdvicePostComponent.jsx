import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, AlertTriangle, Send, Trash2 } from 'lucide-react';
import { CommentItemComponent } from './CommentItemComponent'; 
import ConfirmationModal from './ConfirmationModal';

const PRIMARY_ACCENT = '#60e016';
const SECONDARY_ACCENT = '#5c6bc0';

export const AdvicePostComponent = ({ 
    advice, 
    isMineStyle, 
    expandedComments, 
    allComments, 
    toggleComments, 
    handleToggleLike, 
    handleReportAdvice,
    handleDeleteAdvice, 
    handlePostComment,
    handleReportComment,
    handleDeleteComment
}) => {
    
    const [newComment, setNewComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState(null);
    const [message, setMessage] = useState("");

    const handleCloseConfirmModal = () => {
      setConfirmModalOpen(false);
    }
    
    const authorName = `${advice.name} ${advice.surname }`;
    const initials = (advice.name ? advice.name.charAt(0) : '') + (advice.surname ? advice.surname.charAt(0) : '');
    
    const date = new Date(advice.dateTime).toLocaleString('sr-RS', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    
    const isMine = Boolean(advice.myAdvice) || false; 
    const isExpanded = expandedComments[advice.id];
    const comments = allComments[advice.id] || [];
    
    const submitComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;
        
        setIsCommenting(true);
        const success = await handlePostComment(advice.id, newComment);
        if (success) {
            setNewComment('');
        }
        setIsCommenting(false);
    };

    return (
        <div style={{ ...styles.postContainer, ...isMineStyle }}> 

            <ConfirmationModal 
                isOpen={confirmModalOpen}
                onConfirm={onConfirm}
                message={message}
                onCancel={handleCloseConfirmModal}
            />
            
            {advice.reported && <span style={styles.reportedBadge}>PRIJAVLJENO</span>}

            <div style={styles.authorContainer}>
                <div style={styles.avatar}>
                    {initials}
                </div>
                <div style={styles.authorInfo}>
                    <span style={styles.authorName}>
                        {authorName} 
                        {isMine && <span style={styles.youTag}>(Vi)</span>} 
                    </span>
                    <span style={styles.postDate}>
                        @{advice.username || 'student'} • {date}
                    </span>
                </div>
            </div>

            <p style={styles.postContent}>{advice.content}</p>
            
            <div style={styles.actionsContainer}>
             
                <button 
                    onClick={handleToggleLike}
                    style={{
                        ...styles.actionButton,
                        ...(advice.likedByMe ? styles.likedButton : {})
                    }}
                    title={advice.likedByMe ? "Ukloni like" : "Lajkuj savjet"}
                >
                    <ThumbsUp size={16} fill={advice.likedByMe ? PRIMARY_ACCENT : 'none'} /> 
                    {advice.likesCount} {advice.likesCount === 1 ? 'Lajk' : 'Lajkova'}
                </button>
                
                <button 
                    onClick={toggleComments}
                    style={styles.actionButton}
                    title={isExpanded ? "Sakrij komentare" : "Prikaži komentare"}
                >
                    <MessageSquare size={16} /> 
                    {advice.commentsCount || 0} {advice.commentsCount === 1 ? 'Komentar' : 'Komentara'}
                </button>

                {!advice.reported && (
                    isMine ? (
                        <button 
                            onClick={() => {
                                    setMessage("obrisati savjet?");
                                    setOnConfirm(() => () => handleDeleteAdvice(advice.id))
                                    setConfirmModalOpen(true)
                                }
                            }
                            style={{...styles.actionButton, ...styles.deleteButton}} 
                            title="Obriši savjet"
                        >
                            <Trash2 size={16} /> Obriši
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                    setMessage("obrisati savjet?");
                                    setOnConfirm(() => () => handleReportAdvice())
                                    setConfirmModalOpen(true)
                                }
                            }
                            style={{...styles.actionButton, ...styles.reportButton}}
                            title="Prijavi ovaj savjet kao neprikladan"
                        >
                            <AlertTriangle size={16} /> Prijavi
                        </button>
                    )
                )}
            </div>

            {isExpanded && (
                <div style={styles.commentsSection}>
                    {comments.map(comment => (
                        <CommentItemComponent 
                            key={comment.id}
                            adviceId={advice.id}
                            comment={comment}
                            handleReportComment={handleReportComment}
                            handleDeleteComment={handleDeleteComment}
                        />
                    ))}

                    <form onSubmit={submitComment} style={styles.commentForm}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Napišite komentar..."
                            style={styles.commentInput}
                            disabled={isCommenting}
                        />
                        <button
                            type="submit"
                            style={{ 
                                ...styles.commentSubmitButton, 
                                opacity: newComment.trim() === '' || isCommenting ? 0.6 : 1,
                                cursor: newComment.trim() === '' || isCommenting ? 'not-allowed' : 'pointer'
                            }}
                            disabled={newComment.trim() === '' || isCommenting}
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

const styles = {
    postContainer: {
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        position: 'relative',
    },
    authorContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: SECONDARY_ACCENT,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '14px',
        flexShrink: 0,
        marginRight: '12px',
    },
    authorInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    authorName: {
        color: 'white',
        fontWeight: '600',
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    youTag: {
        backgroundColor: 'rgba(96, 224, 22, 0.2)',
        color: PRIMARY_ACCENT,
        padding: '2px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '700',
        border: `1px solid rgba(96, 224, 22, 0.3)`,
    },
    postDate: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '12px',
    },
    postContent: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '15px',
        whiteSpace: 'pre-wrap', 
    },
    actionsContainer: {
        display: 'flex',
        gap: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '15px',
    },
    actionButton: {
        background: 'none',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.7)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: '600',
        transition: 'color 0.2s ease',
    },
    likedButton: {
        color: PRIMARY_ACCENT,
    },
    reportButton: {
        marginLeft: 'auto',
        color: 'rgba(255, 82, 82, 0.8)',
    },
    reportedBadge: {
        position: 'absolute', top: '15px', right: '15px', 
        backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#ff5252',
        padding: '5px 10px', borderRadius: '8px', fontSize: '12px',
        fontWeight: '700', border: '1px solid rgba(244, 67, 54, 0.3)',
        pointerEvents: 'none', zIndex: 10,
    },
    commentsSection: {
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    deleteButton: {
        marginLeft: 'auto',
        color: '#ff5252',
        opacity: 0.8,
        padding: '5px 10px',
        borderRadius: '6px',
        border: '1px solid rgba(255, 82, 82, 0.3)',
    },
    commentForm: {
        display: 'flex',
        gap: '8px',
        marginTop: '10px',
    },
    commentInput: {
        flexGrow: 1,
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: '#1a237e',
        fontSize: '13px',
    },
    commentSubmitButton: {
        backgroundColor: PRIMARY_ACCENT,
        color: '#1a237e',
        border: 'none',
        padding: '0 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
};
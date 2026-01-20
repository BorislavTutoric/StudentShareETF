import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const PRIMARY_ACCENT = '#60e016';
const SECONDARY_ACCENT = '#5c6bc0';

const CommentItemComponent = ({ adviceId, comment, handleReportComment, handleDeleteComment }) => {

    const date = new Date(comment.dateTime).toLocaleString('sr-RS', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState(null);
    const [message, setMessage] = useState("");
    
    const authorName = `${comment.name || 'Anonimni'} ${comment.surname || 'Korisnik'}`;
    const initials = (comment.name ? comment.name.charAt(0) : '') + (comment.surname ? comment.surname.charAt(0) : '');

    return (
        <>
        <ConfirmationModal
            isOpen={confirmModalOpen}
            message={message}
            onConfirm={onConfirm}
            onCancel={() => setConfirmModalOpen(false)}
        />

        <div 
            style={{ 
                ...styles.commentItem,
                ...(comment.isMine ? styles.myCommentBorder : {}), 
                ...(comment.isMine ? styles.myCommentBackground : {}), 
            }}
        >
            <div style={{ ...styles.commentAvatar, backgroundColor: SECONDARY_ACCENT }}>
                {initials}
            </div>

            <div style={styles.commentBody}>
                <div style={styles.commentHeader}>
                    <div style={styles.commentAuthorContainer}>
                        
                        <span style={styles.commentAuthor}>
                            {authorName}
                            {comment.isMine && <span style={styles.commentYouTag}>(Vi)</span>}
                        </span>
                        
                        <span style={styles.commentUsername}>
                            @{comment.username || 'student'} 
                            <span style={styles.commentSeparator}>•</span>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 'normal' }}>{date}</span>
                        </span>
                    </div>
                </div>
                <p style={styles.commentContent}>{comment.content}</p>
            </div>

            {comment.isMine ? (
                <button
                    onClick={() => {
                        setMessage("obrisati ovaj komentar?");
                        setOnConfirm(() => () => handleDeleteComment(comment.id, adviceId));
                        setConfirmModalOpen(true);
                    }}
                    style={styles.deleteCommentButton}
                    title="Obriši komentar"
                >
                    <Trash2 size={12} style={{ marginRight: '3px' }} /> Obriši
                </button>
            ) : comment.reported ? (
                <span style={styles.reportedBadgeAbsolute}>PRIJAVLJENO</span>
            ) : (
                <button
                    onClick={() => handleReportComment(comment.id, adviceId)}
                    style={styles.reportButtonAbsolute}
                    title="Prijavi komentar"
                >
                    Prijavi
                </button>
            )}
        </div>
    </>
    );
};

const styles = {
    commentItem: {
        display: 'flex',
        gap: '10px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        alignItems: 'flex-start',
        position: 'relative', 
        border: '1px solid transparent', 
        transition: 'all 0.3s ease', 
    },
    myCommentBorder: {
        border: `1px solid ${PRIMARY_ACCENT}`, 
        boxShadow: `0 0 5px rgba(96, 224, 22, 0.2)`, 
    },
    myCommentBackground: {
        backgroundColor: 'rgba(96, 224, 22, 0.05)', 
    },
    commentAvatar: {
        width: '32px', 
        height: '32px', 
        borderRadius: '50%', 
        backgroundColor: 'rgba(92, 107, 192, 0.7)', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontWeight: '600', 
        fontSize: '11px', 
        flexShrink: 0,
    },
    commentBody: {
        flexGrow: 1,
        paddingRight: '60px', 
    },
    commentAuthorContainer: {
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2px', 
        marginBottom: '4px',
    },
    commentHeader: {
        display: 'flex', 
        alignItems: 'flex-start',
    },
    commentAuthor: {
        color: 'white', 
        fontWeight: '600', 
        fontSize: '13px', 
        display: 'flex',
        alignItems: 'center', 
        gap: '5px',
    },
    commentUsername: {
        color: 'rgba(255, 255, 255, 0.6)', 
        fontWeight: '500', 
        fontSize: '11px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
    },
    commentSeparator: {
        color: 'rgba(255, 255, 255, 0.3)',
    },
    commentYouTag: {
        backgroundColor: 'rgba(96, 224, 22, 0.2)',
        color: PRIMARY_ACCENT,
        padding: '1px 6px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: '700',
        border: `1px solid rgba(96, 224, 22, 0.3)`,
    },
    commentContent: {
        color: 'rgba(255, 255, 255, 0.9)', 
        fontSize: '13px', 
        margin: '5px 0 0 0', 
        lineHeight: '1.5',
    },
    reportButtonAbsolute: {
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        background: 'none',
        border: '1px solid rgba(255, 255, 255, 0.15)', 
        color: 'rgba(255, 255, 255, 0.7)',
        padding: '2px 8px', 
        borderRadius: '4px', 
        cursor: 'pointer', 
        fontSize: '11px', 
        fontWeight: '600', 
        transition: 'all 0.2s ease', 
        zIndex: 10,
    },
    reportedBadgeAbsolute: {
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        backgroundColor: 'rgba(244, 67, 54, 0.1)', 
        color: '#ff5252',
        padding: '2px 8px', 
        borderRadius: '4px', 
        fontSize: '11px',
        fontWeight: '600', 
        border: '1px solid rgba(244, 67, 54, 0.3)',
        pointerEvents: 'none', 
        zIndex: 10, 
    },
    deleteCommentButton: {
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        background: 'none',
        border: '1px solid rgba(255, 82, 82, 0.2)', 
        color: 'rgba(255, 82, 82, 0.8)',
        padding: '2px 8px', 
        borderRadius: '4px', 
        cursor: 'pointer', 
        fontSize: '11px', 
        fontWeight: '600', 
        transition: 'all 0.2s ease', 
        zIndex: 10,
    }
};

export default CommentItemComponent;
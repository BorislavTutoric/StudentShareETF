import React, { useState, useEffect, useCallback } from 'react';
import { AdvicePostComponent } from './AdvicePostComponent';
import adviceService from '../services/adviceService'; 
import { MessageSquare, ChevronLeft, Send, PenTool } from 'lucide-react'; 
import Toast from './Toast';

const PRIMARY_ACCENT = '#60e016';
const BACKGROUND_GRADIENT = "linear-gradient(180deg, #1a237e 0%, #283593 50%, #3949ab 100%)";

const AdviceDisplay = ({ subjectId, subjectName, year, onBack }) => {
    const [advices, setAdvices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedComments, setExpandedComments] = useState({});
    const [allComments, setAllComments] = useState({});
    const [newPostContent, setNewPostContent] = useState('');
    const [isPostSubmitting, setIsPostSubmitting] = useState(false);
    const [hoverBack, setHoverBack] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success', duration = 3000) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), duration);
    };

    const fetchAdvices = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adviceService.getAdvicesBySubjectId(subjectId);
            setAdvices(data);
        } catch (e) {
            console.error('Greška pri učitavanju savjeta:', e);
            setError(e.toString());
        } finally {
            setIsLoading(false);
        }
    }, [subjectId]);

    const fetchComments = useCallback(async (adviceId) => {
        try {
            const commentsData = await adviceService.getCommentsByAdviceId(adviceId);
            
            const newCount = commentsData.length;
            setAdvices(prevAdvices => prevAdvices.map(advice => 
                advice.id === adviceId ? { ...advice, commentsCount: newCount } : advice
            ));
            
            setAllComments(prev => ({ 
                ...prev, 
                [adviceId]: commentsData.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
            }));

        } catch (e) {
            console.error('Greška pri dohvaćanju komentara:', e);
        }
    }, []);

    const toggleComments = (adviceId) => {
        setExpandedComments(prev => {
            const isExpanding = !prev[adviceId];
            if (isExpanding) {
                if (!allComments[adviceId]) {
                    fetchComments(adviceId);
                }
            }
            return {
                ...prev,
                [adviceId]: isExpanding
            };
        });
    };

    const handlePostAdvice = async (e) => {
        e.preventDefault();
        if (newPostContent.trim() === '') return;

        setIsPostSubmitting(true);
        try {
            await adviceService.createAdvice(subjectId, newPostContent); 
            setNewPostContent('');
            await fetchAdvices(); 
        } catch (e) {
            showToast("Greška pri objavljivanju savjeta!");
            console.error(e);
        } finally {
            setIsPostSubmitting(false);
        }
    };

    const handleToggleLike = async (adviceId) => {
        try {
            const { isLiked, likesCount } = await adviceService.toggleLike(adviceId);
            setAdvices(prev => prev.map(advice => 
                advice.id === adviceId ? { ...advice, likedByMe: isLiked, likesCount } : advice
            ));
        } catch (e) {
            alert('Greška pri lajkovanju: ' + e);
        }
    };
    
    const handleDeleteAdvice = async (adviceId) => {
        try {
            await adviceService.deleteAdvice(adviceId); 
            setAdvices(prev => prev.filter(a => a.id !== adviceId));
            setAllComments(prev => {
                const newComments = { ...prev };
                delete newComments[adviceId];
                return newComments;
            });
            showToast("Uspješno ste obrisali savjet!", 'success');
        } catch (e) {
            showToast("Greška pri brisanju savjeta!", 'success');
        }
    };

    const handleReportAdvice = async (adviceId) => {
        try {
            await adviceService.reportAdvice(adviceId);
            showToast("Savjet je uspješno prijavljen!", 'success');
            setAdvices(prev => prev.map(advice => 
                advice.id === adviceId ? { ...advice, reported: true } : advice
            ));
        } catch (e) {
            showToast("Greška pri prijavi savjeta!", 'success');
        }
    };

    const handlePostComment = async (adviceId, content) => {
        if (content.trim() === '') return false;
        try {
            await adviceService.postComment(adviceId, content);
            await fetchComments(adviceId); 
            return true; 
        } catch (e) {
            alert('Greška pri slanju komentara: ' + e);
            return false;
        }
    };

    const handleReportComment = async (commentId, adviceId) => {
        try {
            await adviceService.reportComment(commentId);
            showToast("Komentar je uspješno prijavljen!", 'success');
            setAllComments(prev => ({
                ...prev,
                [adviceId]: (prev[adviceId] || []).map(comment =>
                    comment.id === commentId ? { ...comment, reported: true } : comment
                )
            }));
        } catch (e) {
            showToast("Greška pri prijavi komentara!", 'success');
        }
    };

    const handleDeleteComment = async (commentId, adviceId) => {
        if (!window.confirm("Jeste li sigurni da želite obrisati ovaj komentar?")) return;
        try {
            await adviceService.deleteComment(commentId);
            alert('Komentar uspješno obrisan.');
            
            setAllComments(prev => {
                const updatedComments = (prev[adviceId] || []).filter(c => c.id !== commentId);
                const newCount = updatedComments.length;
                
                setAdvices(prevAdvices => prevAdvices.map(advice => 
                    advice.id === adviceId ? { ...advice, commentsCount: newCount } : advice
                ));

                return { ...prev, [adviceId]: updatedComments };
            });
        } catch (e) {
            alert('Greška pri brisanju komentara: ' + e);
        }
    };
    
    useEffect(() => {
        fetchAdvices();
    }, [fetchAdvices]);

    if (isLoading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingContainer}>
                    <PenTool size={40} color={PRIMARY_ACCENT} style={{animation: 'spin 1.5s linear infinite'}} />
                    <p style={styles.loadingText}>Učitavanje savjeta...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (error) {
        return <div style={styles.container}><p style={{color: 'red'}}>Greška pri učitavanju: {error}</p></div>;
    }

    return (
        <div style={styles.container}>
            {toast && <Toast message={toast.message} type={toast.type} />}
            
            <div style={styles.contentWrapper}>
                <button 
                    onClick={onBack} 
                    style={{...styles.backButton, ...(hoverBack ? styles.backButtonHover : {})}}
                    onMouseEnter={() => setHoverBack(true)}
                    onMouseLeave={() => setHoverBack(false)}
                >
                    <ChevronLeft size={18} /> Nazad na predmete
                </button>

                <header style={styles.header}>
                    <h1 style={styles.headerTitle}>
                        <MessageSquare size={32} /> Savjeti za {subjectName} ({year}. god)
                    </h1>
                    <p style={styles.headerSubtitle}>Podijelite svoje znanje i iskustvo sa ostalima.</p>
                </header>

                <form onSubmit={handlePostAdvice} style={styles.postForm}>
                    <div style={styles.formHeader}>
                        <PenTool size={20} />
                        <span>Novi savjet</span>
                    </div>
                    <textarea
                        style={styles.textArea}
                        placeholder="Unesite svoj savjet ili pitanje ovdje..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        disabled={isPostSubmitting}
                    />
                    <button
                        type="submit"
                        style={{
                            ...styles.submitButton,
                            opacity: isPostSubmitting || newPostContent.trim() === '' ? 0.6 : 1,
                            cursor: isPostSubmitting || newPostContent.trim() === '' ? 'not-allowed' : 'pointer',
                        }}
                        disabled={isPostSubmitting || newPostContent.trim() === ''}
                    >
                        <Send size={16} /> {isPostSubmitting ? 'Šaljem...' : 'Objavi Savjet'}
                    </button>
                </form>

                <div style={styles.adviceList}>
                    {advices.length === 0 ? (
                        <div style={styles.noAdviceContainer}>
                            <span role="img" aria-label="lightbulb" style={styles.noAdviceIcon}>💡</span>
                            <p style={styles.noAdviceText}>Nema postova za prikaz.</p>
                            <p style={styles.noAdviceSubtext}>Budite prvi koji će podijeliti savjet!</p>
                        </div>
                    ) : (
                        advices.map(advice => (
                            <AdvicePostComponent
                                key={advice.id}
                                advice={advice}
                                isMineStyle={advice.myAdvice ? styles.myAdviceStyle : {}}
                                expandedComments={expandedComments}
                                allComments={allComments}
                                toggleComments={() => toggleComments(advice.id)}
                                handleToggleLike={() => handleToggleLike(advice.id)}
                                handleReportAdvice={() => handleReportAdvice(advice.id)}
                                handleDeleteAdvice={() => handleDeleteAdvice(advice.id)}
                                handlePostComment={handlePostComment}
                                handleReportComment={handleReportComment}
                                handleDeleteComment={handleDeleteComment}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        minHeight: '100vh',
        //background: BACKGROUND_GRADIENT,
        background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 50%, #2a1f5e 100%)',
        padding: '25px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    contentWrapper: {
        maxWidth: '1000px',
        margin: '0 auto',
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '12px 24px',
        borderRadius: '10px',
        cursor: 'pointer',
        marginBottom: '25px',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        outline: 'none',
    },
    backButtonHover: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderColor: PRIMARY_ACCENT,
    },
    header: {
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    },
    headerTitle: {
        color: 'white',
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    headerSubtitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        fontWeight: '500',
        margin: 0,
    },
    postForm: {
        marginBottom: '35px',
        backgroundColor: 'rgba(26, 35, 126, 0.5)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    formHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '16px',
        fontWeight: '600',
    },
    textArea: {
        width: '100%',
        padding: '16px',
        marginBottom: '16px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        minHeight: '110px',
        resize: 'vertical',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: '#1a237e',
        fontSize: '14px',
        fontFamily: 'inherit',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxSizing: 'border-box',
    },
    submitButton: {
        backgroundColor: PRIMARY_ACCENT,
        color: '#1a237e',
        border: 'none',
        padding: '13px 28px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(96, 224, 22, 0.3)',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    myAdviceStyle: {
        border: `3px solid ${PRIMARY_ACCENT}`, 
        boxShadow: `0 0 18px rgba(96, 224, 22, 0.6), inset 0 0 10px rgba(96, 224, 22, 0.2)`, 
        backgroundColor: 'rgba(96, 224, 22, 0.12)', 
    },
    adviceList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 20px',
        gap: '20px',
    },
    loadingText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '15px',
        margin: 0,
    },
    noAdviceContainer: {
        textAlign: 'center',
        padding: '60px 30px',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    noAdviceText: {
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        margin: '0 0 8px 0',
    },
    noAdviceSubtext: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        margin: 0,
    },
    noAdviceIcon: {
        fontSize: '30px',
        marginBottom: '10px',
    }
};

export default AdviceDisplay;
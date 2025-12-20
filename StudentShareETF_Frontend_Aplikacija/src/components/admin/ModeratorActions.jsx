import { useState, useEffect } from 'react';
import { Zap, X, Trash2, Shield } from 'lucide-react';
import Toast from '../Toast';
import { getAllModeratorActionsApi } from '../../services/moderatorActionsService';

function ModeratorActions() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [toast, setToast] = useState(null);
  const [actions, setActions] = useState([]);

  const showToast = (message, type = 'success', duration = 5000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year}. u ${hours}:${minutes}h`;
  };

  const handleActionClick = async (action) => {
    setSelectedAction(action);
  };

  const getAllModeratorActions = async () => {
    try {
      const response = await getAllModeratorActionsApi();
      setActions(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteAction = async (e, action) => {
    e.stopPropagation();
    // Implement delete functionality here
    showToast('Akcija je obrisana', 'success');
  };

  const closeModal = () => {
    setSelectedAction(null);
  };

  const sortedActions = [...actions].sort((a, b) => {
    const aDate = new Date(a.dateTime);
    const bDate = new Date(b.dateTime);
    return bDate - aDate;
  });

  useEffect(() => {
    getAllModeratorActions();
  }, []);

  return (
    <>
      <div style={styles.container}>
        {toast && <Toast message={toast.message} type={toast.type} />}
        
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.iconWrapper}>
              <Zap size={28} color="#ff6b35" strokeWidth={2.5} />
            </div>
            <h2 style={styles.title}>Akcije moderatora</h2>
          </div>
          {sortedActions.length > 0 && (
            <div style={styles.badge}>
              {sortedActions.length}
            </div>
          )}
        </div>

        <div style={styles.actionsList}>
          {sortedActions.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIconWrapper}>
                <Shield size={64} color="rgba(255, 107, 53, 0.3)" strokeWidth={1.5} />
              </div>
              <p style={styles.emptyStateText}>Nema zabilježenih akcija</p>
              <p style={styles.emptyStateSubtext}>
                Akcije moderatora će biti prikazane ovdje
              </p>
            </div>
          ) : (
            sortedActions.map((action, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <div
                  key={action.id}
                  style={{
                    ...styles.actionItem,
                    ...(isHovered ? styles.actionItemHover : {}),
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleActionClick(action)}
                >
                  <div style={styles.actionIndicator}></div>
                  
                  <div style={styles.actionContent}>
                    <h3 style={styles.actionTitle}>{action.description}</h3>
                    <p style={styles.actionDate}>{formatDateTime(action.dateTime)}</p>
                  </div>

                  {isHovered && (
                    <button
                      style={styles.deleteButton}
                      onClick={(e) => handleDeleteAction(e, action)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Trash2 size={18} color="#ef4444" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedAction && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalHeaderContent}>
                <div style={styles.modalIconWrapper}>
                  <Zap size={24} color="#ff6b35" strokeWidth={2.5} />
                </div>
                <h2 style={styles.modalTitle}>{selectedAction.description}</h2>
              </div>
              <button 
                style={styles.closeButton} 
                onClick={closeModal}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 107, 53, 0.2)';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <X size={24} color="#ffffff" />
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.modalSection}>
                <p style={styles.modalLabel}>Vrijeme akcije</p>
                <p style={styles.modalValue}>{formatDateTime(selectedAction.dateTime)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 107, 53, 0.05)',
    border: '1px solid rgba(255, 107, 53, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '2px solid rgba(255, 107, 53, 0.2)',
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  iconWrapper: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
  },

  title: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.5px',
  },

  badge: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    color: '#1a1a2e',
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: '700',
    boxShadow: '0 6px 16px rgba(255, 107, 53, 0.4)',
    minWidth: '40px',
    textAlign: 'center',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  },

  actionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '8px',
  },

  actionItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    cursor: 'pointer',
    position: 'relative',
    outline: 'none',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    boxSizing: 'border-box',
  },

  actionItemHover: {
    background: 'rgba(255, 107, 53, 0.1)',
    //borderColor: 'rgba(255, 255, 255, 0.25)',
    outline: 'none',
  },

  actionIndicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    marginTop: '6px',
    flexShrink: 0,
    boxShadow: '0 0 12px rgba(255, 107, 53, 0.6)',
    transition: 'all 0.3s ease',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '20px',
  },

  emptyIconWrapper: {
    background: 'rgba(255, 107, 53, 0.08)',
    borderRadius: '50%',
    padding: '24px',
    marginBottom: '8px',
  },

  emptyStateText: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.3px',
  },

  emptyStateSubtext: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
    letterSpacing: '0.3px',
  },

  actionContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  actionTitle: {
    color: '#ff6b35',
    fontSize: '16px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.3px',
    lineHeight: '1.4',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  },

  actionDate: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
    letterSpacing: '0.3px',
  },

  deleteButton: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.3s ease',
  },

  modal: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    borderRadius: '24px',
    padding: '36px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 107, 53, 0.1)',
    border: '2px solid rgba(255, 107, 53, 0.3)',
    animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(255, 107, 53, 0.2)',
  },

  modalHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
  },

  modalIconWrapper: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    borderRadius: '12px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
  },

  modalTitle: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.5px',
    lineHeight: '1.3',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  },

  closeButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  },

  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  modalSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  modalLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },

  modalValue: {
    color: '#ff6b35',
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.3px',
  },

  divider: {
    height: '1px',
    background: 'rgba(255, 107, 53, 0.2)',
    margin: '4px 0',
  },

  modalDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    fontWeight: '500',
    margin: 0,
    lineHeight: '1.7',
    letterSpacing: '0.3px',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  },
};

export default ModeratorActions;
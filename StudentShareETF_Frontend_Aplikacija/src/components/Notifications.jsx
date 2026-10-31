import { useState, useEffect } from 'react';
import { Bell, X, Trash2 } from 'lucide-react';
import Toast from './Toast';
import ConfirmationModal from './ConfirmationModal';
import { deleteNotificationApi, setReadNotification, getNotificationsPageApi } from '../services/notificationsService';

const PAGE_SIZE = 10;

function NotificationsPanel({ setUnreadNotifications }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState(null);
  const [message, setMessage] = useState("");
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
  }

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const updateUnreadTotal = (count) => {
    setUnreadTotal(count);
    setUnreadNotifications(count);
  };

  const loadNotifications = async (pageCursor) => {
    setLoading(true);
    try {
      const response = await getNotificationsPageApi(PAGE_SIZE, pageCursor);
      const newItems = response.content;
      setNotifications(prev => {
        const base = pageCursor ? prev : [];
        const existingIds = new Set(base.map(n => n.notificationId));
        return [...base, ...newItems.filter(n => !existingIds.has(n.notificationId))];
      });
      if (newItems.length > 0) {
        setCursor(newItems[newItems.length - 1]);
      }
      setHasNext(response.hasNext);
      setTotalElements(response.totalElements);
      updateUnreadTotal(response.unreadCount);
      setLoaded(true);
    } catch (err) {
      console.log(err);
      showToast("Greška pri učitavanju obavještenja", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (loading || !hasNext) return;
    loadNotifications(cursor);
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    try{
        await setReadNotification(notification.notificationId);
        setNotifications(prevNotifications =>
            prevNotifications.map(n =>
                n.notificationId === notification.notificationId
                ? { ...n, read: true }
                : n
            )
        );
        if (!notification.read) {
          updateUnreadTotal(Math.max(unreadTotal - 1, 0));
        }
    } catch (err){
        console.log(err);
        showToast(`${err}`, 'error');
    }
  };

  const handleDeleteNotification = async (notification) => {
    try{
      const response = await deleteNotificationApi(notification.notificationId);
      setNotifications(prevNotifications => prevNotifications.filter(notificationPrev => notificationPrev.notificationId !== notification.notificationId));
      setTotalElements(prev => Math.max(prev - 1, 0));
      if (!notification.read) {
        updateUnreadTotal(Math.max(unreadTotal - 1, 0));
      }
      showToast(response, "success");
    } catch (err){
      console.log(err);
      showToast(`${err}`, 'error');
    }
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    const aIsRead = a.read;
    const bIsRead = b.read;

    if (aIsRead !== bIsRead) {
        return aIsRead ? 1 : -1;
    }

    const aDate = new Date(a.activeFrom);
    const bDate = new Date(b.activeFrom);

    return bDate - aDate;
  });

  useEffect(() => {
      loadNotifications(null);
  }, []);

  return (
    <>
      <div style={styles.container}>
        <ConfirmationModal 
          isOpen={confirmModalOpen}
          onConfirm={onConfirm}
          message={message}
          onCancel={handleCloseConfirmModal}
        />
        {toast && <Toast message={toast.message} type={toast.type} />}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <Bell size={24} color="#60e016" />
            <h2 style={styles.title}>Obavještenja</h2>
          </div>
          <div style={styles.badge}>{unreadTotal}</div>
        </div>

        <div style={styles.notificationsList}>
        {!loaded && loading ? (
          <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>Učitavanje...</p>
          </div>
        ) : sortedNotifications.length === 0 ? (
          <div style={styles.emptyState}>
              <Bell size={48} color="rgba(96, 224, 22, 0.3)" />
              <p style={styles.emptyStateText}>Nema novih notifikacija</p>
          </div>
        ) : (
          sortedNotifications.map((notification, index) => {
            const isRead = notification.read;
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={notification.notificationId}
                style={{
                  ...styles.notificationItem,
                  ...(isHovered ? styles.notificationItemHover : {}),
                  ...(isRead ? {} : styles.notificationItemUnread)
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleNotificationClick(notification)}
              >
                <div style={{
                  ...styles.notificationDot,
                  ...(isRead ? styles.notificationDotRead : {})
                }}></div>
                <div style={styles.notificationContent}>
                  <h3 style={styles.notificationTitle}>{notification.title.includes("Podsjetnik za obavezu!") ? "Podsjetnik za obavezu!" : notification.title}</h3>
                  <p style={styles.notificationText}>{notification.message}</p>
                </div>
                {isHovered && (
                  <button
                    style={styles.deleteButton}
                    onClick={(e) => {
                                e.stopPropagation();
                                setMessage("obrisati obavještenje?");
                                setOnConfirm(() => () => handleDeleteNotification(notification));
                                setConfirmModalOpen(true)
                              }
                    }
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </button>
                )}
              </div>
            );
          })
        )}
        {loaded && sortedNotifications.length > 0 && (
          <div style={styles.loadMoreRow}>
            <span style={styles.loadMoreInfo}>
              Prikazano {sortedNotifications.length} od {totalElements}
            </span>
            {hasNext && (
              <button
                style={styles.loadMoreButton}
                disabled={loading}
                onClick={handleLoadMore}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(96, 224, 22, 0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(96, 224, 22, 0.1)'}
              >
                {loading ? 'Učitavanje...' : 'Učitaj još'}
              </button>
            )}
          </div>
        )}
        </div>
      </div>

      {selectedNotification && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalHeaderContent}>
                <Bell size={24} color="#60e016" />
                <h2 style={styles.modalTitle}>{selectedNotification.title.includes("Podsjetnik za obavezu!") ? "Podsjetnik za obavezu!" : selectedNotification.title}</h2>
              </div>
              <button style={styles.closeButton} onClick={closeModal}>
                <X size={24} color="#ffffff" />
              </button>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.modalMessage}>{selectedNotification.message}</p>
              <div style={styles.divider}></div>
              <p style={styles.modalDescription}>Vrijeme: {selectedNotification.activeFrom}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 50%, #2a1f5e 100%)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(96, 224, 22, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    minHeight: '100%',
    boxSizing: 'border-box'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(96, 224, 22, 0.2)',
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  title: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.5px',
  },

  badge: {
    background: 'linear-gradient(135deg, #60e016 0%, #4ec70f 100%)',
    color: '#0a1457',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(96, 224, 22, 0.3)',
    minWidth: '32px',
    textAlign: 'center',
  },

  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  loadMoreRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 4px',
    gap: '12px',
  },

  loadMoreInfo: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
  },

  loadMoreButton: {
    background: 'rgba(96, 224, 22, 0.1)',
    color: '#60e016',
    border: '2px solid rgba(96, 224, 22, 0.3)',
    padding: '8px 18px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },

  notificationItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    cursor: 'pointer',
  },

  notificationItemUnread: {
    border: '2px solid #60e016',
    boxShadow: '0 0 12px rgba(96, 224, 22, 0.3)',
  },

  notificationItemHover: {
    background: 'rgba(96, 224, 22, 0.15)',
    transform: 'translateX(4px)',
    boxShadow: '0 4px 16px rgba(96, 224, 22, 0.2)',
  },

  notificationDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#60e016',
    marginTop: '6px',
    flexShrink: 0,
    boxShadow: '0 0 8px rgba(96, 224, 22, 0.5)',
    transition: 'all 0.3s ease',
  },

  notificationDotRead: {
    background: 'rgba(255, 255, 255, 0.3)',
    boxShadow: 'none',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
  },

  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '16px',
    fontWeight: '500',
    margin: 0,
    letterSpacing: '0.3px',
  },

  notificationContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  notificationTitle: {
    color: '#60e016',
    fontSize: '15px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.3px',
  },

  notificationText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
    lineHeight: '1.6',
    letterSpacing: '0.3px',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },

  modal: {
    background: 'linear-gradient(180deg, #0a1457 0%, #1a1f6b 100%)',
    borderRadius: '20px',
    padding: '32px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '2px solid rgba(96, 224, 22, 0.3)',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid rgba(96, 224, 22, 0.2)',
  },

  modalHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  modalTitle: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.5px',
  },

  closeButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },

  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  modalMessage: {
    color: '#60e016',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    lineHeight: '1.6',
    letterSpacing: '0.3px',
  },

  divider: {
    height: '1px',
    background: 'rgba(96, 224, 22, 0.2)',
    margin: '8px 0',
  },

  modalDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '15px',
    fontWeight: '500',
    margin: 0,
    lineHeight: '1.8',
    letterSpacing: '0.3px',
  },

  deleteButton: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  },
};

export default NotificationsPanel;
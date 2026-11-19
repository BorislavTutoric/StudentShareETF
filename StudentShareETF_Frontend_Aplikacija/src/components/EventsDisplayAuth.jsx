import React, { useEffect, useState } from "react";
import EventCardAuth from "./EventCardAuth";
import EventModalAuth from "./EventModalAuth";
import EventCreateModal from "./EventCreateModal";
import Toast from "./Toast";
import { getAllEvents } from "../services/eventService"

function EventsDisplayAuth() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      console.log("Loaded events:", data);
      setEvents(data);
    } catch (err) {
      console.error('Greška:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Učitavanje događaja...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={styles.container}>
        {toast && <Toast message={toast.message} type={toast.type} />}
        <div style={styles.headerSection}>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>📅 Događaji</h1>
            <p style={styles.headerSubtitle}>Upravljaj i prati sve nadolazeće događaje</p>
          </div>
          <button style={styles.addButton} onClick={() => setShowCreateModal(true)}>
            + Dodaj događaj
          </button>
        </div>

        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>Trenutno nema dostupnih događaja</p>
        </div>

        {showCreateModal && (
          <EventCreateModal
            onClose={() => setShowCreateModal(false)}
            onCreated={loadEvents}
            showToast={showToast}
          />
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div style={styles.headerSection}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>📅 Događaji</h1>
          <p style={styles.headerSubtitle}>Prati sve nadolazeće događaje</p>
        </div>
        <button style={styles.addButton} onClick={() => setShowCreateModal(true)}>
          + Dodaj događaj
        </button>
      </div>

      <div style={styles.eventsGrid}>
        {events.map(event => (
          <EventCardAuth
            key={event.dogadjajId}
            event={event}
            onClick={() => setSelectedEvent(event)}
          />
        ))}
      </div>

      {selectedEvent && (
        <EventModalAuth
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {showCreateModal && (
        <EventCreateModal
          onClose={() => setShowCreateModal(false)}
          onCreated={loadEvents}
          showToast={showToast}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    padding: "20px 40px 30px 40px",
    boxSizing: "border-box",
    minHeight: "auto",
    position: "relative",
  },

  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    padding: "20px 30px",
    background: "linear-gradient(135deg, rgba(96, 224, 22, 0.08) 0%, rgba(96, 224, 22, 0.04) 100%)",
    borderRadius: "16px",
    border: "2px solid rgba(96, 224, 22, 0.2)",
    backdropFilter: "blur(10px)",
  },

  headerContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
    flex: 1,
  },

  headerTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#60e016",
    margin: 0,
    letterSpacing: "0.5px",
    textShadow: "0 2px 4px rgba(96, 224, 22, 0.3)",
  },

  headerSubtitle: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.6)",
    margin: 0,
    fontWeight: "500",
    letterSpacing: "0.3px",
  },

  addButton: {
    backgroundColor: "#60e016",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "700",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 8px rgba(96, 224, 22, 0.3)",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  eventsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255, 255, 255, 0.3)",
    borderTop: "5px solid #60e016",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: "20px",
    fontSize: "18px",
    color: "white",
    fontWeight: "600",
  },

  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    padding: "20px",
  },

  errorText: {
    fontSize: "18px",
    color: "#ef4444",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "20px 30px",
    borderRadius: "12px",
    fontWeight: "600",
  },

  emptyContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },

  emptyText: {
    fontSize: "20px",
    color: "white",
    fontWeight: "600",
  },
};

export default EventsDisplayAuth; 

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
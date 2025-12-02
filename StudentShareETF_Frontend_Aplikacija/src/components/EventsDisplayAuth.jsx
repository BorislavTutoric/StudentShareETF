import React, { useEffect, useState } from "react";
import { getAllEvents } from "../services/eventService"
import EventCardAuth from "./EventCardAuth";
import EventModalAuth from "./EventModalAuth";
import EventCreateModal from "./EventCreateModal";

export default function EventsDisplayAuth() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <button style={styles.addButton} onClick={() => setShowCreateModal(true)}>
          + Dodaj događaj
        </button>

        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>Trenutno nema dostupnih događaja</p>
        </div>

        {showCreateModal && (
          <EventCreateModal
            onClose={() => setShowCreateModal(false)}
            onCreated={loadEvents}
          />
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.buttonContainer}>
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
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    padding: "10px 40px 30px 40px",
    boxSizing: "border-box",
    minHeight: "auto",
    position: "relative",
  },

  buttonContainer: {
    position: "absolute",
    top: "10px",
    right: "40px",
    zIndex: 10,
  },

  header: {
    textAlign: "center",
    marginBottom: "20px",
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
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },

  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
    marginTop: '10px',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },

  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(255, 255, 255, 0.3)',
    borderTop: '5px solid #60e016',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: 'white',
    fontWeight: '600',
  },

  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '20px',
  },

  errorText: {
    fontSize: '18px',
    color: '#ef4444',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px 30px',
    borderRadius: '12px',
    fontWeight: '600',
  },

  emptyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },

  emptyText: {
    fontSize: '20px',
    color: 'white',
    fontWeight: '600',
  },
};

// Dodaj CSS animaciju za spinner
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
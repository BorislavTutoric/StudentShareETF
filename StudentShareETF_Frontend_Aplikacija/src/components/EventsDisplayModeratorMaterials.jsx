import React, { useEffect, useState } from "react";
import EventCardModeratorMaterials from "./moderators/materials/EventCardModeratorMaterials";
import EventModalModeratorMaterials from "./moderators/materials/EventModalModeratorMaterials";
import { getAllEvents } from "../services/eventService";

function EventsDisplayModeratorMaterials() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
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

  return (
    <div style={styles.container}>
      <div style={styles.eventsGrid}>
        {events.length === 0 ? <p style={styles.emptyText}>Nema aktivnih dogadjaja!</p>: ""}
        {events.map(event => (
          <EventCardModeratorMaterials
            key={event.dogadjajId}
            event={event}
            onClick={() => setSelectedEvent(event)}
          />
        ))}
      </div>

      {selectedEvent && (
        <EventModalModeratorMaterials
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    padding: "0px 40px 30px 40px",
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

  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
    marginTop: '60px',
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
    borderTop: '5px solid #6366f1',
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

  emptyText: {
    fontSize: '20px',
    color: 'white',
    fontWeight: '600',
  },
};

export default EventsDisplayModeratorMaterials;

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
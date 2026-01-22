import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import EventModal from "./EventModal";
import { getAllEvents } from "../services/eventService"

function EventsDisplay() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error('Greška:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
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
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>Trenutno nema dostupnih događaja</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.eventsGrid}>
        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => setSelectedEvent(event)}
          />
        ))}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    minHeight: 'calc(100vh - 100px)',
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)",
    padding: '40px 20px',
    boxSizing: 'border-box',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '30px',
    maxWidth: '1400px',
    margin: '0 auto',
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

export default EventsDisplay;
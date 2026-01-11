import React, { useState } from 'react';
import { Image } from 'lucide-react';

function EventCardModerator({ event, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        {event.slikaUrl ? (
          <>
            <img
              src={event.slikaUrl}
              alt={event.naziv}
              style={styles.cardImage}
            />
            <div style={styles.imageOverlay} />
          </>
        ) : (
          <div style={styles.placeholderContainer}>
            <Image size={40} style={styles.placeholderIcon} />
            <p style={styles.placeholderText}>Nema slike</p>
          </div>
        )}
      </div>

      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{event.naziv}</h3>
        
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Naziv:</span>
          <span style={styles.infoValue}>{event.naziv}</span>
        </div>
        
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Autor:</span>
          <span style={styles.infoValue}>{event.username}</span>
        </div>
        
        <button style={styles.viewMoreButton}>
          Više informacija
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ddd6fe',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.1)',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '210px',
    overflow: 'hidden',
    backgroundColor: '#e0e7ff',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a5b4fc',
    background: 'linear-gradient(135deg, #a5b4fc 0%, #8b5cf6 100%)',
  },
  placeholderIcon: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '6px',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
  },
  cardContent: {
    padding: '15px',
    backgroundColor: '#ddd6fe',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '12px',
    lineHeight: '1.3',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    paddingBottom: '6px',
    borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
  },
  infoLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4b5563',
  },
  infoValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'right',
  },
  viewMoreButton: {
    marginTop: '12px',
    width: '100%',
    padding: '10px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default EventCardModerator;
import React, { useState } from 'react';

function EventCard({ event, onClick }) {
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
      {event.slikaUrl && (
        <div style={styles.imageContainer}>
          <img
            src={event.slikaUrl}
            alt={event.naziv}
            style={styles.cardImage}
          />
          <div style={styles.imageOverlay}></div>
        </div>
      )}
      
      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{event.naziv}</h3>
        
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Naziv:</span>
          <span style={styles.infoValue}>{event.naziv}</span>
        </div>
        
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Autor:</span>
          <span style={styles.infoValue}>{event.autor}</span>
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
    backgroundColor: '#ffffffdd',
    borderRadius: '20px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    border: '2px solid #000000',
  },
  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
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
  cardContent: {
    padding: '20px',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '700',
    fontFamily: 'Times New Roman, serif',
    color: '#1f2937',
    marginBottom: '15px',
    lineHeight: '1.3',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e5e7eb',
  },
  infoLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'right',
  },
  viewMoreButton: {
    marginTop: '15px',
    width: '100%',
    padding: '12px',
    backgroundColor: '#60e016',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default EventCard;
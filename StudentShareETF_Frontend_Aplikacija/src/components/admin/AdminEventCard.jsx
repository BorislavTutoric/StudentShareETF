import React, { useState } from 'react';
import { Image } from 'lucide-react';

function AdminEventCard({ event, onClick }) {
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
    backgroundColor: 'rgba(26, 42, 94, 0.4)',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 107, 53, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 40px rgba(255, 107, 53, 0.2)',
    borderColor: 'rgba(255, 107, 53, 0.4)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '210px',
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 20, 87, 0.5)',
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
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(26, 33, 46, 0.6) 100%)',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(247, 166, 0, 0.3) 100%)',
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
    backgroundColor: 'rgba(22, 33, 62, 0.5)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '12px',
    lineHeight: '1.3',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    paddingBottom: '6px',
    borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
  },
  infoLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'right',
  },
  viewMoreButton: {
    marginTop: '12px',
    width: '100%',
    padding: '10px',
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    color: '#ff6b35',
    border: '2px solid rgba(255, 107, 53, 0.4)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default AdminEventCard;
import React, { useState } from 'react';
import { getMaterial } from '../../services/materialsService';

function AdminMaterialsDisplay({ materials, isOpen, onClose, subjectName }) {
  const [expandedSections, setExpandedSections] = useState({
    predavanja: true,
    vjezbe: true,
    rokovi: true,
    ostalo: true
  });

  if (!isOpen) return null;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMaterialClick = async (id) => {
    try {
      const url = await getMaterial(id);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  const renderMaterialsList = (arr) => {
    if (!arr.length) return <p style={styles.emptyMessage}>Nema dostupnih materijala</p>;
    return (
      <ul style={styles.materialsList}>
        {arr.map(mat => (
          <li key={mat.materialId} style={styles.materialItem}>
            <div style={styles.materialRow}>
              <span
                style={styles.materialText}
                onClick={() => handleMaterialClick(mat.materialId)}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ff6b35';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#ffffff';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                📄 {mat.name}
              </span>
              
              <div style={styles.actionsContainer}>
                <button
                  style={styles.actionButton}
                  title="Preuzmi"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMaterialClick(mat.materialId);
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.15)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ⬇️
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const categories = {
    predavanja: materials.filter(m => m.category === 'Predavanja'),
    vjezbe: materials.filter(m => m.category === 'Vježbe'),
    rokovi: materials.filter(m => m.category === 'Rokovi'),
    ostalo: materials.filter(m => m.category === 'Ostalo')
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <button
          style={styles.backButton}
          title="Nazad"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
            e.target.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
            e.target.style.transform = 'translateX(0)';
          }}
          onClick={onClose}
        >
          ← Nazad
        </button>

        <div style={styles.titleContainer}>
          <div style={styles.titleIcon}>📚</div>
          <div style={styles.titleWrapper}>
            <span style={styles.titleLabel}>Predmet</span>
            <h2 style={styles.title}>{subjectName || 'Odaberi predmet'}</h2>
          </div>
        </div>
      </div>

      {Object.keys(categories).map(cat => (
        <div key={cat} style={styles.section}>
          <div 
            style={styles.sectionHeader} 
            onClick={() => toggleSection(cat)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.08)';
            }}
          >
            <h3 style={styles.sectionTitle}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </h3>
            <button 
              style={styles.toggleButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ff6b35';
                e.target.style.color = '#0a1457';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
                e.target.style.color = '#ff6b35';
              }}
            >
              {expandedSections[cat] ? '−' : '+'}
            </button>
          </div>
          {expandedSections[cat] && (
            <div style={styles.contentWrapper}>
              {renderMaterialsList(categories[cat])}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '100vw',
    minHeight: '100vh',
    padding: '20px 30px',
    boxSizing: 'border-box',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '0 10px',
    gap: '20px',
  },
  backButton: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    color: '#ff6b35',
    border: '2px solid rgba(255, 107, 53, 0.3)',
    padding: '10px 16px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
    padding: '20px 30px',
    borderRadius: '16px',
    border: '2px solid rgba(255, 107, 53, 0.2)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    flex: 1,
    maxWidth: '70%',
  },
  titleIcon: {
    fontSize: '48px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    animation: 'float 3s ease-in-out infinite',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  titleLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '0.5px',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  section: {
    width: '100%',
    marginBottom: '20px',
    backgroundColor: 'rgba(26, 42, 94, 0.4)',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 107, 53, 0.1)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgba(255, 107, 53, 0.15)',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: '#ff6b35',
    letterSpacing: '0.5px',
    textTransform: 'capitalize',
  },
  toggleButton: {
    border: '2px solid #ff6b35',
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#ff6b35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    transition: 'all 0.3s ease',
  },
  contentWrapper: {
    backgroundColor: 'rgba(10, 20, 87, 0.3)',
  },
  materialsList: {
    listStyle: 'none',
    margin: 0,
    padding: '12px 24px',
  },
  materialItem: {
    padding: '12px 0',
    borderBottom: '1px solid rgba(255, 107, 53, 0.1)',
  },
  materialRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  materialText: {
    cursor: 'pointer',
    fontWeight: '500',
    color: '#ffffff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    flex: 1,
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '6px 10px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessage: {
    padding: '16px 24px',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '15px',
  }
};

export default AdminMaterialsDisplay;
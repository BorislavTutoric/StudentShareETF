import React, { useState } from 'react';
import { getMaterial, getComments, deleteMaterial } from '../../../services/materialsService';
import ModeratorMaterialsCommentsSection from './ModeratorMaterialsCommentsSection';
import Toast from '../../Toast';
import { Trash2 } from 'lucide-react';

function ModeratorMaterialsHomeDisplay({ materials, isOpen, onClose, subjectName, materialsAvgRatings, onMaterialDeleted }) {
  const [expandedSections, setExpandedSections] = useState({
    predavanja: true,
    vjezbe: true,
    rokovi: true,
    ostalo: true
  });

  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState("");
  const [currentMaterialId, setCurrentMaterialId] = useState(null);
  const [allMaterialComments, setAllMaterialComments] = useState([]);
  const [toast, setToast] = useState(null);
  const [showDeleteMaterialConfirm, setShowDeleteMaterialConfirm] = useState(null);
  const [avgRatings, setAvgRatings] = useState(materialsAvgRatings || []);
  const [localMaterials, setLocalMaterials] = useState(materials);

  React.useEffect(() => {
    setLocalMaterials(materials);
  }, [materials]);

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .materials-scrollable::-webkit-scrollbar {
        width: 10px;
      }
      .materials-scrollable::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        margin: 4px;
      }
      .materials-scrollable::-webkit-scrollbar-thumb {
        background: #6366f1;
        border-radius: 5px;
      }
      .materials-scrollable::-webkit-scrollbar-thumb:hover {
        background: #818cf8;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const showToast = (message, type = 'success', duration = 5000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const handleOpenCommentSection = async (materialName, matId) => {
    try {
      const commentsResponse = await getComments(matId);
      setAllMaterialComments(commentsResponse);
      setCurrentMaterialId(matId);
      setCurrentMaterial(materialName);
      setIsCommentSectionOpen(true);
    } catch (err) {
      console.error(err);
      showToast("Greška pri učitavanju komentara", 'error');
    }
  };

  const handleCloseCommentSection = () => {
    setIsCommentSectionOpen(false);
    setAllMaterialComments([]);
  };

  const getMaterialAvgRating = (materialId) => {
    const rating = avgRatings.find(avg => avg.materialId === materialId);
    return rating ? Number(rating.averageRating).toFixed(1) : null; 
  };

  const handleDeleteMaterial = async () => {
    if (!showDeleteMaterialConfirm) return;
    
    try {
      await deleteMaterial(showDeleteMaterialConfirm.id);
      
      // Ukloni materijal iz lokalne liste
      setLocalMaterials(prevMaterials => 
        prevMaterials.filter(mat => mat.materialId !== showDeleteMaterialConfirm.id)
      );
      
      // Ukloni prosečnu ocenu materijala
      setAvgRatings(prevRatings => 
        prevRatings.filter(rating => rating.materialId !== showDeleteMaterialConfirm.id)
      );
      
      showToast(`Materijal "${showDeleteMaterialConfirm.name}" je uspješno obrisan!`, 'success');
      setShowDeleteMaterialConfirm(null);
      
      // Opcionalno: pozovi callback nakon kratke pauze
      if (onMaterialDeleted) {
        setTimeout(() => {
          onMaterialDeleted();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      showToast('Greška pri brisanju materijala!', 'error');
      setShowDeleteMaterialConfirm(null);
    }
  };

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
      showToast("Greška pri otvaranju materijala", 'error');
    }
  };

  const renderMaterialsList = (arr) => {
    if (!arr.length) return <p style={styles.emptyMessage}>Nema dostupnih materijala</p>;
    
    return (
      <ul style={styles.materialsList}>
        {arr.map(mat => {
          const avgRating = getMaterialAvgRating(mat.materialId);
          
          return (
            <li key={mat.materialId} style={styles.materialItem}>
              <div style={styles.materialRow}>
                <span
                  style={styles.materialText}
                  onClick={() => handleMaterialClick(mat.materialId)}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#8b5cf6';
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
                    title="Komentari"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCommentSection(mat.name, mat.materialId);
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.15)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    💬
                  </button>

                  <button
                    style={styles.actionButton}
                    title="Preuzmi"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMaterialClick(mat.materialId);
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.15)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    ⬇️
                  </button>

                  {avgRating && (
                    <div style={styles.ratingDisplay}>
                      <span style={styles.starIcon}>★</span>
                      <span style={styles.ratingText}>{avgRating}</span>
                    </div>
                  )}

                  <button
                    style={styles.deleteButton}
                    title="Obriši materijal"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteMaterialConfirm({ id: mat.materialId, name: mat.name });
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ef4444';
                      e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(239, 68, 68, 0.7)';
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const categories = {
    predavanja: localMaterials.filter(m => m.category === 'Predavanja'),
    vjezbe: localMaterials.filter(m => m.category === 'Vježbe'),
    rokovi: localMaterials.filter(m => m.category === 'Rokovi'),
    ostalo: localMaterials.filter(m => m.category === 'Ostalo')
  };

  return (
    <div style={styles.outerContainer}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <ModeratorMaterialsCommentsSection 
        isOpen={isCommentSectionOpen}
        onClose={handleCloseCommentSection}
        documentName={currentMaterial}
        materialId={currentMaterialId}
        showToast={showToast}
        allMaterialComments={allMaterialComments}
        setAllMaterialComments={setAllMaterialComments}
      />

      <div style={styles.scrollWrapper} className="materials-scrollable">
        <div style={styles.container}>
          <div style={styles.headerRow}>
            <button
              style={styles.backButton}
              title="Nazad"
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(139, 92, 246, 0.25)';
                e.target.style.transform = 'translateX(-4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
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
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(168, 85, 247, 0.10) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)';
                }}
              >
                <h3 style={styles.sectionTitle}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </h3>
                <button 
                  style={styles.toggleButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#8b5cf6';
                    e.target.style.color = '#ffffff';
                    e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.color = '#8b5cf6';
                    e.target.style.boxShadow = 'none';
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
      </div>

      {/* Potvrda za brisanje materijala */}
      {showDeleteMaterialConfirm && (
        <div style={styles.confirmOverlay} onClick={() => setShowDeleteMaterialConfirm(null)}>
          <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.confirmTitle}>Potvrda brisanja materijala</h3>
            <p style={styles.confirmText}>
              Da li ste sigurni da želite obrisati materijal <strong>"{showDeleteMaterialConfirm.name}"</strong>?
              <br /><br />
              Ova akcija je nepovratna i obrisaće sve komentare i recenzije vezane za materijal.
            </p>
            <div style={styles.confirmButtons}>
              <button 
                style={styles.confirmCancelBtn} 
                onClick={() => setShowDeleteMaterialConfirm(null)}
              >
                Otkaži
              </button>
              <button 
                style={styles.confirmDeleteBtn} 
                onClick={handleDeleteMaterial}
              >
                Obriši materijal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  outerContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  scrollWrapper: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'thin',
    scrollbarColor: '#6366f1 rgba(255,255,255,0.1)',
    padding: '0 8px 0 0',
  },
  container: {
    width: '100%',
    padding: '32px 24px 32px 32px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  backButton: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#8b5cf6',
    border: '2px solid rgba(139, 92, 246, 0.3)',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.3s ease',
    letterSpacing: '0.3px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
    padding: '20px 30px',
    borderRadius: '12px',
    border: '2px solid rgba(139, 92, 246, 0.25)',
    backdropFilter: 'blur(10px)',
    flex: 1,
    maxWidth: '70%',
  },
  titleIcon: {
    fontSize: '48px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  titleLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '0.3px',
  },
  section: {
    width: '100%',
    marginBottom: '12px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
    borderRadius: '14px',
    border: '2px solid rgba(139, 92, 246, 0.25)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#8b5cf6',
    letterSpacing: '0.3px',
    textTransform: 'capitalize',
  },
  toggleButton: {
    border: '2px solid rgba(139, 92, 246, 0.3)',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#8b5cf6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    transition: 'all 0.3s ease',
  },
  contentWrapper: {
    background: 'rgba(0, 0, 0, 0.15)',
  },
  materialsList: {
    listStyle: 'none',
    margin: 0,
    padding: '12px 24px',
  },
  materialItem: {
    padding: '12px 0',
    borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
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
    fontSize: '14px',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    flex: 1,
    letterSpacing: '0.3px',
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
    fontSize: '14px',
  },

  ratingDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    borderRadius: '6px',
    marginLeft: '8px',
  },

  starIcon: {
    fontSize: '18px',
    color: '#facc15',
  },

  ratingText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#facc15',
  },

  deleteButton: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(239, 68, 68, 0.7)',
    cursor: 'pointer',
    padding: '6px 10px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Confirmation Dialog Styles
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
  },

  confirmDialog: {
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 100%)',
    border: '2px solid rgba(138, 43, 226, 0.5)',
    borderRadius: '20px',
    padding: '35px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  },

  confirmTitle: {
    color: '#8a2be2',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 20px 0',
    textAlign: 'center',
  },

  confirmText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    margin: '0 0 30px 0',
    textAlign: 'center',
    lineHeight: '1.6',
  },

  confirmButtons: {
    display: 'flex',
    gap: '15px',
  },

  confirmCancelBtn: {
    flex: 1,
    padding: '14px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  confirmDeleteBtn: {
    flex: 1,
    padding: '14px',
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    border: '2px solid #f87171',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default ModeratorMaterialsHomeDisplay;
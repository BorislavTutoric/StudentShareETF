import React, { useState } from 'react';
import { getComments, getMaterial, getReviews, saveMaterialApi } from '../services/materialsService';
import DocumentUploadForm from './DocumentUploadForm';
import CommentsSection from './CommentsSection';
import Toast from './Toast';

function MaterialsStudentDisplay({ materials, isOpen, onClose, subjectName, materialsAvgRatings }) {
  const [expandedSections, setExpandedSections] = useState({
    predavanja: true,
    vjezbe: true,
    rokovi: true,
    ostalo: true
  });
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState("");
  const [toast, setToast] = useState(null);
  const [currentMaterialId, setCurrentMaterialId] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [allMaterialComments, setAllMaterialComments] = useState([]);
  const [avgRatings, setAvgRatings] = useState(materialsAvgRatings);

  const showToast = (message, type = 'success', duration = 10000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const getMaterialAvgRating = (materialId) => {
    const rating = avgRatings.find(avg => avg.materialId === materialId);
    return rating ? Number(rating.averageRating).toFixed(1) : null; 
  };

  const setMaterialNewAvgRating = (materialId, newRating) => {
    setAvgRatings(prev => 
      prev.map(rating => 
        rating.materialId === materialId ? { ...rating, averageRating: newRating } : rating
      )
    );
  }

  const handleOpenForm = () => setIsUploadFormOpen(true);
  const handleCloseForm = () => setIsUploadFormOpen(false);

  const handleOpenCommentSection = (materialName, matId) => {
    getAllMaterialCommentsAndReviews(matId);
    setCurrentMaterialId(matId);
    setCurrentMaterial(materialName);
    setIsCommentSectionOpen(true);
  }
  const handleCloseCommentSection = () => setIsCommentSectionOpen(false);

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

  const getAllMaterialCommentsAndReviews = async (materialId) => {
    try{
      const [reviewsResponse, commentsResponse] = await Promise.all([
        getReviews(materialId),
        getComments(materialId)
      ]);
      setAllReviews(reviewsResponse);
      setAllMaterialComments(commentsResponse);
    } catch(err){
      console.error(err);
      showToast("Greška pri ucitavanju komentara i recenzija", 'error');
    }
  }

  const handleSaveMaterial = async (materialId, name) => {
    try{
      const response = await saveMaterialApi(materialId);
      showToast(`Uspješno ste sačuvali materijal: ${name}`, 'success');
    }catch(err){
      console.error(err);
      showToast(`Greška: ${err}`, 'error');
    }
  }

  const renderStarRating = (materialId) => {
    const avgRating = getMaterialAvgRating(materialId);
    if (!avgRating) return null;

    const rating = parseFloat(avgRating);
    
    return (
      <div style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => {
          let starDisplay = '☆';
          let starColor = '#6b7280';
          let starShadow = 'none';

          if (star <= Math.floor(rating)) {
            starDisplay = '★';
            starColor = '#facc15';
            starShadow = '0 2px 6px rgba(250, 204, 21, 0.3)';
          } else if (star === Math.ceil(rating) && rating % 1 !== 0) {
            starDisplay = '⯨';
            starColor = '#facc15';
            starShadow = '0 2px 6px rgba(250, 204, 21, 0.3)';
          }

          return (
            <button
              key={star}
              style={{
                ...styles.starButton,
                color: starColor,
                textShadow: starShadow,
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {starDisplay}
            </button>
          );
        })}
        <span style={styles.ratingText}>{avgRating}</span>
      </div>
    );
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
                  e.target.style.color = '#60e016';
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
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(96, 224, 22, 0.15)'}
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
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(96, 224, 22, 0.15)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ⬇️
                </button>

                <button
                  style={styles.saveButton}
                  title="Sačuvaj"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveMaterial(mat.materialId, mat.name);
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(96, 224, 22, 0.15)';
                    e.target.textContent = '🔖';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.textContent = '📑';
                  }}
                >
                  📑
                </button>

                {renderStarRating(mat.materialId)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const categories = {
    predavanja: materials.filter(m => m.category === 'predavanja'),
    vjezbe: materials.filter(m => m.category === 'vjezbe'),
    rokovi: materials.filter(m => m.category === 'rokovi'),
    ostalo: materials.filter(m => m.category === 'ostalo')
  };

  return (
    <div style={styles.container}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <DocumentUploadForm 
        isOpen={isUploadFormOpen}
        onClose={handleCloseForm}
        subjectName={subjectName}
        onUploadSuccess={() => showToast('Zahtjev za upload materijal uspješno poslat!', 'success')}
        onUploadError={(err) => showToast(`Greška: ${err}`, 'error')}
      />

      <CommentsSection 
        isOpen={isCommentSectionOpen}
        onClose={handleCloseCommentSection}
        documentName={currentMaterial}
        showToast={showToast}
        materialId={currentMaterialId}
        allReviews={allReviews}
        setAllReviews={setAllReviews}
        setNewRating={setMaterialNewAvgRating}
        allMaterialComments={allMaterialComments}
        setAllMaterialComments={setAllMaterialComments}
      />
      
      <div style={styles.headerRow}>
        <button
          style={styles.backButton}
          title="Nazad"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(96, 224, 22, 0.2)';
            e.target.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(96, 224, 22, 0.1)';
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
        <button 
          style={styles.addButton}
          onClick={handleOpenForm}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#50c012';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(96, 224, 22, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#60e016';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 8px rgba(96, 224, 22, 0.3)';
          }}
        >
          + Dodaj materijal
        </button>
      </div>

      {Object.keys(categories).map(cat => (
        <div key={cat} style={styles.section}>
          <div 
            style={styles.sectionHeader} 
            onClick={() => toggleSection(cat)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(96, 224, 22, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(96, 224, 22, 0.08)';
            }}
          >
            <h3 style={styles.sectionTitle}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </h3>
            <button 
              style={styles.toggleButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#60e016';
                e.target.style.color = '#0a1457';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(96, 224, 22, 0.2)';
                e.target.style.color = '#60e016';
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
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 50%, #2a1f5e 100%)',
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
    backgroundColor: 'rgba(96, 224, 22, 0.1)',
    color: '#60e016',
    border: '2px solid rgba(96, 224, 22, 0.3)',
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
    backgroundColor: 'rgba(96, 224, 22, 0.08)',
    padding: '20px 30px',
    borderRadius: '16px',
    border: '2px solid rgba(96, 224, 22, 0.2)',
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
    background: 'linear-gradient(135deg, #ffffff 0%, #60e016 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  addButton: {
    backgroundColor: '#60e016',
    color: '#0a1457',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: '0 4px 8px rgba(96, 224, 22, 0.3)',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px',
    flexShrink: 0,
  },
  section: {
    width: '100%',
    marginBottom: '20px',
    backgroundColor: 'rgba(26, 42, 94, 0.4)',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(96, 224, 22, 0.1)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    backgroundColor: 'rgba(96, 224, 22, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgba(96, 224, 22, 0.15)',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: '#60e016',
    letterSpacing: '0.5px',
    textTransform: 'capitalize',
  },
  toggleButton: {
    border: '2px solid #60e016',
    backgroundColor: 'rgba(96, 224, 22, 0.2)',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#60e016',
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
    borderBottom: '1px solid rgba(96, 224, 22, 0.1)',
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
  saveButton: {
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
    marginRight: '4px',
  },
  ratingContainer: {
    display: 'flex',
    gap: '2px',
    marginLeft: '8px',
    alignItems: 'center',
  },
  starButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '30px',
    cursor: 'pointer',
    padding: '2px',
    transition: 'transform 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#facc15',
    marginLeft: '6px',
    minWidth: '20px',
  },
  emptyMessage: {
    padding: '16px 24px',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '15px',
  }
};

export default MaterialsStudentDisplay;
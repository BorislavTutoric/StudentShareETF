import React, { useState } from 'react';
import DocumentUploadForm from './DocumentUploadForm';
import CommentsSection from './CommentsSection';
import Toast from './Toast';
import ConfirmationModal from './ConfirmationModal';
import { getComments, getMaterial, getReviews, saveMaterialApi } from '../services/materialsService';

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
  const [infoModal, setInfoModal] = useState({ isOpen: false, description: "" });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState(null);
  const [message, setMessage] = useState("");
  
  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
  }

  const showToast = (message, type = 'success', duration = 3000) => {
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

  const handleOpenInfo = (description) => {
    setInfoModal({ isOpen: true, description });
  }

  const handleCloseInfo = () => {
    setInfoModal({ isOpen: false, description: "" });
  }

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
      console.error(err.response.data);
      showToast(`${err.response.data}`, 'info');
    }
  }

  const renderStarRating = (materialId) => {
    const avgRating = getMaterialAvgRating(materialId);
    if (!avgRating) return null;

    const rating = parseFloat(avgRating);
    const fullStars = Math.floor(rating);
    const decimal = rating - fullStars;
  
    return (
      <div style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= fullStars) {
            return (
              <button
                key={star}
                style={{
                  ...styles.starButton,
                  color: '#facc15',
                  textShadow: '0 2px 6px rgba(250, 204, 21, 0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
              ★
              </button>
            );
          }
        
          if (star === fullStars + 1 && decimal > 0) {
            const fillPercentage = Math.round(decimal * 100);
            return (
              <span 
                key={star} 
                style={{ 
                  position: 'relative', 
                  display: 'inline-block',
                  fontSize: '30px',
                }}
              >
                <span style={{ color: '#6b7280' }}>★</span>
                <span 
                  style={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: 0, 
                    color: '#facc15',
                    overflow: 'hidden',
                    width: `${fillPercentage}%`,
                    textShadow: '0 2px 6px rgba(250, 204, 21, 0.3)',
                  }}
                >
                ★
                </span>
              </span>
            );
          }
        
          return (
            <button
              key={star}
              style={{
                ...styles.starButton,
                color: '#6b7280',
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              ★
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
                {mat.description && (
                  <button
                    style={styles.actionButton}
                    title="Opis"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenInfo(mat.description);
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(96, 224, 22, 0.15)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    ℹ️
                  </button>
                )}

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
                    setMessage(`sačuvati materijal: ${mat.name}`);
                    setOnConfirm(() => () => handleSaveMaterial(mat.materialId, mat.name));
                    setConfirmModalOpen(true)
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
    predavanja: materials.filter(m => m.category === 'Predavanja'),
    vjezbe: materials.filter(m => m.category === 'Vježbe'),
    rokovi: materials.filter(m => m.category === 'Rokovi'),
    ostalo: materials.filter(m => m.category === 'Ostalo')
  };

  return (
    <div style={styles.container}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {infoModal.isOpen && (
        <div style={styles.infoModalOverlay} onClick={handleCloseInfo}>
          <div style={styles.infoModalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.infoModalHeader}>
              <h3 style={styles.infoModalTitle}>Opis materijala</h3>
              <button 
                style={styles.infoModalCloseBtn}
                onClick={handleCloseInfo}
              >
                ✕
              </button>
            </div>
            <div style={styles.infoModalBody}>
              <p style={styles.infoModalText}>{infoModal.description}</p>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal 
          isOpen={confirmModalOpen}
          onConfirm={onConfirm}
          message={message}
          onCancel={handleCloseConfirmModal}
      />
      
      <DocumentUploadForm 
        isOpen={isUploadFormOpen}
        onClose={handleCloseForm}
        subjectName={subjectName}
        onUploadSuccess={() => showToast('Zahtjev za upload materijala uspješno poslat!', 'success')}
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
  },
  infoModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  infoModalContent: {
    backgroundColor: 'linear-gradient(135deg, #2a3f7e 0%, #1a2d5f 100%)',
    borderRadius: '16px',
    border: '2px solid rgba(96, 224, 22, 0.3)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    background: 'linear-gradient(135deg, #2a3f7e 0%, #1a2d5f 100%)',
  },
  infoModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid rgba(96, 224, 22, 0.2)',
    backgroundColor: 'rgba(96, 224, 22, 0.1)',
  },
  infoModalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#60e016',
    margin: 0,
    letterSpacing: '0.5px',
  },
  infoModalCloseBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#60e016',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
  },
  infoModalBody: {
    padding: '24px',
  },
  infoModalText: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6',
    margin: 0,
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
};

export default MaterialsStudentDisplay;
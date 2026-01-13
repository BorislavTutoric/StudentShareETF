import React, { useState } from 'react';
import { getMaterial } from '../services/materialsService';
import { AlignCenter } from 'lucide-react';

function MaterialsDisplay({ materials, isOpen, subjectName, back }) {
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

  const handleBackButton = () => {
    back();
  }

  const handleMaterialClick = async (id) => {
    try {
      const url = await getMaterial(id);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Greška pri otvaranju materijala");
    }
  };

  const renderMaterialsList = (arr) => {
    if (!arr.length) return <p style={styles.emptyMessage}>Nema dostupnih materijala</p>;
    return (
      <ul style={styles.materialsList}>
        {arr.map(mat => (
          <li key={mat.materialId} style={styles.materialItem}>
            <span
              style={styles.materialText}
              onClick={() => handleMaterialClick(mat.materialId)}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              📄 {mat.name}
            </span>
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
      <div style={styles.headerWrapper}>
        <button style={styles.backButton} onClick={handleBackButton}>← Nazad na predmete</button>
        <h2 style={styles.title}>{subjectName || 'Odaberi predmet'}</h2>
      </div>
      {Object.keys(categories).map(cat => (
        <div key={cat} style={styles.section}>
          <div style={styles.sectionHeader} onClick={() => toggleSection(cat)}>
            <h3 style={styles.sectionTitle}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
            <button style={styles.toggleButton}>{expandedSections[cat] ? '−' : '+'}</button>
          </div>
          {expandedSections[cat] && renderMaterialsList(categories[cat])}
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
    padding: '30px 40px',
    boxSizing: 'border-box',
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)"
  },
  headerWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '25px'
  },
  backButton: {
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid #fff',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '50px',
    height: '45px'
  },
  title: {
    fontSize: '35px',
    fontWeight: '900',
    color: '#fff',
    wordBreak: 'break-word',
    margin: 0
  },
  section: {
    width: '95%',
    maxWidth: '100vw',
    marginBottom: '25px',
    marginLeft: '20px',
    backgroundColor: '#d4f6daff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    boxSizing: 'border-box',
    overflow: 'hidden'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: "#60e016",
    color: 'white',
    cursor: 'pointer',
    borderRadius: '8px',
    boxSizing: 'border-box'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '800',
    wordBreak: 'break-word'
  },
  toggleButton: {
    border: 'none',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    fontSize: '20px',
    cursor: 'pointer',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  materialsList: {
    listStyle: 'none',
    margin: 0,
    padding: '12px 0 12px 25px',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    wordBreak: 'break-word',
    overflowWrap: 'break-word'
  },
  materialItem: {
    padding: '6px 0',
    borderBottom: '1px solid #ddd'
  },
  materialText: {
    cursor: 'pointer',
    fontWeight: 500,
    color: '#1a0dab',
    transition: '0.2s'
  },
  emptyMessage: {
    padding: '10px 0 10px 25px',
    fontStyle: 'italic',
    color: '#666',
    wordBreak: 'break-word'
  }
};

export default MaterialsDisplay;
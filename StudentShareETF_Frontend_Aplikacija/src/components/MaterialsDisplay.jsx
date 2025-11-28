import React, { useState } from 'react';
import { getMaterial } from '../services/materialsService';

function MaterialsDisplay({ materials, isOpen, subjectName }) {
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
    predavanja: materials.filter(m => m.category === 'predavanja'),
    vjezbe: materials.filter(m => m.category === 'vjezbe'),
    rokovi: materials.filter(m => m.category === 'rokovi'),
    ostalo: materials.filter(m => m.category === 'ostalo')
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{subjectName || 'Odaberi predmet'}</h2>
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
  title: {
    fontSize: '30px',
    fontWeight: '700',
    marginLeft: '20px',
    marginBottom: '25px',
    color: '#fff',
    wordBreak: 'break-word'
  },
  section: {
    width: '95%',
    maxWidth: '100vw',
    //padding: '10px 15px',
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

import React, { useState } from 'react';

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

  const handleMaterialClick = (material) => {
    console.log('Kliknut materijal:', material);
  };

  const renderMaterialsList = (arr) => {
    if (!arr.length) return <p style={styles.emptyMessage}>Nema dostupnih materijala</p>;
    return (
      <ul style={styles.materialsList}>
        {arr.map(mat => (
          <li key={mat.id} style={styles.materialItem} onClick={() => handleMaterialClick(mat)}>
            {mat.naziv}
          </li>
        ))}
      </ul>
    );
  };

  const categories = {
    predavanja: materials.filter(m => m.kategorija === 'predavanja'),
    vjezbe: materials.filter(m => m.kategorija === 'vjezbe'),
    rokovi: materials.filter(m => m.kategorija === 'rokovi'),
    ostalo: materials.filter(m => m.kategorija === 'ostalo')
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
  container: { padding: '20px', width: '100%', background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)" },
  title: { fontSize: '28px', fontWeight: '700', marginBottom: '20px' },
  section: { marginBottom: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  sectionHeader: { padding: "0 20px", display: 'flex', justifyContent: 'space-between', padding: '10px 15px', backgroundColor: '#4fc3f7', color: 'white', cursor: 'pointer' },
  sectionTitle: { margin: 0 },
  toggleButton: { border: 'none', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', width: '30px', height: '30px', fontSize: '20px', cursor: 'pointer' },
  materialsList: { listStyle: 'none', margin: 0, padding: '10px 15px' },
  materialItem: { padding: '8px 0', borderBottom: '1px solid #ddd', cursor: 'pointer' },
  emptyMessage: { padding: '10px', fontStyle: 'italic', color: '#666' }
};

export default MaterialsDisplay;

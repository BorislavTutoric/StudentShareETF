import { useEffect, useState } from 'react';
import { Filter, X } from 'lucide-react';

function FilterComponent({ isOpen, onClose, setMySubjects, setAllSubjects, subjectsView}) {
  const [selectedView, setSelectedView] = useState(subjectsView);

  const handleViewChange = (view) => {
    setSelectedView(view);
    if(view === "all")
    {
        setAllSubjects();
    }else{
        setMySubjects();
    }
  };

  useEffect(() => {
      setSelectedView(subjectsView);
  }, [subjectsView]);

  if (!isOpen) return null;

  return (
    <div style={styles.filterBubble}>
      <div style={styles.header}>
        <Filter size={20} style={{ color: '#0a1457' }} />
        <span style={styles.title}>Filtriraj</span>
        <button
          onClick={onClose}
          style={styles.closeBtn}
        >
          <X size={16} />
        </button>
      </div>

      <div style={styles.divider}></div>

      <div style={styles.optionsContainer}>
        <label style={styles.option}>
          <input
            type="radio"
            name="view"
            value="all"
            checked={selectedView === 'all'}
            onChange={() => { 
                handleViewChange('all'); 
            }}
            style={styles.radio}
          />
          <span style={styles.optionText}>Svi predmeti</span>
        </label>

        <label style={styles.option}>
          <input
            type="radio"
            name="view"
            value="my"
            checked={selectedView === 'my'}
            onChange={() => {
                handleViewChange('my');
            }}
            style={styles.radio}
          />
          <span style={styles.optionText}>Moji predmeti</span>
        </label>
      </div>

      <div style={styles.arrow}></div>
    </div>
  );
}

const styles = {
  filterBubble: {
    position: 'absolute',
    top: '270px',
    right: '100px',
    backgroundColor: '#a8d5ba',
    borderRadius: '20px',
    padding: '16px 20px',
    minWidth: '200px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    zIndex: 999,
    border: '2px solid rgba(10, 20, 87, 0.1)',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    justifyContent: 'space-between',
  },

  title: {
    color: '#0a1457',
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },

  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#0a1457',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    borderRadius: '4px',
  },

  divider: {
    height: '1px',
    backgroundColor: 'rgba(10, 20, 87, 0.2)',
    marginBottom: '12px',
  },

  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    padding: '8px 0',
  },

  radio: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#0a1457',
  },

  optionText: {
    color: '#0a1457',
    fontSize: '14px',
    fontWeight: '600',
  },

  arrow: {
    position: 'absolute',
    top: '-8px',
    right: '30px',
    width: '16px',
    height: '16px',
    backgroundColor: '#a8d5ba',
    transform: 'rotate(45deg)',
    border: '2px solid rgba(10, 20, 87, 0.1)',
    borderBottom: 'none',
    borderLeft: 'none',
  },
};

export default FilterComponent;
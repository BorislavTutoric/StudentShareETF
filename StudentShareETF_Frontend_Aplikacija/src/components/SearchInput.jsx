import { Search, X } from 'lucide-react';

function SearchInput({ value, onChange, clearFunction}) {
  
  const handleClear = () => {
    clearFunction();
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchWrapper}>
        <Search size={20} style={styles.icon} />
        <input
          type="text"
          placeholder="Unesi naziv"
          value={value}
          onChange={onChange}
          style={styles.input}
        />
        {value && (
          <button
            onClick={handleClear}
            style={styles.clearButton}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '0px',
    display: 'flex',
    justifyContent: 'center',
  },
  searchWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '16px',
    color: '#999',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    fontSize: '15px',
    border: 'none',
    borderRadius: '25px',
    backgroundColor: '#f0f0f0',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    color: 'black'
  },
  clearButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    transition: 'color 0.2s ease',
  },
};

export default SearchInput;
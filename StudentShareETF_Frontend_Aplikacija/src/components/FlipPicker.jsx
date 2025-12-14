import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

function FlipPicker({ value, onChange, min, max, customStyles }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value).padStart(2, '0'));

  const handleUp = () => {
    const newValue = (value + 1) % (max + 1);
    onChange(newValue);
  };

  const handleDown = () => {
    const newValue = value === min ? max : value - 1;
    onChange(newValue);
  };

  const handleClick = () => {
    setIsEditing(true);
    setInputValue('');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    let num = parseInt(inputValue, 10);

    if (isNaN(num)) {
      setIsEditing(false);
      return;
    }

    if (num < min) num = min;
    if (num > max) num = max;

    onChange(num);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const mergedStyles = { ...styles, ...customStyles };

  return (
    <div style={mergedStyles.container}>
      <button 
        onClick={handleUp}
        style={mergedStyles.button}
      >
        <ChevronUp size={18} strokeWidth={3} stroke="white" />
      </button>

      <div 
        onClick={handleClick}
        style={mergedStyles.flipPickerContainer}
      >
        {isEditing ? (
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputSubmit}
            onKeyDown={handleKeyDown}
            min={min}
            max={max}
            autoFocus
            style={mergedStyles.input}
          />
        ) : (
          <div style={mergedStyles.flipNumberActive}>
            {String(value).padStart(2, '0')}
          </div>
        )}
      </div>

      <button 
        onClick={handleDown}
        style={mergedStyles.button}
      >
        <ChevronDown size={18} strokeWidth={3} stroke="white" />
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px'
  },
  button: {
    background: '#007AFF',
    border: 'none',
    color: 'white',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s'
  },
  flipPickerContainer: {
    fontSize: '32px',
    fontWeight: 'bold',
    minWidth: '70px',
    textAlign: 'center',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  },
  flipNumberActive: {
    fontSize: '32px',
    fontWeight: 'bold'
  },
  input: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    border: '2px solid #007AFF',
    borderRadius: '4px',
    padding: '6px',
    width: '70px'
  }
};

export default FlipPicker;

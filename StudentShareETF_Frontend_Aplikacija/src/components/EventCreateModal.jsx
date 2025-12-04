import React, { useState } from "react";
import { X } from 'lucide-react';
import { createEvent } from '../services/eventService'; 

export default function EventCreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventDataToSend = {
      ...form,
      time: form.time.trim() === "" ? null : form.time
    };

    try {
      await createEvent(eventDataToSend);
      onCreated();
      onClose();
    } catch (error) {
      console.error("Greška prilikom kreiranja događaja:", error);
      alert("Došlo je do greške!");
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h1 style={styles.modalTitle}>📅 Dodaj novi događaj</h1>
          <button 
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div style={styles.scrollContainer}>
          <div style={styles.formContainer}>
            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Naziv</label>
                <input
                  style={styles.input}
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Unesite naziv događaja"
                  onFocus={(e) => e.target.style.borderColor = '#60e016'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(96, 224, 22, 0.3)'}
                  required
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Mjesto</label>
                <input
                  style={styles.input}
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Unesite mjesto održavanja"
                  onFocus={(e) => e.target.style.borderColor = '#60e016'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(96, 224, 22, 0.3)'}
                  required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.column}>
                <label style={styles.label}>Datum</label>
                <input
                  type="date"
                  style={styles.input}
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  onFocus={(e) => e.target.style.borderColor = '#60e016'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(96, 224, 22, 0.3)'}
                  required
                />
              </div>
              <div style={styles.column}>
                <label style={styles.label}>Vrijeme (opciono)</label>
                <input
                  type="time"
                  style={styles.input}
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  onFocus={(e) => e.target.style.borderColor = '#60e016'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(96, 224, 22, 0.3)'}
                />
              </div>
            </div>

            <label style={styles.label}>Opis</label>
            <textarea
              style={styles.textarea}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Unesite kratak opis događaja..."
              onFocus={(e) => e.target.style.borderColor = '#60e016'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(96, 224, 22, 0.3)'}
              required
            />

            <label style={styles.label}>Slika (opciono)</label>
            <input
              type="file"
              style={styles.input}
              name="image"
              accept="image/*"
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = '#60e016'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(96, 224, 22, 0.3)'}
            />
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={handleSubmit}
            style={styles.submitButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#50c012';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(96, 224, 22, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#60e016';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(96, 224, 22, 0.3)';
            }}
          >
            Kreiraj događaj
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 3000,
  },
  modalCard: {
    background: 'linear-gradient(135deg, #1a2a5e 0%, #0a1457 100%)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '2px solid rgba(96, 224, 22, 0.2)',
    maxWidth: '650px',
    width: '100%',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(96, 224, 22, 0.1)',
    borderRadius: '16px 16px 0 0',
    padding: '16px 24px',
    border: '1px solid rgba(96, 224, 22, 0.2)',
    borderBottom: 'none',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '0.5px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    color: '#60e016',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    overflowY: 'auto',
    padding: '20px 24px',
    flex: 1,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid rgba(96, 224, 22, 0.3)',
    borderRadius: '10px',
    backgroundColor: 'rgba(197, 224, 175, 1)',
    color: '#0a1457',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s',
    fontWeight: '500',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '10px 14px',
    border: '2px solid rgba(96, 224, 22, 0.3)',
    borderRadius: '10px',
    backgroundColor: 'rgba(197, 224, 175, 1)',
    color: '#0a1457',
    fontSize: '15px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.3s',
    fontWeight: '500',
    boxSizing: 'border-box',
  },
  label: {
    display: 'block',
    color: '#ffffff',
    fontWeight: 600,
    marginBottom: '6px',
    fontSize: '15px',
  },
  buttonContainer: {
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid rgba(96, 224, 22, 0.2)',
  },
  submitButton: {
    backgroundColor: '#60e016',
    color: '#0a1457',
    fontWeight: 700,
    fontSize: '15px',
    padding: '12px 36px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(96, 224, 22, 0.3)',
    transition: 'all 0.3s',
    letterSpacing: '0.5px',
  },
};

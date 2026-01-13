import React, { useState, useEffect } from "react";
import { Search, UserCheck, UserX } from 'lucide-react';
import { moderatorActionService } from "../../services/moderatorActionsService";
import Toast from './../Toast';

export default function ModeratorStudentsManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await moderatorActionService.getAllStudents();
        setStudents(data);
      } catch (err) {
        console.error(err);
        showToast("Greška pri učitavanju studenata", 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStatusChange = async (student) => {
    const trenutniStatus = student.active || student.aktivan;
    const noviStatus = trenutniStatus ? 0 : 1;
    const id = student.userId || student.korisnikId;

    try {
      await moderatorActionService.toggleStudentStatus(id, noviStatus);
      setStudents(prev => prev.map(s => {
        const sId = s.userId || s.korisnikId;
        if (sId === id) {
          return s.active !== undefined 
            ? { ...s, active: !trenutniStatus } 
            : { ...s, aktivan: noviStatus };
        }
        return s;
      }));
      showToast(
        noviStatus === 1 ? "Student je uspješno aktiviran!" : "Student je uspješno suspendovan!",
        'success'
      );
      setConfirmAction(null);
    } catch (err) {
      console.error(err);
      showToast("Greška pri promjeni statusa", 'error');
    }
  };

  const getFilteredList = () => {
    let list = [...students];

    // Primeni pretragu
    const searchLower = searchTerm.toLowerCase();
    list = list.filter(student => {
      const name = student.name || student.ime || '';
      const surname = student.surname || student.prezime || '';
      const username = student.username || '';
      
      return (
        name.toLowerCase().includes(searchLower) ||
        surname.toLowerCase().includes(searchLower) ||
        username.toLowerCase().includes(searchLower)
      );
    });

    // Primeni filter
    if (statusFilter === 'aktivni') {
      list = list.filter(s => s.active === true || s.aktivan === 1 || s.active === 1);
    } else if (statusFilter === 'neaktivni') {
      list = list.filter(s => s.active === false || s.aktivan === 0 || s.active === 0);
    }

    return list;
  };

  const filteredList = getFilteredList();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Učitavanje studentskih naloga...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header sa pretraguom */}
      <div style={styles.headerRow}>
        <div style={styles.searchContainer}>
          <Search size={20} color="rgba(255, 255, 255, 0.5)" />
          <input
            type="text"
            placeholder="Pretraži po imenu, prezimenu ili korisničkom imenu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Filteri */}
      <div style={styles.filterContainer}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Filtriraj studente:</span>
          <div style={styles.filterButtons}>
            <button
              style={{
                ...styles.filterBtn,
                ...(statusFilter === 'all' ? styles.filterBtnActive : {})
              }}
              onClick={() => setStatusFilter('all')}
            >
              Svi ({students.length})
            </button>
            <button
              style={{
                ...styles.filterBtn,
                ...(statusFilter === 'aktivni' ? styles.filterBtnActive : {})
              }}
              onClick={() => setStatusFilter('aktivni')}
            >
              <UserCheck size={16} /> Aktivni
            </button>
            <button
              style={{
                ...styles.filterBtn,
                ...(statusFilter === 'neaktivni' ? styles.filterBtnActive : {})
              }}
              onClick={() => setStatusFilter('neaktivni')}
            >
              <UserX size={16} /> Suspendovani
            </button>
          </div>
        </div>
      </div>

      {/* Lista studenata */}
      <div style={styles.listContainer}>
        {filteredList.length > 0 ? (
          filteredList.map((student) => {
            const id = student.userId || student.korisnikId;
            const firstName = student.name || student.ime || '';
            const lastName = student.surname || student.prezime || '';
            const fullName = `${firstName} ${lastName}`.trim();
            const isActive = student.active === true || student.aktivan === 1 || student.active === 1;

            return (
              <div key={id} style={styles.studentCard}>
                <div style={styles.studentInfo}>
                  <div style={styles.studentHeader}>
                    <span style={styles.studentName}>{fullName}</span>
                    <span style={{
                      ...styles.statusBadge,
                      ...(isActive ? styles.statusActive : styles.statusInactive)
                    }}>
                      {isActive ? '✓ Aktivan' : '✕ Suspendovan'}
                    </span>
                  </div>
                  <div style={styles.studentDetails}>
                    {firstName && (
                      <div style={styles.detail}>
                        <span style={styles.label}>Ime:</span>
                        <span style={styles.value}>{firstName}</span>
                      </div>
                    )}
                    {lastName && (
                      <div style={styles.detail}>
                        <span style={styles.label}>Prezime:</span>
                        <span style={styles.value}>{lastName}</span>
                      </div>
                    )}
                    {student.username && (
                      <div style={styles.detail}>
                        <span style={styles.label}>Korisničko ime:</span>
                        <span style={styles.value}>{student.username}</span>
                      </div>
                    )}
                    {student.email && (
                      <div style={styles.detail}>
                        <span style={styles.label}>Email:</span>
                        <span style={styles.value}>{student.email}</span>
                      </div>
                    )}
                    {(student.userId || student.korisnikId) && (
                      <div style={styles.detail}>
                        <span style={styles.label}>ID:</span>
                        <span style={styles.value}>{id}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  style={{
                    ...styles.actionBtn,
                    ...(isActive ? styles.suspendBtn : styles.activateBtn)
                  }}
                  onClick={() => setConfirmAction({ student, isActive })}
                >
                  {isActive ? 'Suspenduj' : 'Aktiviraj'}
                </button>
              </div>
            );
          })
        ) : (
          <div style={styles.noResults}>
            <p>Nema pronađenih studenata</p>
          </div>
        )}
      </div>

      {/* Modal za potvrdu akcije */}
      {confirmAction && (
        <div style={styles.modalOverlay} onClick={() => setConfirmAction(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              {confirmAction.isActive ? 'Potvrdi suspenziju' : 'Potvrdi aktivaciju'}
            </h3>
            <p style={styles.modalText}>
              Da li si siguran da želiš {confirmAction.isActive ? 'suspendovati' : 'aktivirati'} ovaj nalog?
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelBtn}
                onClick={() => setConfirmAction(null)}
              >
                Otkaži
              </button>
              <button
                style={{
                  ...styles.confirmBtn,
                  ...(confirmAction.isActive ? styles.confirmSuspend : styles.confirmActivate)
                }}
                onClick={() => handleStatusChange(confirmAction.student)}
              >
                {confirmAction.isActive ? 'Suspenduj' : 'Aktiviraj'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '20px',
  },

  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(139, 92, 246, 0.2)',
    borderTop: '4px solid #8b5cf6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    fontWeight: '600',
  },

  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },

  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
    border: '2px solid rgba(139, 92, 246, 0.25)',
    borderRadius: '12px',
    padding: '12px 16px',
    backdropFilter: 'blur(10px)',
    flex: 1,
  },

  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    fontWeight: '500',
    fontFamily: 'inherit',
  },

  filterContainer: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    padding: '16px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(168, 85, 247, 0.05) 100%)',
    border: '2px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '12px',
  },

  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },

  filterLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    fontSize: '14px',
  },

  filterButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },

  filterBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '2px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '8px',
    padding: '8px 16px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  filterBtnActive: {
    background: '#8b5cf6',
    borderColor: '#8b5cf6',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
  },

  listContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '20px',
  },

  studentCard: {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
    border: '2px solid rgba(139, 92, 246, 0.25)',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },

  studentInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },

  studentHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },

  studentName: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '0.3px',
  },

  statusBadge: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },

  statusActive: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
  },

  statusInactive: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
  },

  studentDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  detail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    flexWrap: 'wrap',
  },

  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },

  value: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },

  actionBtn: {
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '13px',
    flexShrink: 0,
  },

  suspendBtn: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: '2px solid rgba(239, 68, 68, 0.4)',
    color: '#ef4444',
  },

  activateBtn: {
    background: 'rgba(34, 197, 94, 0.2)',
    border: '2px solid rgba(34, 197, 94, 0.4)',
    color: '#22c55e',
  },

  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '40px 20px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '16px',
  },

modalOverlay: {
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

  modal: {
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 100%)',
    border: '2px solid rgba(138, 43, 226, 0.5)',
    borderRadius: '20px',
    padding: '35px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  },

  modalTitle: {
    color: '#8a2be2',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 20px 0',
    textAlign: 'center',
  },

  modalText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    margin: '0 0 30px 0',
    textAlign: 'center',
    lineHeight: '1.6',
  },

  modalButtons: {
    display: 'flex',
    gap: '15px',
  },

  cancelBtn: {
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

  confirmBtn: {
    flex: 1,
    padding: '14px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  confirmSuspend: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    border: '2px solid #f87171',
  },

  confirmActivate: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    border: '2px solid #4ade80',
  },
};

// Dodaj CSS animaciju za spinner
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('style[data-spinner]')) {
  styleSheet.setAttribute('data-spinner', 'true');
  document.head.appendChild(styleSheet);
}
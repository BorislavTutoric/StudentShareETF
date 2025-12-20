import { act, useEffect, useState } from 'react';
import { Trash2, Plus, Search } from 'lucide-react';
import { deleteModeratorAccount, deleteStudentAccount, getModeratorAccounts, getStudentAccounts } from '../../services/accountsService';
import CreateAccountModal from './CreateAccountModal';
import Toast from '../Toast';

function AccountsManagement() {
  const [activeTab, setActiveTab] = useState('moderator');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [moderatorFilter, setModeratorFilter] = useState('all');
  const [studentFilter, setStudentFilter] = useState('all');
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [moderators, setModerators] = useState([]);

  const [students, setStudents] = useState([]);

  const showToast = (message, type = 'success', duration = 5000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const getAllAccounts = async () => {
    try{
        const [moderatorsResponse, studentsResponse] = await Promise.all([
            getModeratorAccounts(),
            getStudentAccounts()
        ]);
        setModerators(moderatorsResponse);
        setStudents(studentsResponse);
    }catch (err){
        console.error(err);
        showToast("Greška pri učitavanju naloga", 'error');
    }
  }

  const handleOpenCreateAccountModal = () => {
    setIsCreateAccountModalOpen(true);
  }

  const handleCloseCreateAccountModal = () => {
    setIsCreateAccountModalOpen(false);
  }

  const getFilteredList = () => {
    let list = activeTab === 'moderator' ? moderators : students;

    // Primeni pretragu
    const searchLower = searchTerm.toLowerCase();
    list = list.filter(item =>
      item.name.toLowerCase().includes(searchLower) ||
      item.surname.toLowerCase().includes(searchLower) ||
      item.username.toLowerCase().includes(searchLower)
    );

    // Primeni filter
    if (activeTab === 'moderator') {
      if (moderatorFilter === 'materijali') {
        list = list.filter(m => m.role === 'MODERATOR_ZA_MATERIJALE');
      } else if (moderatorFilter === 'dogadjaji') {
        list = list.filter(m => m.role === 'MODERATOR_ZA_DOGAĐAJE');
      }
    } else {
      if (studentFilter === 'aktivni') {
        list = list.filter(s => s.active);
      } else if (studentFilter === 'neaktivni') {
        list = list.filter(s => !s.active);
      }
    }

    return list;
  };

  const filteredList = getFilteredList();

  const handleDelete = async (id, type) => {
    try{
        let response;
        if (type === 'moderator') {
            response = await deleteModeratorAccount(id);
            setModerators(moderators.filter(m => m.id !== id));
        } else {
            response = await deleteStudentAccount(id);
            setStudents(students.filter(s => s.id !== id));
        }
        setDeleteConfirm(null);
        showToast(response, 'success');
    }catch(err){
        console.log(err);
        showToast("Greška pri brisanju naloga", 'error');
    }
  };

  useEffect(() => {
    getAllAccounts();
  }, [])

  return (
    <div style={styles.container}>
        {toast && <Toast message={toast.message} type={toast.type} />}
        <CreateAccountModal 
            isOpen={isCreateAccountModalOpen}
            onClose={handleCloseCreateAccountModal}
            setModerators={setModerators}
            showToast={showToast}
        />
      {/* Tabovi */}
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'moderator' ? styles.tabActive : {})
          }}
          onClick={() => {
            setActiveTab('moderator');
            setSearchTerm('');
            setModeratorFilter('all');
          }}
        >
          Moderatorski nalozi
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'student' ? styles.tabActive : {})
          }}
          onClick={() => {
            setActiveTab('student');
            setSearchTerm('');
            setStudentFilter('all');
          }}
        >
          Studentski nalozi
        </button>
      </div>

      {/* Header sa pretraguom i dugmetom */}
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
        {activeTab === 'moderator' && (<button style={styles.createBtn} onClick={handleOpenCreateAccountModal}>
          <Plus size={18} />
          Kreiraj nalog
        </button>)}
      </div>

      {/* Filteri */}
      <div style={styles.filterContainer}>
        {activeTab === 'moderator' ? (
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Filtriraj moderatore:</span>
            <div style={styles.filterButtons}>
              <button
                style={{
                  ...styles.filterBtn,
                  ...(moderatorFilter === 'all' ? styles.filterBtnActive : {})
                }}
                onClick={() => setModeratorFilter('all')}
              >
                Svi
              </button>
              <button
                style={{
                  ...styles.filterBtn,
                  ...(moderatorFilter === 'materijali' ? styles.filterBtnActive : {})
                }}
                onClick={() => setModeratorFilter('materijali')}
              >
                📚 Moderatori za materijale
              </button>
              <button
                style={{
                  ...styles.filterBtn,
                  ...(moderatorFilter === 'dogadjaji' ? styles.filterBtnActive : {})
                }}
                onClick={() => setModeratorFilter('dogadjaji')}
              >
                🎉 Moderatori za događaje
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Filtriraj studente:</span>
            <div style={styles.filterButtons}>
              <button
                style={{
                  ...styles.filterBtn,
                  ...(studentFilter === 'all' ? styles.filterBtnActive : {})
                }}
                onClick={() => setStudentFilter('all')}
              >
                Svi
              </button>
              <button
                style={{
                  ...styles.filterBtn,
                  ...(studentFilter === 'aktivni' ? styles.filterBtnActive : {})
                }}
                onClick={() => setStudentFilter('aktivni')}
              >
                ✓ Aktivni
              </button>
              <button
                style={{
                  ...styles.filterBtn,
                  ...(studentFilter === 'neaktivni' ? styles.filterBtnActive : {})
                }}
                onClick={() => setStudentFilter('neaktivni')}
              >
                ✕ Neaktivni
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista naloga */}
      <div style={styles.listContainer}>
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <div key={item.id} style={styles.accountCard}>
              <div style={styles.accountInfo}>
                <div style={styles.accountHeader}>
                  <span style={styles.accountName}>{item.name} {item.surname}</span>
                </div>
                <div style={styles.accountDetails}>
                  <div style={styles.detail}>
                    <span style={styles.label}>Jedinstveni identifikator:</span>
                    <span style={styles.value}>{item.id}</span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.label}>Korisničko ime:</span>
                    <span style={styles.value}>{item.username}</span>
                  </div>

                  {activeTab === 'moderator' ? (
                    <div style={styles.detail}>
                      <span style={styles.label}>Vrsta:</span>
                      <span style={{ ...styles.value, ...styles.typeTag }}>
                        {item.role}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div style={styles.detail}>
                        <span style={styles.label}>Email:</span>
                        <span style={styles.value}>{item.email}</span>
                      </div>
                      <div style={styles.detail}>
                        <span style={styles.label}>Status:</span>
                        <span style={{
                          ...styles.value,
                          ...styles.statusBadge,
                          ...(item.active ? styles.statusActive : styles.statusInactive)
                        }}>
                          {item.active ? '✓ Aktivan' : '✕ Neaktivan'}
                        </span>
                      </div>
                      <div style={styles.detail}>
                        <span style={styles.label}>Studijski program:</span>
                        <span style={styles.value}>{item.studyProgram}</span>
                      </div>
                      <div style={styles.detail}>
                        <span style={styles.label}>Smjer:</span>
                        <span style={styles.value}>{item.major}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                style={styles.deleteBtn}
                onClick={() => setDeleteConfirm({ id: item.id, type: activeTab })}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>
            <p>Nema pronađenih naloga</p>
          </div>
        )}
      </div>

      {/* Modal za potvrdu brisanja */}
      {deleteConfirm && (
        <div style={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Potvrdi brisanje</h3>
            <p style={styles.modalText}>
              Da li si siguran da želiš obrisati ovaj nalog? Ova akcija se ne može poništiti.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelBtn}
                onClick={() => setDeleteConfirm(null)}
              >
                Otkaži
              </button>
              <button
                style={styles.confirmDeleteBtn}
                onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.type)}
              >
                Obriši
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

  tabContainer: {
    display: 'flex',
    gap: '12px',
    borderBottom: '3px solid rgba(255, 107, 53, 0.1)',
    paddingBottom: '0',
  },

  tab: {
    background: 'transparent',
    border: 'none',
    borderBottom: '4px solid transparent',
    borderRadius: '0',
    padding: '16px 32px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '15px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    outline: 'none',
  },

  tabActive: {
    background: 'transparent',
    borderColor: '#ff6b35',
    color: '#ff6b35',
    boxShadow: 'none',
  },

  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },

  title: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.5px',
  },

  createBtn: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
    flexShrink: 0,
  },

  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 166, 0, 0.05) 100%)',
    border: '2px solid rgba(255, 107, 53, 0.15)',
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
    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(247, 166, 0, 0.03) 100%)',
    border: '2px solid rgba(255, 107, 53, 0.1)',
    borderRadius: '12px',
  },

  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  filterLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    fontSize: '14px',
  },

  filterButtons: {
    display: 'flex',
    gap: '8px',
  },

  filterBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '2px solid rgba(255, 107, 53, 0.2)',
    borderRadius: '8px',
    padding: '8px 16px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '13px',
  },

  filterBtnActive: {
    background: '#ff6b35',
    borderColor: '#ff6b35',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
  },

  listContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
  },

  accountCard: {
    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 166, 0, 0.05) 100%)',
    border: '2px solid rgba(255, 107, 53, 0.15)',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },

  accountInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },

  accountHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  accountName: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '0.3px',
  },

  accountDetails: {
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

  typeTag: {
    background: 'rgba(255, 107, 53, 0.2)',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ff6b35',
  },

  statusBadge: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },

  statusActive: {
    background: 'rgba(76, 175, 80, 0.2)',
    color: '#4CAF50',
  },

  statusInactive: {
    background: 'rgba(244, 67, 54, 0.2)',
    color: '#F44336',
  },

  deleteBtn: {
    background: 'rgba(255, 107, 53, 0.2)',
    border: '2px solid rgba(255, 107, 53, 0.4)',
    borderRadius: '10px',
    padding: '10px 12px',
    color: '#ff6b35',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
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
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },

  modal: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
    border: '2px solid rgba(255, 107, 53, 0.2)',
  },

  modalTitle: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 16px 0',
    letterSpacing: '0.3px',
  },

  modalText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: '14px',
    margin: '0 0 24px 0',
    lineHeight: '1.6',
  },

  modalButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },

  cancelBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: '10px 20px',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  confirmDeleteBtn: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
  },
};

export default AccountsManagement;
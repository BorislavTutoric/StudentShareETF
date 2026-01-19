import { useEffect, useState } from 'react';
import CreateAccountModal from './CreateAccountModal';
import Toast from '../Toast';
import { Plus, Search } from 'lucide-react';
import { activateUserAccountApi, changeModeratorPasswordApi, deactivateUserAccountApi, getModeratorAccounts, getStudentAccounts } from '../../services/accountsService';

function AccountsManagement() {
  const [activeTab, setActiveTab] = useState('moderator');
  const [deactivateConfirm, setDeactivateConfirm] = useState(null);
  const [activateConfirm, setActivateConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [moderatorFilter, setModeratorFilter] = useState('all');
  const [studentFilter, setStudentFilter] = useState('all');
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [changePasswordModal, setChangePasswordModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [moderators, setModerators] = useState([]);
  const [students, setStudents] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
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

  const deactivateUserAccount = async (userId, accountType) => {
    try{
      const response = await deactivateUserAccountApi(userId);
      if(accountType === "student"){
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.id === userId
              ? { ...student, active: false } 
              : student
          )
        );
      }else{
        setModerators(prevModerators =>
          prevModerators.map(moderator =>
            moderator.id === userId
              ? { ...moderator, active: false } 
              : moderator
          )
        );
      }
      showToast(response, 'success');
    } catch (err){
      console.log(err);
      showToast("Greška pri deaktivaciji naloga!", 'error');
    }
  }

  const activateUserAccount = async (userId, accountType) => {
    try{
      const response = await activateUserAccountApi(userId);
      if(accountType === "student"){
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.id === userId
              ? { ...student, active: true } 
              : student
          )
        );
      }else{
        setModerators(prevModerators =>
          prevModerators.map(moderator =>
            moderator.id === userId
              ? { ...moderator, active: true } 
              : moderator
          )
        );
      }
      showToast(response, 'success');
    } catch (err){
      console.log(err);
      showToast("Greška pri aktivaciji naloga!", 'error');
    }
  }

  const handleChangePassword = (userId, userName, username) => {
    setChangePasswordModal({ id: userId, name: userName, username: username });
    setNewPassword('');
    setShowPassword(false);
  }

  const handleConfirmChangePassword = async () => {
    if (!newPassword.trim()) {
      showToast("Molimo unesite novu lozinku!", 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast("Lozinka mora imati minimalno 8 karaktera!", 'error');
      return;
    }
    try{
      const response = await changeModeratorPasswordApi(changePasswordModal.username, newPassword);
      showToast(`Uspješno ste izmjenili lozinku moderatora: ${changePasswordModal.name}!`, 'success');
      setChangePasswordModal(null);
      setNewPassword('');
      setShowPassword(false);
    } catch (err){
      console.log(err);
      showToast("Greška pri izmjeni lozinke!", 'error')
      setChangePasswordModal(null);
      setNewPassword('');
      setShowPassword(false);
    }
  }

  const getFilteredList = () => {
    let list = activeTab === 'moderator' ? moderators : students;

    const searchLower = searchTerm.toLowerCase();
    list = list.filter(item =>
      item.id.toString().includes(searchLower) ||
      (item.name + " " + item.surname).toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower) ||
      item.surname.toLowerCase().includes(searchLower) ||
      item.username.toLowerCase().includes(searchLower) 
    );

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
  const activeModeratorList = filteredList.filter(m => m.active !== false);
  const inactiveModeratorList = filteredList.filter(m => m.active === false);

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

      <div style={styles.headerRow}>
        <div style={styles.searchContainer}>
          <Search size={20} color="rgba(255, 255, 255, 0.5)" />
          <input
            type="text"
            placeholder="Pretraži po jedinstvenom identifikatoru, imenu, prezimenu ili korisničkom imenu..."
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
                🎉 Moderatori za dogodaj
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

      {activeTab === 'moderator' ? (
        <div style={styles.twoColumnContainer}>
          <div style={styles.sectionContainer}>
            <h3 style={styles.sectionTitle}>Aktivni moderatori</h3>
            <div style={styles.singleColumnList}>
              {activeModeratorList.length > 0 ? (
                activeModeratorList.map((item) => (
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
                        <div style={styles.detail}>
                                <span style={styles.label}>Status:</span>
                                <span style={{
                                  ...styles.value,
                                  ...styles.statusBadge,
                                  ...(item.active ? styles.statusActive : styles.statusInactive)
                                }}>
                                  {item.active ? '✓ Aktivan' : '✕ Deaktiviran'}
                                </span>
                        </div>
                        <div style={styles.detail}>
                          <span style={styles.label}>Vrsta:</span>
                          <span style={{ ...styles.value, ...styles.typeTag }}>
                            {item.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={styles.buttonGroup}>
                      <button
                        style={styles.passwordBtn}
                        onClick={() => handleChangePassword(item.id, item.name + ' ' + item.surname, item.username)}
                      >
                        🔐 Izmjeni lozinku
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => setDeactivateConfirm({ id: item.id, type: 'moderator' })}
                      >
                        Deaktiviraj
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noResults}>
                  <p>Nema pronađenih aktivnih moderatora</p>
                </div>
              )}
            </div>
          </div>

          <div style={styles.sectionContainer}>
            <h3 style={styles.sectionTitle}>Deaktivirani moderatori</h3>
            <div style={styles.singleColumnList}>
              {inactiveModeratorList.length > 0 ? (
                inactiveModeratorList.map((item) => (
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
                        <div style={styles.detail}>
                                <span style={styles.label}>Status:</span>
                                <span style={{
                                  ...styles.value,
                                  ...styles.statusBadge,
                                  ...(item.active ? styles.statusActive : styles.statusInactive)
                                }}>
                                  {item.active ? '✓ Aktivan' : '✕ Deaktiviran'}
                                </span>
                        </div>
                        <div style={styles.detail}>
                          <span style={styles.label}>Vrsta:</span>
                          <span style={{ ...styles.value, ...styles.typeTag }}>
                            {item.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={styles.buttonGroup}>
                      <button
                        style={styles.passwordBtn}
                        onClick={() => handleChangePassword(item.id, item.name + ' ' + item.surname, item.username)}
                      >
                        🔐 Izmjeni lozinku
                      </button>
                      <button
                        style={styles.activateBtn}
                        onClick={() => setActivateConfirm({ id: item.id, type: 'moderator' })}
                      >
                        Aktiviraj
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noResults}>
                  <p>Nema pronađenih deaktiviranih moderatora</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{...styles.twoColumnContainer, gridTemplateColumns: '1fr'}}>
          <div style={styles.sectionContainer}>
            <h3 style={styles.sectionTitle}>Studentski nalozi</h3>
            <div style={styles.singleColumnList}>
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <div key={item.id} style={styles.studentCard}>
                    <div style={styles.studentCardContent}>
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
                          
                          {expandedStudent === item.id && (
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
                      <div style={styles.studentActions}>
                        <button
                          style={styles.expandBtn}
                          onClick={() => setExpandedStudent(expandedStudent === item.id ? null : item.id)}
                        >
                          {expandedStudent === item.id ? '▼' : '▶'}
                        </button>
                        <button
                          style={item.active ? styles.deleteBtn : styles.activateBtn}
                          onClick={() => item.active ? setDeactivateConfirm({ id: item.id, type: 'student' }) : setActivateConfirm({ id: item.id, type: 'student' })}
                        >
                          {item.active ? 'Deaktiviraj' : 'Aktiviraj'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noResults}>
                  <p>Nema pronađenih naloga</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deactivateConfirm && (
        <div style={styles.modalOverlay} onClick={() => setDeactivateConfirm(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Potvrda deaktivacije</h3>
            <p style={styles.modalText}>
              Da li ste sigurni da želite deaktivirati ovaj nalog? 
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelBtn}
                onClick={() => setDeactivateConfirm(null)}
              >
                Otkaži
              </button>
              <button
                style={styles.confirmDeleteBtn}
                onClick={() => {
                    deactivateUserAccount(deactivateConfirm.id, deactivateConfirm.type)
                    setDeactivateConfirm(null);
                  }
                }
              >
                Potvrdi
              </button>
            </div>
          </div>
        </div>
      )}

      {activateConfirm && (
        <div style={styles.modalOverlay} onClick={() => setActivateConfirm(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Potvrda aktivacije</h3>
            <p style={styles.modalText}>
              Da li ste sigurni da želite aktivirati ovaj nalog? 
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelBtn}
                onClick={() => setActivateConfirm(null)}
              >
                Otkaži
              </button>
              <button
                style={styles.confirmDeleteBtn}
                onClick={() => {
                    activateUserAccount(activateConfirm.id, activateConfirm.type)
                    setActivateConfirm(null);
                  }
                }
              >
                Potvrdi
              </button>
            </div>
          </div>
        </div>
      )}

      {changePasswordModal && (
        <div style={styles.modalOverlay} onClick={() => setChangePasswordModal(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Izmjena lozinke</h3>
            <p style={styles.modalText}>
              Izmjena lozinke za korisnika: <strong>{changePasswordModal.name}</strong>
            </p>
            <div style={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Unesite novu lozinku..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.passwordInput}
              />
              <button
                type="button"
                style={styles.eyeButtonModal}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <p style={{
              color: newPassword.length < 8 && newPassword.length > 0 ? '#F44336' : newPassword.length >= 8 ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)',
              fontSize: '12px',
              margin: '8px 0 24px 0',
              fontWeight: '500'
            }}>
              {newPassword.length === 0 ? 'Minimalno 8 karaktera' : newPassword.length < 8 ? `${8 - newPassword.length} karaktera nedostaje` : '✓ Lozinka je ispravna'}
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelBtn}
                onClick={() => {
                  setChangePasswordModal(null);
                  setShowPassword(false);
                  setNewPassword('');
                }}
              >
                Otkaži
              </button>
              <button
                style={{
                  ...styles.confirmDeleteBtn,
                  opacity: newPassword.length < 8 ? 0.5 : 1,
                  cursor: newPassword.length < 8 ? 'not-allowed' : 'pointer'
                }}
                onClick={handleConfirmChangePassword}
                disabled={newPassword.length < 8}
              >
                Izmjeni lozinku
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
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.3px',
  },
  twoColumnContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  singleColumnList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    flexDirection: 'column',
    flexShrink: 0,
  },
  passwordBtn: {
    background: 'rgba(100, 150, 255, 0.2)',
    border: '2px solid rgba(100, 150, 255, 0.4)',
    borderRadius: '10px',
    padding: '10px 12px',
    color: '#6496ff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
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
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  activateBtn: {
    background: 'rgba(76, 175, 80, 0.2)',
    border: '2px solid rgba(76, 175, 80, 0.4)',
    borderRadius: '10px',
    padding: '10px 12px',
    color: '#4CAF50',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  studentCard: {
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
  studentCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    width: '100%',
  },
  studentActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  expandBtn: {
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
    fontSize: '14px',
    fontWeight: '700',
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
  passwordInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  passwordInput: {
    width: '100%',
    padding: '12px 40px 12px 16px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 107, 53, 0.2)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  eyeButtonModal: {
    position: 'absolute',
    right: '12px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
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
import React, { useEffect, useState } from 'react';
import { Upload, FileText, Trash2, Calendar, AlertCircle, X } from 'lucide-react';
import { deleteExams, getAcademicCalendarApi, openAcademicCalendar, setExamSchedule, uploadAcademicCalendar } from '../../services/calendarService,';
import Toast from '../Toast';

function AdminAcademicCalendar() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentCalendar, setCurrentCalendar] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteMonth, setDeleteMonth] = useState('');
  const [deleteYear, setDeleteYear] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [uploadingExams, setUploadingExams] = useState(false);

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const getAcademicCalendar = async () => {
    try{
        setLoading(true);
        const response = await getAcademicCalendarApi();
        setCurrentCalendar(response)
    }catch(err){
        console.log(err);
    }finally{
        setLoading(false);
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleUploadCalendar = async () => {
    if (selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        try{
            const response = await uploadAcademicCalendar(fd);
            setCurrentCalendar(response);
            setSelectedFile(null);
            showToast("Uspješno dodan novi akademski kalendar", 'success');
        }catch(err){
            console.log(err);
            showToast("Greška pri dodavanju novog akademskog kalendara!", 'error');
            setSelectedFile(null);
        }
    }
  };

  const handleUploadExamSchedule = async () => {
    if (selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        try{
            setUploadingExams(true);
            const response = await setExamSchedule(fd);
            setSelectedFile(null);
            showToast("Uspješno ste dodali raspored ispita", 'success');
        }catch(err){
            console.log(err);
            showToast("Greška pri dodavanju rasporeda ispita!", 'error');
            setSelectedFile(null);
        }finally{
            setUploadingExams(false);
        }
    }
  };

  const handleDeleteExams = async() => {
    if (deleteMonth && deleteYear) {
      try{
        const response = await deleteExams(deleteMonth, deleteYear);
        if(response){
          showToast("Uspješno ste obrisali ispite za odabrani mjesec!", 'success');
        } else {
          showToast("Nema ispita za odabrani mjesec!", 'info');
        }
        setDeleteMonth('');
        setDeleteYear('');
      }catch{
        console.log(err);
        showToast("Greška pri brisanju ispita!", 'error');
      }  
    } else {
      showToast("Niste odabrali mjesec i godinu!", 'info');
    }
  };

  const handleViewCalendar = async (calendarId) => {
    try{
        const url = await openAcademicCalendar(calendarId);
        window.open(url, "_blank");
    }catch(err){
        console.log(err);
        showToast("Greška pri otvaranju akademskog kalendara!", 'error');
    }
  };

  useEffect(() => {
    getAcademicCalendar();
  }, [])

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Učitavanje...</p>
    </div>
  );

  return (
    <div style={styles.container}>
        {toast && <Toast message={toast.message} type={toast.type} />}
      {showSuccess && (
        <div style={styles.successToast}>
          ✓ Akcija uspješno izvršena
        </div>
      )}

      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'calendar' ? styles.tabActive : {})
          }}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={20} />
          Akademski Kalendar
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'exams' ? styles.tabActive : {})
          }}
          onClick={() => setActiveTab('exams')}
        >
          <FileText size={20} />
          Raspored Ispita
        </button>
      </div>

      {activeTab === 'calendar' && (
        <div style={styles.content}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Pregled akademskog kalendara:</h2>
            
            <button style={styles.downloadBtn} onClick={() => handleViewCalendar(currentCalendar.id)}>
                <span style={styles.downloadIcon}>📄</span>
                {currentCalendar.title}
            </button>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Dodaj novi akademski kalendar:</h2>
            
            <div style={styles.uploadArea}>
              <label style={styles.fileInputLabel}>
                <Upload size={24} />
                <span>{selectedFile ? selectedFile.name : 'Odaberi fajl'}</span>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  style={styles.fileInput}
                />
              </label>

              {selectedFile && (
                <div style={styles.fileActionContainer}>
                  <button
                    style={styles.removeButton}
                    onClick={handleRemoveFile}
                  >
                    <X size={18} />
                    Ukloni Fajl
                  </button>
                  <button
                    style={styles.uploadButton}
                    onClick={handleUploadCalendar}
                  >
                    Upload Kalendar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div style={styles.content}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Upload rasporeda ispita:</h2>
            <div style={styles.alertBoxExam}>
                <AlertCircle size={20} />
                <span>Priložiti raspored ispita sa zvanične stranice fakulteta!</span>
            </div>
            <div style={styles.uploadArea}>
              <label style={styles.fileInputLabel}>
                <Upload size={24} />
                <span>{selectedFile ? selectedFile.name : 'Odaberi fajl'}</span>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  style={styles.fileInput}
                />
              </label>

              {selectedFile && (
                <div style={styles.fileActionContainer}>
                  <button
                    style={styles.removeButton}
                    onClick={handleRemoveFile}
                  >
                    <X size={18} />
                    Ukloni Fajl
                  </button>
                  <button
                    style={styles.uploadButton}
                    onClick={handleUploadExamSchedule}
                    disabled={uploadingExams}
                  >
                    {uploadingExams ? (
                      <>
                        <div style={styles.spinnerSmall}></div>
                        <span>Pričekajte, ovo može da potraje...</span>
                      </>
                    ) : (
                      'Upload Raspored'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Obriši ispite po mjesecu:</h2>
            
            <div style={styles.deleteArea}>

              <div style={styles.inputGroup}>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Mjesec:</label>
                  <select
                    style={styles.select}
                    value={deleteMonth}
                    onChange={(e) => setDeleteMonth(e.target.value)}
                  >
                    <option value="">Odaberi mjesec</option>
                    <option value="1">Januar</option>
                    <option value="2">Februar</option>
                    <option value="3">Mart</option>
                    <option value="4">April</option>
                    <option value="5">Maj</option>
                    <option value="6">Jun</option>
                    <option value="7">Jul</option>
                    <option value="8">Avgust</option>
                    <option value="9">Septembar</option>
                    <option value="10">Oktobar</option>
                    <option value="11">Novembar</option>
                    <option value="12">Decembar</option>
                  </select>
                </div>

                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Godina:</label>
                  <select
                    style={styles.select}
                    value={deleteYear}
                    onChange={(e) => setDeleteYear(e.target.value)}
                  >
                    <option value="">Odaberi godinu</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2026">2027</option>
                    <option value="2026">2028</option>
                    <option value="2026">2029</option>
                    <option value="2026">2030</option>
                  </select>
                </div>
              </div>

              <button
                style={styles.deleteButton}
                onClick={() => {deleteMonth && deleteYear ? setDeleteConfirm(true) : showToast("Niste odabrali mjesec i godinu!", 'info');}}
              >
                <Trash2 size={18} />
                Obriši Ispite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal za potvrdu brisanja */}
      {deleteConfirm && (
        <div style={styles.modalOverlay} onClick={() => setDeleteConfirm(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Potvrda brisanja</h3>
            <p style={styles.modalText}>
              Da li ste sigurni da želite obrisati ispite za odabrani mjesec i godinu? 
            </p>
            <div style={styles.modalButtons}>
              <button
                style={styles.cancelBtn}
                onClick={() => setDeleteConfirm(false)}
              >
                Otkaži
              </button>
              <button
                style={styles.confirmDeleteBtn}
                onClick={() => {
                    handleDeleteExams();
                    setDeleteConfirm(false);
                  }
                }
              >
                Potvrdi
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
    width: '100%',
    //maxWidth: '900px',
    margin: '0 auto',
    padding: '30px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  successToast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '15px 25px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    fontWeight: '600',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#ed640fff',
    margin: '0 0 10px 0',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    padding: '8px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 107, 53, 0.2)',
  },
  tab: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    color: '#ff6b35',
    border: '2px solid rgba(255, 107, 53, 0.4)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  section: {
    backgroundColor: 'rgba(26, 42, 94, 0.4)',
    borderRadius: '16px',
    padding: '25px',
    border: '1px solid rgba(255, 107, 53, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ff6b35',
    marginBottom: '20px',
    marginTop: 0,
  },
  fileDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: '12px',
    border: '2px solid rgba(255, 107, 53, 0.3)',
  },
  downloadBtn: {
    background: 'rgba(224, 130, 22, 0.15)',
    border: '2px solid rgba(240, 85, 13, 0.3)',
    borderRadius: '10px',
    padding: '8px 16px',
    cursor: 'pointer',
    color: '#ffffffff',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    outline: 'none',
    width: 'fit-content',
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  fileInputLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    border: '2px dashed rgba(255, 107, 53, 0.4)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
  },
  fileInput: {
    display: 'none',
  },
  fileActionContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  removeButton: {
    padding: '12px 24px',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    border: '2px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  uploadButton: {
    padding: '12px 24px',
    backgroundColor: '#ff6b35',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  deleteArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  alertBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '14px',
    fontWeight: '600',
  },
  alertBoxExam: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  select: {
    padding: '12px',
    backgroundColor: 'rgba(48, 48, 100, 0.53)',
    border: '2px solid rgba(255, 107, 53, 0.3)',
    borderRadius: '8px',
    color: '#ffffffff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    border: '2px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  loadingContainer: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    minHeight: "300px", 
    color: "#ffffff" 
  },
  spinner: { 
    width: "40px", 
    height: "40px", 
    border: "4px solid rgba(96, 224, 22, 0.3)", 
    borderTop: "4px solid #dc7806ff", 
    borderRadius: "50%", 
    animation: "spin 1s linear infinite" 
  },
  spinnerSmall: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid #ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { 
    marginTop: "15px", 
    fontSize: "16px", 
    fontWeight: "600",
    color: '#ed9b0dff',
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

// Dodaj CSS animaciju
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AdminAcademicCalendar;
import React, { useState } from "react";
import ModeratorWelcomeHeader from "../components/ModeratorWelcomeHeader";
import ModeratorMenuBar from "../components/ModeratorMenuBar";
import ModeratorEventsHome from "../components/ModeratorEventsHome";
import ModeratorProfileDisplay from "../components/ModeratorProfileDisplay";
import SubjectsDisplay from "../components/SubjectsDisplay";
import ModeratorStudentsManagement from "../components/ModeratorStudentsManagement";

function ModeratorEvents() {
  const [activeTab, setActiveTab] = useState("Početna");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [materials, setMaterials] = useState([]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleMenuClick = (tabName) => {
    setActiveTab(tabName);
    // Reset materials view kada se prebacimo na drugi tab
    if (tabName !== "Materijali") {
      setSelectedSubject(null);
      setMaterials([]);
    }
  };

  const handleOpenMaterials = (subjectName, materialsData) => {
    setSelectedSubject(subjectName);
    setMaterials(materialsData);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setMaterials([]);
  };

  const renderSection = () => {
    if (activeTab === "Profil") {
      return (
        <div style={styles.profileWrapper}>
          <ModeratorProfileDisplay />
        </div>
      );
    }

    if (activeTab === "Početna") {
      return (
        <div style={styles.fixedContentWrapper}>
          <div style={styles.scrollableArea}>
            <ModeratorEventsHome />
          </div>
        </div>
      );
    }

    if (activeTab === "Studentski nalozi") {
      return (
        <div style={styles.fixedContentWrapper}>
          <div style={styles.scrollableArea}>
            <ModeratorStudentsManagement />
          </div>
        </div>
      );
    }

    if (activeTab === "Materijali") {
      return (
        <div style={styles.fixedContentWrapper}>
          <div style={styles.scrollableArea}>
            {!selectedSubject ? (
              <SubjectsDisplay onOpenMaterials={handleOpenMaterials} />
            ) : (
              <div style={styles.materialsView}>
                <div style={styles.materialsHeader}>
                  <button 
                    onClick={handleBackToSubjects}
                    style={styles.backButton}
                  >
                    ← Nazad na predmete
                  </button>
                  <h2 style={styles.subjectTitle}>{selectedSubject}</h2>
                </div>
                <div style={styles.materialsList}>
                  {materials.length === 0 ? (
                    <p style={styles.noMaterials}>Nema dostupnih materijala za ovaj predmet.</p>
                  ) : (
                    materials.map((material, index) => (
                      <div key={index} style={styles.materialCard}>
                        <h3 style={styles.materialTitle}>{material.name || material.title}</h3>
                        {material.description && (
                          <p style={styles.materialDescription}>{material.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>{activeTab}</h2>
        <p style={styles.text}>Sadržaj za {activeTab} će biti povezan sa backendom.</p>
      </div>
    );
  };

  return (
    <div style={styles.mainLayout}>
      <div style={styles.leftMenu}>
        <ModeratorMenuBar 
          onLogoutClick={handleLogout} 
          onMenuClick={handleMenuClick} 
        />
      </div>

      <div style={styles.rightContent}>
        <ModeratorWelcomeHeader isModerator={true} roleName="Moderator za događaje" />
        
        <div style={styles.contentBox}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

const styles = {
  mainLayout: {
    display: "flex",
    height: "100vh",
    background: '#64aaf1ff', 
  },

  leftMenu: {
    width: "270px",
    padding: "16px",
  },

  rightContent: {
    flex: 1,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  contentBox: {
    flex: 1,
    background: 'linear-gradient(180deg, #0a1457 0%, #1a1f6b 100%)',
    borderRadius: "16px",
    padding: "0px 0",
    overflowY: "auto",
    overflowX: "hidden",
  },

  profileWrapper: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '20px',
    background: 'rgba(10, 20, 87, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },

  fixedContentWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "rgba(10, 20, 87, 0.4)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    overflow: "hidden"
  },

  scrollableArea: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    scrollbarWidth: "thin",
    scrollbarColor: "#6366f1 rgba(255,255,255,0.1)"
  },

  sectionHeader: {
    padding: '25px 30px',
    background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)',
    borderBottom: '2px solid rgba(99, 102, 241, 0.3)',
    marginBottom: '20px',
    borderRadius: '12px 12px 0 0',
  },

  sectionHeaderTitle: {
    color: '#6366f1',
    fontSize: '26px',
    fontWeight: '800',
    margin: '0 0 8px 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    letterSpacing: '0.5px',
  },

  sectionHeaderSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    margin: 0,
    fontWeight: '400',
  },

  materialsView: {
    padding: '20px',
  },

  materialsHeader: {
    marginBottom: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },

  backButton: {
    alignSelf: 'flex-start',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: 'white',
    border: '2px solid #6366f1',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },

  subjectTitle: {
    color: '#6366f1',
    fontSize: '28px',
    fontWeight: '800',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },

  materialsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },

  materialCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.3s ease',
  },

  materialTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 10px 0',
  },

  materialDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    margin: 0,
    lineHeight: '1.5',
  },

  noMaterials: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '16px',
    textAlign: 'center',
    padding: '40px',
  },

  card: {
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 100%)',
    borderRadius: "20px",
    padding: "40px",
    height: "100%",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },

  sectionTitle: {
    color: "#6366f1",
    fontSize: "22px",
    fontWeight: "700",
    margin: 0
  },

  text: { 
    color: "white", 
    fontSize: "16px", 
    opacity: 0.9, 
    marginTop: '20px' 
  }
};

export default ModeratorEvents;
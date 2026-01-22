import React, { useState } from "react";
import ModeratorWelcomeHeader from "../components/moderators/ModeratorWelcomeHeader";
import ModeratorMenuBar from "../components/moderators/ModeratorMenuBar";
import ModeratorMaterialsHomeDisplay from "../components/moderators/materials/ModeratorMaterialsHomeDisplay";
import ModeratorMaterialsSubjectsDisplay from "../components/moderators/materials/ModeratorMaterialsSubjectsDisplay";
import EventsDisplayModeratorMaterials from "../components/EventsDisplayModeratorMaterials";
import ModeratorStudentsManagement from "../components/moderators/ModeratorStudentsManagement";
import ModeratorRequestsManagement from "../components/moderators/materials/ModeratorRequestsManagement";
import ModeratorProfileDisplay from "../components/moderators/ModeratorProfileDisplay";

function ModeratorMaterials() {
  const [activeTab, setActiveTab] = useState("Početna");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [view, setView] = useState("list");
  const [activeComponent, setActiveComponent] = useState("subjects");
  const [year, setYear] = useState(1);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleCloseMaterials = () => {
    setActiveComponent("subjects");
    setSelectedSubject(null);
    setMaterials([]);
  };

  const handleOpenMaterials = (courseName, materialsData) => {
    setSelectedSubject(courseName);
    setMaterials(materialsData);
    setActiveComponent("materials");
  };

  const handleMenuClick = (tabName) => {
    setActiveTab(tabName);
    setView("list");
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
        <>
          {activeComponent === "subjects" && (
            <ModeratorMaterialsSubjectsDisplay 
              onOpenMaterials={handleOpenMaterials} 
              startYear={year}
            />
          )}
          {activeComponent === "materials" && (
            <ModeratorMaterialsHomeDisplay
              materials={materials}
              isOpen={true}
              onClose={handleCloseMaterials}
              subjectName={selectedSubject}
            />
          )}
        </>
      );
    }
    if (activeTab === "Događaji") {
      return (
        <div style={styles.fixedContentWrapper}>          
          <div style={styles.scrollableArea}>
            <EventsDisplayModeratorMaterials />
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
    if (activeTab === "Zahtjevi") {
      return (
        <div style={styles.fixedContentWrapper}>
          <div style={styles.scrollableArea}>
            <ModeratorRequestsManagement />
          </div>
        </div>
      );
    }
    const titles = {
      "Profil": "Moj Profil",
    };
    return (
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>{titles[activeTab]}</h2>
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
        <ModeratorWelcomeHeader isModerator={true} roleName="Moderator za materijale" />
        
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
    overflow: "hidden",
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

  card: {
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 100%)',
    borderRadius: "20px",
    padding: "40px",
    height: "100%",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
    border: '1px solid rgba(96, 224, 22, 0.2)',
  },

  sectionTitle: {
    color: "#60e016",
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

export default ModeratorMaterials;
import React, { useState } from "react";
import ModeratorWelcomeHeader from "../components/moderators/ModeratorWelcomeHeader";
import ModeratorMenuBar from "../components/moderators/ModeratorMenuBar";
import ModeratorEventsHome from "../components/moderators/events/ModeratorEventsHome";
import ModeratorProfileDisplay from "../components/moderators/ModeratorProfileDisplay";
import ModeratorSubjectsDisplay from "../components/moderators/events/ModeratorSubjectsDisplay";
import ModeratorMaterialsDisplay from "../components/moderators/events/ModeratorMaterialsDisplay";
import ModeratorStudentsManagement from "../components/moderators/ModeratorStudentsManagement";
import ModeratorEventRequestsManagement from "../components/moderators/events/ModeratorEventRequestsManagement";

function ModeratorEvents() {
  const [activeTab, setActiveTab] = useState("Početna");
  const [activeComponent, setActiveComponent] = useState("subjects");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [year, setYear] = useState();
  const [materials, setMaterials] = useState([]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleMenuClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName !== "Materijali") {
      setActiveComponent("subjects");
      setSelectedSubject("");
      setMaterials([]);
    }
  };

  const handleSubjectsClick = () => { 
    setActiveComponent("subjects");
  };

  const handleOpenMaterials = (subjectName, materialsData, selectedYear) => {
    setSelectedSubject(subjectName);
    setMaterials(materialsData);
    setYear(selectedYear);
    setActiveComponent("materials");
  };

  const handleCloseMaterials = () => {
    setActiveComponent("subjects");
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
        <>
          {activeComponent === "subjects" && (
            <ModeratorSubjectsDisplay 
              onOpenMaterials={handleOpenMaterials} 
              startYear={year}
            />
          )}
          {activeComponent === "materials" && (
            <ModeratorMaterialsDisplay
              materials={materials}
              isOpen={true}
              onClose={handleCloseMaterials}
              subjectName={selectedSubject}
            />
          )}
        </>
      );
    }

     if (activeTab === "Zahtjevi") {
      return (
        <div style={styles.fixedContentWrapper}>
          <div style={styles.scrollableArea}>
            <ModeratorEventRequestsManagement />
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
          onMaterialsSectionClick={handleSubjectsClick}
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
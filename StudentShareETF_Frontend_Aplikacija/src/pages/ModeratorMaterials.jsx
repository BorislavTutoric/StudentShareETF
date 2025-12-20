import React, { useState } from "react";
import ModeratorWelcomeHeader from "../components/ModeratorWelcomeHeader";
import ModeratorMenuBar from "../components/ModeratorMenuBar";
import ModeratorMaterialsHome from "../components/ModeratorMaterialsHome";
import MaterialsDisplay from "../components/MaterialsDisplay";
import EventsDisplay from "../components/EventsDisplay";
import ModeratorStudentsManagement from "../components/ModeratorStudentsManagement";
import ModeratorRequestsManagement from "../components/ModeratorRequestsManagement";

function ModeratorMaterials() {
  const [activeTab, setActiveTab] = useState("Početna");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [view, setView] = useState("list");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleOpenMaterials = (courseName, materialsData) => {
    setSelectedSubject(courseName);
    setMaterials(materialsData);
    setView("details");
  };

  const handleMenuClick = (tabName) => {
    setActiveTab(tabName);
    setView("list");
  };

  const renderSection = () => {
    // 1. POČETNA (MATERIJALI)
    if (activeTab === "Početna") {
      if (view === "list") {
        return <ModeratorMaterialsHome onOpenMaterials={handleOpenMaterials} />;
      } else {
        return (
          <div style={styles.detailsWrapper}>
            <MaterialsDisplay 
              isOpen={true} 
              materials={materials} 
              subjectName={selectedSubject} 
            />
          </div>
        );
      }
    }

    // 2. DOGAĐAJI (SA FIXNIM SKROLOM)
    if (activeTab === "Događaji") {
      return (
        <div style={styles.fixedContentWrapper}>
          <div style={styles.stickyHeader}>
            <h2 style={styles.sectionTitle}>Pregled događaja</h2>
          </div>
          
          <div style={styles.scrollableArea}>
             <EventsDisplay />
          </div>
        </div>
      );
    }

    if (activeTab === "Studentski nalozi") {
    return (
        <div style={styles.fixedContentWrapper}>
            <div style={styles.modernHeader}>
                <div style={styles.titleIconBox}>
                    <span style={{ fontSize: '24px' }}>👥</span> 
                </div>
                <div style={styles.headerTextBox}>
                    <h2 style={styles.modernSectionTitle}>Upravljanje studentskim nalozima</h2>
                    <p style={styles.sectionSubtitle}>Pregled, aktivacija i suspenzija korisničkih pristupa</p>
                </div>
            </div>
            <div style={styles.scrollableArea}>
                <ModeratorStudentsManagement />
            </div>
        </div>
    );

}
if (activeTab === "Zahtjevi") {
  return (
    <div style={styles.fixedContentWrapper}>
       <div style={styles.modernHeader}>
          <div style={styles.titleIconBox}>
             <span style={{ fontSize: '24px' }}>📩</span> 
          </div>
          <div style={styles.headerTextBox}>
             <h2 style={styles.modernSectionTitle}>Zahtjevi i Prijave</h2>
             <p style={styles.sectionSubtitle}>Pregled novih materijala i moderacija prijavljenog sadržaja</p>
          </div>
       </div>
       <div style={styles.scrollableArea}>
          <ModeratorRequestsManagement />
       </div>
    </div>
  );
}
    // 3. OSTALE SEKCIJE
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
    <div style={styles.pageWrapper}>
      <div style={styles.mainContainer}>
        <div style={styles.sidebarSection}>
          <ModeratorMenuBar 
            onLogoutClick={handleLogout} 
            onMenuClick={handleMenuClick} 
          />
        </div>

        <div style={styles.contentSection}>
          <ModeratorWelcomeHeader isModerator={true} roleName="Moderator za materijale" />
          <div style={styles.renderArea}>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    background: 'linear-gradient(180deg, #0e1966ff 0%, #5d6196ff 100%)',
    height: "100vh",
    width: "100%",
    display: "flex",
    padding: "20px",
    boxSizing: "border-box",
    overflow: "hidden"
  },
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    gap: "25px",
  },
  sidebarSection: {
    width: "270px",
    flexShrink: 0,
  },
  contentSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    height: "100%",
    overflow: "hidden"
  },
  renderArea: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    position: "relative"
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
  stickyHeader: {
    padding: "20px 25px",
    background: "rgba(0, 0, 0, 0.2)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    zIndex: 10
  },
  scrollableArea: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    scrollbarWidth: "thin",
    scrollbarColor: "#60e016 rgba(255,255,255,0.1)"
  },
  sectionTitle: {
    color: "#60e016",
    fontSize: "22px",
    fontWeight: "700",
    margin: 0
  },
  card: {
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 100%)',
    borderRadius: "20px",
    padding: "40px",
    height: "100%",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
    border: '1px solid rgba(96, 224, 22, 0.2)',
  },
  text: { 
    color: "white", 
    fontSize: "16px", 
    opacity: 0.9, 
    marginTop: '20px' 
  },
  modernHeader: {
    padding: "25px 30px",
    background: "linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    zIndex: 10
  },
  titleIconBox: {
    width: "50px",
    height: "50px",
    background: "rgba(96, 224, 22, 0.1)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(96, 224, 22, 0.3)",
    boxShadow: "0 0 15px rgba(96, 224, 22, 0.1)"
  },
  headerTextBox: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  modernSectionTitle: {
    color: "#5bac2dff",
    fontSize: "18px",
    fontWeight: "800",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "1px",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
  },
  sectionSubtitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "13px",
    margin: 0,
    fontWeight: "400"
  },
  detailsWrapper: { 
    height: '100%', 
    overflowY: 'auto',
    borderRadius: '20px'
  }
};

export default ModeratorMaterials;
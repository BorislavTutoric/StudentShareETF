import { useState} from "react";
import AdminMenuBar from "../components/admin/AdminMenuBar";
import AdminWelcomeHeader from "../components/admin/AdminWelcomeHeader";
import AdminProfileDisplay from "../components/admin/AdminProfileDisplay";
import AccountsManagement from "../components/admin/AllAccountsDisplay";
import AdminSubjectsDisplay from "../components/admin/AdminSubjectsDisplay";
import AdminMaterialsDisplay from "../components/admin/AdminMaterialsDisplay";
import AdminEventsDisplay from "../components/admin/AdminEventsDisplay";
import AdminAcademicCalendar from "../components/admin/AdminAcademicCalendar";
import ModeratorActions from "../components/admin/ModeratorActions";

function AdminPage() {
  const [activeSection, setActiveSection] = useState("Početna");
  const [activeComponent, setActiveComponent] = useState("subjects");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [year, setYear] = useState();
  const [materials, setMaterials] = useState([]);

  const handleLogoutClick = () => {
    window.location.href = "/";
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
  };

  const handleSubjectsClick = () => { 
    setActiveComponent("subjects");
  }

  const handleOpenMaterials = (subjectName, materialsData, selectedYear) => {
    setSelectedSubject(subjectName);
    setMaterials(materialsData);
    setYear(selectedYear);
    setActiveComponent("materials");
  };

  const handleCloseMaterials = () => {
    setActiveComponent("subjects")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "Profil":
        return <AdminProfileDisplay />

      case "Početna":
        return <AccountsManagement />

      case "Materijali":
        return (
          <>
            {activeComponent === "subjects" && (
              <AdminSubjectsDisplay onOpenMaterials={handleOpenMaterials} startYear={year}/>
            )}

            {activeComponent === "materials" && (
              <AdminMaterialsDisplay
                materials={materials}
                isOpen={true}
                onClose={handleCloseMaterials}
                subjectName={selectedSubject}
              />
            )}
          </>
        );

      case "Događaji":
        return <AdminEventsDisplay />

      case "Akademski kalendar":
        return <AdminAcademicCalendar />

      case "Akcije moderatora":
        return <ModeratorActions />

      default:
        return <h2>Dobrodošli!</h2>;
    }
};
  return (
    <div style={styles.mainLayout}>
      <div style={styles.leftMenu}>
        <AdminMenuBar 
          onLogoutClick={handleLogoutClick}
          onMenuClick={setActiveSection}
          onMaterialsSectionClick={handleSubjectsClick}
        />
      </div>

      <div style={styles.rightContent}>
        <AdminWelcomeHeader />

        <div style={styles.contentBox}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const styles = {
  mainLayout: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#64aaf1ff",
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
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    borderRadius: "16px",
    padding: "0px 0",
    overflowY: "auto",
    overflowX: "hidden",
  },
};

export default AdminPage;
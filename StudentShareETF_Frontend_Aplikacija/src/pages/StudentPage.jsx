import { useState, useEffect } from "react";
import StudentMenuBar from "../components/StudentMenuBar";
import WelcomeHeader from "../components/WelcomeHeader";
import ProfileDisplay from "../components/ProfileDisplay";
import StudentHome from "../components/StudentHome";
import MaterialsStudentDisplay from "../components/MaterialsStudentDisplay";
import EventsDisplayAuth from "../components/EventsDisplayAuth";

function StudentPage() {
  const [activeSection, setActiveSection] = useState("Početna");
  const [activeComponent, setActiveComponent] = useState("subjects");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [materials, setMaterials] = useState([]);
  const [year, setYear] = useState();
  const [subjects, setSubjects] = useState("all");
  const [averageRatings, setAverageRatings] = useState([]);

  const handleSubjectsClick = () => { 
    setActiveComponent("subjects");
    //setYear(null);
  }

  const handleOpenMaterials = (subjectName, materialsData, averages, selectedYear, subs) => {
    setSelectedSubject(subjectName);
    setMaterials(materialsData);
    setAverageRatings(averages);
    setYear(selectedYear);
    setActiveComponent("materials");
    setSubjects(subs);
  };

  const handleLogoutClick = () => {
    window.location.href = "/";
    localStorage.removeItem("jwtToken");
  };

  const handleCloseMaterials = () => {setActiveComponent("subjects")}

  const renderContent = () => {
    switch (activeSection) {
      case "Profil":
        return <ProfileDisplay />

      case "Početna":
        return (
          <>
            {activeComponent === "subjects" && (
              <StudentHome onOpenMaterials={handleOpenMaterials} startYear={year} subjectsView={subjects}/>
            )}

            {activeComponent === "materials" && (
              <MaterialsStudentDisplay
                materials={materials}
                isOpen={true}
                onClose={handleCloseMaterials}
                subjectName={selectedSubject}
                materialsAvgRatings={averageRatings}
              />
            )}
          </>
        );

      case "Obavještenja":
        return <h2>Obavještenja</h2>;

      case "Sačuvano":
        return <h2>Sačuvano</h2>;

      case "Akademski kalendar":
        return <h2>Akademski kalendar</h2>;

      case "Savjeti":
        return <h2>Savjeti</h2>;

      case "Događaji":
        return <EventsDisplayAuth />;

      default:
        return <h2>Dobrodošli!</h2>;
    }
};
  return (
    <div style={styles.mainLayout}>
      <div style={styles.leftMenu}>
        <StudentMenuBar 
          onLogoutClick={handleLogoutClick}
          onMenuClick={setActiveSection}
          onHomeCLick={handleSubjectsClick}
        />
      </div>

      <div style={styles.rightContent}>
        <WelcomeHeader />

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
    //background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)",
    //backgroundColor: "white",
  },

  leftMenu: {
    width: "300px",
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
    //backgroundColor: "linear-gradient(135deg, #1E3A8A 0%, #6793f2ff 100%)",
    //background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)",
    //backgroundColor: "#071686ff",
    background: 'linear-gradient(180deg, #0a1457 0%, #1a1f6b 100%)',
    borderRadius: "16px",
    padding: "0px 0",
    overflowY: "auto",
    overflowX: "hidden",
  },
};

export default StudentPage;

import { useState } from "react";
import StudentMenuBar from "../components/StudentMenuBar";
import WelcomeHeader from "../components/WelcomeHeader";
import ProfileDisplay from "../components/ProfileDisplay";

function StudentPage() {
  const [activeSection, setActiveSection] = useState("Početna");

  const handleLogoutClick = () => {
    window.location.href = "/";
    localStorage.removeItem("jwtToken");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Profil":
        return <ProfileDisplay />;
      case "Početna":
        return <h2>Dobrodošli na početnu stranicu!</h2>;
      case "Obavještenja":
        return <h2>Obavještenja</h2>;
      case "Sačuvano":
        return <h2>Sačuvano</h2>;
      case "Akademski kalendar":
        return <h2>Akademski kalendar</h2>;
      case "Savjeti":
        return <h2>Savjeti</h2>;
      case "Događaji":
        return <h2>Događaji</h2>;
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
    backgroundColor: "#071686ff",
    borderRadius: "16px",
    padding: "15px 350px",
    overflowY: "auto",
  },
};

export default StudentPage;

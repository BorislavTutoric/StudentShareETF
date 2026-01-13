import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LoginModal from "../components/LoginModal";
import SubjectsDisplay from "../components/SubjectsDisplay";
import MaterialsDisplay from "../components/MaterialsDisplay";
import Initial from "../components/Initial";
import EventsDisplay from "../components/EventsDisplay"; 
import { loginCheck } from "../services/authService";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [activeComponent, setActiveComponent] = useState("initial");

  const [selectedSubject, setSelectedSubject] = useState("");
  const [materials, setMaterials] = useState([]);

  const handleLoginClick = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setIsModalOpen(true);
    }else{
      try {
        const response = await loginCheck(); 
        if(response.role === "STUDENT"){
          window.location.href = "/student";
        }else if(response.role === "ADMIN"){
          window.location.href = "/admin";
        }else if(response.role = "MODERATOR_ZA_DOGAĐAJE"){
          window.location.href = "/moderator/dogadjaji"
        }else if(response.role = "MODERATOR_ZA_MATERIJALE"){
          window.location.href = "/moderator/materijali"
        }
      } catch {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("name");
        localStorage.removeItem("username");
        setIsModalOpen(true);
      }
    }
  }

  const handleClose = () => setIsModalOpen(false);
  const handleLoginSuccess = (user) => setUsername(user);

  const handleInitialClick = () => setActiveComponent("initial");
  const handleSubjectsClick = () => setActiveComponent("subjects");
  const handleEventsClick = () => setActiveComponent("events"); 

  const handleOpenMaterials = (subjectName, materialsData) => {
    setSelectedSubject(subjectName);
    setMaterials(materialsData);
    setActiveComponent("materials");
  };

  useEffect(() => {
    if (localStorage.getItem("showLoginModal") === "true") {
      setIsModalOpen(true);
      localStorage.removeItem("showLoginModal");
    }
  }, []);


  return (
    <div style={{ width: "100vw", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar
        onInitialClick={handleInitialClick}
        onLoginClick={handleLoginClick}
        onMaterialsClick={handleSubjectsClick}
        onEventsClick={handleEventsClick}
        username={username}
      />

      <div style={{ marginTop: "100px", width: "100%" }}>
        {activeComponent === "initial" && <Initial />}
        {activeComponent === "subjects" && (
          <SubjectsDisplay onOpenMaterials={handleOpenMaterials} />
        )}
        {activeComponent === "materials" && (
          <MaterialsDisplay
            materials={materials}
            isOpen={true}
            subjectName={selectedSubject}
            back={handleSubjectsClick}
          />
        )}

        {activeComponent === "events" && <EventsDisplay />} 
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default Home;

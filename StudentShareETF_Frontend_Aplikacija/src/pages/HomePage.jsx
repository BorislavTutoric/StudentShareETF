import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LoginModal from "../components/LoginModal";
import SubjectsDisplay from "../components/SubjectsDisplay";
import MaterialsDisplay from "../components/MaterialsDisplay";
import Initial from "../components/Initial";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [activeComponent, setActiveComponent] = useState("initial"); // initial, subjects, materials
  const [selectedSubject, setSelectedSubject] = useState(""); // za MaterialsDisplay
  const [materials, setMaterials] = useState([]); // materijali za MaterialsDisplay

  const handleLoginClick = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const handleLoginSuccess = (user) => setUsername(user);

  const handleInitialClick = () => setActiveComponent("initial");
  const handleSubjectsClick = () => setActiveComponent("subjects");

  // poziva se iz SubjectsDisplay kad korisnik odabere predmet
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
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0, boxSizing: 'border-box', overflowX: 'hidden' }}>
      <Navbar 
        onInitialClick={handleInitialClick} 
        onLoginClick={handleLoginClick} 
        onMaterialsClick={handleSubjectsClick} 
        username={username} 
      />

      <div style={{ marginTop: '100px', width: '100%', overflowX: 'hidden' }}>
        {activeComponent === "initial" && <Initial />}
        {activeComponent === "subjects" && <SubjectsDisplay onOpenMaterials={handleOpenMaterials} />}
        {activeComponent === "materials" && <MaterialsDisplay materials={materials} isOpen={true} subjectName={selectedSubject} />}
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

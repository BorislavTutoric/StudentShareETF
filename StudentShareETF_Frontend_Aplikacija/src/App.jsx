import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Verify from "./pages/Verify";
import StudentPage from "./pages/StudentPage";
import ModeratorEvents from "./pages/ModeratorEvents"

// 1. Uvezi nove komponente (koje ćeš kreirati ispod)
import ModeratorMaterials from "./pages/ModeratorMaterials";
//import ModeratorDogadjaji from "./pages/ModeratorDogadjaji";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/student" element={<StudentPage />} />
        
        {/* 2. DODAJ OVE RUTE DA BI REDIRECT IMAO GDJE OTIĆI */}
        <Route path="/moderator/materijali" element={<ModeratorMaterials />} />
        <Route path="/moderator/dogadjaji" element={<ModeratorEvents />} />

      </Routes>
    </Router>
  );
}

export default App;
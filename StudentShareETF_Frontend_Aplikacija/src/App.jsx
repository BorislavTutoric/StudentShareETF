import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Verify from "./pages/Verify";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import ModeratorEvents from "./pages/ModeratorEvents"
import PasswordChange from "./pages/PasswordChange"
import ModeratorMaterials from "./pages/ModeratorMaterials";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/password-change" element={<PasswordChange />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/moderator/materijali" element={<ModeratorMaterials />} />
        <Route path="/moderator/dogadjaji" element={<ModeratorEvents />} />
      </Routes>
    </Router>
  );
}

export default App;
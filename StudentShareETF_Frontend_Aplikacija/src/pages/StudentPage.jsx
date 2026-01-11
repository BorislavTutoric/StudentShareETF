import { useState, useEffect, use } from "react";
import StudentMenuBar from "../components/StudentMenuBar";
import WelcomeHeader from "../components/WelcomeHeader";
import ProfileDisplay from "../components/ProfileDisplay";
import StudentHome from "../components/StudentHome";
import AdviceHome from "../components/AdviceHome";
import MaterialsStudentDisplay from "../components/MaterialsStudentDisplay";
import EventsDisplayAuth from "../components/EventsDisplayAuth";
import SavedMaterials from "../components/SavedMaterials";
import SavedMaterialsDisplay from "../components/SavedMaterialsDisplay";
import Notifications from "../components/Notifications";
import { getNotificationsApi, getNumOfUnreadNotificationsApi } from "../services/notificationsService";
import AcademicCalendar from "../components/AcademicCalendar";
import { getAcademicCalendarApi } from "../services/calendarService,";
import Toast from "../components/Toast";
import { getFacultyMonthTasksApi, getMyMonthTasksApi } from "../services/taskService";

function StudentPage() {
  const [activeSection, setActiveSection] = useState("Početna");
  const [activeComponent, setActiveComponent] = useState("subjects");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [materials, setMaterials] = useState([]);
  const [year, setYear] = useState();
  const [subjects, setSubjects] = useState("all");
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [selectedSubjectSM, setSelectedSubjectSM] = useState("");
  const [activeComponentSavedMaterials, setActiveComponentSavedMaterials] = useState("subjects");
  const [yearSM, setYearSM] = useState();
  const [subjectsSM, setSubjectsSM] = useState("all");
  const [notifications, setNotifications] = useState(null);
  const [calendarFile, setCalendarFile] = useState(null);
  const [facultyMonthTasks, setFacultyMonthTasks] = useState(null);
  const [myMonthTasks, setMyMonthTasks] = useState(null);
  const [toast, setToast] = useState(null);
  const [averageRatings, setAverageRatings] = useState([]);
  const [numOfUnreadNotifications, setNumOfUnreadNotifications] = useState(0)

  const handleSubjectsClick = () => { 
    setActiveComponent("subjects");
  }

  const showToast = (message, type = 'success', duration = 5000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };
  
  const handleOpenMaterials = (subjectName, materialsData, averages, selectedYear, subs) => {
    setSelectedSubject(subjectName);
    setMaterials(materialsData);
    setAverageRatings(averages);
    setYear(selectedYear);
    setActiveComponent("materials");
    setSubjects(subs);
  };

  const handleOpenSavedMaterials = (subjectName, savedMaterialsData, selectedYear, subs) => {
    setSelectedSubjectSM(subjectName);
    setSavedMaterials(savedMaterialsData);
    setActiveComponentSavedMaterials("materials");
    setYearSM(selectedYear);
    setSubjectsSM(subs);
  }


  const handleNotificationsClick = async () => {
    try{
      const response = await getNotificationsApi();
      setNotifications(response);
    } catch(err){
      console.log(err);
    }
  }

  const handleLogoutClick = () => {
    window.location.href = "/";
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
  };

  const handleCloseMaterials = () => {setActiveComponent("subjects")}

  const handleCloseSavedMaterials = () => {setActiveComponentSavedMaterials("subjects")}
  
  const handleCalendarClick = async () => {
    const now = new Date();
    const currentYear = now.getFullYear();  
    const currentMonth = now.getMonth() + 1; 
    try{
      const [calendarResponse] = await Promise.all([
        getAcademicCalendarApi(),
        handleMonthTasks(currentMonth, currentYear)
      ]);
      setCalendarFile(calendarResponse)
    }catch (err){
      console.error(err);
      showToast(`${err}`, 'error');
    }
  }

  const handleMonthTasks = async (month, year) => {
    try{
      const [facultyTasksResponse, myTasksResponse] = await Promise.all([
        getFacultyMonthTasksApi(month, year),
        getMyMonthTasksApi(month, year)
      ]);
      setFacultyMonthTasks(facultyTasksResponse);
      setMyMonthTasks(myTasksResponse);
    }catch (err){
      console.error(err);
      showToast(`${err}`, 'error');
    }
  }

  const getNumOfUnreadNotifications = async () => {
    try{
      const response = await getNumOfUnreadNotificationsApi();
      setNumOfUnreadNotifications(response);
    } catch (err) {
      console.log(err);
    }
  }

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
        return <Notifications studentNotifications={notifications} setUnreadNotifications={setNumOfUnreadNotifications}/>;

      case "Sačuvano":
        return (
          <>
            {activeComponentSavedMaterials === "subjects" && (
              <SavedMaterials onOpenMaterials={handleOpenSavedMaterials} startYear={yearSM} subjectsView={subjectsSM}/>
            )}

            {activeComponentSavedMaterials === "materials" && (
              <SavedMaterialsDisplay
                materials={savedMaterials}
                setMaterials={setSavedMaterials}
                isOpen={true}
                onClose={handleCloseSavedMaterials}
                subjectName={selectedSubjectSM}
              />
            )}
          </>
        );

      case "Akademski kalendar":
        return <AcademicCalendar 
                  calendarFile={calendarFile}
                  facultyTasks={facultyMonthTasks}
                  myTasks={myMonthTasks}
                  handleMonthTasks={handleMonthTasks}
                />

      case "Savjeti":
        return <AdviceHome startYear={1} subjectsView={"all"} />;

      case "Događaji":
        return <EventsDisplayAuth />;

      default:
        return <h2>Dobrodošli!</h2>;
    }
  }

  useEffect(() => {
    getNumOfUnreadNotifications();

    const interval = setInterval(() => {
      getNumOfUnreadNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.mainLayout}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div style={styles.leftMenu}>
        <StudentMenuBar 
          onLogoutClick={handleLogoutClick}
          onMenuClick={setActiveSection}
          onHomeCLick={handleSubjectsClick}
          onNotificationsClick={handleNotificationsClick}
          onCalendarClick={handleCalendarClick}
          unreadNotifications={numOfUnreadNotifications}
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
    overflowY: "auto",
    overflowX: "hidden",
  },
};

export default StudentPage;
import StudentMenuBar from "../components/StudentMenuBar";
import WelcomeHeader from "../components/WelcomeHeader";

function StudentPage(){

    const handleLogoutClick = () => {
        window.location.href = "/";
        localStorage.removeItem("jwtToken");
    }

    return (
        <div style={styles.studentPage}>
            <StudentMenuBar 
                onLogoutClick={handleLogoutClick}
            />
            <WelcomeHeader />

            <div style={styles.contentArea}> 

            </div>
        </div>
    );
}

const styles = {
    studentPage: {
        //display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#64aaf1ff',
        overflow: 'hidden',
    },

    contentArea: {
        position: 'fixed',
        top: '202px',          
        left: '332px',         
        right: '16px',
        bottom: '16px',
        overflowY: 'auto',
        backgroundColor: '#ffffffff',
        borderRadius: '16px',
        padding: '20px',
    }
};

export default StudentPage;
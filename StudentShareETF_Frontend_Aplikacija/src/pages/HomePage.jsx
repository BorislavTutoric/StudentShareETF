import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LoginModal from "../components/LoginModal";
import banner1 from "../assets/building1.jpg";
import banner2 from "../assets/classroom2.jpg";
import banner3 from "../assets/building3.jpg";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");

  const handleLoginClick = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const handleLoginSuccess = (user) => setUsername(user);

  useEffect(() => {
    if (localStorage.getItem("showLoginModal") === "true") {
      setIsModalOpen(true);                    
      localStorage.removeItem("showLoginModal"); 
    }
  }, []);
  
  return (
    <div style={styles.container}>
      <Navbar onLoginClick={handleLoginClick} username={username} />
      <LoginModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <div style={styles.leftColumn}>
            <h1 style={styles.title}>Dobrodošli na StudentShareETF! 🎓</h1>
            <p style={styles.subtitle}>
              StudentShareETF je platforma namijenjena studentima Elektrotehničkog fakulteta u Banjoj Luci
              za razmjenu materijala, savjeta i iskustava tokom studiranja.
            </p>

            <div style={styles.infoSection}>
              <p style={styles.infoText}>
                <strong>Brz i jednostavan pristup materijalima</strong> – pronađi skripte, zadatke i druge korisne resurse.
              </p>
              <p style={styles.infoText}>
                <strong>Pomoć i savjeti</strong> – poveži se sa kolegama, razmijeni iskustva i dobij preporuke za učenje.
              </p>
              <p style={styles.infoText}>
                <strong>Lakše snalaženje na fakultetu</strong> – saznaj sve bitne informacije o ispitima, predavanjima i događajima.
              </p>
            </div>

            <div style={styles.ctaSection}>
              <p style={styles.ctaText}>
                Pridruži se StudentShareETF zajednici i učini studiranje lakšim!
              </p>
              <p style={styles.ctaSubtext}>
                (Klikni na "Prijavi se" i istraži sve mogućnosti aplikacije)
              </p>
            </div>

            <div style={styles.questionsSection}>
              <h3 style={styles.questionsTitle}>Jesi li se ikad zapitao/la...?</h3>
              <ul style={styles.questionsList}>
                <li style={styles.questionItem}>🔍 "Gdje da nađem dobre skripte?"</li>
                <li style={styles.questionItem}>📚 "Kako da saznam najnovije informacije o ispitima?"</li>
                <li style={styles.questionItem}>✍️ "Da li neko ima riješene zadatke od prošle godine?"</li>
                <li style={styles.questionItem}>📢 Ne brini! Mi pravimo tu aplikaciju – sve je tu i lako!</li>
              </ul>
            </div>

            <div style={styles.statsSection}>
              <h3 style={styles.statsTitle}>📊 Zanimljiva statistika</h3>
              <p style={styles.statItem}>
                <strong>80%</strong> studenata se slaže da su materijali kojima pristupali učinili ih efikasnijim!
              </p>
              <p style={styles.statItem}>
                A isto je i malo manj pritiska nakon saznanja na jednom mjestu!
              </p>
            </div>

            <div style={styles.testimonialsSection}>
              <h3 style={styles.testimonialsTitle}>🌟 ETF izazovi</h3>
              <ul style={styles.testimonialsList}>
                <li style={styles.testimonialItem}>
                  Koliko puta si tražio materijal sa ispita u posljednjem trenutku?
                </li>
                <li style={styles.testimonialItem}>
                  Koliko puta si dobio pomoć od kolega?
                </li>
                <li style={styles.testimonialItem}>
                  Zašto je lakše – pritisnuti se i složiti sada sa studentima?
                </li>
              </ul>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <img src={banner1} alt="Building" style={styles.image} />
            <img src={banner2} alt="Classroom" style={styles.image} />
            <img src={banner3} alt="Building 2" style={styles.image} />
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { 
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)",
    position: "relative",
    overflow: "hidden",
  },
  main: { 
    padding: "100px 40px 40px 40px",
    position: "relative",
    zIndex: 1,
  },
  contentWrapper: {
    display: "flex",
    gap: "40px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  leftColumn: {
    flex: 1,
    color: "white",
  },
  rightColumn: {
    width: "280px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: { 
    color: "white",
    fontSize: "32px",
    marginBottom: "15px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  subtitle: { 
    marginBottom: "25px",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#e8eaf6",
  },
  infoSection: {
    marginBottom: "25px",
  },
  infoText: {
    marginBottom: "12px",
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#e8eaf6",
  },
  ctaSection: {
    marginBottom: "30px",
    padding: "15px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "8px",
    borderLeft: "4px solid #4fc3f7",
  },
  ctaText: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "5px",
  },
  ctaSubtext: {
    fontSize: "13px",
    fontStyle: "italic",
    color: "#b3e5fc",
  },
  questionsSection: {
    marginBottom: "30px",
  },
  questionsTitle: {
    color: "#ffd54f",
    marginBottom: "12px",
    fontSize: "20px",
  },
  questionsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  questionItem: {
    marginBottom: "10px",
    fontSize: "14px",
    paddingLeft: "5px",
    color: "#e8eaf6",
  },
  statsSection: {
    marginBottom: "30px",
    padding: "15px",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "8px",
  },
  statsTitle: {
    color: "#4fc3f7",
    marginBottom: "12px",
    fontSize: "18px",
  },
  statItem: {
    fontSize: "14px",
    marginBottom: "8px",
    color: "#e8eaf6",
  },
  testimonialsSection: {
    marginBottom: "20px",
  },
  testimonialsTitle: {
    color: "#ffd54f",
    marginBottom: "12px",
    fontSize: "18px",
  },
  testimonialsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  testimonialItem: {
    marginBottom: "10px",
    fontSize: "14px",
    paddingLeft: "5px",
    color: "#e8eaf6",
  },
  image: { 
    width: "100%",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    border: "3px solid rgba(255,255,255,0.2)",
  },
};

export default Home;
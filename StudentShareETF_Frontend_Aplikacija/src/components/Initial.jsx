import banner1 from "../assets/building1.jpg";
import banner2 from "../assets/classroom2.jpg";
import banner3 from "../assets/building3.jpg";

function Initial() {
  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <div style={styles.leftColumn}>
            <h1 style={styles.title}>Dobrodošli na StudentShareETF! 🎓</h1>
            <p style={styles.subtitle}>
              StudentShareETF je platforma namijenjena studentima Elektrotehničkog fakulteta u Banjoj Luci
              za razmjenu materijala, savjeta i iskustava tokom studiranja.
            </p>

            <div style={styles.infoSection}>
              <div style={styles.infoCard}>
                <span style={styles.infoIcon}>📖</span>
                <p style={styles.infoText}>
                  <strong>Brz i jednostavan pristup materijalima</strong> – pronađi skripte, zadatke i druge korisne resurse.
                </p>
              </div>
              <div style={styles.infoCard}>
                <span style={styles.infoIcon}>🤝</span>
                <p style={styles.infoText}>
                  <strong>Pomoć i savjeti</strong> – poveži se sa kolegama, razmijeni iskustva i dobij preporuke za učenje.
                </p>
              </div>
              <div style={styles.infoCard}>
                <span style={styles.infoIcon}>🎯</span>
                <p style={styles.infoText}>
                  <strong>Lakše snalaženje na fakultetu</strong> – saznaj sve bitne informacije o ispitima, predavanjima i događajima.
                </p>
              </div>
            </div>

            <div style={styles.ctaSection}>
              <p style={styles.ctaText}>
                ✨ Pridruži se StudentShareETF zajednici i učini studiranje lakšim!
              </p>
              <p style={styles.ctaSubtext}>
                (Klikni na "Prijavi se" i istraži sve mogućnosti aplikacije)
              </p>
            </div>

            <div style={styles.questionsSection}>
              <h3 style={styles.questionsTitle}>🔍 Jesi li se ikad zapitao/la...?</h3>
              <ul style={styles.questionsList}>
                <li style={styles.questionItem}>💭 "Gdje da nađem dobre skripte?"</li>
                <li style={styles.questionItem}>📚 "Kako da saznam najnovije informacije o ispitima?"</li>
                <li style={styles.questionItem}>✍️ "Da li neko ima riješene zadatke od prošle godine?"</li>
                <li style={styles.questionItem}>🎉 Ne brini! Mi pravimo tu aplikaciju – sve je tu i lako!</li>
              </ul>
            </div>

            <div style={styles.statsSection}>
              <h3 style={styles.statsTitle}>📊 Zanimljiva statistika</h3>
              <div style={styles.statBox}>
                <span style={styles.statNumber}>80%</span>
                <p style={styles.statText}>studenata se slaže da su materijali kojima pristupali učinili ih efikasnijim!</p>
              </div>
              <p style={styles.statItem}>
                A isto je i malo manj pritiska nakon saznanja na jednom mjestu!
              </p>
            </div>

            <div style={styles.testimonialsSection}>
              <h3 style={styles.testimonialsTitle}>⚡ ETF izazovi</h3>
              <ul style={styles.testimonialsList}>
                <li style={styles.testimonialItem}>
                  ✔️ Koliko puta si tražio materijal sa ispita u posljednjem trenutku?
                </li>
                <li style={styles.testimonialItem}>
                  ✔️ Koliko puta si dobio pomoć od kolega?
                </li>
                <li style={styles.testimonialItem}>
                  ✔️ Zašto je lakše – pritisnuti se i složiti sada sa studentima?
                </li>
              </ul>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.imageWrapper}>
              <img src={banner1} alt="Building" style={styles.image} />
            </div>
            <div style={styles.imageWrapper}>
              <img src={banner2} alt="Classroom" style={styles.image} />
            </div>
            <div style={styles.imageWrapper}>
              <img src={banner3} alt="Building 2" style={styles.image} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    minHeight: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)",
    boxSizing: 'border-box',
    padding: '20px 0',
    overflowX: 'hidden', 
  },
  main: {
    width: '100%',
    padding: '0 20px 40px 20px',
    boxSizing: 'border-box',
  },
  contentWrapper: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",  
    margin: "0 auto",
    maxWidth: "1400px",
    padding: "0 20px",
    width: "100%",
  },
  leftColumn: {
    flex: 1,
    minWidth: 0,  
    color: "white",
  },
  rightColumn: {
    flex: "0 0 280px", 
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    minWidth: 0,
  },
  title: {
    fontSize: "48px",
    marginBottom: "25px",
    color: "#ffffff",
    fontWeight: "800",
    letterSpacing: "2px",
    textShadow: "0 2px 10px rgba(0,0,0,0.6), 0 0 40px rgba(79, 195, 247, 0.6)",
    textAlign: "left",
  },
  subtitle: {
    marginBottom: "25px",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  infoSection: { 
    marginBottom: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoCard: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: "8px",
    border: "1px solid rgba(79, 195, 247, 0.3)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(79, 195, 247, 0.15)",
    }
  },
  infoIcon: {
    fontSize: "24px",
    minWidth: "30px",
    display: "flex",
    alignItems: "center",
  },
  infoText: { 
    marginBottom: "0",
    fontSize: "14px", 
    lineHeight: "1.5",
    margin: 0,
  },
  ctaSection: { 
    marginBottom: "30px", 
    padding: "20px", 
    backgroundColor: "rgba(79, 195, 247, 0.15)", 
    borderRadius: "12px", 
    borderLeft: "5px solid #4fc3f7",
    border: "2px solid rgba(79, 195, 247, 0.5)",
    boxShadow: "0 4px 15px rgba(79, 195, 247, 0.1)",
  },
  ctaText: { fontSize: "16px", fontWeight: "600", marginBottom: "8px", margin: "0 0 8px 0" },
  ctaSubtext: { fontSize: "13px", fontStyle: "italic", margin: 0 },
  questionsSection: { marginBottom: "30px" },
  questionsTitle: { marginBottom: "12px", fontSize: "20px", margin: "0 0 12px 0" },
  questionsList: { listStyle: "none", padding: 0, margin: 0 },
  questionItem: { 
    marginBottom: "10px", 
    fontSize: "14px", 
    paddingLeft: "5px",
    padding: "8px 12px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "6px",
    borderLeft: "3px solid #81d4fa",
  },
  statsSection: { 
    marginBottom: "30px", 
    padding: "20px", 
    backgroundColor: "rgba(0,0,0,0.2)", 
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  statsTitle: { marginBottom: "12px", fontSize: "18px", margin: "0 0 12px 0" },
  statBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "12px",
    backgroundColor: "rgba(79, 195, 247, 0.15)",
    borderRadius: "8px",
    marginBottom: "12px",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#4fc3f7",
  },
  statText: {
    fontSize: "14px",
    margin: 0,
  },
  statItem: { fontSize: "14px", marginBottom: "8px", margin: "0 0 8px 0" },
  testimonialsSection: { marginBottom: "20px" },
  testimonialsTitle: { marginBottom: "12px", fontSize: "18px", margin: "0 0 12px 0" },
  testimonialsList: { listStyle: "none", padding: 0, margin: 0 },
  testimonialItem: { 
    marginBottom: "10px", 
    fontSize: "14px", 
    paddingLeft: "5px",
    padding: "8px 12px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "6px",
    borderLeft: "3px solid #a78bfa",
  },
  imageWrapper: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
  },
  image: {
    width: "100%",
    height: '180px',
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    border: "3px solid rgba(255,255,255,0.2)",
    transition: "transform 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.05)",
    }
  },
};

export default Initial;

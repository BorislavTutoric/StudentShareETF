import { useState } from 'react';

function Initial() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.backgroundWaves}></div>
      
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          {/* Left Column */}
          <div style={styles.leftColumn}>
            <h1 style={styles.title}>Dobrodošli na StudentShareETF! 🎓</h1>
            
            <p style={styles.subtitle}>
              StudentShareETF je platforma namijenjena studentima Elektrotehničkog fakulteta u Banjoj Luci za razmjenu materijala, savjeta i iskustava tokom studiranja.
            </p>

            {/* Main Features */}
            <div style={styles.featuresBlock}>
              <p style={styles.featureText}>
                <strong>Brz i jednostavan pristup materijalima</strong> – pronađi skripte, zadatke i druge korisne resurse.
              </p>
              <p style={styles.featureText}>
                <strong>Pomoć i savjeti</strong> – poveži se sa kolegama, razmijeni iskustva i dobij preporuke za učenje.
              </p>
              <p style={styles.featureText}>
                <strong>Lakše snalaženje na fakultetu</strong> – saznaj sve bitne informacije o ispitima, predavanjima i događajima.
              </p>
            </div>

            {/* CTA Section */}
            <div style={styles.ctaSection}>
              <p style={styles.ctaText}>✨ Pridruži se StudentShareETF zajednici i učini studiranje lakšim!</p>
              <p style={styles.ctaSubtext}>(Klikni na "Prijavi se" i istraži sve mogućnosti aplikacije!)</p>
            </div>

            {/* Questions Section */}
            <div style={styles.divider}></div>
            
            <div style={styles.questionsSection}>
              <h3 style={styles.sectionTitle}>🔍 Jesi li se ikad zapitao/la...?</h3>
              <div style={styles.questionsList}>
                <div style={styles.questionItem}>💭 "Gdje da nađem dobre skripte?"</div>
                <div style={styles.questionItem}>📚 "Kako da saznam najnovije informacije o ispitima?"</div>
                <div style={styles.questionItem}>✍️ "Da li neko ima riješene zadatke od prošle godine?"</div>
                <div style={styles.questionItem}>🎉 Ne brini! Na pravom si mjestu – sve je tu i lako!</div>
              </div>
            </div>

            {/* Stats Section */}
            <div style={styles.divider}></div>
            
            <div style={styles.statsSection}>
              <h3 style={styles.sectionTitle}>📊 Zanimljiva statistika</h3>
              <div style={styles.statBox}>
                <span style={styles.statNumber}>80%</span>
                <p style={styles.statText}>studenata se slaže da su materijali kojima su pristupali učinili ih efikasnijim!</p>
              </div>
              <p style={styles.statNote}>A isto je i malo manje pritiska nakon saznanja na jednom mjestu!</p>
            </div>

            {/* Challenges Section */}
            <div style={styles.divider}></div>
            
            <div style={styles.testimonialsSection}>
              <h3 style={styles.sectionTitle}>⚡ ETF izazovi</h3>
              <div style={styles.challengesList}>
                <div style={styles.challengeItem}>✔️ Koliko puta si tražio materijal sa ispita u posljednjem trenutku?</div>
                <div style={styles.challengeItem}>✔️ Koliko puta si dobio pomoć od kolega?</div>
                <div style={styles.challengeItem}>✔️ Zajedno je lakše – pridruži se i složi sada sa studentima!</div>
              </div>
            </div>
          </div>

          {/* Right Column - Images */}
          <div style={styles.rightColumn}>
            <div style={styles.imageCard}>
              <div style={{...styles.imagePlaceholder, backgroundImage: 'linear-gradient(135deg, #4facfe, #00f2fe)'}}>
                <span style={styles.imageBg}>🏫</span>
              </div>
            </div>
            <div style={styles.imageCard}>
              <div style={{...styles.imagePlaceholder, backgroundImage: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                <span style={styles.imageBg}>💼</span>
              </div>
            </div>
            <div style={styles.imageCard}>
              <div style={{...styles.imagePlaceholder, backgroundImage: 'linear-gradient(135deg, #f093fb, #f5576c)'}}>
                <span style={styles.imageBg}>📚</span>
              </div>
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
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1a1f4e 100%)',
    boxSizing: 'border-box',
    padding: '40px 0',
    overflowX: 'hidden',
    position: 'relative',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  backgroundWaves: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'url("data:image/svg+xml,%3Csvg width=\'1200\' height=\'300\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'wave\' x1=\'0%25\' y1=\'0%25\' x2=\'0%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' style=\'stop-color:%234facfe;stop-opacity:0.3\'/%3E%3Cstop offset=\'100%25\' style=\'stop-color:%234facfe;stop-opacity:0\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=\'M0,100 Q300,50 600,100 T1200,100 L1200,0 L0,0 Z\' fill=\'url(%23wave)\' opacity=\'0.6\'/%3E%3Cpath d=\'M0,120 Q300,80 600,120 T1200,120 L1200,0 L0,0 Z\' fill=\'url(%23wave)\' opacity=\'0.4\'/%3E%3C/svg%3E") no-repeat',
    backgroundSize: 'cover',
    pointerEvents: 'none',
    zIndex: 0,
  },
  main: {
    width: '100%',
    padding: '0 20px 40px 20px',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 2,
  },
  contentWrapper: {
    display: 'flex',
    gap: '50px',
    flexWrap: 'wrap',
    margin: '0 auto',
    maxWidth: '1400px',
    padding: '0 20px',
    width: '100%',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: '1 1 500px',
    minWidth: 0,
    color: '#e0e0e0',
  },
  rightColumn: {
    flex: '0 1 330px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minWidth: 0,
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px',
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: '-1px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(79, 195, 247, 0.4)',
    textAlign: 'left',
    marginTop: 0,
    lineHeight: '1.2',
  },
  subtitle: {
    marginBottom: '25px',
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#b0b0b0',
    fontWeight: '400',
  },
  featuresBlock: {
    marginBottom: '25px',
  },
  featureText: {
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '12px',
    color: '#d0d0d0',
    margin: '0 0 12px 0',
  },
  ctaSection: {
    marginBottom: '25px',
  },
  ctaText: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '6px',
    margin: '0 0 6px 0',
    color: '#4fc3f7',
  },
  ctaSubtext: {
    fontSize: '12px',
    color: '#a0a0a0',
    margin: 0,
    fontStyle: 'italic',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, rgba(79, 195, 247, 0.5), transparent)',
    margin: '20px 0',
  },
  questionsSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    marginBottom: '12px',
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 12px 0',
    color: '#ffffff',
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  questionItem: {
    fontSize: '13px',
    color: '#d0d0d0',
    paddingLeft: '5px',
  },
  statsSection: {
    marginBottom: '20px',
  },
  statBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '10px',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#4fc3f7',
    minWidth: '45px',
  },
  statText: {
    fontSize: '13px',
    margin: 0,
    color: '#d0d0d0',
    lineHeight: '1.5',
  },
  statNote: {
    fontSize: '13px',
    color: '#a0a0a0',
    margin: '8px 0 0 0',
    paddingLeft: '5px',
  },
  testimonialsSection: {
    marginBottom: '10px',
  },
  challengesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  challengeItem: {
    fontSize: '13px',
    color: '#d0d0d0',
    paddingLeft: '5px',
  },
  imageCard: {
    textAlign: 'center',
  },
  imagePlaceholder: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
    border: '3px solid rgba(255, 255, 255, 0.2)',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  imageBg: {
    fontSize: '70px',
    display: 'block',
  },
};

export default Initial;
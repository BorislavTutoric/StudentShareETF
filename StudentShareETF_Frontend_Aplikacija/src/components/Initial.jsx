import { useState } from 'react';
import banner1 from "../assets/building1.jpg";
import banner2 from "../assets/classroom2.jpg";
import banner3 from "../assets/building3.jpg";

function Initial() {

  return (
    <div style={styles.container}>
      <div style={styles.backgroundWaves}></div>
      
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <div style={styles.leftColumn}>
            <h1 style={styles.title}>Dobrodošli na StudentShareETF! 🎓</h1>
            
            <p style={styles.subtitle}>
              StudentShareETF je platforma namijenjena studentima Elektrotehničkog fakulteta u Banjoj Luci za razmjenu materijala, savjeta i iskustava tokom studiranja.
            </p>

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

            <div style={styles.ctaSection}>
              <p style={styles.ctaText}>✨ Pridruži se StudentShareETF zajednici i učini studiranje lakšim!</p>
              <p style={styles.ctaSubtext}>(Klikni na "Prijavi se" i istraži sve mogućnosti aplikacije!)</p>
            </div>

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

            <div style={styles.divider}></div>
            
            <div style={styles.statsSection}>
              <h3 style={styles.sectionTitle}>📊 Zanimljiva statistika</h3>
              <div style={styles.statBox}>
                <span style={styles.statNumber}>80%</span>
                <p style={styles.statText}>studenata se slaže da su materijali kojima su pristupali učinili njihovo učenje efikasnijim!</p>
              </div>
            </div>

            <div style={styles.divider}></div>
            
            <div style={styles.contactSection}>
              <h3 style={styles.sectionTitle}>📧 Kontaktirajte nas</h3>
              <div style={styles.contactBox}>
                <p style={styles.contactText}>
                  Imaš pitanja ili prijedloge? Slobodno nas kontaktiraj!
                </p>
                <p  style={styles.emailLink}>
                  Email: studentshareetf@gmail.com
                </p>
              </div>
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
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1a1f4e 100%)',
    boxSizing: 'border-box',
    padding: '0',
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
    padding: '60px 20px 60px 20px',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 2,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  contentWrapper: {
    display: 'flex',
    gap: '60px',
    flexWrap: 'nowrap',
    margin: '0 auto',
    maxWidth: '1400px',
    width: '100%',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: '1 1 auto',
    minWidth: '0',
    color: '#e0e0e0',
  },
  rightColumn: {
    flex: '0 0 380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    minWidth: '380px',
    paddingTop: '20px',
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
  contactSection: {
    marginBottom: '10px',
  },
  contactBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  contactText: {
    fontSize: '13px',
    color: '#d0d0d0',
    margin: 0,
    lineHeight: '1.5',
  },
  emailLink: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4fc3f7',
    textDecoration: 'none',
    paddingLeft: '5px',
    transition: 'color 0.3s ease',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(79, 195, 247, 0.2)',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    flex: '1 1 auto',
    height: '240px',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transform: 'translateZ(0)',
    backdropFilter: 'blur(10px)',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: '20px',
    boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)',
    border: 'none',
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
    filter: 'brightness(1.08) contrast(1.15) saturate(1.1)',
  },
};

export default Initial;
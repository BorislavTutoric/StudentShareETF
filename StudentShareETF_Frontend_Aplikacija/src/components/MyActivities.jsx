import { useState } from "react";
import { CheckSquare, History, Clock } from "lucide-react";
import MyTasksTab from "./myActivities/MyTasksTab";
import MyHistoryTab from "./myActivities/MyHistoryTab";
import MyTimeTab from "./myActivities/MyTimeTab";

const TABOVI = [
  { kljuc: "obaveze", naziv: "Obaveze", ikona: CheckSquare, Komponenta: MyTasksTab },
  { kljuc: "istorija", naziv: "Lična istorija", ikona: History, Komponenta: MyHistoryTab },
  { kljuc: "vrijeme", naziv: "Vrijeme u aplikaciji", ikona: Clock, Komponenta: MyTimeTab },
];

// Sekcija "Moje aktivnosti" za studenta: statistika obaveza, lična istorija akcija i vrijeme u aplikaciji.
function MyActivities() {
  const [aktivni, setAktivni] = useState(TABOVI[0].kljuc);
  const { Komponenta } = TABOVI.find((t) => t.kljuc === aktivni);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Moje aktivnosti</h2>
        <div style={styles.tabs} role="tablist">
          {TABOVI.map(({ kljuc, naziv, ikona }) => {
            const Ikona = ikona;
            const izabran = kljuc === aktivni;
            return (
              <button key={kljuc} role="tab" aria-selected={izabran}
                      style={{ ...styles.tab, ...(izabran ? styles.tabActive : {}) }}
                      onClick={() => setAktivni(kljuc)}>
                <Ikona size={16} /> {naziv}
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel">
        <Komponenta key={aktivni} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #0a1457 0%, #1a2a5e 50%, #2a1f5e 100%)",
    borderRadius: 16, padding: 32, minHeight: "100%", boxSizing: "border-box", color: "#fff",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap",
    marginBottom: 24, paddingBottom: 20, borderBottom: "2px solid rgba(96, 224, 22, 0.15)",
  },
  title: {
    margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: 0.5,
    background: "linear-gradient(120deg, #a8edea 0%, #fed6e3 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  },
  tabs: { display: "flex", gap: 6, background: "rgba(255,255,255,0.05)", padding: 4, borderRadius: 12, flexWrap: "wrap" },
  tab: {
    display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.75)",
    border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit", transition: "all 0.2s ease",
  },
  tabActive: { background: "rgba(96, 224, 22, 0.18)", color: "#60e016", boxShadow: "inset 0 0 0 1px rgba(96,224,22,0.5)" },
};

export default MyActivities;

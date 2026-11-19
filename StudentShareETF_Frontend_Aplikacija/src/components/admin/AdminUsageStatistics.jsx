import { useEffect, useState } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { getTimePerModuleApi, getUsageApi } from "../../services/statisticsService";

const MJESECI = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];
const NAZIVI_MODULA = {
  MATERIJALI: "Materijali", SACUVANO: "Sačuvano", OBAVJESTENJA: "Obavještenja",
  KALENDAR_OBAVEZE: "Akademski kalendar", SAVJETI: "Savjeti", DOGADJAJI: "Događaji",
  PROFIL: "Profil", MOJE_AKTIVNOSTI: "Moje aktivnosti",
};
const BOJE = ["#ff6b35", "#f7a600", "#60e016", "#38bdf8", "#a78bfa", "#f472b6", "#facc15", "#94a3b8"];

const nazivModula = (m) => NAZIVI_MODULA[m] ?? m;

const formatVrijeme = (sek) => {
  const h = Math.floor(sek / 3600);
  const min = Math.floor((sek % 3600) / 60);
  if (h > 0) return `${h} h ${min} min`;
  if (min > 0) return `${min} min`;
  return `${sek} s`;
};

const isoDatum = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function AdminUsageStatistics() {
  const trenutnaGodina = new Date().getFullYear();
  const [period, setPeriod] = useState("all");
  const [godina, setGodina] = useState(trenutnaGodina);
  const [moduli, setModuli] = useState(null);
  const [mjesecni, setMjesecni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ucitaj = async () => {
      try {
        setLoading(true);
        setError(null);
        let od = null;
        const danas = new Date();
        if (period !== "all") {
          const pocetak = new Date();
          pocetak.setDate(danas.getDate() - Number(period));
          od = isoDatum(pocetak);
        }
        setModuli(await getTimePerModuleApi(od, isoDatum(danas)));
      } catch (err) {
        console.error(err);
        setError("Greška pri učitavanju statistike.");
      } finally {
        setLoading(false);
      }
    };
    ucitaj();
  }, [period]);

  useEffect(() => {
    getUsageApi(godina)
      .then(setMjesecni)
      .catch((err) => { console.error(err); setError("Greška pri učitavanju statistike."); });
  }, [godina]);

  if (error) return <div style={styles.message}>{error}</div>;
  if (loading || !moduli || !mjesecni) return <div style={styles.message}>Učitavanje statistike...</div>;

  const najkoristeniji = moduli.modules[0];
  const pieData = moduli.modules.map((m) => ({
    name: nazivModula(m.module), value: m.totalSeconds, postotak: m.percentage,
  }));
  const mjesecData = mjesecni.months.map((m) => ({
    name: MJESECI[m.month - 1],
    sati: Math.round((m.totalSeconds / 3600) * 10) / 10,
    postotakAktivnih: m.activePercentage,
    aktivniStudenti: m.activeStudents,
  }));
  const godine = [trenutnaGodina, trenutnaGodina - 1, trenutnaGodina - 2];

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Korištenje aplikacije</h2>
        <select style={styles.select} value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="all">Cijelo vrijeme</option>
          <option value="30">Zadnjih 30 dana</option>
          <option value="7">Zadnjih 7 dana</option>
        </select>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Ukupno vrijeme</div>
          <div style={styles.cardValue}>{formatVrijeme(moduli.totalSeconds)}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Aktivnih studenata</div>
          <div style={styles.cardValue}>{moduli.activeStudents}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Najkorišteniji modul</div>
          <div style={styles.cardValue}>{najkoristeniji ? nazivModula(najkoristeniji.module) : "—"}</div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Vrijeme po modulima</h3>
        {moduli.modules.length === 0 ? (
          <p style={styles.empty}>Nema podataka za izabrani period.</p>
        ) : (
          <div style={styles.moduleLayout}>
            <div style={{ flex: 1, minWidth: 300, height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110}
                       label={({ payload }) => `${payload.postotak}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={BOJE[i % BOJE.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatVrijeme(v)} contentStyle={styles.tooltip} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ flex: 1.3, minWidth: 340 }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Modul</th>
                    <th style={styles.th}>Ukupno</th>
                    <th style={styles.th}>Udio</th>
                    <th style={styles.th}>Studenata</th>
                    <th style={styles.th}>Prosjek / student</th>
                  </tr>
                </thead>
                <tbody>
                  {moduli.modules.map((m, i) => (
                    <tr key={m.module}>
                      <td style={styles.td}>
                        <span style={{ ...styles.dot, background: BOJE[i % BOJE.length] }} />
                        {nazivModula(m.module)}
                      </td>
                      <td style={styles.td}>{formatVrijeme(m.totalSeconds)}</td>
                      <td style={styles.td}>
                        <div style={styles.barBg}>
                          <div style={{ ...styles.barFill, width: `${m.percentage}%` }} />
                        </div>
                        {m.percentage}%
                      </td>
                      <td style={styles.td}>{m.studentCount}</td>
                      <td style={styles.td}>{formatVrijeme(m.averageSeconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div style={styles.section}>
        <div style={styles.headerRow}>
          <h3 style={styles.sectionTitle}>Korištenje po mjesecima</h3>
          <select style={styles.select} value={godina} onChange={(e) => setGodina(Number(e.target.value))}>
            {godine.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <p style={styles.hint}>
          Stubići: ukupno sati. Linija: postotak studenata koji su koristili aplikaciju
          (od {mjesecni.totalStudents} aktivnih studentskih naloga).
        </p>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <ComposedChart data={mjesecData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis yAxisId="left" stroke="#cbd5e1" unit=" h" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#cbd5e1" unit="%" />
              <Tooltip contentStyle={styles.tooltip} />
              <Legend />
              <Bar yAxisId="left" dataKey="sati" name="Ukupno sati" fill="#ff6b35" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="postotakAktivnih"
                    name="Aktivni studenti (%)" stroke="#60e016" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", color: "#fff" },
  message: { padding: "40px", color: "#fff", textAlign: "center" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" },
  title: { margin: 0, fontSize: 26, fontWeight: 700 },
  select: { background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,107,53,0.5)",
            borderRadius: 10, padding: "8px 12px", fontSize: 14 },
  cards: { display: "flex", gap: 16, flexWrap: "wrap", margin: "20px 0" },
  card: { flex: 1, minWidth: 200, background: "rgba(255,255,255,0.06)", borderRadius: 14,
          padding: "16px 20px", borderLeft: "4px solid #ff6b35" },
  cardLabel: { fontSize: 13, color: "#cbd5e1", marginBottom: 6 },
  cardValue: { fontSize: 22, fontWeight: 700 },
  section: { background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, marginTop: 20 },
  sectionTitle: { margin: "0 0 12px", fontSize: 20 },
  hint: { margin: "0 0 12px", fontSize: 13, color: "#cbd5e1" },
  empty: { color: "#cbd5e1" },
  moduleLayout: { display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { textAlign: "left", padding: "8px 10px", color: "#f7a600", borderBottom: "1px solid rgba(255,255,255,0.15)" },
  td: { padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  dot: { display: "inline-block", width: 10, height: 10, borderRadius: "50%", marginRight: 8 },
  barBg: { height: 6, background: "rgba(255,255,255,0.12)", borderRadius: 4, marginBottom: 4 },
  barFill: { height: "100%", background: "#ff6b35", borderRadius: 4 },
  tooltip: { background: "#1a1a2e", border: "1px solid rgba(255,107,53,0.5)", borderRadius: 8, color: "#fff" },
};

export default AdminUsageStatistics;
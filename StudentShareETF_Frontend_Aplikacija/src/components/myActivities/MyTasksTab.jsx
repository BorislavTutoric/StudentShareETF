import { useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { getTaskStatsApi } from "../../services/taskService";
import { BOJE, isoDatum, nazivMjeseca, ui } from "./shared";
import useUcitavanje from "./useUcitavanje";

const danas = () => new Date();
const PERIODI = [
  { kljuc: "sve", naziv: "Sve", od: () => "", do: () => "" },
  { kljuc: "mjesec", naziv: "Ovaj mjesec", od: () => { const d = danas(); return isoDatum(new Date(d.getFullYear(), d.getMonth(), 1)); },
    do: () => { const d = danas(); return isoDatum(new Date(d.getFullYear(), d.getMonth() + 1, 0)); } },
  { kljuc: "3m", naziv: "Zadnja 3 mjeseca", od: () => { const d = danas(); return isoDatum(new Date(d.getFullYear(), d.getMonth() - 2, 1)); },
    do: () => isoDatum(danas()) },
  { kljuc: "godina", naziv: "Ova godina", od: () => `${danas().getFullYear()}-01-01`, do: () => `${danas().getFullYear()}-12-31` },
];

// Krug sa procentom uspješnosti: obavljene / (obavljene + propuštene).
function ProcenatKrug({ procenat }) {
  const r = 52;
  const obim = 2 * Math.PI * r;
  const p = procenat ?? 0;
  return (
    <div style={styles.ringWrap}>
      <svg width="140" height="140" viewBox="0 0 140 140" role="img"
           aria-label={procenat == null ? "Procenat uspješnosti nije dostupan" : `Procenat uspješnosti ${procenat}%`}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(248,113,113,0.35)" strokeWidth="14" />
        {procenat != null && (
          <circle cx="70" cy="70" r={r} fill="none" stroke={BOJE.obavljene} strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={`${(p / 100) * obim} ${obim}`} transform="rotate(-90 70 70)"
                  style={{ transition: "stroke-dasharray 0.6s ease" }} />
        )}
        <text x="70" y="68" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="800">
          {procenat == null ? "—" : `${p}%`}
        </text>
        <text x="70" y="90" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">uspješnost</text>
      </svg>
      <p style={styles.ringHint}>
        {procenat == null
          ? "Još nema obaveza kojima je prošao rok."
          : "Udio obavljenih među obavezama kojima je rok prošao ili su već obavljene."}
      </p>
    </div>
  );
}

function MyTasksTab() {
  const [od, setOd] = useState("");
  const [doDatuma, setDoDatuma] = useState("");
  const kljuc = `${od}|${doDatuma}`;
  const rezultat = useUcitavanje(kljuc, () => getTaskStatsApi(od, doDatuma), "Greška pri učitavanju statistike obaveza.");
  const stats = rezultat.data;
  const loading = rezultat.kljuc !== kljuc;
  const error = rezultat.kljuc === kljuc ? rezultat.error : null;

  const aktivniPeriod = PERIODI.find((p) => p.od() === od && p.do() === doDatuma)?.kljuc;
  const mjesecData = (stats?.poMjesecima ?? []).map((m) => ({
    name: nazivMjeseca(m.mjesec), obavljene: m.obavljene, propustene: m.propustene, naCekanju: m.naCekanju,
  }));

  return (
    <div style={styles.wrap}>
      <div style={ui.section}>
        <div style={ui.filters}>
          <div style={ui.chips}>
            {PERIODI.map((p) => (
              <button key={p.kljuc} style={{ ...ui.chip, ...(aktivniPeriod === p.kljuc ? ui.chipActive : {}) }}
                      onClick={() => { setOd(p.od()); setDoDatuma(p.do()); }}>
                {p.naziv}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <label style={ui.field}>
            <span style={ui.label}>Rok od</span>
            <input type="date" style={ui.input} value={od} max={doDatuma || undefined} onChange={(e) => setOd(e.target.value)} />
          </label>
          <label style={ui.field}>
            <span style={ui.label}>Rok do</span>
            <input type="date" style={ui.input} value={doDatuma} min={od || undefined} onChange={(e) => setDoDatuma(e.target.value)} />
          </label>
        </div>
      </div>

      {error ? (
        <div style={ui.error}>{error}</div>
      ) : !stats ? (
        <div style={ui.message}>Učitavanje...</div>
      ) : (
        <div style={{ ...styles.wrap, opacity: loading ? 0.6 : 1, transition: "opacity 0.2s" }}>
          <div style={styles.topRow}>
            <div style={{ ...ui.cards, flex: "2 1 420px", alignContent: "flex-start" }}>
              <div style={{ ...ui.card, borderLeft: `4px solid ${BOJE.obavljene}` }}>
                <div style={ui.cardLabel}>Obavljeno</div>
                <div style={ui.cardValue}>{stats.obavljene}</div>
              </div>
              <div style={{ ...ui.card, borderLeft: `4px solid ${BOJE.propustene}` }}>
                <div style={ui.cardLabel}>Propušteno</div>
                <div style={{ ...ui.cardValue, color: stats.propustene > 0 ? BOJE.propustene : "#fff" }}>{stats.propustene}</div>
              </div>
              <div style={{ ...ui.card, borderLeft: `4px solid ${BOJE.naCekanju}` }}>
                <div style={ui.cardLabel}>Na čekanju</div>
                <div style={ui.cardValue}>{stats.naCekanju}</div>
              </div>
              <p style={styles.total}>Ukupno obaveza u periodu: <strong>{stats.ukupno}</strong></p>
            </div>
            <div style={{ ...ui.section, flex: "1 1 240px" }}>
              <ProcenatKrug procenat={stats.procenatUspjesnosti} />
            </div>
          </div>

          <div style={ui.section}>
            <h3 style={ui.sectionTitle}>Obaveze po mjesecima</h3>
            {mjesecData.length === 0 ? (
              <p style={ui.message}>Nema obaveza za izabrani period. Dodaj ih u Akademskom kalendaru.</p>
            ) : (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={mjesecData} barMaxSize={48}>
                    <CartesianGrid strokeDasharray="3 3" stroke={ui.grid} vertical={false} />
                    <XAxis dataKey="name" stroke={ui.axis} tick={{ fontSize: 12 }} />
                    <YAxis stroke={ui.axis} allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={ui.tooltip} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                    <Legend />
                    <Bar dataKey="obavljene" name="Obavljene" stackId="a" fill={BOJE.obavljene} />
                    <Bar dataKey="propustene" name="Propuštene" stackId="a" fill={BOJE.propustene} />
                    <Bar dataKey="naCekanju" name="Na čekanju" stackId="a" fill={BOJE.naCekanju} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", gap: 18 },
  topRow: { display: "flex", gap: 18, flexWrap: "wrap", alignItems: "stretch" },
  total: { flexBasis: "100%", margin: "2px 0 0", color: "rgba(255,255,255,0.7)", fontSize: 14 },
  ringWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  ringHint: { margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 240 },
};

export default MyTasksTab;

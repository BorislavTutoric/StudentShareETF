import { useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import useUcitavanje from "./useUcitavanje";
import { getMyActivityApi } from "../../services/myActivitiesService";
import { nazivModula } from "../../constants/moduli";
import { BOJE_MODULA, formatTrajanje, isoDatum, kratkiDatum, prijeDana, ui } from "./shared";

const PERIODI = [
  { dana: 7, naziv: "Zadnjih 7 dana" },
  { dana: 30, naziv: "Zadnjih 30 dana" },
  { dana: 90, naziv: "Zadnjih 90 dana" },
];

// Server vraća samo dane u kojima je bilo aktivnosti; dani bez aktivnosti se dopunjuju nulom.
const popuniDane = (poDanu, od, doDatuma) => {
  const mapa = new Map(poDanu.map((d) => [d.datum, d.sekundi]));
  const rezultat = [];
  const [g1, m1, d1] = od.split("-").map(Number);
  const [g2, m2, d2] = doDatuma.split("-").map(Number);
  const kraj = new Date(g2, m2 - 1, d2);
  for (let d = new Date(g1, m1 - 1, d1); d <= kraj; d.setDate(d.getDate() + 1)) {
    const iso = isoDatum(d);
    const sek = mapa.get(iso) ?? 0;
    rezultat.push({ datum: iso, name: kratkiDatum(iso), sekundi: sek, minuta: Math.round((sek / 60) * 10) / 10 });
  }
  return rezultat;
};

function MyTimeTab() {
  const [od, setOd] = useState(prijeDana(29));
  const [doDatuma, setDoDatuma] = useState(isoDatum(new Date()));
  const ispravanPeriod = !!od && !!doDatuma && od <= doDatuma;
  const kljuc = ispravanPeriod ? `${od}|${doDatuma}` : null;
  const rezultat = useUcitavanje(kljuc, () => getMyActivityApi(od, doDatuma),
    "Greška pri učitavanju vremena u aplikaciji.");
  const podaci = rezultat.data;
  const loading = kljuc != null && rezultat.kljuc !== kljuc;
  const error = rezultat.kljuc === kljuc ? rezultat.error : null;
  // dani se popunjavaju za period za koji su podaci stigli, ne za period koji se tek učitava
  const [podaciOd, podaciDo] = (rezultat.kljuc ?? `${od}|${doDatuma}`).split("|");

  const danasIso = isoDatum(new Date());
  const aktivniPeriod = doDatuma === danasIso ? PERIODI.find((p) => prijeDana(p.dana - 1) === od)?.dana : undefined;

  const dani = podaci ? popuniDane(podaci.poDanu, podaciOd, podaciDo) : [];
  const aktivnihDana = podaci ? podaci.poDanu.filter((d) => d.sekundi > 0).length : 0;
  const prosjek = aktivnihDana > 0 ? Math.round(podaci.ukupnoSekundi / aktivnihDana) : 0;
  const najvise = podaci?.poModulu[0];

  return (
    <div style={styles.wrap}>
      <div style={ui.section}>
        <div style={ui.filters}>
          <div style={ui.chips}>
            {PERIODI.map((p) => (
              <button key={p.dana} style={{ ...ui.chip, ...(aktivniPeriod === p.dana ? ui.chipActive : {}) }}
                      onClick={() => { setOd(prijeDana(p.dana - 1)); setDoDatuma(danasIso); }}>
                {p.naziv}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <label style={ui.field}>
            <span style={ui.label}>Od</span>
            <input type="date" style={ui.input} value={od} max={doDatuma} required
                   onChange={(e) => e.target.value && setOd(e.target.value)} />
          </label>
          <label style={ui.field}>
            <span style={ui.label}>Do</span>
            <input type="date" style={ui.input} value={doDatuma} min={od} max={danasIso} required
                   onChange={(e) => e.target.value && setDoDatuma(e.target.value)} />
          </label>
        </div>
        <p style={styles.hint}>Vrijeme se bilježi dok je aplikacija otvorena i vidljiva, po sekcijama koje koristiš.</p>
      </div>

      {error ? (
        <div style={ui.error}>{error}</div>
      ) : !podaci ? (
        <div style={ui.message}>Učitavanje...</div>
      ) : (
        <div style={{ ...styles.wrap, opacity: loading ? 0.6 : 1, transition: "opacity 0.2s" }}>
          <div style={ui.cards}>
            <div style={{ ...ui.card, borderLeft: "4px solid #60e016" }}>
              <div style={ui.cardLabel}>Ukupno u aplikaciji</div>
              <div style={ui.cardValue}>{formatTrajanje(podaci.ukupnoSekundi)}</div>
            </div>
            <div style={{ ...ui.card, borderLeft: "4px solid #a8edea" }}>
              <div style={ui.cardLabel}>Prosjek po aktivnom danu</div>
              <div style={ui.cardValue}>{aktivnihDana > 0 ? formatTrajanje(prosjek) : "—"}</div>
            </div>
            <div style={{ ...ui.card, borderLeft: "4px solid #fed6e3" }}>
              <div style={ui.cardLabel}>Aktivnih dana</div>
              <div style={ui.cardValue}>{aktivnihDana} <span style={styles.cardSub}>/ {dani.length}</span></div>
            </div>
            <div style={{ ...ui.card, borderLeft: "4px solid #38bdf8" }}>
              <div style={ui.cardLabel}>Najviše vremena u</div>
              <div style={{ ...ui.cardValue, fontSize: 20 }}>{najvise ? nazivModula(najvise.modul) : "—"}</div>
            </div>
          </div>

          {podaci.ukupnoSekundi === 0 ? (
            <div style={ui.section}><p style={ui.message}>Nema zabilježenog vremena za izabrani period.</p></div>
          ) : (
            <div style={styles.grid}>
              <div style={ui.section}>
                <h3 style={ui.sectionTitle}>Po modulima</h3>
                <ul style={styles.moduleList}>
                  {podaci.poModulu.map((m, i) => {
                    const udio = Math.round((m.sekundi / podaci.ukupnoSekundi) * 1000) / 10;
                    const boja = BOJE_MODULA[i % BOJE_MODULA.length];
                    return (
                      <li key={m.modul} style={styles.moduleItem}>
                        <div style={styles.moduleHeader}>
                          <span><span style={{ ...styles.dot, background: boja }} />{nazivModula(m.modul)}</span>
                          <span style={styles.moduleValue}>{formatTrajanje(m.sekundi)} · {udio}%</span>
                        </div>
                        <div style={styles.barBg}>
                          <div style={{ ...styles.barFill, width: `${udio}%`, background: boja }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div style={ui.section}>
                <h3 style={ui.sectionTitle}>Po danima</h3>
                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={dani} barCategoryGap={dani.length > 45 ? 1 : 4}>
                      <CartesianGrid strokeDasharray="3 3" stroke={ui.grid} vertical={false} />
                      <XAxis dataKey="name" stroke={ui.axis} tick={{ fontSize: 11 }} interval="preserveStartEnd" minTickGap={16} />
                      <YAxis stroke={ui.axis} unit=" min" tick={{ fontSize: 11 }} width={60} />
                      <Tooltip contentStyle={ui.tooltip} cursor={{ fill: "rgba(255,255,255,0.05)" }}
                               formatter={(_, __, item) => [formatTrajanje(item.payload.sekundi), "Vrijeme"]}
                               labelFormatter={(_, payload) => payload?.[0]?.payload.datum ?? ""} />
                      <Bar dataKey="minuta" fill="#60e016" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", gap: 18 },
  hint: { margin: "12px 0 0", fontSize: 12, color: "rgba(255,255,255,0.55)" },
  cardSub: { fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.55)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 },
  moduleList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 },
  moduleItem: { color: "#fff", fontSize: 14 },
  moduleHeader: { display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 },
  moduleValue: { color: "rgba(255,255,255,0.7)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" },
  dot: { display: "inline-block", width: 10, height: 10, borderRadius: "50%", marginRight: 8 },
  barBg: { height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 4, transition: "width 0.4s ease" },
};

export default MyTimeTab;

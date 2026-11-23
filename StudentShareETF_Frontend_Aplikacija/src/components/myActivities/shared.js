// Zajedničke pomoćne funkcije i stilovi za sekciju "Moje aktivnosti".

export const MJESECI_KRATKO = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];

export const isoDatum = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const prijeDana = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return isoDatum(d);
};

export const formatTrajanje = (sek) => {
  const h = Math.floor(sek / 3600);
  const min = Math.floor((sek % 3600) / 60);
  if (h > 0) return `${h} h ${min} min`;
  if (min > 0) return `${min} min`;
  return `${sek} s`;
};

// "2026-03" -> "Mar 2026"
export const nazivMjeseca = (ym) => {
  const [g, m] = ym.split("-").map(Number);
  return `${MJESECI_KRATKO[m - 1]} ${g}`;
};

// "2026-03-05" -> "05.03."
export const kratkiDatum = (iso) => {
  const [, m, d] = iso.split("-");
  return `${d}.${m}.`;
};

export const formatDatumVrijeme = (iso) => {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}. ${p(d.getHours())}:${p(d.getMinutes())}`;
};

export const BOJE = {
  obavljene: "#60e016",
  propustene: "#f87171",
  naCekanju: "#a8edea",
};

export const BOJE_MODULA = ["#60e016", "#a8edea", "#fed6e3", "#38bdf8", "#a78bfa", "#facc15", "#f472b6", "#94a3b8"];

export const ui = {
  section: { background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 20, border: "1px solid rgba(96,224,22,0.1)" },
  sectionTitle: { margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: "#fff" },
  filters: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" },
  field: { display: "flex", flexDirection: "column", gap: 6, minWidth: 150, flex: "0 1 180px" },
  label: { fontSize: 12, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 },
  input: {
    background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(96,224,22,0.35)", borderRadius: 10,
    padding: "8px 10px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", colorScheme: "dark",
    fontFamily: "inherit",
  },
  // <option> ne nasljeđuje tamnu pozadinu selecta, pa bi bijeli tekst bio nevidljiv na bijeloj listi
  option: { background: "#0a1457", color: "#fff" },
  chips: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: {
    background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 999, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
  },
  chipActive: { background: "rgba(96,224,22,0.18)", borderColor: "#60e016", color: "#60e016", fontWeight: 600 },
  cards: { display: "flex", gap: 14, flexWrap: "wrap" },
  card: { flex: "1 1 160px", background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 18px" },
  cardLabel: { fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 6 },
  cardValue: { fontSize: 24, fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" },
  message: { padding: 32, textAlign: "center", color: "rgba(255,255,255,0.65)" },
  error: { padding: 32, textAlign: "center", color: "#f87171" },
  tooltip: { background: "#0a1457", border: "1px solid rgba(96,224,22,0.4)", borderRadius: 8, color: "#fff" },
  axis: "rgba(255,255,255,0.6)",
  grid: "rgba(255,255,255,0.08)",
};

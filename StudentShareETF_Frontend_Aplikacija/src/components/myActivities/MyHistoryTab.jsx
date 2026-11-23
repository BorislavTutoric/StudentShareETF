import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import useUcitavanje from "./useUcitavanje";
import { getMyAuditLogApi } from "../../services/auditLogService";
import { bojaAkcije, nazivAkcije } from "../../constants/audit";
import { MODULI, nazivModula } from "../../constants/moduli";
import { formatDatumVrijeme, ui } from "./shared";

// Moduli u kojima se bilježe studentove akcije (za ove ispod se studentu nikad ne upisuje zapis).
const BEZ_ZAPISA = new Set(["ADMINISTRACIJA", "MODERACIJA", "MOJE_AKTIVNOSTI", "OBAVJESTENJA"]);
const STUDENTSKI_MODULI = Object.entries(MODULI).filter(([m]) => !BEZ_ZAPISA.has(m));
const VELICINA_STRANICE = 15;
const PRAZNI_FILTERI = { modul: "", od: "", do: "" };

function MyHistoryTab() {
  const [filteri, setFilteri] = useState(PRAZNI_FILTERI);
  const [page, setPage] = useState(0);
  const kljuc = `${filteri.modul}|${filteri.od}|${filteri.do}|${page}`;
  const rezultat = useUcitavanje(kljuc, () => getMyAuditLogApi(filteri, page, VELICINA_STRANICE),
    "Greška pri učitavanju istorije.");
  const podaci = rezultat.data;
  const loading = rezultat.kljuc !== kljuc;
  const error = rezultat.kljuc === kljuc ? rezultat.error : null;

  const postavi = (polje, vrijednost) => {
    setFilteri((f) => ({ ...f, [polje]: vrijednost }));
    setPage(0);
  };

  const imaFiltera = Object.values(filteri).some((v) => v !== "");
  const zapisi = podaci?.content ?? [];
  const ukupnoStrana = Math.max(podaci?.totalPages ?? 1, 1);

  return (
    <div style={styles.wrap}>
      <div style={ui.section}>
        <div style={ui.filters}>
          <label style={{ ...ui.field, flex: "1 1 200px" }}>
            <span style={ui.label}>Modul</span>
            <select style={ui.input} value={filteri.modul} onChange={(e) => postavi("modul", e.target.value)}>
              <option value="" style={ui.option}>Svi moduli</option>
              {STUDENTSKI_MODULI.map(([m, naziv]) => <option key={m} value={m} style={ui.option}>{naziv}</option>)}
            </select>
          </label>
          <label style={ui.field}>
            <span style={ui.label}>Od</span>
            <input type="date" style={ui.input} value={filteri.od} max={filteri.do || undefined}
                   onChange={(e) => postavi("od", e.target.value)} />
          </label>
          <label style={ui.field}>
            <span style={ui.label}>Do</span>
            <input type="date" style={ui.input} value={filteri.do} min={filteri.od || undefined}
                   onChange={(e) => postavi("do", e.target.value)} />
          </label>
          <button style={{ ...styles.resetBtn, ...(imaFiltera ? {} : styles.resetBtnDisabled) }} disabled={!imaFiltera}
                  onClick={() => { setFilteri(PRAZNI_FILTERI); setPage(0); }}>
            <RotateCcw size={16} /> Očisti
          </button>
        </div>
        {podaci && (
          <p style={styles.count}>
            {podaci.totalElements} {podaci.totalElements === 1 ? "aktivnost" : "aktivnosti"}
          </p>
        )}
      </div>

      <div style={{ ...ui.section, padding: 0, overflow: "hidden" }}>
        {error ? (
          <div style={ui.error}>{error}</div>
        ) : !podaci && loading ? (
          <div style={ui.message}>Učitavanje...</div>
        ) : zapisi.length === 0 ? (
          <div style={ui.message}>Nema aktivnosti za izabrane filtere.</div>
        ) : (
          <ul style={{ ...styles.list, opacity: loading ? 0.5 : 1 }}>
            {zapisi.map((z) => (
              <li key={z.id} style={styles.item}>
                <span style={{ ...styles.dot, background: bojaAkcije(z.tipAkcije) }} />
                <div style={styles.itemBody}>
                  <div style={styles.itemHeader}>
                    <span style={{ ...styles.badge, color: bojaAkcije(z.tipAkcije), borderColor: bojaAkcije(z.tipAkcije) }}>
                      {nazivAkcije(z.tipAkcije)}
                    </span>
                    <span style={styles.modul}>{nazivModula(z.modul)}</span>
                    <span style={styles.time}>{formatDatumVrijeme(z.datumVrijeme)}</span>
                  </div>
                  <div style={styles.opis}>{z.opis}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {podaci && podaci.totalElements > VELICINA_STRANICE && (
        <div style={styles.pagination}>
          <button style={styles.pageBtn} disabled={page === 0 || loading} onClick={() => setPage((p) => p - 1)}
                  aria-label="Prethodna stranica">
            <ChevronLeft size={18} />
          </button>
          <span>Stranica {page + 1} od {ukupnoStrana}</span>
          <button style={styles.pageBtn} disabled={!podaci.hasNext || loading} onClick={() => setPage((p) => p + 1)}
                  aria-label="Sljedeća stranica">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", gap: 18 },
  count: { margin: "12px 0 0", fontSize: 13, color: "rgba(255,255,255,0.65)" },
  resetBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "rgba(96,224,22,0.12)", color: "#60e016",
    border: "1px solid rgba(96,224,22,0.45)", borderRadius: 10, padding: "8px 14px", fontSize: 14,
    cursor: "pointer", height: 37, fontFamily: "inherit",
  },
  resetBtnDisabled: { opacity: 0.4, cursor: "default" },
  list: { listStyle: "none", margin: 0, padding: 0, transition: "opacity 0.2s" },
  item: { display: "flex", gap: 14, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  dot: { width: 10, height: 10, minWidth: 10, borderRadius: "50%", marginTop: 6 },
  itemBody: { flex: 1, minWidth: 0 },
  itemHeader: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 },
  badge: {
    display: "inline-block", border: "1px solid", borderRadius: 999, padding: "2px 10px", fontSize: 12,
    fontWeight: 600, whiteSpace: "nowrap", background: "rgba(255,255,255,0.04)",
  },
  modul: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  time: { marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" },
  opis: { fontSize: 14, color: "rgba(255,255,255,0.9)", wordBreak: "break-word" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 14, color: "rgba(255,255,255,0.75)", fontSize: 14 },
  pageBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34,
    background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(96,224,22,0.35)",
    borderRadius: 10, cursor: "pointer",
  },
};

export default MyHistoryTab;

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Search } from "lucide-react";
import { getAuditLogApi } from "../../services/auditLogService";
import { GRUPE_AKCIJA, ULOGE_FILTER, bojaAkcije, nazivAkcije, nazivUloge } from "../../constants/audit";
import { MODULI, nazivModula } from "../../constants/moduli";

const PRAZNI_FILTERI = { korisnik: "", uloga: "", tip: "", modul: "", od: "", do: "" };

// Brzi izbori iznad filtera. "Akcije moderatora" zamjenjuje staru admin sekciju.
const PRESETI = [
  { naziv: "Sve akcije", filteri: {} },
  { naziv: "Akcije moderatora", filteri: { uloga: "MODERATOR", modul: "MODERACIJA" } },
  { naziv: "Neuspješne prijave", filteri: { tip: "NEUSPJESNA_PRIJAVA" } },
  { naziv: "Administracija", filteri: { modul: "ADMINISTRACIJA" } },
];

const formatVrijeme = (iso) => {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}. ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

function AdminAuditLog({ pocetniFilteri = {} }) {
  const [filteri, setFilteri] = useState({ ...PRAZNI_FILTERI, ...pocetniFilteri });
  const [korisnikUnos, setKorisnikUnos] = useState(pocetniFilteri.korisnik ?? "");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [podaci, setPodaci] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const zahtjevRef = useRef(0);

  // Pretraga po korisniku kreće 400 ms nakon zadnjeg kucanja.
  useEffect(() => {
    const t = setTimeout(() => {
      setFilteri((f) => (f.korisnik === korisnikUnos ? f : { ...f, korisnik: korisnikUnos }));
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [korisnikUnos]);

  useEffect(() => {
    const id = ++zahtjevRef.current;           // ignoriše odgovore starijih zahtjeva
    setLoading(true);
    setError(null);
    getAuditLogApi(filteri, page, size)
      .then((data) => { if (id === zahtjevRef.current) setPodaci(data); })
      .catch((err) => {
        console.error(err);
        if (id === zahtjevRef.current) setError("Greška pri učitavanju audit loga.");
      })
      .finally(() => { if (id === zahtjevRef.current) setLoading(false); });
  }, [filteri, page, size]);

  const postavi = (polje, vrijednost) => {
    setFilteri((f) => ({ ...f, [polje]: vrijednost }));
    setPage(0);
  };

  const primijeniPreset = (preset) => {
    setKorisnikUnos("");
    setFilteri({ ...PRAZNI_FILTERI, ...preset.filteri });
    setPage(0);
  };

  const presetAktivan = (preset) =>
    Object.keys(PRAZNI_FILTERI).every((k) => (preset.filteri[k] ?? "") === filteri[k]);

  const imaFiltera = Object.values(filteri).some((v) => v !== "");
  const zapisi = podaci?.content ?? [];
  const ukupnoStrana = Math.max(podaci?.totalPages ?? 1, 1);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Audit log</h2>
          <p style={styles.subtitle}>
            Aktivnosti svih korisnika
            {podaci && <> · {podaci.totalElements} {podaci.totalElements === 1 ? "zapis" : "zapisa"}</>}
          </p>
        </div>
        <div style={styles.presets}>
          {PRESETI.map((p) => (
            <button
              key={p.naziv}
              onClick={() => primijeniPreset(p)}
              style={{ ...styles.chip, ...(presetAktivan(p) ? styles.chipActive : {}) }}
            >
              {p.naziv}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.filters}>
        <label style={{ ...styles.field, flex: 2, minWidth: 200 }}>
          <span style={styles.label}>Korisnik</span>
          <div style={styles.searchWrap}>
            <Search size={16} style={styles.searchIcon} />
            <input
              style={{ ...styles.input, paddingLeft: 34 }}
              placeholder="Ime, prezime ili korisničko ime"
              value={korisnikUnos}
              onChange={(e) => setKorisnikUnos(e.target.value)}
            />
          </div>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Uloga</span>
          <select style={styles.input} value={filteri.uloga} onChange={(e) => postavi("uloga", e.target.value)}>
            {ULOGE_FILTER.map((u) => <option key={u.vrijednost} value={u.vrijednost}>{u.naziv}</option>)}
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Akcija</span>
          <select style={styles.input} value={filteri.tip} onChange={(e) => postavi("tip", e.target.value)}>
            <option value="">Sve akcije</option>
            {GRUPE_AKCIJA.map((g) => (
              <optgroup key={g.naziv} label={g.naziv}>
                {Object.entries(g.tipovi).map(([tip, naziv]) => <option key={tip} value={tip}>{naziv}</option>)}
              </optgroup>
            ))}
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Modul</span>
          <select style={styles.input} value={filteri.modul} onChange={(e) => postavi("modul", e.target.value)}>
            <option value="">Svi moduli</option>
            {Object.entries(MODULI).map(([m, naziv]) => <option key={m} value={m}>{naziv}</option>)}
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Od</span>
          <input type="date" style={styles.input} value={filteri.od} max={filteri.do || undefined}
                 onChange={(e) => postavi("od", e.target.value)} />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Do</span>
          <input type="date" style={styles.input} value={filteri.do} min={filteri.od || undefined}
                 onChange={(e) => postavi("do", e.target.value)} />
        </label>

        <button
          style={{ ...styles.resetBtn, ...(imaFiltera || korisnikUnos ? {} : styles.resetBtnDisabled) }}
          disabled={!imaFiltera && !korisnikUnos}
          onClick={() => primijeniPreset(PRESETI[0])}
          title="Očisti filtere"
        >
          <RotateCcw size={16} /> Očisti
        </button>
      </div>

      <div style={styles.tableWrap}>
        {error ? (
          <div style={styles.message}>{error}</div>
        ) : !podaci && loading ? (
          <div style={styles.message}>Učitavanje...</div>
        ) : zapisi.length === 0 ? (
          <div style={styles.message}>Nema zapisa za izabrane filtere.</div>
        ) : (
          <table style={{ ...styles.table, opacity: loading ? 0.5 : 1 }}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: 170 }}>Vrijeme</th>
                <th style={{ ...styles.th, width: 200 }}>Korisnik</th>
                <th style={{ ...styles.th, width: 160 }}>Akcija</th>
                <th style={{ ...styles.th, width: 140 }}>Modul</th>
                <th style={styles.th}>Opis</th>
              </tr>
            </thead>
            <tbody>
              {zapisi.map((z) => (
                <tr key={z.id}>
                  <td style={{ ...styles.td, whiteSpace: "nowrap", color: "#cbd5e1" }}>{formatVrijeme(z.datumVrijeme)}</td>
                  <td style={styles.td}>
                    {z.korisnickoIme ? (
                      <>
                        <div style={styles.userName}>{z.imePrezime}</div>
                        <div style={styles.userMeta}>@{z.korisnickoIme} · {nazivUloge(z.uloga)}</div>
                      </>
                    ) : (
                      <span style={styles.userMeta}>nepoznat korisnik</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, color: bojaAkcije(z.tipAkcije), borderColor: bojaAkcije(z.tipAkcije) }}>
                      {nazivAkcije(z.tipAkcije)}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: "#cbd5e1" }}>{nazivModula(z.modul)}</td>
                  <td style={{ ...styles.td, wordBreak: "break-word" }}>{z.opis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {podaci && podaci.totalElements > 0 && (
        <div style={styles.pagination}>
          <label style={styles.pageSize}>
            Po stranici
            <select style={{ ...styles.input, width: 80, padding: "6px 8px" }} value={size}
                    onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}>
              {[20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <div style={styles.pageNav}>
            <button style={styles.pageBtn} disabled={page === 0 || loading} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={18} />
            </button>
            <span>Stranica {page + 1} od {ukupnoStrana}</span>
            <button style={styles.pageBtn} disabled={!podaci.hasNext || loading} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "24px", color: "#fff" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" },
  title: { margin: 0, fontSize: 26, fontWeight: 700 },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#cbd5e1" },
  presets: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: { background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 999, padding: "6px 14px", fontSize: 13, cursor: "pointer" },
  chipActive: { background: "rgba(255,107,53,0.2)", borderColor: "#ff6b35", color: "#ff6b35", fontWeight: 600 },
  filters: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", margin: "20px 0",
             background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 140 },
  label: { fontSize: 12, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: 0.5 },
  input: { background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,107,53,0.4)",
           borderRadius: 10, padding: "8px 10px", fontSize: 14, outline: "none", width: "100%",
           boxSizing: "border-box", colorScheme: "dark" },
  searchWrap: { position: "relative" },
  searchIcon: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#cbd5e1" },
  resetBtn: { display: "flex", alignItems: "center", gap: 6, background: "rgba(255,107,53,0.15)", color: "#ff6b35",
              border: "1px solid rgba(255,107,53,0.5)", borderRadius: 10, padding: "8px 14px", fontSize: 14,
              cursor: "pointer", height: 37 },
  resetBtnDisabled: { opacity: 0.4, cursor: "default" },
  tableWrap: { background: "rgba(255,255,255,0.04)", borderRadius: 16, overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14, transition: "opacity 0.2s" },
  th: { textAlign: "left", padding: "12px 14px", color: "#f7a600", borderBottom: "1px solid rgba(255,255,255,0.15)",
        fontWeight: 600, position: "sticky", top: 0, background: "#16213e" },
  td: { padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", verticalAlign: "top" },
  userName: { fontWeight: 600 },
  userMeta: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  badge: { display: "inline-block", border: "1px solid", borderRadius: 999, padding: "2px 10px", fontSize: 12,
           fontWeight: 600, whiteSpace: "nowrap", background: "rgba(255,255,255,0.04)" },
  message: { padding: 40, textAlign: "center", color: "#cbd5e1" },
  pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16,
                gap: 12, flexWrap: "wrap", fontSize: 14, color: "#cbd5e1" },
  pageSize: { display: "flex", alignItems: "center", gap: 8 },
  pageNav: { display: "flex", alignItems: "center", gap: 12 },
  pageBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34,
             background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,107,53,0.4)",
             borderRadius: 10, cursor: "pointer" },
};

export default AdminAuditLog;

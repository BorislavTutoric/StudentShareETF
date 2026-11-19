// Tipovi akcija iz audit loga — ista lista kao enum TipAkcije na backendu.
// Grupisano kao u planu, da se u filteru prikazuju po grupama.
export const GRUPE_AKCIJA = [
  {
    naziv: "Autentifikacija",
    boja: "#38bdf8",
    tipovi: {
      PRIJAVA: "Prijava",
      NEUSPJESNA_PRIJAVA: "Neuspješna prijava",
      ODJAVA: "Odjava",
      VERIFIKACIJA_EMAILA: "Verifikacija emaila",
    },
  },
  {
    naziv: "Profil",
    boja: "#94a3b8",
    tipovi: { IZMJENA_PROFILA: "Izmjena profila", PROMJENA_LOZINKE: "Promjena lozinke" },
  },
  {
    naziv: "Materijali",
    boja: "#60e016",
    tipovi: {
      PREGLED_MATERIJALA: "Pregled materijala",
      PREUZIMANJE_MATERIJALA: "Preuzimanje materijala",
      UPLOAD_MATERIJALA: "Upload materijala",
      CUVANJE_MATERIJALA: "Čuvanje materijala",
    },
  },
  {
    naziv: "Događaji",
    boja: "#f472b6",
    tipovi: { KREIRANJE_DOGADJAJA: "Postavljanje događaja" },
  },
  {
    naziv: "Savjeti i interakcije",
    boja: "#facc15",
    tipovi: {
      KREIRANJE_SAVJETA: "Objava savjeta",
      KOMENTARISANJE: "Komentarisanje",
      OCJENJIVANJE: "Ocjenjivanje",
      SVIDJANJE: "Sviđanje",
      UKLANJANJE_SVIDJANJA: "Uklanjanje sviđanja",
      PRIJAVA_SADRZAJA: "Prijava sadržaja",
      BRISANJE_SAVJETA: "Brisanje svog savjeta",
      BRISANJE_KOMENTARA: "Brisanje svog komentara",
      BRISANJE_OCJENE: "Brisanje svoje ocjene",
    },
  },
  {
    naziv: "Obaveze",
    boja: "#a78bfa",
    tipovi: {
      KREIRANJE_OBAVEZE: "Kreiranje obaveze",
      IZMJENA_OBAVEZE: "Izmjena obaveze",
      BRISANJE_OBAVEZE: "Brisanje obaveze",
    },
  },
  {
    naziv: "Moderacija",
    boja: "#f7a600",
    tipovi: { ODOBRAVANJE: "Odobravanje", ODBIJANJE: "Odbijanje", BRISANJE_SADRZAJA: "Brisanje sadržaja" },
  },
  {
    naziv: "Administracija",
    boja: "#ff6b35",
    tipovi: {
      KREIRANJE_NALOGA: "Kreiranje naloga",
      AKTIVACIJA_NALOGA: "Aktivacija naloga",
      DEAKTIVACIJA_NALOGA: "Deaktivacija naloga",
      POSTAVLJANJE_KALENDARA: "Postavljanje kalendara",
      POSTAVLJANJE_RASPOREDA_ISPITA: "Postavljanje rasporeda ispita",
    },
  },
];

const PO_TIPU = Object.fromEntries(
  GRUPE_AKCIJA.flatMap((g) => Object.entries(g.tipovi).map(([tip, naziv]) => [tip, { naziv, boja: g.boja }]))
);

export const nazivAkcije = (tip) => PO_TIPU[tip]?.naziv ?? tip;
// Crveno: akcije koje admin treba lako uočiti.
const ISTAKNUTE = new Set(["NEUSPJESNA_PRIJAVA", "PRIJAVA_SADRZAJA"]);
export const bojaAkcije = (tip) => (ISTAKNUTE.has(tip) ? "#f87171" : PO_TIPU[tip]?.boja ?? "#94a3b8");

// Uloge: vrijednost filtera -> naziv. "MODERATOR" na serveru hvata oba moderatora.
export const ULOGE_FILTER = [
  { vrijednost: "", naziv: "Sve uloge" },
  { vrijednost: "ADMIN", naziv: "Admin" },
  { vrijednost: "MODERATOR", naziv: "Svi moderatori" },
  { vrijednost: "MODERATOR_ZA_MATERIJALE", naziv: "Moderator materijala" },
  { vrijednost: "MODERATOR_ZA_DOGAĐAJE", naziv: "Moderator događaja" },
  { vrijednost: "STUDENT", naziv: "Student" },
];

export const nazivUloge = (uloga) =>
  ({
    ADMIN: "Admin",
    STUDENT: "Student",
    MODERATOR_ZA_MATERIJALE: "Moderator materijala",
    "MODERATOR_ZA_DOGAĐAJE": "Moderator događaja",
  })[uloga] ?? (uloga || "—");

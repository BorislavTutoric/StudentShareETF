// Moduli aplikacije — ista lista kao enum Modul na backendu ("Dan 0" iz plana).
// Ključ je vrijednost koju šalje/vraća server, a vrijednost je naziv za prikaz.
export const MODULI = {
  AUTENTIFIKACIJA: "Autentifikacija",
  PROFIL: "Profil",
  MATERIJALI: "Materijali",
  SACUVANO: "Sačuvano",
  OBAVJESTENJA: "Obavještenja",
  KALENDAR_OBAVEZE: "Akademski kalendar",
  SAVJETI: "Savjeti",
  DOGADJAJI: "Događaji",
  MOJE_AKTIVNOSTI: "Moje aktivnosti",
  ADMINISTRACIJA: "Administracija",
  MODERACIJA: "Moderacija",
};

export const nazivModula = (modul) => MODULI[modul] ?? modul;

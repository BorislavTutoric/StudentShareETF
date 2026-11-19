package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.enums;

/**
 * Tipovi akcija koje se upisuju u AUDIT_LOG.
 * U bazi se čuva kao tekst (VARCHAR(40)).
 */
public enum TipAkcije {
    // autentifikacija
    PRIJAVA,
    NEUSPJESNA_PRIJAVA,
    ODJAVA,

    // materijali
    PREGLED_MATERIJALA,
    PREUZIMANJE_MATERIJALA,
    UPLOAD_MATERIJALA,
    CUVANJE_MATERIJALA,

    // događaji (dodano van plana: student postavlja događaj, kao UPLOAD_MATERIJALA)
    KREIRANJE_DOGADJAJA,

    // obaveze
    KREIRANJE_OBAVEZE,
    IZMJENA_OBAVEZE,
    BRISANJE_OBAVEZE,

    // moderacija
    ODOBRAVANJE,
    ODBIJANJE,
    BRISANJE_SADRZAJA,

    // administracija
    KREIRANJE_NALOGA,
    AKTIVACIJA_NALOGA,
    DEAKTIVACIJA_NALOGA,

    // ---- dodano van plana ----

    // sadržaj koji prave studenti (savjeti, komentari, ocjene, prijave, lajkovi)
    KREIRANJE_SAVJETA,
    KOMENTARISANJE,
    OCJENJIVANJE,
    PRIJAVA_SADRZAJA,
    SVIDJANJE,
    UKLANJANJE_SVIDJANJA,

    // student briše SVOJ sadržaj (moderatorsko brisanje je BRISANJE_SADRZAJA)
    BRISANJE_SAVJETA,
    BRISANJE_KOMENTARA,
    BRISANJE_OCJENE,

    // profil i nalog
    IZMJENA_PROFILA,
    PROMJENA_LOZINKE,
    VERIFIKACIJA_EMAILA,

    // admin: kalendar i ispiti
    POSTAVLJANJE_KALENDARA,
    POSTAVLJANJE_RASPOREDA_ISPITA
}

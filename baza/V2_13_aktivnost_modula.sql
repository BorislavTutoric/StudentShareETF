USE studentshareetf_db;

CREATE TABLE IF NOT EXISTS aktivnost_modula (
  AktivnostId     INT         NOT NULL AUTO_INCREMENT,
  KorisnikId      INT         NOT NULL,
  Modul           VARCHAR(30) NOT NULL,
  Datum           DATE        NOT NULL,
  TrajanjeSekundi INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (AktivnostId),
  UNIQUE KEY UQ_AKTIVNOST (KorisnikId, Modul, Datum),
  CONSTRAINT FK_AKTIVNOST_KORISNIK FOREIGN KEY (KorisnikId)
    REFERENCES korisnik (KorisnikId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

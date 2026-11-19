USE studentshareetf_db;

CREATE TABLE IF NOT EXISTS audit_log (
  AuditLogId   INT          NOT NULL AUTO_INCREMENT,
  KorisnikId   INT          NULL,
  Uloga        VARCHAR(50)  NULL,
  TipAkcije    VARCHAR(40)  NOT NULL,
  Modul        VARCHAR(30)  NOT NULL,
  EntitetTip   VARCHAR(50)  NULL,
  EntitetId    INT          NULL,
  Opis         VARCHAR(500) NOT NULL,
  DatumVrijeme DATETIME     NOT NULL,
  PRIMARY KEY (AuditLogId),
  KEY IX_AUDIT_KORISNIK_DATUM (KorisnikId, DatumVrijeme),
  KEY IX_AUDIT_TIP_DATUM      (TipAkcije, DatumVrijeme),
  KEY IX_AUDIT_DATUM          (DatumVrijeme),
  CONSTRAINT FK_AUDIT_LOG_KORISNIK FOREIGN KEY (KorisnikId)
    REFERENCES korisnik (KorisnikId) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

START TRANSACTION;

INSERT INTO audit_log (KorisnikId, Uloga, TipAkcije, Modul, EntitetTip, EntitetId, Opis, DatumVrijeme)
SELECT s.KorisnikId, s.Uloga, s.TipAkcije, 'MODERACIJA', s.EntitetTip, NULL, s.Opis, s.DatumVrijeme
FROM (
  SELECT ma.ModeratorId AS KorisnikId,
         k.Uloga,
         CASE REGEXP_SUBSTR(ma.Opis, ' je (odobrio|odbio|dobio|obrisao) ')
              WHEN ' je odobrio ' THEN 'ODOBRAVANJE'
              WHEN ' je obrisao ' THEN 'BRISANJE_SADRZAJA'
              ELSE 'ODBIJANJE'
         END AS TipAkcije,
         CASE
              WHEN ma.Opis REGEXP ' je [a-z]+ (zahtjev za uklanjanje )?(komentara|komentar) na post' THEN 'KOMENTAR_SAVJETA'
              WHEN ma.Opis REGEXP ' je [a-z]+ (zahtjev za uklanjanje )?(komentara|komentar) '        THEN 'KOMENTAR'
              WHEN ma.Opis REGEXP ' je [a-z]+ (zahtjev za uklanjanje )?(posta|post) '                 THEN 'SAVJET'
              WHEN ma.Opis REGEXP ' je [a-z]+ (postavljanje )?(dogadjaj|događaj|dogadjaja|događaja) ' THEN 'DOGADJAJ'
              WHEN ma.Opis REGEXP ' je [a-z]+ materijal '                                             THEN 'MATERIJAL'
              ELSE NULL
         END AS EntitetTip,
         REPLACE(ma.Opis, ' je dobio materijal ', ' je odbio materijal ') AS Opis,
         ma.DatumVrijeme
  FROM moderator_audit ma
  LEFT JOIN korisnik k ON k.KorisnikId = ma.ModeratorId
) AS s
WHERE NOT EXISTS (
  SELECT 1 FROM audit_log a
  WHERE a.Modul = 'MODERACIJA'
    AND a.KorisnikId   = s.KorisnikId
    AND a.DatumVrijeme = s.DatumVrijeme
    AND a.Opis         = s.Opis
);

COMMIT;

SELECT (SELECT COUNT(*) FROM moderator_audit)                       AS moderator_audit,
       (SELECT COUNT(*) FROM audit_log WHERE Modul = 'MODERACIJA')  AS audit_log_moderacija;

SELECT TipAkcije, EntitetTip, COUNT(*) AS broj
FROM audit_log
WHERE Modul = 'MODERACIJA'
GROUP BY TipAkcije, EntitetTip
ORDER BY TipAkcije, EntitetTip;

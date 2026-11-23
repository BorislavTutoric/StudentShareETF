USE studentshareetf_db;

-- Dio 3: student označava obaveze kao obavljene.
-- Postojeće obaveze dobijaju Obavljena = 0 (nisu označene).
ALTER TABLE obaveza
  ADD COLUMN Obavljena       BIT(1)   NOT NULL DEFAULT b'0',
  ADD COLUMN DatumObavljanja DATETIME NULL;

-- Statistika i provjera propuštenih obaveza filtriraju po studentu i datumu.
CREATE INDEX IX_OBAVEZA_STUDENT_DATUM ON obaveza (StudentId, DatumVrijeme);

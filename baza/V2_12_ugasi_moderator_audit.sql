USE studentshareetf_db;

SELECT (SELECT COUNT(*) FROM moderator_audit)                       AS moderator_audit,
       (SELECT COUNT(*) FROM audit_log WHERE Modul = 'MODERACIJA')  AS audit_log_moderacija;

DROP TABLE IF EXISTS moderator_audit;

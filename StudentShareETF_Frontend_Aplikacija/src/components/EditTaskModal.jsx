import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import FlipPicker from "./FlipPicker";
import { updateTaskApi } from "../services/taskService";

// Modal za izmjenu lične obaveze (PUT /api/tasks/{id}).
// Poslije snimanja server briše stare podsjetnike i pravi nove prema novom roku.
function EditTaskModal({ isOpen, task, onClose, onSaved }) {
  const [naslov, setNaslov] = useState("");
  const [opis, setOpis] = useState("");
  const [datum, setDatum] = useState("");
  const [includeTime, setIncludeTime] = useState(false);
  const [sat, setSat] = useState(9);
  const [minut, setMinut] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !task) return;
    setNaslov(task.title ?? "");
    setOpis(task.description ?? "");
    setDatum(task.date ?? "");
    const imaVrijeme = !!task.time && task.time !== "00:00";
    setIncludeTime(imaVrijeme);
    if (imaVrijeme) {
      const [h, m] = task.time.split(":").map(Number);
      setSat(h);
      setMinut(m);
    } else {
      setSat(9);
      setMinut(0);
    }
    setError(null);
  }, [isOpen, task]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, saving, onClose]);

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    if (!naslov.trim()) { setError("Naslov obaveze je obavezan."); return; }
    if (!datum) { setError("Izaberite datum."); return; }

    const vrijeme = includeTime ? `${String(sat).padStart(2, "0")}:${String(minut).padStart(2, "0")}` : "";
    try {
      setSaving(true);
      setError(null);
      const izmijenjena = await updateTaskApi(task.id, { naslov: naslov.trim(), opis, datum, vrijeme });
      onSaved(izmijenjena, task);
    } catch (err) {
      console.error(err);
      const poruka = err.response?.data?.message;
      setError(typeof poruka === "string" && poruka ? poruka : "Izmjena obaveze nije uspjela.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={() => !saving && onClose()}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"
           aria-labelledby="edit-task-title">
        <button style={styles.closeBtn} onClick={onClose} disabled={saving} aria-label="Zatvori">
          <X size={18} />
        </button>

        <h3 id="edit-task-title" style={styles.title}>Izmijeni obavezu</h3>

        <div style={styles.form}>
          <label style={styles.group}>
            <span style={styles.label}>Naslov obaveze *</span>
            <input style={styles.input} value={naslov} maxLength={255} autoFocus
                   onChange={(e) => setNaslov(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && handleSave()} />
          </label>

          <label style={styles.group}>
            <span style={styles.label}>Opis (opciono)</span>
            <textarea style={styles.textarea} value={opis} onChange={(e) => setOpis(e.target.value)} />
          </label>

          <label style={styles.group}>
            <span style={styles.label}>Datum *</span>
            <input type="date" style={styles.input} value={datum} onChange={(e) => setDatum(e.target.value)} />
          </label>

          <label style={styles.checkboxRow}>
            <input type="checkbox" checked={includeTime} style={styles.checkbox}
                   onChange={(e) => setIncludeTime(e.target.checked)} />
            Dodaj vrijeme (opciono)
          </label>

          {includeTime && (
            <div style={styles.timePicker}>
              <FlipPicker value={sat} onChange={setSat} min={0} max={23} />
              <span style={styles.separator}>:</span>
              <FlipPicker value={minut} onChange={setMinut} min={0} max={59} />
            </div>
          )}

          {task.obavljena && (
            <p style={styles.hint}>Obaveza je označena kao obavljena, pa se za nju ne prave novi podsjetnici.</p>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.buttons}>
            <button style={{ ...styles.saveBtn, ...(saving ? styles.disabled : {}) }} onClick={handleSave} disabled={saving}>
              <Save size={16} /> {saving ? "Čuvanje..." : "Sačuvaj"}
            </button>
            <button style={styles.cancelBtn} onClick={onClose} disabled={saving}>Otkaži</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(10, 20, 87, 0.55)", backdropFilter: "blur(3px)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 16,
  },
  modal: {
    background: "linear-gradient(135deg, #0a1457 0%, #1a2a5e 50%, #2a1f5e 100%)",
    border: "2px solid rgba(168, 237, 234, 0.35)", borderRadius: 16, padding: 24,
    width: "100%", maxWidth: 420, position: "relative", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
    maxHeight: "90vh", overflowY: "auto",
  },
  closeBtn: {
    position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%",
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  title: { color: "#a8edea", fontSize: 20, fontWeight: 800, margin: "0 0 18px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  group: { display: "flex", flexDirection: "column", gap: 6 },
  label: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 },
  input: {
    background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.12)", borderRadius: 10,
    padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", colorScheme: "dark",
  },
  textarea: {
    background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.12)", borderRadius: 10,
    padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit",
    resize: "vertical", minHeight: 60, maxHeight: 120,
  },
  checkboxRow: {
    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
    background: "rgba(96, 224, 22, 0.1)", border: "1px solid rgba(96, 224, 22, 0.2)",
    color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  checkbox: { width: 18, height: 18, accentColor: "#60e016", cursor: "pointer" },
  timePicker: { display: "flex", justifyContent: "center", alignItems: "center", gap: 8 },
  separator: { color: "#a8edea", fontSize: 24, opacity: 0.8 },
  hint: { margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)", fontStyle: "italic" },
  error: { margin: 0, fontSize: 13, color: "#f87171", fontWeight: 600 },
  buttons: { display: "flex", gap: 8, marginTop: 4 },
  saveBtn: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    background: "linear-gradient(135deg, #60e016 0%, #4ec70f 100%)", color: "#0a1457", border: "none",
    borderRadius: 10, padding: "10px 14px", fontWeight: 700, fontSize: 14, cursor: "pointer",
  },
  cancelBtn: {
    flex: 1, background: "rgba(239, 68, 68, 0.15)", border: "2px solid rgba(239, 68, 68, 0.3)", color: "#ef4444",
    borderRadius: 10, padding: "10px 14px", fontWeight: 700, fontSize: 14, cursor: "pointer",
  },
  disabled: { opacity: 0.6, cursor: "default" },
};

export default EditTaskModal;

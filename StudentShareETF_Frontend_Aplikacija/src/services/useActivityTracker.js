import { useEffect, useRef } from "react";
import api from "../services/api";

const INTERVAL_MS = 30000;
const SEKCIJA_U_MODUL = {
  "Profil": "PROFIL", "Početna": "MATERIJALI", "Obavještenja": "OBAVJESTENJA",
  "Sačuvano": "SACUVANO", "Akademski kalendar": "KALENDAR_OBAVEZE",
  "Savjeti": "SAVJETI", "Događaji": "DOGADJAJI", "Moje aktivnosti": "MOJE_AKTIVNOSTI",
};

export default function useActivityTracker(activeSection) {
  const sekcijaRef = useRef(activeSection);
  useEffect(() => { sekcijaRef.current = activeSection; }, [activeSection]);

  useEffect(() => {
    const posalji = () => {
      if (document.hidden) return;                       
      const modul = SEKCIJA_U_MODUL[sekcijaRef.current];
      if (!modul) return;
      api.post("api/activity/heartbeat", { modul }).catch(() => {});
    };
    const id = setInterval(posalji, INTERVAL_MS);
    return () => clearInterval(id);                      
  }, []);
}
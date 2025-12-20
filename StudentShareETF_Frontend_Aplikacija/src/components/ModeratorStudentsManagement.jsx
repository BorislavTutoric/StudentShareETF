import React, { useState, useEffect } from "react";
import { moderatorActionService } from "../services/moderatorActionsService";

export default function ModeratorStudentsManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await moderatorActionService.getAllStudents();
        setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStatusChange = async (student) => {
    const trenutniStatus = student.active || student.aktivan;
    const noviStatus = trenutniStatus ? 0 : 1;
    const id = student.userId || student.korisnikId;

    try {
      await moderatorActionService.toggleStudentStatus(id, noviStatus);
      setStudents(prev => prev.map(s => {
        const sId = s.userId || s.korisnikId;
        if (sId === id) {
          return s.active !== undefined ? { ...s, active: !trenutniStatus } : { ...s, aktivan: noviStatus };
        }
        return s;
      }));
    } catch (err) {
      alert("Greška pri promjeni statusa.");
    }
  };

  const activeStudents = students.filter(s => s.active === true || s.aktivan === 1 || s.active === 1);
  const suspendedStudents = students.filter(s => s.active === false || s.aktivan === 0 || s.active === 0);

  if (loading) return <div style={{color: 'white', textAlign: 'center', padding: '20px'}}>Učitavanje podataka...</div>;

  return (
    <div style={styles.container}>
      {/* Kolona za Aktivne */}
      <div style={styles.column}>
        <div style={{...styles.headerBox, borderBottom: '2px solid #60e016'}}>Aktivni nalozi</div>
        <div style={styles.list}>
          {activeStudents.map(s => (
            <div key={s.userId || s.korisnikId} style={styles.item}>
              <span style={styles.name}>{s.name || `${s.ime} ${s.prezime}`}</span>
              <button onClick={() => handleStatusChange(s)} style={styles.suspendBtn}>Suspenduj</button>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.divider} />

      {/* Kolona za Suspendovane */}
      <div style={styles.column}>
        <div style={{...styles.headerBox, borderBottom: '2px solid #ff4d4d'}}>Suspendovani nalozi</div>
        <div style={styles.list}>
          {suspendedStudents.map(s => (
            <div key={s.userId || s.korisnikId} style={styles.item}>
              <span style={styles.name}>{s.name || `${s.ime} ${s.prezime}`}</span>
              <button onClick={() => handleStatusChange(s)} style={styles.activateBtn}>Aktiviraj</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
    container: { 
        display: "flex", 
        background: "rgba(10, 20, 87, 0.3)", 
        borderRadius: "15px", 
        padding: "25px", 
        border: "1px solid rgba(255, 255, 255, 0.1)", 
        minHeight: "450px", 
        gap: "15px",
        backdropFilter: "blur(10px)" 
    },
    column: { 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        gap: "15px" 
    },
    divider: { 
        width: "1px", 
        background: "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent)", 
        margin: "0 5px" 
    },
    headerBox: { 
        background: "rgba(255, 255, 255, 0.1)", 
        color: "white", 
        textAlign: "center", 
        padding: "10px", 
        borderRadius: "12px", 
        fontWeight: "600", 
        fontSize: "16px",
        letterSpacing: "0.5px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
    },
    list: { 
        display: "flex", 
        flexDirection: "column", 
        gap: "8px",
        maxHeight: "400px",
        overflowY: "auto",
        paddingRight: "5px"
    },
    item: { 
        background: "rgba(255, 255, 255, 0.08)", 
        padding: "8px 15px", 
        borderRadius: "10px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        transition: "transform 0.2s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    name: { 
        color: "rgba(255, 255, 255, 0.9)", 
        fontSize: "14px",
        fontWeight: "500" 
    },
    suspendBtn: { 
        background: "none", 
        border: "none", 
        color: "#ff9999", 
        fontSize: "12px",
        textDecoration: "none", 
        cursor: "pointer", 
        fontStyle: "italic",
        opacity: "0.8",
        transition: "0.3s"
    },
    activateBtn: { 
        background: "rgba(96, 224, 22, 0.1)", 
        border: "1px solid #60e016", 
        color: "#60e016", 
        fontSize: "11px",
        padding: "4px 10px",
        borderRadius: "15px",
        cursor: "pointer", 
        fontWeight: "bold",
        transition: "0.3s"
    }
};
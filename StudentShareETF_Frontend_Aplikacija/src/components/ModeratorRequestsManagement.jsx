import React, { useState, useEffect } from "react";
import { moderatorActionService } from "../services/moderatorActionsService";
import { Info, User, Calendar, Book, MessageSquare, AlertTriangle, ExternalLink, X, Check, Trash2, Shield } from "lucide-react";

export default function ModeratorRequestsManagement() {
  const [materialRequests, setMaterialRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadAllRequests = async () => {
    setLoading(true);
    try {
      const [materials, comments, posts, postComments] = await Promise.all([
        moderatorActionService.getPendingMaterials(),
        moderatorActionService.getPendingComments(),
        moderatorActionService.getPendingPosts(),
        moderatorActionService.getPendingPostComments()
      ]);

      // MAPIRANJE MATERIJALA (MaterialResponse)
      const mappedMaterials = materials.map(m => ({
    ...m,
    id: m.materialId,
    displayTitle: m.name, // npr. "ISZ - skripta za usmeni.pdf"
    displayAuthor: "Student", // Ako MaterialResponse nema username, ostavi "Student"
    displaySub: m.subjectName || "Nespecificiran predmet", // Ovdje se povlači predmet
    displayInfo: m.category || "Ostalo",
    type: 'MATERIJAL',
    label: 'Zahtjev za materijal'
}));

      // MAPIRANJE PRIJAVA (Spajanje različitih DTO-ova u jedan format)
      const allReports = [
        // Komentari na materijale (MaterialCommentResponse)
        ...comments.map(c => ({
          ...c,
          id: c.commentId,
          displayTitle: `${c.name} ${c.surname}`.trim() || "Korisnik",
          displayContent: c.sadrzaj,
          displayDate: c.datum,
          type: 'KOMENTAR',
          label: 'Komentar na materijal'
        })),
        // Postovi/Advice (AdviceForModeratorResponse)
        ...posts.map(p => ({
          ...p,
          id: p.id,
          displayTitle: p.username || "Korisnik",
          displayContent: p.content,
          displayDate: p.dateTime,
          type: 'POST',
          label: 'Prijavljen savjet'
        })),
        // Komentari na postove (Vjerovatno isti Advice DTO)
        ...postComments.map(pc => ({
          ...pc,
          id: pc.id,
          displayTitle: pc.username || "Korisnik",
          displayContent: pc.content,
          displayDate: pc.dateTime,
          type: 'POST_KOMENTAR',
          label: 'Komentar na savjet'
        }))
      ];

      setMaterialRequests(mappedMaterials);
      setReports(allReports);
    } catch (err) {
      console.error("Greška pri učitavanju zahtjeva:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllRequests(); }, []);

  const openDetails = async (item) => {
    if (item.type === 'MATERIJAL') {
      try {
        const url = await moderatorActionService.getMaterialUrl(item.id);
        setSelectedItem({ ...item, fileUrl: url });
      } catch { setSelectedItem(item); }
    } else { setSelectedItem(item); }
  };

  const handleReview = async (e, id, isApproved, type) => {
    if(e) e.stopPropagation();
    try {
      if (type === 'MATERIJAL') await moderatorActionService.reviewMaterial(id, isApproved);
      else if (type === 'KOMENTAR') await moderatorActionService.reviewComment(id, isApproved);
      else if (type === 'POST') await moderatorActionService.reviewPost(id, isApproved);
      else if (type === 'POST_KOMENTAR') await moderatorActionService.reviewPostComment(id, isApproved);
      
      setSelectedItem(null);
      loadAllRequests();
    } catch (err) {
      alert("Greška: " + (err.response?.data?.error || "Akcija nije uspjela"));
    }
  };

  if (loading) return <div style={styles.loading}>Učitavanje zahtjeva...</div>;

  return (
    <div style={styles.container}>
      {/* --- KOLONA 1: MATERIJALI --- */}
      <div style={styles.column}>
        <h3 style={styles.columnTitle}>Zahtjevi za materijale <span style={styles.badge}>{materialRequests.length}</span></h3>
        <div style={styles.scrollArea}>
          {materialRequests.map(m => (
            <div key={m.id} style={styles.card} onClick={() => openDetails(m)}>
              <div style={styles.cardContent}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardMainTitle}>{m.displayTitle}</span>
                  <Info size={16} color="#60e016" />
                </div>
                <div style={styles.cardMeta}><Book size={12}/> {m.displaySub}</div>
                <div style={styles.cardMeta}><User size={12}/> {m.displayAuthor}</div>
              </div>
              <div style={styles.inlineActions}>
                <button onClick={(e) => handleReview(e, m.id, true, 'MATERIJAL')} style={styles.iconBtnApprove}>
                  <Check size={14} /> Prihvati
                </button>
                <button onClick={(e) => handleReview(e, m.id, false, 'MATERIJAL')} style={styles.iconBtnReject}>
                  <X size={14} /> Odbij
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- KOLONA 2: PRIJAVE --- */}
      <div style={styles.column}>
        <h3 style={styles.columnTitle}>Prijave i Moderacija <span style={styles.badgeRed}>{reports.length}</span></h3>
        <div style={styles.scrollArea}>
          {reports.map((r, idx) => (
            <div key={idx} style={styles.card} onClick={() => openDetails(r)}>
              <div style={styles.cardContent}>
                <div style={styles.cardHeader}>
                  <span style={styles.typeBadge}>{r.label}</span>
                  <AlertTriangle size={16} color="#ff4d4d" />
                </div>
                <p style={styles.previewText}>"{r.displayContent?.substring(0, 60)}{r.displayContent?.length > 60 ? '...' : ''}"</p>
                <div style={styles.cardMeta}><User size={12}/> {r.displayTitle}</div>
              </div>
              <div style={styles.inlineActions}>
                <button onClick={(e) => handleReview(e, r.id, true, r.type)} style={styles.iconBtnKeep}>
                  <Shield size={14} /> Zadrži
                </button>
                <button onClick={(e) => handleReview(e, r.id, false, r.type)} style={styles.iconBtnDelete}>
                  <Trash2 size={14} /> Obriši
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL --- */}
      {selectedItem && (
        <div style={styles.overlay} onClick={() => setSelectedItem(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{margin: 0}}>{selectedItem.label}</h3>
              <X onClick={() => setSelectedItem(null)} style={{cursor: 'pointer'}} />
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.modalRow}><User size={18} color="#60e016"/> <span><b>Autor:</b> {selectedItem.displayTitle}</span></div>
              
              {selectedItem.type === 'MATERIJAL' && (
                <>
                  <div style={styles.modalRow}><Book size={18} color="#60e016"/> <span><b>Predmet:</b> {selectedItem.displaySub}</span></div>
                  <div style={styles.modalRow}><Info size={18} color="#60e016"/> <span><b>Kategorija:</b> {selectedItem.displayInfo}</span></div>
                </>
              )}

              {selectedItem.displayDate && (
                <div style={styles.modalRow}>
                  <Calendar size={18} color="#60e016"/> 
                  <span><b>Datum:</b> {new Date(selectedItem.displayDate).toLocaleString('sr-RS')}</span>
                </div>
              )}

              <div style={styles.contentPreview}>
                <p style={{color: '#888', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase'}}>Sadržaj:</p>
                <p style={{margin: 0, lineHeight: '1.5'}}>{selectedItem.displayContent || selectedItem.displayTitle}</p>
              </div>

              {selectedItem.fileUrl && (
                <a href={selectedItem.fileUrl} target="_blank" rel="noreferrer" style={styles.link}>
                  <ExternalLink size={16} /> OTVORI DOKUMENT U NOVOM TABU
                </a>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => handleReview(null, selectedItem.id, true, selectedItem.type)} style={styles.modalApprove}>
                {selectedItem.type === 'MATERIJAL' ? "PRIHVATI" : "ZADRŽI SADRŽAJ"}
              </button>
              <button onClick={() => handleReview(null, selectedItem.id, false, selectedItem.type)} style={styles.modalReject}>
                {selectedItem.type === 'MATERIJAL' ? "ODBIJ" : "OBRIŠI SADRŽAJ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: "flex", gap: "25px", height: "100%", padding: "10px", position: 'relative' },
  column: { flex: 1, display: "flex", flexDirection: "column", background: "rgba(255, 255, 255, 0.03)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(255, 255, 255, 0.05)", overflow: 'hidden' },
  columnTitle: { color: "white", fontSize: "18px", marginBottom: "20px", display: 'flex', alignItems: 'center', gap: '10px' },
  badge: { background: 'rgba(96, 224, 22, 0.1)', color: '#60e016', padding: '2px 8px', borderRadius: '8px', fontSize: '12px' },
  badgeRed: { background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '2px 8px', borderRadius: '8px', fontSize: '12px' },
  scrollArea: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px", paddingRight: '5px' },
  card: { background: "rgba(255, 255, 255, 0.04)", borderRadius: "15px", padding: "18px", cursor: 'pointer', border: "1px solid rgba(255, 255, 255, 0.05)", display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s' },
  cardContent: { flex: 1 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  cardMainTitle: { color: "white", fontWeight: "600", fontSize: "15px" },
  cardMeta: { color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' },
  previewText: { color: "rgba(255,255,255,0.8)", fontSize: "13px", fontStyle: 'italic', margin: '10px 0', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px' },
  typeBadge: { fontSize: "10px", color: "#ff4d4d", background: "rgba(255, 77, 77, 0.1)", padding: "3px 8px", borderRadius: "6px", fontWeight: '600' },
  inlineActions: { display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '15px' },
  iconBtnApprove: { background: 'rgba(96, 224, 22, 0.15)', border: '1px solid #60e016', color: '#60e016', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' },
  iconBtnReject: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  iconBtnKeep: { background: 'rgba(96, 224, 22, 0.1)', border: '1px solid #60e016', color: '#60e016', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  iconBtnDelete: { background: 'rgba(255, 77, 77, 0.15)', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, backdropFilter: 'blur(6px)' },
  modal: { background: '#0a0f1e', width: '95%', maxWidth: '480px', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', color: 'white', marginBottom: '25px', alignItems: 'center' },
  modalBody: { color: 'white', display: 'flex', flexDirection: 'column', gap: '18px' },
  modalRow: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' },
  contentPreview: { background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #60e016' },
  link: { color: '#60e016', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontWeight: '600', marginTop: '5px' },
  modalFooter: { display: 'flex', gap: '15px', marginTop: '30px' },
  modalApprove: { flex: 1, background: '#60e016', color: 'black', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', transition: '0.2s' },
  modalReject: { flex: 1, background: '#ff4d4d', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' },
  loading: { color: 'white', textAlign: 'center', padding: '100px', fontSize: '18px', letterSpacing: '1px' }
};
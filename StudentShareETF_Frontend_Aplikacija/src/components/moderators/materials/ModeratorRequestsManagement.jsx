import React, { useState, useEffect } from "react";
import moderatorActionService from "../../../services/moderatorActionsService";
import Toast from "../../Toast";

// CSS za custom scrollbar
const scrollbarStyles = `
  .popup-body::-webkit-scrollbar {
    width: 8px;
  }
  .popup-body::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  .popup-body::-webkit-scrollbar-thumb {
    background: #8a2be2;
    border-radius: 4px;
  }
  .popup-body::-webkit-scrollbar-thumb:hover {
    background: #9d4edd;
  }
`;

function ModeratorRequestsManagement() {
  const [pendingMaterials, setPendingMaterials] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [pendingPostComments, setPendingPostComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(null);
  const [studentSuspended, setStudentSuspended] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (selectedItem?.studentId && showDetailsPopup) {
      setStudentSuspended(null);
      moderatorActionService
        .checkStudentSuspension(selectedItem.studentId)
        .then(setStudentSuspended)
        .catch(() => setStudentSuspended(false));
    }
  }, [selectedItem, showDetailsPopup]);

  useEffect(() => {
    loadAllRequests();
  }, []);

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const loadAllRequests = async () => {
    setLoading(true);
    try {
      const [materials, comments, posts, postComments] = await Promise.all([
        moderatorActionService.getPendingMaterials(),
        moderatorActionService.getPendingComments(),
        moderatorActionService.getPendingPosts(),
        moderatorActionService.getPendingPostComments(),
      ]);
      setPendingMaterials(materials);
      setPendingComments(comments);
      setPendingPosts(posts);
      setPendingPostComments(postComments);
    } catch (error) {
      console.error("Greška pri učitavanju zahtjeva:", error);
      showToast("Greška pri učitavanju zahtjeva!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowDetailsPopup(true);
  };

  const handleActionClick = (item, type, action, isApproved) => {
    setConfirmAction({ item, type, action, isApproved });
    setShowConfirmPopup(true);
  };

  const getItemId = (item, type) => {
    if (!item) return null;
    if (type === "material") return item.materialId;
    if (type === "comment") return item.commentId;
    if (type === "post") return item.adviceId;
    if (type === "postComment") return item.adviceId;
    return item.id;
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    const { item, type, isApproved } = confirmAction;
    const realId = getItemId(item, type);

    if (!realId) {
      showToast("Greška: Nije moguće pronaći ID elementa!", "error");
      console.error("Objekat bez ID-a:", item);
      return;
    }

    try {
      if (type === "material") {
        await moderatorActionService.reviewMaterial(realId, isApproved);
        showToast(
          isApproved ? "Materijal uspješno odobren!" : "Materijal uspješno odbijen!",
          "success"
        );
      } else if (type === "comment") {
        await moderatorActionService.reviewComment(realId, isApproved);
        showToast(
          isApproved ? "Komentar uspješno zadržan!" : "Komentar uspješno obrisan!",
          "success"
        );
      } else if (type === "post") {
        await moderatorActionService.reviewPost(realId, isApproved);
        showToast(
          isApproved ? "Post uspješno zadržan!" : "Post uspješno obrisan!",
          "success"
        );
      } else if (type === "postComment") {
        await moderatorActionService.reviewPostComment(realId, isApproved);
        showToast(
          isApproved ? "Komentar uspješno zadržan!" : "Komentar uspješno obrisan!",
          "success"
        );
      }
      
      setShowConfirmPopup(false);
      setShowDetailsPopup(false);
      setConfirmAction(null);
      setSelectedItem(null);
      await loadAllRequests();
    } catch (error) {
      console.error("Greška pri izvršavanju akcije:", error);
      showToast("Došlo je do greške. Pokušajte ponovo.", "error");
    }
  };

  const handleSuspendStudent = async () => {
    if (!showSuspendConfirm) return;

    try {
      await moderatorActionService.toggleStudentStatus(showSuspendConfirm.studentId, false);
      showToast(`Student ${showSuspendConfirm.studentName} je uspješno suspendovan!`, "success");
      setShowSuspendConfirm(null);
      setShowDetailsPopup(false);
      await loadAllRequests();
    } catch (error) {
      console.error("Greška pri suspenziji studenta:", error);
      showToast("Došlo je do greške pri suspenziji studenta!", "error");
      setShowSuspendConfirm(null);
    }
  };

  const MaterialCard = ({ material }) => (
    <div style={styles.card} onClick={() => handleItemClick(material, "material")}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{material.title || material.name || "Materijal"}</h3>
      </div>
      <p style={styles.cardText}>Predmet: {material.subjectName}</p>
      <p style={styles.cardText}>Student: {material.studentName || "N/A"}</p>
      <p style={styles.cardDate}>
        {new Date(material.uploadDate).toLocaleString("sr-RS")}
      </p>
      <div style={styles.cardActions}>
        <button
          style={styles.approveBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleActionClick(material, "material", "approve", true);
          }}
        >
          Odobri
        </button>
        <button
          style={styles.rejectBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleActionClick(material, "material", "reject", false);
          }}
        >
          Odbij
        </button>
      </div>
    </div>
  );

  const ReportCard = ({ item, type }) => {
    const getTitle = () => {
      if (type === "comment") return "Komentar na materijal";
      if (type === "post") return "Post";
      if (type === "postComment") return "Komentar na post";
      return "Prijava";
    };

    return (
      <div style={styles.card} onClick={() => handleItemClick(item, type)}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>{getTitle()}</h3>
          <span style={styles.badgeReport}>Prijavljeno</span>
        </div>
        <p style={styles.cardTextBold}>
          {item.content}
        </p>
        <p style={styles.cardText}>Autor: {item.studentName}</p>
        <p style={styles.cardDate}>
          {new Date(item.date).toLocaleString("sr-RS")}
        </p>
        <div style={styles.cardActions}>
          <button
            style={styles.keepBtn}
            onClick={(e) => {
              e.stopPropagation();
              handleActionClick(item, type, "keep", true);
            }}
          >
            Zadrži
          </button>
          <button
            style={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              handleActionClick(item, type, "delete", false);
            }}
          >
            Obriši
          </button>
        </div>
      </div>
    );
  };

  const handleViewMaterial = async () => {
    if (!selectedItem || selectedItem.type !== "material") return;
    
    const id = selectedItem.materialId || selectedItem.id;

    try {
      const url = await moderatorActionService.getMaterialUrl(id);
      if (url) {
        window.open(url, '_blank');
      } else {
        showToast("Nije moguće učitati materijal!", "error");
      }
    } catch (error) {
      console.error("Greška pri otvaranju materijala:", error);
      showToast("Došlo je do greške pri otvaranju materijala!", "error");
    }
  };

  const DetailsPopup = () => {
    if (!selectedItem) return null;

    return (
      <div style={styles.popupOverlay} onClick={() => setShowDetailsPopup(false)}>
        <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.popupHeader}>
            <h2 style={styles.popupTitle}>Detalji zahtjeva</h2>
            <button
              style={styles.closeBtn}
              onClick={() => setShowDetailsPopup(false)}
            >
              ✕
            </button>
          </div>
          
          <div style={styles.popupBody} className="popup-body">
            {selectedItem.type === "material" ? (
              <>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Naziv:</span>
                  <span style={styles.detailValue}>
                    {selectedItem.name}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Predmet:</span>
                  <span style={styles.detailValue}>
                    {selectedItem.subjectName}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Tip:</span>
                  <span style={styles.detailValue}>
                    {selectedItem.category}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Student:</span>
                  <div style={styles.studentRow}>
                    <span style={styles.detailValue}>
                      {selectedItem.studentName}
                    </span>
                    {selectedItem.studentId && (
                      studentSuspended === null ? (
                        <span style={{ opacity: 0.6, color: 'rgba(255, 255, 255, 0.7)' }}>
                          Provjera statusa...
                        </span>
                      ) : studentSuspended ? (
                        <span style={{ 
                          color: "#f87171", 
                          fontWeight: "700",
                          whiteSpace: "nowrap"
                        }}>
                          Student je suspendovan
                        </span>
                      ) : (
                        <button
                          style={styles.suspendBtn}
                          onClick={() => setShowSuspendConfirm({
                            studentId: selectedItem.studentId,
                            studentName: selectedItem.studentName
                          })}
                        >
                          Suspenduj studenta
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Datum postavljanja:</span>
                  <span style={styles.detailValue}>
                    {new Date(selectedItem.uploadDate).toLocaleString("sr-RS")}
                  </span>
                </div>
                {selectedItem.description && (
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Opis:</span>
                    <span style={styles.detailValue}>{selectedItem.description}</span>
                  </div>
                )}
                <div style={styles.detailRow}>
                  <button
                    style={styles.viewMaterialBtn}
                    onClick={handleViewMaterial}
                  >
                    📄 Pregledaj materijal
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Tip:</span>
                  <span style={styles.detailValue}>
                    {selectedItem.type === "comment" && "Komentar na materijal"}
                    {selectedItem.type === "post" && "Post"}
                    {selectedItem.type === "postComment" && "Komentar na post"}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Predmet:</span>
                  <span style={styles.detailValue}>
                    {selectedItem.subject}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Sadržaj:</span>
                  <span style={styles.detailValue}>
                    {selectedItem.content}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Autor:</span>
                  <div style={styles.studentRow}>
                    <span style={styles.detailValue}>
                      {selectedItem.studentName}
                    </span>
                    {selectedItem.studentId && (
                      studentSuspended === null ? (
                        <span style={{ opacity: 0.6, color: 'rgba(255, 255, 255, 0.7)' }}>
                          Provjera statusa...
                        </span>
                      ) : studentSuspended ? (
                        <span style={{ 
                          color: "#f87171", 
                          fontWeight: "700",
                          whiteSpace: "nowrap"
                        }}>
                          Student je suspendovan
                        </span>
                      ) : (
                        <button
                          style={styles.suspendBtn}
                          onClick={() => setShowSuspendConfirm({
                            studentId: selectedItem.studentId,
                            studentName: selectedItem.studentName
                          })}
                        >
                          Suspenduj studenta
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Datum:</span>
                  <span style={styles.detailValue}>
                    {new Date(selectedItem.date).toLocaleString("sr-RS")}
                  </span>
                </div>
              </>
            )}
          </div>
          <div style={styles.popupActions}>
            {selectedItem.type === "material" ? (
              <>
                <button
                  style={styles.popupApproveBtn}
                  onClick={() => {
                    setShowDetailsPopup(false);
                    handleActionClick(selectedItem, selectedItem.type, "approve", true);
                  }}>
                  Odobri
                </button>
                <button
                  style={styles.popupRejectBtn}
                  onClick={() => {
                    setShowDetailsPopup(false);
                    handleActionClick(selectedItem, selectedItem.type, "reject", false);
                  }}>
                  Odbij
                </button>
              </>
            ) : (
              <>
                <button
                  style={styles.popupKeepBtn}
                  onClick={() => {
                    setShowDetailsPopup(false);
                    handleActionClick(selectedItem, selectedItem.type, "keep", true);
                  }}
                >
                  Zadrži
                </button>
                <button
                  style={styles.popupDeleteBtn}
                  onClick={() => {
                    setShowDetailsPopup(false);
                    handleActionClick(selectedItem, selectedItem.type, "delete", false);
                  }}
                >
                  Obriši
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ConfirmPopup = () => {
    if (!confirmAction) return null;

    const getMessage = () => {
      const { action, type, item } = confirmAction;
      if (type === "material") {
        if (action === "approve") {
          return (
            <>
              Da li ste sigurni da želite odobriti materijal <strong>{item.name}</strong>?
              <br /><br />
              Materijal će biti dostupan svim studentima.
            </>
          );
        } else {
          return (
            <>
              Da li ste sigurni da želite odbiti materijal <strong>{item.name}</strong>?
              <br /><br />
              Ova akcija je nepovratna.
            </>
          );
        }
      } else {
        if (action === "keep") {
          return (
            <>
              Da li ste sigurni da želite zadržati ovaj sadržaj?
              <br /><br />
              Sadržaj će ostati vidljiv, a prijava će biti odbijena.
            </>
          );
        } else {
          return (
            <>
              Da li ste sigurni da želite obrisati ovaj sadržaj?
              <br /><br />
              Ova akcija je nepovratna.
            </>
          );
        }
      }
    };

    const getTitle = () => {
      const { action, type } = confirmAction;
      if (type === "material") {
        return action === "approve" ? "Potvrda odobrenja materijala" : "Potvrda odbijanja materijala";
      } else {
        return action === "keep" ? "Potvrda zadržavanja sadržaja" : "Potvrda brisanja sadržaja";
      }
    };

    const getButtonText = () => {
      const { action, type } = confirmAction;
      if (type === "material") {
        return action === "approve" ? "Odobri materijal" : "Odbij materijal";
      } else {
        return action === "keep" ? "Zadrži sadržaj" : "Obriši sadržaj";
      }
    };

    return (
      <div style={styles.confirmOverlay} onClick={() => setShowConfirmPopup(false)}>
        <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
          <h3 style={styles.confirmTitle}>{getTitle()}</h3>
          <p style={styles.confirmText}>{getMessage()}</p>
          <div style={styles.confirmButtons}>
            <button 
              style={styles.confirmCancelBtn} 
              onClick={() => {
                setShowConfirmPopup(false);
                setConfirmAction(null);
              }}
            >
              Otkaži
            </button>
            <button 
              style={
                confirmAction.action === "approve" || confirmAction.action === "keep"
                  ? styles.confirmApproveBtn
                  : styles.confirmDeleteBtn
              }
              onClick={executeAction}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SuspendConfirmPopup = () => {
    if (!showSuspendConfirm) return null;
    return (
      <div style={styles.confirmOverlay} onClick={() => setShowSuspendConfirm(null)}>
        <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
          <h3 style={styles.confirmTitle}>Potvrda suspenzije studenta</h3>
          <p style={styles.confirmText}>
            Da li ste sigurni da želite suspendovati studenta <strong>{showSuspendConfirm.studentName}</strong>?
            <br /><br />
            Student neće moći pristupiti sistemu dok ne bude ponovo aktiviran.
          </p>
          <div style={styles.confirmButtons}>
            <button 
              style={styles.confirmCancelBtn} 
              onClick={() => setShowSuspendConfirm(null)}
            >
              Otkaži
            </button>
            <button 
              style={styles.confirmDeleteBtn}
              onClick={handleSuspendStudent}
            >
              Suspenduj studenta
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Učitavanje zahtjeva...</p>
      </div>
    );
  }
  return (
    <div style={styles.container}>
      <style>{scrollbarStyles}</style>
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div style={styles.column}>
        <div style={styles.columnHeader}>
          <h2 style={styles.columnTitle}>Zahtjevi za materijale</h2>
          <span style={styles.countBadge}>{pendingMaterials.length}</span>
        </div>
        <div style={styles.cardList}>
          {pendingMaterials.length === 0 ? (
            <p style={styles.emptyMessage}>Nema zahtjeva za materijale</p>
          ) : (
            pendingMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))
          )}
        </div>
      </div>
      <div style={styles.column}>
        <div style={styles.columnHeader}>
          <h2 style={styles.columnTitle}>Prijavljeni sadržaji</h2>
          <span style={styles.countBadge}>
            {pendingComments.length + pendingPosts.length + pendingPostComments.length}
          </span>
        </div>
        <div style={styles.cardList}>
          {pendingComments.length === 0 && 
           pendingPosts.length === 0 && 
           pendingPostComments.length === 0 ? (
            <p style={styles.emptyMessage}>Nema prijavljenih sadržaja</p>
          ) : (
            <>
              {pendingComments.map((comment) => (
                <ReportCard key={`comment-${comment.id}`} item={comment} type="comment" />
              ))}
              {pendingPosts.map((post) => (
                <ReportCard key={`post-${post.id}`} item={post} type="post" />
              ))}
              {pendingPostComments.map((postComment) => (
                <ReportCard key={`postComment-${postComment.id}`} item={postComment} type="postComment" />
              ))}
            </>
          )}
        </div>
      </div>
      {showDetailsPopup && <DetailsPopup />}
      {showConfirmPopup && <ConfirmPopup />}
      {showSuspendConfirm && <SuspendConfirmPopup />}
    </div>
  );
}
const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    padding: "20px",
    height: "100%",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: "20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(138, 43, 226, 0.2)",
    borderTop: "5px solid #8a2be2",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "16px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  columnHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 20px",
    background: "rgba(138, 43, 226, 0.15)",
    borderRadius: "12px",
    border: "1px solid rgba(138, 43, 226, 0.3)",
  },
  columnTitle: {
    color: "#8a2be2",
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
  },
  countBadge: {
    background: "#8a2be2",
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "700",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  cardTitle: {
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    margin: 0,
  },
  badgeReport: {
    background: "rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },
  cardText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "14px",
    margin: "8px 0",
  },
  cardTextBold: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "14px",
    margin: "8px 0",
    fontWeight: "500",
  },
  cardDate: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "12px",
    margin: "8px 0",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  approveBtn: {
    flex: 1,
    padding: "10px",
    background: "rgba(34, 197, 94, 0.2)",
    color: "#4ade80",
    border: "1px solid #4ade80",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  rejectBtn: {
    flex: 1,
    padding: "10px",
    background: "rgba(239, 68, 68, 0.2)",
    color: "#f87171",
    border: "1px solid #f87171",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  keepBtn: {
    flex: 1,
    padding: "10px",
    background: "rgba(34, 197, 94, 0.2)",
    color: "#4ade80",
    border: "1px solid #4ade80",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  deleteBtn: {
    flex: 1,
    padding: "10px",
    background: "rgba(239, 68, 68, 0.2)",
    color: "#f87171",
    border: "1px solid #f87171",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  emptyMessage: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "16px",
    textAlign: "center",
    padding: "40px 20px",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  popupContent: {
    background: "linear-gradient(135deg, #0a1457 0%, #1a2a5e 100%)",
    border: "2px solid rgba(138, 43, 226, 0.5)",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  popupHeader: {
    padding: "25px 30px",
    background: "rgba(138, 43, 226, 0.15)",
    borderBottom: "1px solid rgba(138, 43, 226, 0.3)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  popupTitle: {
    color: "#8a2be2",
    fontSize: "22px",
    fontWeight: "700",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  popupBody: {
    padding: "30px",
    overflowY: "auto",
    flex: 1,
  },
  detailRow: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  detailLabel: {
    color: "#8a2be2",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailValue: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  studentRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
  },
  suspendBtn: {
    padding: "10px 18px",
    background: "rgba(239, 68, 68, 0.2)",
    color: "#f87171",
    border: "2px solid #f87171",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
    marginLeft: "auto",
  },
  reasonsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "5px",
  },
  reasonBadge: {
    background: "rgba(239, 68, 68, 0.2)",
    color: "#fca5a5",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
  },
  popupActions: {
    padding: "20px 30px",
    background: "rgba(0, 0, 0, 0.2)",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    gap: "15px",
  },
  popupApproveBtn: {
    flex: 1,
    padding: "14px",
    background: "rgba(34, 197, 94, 0.2)",
    color: "#4ade80",
    border: "2px solid #4ade80",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  popupRejectBtn: {
    flex: 1,
    padding: "14px",
    background: "rgba(239, 68, 68, 0.2)",
    color: "#f87171",
    border: "2px solid #f87171",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  popupKeepBtn: {
    flex: 1,
    padding: "14px",
    background: "rgba(34, 197, 94, 0.2)",
    color: "#4ade80",
    border: "2px solid #4ade80",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  popupDeleteBtn: {
    flex: 1,
    padding: "14px",
    background: "rgba(239, 68, 68, 0.2)",
    color: "#f87171",
    border: "2px solid #f87171",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  confirmOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
  },
  confirmDialog: {
    background: "linear-gradient(135deg, #0a1457 0%, #1a2a5e 100%)",
    border: "2px solid rgba(138, 43, 226, 0.5)",
    borderRadius: "20px",
    padding: "35px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
  },
  confirmTitle: {
    color: "#8a2be2",
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 20px 0",
    textAlign: "center",
  },
  confirmText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "16px",
    margin: "0 0 30px 0",
    textAlign: "center",
    lineHeight: "1.6",
  },
  confirmButtons: {
    display: "flex",
    gap: "15px",
  },
  confirmCancelBtn: {
    flex: 1,
    padding: "14px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "rgba(255, 255, 255, 0.7)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  confirmApproveBtn: {
    flex: 1,
    padding: "14px",
    background: "rgba(34, 197, 94, 0.2)",
    color: "#4ade80",
    border: "2px solid #4ade80",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  confirmDeleteBtn: {
    flex: 1,
    padding: "14px",
    background: "rgba(239, 68, 68, 0.2)",
    color: "#f87171",
    border: "2px solid #f87171",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  viewMaterialBtn: {
    width: "100%",
    padding: "14px 20px",
    background: "rgba(138, 43, 226, 0.2)",
    color: "#c084fc",
    border: "2px solid #8a2be2",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
};
export default ModeratorRequestsManagement;
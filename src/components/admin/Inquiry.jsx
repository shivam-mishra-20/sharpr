import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

const getThemeColors = (theme) => ({
  primary: theme === "dark" ? "#6366f1" : "#4f46e5",
  primaryLight: theme === "dark" ? "#818cf8" : "#818cf8",
  primaryDark: theme === "dark" ? "#4338ca" : "#3730a3",
  secondary: theme === "dark" ? "#60a5fa" : "#3b82f6",
  text: theme === "dark" ? "#e5e7eb" : "#1e293b",
  textLight: theme === "dark" ? "#9ca3af" : "#64748b",
  background: theme === "dark" ? "#111827" : "#f8fafc",
  backgroundGradient:
    theme === "dark"
      ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
  card: theme === "dark" ? "#1f2937" : "#ffffff",
  error: theme === "dark" ? "#f87171" : "#ef4444",
  success: theme === "dark" ? "#34d399" : "#22c55e",
  border: theme === "dark" ? "#374151" : "#cbd5e1",
  hoverBg: theme === "dark" ? "#2d3748" : "#f1f5f9",
  cardShadow:
    theme === "dark"
      ? "0 10px 40px rgba(0,0,0,0.2)"
      : "0 10px 40px rgba(0,0,0,0.08)",
});

const Inquiry = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: colors.backgroundGradient,
      padding: "80px 20px 40px",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: colors.text,
      marginTop: "-40px",
      marginBottom: "-22px",
      marginLeft: "-30px",
      marginRight: "-50px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      flexWrap: "wrap",
      gap: "16px",
    },
    title: {
      fontSize: "2.4rem",
      fontWeight: 700,
      letterSpacing: "-0.025em",
      lineHeight: 1.2,
      color: colors.text,
    },
    filtersContainer: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      marginBottom: "16px",
      flexWrap: "wrap",
    },
    select: {
      padding: "8px 12px",
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      background: colors.card,
      color: colors.text,
      outline: "none",
    },
    searchInput: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      background: colors.card,
      color: colors.text,
      outline: "none",
      width: "250px",
    },
    card: {
      background: colors.card,
      borderRadius: "16px",
      boxShadow: colors.cardShadow,
      padding: "24px",
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0",
    },
    tableHeader: {
      textAlign: "left",
      padding: "12px 16px",
      color: colors.textLight,
      borderBottom: `1px solid ${colors.border}`,
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
      userSelect: "none",
      whiteSpace: "nowrap",
    },
    tableRow: {
      transition: "background-color 0.2s",
      "&:hover": {
        backgroundColor: colors.hoverBg,
      },
      cursor: "pointer",
    },
    tableCell: {
      padding: "16px",
      borderBottom: `1px solid ${colors.border}`,
      fontSize: "0.95rem",
      whiteSpace: "nowrap",
    },
    badge: (status) => {
      const statusColors = {
        new: { bg: "#EBF5FF", text: "#3B82F6" },
        responded: { bg: "#F0FDF4", text: "#22C55E" },
        resolved: { bg: "#F5F5F5", text: "#6B7280" },
        // Add a default for any other status that might come from the database
        default: { bg: "#F5F5F5", text: "#6B7280" },
      };

      // First check if the status exists in our mapping, if not use default
      const statusColor = statusColors[status] || statusColors.default;

      const color =
        theme === "dark"
          ? { bg: "rgba(255,255,255,0.1)", text: statusColor.text }
          : statusColor;

      return {
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "0.75rem",
        fontWeight: "600",
        textTransform: "capitalize",
        backgroundColor: color.bg,
        color: color.text,
        display: "inline-block",
      };
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1000,
      backdropFilter: "blur(2px)",
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: "16px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      padding: "32px",
      width: "100%",
      maxWidth: "650px",
      maxHeight: "90vh",
      overflow: "auto",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    closeButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.5rem",
      color: colors.textLight,
    },
    infoGroup: {
      marginBottom: "24px",
    },
    infoLabel: {
      color: colors.textLight,
      fontSize: "0.875rem",
      marginBottom: "4px",
      display: "block",
    },
    infoValue: {
      fontSize: "1rem",
      wordBreak: "break-word",
    },
    message: {
      fontSize: "1rem",
      lineHeight: 1.6,
      wordBreak: "break-word",
      whiteSpace: "pre-wrap",
      padding: "16px",
      backgroundColor:
        theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
    },
    actionButton: {
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: colors.primary,
      color: "white",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      marginRight: "8px",
      "&:hover": {
        backgroundColor: colors.primaryDark,
      },
    },
    loadingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 0",
    },
    spinner: {
      width: "24px",
      height: "24px",
      border: `3px solid ${colors.border}`,
      borderTopColor: colors.primary,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    emptyState: {
      textAlign: "center",
      padding: "64px 0",
      color: colors.textLight,
    },
    "@keyframes spin": {
      to: { transform: "rotate(360deg)" },
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      marginTop: "32px",
      gap: "8px",
    },
    pageButton: {
      padding: "8px 12px",
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      background: colors.card,
      color: colors.text,
      cursor: "pointer",
    },
    activePageButton: {
      backgroundColor: colors.primary,
      color: "white",
      borderColor: colors.primary,
    },
    pageInfo: {
      color: colors.textLight,
      marginTop: "8px",
      textAlign: "center",
    },
    sortIndicator: {
      marginLeft: "4px",
    },
    noDataMessage: {
      padding: "24px",
      textAlign: "center",
      color: colors.textLight,
    },
    statusActions: {
      display: "flex",
      gap: "8px",
      marginTop: "24px",
    },
    respondedBtn: {
      background: "#EBF5FF",
      color: "#3B82F6",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: 500,
    },
    resolvedBtn: {
      background: "#F0FDF4",
      color: "#22C55E",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: 500,
    },
    responsiveContainer: {
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    deleteButton: {
      backgroundColor: colors.error,
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: 500,
      marginLeft: "auto",
    },
    confirmDialog: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1010,
    },
    confirmContent: {
      backgroundColor: colors.card,
      borderRadius: "16px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      padding: "24px",
      width: "100%",
      maxWidth: "400px",
    },
    confirmHeader: {
      fontSize: "1.25rem",
      fontWeight: 600,
      marginBottom: "16px",
      color: colors.text,
    },
    confirmText: {
      marginBottom: "24px",
      color: colors.text,
    },
    confirmActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
    },
    cancelButton: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      background: "transparent",
      color: colors.text,
      cursor: "pointer",
    },
    confirmDeleteButton: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: colors.error,
      color: "white",
      fontWeight: 600,
      cursor: "pointer",
    },
    "@media (max-width: 768px)": {
      header: {
        flexDirection: "column",
        alignItems: "flex-start",
      },
      searchInput: {
        width: "100%",
      },
      filtersContainer: {
        width: "100%",
      },
    },
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      // Get inquiries from Firestore
      const inquiriesQuery = query(
        collection(db, "inquiries"),
        orderBy("createdAt", "desc")
      );
      const inquiriesSnapshot = await getDocs(inquiriesQuery);

      // Map Firestore documents to the expected format
      const inquiriesData = inquiriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Ensure createdAt is in the expected string format for sorting
        createdAt:
          doc.data().createdAt?.toDate?.().toISOString() ||
          new Date().toISOString(),
      }));

      setInquiries(inquiriesData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
      setError("Failed to load inquiries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedInquiries = () => {
    const sortableInquiries = [...inquiries];

    // Apply filter
    let filteredInquiries = sortableInquiries;
    if (filterStatus !== "all") {
      filteredInquiries = sortableInquiries.filter(
        (inquiry) => inquiry.status === filterStatus
      );
    }

    // Apply search
    if (searchTerm) {
      filteredInquiries = filteredInquiries.filter(
        (inquiry) =>
          inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sort
    return filteredInquiries.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Update in Firestore
      await updateDoc(doc(db, "inquiries", id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      setInquiries(
        inquiries.map((inquiry) =>
          inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
        )
      );

      // Update modal if open
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (err) {
      console.error(`Error updating inquiry ${id} status:`, err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDeleteInquiry = async (id) => {
    try {
      // Delete document from Firestore
      await deleteDoc(doc(db, "inquiries", id));

      // Update local state
      setInquiries(inquiries.filter((inquiry) => inquiry.id !== id));

      // Close the modal and confirmation dialog
      setSelectedInquiry(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(`Error deleting inquiry ${id}:`, err);
      alert("Failed to delete inquiry. Please try again.");
    }
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const sortedInquiries = getSortedInquiries();

  return (
    <div style={styles.container}>
      <div style={styles.responsiveContainer}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={styles.header}
        >
          <h1 style={styles.title}>Customer Inquiries</h1>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              style={{
                ...styles.actionButton,
                backgroundColor: "transparent",
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
              onClick={fetchInquiries}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <button style={styles.actionButton} onClick={() => window.print()}>
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Export
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={styles.filtersContainer}
        >
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="responded">Responded</option>
            <option value="resolved">Resolved</option>
          </select>

          <input
            type="search"
            placeholder="Search by name, email or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={styles.card}
        >
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px",
                color: colors.error,
              }}
            >
              {error}
              <button
                onClick={fetchInquiries}
                style={{
                  marginTop: "16px",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
            </div>
          ) : sortedInquiries.length === 0 ? (
            <div style={styles.noDataMessage}>
              <p>No inquiries found matching your filters.</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th
                    style={styles.tableHeader}
                    onClick={() => handleSort("name")}
                  >
                    Name {getSortIndicator("name")}
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => handleSort("email")}
                  >
                    Email {getSortIndicator("email")}
                  </th>
                  <th style={styles.tableHeader}>Message</th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => handleSort("createdAt")}
                  >
                    Date {getSortIndicator("createdAt")}
                  </th>
                  <th
                    style={styles.tableHeader}
                    onClick={() => handleSort("status")}
                  >
                    Status {getSortIndicator("status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedInquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    style={styles.tableRow}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <td style={styles.tableCell}>{inquiry.name}</td>
                    <td style={styles.tableCell}>{inquiry.email}</td>
                    <td
                      style={{
                        ...styles.tableCell,
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {inquiry.message.substring(0, 50)}...
                    </td>
                    <td style={styles.tableCell}>
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.badge(inquiry.status || "default")}>
                        {inquiry.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        <div style={styles.pageInfo}>
          Showing {sortedInquiries.length} inquiries
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <motion.div
          style={styles.modal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedInquiry(null)
          }
        >
          <motion.div
            style={styles.modalContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div style={styles.modalHeader}>
              <h2>Inquiry Details</h2>
              <button
                style={styles.closeButton}
                onClick={() => setSelectedInquiry(null)}
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <span style={styles.badge(selectedInquiry.status || "default")}>
                  {selectedInquiry.status || "Unknown"}
                </span>
              </div>
              <div style={{ color: colors.textLight, fontSize: "0.9rem" }}>
                {formatDate(selectedInquiry.createdAt)}
              </div>
            </div>

            <div style={styles.infoGroup}>
              <span style={styles.infoLabel}>Name</span>
              <div style={styles.infoValue}>{selectedInquiry.name}</div>
            </div>

            <div style={styles.infoGroup}>
              <span style={styles.infoLabel}>Email</span>
              <div style={styles.infoValue}>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  style={{ color: colors.primary }}
                >
                  {selectedInquiry.email}
                </a>
              </div>
            </div>

            <div style={styles.infoGroup}>
              <span style={styles.infoLabel}>Message</span>
              <div style={styles.message}>{selectedInquiry.message}</div>
            </div>

            <div style={styles.statusActions}>
              <button
                style={{
                  ...styles.respondedBtn,
                  opacity: selectedInquiry.status === "responded" ? 0.6 : 1,
                  cursor:
                    selectedInquiry.status === "responded"
                      ? "default"
                      : "pointer",
                }}
                disabled={selectedInquiry.status === "responded"}
                onClick={() =>
                  handleUpdateStatus(selectedInquiry.id, "responded")
                }
              >
                Mark as Responded
              </button>
              <button
                style={{
                  ...styles.resolvedBtn,
                  opacity: selectedInquiry.status === "resolved" ? 0.6 : 1,
                  cursor:
                    selectedInquiry.status === "resolved"
                      ? "default"
                      : "pointer",
                }}
                disabled={selectedInquiry.status === "resolved"}
                onClick={() =>
                  handleUpdateStatus(selectedInquiry.id, "resolved")
                }
              >
                Mark as Resolved
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && selectedInquiry && (
        <motion.div
          style={styles.confirmDialog}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={(e) =>
            e.target === e.currentTarget && setShowDeleteConfirm(false)
          }
        >
          <motion.div
            style={styles.confirmContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div style={styles.confirmHeader}>Confirm Deletion</div>
            <div style={styles.confirmText}>
              Are you sure you want to delete this inquiry from{" "}
              {selectedInquiry.name}? This action cannot be undone.
            </div>
            <div style={styles.confirmActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={styles.confirmDeleteButton}
                onClick={() => handleDeleteInquiry(selectedInquiry.id)}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Inquiry;

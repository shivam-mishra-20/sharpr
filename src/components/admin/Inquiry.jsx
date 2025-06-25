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
  where,
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
  accent: theme === "dark" ? "#8b5cf6" : "#7c3aed", // Purple accent
});

const Inquiry = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: colors.backgroundGradient,
      padding: "80px 16px 40px",
    },
    responsiveContainer: {
      maxWidth: "1200px",
      width: "100%",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      margin: 0,
      color: colors.text,
    },
    actionButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "background-color 0.2s ease",
    },
    tabs: {
      display: "flex",
      marginBottom: "24px",
      borderBottom: `2px solid ${colors.border}`,
    },
    tab: {
      padding: "12px 16px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
      position: "relative",
      color: colors.text,
    },
    activeTab: {
      color: colors.primary,
      fontWeight: "700",
    },
    tabCount: {
      backgroundColor: colors.primary,
      color: "#fff",
      borderRadius: "12px",
      padding: "2px 8px",
      fontSize: "12px",
      position: "absolute",
      top: "8px",
      right: "8px",
    },
    filtersContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    select: {
      padding: "10px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.card,
      color: colors.text,
      fontSize: "14px",
      cursor: "pointer",
      flex: "1 1 200px",
      marginRight: "12px",
    },
    searchInput: {
      padding: "10px",
      borderRadius: "6px",
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.card,
      color: colors.text,
      fontSize: "14px",
      flex: "1 1 300px",
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: "12px",
      padding: "24px",
      boxShadow: colors.cardShadow,
      transition: "transform 0.2s ease",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100px",
    },
    spinner: {
      width: "24px",
      height: "24px",
      border: `4px solid ${colors.primary}`,
      borderTop: `4px solid transparent`,
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
    noDataMessage: {
      textAlign: "center",
      padding: "24px",
      color: colors.textLight,
    },
    tableContainer: {
      overflowX: "auto",
      borderRadius: "12px",
      overflowY: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      padding: "12px",
      textAlign: "left",
      fontSize: "14px",
      fontWeight: "600",
      color: colors.textLight,
      cursor: "pointer",
      position: "relative",
    },
    tableRow: {
      transition: "background-color 0.2s ease",
    },
    tableRowHover: {
      backgroundColor: colors.hoverBg,
    },
    tableCell: {
      padding: "12px",
      fontSize: "14px",
      color: colors.text,
      borderTop: `1px solid ${colors.border}`,
      verticalAlign: "middle",
    },
    messagePreview: {
      maxWidth: "300px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    badge: (status) => {
      const statusColors = {
        new: { bg: "#EBF5FF", text: "#3B82F6" },
        responded: { bg: "#F0FDF4", text: "#22C55E" },
        resolved: { bg: "#F5F5F5", text: "#6B7280" },
        pending: { bg: "#FEF3C7", text: "#D97706" },
        contacted: { bg: "#E0E7FF", text: "#6366F1" },
        default: { bg: "#F5F5F5", text: "#6B7280" },
      };

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
    pageInfo: {
      textAlign: "right",
      fontSize: "14px",
      color: colors.textLight,
      marginTop: "16px",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: "12px",
      padding: "24px",
      maxWidth: "600px",
      width: "100%",
      boxShadow: colors.cardShadow,
      position: "relative",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: colors.text,
      fontSize: "24px",
      cursor: "pointer",
      position: "absolute",
      top: "16px",
      right: "16px",
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: "12px",
      padding: "16px",
      boxShadow: colors.cardShadow,
    },
    infoGroup: {
      marginBottom: "12px",
    },
    infoLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: colors.textLight,
      marginBottom: "4px",
    },
    infoValue: {
      fontSize: "16px",
      color: colors.text,
      fontWeight: "600",
    },
    message: {
      backgroundColor: colors.background,
      borderRadius: "8px",
      padding: "12px",
      fontSize: "14px",
      color: colors.text,
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
    },
    statusActions: {
      display: "flex",
      gap: "12px",
      marginTop: "16px",
    },
    respondedBtn: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: colors.success,
      color: "#fff",
      flex: 1,
      transition: "background-color 0.2s ease",
    },
    resolvedBtn: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: colors.primary,
      color: "#fff",
      flex: 1,
      transition: "background-color 0.2s ease",
    },
    deleteButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: colors.error,
      color: "#fff",
      flex: 1,
      transition: "background-color 0.2s ease",
    },
    confirmDialog: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    confirmContent: {
      backgroundColor: colors.card,
      borderRadius: "12px",
      padding: "24px",
      maxWidth: "400px",
      width: "100%",
      boxShadow: colors.cardShadow,
      textAlign: "center",
    },
    confirmHeader: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      color: colors.text,
    },
    confirmText: {
      fontSize: "14px",
      color: colors.textLight,
      marginBottom: "24px",
    },
    confirmActions: {
      display: "flex",
      justifyContent: "center",
      gap: "12px",
    },
    cancelButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: colors.primary,
      color: "#fff",
      flex: 1,
      transition: "background-color 0.2s ease",
    },
    confirmDeleteButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: colors.error,
      color: "#fff",
      flex: 1,
      transition: "background-color 0.2s ease",
    },
  };

  const [inquiries, setInquiries] = useState([]);
  const [waitlistEntries, setWaitlistEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waitlistLoading, setWaitlistLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waitlistError, setWaitlistError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedWaitlist, setSelectedWaitlist] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [waitlistSortConfig, setWaitlistSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [waitlistFilterStatus, setWaitlistFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [waitlistSearchTerm, setWaitlistSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inquiries");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = () => {
    fetchInquiries();
    fetchWaitlist();
  };

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

  const fetchWaitlist = async () => {
    try {
      setWaitlistLoading(true);
      setWaitlistError(null);

      // Get waitlist entries from Firestore
      const waitlistQuery = query(
        collection(db, "waitlist"),
        orderBy("createdAt", "desc")
      );
      const waitlistSnapshot = await getDocs(waitlistQuery);

      // Map Firestore documents to the expected format
      const waitlistData = waitlistSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Ensure createdAt is in the expected string format for sorting
        createdAt:
          doc.data().createdAt?.toDate?.().toISOString() ||
          new Date().toISOString(),
      }));

      setWaitlistEntries(waitlistData);
      setWaitlistError(null);
    } catch (err) {
      console.error("Failed to fetch waitlist entries:", err);
      setWaitlistError(
        "Failed to load waitlist entries. Please try again later."
      );
    } finally {
      setWaitlistLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleWaitlistSort = (key) => {
    let direction = "asc";
    if (
      waitlistSortConfig.key === key &&
      waitlistSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setWaitlistSortConfig({ key, direction });
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
          inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getSortedWaitlistEntries = () => {
    const sortableEntries = [...waitlistEntries];

    // Apply filter
    let filteredEntries = sortableEntries;
    if (waitlistFilterStatus !== "all") {
      filteredEntries = sortableEntries.filter(
        (entry) => entry.status === waitlistFilterStatus
      );
    }

    // Apply search
    if (waitlistSearchTerm) {
      filteredEntries = filteredEntries.filter(
        (entry) =>
          entry.name
            ?.toLowerCase()
            .includes(waitlistSearchTerm.toLowerCase()) ||
          entry.email
            ?.toLowerCase()
            .includes(waitlistSearchTerm.toLowerCase()) ||
          entry.phone?.includes(waitlistSearchTerm) ||
          entry.address
            ?.toLowerCase()
            .includes(waitlistSearchTerm.toLowerCase())
      );
    }

    // Apply sort
    return filteredEntries.sort((a, b) => {
      if (a[waitlistSortConfig.key] < b[waitlistSortConfig.key]) {
        return waitlistSortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[waitlistSortConfig.key] > b[waitlistSortConfig.key]) {
        return waitlistSortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    } catch (e) {
      return "Invalid date";
    }
  };

  const handleUpdateStatus = async (id, newStatus, collection) => {
    try {
      // Update in Firestore
      await updateDoc(doc(db, collection, id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      if (collection === "inquiries") {
        // Update local state for inquiries
        setInquiries(
          inquiries.map((inquiry) =>
            inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
          )
        );

        // Update modal if open
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      } else if (collection === "waitlist") {
        // Update local state for waitlist
        setWaitlistEntries(
          waitlistEntries.map((entry) =>
            entry.id === id ? { ...entry, status: newStatus } : entry
          )
        );

        // Update modal if open
        if (selectedWaitlist && selectedWaitlist.id === id) {
          setSelectedWaitlist({ ...selectedWaitlist, status: newStatus });
        }
      }
    } catch (err) {
      console.error(`Error updating ${collection} ${id} status:`, err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async (id, collection) => {
    try {
      // Delete document from Firestore
      await deleteDoc(doc(db, collection, id));

      if (collection === "inquiries") {
        // Update local state for inquiries
        setInquiries(inquiries.filter((inquiry) => inquiry.id !== id));
        setSelectedInquiry(null);
      } else if (collection === "waitlist") {
        // Update local state for waitlist
        setWaitlistEntries(waitlistEntries.filter((entry) => entry.id !== id));
        setSelectedWaitlist(null);
      }

      // Close confirmation dialog
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(`Error deleting ${collection} ${id}:`, err);
      alert("Failed to delete entry. Please try again.");
    }
  };

  const getSortIndicator = (key, configObj) => {
    if (configObj.key === key) {
      return configObj.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const sortedInquiries = getSortedInquiries();
  const sortedWaitlist = getSortedWaitlistEntries();

  // Row hover state management
  const [hoveredRow, setHoveredRow] = useState(null);

  // Check if the device is mobile
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  return (
    <div style={styles.container}>
      <div style={styles.responsiveContainer}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={styles.header}
        >
          <h1 style={styles.title}>Customer Management</h1>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              style={{
                ...styles.actionButton,
                backgroundColor: "transparent",
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
              onClick={fetchData}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
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
            <button
              style={styles.actionButton}
              onClick={() => window.print()}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Export
            </button>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={styles.tabs}
        >
          <div
            onClick={() => setActiveTab("inquiries")}
            style={{
              ...styles.tab,
              ...(activeTab === "inquiries" ? styles.activeTab : {}),
            }}
          >
            Inquiries <span style={styles.tabCount}>{inquiries.length}</span>
          </div>
          <div
            onClick={() => setActiveTab("waitlist")}
            style={{
              ...styles.tab,
              ...(activeTab === "waitlist" ? styles.activeTab : {}),
            }}
          >
            Waitlist{" "}
            <span style={styles.tabCount}>{waitlistEntries.length}</span>
          </div>
        </motion.div>

        {/* Inquiries Content */}
        {activeTab === "inquiries" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
                placeholder="Search by name, email or message"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
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
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: colors.primary,
                      color: "white",
                    }}
                  >
                    Try again
                  </button>
                </div>
              ) : sortedInquiries.length === 0 ? (
                <div style={styles.noDataMessage}>
                  <p>No inquiries found matching your filters.</p>
                </div>
              ) : isMobile ? (
                // Mobile card view for inquiries
                <MobileCardList
                  data={sortedInquiries}
                  type="inquiries"
                  onItemClick={setSelectedInquiry}
                  hoveredRow={hoveredRow}
                  setHoveredRow={setHoveredRow}
                  styles={styles} // Pass styles as prop
                  colors={colors} // Pass colors as prop
                  formatDate={formatDate} // Pass formatDate as prop
                />
              ) : (
                // Desktop table view for inquiries
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th
                          style={styles.tableHeader}
                          onClick={() => handleSort("name")}
                        >
                          Name {getSortIndicator("name", sortConfig)}
                        </th>
                        <th
                          style={styles.tableHeader}
                          onClick={() => handleSort("email")}
                        >
                          Email {getSortIndicator("email", sortConfig)}
                        </th>
                        <th style={styles.tableHeader}>Message</th>
                        <th
                          style={styles.tableHeader}
                          onClick={() => handleSort("createdAt")}
                        >
                          Date {getSortIndicator("createdAt", sortConfig)}
                        </th>
                        <th
                          style={styles.tableHeader}
                          onClick={() => handleSort("status")}
                        >
                          Status {getSortIndicator("status", sortConfig)}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedInquiries.map((inquiry) => (
                        <tr
                          key={inquiry.id}
                          style={{
                            ...styles.tableRow,
                            ...(hoveredRow === inquiry.id
                              ? styles.tableRowHover
                              : {}),
                          }}
                          onClick={() => setSelectedInquiry(inquiry)}
                          onMouseEnter={() => setHoveredRow(inquiry.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td style={styles.tableCell}>
                            {inquiry.name || "N/A"}
                          </td>
                          <td style={styles.tableCell}>
                            {inquiry.email || "N/A"}
                          </td>
                          <td
                            style={{
                              ...styles.tableCell,
                              ...styles.messagePreview,
                            }}
                          >
                            {inquiry.message
                              ? `${inquiry.message.substring(0, 50)}${
                                  inquiry.message.length > 50 ? "..." : ""
                                }`
                              : "N/A"}
                          </td>
                          <td style={styles.tableCell}>
                            {formatDate(inquiry.createdAt)}
                          </td>
                          <td style={styles.tableCell}>
                            <span
                              style={styles.badge(inquiry.status || "default")}
                            >
                              {inquiry.status || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            <div style={styles.pageInfo}>
              Showing {sortedInquiries.length} inquiries
            </div>
          </>
        )}

        {/* Waitlist Content */}
        {activeTab === "waitlist" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={styles.filtersContainer}
            >
              <select
                value={waitlistFilterStatus}
                onChange={(e) => setWaitlistFilterStatus(e.target.value)}
                style={styles.select}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
              </select>

              <input
                type="search"
                placeholder="Search by name, email or phone"
                value={waitlistSearchTerm}
                onChange={(e) => setWaitlistSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={styles.card}
            >
              {waitlistLoading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.spinner}></div>
                </div>
              ) : waitlistError ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: colors.error,
                  }}
                >
                  {waitlistError}
                  <button
                    onClick={fetchWaitlist}
                    style={{
                      marginTop: "16px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: colors.primary,
                      color: "white",
                    }}
                  >
                    Try again
                  </button>
                </div>
              ) : sortedWaitlist.length === 0 ? (
                <div style={styles.noDataMessage}>
                  <p>No waitlist entries found matching your filters.</p>
                </div>
              ) : isMobile ? (
                // Mobile card view for waitlist
                <MobileCardList
                  data={sortedWaitlist}
                  type="waitlist"
                  onItemClick={setSelectedWaitlist}
                  hoveredRow={hoveredRow}
                  setHoveredRow={setHoveredRow}
                  styles={styles} // Pass styles as prop
                  colors={colors} // Pass colors as prop
                  formatDate={formatDate} // Pass formatDate as prop
                />
              ) : (
                // Desktop table view for waitlist
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th
                          style={styles.tableHeader}
                          onClick={() => handleWaitlistSort("name")}
                        >
                          Name {getSortIndicator("name", waitlistSortConfig)}
                        </th>
                        <th
                          style={styles.tableHeader}
                          onClick={() => handleWaitlistSort("email")}
                        >
                          Email {getSortIndicator("email", waitlistSortConfig)}
                        </th>
                        <th
                          style={styles.tableHeader}
                          onClick={() => handleWaitlistSort("phone")}
                        >
                          Phone {getSortIndicator("phone", waitlistSortConfig)}
                        </th>
                        <th
                          style={styles.tableHeader}
                          onClick={() => handleWaitlistSort("createdAt")}
                        >
                          Date{" "}
                          {getSortIndicator("createdAt", waitlistSortConfig)}
                        </th>
                        <th
                          style={styles.tableHeader}
                          onClick={() => handleWaitlistSort("status")}
                        >
                          Status{" "}
                          {getSortIndicator("status", waitlistSortConfig)}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedWaitlist.map((entry) => (
                        <tr
                          key={entry.id}
                          style={{
                            ...styles.tableRow,
                            ...(hoveredRow === entry.id
                              ? styles.tableRowHover
                              : {}),
                          }}
                          onClick={() => setSelectedWaitlist(entry)}
                          onMouseEnter={() => setHoveredRow(entry.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td style={styles.tableCell}>
                            {entry.name || "N/A"}
                          </td>
                          <td style={styles.tableCell}>
                            {entry.email || "N/A"}
                          </td>
                          <td style={styles.tableCell}>
                            {entry.phone || "N/A"}
                          </td>
                          <td style={styles.tableCell}>
                            {formatDate(entry.createdAt)}
                          </td>
                          <td style={styles.tableCell}>
                            <span
                              style={styles.badge(entry.status || "pending")}
                            >
                              {entry.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            <div style={styles.pageInfo}>
              Showing {sortedWaitlist.length} waitlist entries
            </div>
          </>
        )}
      </div>

      {/* Inquiry Detail Modal */}
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

            <div style={styles.infoCard}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <span
                    style={styles.badge(selectedInquiry.status || "default")}
                  >
                    {selectedInquiry.status || "Unknown"}
                  </span>
                </div>
                <div style={{ color: colors.textLight, fontSize: "0.9rem" }}>
                  {formatDate(selectedInquiry.createdAt)}
                </div>
              </div>

              <div style={styles.infoGroup}>
                <span style={styles.infoLabel}>Name</span>
                <div style={styles.infoValue}>
                  {selectedInquiry.name || "N/A"}
                </div>
              </div>

              <div style={styles.infoGroup}>
                <span style={styles.infoLabel}>Email</span>
                <div style={styles.infoValue}>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    style={{ color: colors.primary }}
                  >
                    {selectedInquiry.email || "N/A"}
                  </a>
                </div>
              </div>
            </div>

            <div style={styles.infoGroup}>
              <span style={styles.infoLabel}>Message</span>
              <div style={styles.message}>
                {selectedInquiry.message || "No message provided"}
              </div>
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
                  handleUpdateStatus(
                    selectedInquiry.id,
                    "responded",
                    "inquiries"
                  )
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
                  handleUpdateStatus(
                    selectedInquiry.id,
                    "resolved",
                    "inquiries"
                  )
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

      {/* Waitlist Detail Modal */}
      {selectedWaitlist && (
        <motion.div
          style={styles.modal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedWaitlist(null)
          }
        >
          <motion.div
            style={styles.modalContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div style={styles.modalHeader}>
              <h2>Waitlist Entry Details</h2>
              <button
                style={styles.closeButton}
                onClick={() => setSelectedWaitlist(null)}
              >
                ×
              </button>
            </div>

            <div style={styles.infoCard}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <span
                    style={styles.badge(selectedWaitlist.status || "pending")}
                  >
                    {selectedWaitlist.status || "Pending"}
                  </span>
                </div>
                <div style={{ color: colors.textLight, fontSize: "0.9rem" }}>
                  {formatDate(selectedWaitlist.createdAt)}
                </div>
              </div>

              <div style={styles.waitlistInfo}>
                <div style={styles.infoGroup}>
                  <span style={styles.infoLabel}>Name</span>
                  <div style={styles.infoValue}>
                    {selectedWaitlist.name || "N/A"}
                  </div>
                </div>

                <div style={styles.infoGroup}>
                  <span style={styles.infoLabel}>Email</span>
                  <div style={styles.infoValue}>
                    <a
                      href={`mailto:${selectedWaitlist.email}`}
                      style={{ color: colors.primary }}
                    >
                      {selectedWaitlist.email || "N/A"}
                    </a>
                  </div>
                </div>

                <div style={styles.infoGroup}>
                  <span style={styles.infoLabel}>Phone</span>
                  <div style={styles.infoValue}>
                    <a
                      href={`tel:${selectedWaitlist.phone}`}
                      style={{ color: colors.primary }}
                    >
                      {selectedWaitlist.phone || "N/A"}
                    </a>
                  </div>
                </div>

                <div style={styles.infoGroup}>
                  <span style={styles.infoLabel}>Address</span>
                  <div style={styles.infoValue}>
                    {selectedWaitlist.address || "Not provided"}
                  </div>
                </div>
              </div>

              {selectedWaitlist.source && (
                <div style={styles.metaInfo}>
                  <strong>Source:</strong> {selectedWaitlist.source}
                </div>
              )}
              {selectedWaitlist.joinDate && (
                <div style={styles.metaInfo}>
                  <strong>Join Date:</strong> {selectedWaitlist.joinDate}
                </div>
              )}
            </div>

            {selectedWaitlist.notes && (
              <div style={styles.infoGroup}>
                <span style={styles.infoLabel}>Notes</span>
                <div style={styles.message}>{selectedWaitlist.notes}</div>
              </div>
            )}

            <div style={styles.statusActions}>
              <button
                style={{
                  ...styles.respondedBtn,
                  opacity: selectedWaitlist.status === "contacted" ? 0.6 : 1,
                  cursor:
                    selectedWaitlist.status === "contacted"
                      ? "default"
                      : "pointer",
                }}
                disabled={selectedWaitlist.status === "contacted"}
                onClick={() =>
                  handleUpdateStatus(
                    selectedWaitlist.id,
                    "contacted",
                    "waitlist"
                  )
                }
              >
                Mark as Contacted
              </button>
              <button
                style={{
                  ...styles.resolvedBtn,
                  opacity: selectedWaitlist.status === "resolved" ? 0.6 : 1,
                  cursor:
                    selectedWaitlist.status === "resolved"
                      ? "default"
                      : "pointer",
                }}
                disabled={selectedWaitlist.status === "resolved"}
                onClick={() =>
                  handleUpdateStatus(
                    selectedWaitlist.id,
                    "resolved",
                    "waitlist"
                  )
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
      {showDeleteConfirm && (selectedInquiry || selectedWaitlist) && (
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
              Are you sure you want to delete this{" "}
              {activeTab === "inquiries" ? "inquiry" : "waitlist entry"} from{" "}
              {(selectedInquiry || selectedWaitlist).name}? This action cannot
              be undone.
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
                onClick={() =>
                  activeTab === "inquiries"
                    ? handleDelete(selectedInquiry.id, "inquiries")
                    : handleDelete(selectedWaitlist.id, "waitlist")
                }
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

const MobileCardList = ({
  data,
  type,
  onItemClick,
  hoveredRow,
  setHoveredRow,
  styles, // Add styles as a prop
  colors, // Add colors as a prop
  formatDate, // Add formatDate as a prop
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.map((item) => (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            backgroundColor:
              hoveredRow === item.id ? colors.hoverBg : colors.card,
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            cursor: "pointer",
            border: `1px solid ${colors.border}`,
            transition: "all 0.2s ease",
          }}
          onClick={() => onItemClick(item)}
          onMouseEnter={() => setHoveredRow(item.id)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "12px",
            }}
          >
            <div style={{ fontWeight: "600", fontSize: "16px" }}>
              {item.name || "No Name"}
            </div>
            <span
              style={styles.badge(
                item.status || (type === "waitlist" ? "pending" : "default")
              )}
            >
              {item.status || (type === "waitlist" ? "Pending" : "Unknown")}
            </span>
          </div>

          <div style={{ display: "grid", gap: "8px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: colors.textLight }}
              >
                <path d="M22 2 11 13"></path>
                <path d="M22 2 15 22 11 13 2 9 22 2z"></path>
              </svg>
              <div style={{ fontSize: "14px", color: colors.primary }}>
                {item.email || "No Email"}
              </div>
            </div>

            {type === "waitlist" && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: colors.textLight }}
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div style={{ fontSize: "14px" }}>
                  {item.phone || "No Phone"}
                </div>
              </div>
            )}

            {type === "inquiries" && item.message && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: colors.textLight, marginTop: "3px" }}
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <div
                  style={{
                    fontSize: "14px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    color: colors.textLight,
                  }}
                >
                  {item.message.substring(0, 100)}
                  {item.message.length > 100 ? "..." : ""}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: colors.textLight,
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <div>{formatDate(item.createdAt)}</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "4px" }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Tap to view details
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Add this function to detect if screen is mobile
const isMobileScreen = () => {
  return window.innerWidth < 768;
};

export default Inquiry;

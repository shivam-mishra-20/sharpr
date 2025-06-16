import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  FaBook,
  FaSearch,
  FaTimes,
  FaPencilAlt,
  FaTrashAlt,
  FaFilter,
  FaPlus,
  FaCalendarAlt,
  FaBars,
  FaChevronRight,
  FaCalendar,
  FaChalkboardTeacher,
} from "react-icons/fa";

const classOptions = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
];
const subjectOptions = [
  "Math",
  "Science",
  "English",
  "Social Studies",
  "Computer",
  "Hindi",
  "Other",
];

const initialForm = {
  title: "",
  subject: "",
  class: "",
  description: "",
  assignedDate: "",
  dueDate: "",
};

// Screen size hook for responsive design
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

const AdminHomework = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get window size for responsive design
  const { width } = useWindowSize();
  const isSmallMobile = width <= 480; // Extra small screens
  const isMobile = width <= 768;
  const isTablet = width <= 1024 && width > 768;

  // Fetch homework data
  const fetchHomeworks = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "homework"));
      const arr = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHomeworks(arr);
    } catch (err) {
      setError("Failed to fetch homework: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, []);

  // CRUD operations
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update
        await updateDoc(doc(db, "homework", editId), {
          ...form,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Add
        await addDoc(collection(db, "homework"), {
          ...form,
          assignedBy: "Admin",
          createdAt: serverTimestamp(),
        });
      }
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
      await fetchHomeworks();
    } catch (err) {
      setError("Failed to save: " + err.message);
    }
  };

  const handleEdit = (hw) => {
    setForm({
      title: hw.title || "",
      subject: hw.subject || "",
      class: hw.class || "",
      description: hw.description || "",
      assignedDate: hw.assignedDate || "",
      dueDate: hw.dueDate || "",
    });
    setEditId(hw.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this homework?")) return;
    try {
      await deleteDoc(doc(db, "homework", id));
      await fetchHomeworks();
    } catch (err) {
      setError("Failed to delete: " + err.message);
    }
  };

  const handleAdd = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(true);
  };

  // Search & Filter
  const filteredHomeworks = homeworks.filter((hw) => {
    const matchesSearch =
      hw.title?.toLowerCase().includes(search.toLowerCase()) ||
      hw.description?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = filterClass ? hw.class === filterClass : true;
    const matchesSubject = filterSubject ? hw.subject === filterSubject : true;
    return matchesSearch && matchesClass && matchesSubject;
  });

  const { theme } = useTheme();

  // Theme-based colors
  const colors = {
    background: theme === "dark" ? "#0f172a" : "#f8fafc",
    card: theme === "dark" ? "#1e293b" : "#ffffff",
    cardBorder: theme === "dark" ? "#334155" : "#e2e8f0",
    text: theme === "dark" ? "#f1f5f9" : "#1e293b",
    textSecondary: theme === "dark" ? "#94a3b8" : "#64748b",
    accent: theme === "dark" ? "#3b82f6" : "#4f46e5",
    accentLight:
      theme === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(79, 70, 229, 0.1)",
    warning: theme === "dark" ? "#f59e0b" : "#f59e0b",
    danger: theme === "dark" ? "#ef4444" : "#ef4444",
    success: theme === "dark" ? "#10b981" : "#10b981",
    border: theme === "dark" ? "#334155" : "#e2e8f0",
    inputBg: theme === "dark" ? "#1e293b" : "#ffffff",
    inputBorder: theme === "dark" ? "#475569" : "#e2e8f0",
    inputText: theme === "dark" ? "#f1f5f9" : "#1e293b",
    tableHeader: theme === "dark" ? "#1e293b" : "#f8fafc",
    tableRow: theme === "dark" ? "#0f172a" : "#ffffff",
    tableRowAlt: theme === "dark" ? "#1e293b" : "#f8fafc",
    tableBorder: theme === "dark" ? "#334155" : "#f1f5f9",
    shadow:
      theme === "dark"
        ? "0 4px 12px rgba(0, 0, 0, 0.25)"
        : "0 4px 12px rgba(0, 0, 0, 0.05)",
    buttonShadow:
      theme === "dark"
        ? "0 4px 12px rgba(59, 130, 246, 0.25)"
        : "0 4px 12px rgba(79, 70, 229, 0.25)",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.2 } },
  };

  // Render cards for mobile view instead of table rows
  const renderHomeworkCard = (hw, index) => {
    return (
      <motion.div
        key={hw.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        style={{
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${colors.cardBorder}`,
          marginBottom: 12,
          background: colors.card,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: colors.text,
              flex: 1,
              paddingRight: 8,
            }}
          >
            {hw.title}
          </h3>
          <span
            style={{
              background: colors.accentLight,
              color: colors.accent,
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {hw.subject}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 12,
            fontSize: 13,
            color: colors.textSecondary,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaChalkboardTeacher size={12} />
            {hw.class}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaCalendar size={12} color={colors.accent} />
            Assigned:{" "}
            {hw.assignedDate ||
              hw.createdAt?.toDate?.()?.toLocaleDateString?.() ||
              ""}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaCalendarAlt size={12} color={colors.warning} />
            Due: {hw.dueDate}
          </div>
        </div>

        {!isSmallMobile && (
          <div
            style={{
              fontSize: 13,
              marginBottom: 12,
              color: colors.text,
              background:
                theme === "dark" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.03)",
              padding: 8,
              borderRadius: 6,
              maxHeight: 60,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {hw.description}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 8,
            gap: 8,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(hw)}
            style={{
              background: colors.warning,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 36,
            }}
          >
            <FaPencilAlt size={12} /> Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(hw.id)}
            style={{
              background: colors.danger,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 36,
            }}
          >
            <FaTrashAlt size={12} /> Delete
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Render action buttons differently on mobile
  const renderActionButtons = (hw) => {
    if (isMobile) {
      return (
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEdit(hw)}
            style={{
              background: colors.warning,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
            }}
            aria-label="Edit"
          >
            <FaPencilAlt size={12} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(hw.id)}
            style={{
              background: colors.danger,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
            }}
            aria-label="Delete"
          >
            <FaTrashAlt size={12} />
          </motion.button>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleEdit(hw)}
          style={{
            background: colors.warning,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <FaPencilAlt size={12} /> Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleDelete(hw.id)}
          style={{
            background: colors.danger,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <FaTrashAlt size={12} /> Delete
        </motion.button>
      </div>
    );
  };

  // Toggle sidebar function (to be connected to parent component)
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // You'll need to communicate this state to a parent component that manages the sidebar
    // For example, using context or props
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: isSmallMobile ? "12px 8px" : isMobile ? 16 : 24,
        color: colors.text,
      }}
    >
      {/* Mobile Header with Sidebar Toggle */}
      {isMobile && (
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 12,
            gap: 12,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            style={{
              background: colors.card,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            aria-label="Toggle Sidebar"
          >
            <FaBars size={16} />
          </motion.button>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Homework</h1>
        </motion.div>
      )}

      {/* Desktop/Tablet Header */}
      {!isMobile && (
        <>
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
              color: colors.text,
            }}
          >
            Homework Management
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              color: colors.textSecondary,
              marginBottom: 24,
              fontSize: 16,
            }}
          >
            Assign, edit, search, and manage homework for all classes.
          </motion.p>
        </>
      )}

      {/* Search & Filter - Responsive Layout */}
      <motion.div
        variants={itemVariants}
        style={{
          display: "flex",
          gap: isSmallMobile ? 8 : isMobile ? 12 : 16,
          marginBottom: isSmallMobile ? 12 : 24,
          flexWrap: "wrap",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Search Box - Full width on mobile */}
        <div
          style={{
            flex: isMobile ? "1 0 100%" : 1,
            minWidth: isMobile ? "100%" : 220,
            maxWidth: isMobile ? "100%" : 340,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: colors.card,
            borderRadius: 10,
            padding: isSmallMobile ? "2px 12px" : "4px 16px",
            border: `1px solid ${colors.border}`,
          }}
        >
          <FaSearch style={{ color: colors.textSecondary, flexShrink: 0 }} />
          <input
            type="text"
            placeholder={
              isSmallMobile ? "Search..." : "Search by title or description"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: isSmallMobile ? "8px 0" : "10px 0",
              border: "none",
              width: "100%",
              fontSize: 14,
              backgroundColor: "transparent",
              color: colors.text,
              outline: "none",
            }}
          />
          {search && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearch("")}
              style={{
                background: "transparent",
                border: "none",
                color: colors.textSecondary,
                cursor: "pointer",
                padding: 4,
                flexShrink: 0,
              }}
            >
              <FaTimes size={14} />
            </motion.button>
          )}
        </div>

        {/* Filter Controls - Row on desktop, wrap on mobile */}
        <div
          style={{
            display: "flex",
            gap: isSmallMobile ? 6 : 12,
            flexWrap: "wrap",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            style={{
              padding: isSmallMobile ? "8px 6px" : 12,
              borderRadius: 10,
              border: `1px solid ${colors.border}`,
              background: colors.card,
              color: colors.text,
              minWidth: isMobile ? 0 : 140,
              fontSize: 14,
              flex: isMobile ? 1 : "auto",
              WebkitAppearance: isSmallMobile ? "none" : "auto", // Simplify dropdown on small mobile
              appearance: isSmallMobile ? "none" : "auto",
            }}
          >
            <option value="">All Classes</option>
            {classOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            style={{
              padding: isSmallMobile ? "8px 6px" : 12,
              borderRadius: 10,
              border: `1px solid ${colors.border}`,
              background: colors.card,
              color: colors.text,
              minWidth: isMobile ? 0 : 140,
              fontSize: 14,
              flex: isMobile ? 1 : "auto",
              WebkitAppearance: isSmallMobile ? "none" : "auto", // Simplify dropdown on small mobile
              appearance: isSmallMobile ? "none" : "auto",
            }}
          >
            <option value="">All Subjects</option>
            {subjectOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Add Button - Full width on mobile */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleAdd}
          style={{
            background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: isSmallMobile ? "10px 16px" : "12px 20px",
            fontWeight: 600,
            fontSize: isSmallMobile ? 14 : 15,
            cursor: "pointer",
            minWidth: isMobile ? "100%" : 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: colors.buttonShadow,
          }}
        >
          <FaPlus size={isSmallMobile ? 12 : 14} />{" "}
          {isSmallMobile ? "Add Homework" : "Assign Homework"}
        </motion.button>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: colors.danger,
            marginBottom: 16,
            padding: "12px 16px",
            borderRadius: 8,
            background:
              theme === "dark"
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${
              theme === "dark"
                ? "rgba(239, 68, 68, 0.3)"
                : "rgba(239, 68, 68, 0.2)"
            }`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <FaTimes size={16} />
          {error}
        </motion.div>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: 20,
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: 32,
                background: colors.card,
                borderRadius: 12,
                border: `1px solid ${colors.cardBorder}`,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
                style={{ display: "inline-block", marginBottom: 8 }}
              >
                <FaBook size={24} color={colors.accent} />
              </motion.div>
              <p style={{ margin: 0 }}>Loading homework assignments...</p>
            </div>
          ) : filteredHomeworks.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 32,
                background: colors.card,
                borderRadius: 12,
                border: `1px solid ${colors.cardBorder}`,
                color: colors.textSecondary,
              }}
            >
              No homework found matching your search criteria.
            </div>
          ) : (
            filteredHomeworks.map((hw, index) => renderHomeworkCard(hw, index))
          )}
        </motion.div>
      )}

      {/* Desktop/Tablet View - Table */}
      {!isMobile && (
        <motion.div
          variants={itemVariants}
          style={{
            background: colors.card,
            borderRadius: 16,
            boxShadow: colors.shadow,
            overflow: "hidden",
            border: `1px solid ${colors.cardBorder}`,
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              overflowX: "auto",
              width: "100%",
              WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
              msOverflowStyle: "-ms-autohiding-scrollbar", // Better experience on Edge
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead style={{ background: colors.tableHeader }}>
                <tr>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Subject
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Class
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Assigned Date
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Due Date
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: "center", padding: 32 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        style={{ display: "inline-block", marginRight: 10 }}
                      >
                        <FaBook size={16} color={colors.accent} />
                      </motion.div>
                      Loading homework assignments...
                    </td>
                  </tr>
                ) : filteredHomeworks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        padding: 32,
                        color: colors.textSecondary,
                      }}
                    >
                      No homework found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredHomeworks.map((hw, index) => (
                    <motion.tr
                      key={hw.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      style={{
                        borderBottom: `1px solid ${colors.tableBorder}`,
                        background:
                          index % 2 === 0
                            ? colors.tableRow
                            : colors.tableRowAlt,
                      }}
                      whileHover={{
                        backgroundColor:
                          theme === "dark"
                            ? "rgba(59, 130, 246, 0.1)"
                            : "rgba(79, 70, 229, 0.05)",
                      }}
                    >
                      <td
                        style={{
                          padding: 14,
                          fontWeight: 600,
                          color: colors.text,
                        }}
                      >
                        {hw.title}
                      </td>
                      <td
                        style={{
                          padding: 14,
                          color: colors.text,
                        }}
                      >
                        <span
                          style={{
                            background: colors.accentLight,
                            color: colors.accent,
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {hw.subject}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: 14,
                          color: colors.text,
                        }}
                      >
                        {hw.class}
                      </td>
                      <td
                        style={{
                          padding: 14,
                          color: colors.text,
                        }}
                      >
                        {hw.assignedDate ||
                          hw.createdAt?.toDate?.()?.toLocaleDateString?.() ||
                          ""}
                      </td>
                      <td
                        style={{
                          padding: 14,
                          color: colors.text,
                        }}
                      >
                        {hw.dueDate}
                      </td>
                      <td
                        style={{
                          padding: 14,
                          maxWidth: 220,
                          whiteSpace: "pre-line",
                          color: colors.text,
                          lineHeight: 1.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {hw.description}
                      </td>
                      <td
                        style={{
                          padding: 14,
                          textAlign: "center",
                        }}
                      >
                        {renderActionButtons(hw)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Homework Form Modal - Responsive */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
              padding: isSmallMobile ? 12 : isMobile ? 16 : 0,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              style={{
                width: "100%",
                maxWidth: 600,
                maxHeight: isSmallMobile ? "92vh" : isMobile ? "85vh" : "90vh",
                overflow: "auto",
                padding: 0,
                borderRadius: 16,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                background: colors.card,
              }}
            >
              <form
                onSubmit={handleFormSubmit}
                style={{
                  padding: isSmallMobile ? 16 : isMobile ? 20 : 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: isSmallMobile ? 16 : isMobile ? 20 : 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: isSmallMobile ? 16 : isMobile ? 18 : 22,
                      fontWeight: 700,
                      margin: 0,
                      color: colors.text,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <FaBook style={{ color: colors.accent }} />
                    {editId ? "Edit Homework" : "Assign Homework"}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
                      setForm(initialForm);
                    }}
                    style={{
                      background:
                        theme === "dark"
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.05)",
                      border: "none",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: colors.text,
                      fontSize: 20,
                    }}
                    aria-label="Close"
                  >
                    ×
                  </motion.button>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <label
                    style={{
                      fontWeight: 500,
                      color: colors.text,
                      marginBottom: 2,
                      fontSize: isSmallMobile ? 14 : 15,
                    }}
                  >
                    Assignment Title *
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: 15,
                    }}
                    placeholder="Enter homework title"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: isSmallMobile ? 12 : 16,
                    flexWrap: "wrap",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 6 : 10,
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 500,
                        color: colors.text,
                        marginBottom: 2,
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                    >
                      Subject *
                    </label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, subject: e.target.value }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                        width: "100%",
                      }}
                    >
                      <option value="">Select Subject</option>
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 6 : 10,
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 500,
                        color: colors.text,
                        marginBottom: 2,
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                    >
                      Class *
                    </label>
                    <select
                      required
                      value={form.class}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, class: e.target.value }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                        width: "100%",
                      }}
                    >
                      <option value="">Select Class</option>
                      {classOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isSmallMobile ? 6 : 10,
                  }}
                >
                  <label
                    style={{
                      fontWeight: 500,
                      color: colors.text,
                      marginBottom: 2,
                      fontSize: isSmallMobile ? 14 : 15,
                    }}
                  >
                    Description *
                  </label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      minHeight: isSmallMobile ? 60 : isMobile ? 80 : 100,
                      resize: "vertical",
                    }}
                    placeholder="Enter homework description and requirements"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: isSmallMobile ? 12 : 16,
                    flexWrap: "wrap",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 6 : 10,
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 500,
                        color: colors.text,
                        marginBottom: 2,
                        fontSize: isSmallMobile ? 14 : 15,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <FaCalendarAlt
                        size={12}
                        style={{ color: colors.accent }}
                      />{" "}
                      Assigned Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={form.assignedDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, assignedDate: e.target.value }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                        width: "100%",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 6 : 10,
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 500,
                        color: colors.text,
                        marginBottom: 2,
                        fontSize: isSmallMobile ? 14 : 15,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <FaCalendarAlt
                        size={12}
                        style={{ color: colors.warning }}
                      />{" "}
                      Due Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={form.dueDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, dueDate: e.target.value }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                        width: "100%",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: isSmallMobile ? 8 : 16,
                    marginTop: isSmallMobile ? 4 : isMobile ? 8 : 16,
                    justifyContent: "flex-end",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
                      setForm(initialForm);
                    }}
                    style={{
                      background: "transparent",
                      color: colors.accent,
                      border: `1px solid ${colors.accent}`,
                      borderRadius: 10,
                      padding: isSmallMobile ? "10px 20px" : "12px 24px",
                      fontWeight: 600,
                      fontSize: isSmallMobile ? 14 : 15,
                      cursor: "pointer",
                      minWidth: isMobile ? "100%" : 100,
                      order: isMobile ? 2 : 1,
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    type="submit"
                    style={{
                      background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: isSmallMobile ? "10px 24px" : "12px 32px",
                      fontWeight: 600,
                      fontSize: isSmallMobile ? 14 : 15,
                      cursor: "pointer",
                      boxShadow: colors.buttonShadow,
                      minWidth: isMobile ? "100%" : 150,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      order: isMobile ? 1 : 2,
                    }}
                  >
                    {editId ? "Update" : "Assign"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminHomework;

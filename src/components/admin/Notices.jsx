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
  FaBullhorn,
  FaSearch,
  FaFilter,
  FaPencilAlt,
  FaTrashAlt,
  FaPlus,
  FaTimes,
  FaCalendarAlt,
  FaUsers,
  FaExclamationTriangle,
  FaTag,
  FaBars,
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";

const priorityOptions = ["High", "Medium", "Low"];
// Updated audience options to include Class and Individual Student
const audienceOptions = [
  "All",
  "Students",
  "Parents",
  "Teachers",
  "Class",
  "Individual Student",
];
const statusOptions = ["Active", "Inactive"];

// Mock data for classes and students - replace with actual data from your application
const classesList = [
  "Class 1A",
  "Class 2B",
  "Class 3C",
  "Class 4D",
  "Class 5E",
  "Class 6F",
];
const studentsList = [
  { id: "st1", name: "Alex Johnson", class: "Class 1A" },
  { id: "st2", name: "Sam Wilson", class: "Class 1A" },
  { id: "st3", name: "Jamie Brown", class: "Class 2B" },
  { id: "st4", name: "Taylor Davis", class: "Class 3C" },
  { id: "st5", name: "Morgan Smith", class: "Class 4D" },
];

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

const NoticesDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    priority: "",
    audience: "",
    content: "",
    expiryDate: "",
    status: "Active",
    targetClass: "", // New field for class targeting
    targetStudent: "", // New field for student targeting
    targetStudentName: "", // To store the student's name for display
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    priority: "",
    status: "",
    audience: "",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get window size for responsive design
  const { width } = useWindowSize();
  const isSmallMobile = width <= 480; // Extra small screens
  const isMobile = width <= 768;
  const isTablet = width <= 1024 && width > 768;

  // Fetch notices from Firestore
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "notices"));
      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setNotices(arr);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Add or update notice
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare notice data based on audience selection
    const noticeData = { ...form };

    // Clean up unnecessary fields based on audience
    if (form.audience !== "Class") {
      delete noticeData.targetClass;
    }

    if (form.audience !== "Individual Student") {
      delete noticeData.targetStudent;
      delete noticeData.targetStudentName;
    }

    try {
      if (editId) {
        await updateDoc(doc(db, "notices", editId), {
          ...noticeData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "notices"), {
          ...noticeData,
          createdAt: serverTimestamp(),
        });
      }
      setShowForm(false);
      setEditId(null);
      setForm({
        title: "",
        priority: "",
        audience: "",
        content: "",
        expiryDate: "",
        status: "Active",
        targetClass: "",
        targetStudent: "",
        targetStudentName: "",
      });
      fetchNotices();
    } catch (err) {
      alert("Failed to save notice: " + err.message);
    }
  };

  // Edit notice
  const handleEdit = (notice) => {
    setEditId(notice.id);
    setForm({
      title: notice.title || "",
      priority: notice.priority || "",
      audience: notice.audience || "",
      content: notice.content || "",
      expiryDate: notice.expiryDate || "",
      status: notice.status || "Active",
      targetClass: notice.targetClass || "",
      targetStudent: notice.targetStudent || "",
      targetStudentName: notice.targetStudentName || "",
    });
    setShowForm(true);
  };

  // Delete notice
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await deleteDoc(doc(db, "notices", id));
      fetchNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  // Handle student selection - update both ID and name
  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    const selectedStudent = studentsList.find(
      (student) => student.id === studentId
    );
    setForm((f) => ({
      ...f,
      targetStudent: studentId,
      targetStudentName: selectedStudent ? selectedStudent.name : "",
    }));
  };

  // Filter and search
  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.content?.toLowerCase().includes(search.toLowerCase()) ||
      n.targetStudentName?.toLowerCase().includes(search.toLowerCase()) ||
      n.targetClass?.toLowerCase().includes(search.toLowerCase());

    const matchesPriority = filter.priority
      ? n.priority === filter.priority
      : true;
    const matchesStatus = filter.status ? n.status === filter.status : true;
    const matchesAudience = filter.audience
      ? n.audience === filter.audience
      : true;
    return matchesSearch && matchesPriority && matchesStatus && matchesAudience;
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
    priority: {
      High: theme === "dark" ? "#ef4444" : "#ef4444",
      Medium: theme === "dark" ? "#f59e0b" : "#f59e0b",
      Low: theme === "dark" ? "#10b981" : "#10b981",
    },
    status: {
      Active: theme === "dark" ? "#10b981" : "#10b981",
      Inactive: theme === "dark" ? "#64748b" : "#94a3b8",
    },
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

  // Toggle sidebar function (to be connected to parent component)
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // You'll need to communicate this state to a parent component that manages the sidebar
  };

  // Helper function to get display audience
  const getDisplayAudience = (notice) => {
    if (notice.audience === "Class" && notice.targetClass) {
      return `Class: ${notice.targetClass}`;
    } else if (
      notice.audience === "Individual Student" &&
      notice.targetStudentName
    ) {
      return `Student: ${notice.targetStudentName}`;
    }
    return notice.audience;
  };

  // Render notice card for mobile view
  const renderNoticeCard = (notice, index) => {
    return (
      <motion.div
        key={notice.id}
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
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: colors.text,
              }}
            >
              {notice.title}
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: notice.priority
                    ? `${colors.priority[notice.priority]}15`
                    : colors.accentLight,
                  color: notice.priority
                    ? colors.priority[notice.priority]
                    : colors.accent,
                  padding: "3px 6px",
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                <FaExclamationTriangle size={10} />
                {notice.priority}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: colors.accentLight,
                  color: colors.accent,
                  padding: "3px 6px",
                  borderRadius: 6,
                  fontWeight: 500,
                  fontSize: 12,
                }}
              >
                <FaUsers size={10} />
                {getDisplayAudience(notice)}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background:
                    notice.status === "Active"
                      ? `${colors.status.Active}15`
                      : `${colors.status.Inactive}15`,
                  color:
                    notice.status === "Active"
                      ? colors.status.Active
                      : colors.status.Inactive,
                  padding: "3px 6px",
                  borderRadius: 6,
                  fontWeight: 500,
                  fontSize: 12,
                }}
              >
                {notice.status === "Active" ? (
                  <FaEye size={10} />
                ) : (
                  <FaEyeSlash size={10} />
                )}
                {notice.status}
              </div>
            </div>
          </div>
        </div>

        {notice.expiryDate && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
              fontSize: 13,
              color: colors.textSecondary,
            }}
          >
            <FaCalendarAlt size={12} style={{ color: colors.warning }} />
            Expires: {notice.expiryDate}
          </div>
        )}

        <div
          style={{
            fontSize: 14,
            color: colors.text,
            marginBottom: 12,
            padding: "10px 12px",
            background:
              theme === "dark" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.03)",
            borderRadius: 8,
            maxHeight: 80,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {notice.content}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(notice)}
            style={{
              background: colors.accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(notice.id)}
            style={{
              background: colors.danger,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
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
      </motion.div>
    );
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
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Notices</h1>
        </motion.div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <>
          <motion.div
            variants={itemVariants}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 8,
            }}
          >
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <FaBullhorn size={28} style={{ color: colors.accent }} />
            </motion.div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: colors.text,
                margin: 0,
              }}
            >
              Notices Dashboard
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            style={{
              marginBottom: 24,
              color: colors.textSecondary,
              fontSize: 16,
              maxWidth: 800,
            }}
          >
            Send, manage, and update notices for students, parents, teachers,
            specific classes, or individual students.
          </motion.p>
        </>
      )}

      {/* Search & Filter - Responsive Layout */}
      <motion.div
        variants={itemVariants}
        style={{
          display: "flex",
          gap: isSmallMobile ? 8 : isMobile ? 12 : 16,
          marginBottom: isSmallMobile ? 12 : isMobile ? 16 : 24,
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
            marginBottom: isMobile ? 8 : 0,
          }}
        >
          <FaSearch style={{ color: colors.textSecondary, flexShrink: 0 }} />
          <input
            type="text"
            placeholder={
              isSmallMobile
                ? "Search..."
                : "Search by title, content, student, or class"
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
              exit={{ scale: 0 }}
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

        {/* Mobile Control Buttons */}
        {isMobile && (
          <div style={{ display: "flex", width: "100%", gap: 8 }}>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                background: showFilters ? colors.accentLight : colors.card,
                color: showFilters ? colors.accent : colors.text,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: 1,
              }}
            >
              <FaFilter size={14} /> {showFilters ? "Hide Filters" : "Filters"}
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                setForm({
                  title: "",
                  priority: "",
                  audience: "",
                  content: "",
                  expiryDate: "",
                  status: "Active",
                  targetClass: "",
                  targetStudent: "",
                  targetStudentName: "",
                });
              }}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: colors.buttonShadow,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: 1,
              }}
            >
              <FaPlus size={14} /> Add Notice
            </motion.button>
          </div>
        )}

        {/* Mobile Filters - Collapsible */}
        {isMobile && showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 4,
              marginBottom: 4,
            }}
          >
            <select
              value={filter.priority}
              onChange={(e) =>
                setFilter((f) => ({ ...f, priority: e.target.value }))
              }
              style={{
                padding: isSmallMobile ? "8px 12px" : "10px 12px",
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.card,
                color: colors.text,
                fontSize: 14,
                width: "100%",
              }}
            >
              <option value="">All Priorities</option>
              {priorityOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((f) => ({ ...f, status: e.target.value }))
              }
              style={{
                padding: isSmallMobile ? "8px 12px" : "10px 12px",
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.card,
                color: colors.text,
                fontSize: 14,
                width: "100%",
              }}
            >
              <option value="">All Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={filter.audience}
              onChange={(e) =>
                setFilter((f) => ({ ...f, audience: e.target.value }))
              }
              style={{
                padding: isSmallMobile ? "8px 12px" : "10px 12px",
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.card,
                color: colors.text,
                fontSize: 14,
                width: "100%",
              }}
            >
              <option value="">All Audiences</option>
              {audienceOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            {(filter.priority ||
              filter.status ||
              filter.audience ||
              search) && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  setFilter({ priority: "", status: "", audience: "" });
                  setSearch("");
                }}
                style={{
                  background:
                    theme === "dark"
                      ? "rgba(239, 68, 68, 0.15)"
                      : "rgba(239, 68, 68, 0.1)",
                  color: colors.danger,
                  border: `1px solid ${
                    theme === "dark"
                      ? "rgba(239, 68, 68, 0.3)"
                      : "rgba(239, 68, 68, 0.2)"
                  }`,
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                }}
              >
                <FaTimes size={12} /> Clear All Filters
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Desktop Filters & Add Button */}
        {!isMobile && (
          <>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                background: colors.tableHeader,
                padding: "8px 16px",
                borderRadius: 10,
                flexWrap: isTablet ? "wrap" : "nowrap",
              }}
            >
              <FaFilter size={14} style={{ color: colors.textSecondary }} />

              <select
                value={filter.priority}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, priority: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.card,
                  color: colors.text,
                  fontSize: 14,
                  minWidth: isTablet ? 120 : 140,
                }}
              >
                <option value="">All Priorities</option>
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, status: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.card,
                  color: colors.text,
                  fontSize: 14,
                  minWidth: isTablet ? 120 : 140,
                }}
              >
                <option value="">All Status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={filter.audience}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, audience: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.card,
                  color: colors.text,
                  fontSize: 14,
                  minWidth: isTablet ? 120 : 140,
                }}
              >
                <option value="">All Audiences</option>
                {audienceOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>

              {(filter.priority ||
                filter.status ||
                filter.audience ||
                search) && (
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    setFilter({ priority: "", status: "", audience: "" });
                    setSearch("");
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                    cursor: "pointer",
                    color: colors.textSecondary,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <FaTimes size={14} /> Reset
                </motion.button>
              )}
            </div>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                setForm({
                  title: "",
                  priority: "",
                  audience: "",
                  content: "",
                  expiryDate: "",
                  status: "Active",
                  targetClass: "",
                  targetStudent: "",
                  targetStudentName: "",
                });
              }}
              style={{
                marginLeft: "auto",
                padding: "12px 20px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: colors.buttonShadow,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <FaPlus size={14} /> Add Notice
            </motion.button>
          </>
        )}
      </motion.div>

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
                <FaBullhorn size={24} color={colors.accent} />
              </motion.div>
              <p style={{ margin: 0 }}>Loading notices...</p>
            </div>
          ) : filteredNotices.length === 0 ? (
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
              No notices found matching your search criteria.
            </div>
          ) : (
            filteredNotices.map((notice, index) =>
              renderNoticeCard(notice, index)
            )
          )}
        </motion.div>
      )}

      {/* Desktop/Tablet Table View */}
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                    Priority
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
                    Audience
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
                    Status
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
                    Expiry
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
                    Content
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
                        <FaBullhorn size={16} color={colors.accent} />
                      </motion.div>
                      Loading notices...
                    </td>
                  </tr>
                ) : filteredNotices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        padding: 32,
                        color: colors.textSecondary,
                      }}
                    >
                      No notices found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredNotices.map((n, index) => (
                    <motion.tr
                      key={n.id}
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
                        {n.title}
                      </td>
                      <td style={{ padding: 14 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: n.priority
                              ? `${colors.priority[n.priority]}15`
                              : colors.accentLight,
                            color: n.priority
                              ? colors.priority[n.priority]
                              : colors.accent,
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontWeight: 600,
                            fontSize: 13,
                          }}
                        >
                          <FaExclamationTriangle size={12} />
                          {n.priority}
                        </div>
                      </td>
                      <td style={{ padding: 14 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: colors.accentLight,
                            color: colors.accent,
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontWeight: 500,
                            fontSize: 13,
                          }}
                        >
                          {n.audience === "Class" ? (
                            <FaChalkboardTeacher size={12} />
                          ) : n.audience === "Individual Student" ? (
                            <FaUserGraduate size={12} />
                          ) : (
                            <FaUsers size={12} />
                          )}
                          {getDisplayAudience(n)}
                        </div>
                      </td>
                      <td style={{ padding: 14 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background:
                              n.status === "Active"
                                ? `${colors.status.Active}15`
                                : `${colors.status.Inactive}15`,
                            color:
                              n.status === "Active"
                                ? colors.status.Active
                                : colors.status.Inactive,
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontWeight: 500,
                            fontSize: 13,
                          }}
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background:
                                n.status === "Active"
                                  ? colors.status.Active
                                  : colors.status.Inactive,
                            }}
                          ></div>
                          {n.status}
                        </div>
                      </td>
                      <td style={{ padding: 14, color: colors.text }}>
                        {n.expiryDate ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 14,
                            }}
                          >
                            <FaCalendarAlt
                              size={14}
                              style={{ color: colors.textSecondary }}
                            />
                            {n.expiryDate}
                          </div>
                        ) : (
                          <span style={{ color: colors.textSecondary }}>-</span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: 14,
                          maxWidth: 220,
                          whiteSpace: "pre-line",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: colors.text,
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {n.content}
                      </td>
                      <td style={{ padding: 14, textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 8,
                          }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(n)}
                            style={{
                              background: colors.accent,
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontSize: 14,
                              fontWeight: 500,
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
                            onClick={() => handleDelete(n.id)}
                            style={{
                              background: colors.danger,
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontSize: 14,
                              fontWeight: 500,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <FaTrashAlt size={12} /> Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Notice Form Modal - Responsive */}
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
              alignItems: isMobile ? "flex-end" : "center",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
              padding: isSmallMobile ? 12 : isMobile ? 16 : 0,
            }}
          >
            <motion.div
              initial={{
                scale: isMobile ? 1 : 0.9,
                opacity: 0,
                y: isMobile ? 100 : 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: isMobile ? 1 : 0.9,
                opacity: 0,
                y: isMobile ? 100 : 0,
              }}
              transition={{ type: "spring", damping: 25 }}
              style={{
                width: "100%",
                maxWidth: isMobile ? "100%" : 580,
                maxHeight: isSmallMobile ? "92vh" : isMobile ? "85vh" : "90vh",
                overflow: "auto",
                padding: 0,
                borderRadius: isMobile ? "16px 16px 0 0" : 16,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                background: colors.card,
              }}
            >
              <form
                onSubmit={handleSubmit}
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
                    <FaBullhorn style={{ color: colors.accent }} />
                    {editId ? "Edit Notice" : "Add Notice"}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
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
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: isSmallMobile ? 14 : 15,
                    }}
                  >
                    <FaTag size={14} style={{ color: colors.accent }} />
                    Title *
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
                      fontSize: isSmallMobile ? 14 : 15,
                    }}
                    placeholder="Enter notice title"
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
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                    >
                      <FaExclamationTriangle
                        size={14}
                        style={{ color: colors.warning }}
                      />
                      Priority *
                    </label>
                    <select
                      required
                      value={form.priority}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, priority: e.target.value }))
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
                      <option value="">Select Priority</option>
                      {priorityOptions.map((opt) => (
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
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                    >
                      <FaUsers size={14} style={{ color: colors.accent }} />
                      Audience *
                    </label>
                    <select
                      required
                      value={form.audience}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          audience: e.target.value,
                          // Reset targeting fields when audience changes
                          targetClass: "",
                          targetStudent: "",
                          targetStudentName: "",
                        }))
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
                      <option value="">Select Audience</option>
                      {audienceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Conditional fields for Class or Individual Student selection */}
                {form.audience === "Class" && (
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
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                    >
                      <FaChalkboardTeacher
                        size={14}
                        style={{ color: colors.accent }}
                      />
                      Select Class *
                    </label>
                    <select
                      required
                      value={form.targetClass}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, targetClass: e.target.value }))
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
                      {classesList.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {form.audience === "Individual Student" && (
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
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                    >
                      <FaUserGraduate
                        size={14}
                        style={{ color: colors.accent }}
                      />
                      Select Student *
                    </label>
                    <select
                      required
                      value={form.targetStudent}
                      onChange={handleStudentSelect}
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
                      <option value="">Select Student</option>
                      {studentsList.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.class})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
                      fontSize: isSmallMobile ? 14 : 15,
                    }}
                  >
                    Content *
                  </label>
                  <textarea
                    required
                    value={form.content}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, content: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      minHeight: isSmallMobile ? 80 : isMobile ? 100 : 120,
                      resize: "vertical",
                    }}
                    placeholder="Enter notice content"
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
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                    >
                      <FaCalendarAlt
                        size={14}
                        style={{ color: colors.accent }}
                      />
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={form.expiryDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, expiryDate: e.target.value }))
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
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                    >
                      Status *
                    </label>
                    <select
                      required
                      value={form.status}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, status: e.target.value }))
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
                      {statusOptions.map((opt) => (
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
                      minWidth: isMobile ? "100%" : 120,
                      order: isMobile ? 1 : 2,
                    }}
                  >
                    {editId ? "Update Notice" : "Add Notice"}
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

export default NoticesDashboard;

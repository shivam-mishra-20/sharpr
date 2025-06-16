import React, { useEffect, useState, useRef } from "react";
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
  FaEdit,
  FaTrash,
  FaPlus,
  FaSync,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCalendarAlt,
  FaUserGraduate,
  FaSchool,
  FaCheckCircle,
  FaTimesCircle,
  FaBars,
  FaChevronRight,
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

const statusOptions = ["present", "absent"];

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

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    date: "",
    class: "",
    studentId: "",
    status: "present",
  });
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const tableRef = useRef(null);

  // Get window dimensions for responsive design
  const { width } = useWindowSize();
  const isSmallMobile = width <= 480; // Extra small screens
  const isMobile = width <= 768;
  const isTablet = width <= 1024 && width > 768;

  // Fetch students and attendance
  const fetchData = async () => {
    setLoading(true);
    try {
      // Students
      const studentsSnap = await getDocs(collection(db, "students"));
      const studentsArr = studentsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsArr);

      // Attendance
      const attSnap = await getDocs(collection(db, "attendance"));
      const attArr = attSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttendance(attArr);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helpers
  const getStudentName = (id) => {
    const s = students.find((x) => x.id === id);
    return s ? `${s.firstName || ""} ${s.lastName || ""}` : "";
  };

  // CRUD
  const handleAdd = () => {
    setForm({
      date: "",
      class: "",
      studentId: "",
      status: "present",
    });
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (rec) => {
    setForm({
      date: rec.date,
      class: rec.class,
      studentId: rec.studentId,
      status: rec.status,
    });
    setEditId(rec.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this attendance record?")) {
      try {
        await deleteDoc(doc(db, "attendance", id));
        await fetchData();
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.class || !form.studentId || !form.status) return;

    try {
      if (editId) {
        // Update
        await updateDoc(doc(db, "attendance", editId), {
          ...form,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Add
        await addDoc(collection(db, "attendance"), {
          ...form,
          studentName: getStudentName(form.studentId),
          createdAt: serverTimestamp(),
        });
      }
      setShowForm(false);
      setEditId(null);
      await fetchData();
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  // Filtered and searched data
  const filtered = attendance
    .filter((a) =>
      search
        ? getStudentName(a.studentId)
            .toLowerCase()
            .includes(search.toLowerCase())
        : true
    )
    .filter((a) => (filterClass ? a.class === filterClass : true))
    .filter((a) => (filterDate ? a.date === filterDate : true))
    .filter((a) => (filterStatus ? a.status === filterStatus : true))
    .sort((a, b) => (b.date > a.date ? 1 : -1));

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
    status: {
      present: theme === "dark" ? "#10b981" : "#10b981",
      absent: theme === "dark" ? "#ef4444" : "#ef4444",
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

  // Render attendance cards for mobile view
  const renderAttendanceCard = (rec, index) => {
    return (
      <motion.div
        key={rec.id}
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
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: colors.text,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FaUserGraduate size={14} style={{ color: colors.accent }} />
            {getStudentName(rec.studentId)}
          </h3>
          {rec.status === "present" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: `${colors.status.present}15`,
                color: colors.status.present,
                padding: "4px 10px",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              <FaCheckCircle size={14} />
              Present
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: `${colors.status.absent}15`,
                color: colors.status.absent,
                padding: "4px 10px",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              <FaTimesCircle size={14} />
              Absent
            </div>
          )}
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
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}
          >
            <FaCalendarAlt size={14} style={{ color: colors.accent }} />
            <span style={{ fontWeight: 500 }}>{rec.date}</span>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}
          >
            <FaSchool size={14} style={{ color: colors.accent }} />
            <span
              style={{
                background: colors.accentLight,
                color: colors.accent,
                padding: "3px 6px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {rec.class}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: isSmallMobile ? 8 : 12,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(rec)}
            style={{
              background: colors.warning,
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
            <FaEdit size={12} /> Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(rec.id)}
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
            <FaTrash size={12} /> Delete
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
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            Attendance
          </h1>
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
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <FaUserGraduate style={{ color: colors.accent }} />
            Attendance Management
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 16,
              color: colors.textSecondary,
              marginBottom: 24,
              maxWidth: 800,
            }}
          >
            Record and monitor student attendance across all classes.
          </motion.p>
        </>
      )}

      {/* Search & Filter Bar - Responsive Layout */}
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
            maxWidth: isMobile ? "100%" : 300,
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
            placeholder={isSmallMobile ? "Search..." : "Search by student name"}
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

        {/* Mobile Control Buttons */}
        {isMobile && (
          <div style={{ display: "flex", width: "100%", gap: 8 }}>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: showFilters ? colors.accentLight : colors.card,
                color: showFilters ? colors.accent : colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                fontWeight: showFilters ? 600 : 500,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
              onClick={handleAdd}
              style={{
                background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 12px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                flex: 1,
                boxShadow: colors.buttonShadow,
              }}
            >
              <FaPlus size={14} /> Add Record
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={fetchData}
              style={{
                background: colors.card,
                color: colors.accent,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: "10px 0",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
              }}
              aria-label="Refresh"
            >
              <FaSync size={14} />
            </motion.button>
          </div>
        )}

        {/* Mobile Filter Set */}
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
              marginTop: 8,
              marginBottom: 4,
            }}
          >
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
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
              <option value="">All Classes</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{
                padding: isSmallMobile ? "8px 12px" : "10px 12px",
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.card,
                color: colors.text,
                fontSize: 14,
                width: "100%",
              }}
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            {(filterClass || filterDate || filterStatus || search) && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  setFilterClass("");
                  setFilterDate("");
                  setFilterStatus("");
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

        {/* Desktop Controls */}
        {!isMobile && (
          <>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  background: colors.tableHeader,
                  padding: "8px 16px",
                  borderRadius: 10,
                  flexWrap: isTablet ? "wrap" : "nowrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FaFilter size={14} style={{ color: colors.textSecondary }} />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: colors.textSecondary,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Filter:
                  </span>
                </div>

                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                    color: colors.text,
                    fontSize: 14,
                    minWidth: 140,
                  }}
                >
                  <option value="">All Classes</option>
                  {classOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                    color: colors.text,
                    fontSize: 14,
                    minWidth: isTablet ? 120 : 140,
                  }}
                />

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                    color: colors.text,
                    fontSize: 14,
                    minWidth: 140,
                  }}
                >
                  <option value="">All Status</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>

                {(filterClass || filterDate || filterStatus || search) && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => {
                      setFilterClass("");
                      setFilterDate("");
                      setFilterStatus("");
                      setSearch("");
                    }}
                    style={{
                      background: colors.card,
                      color: colors.textSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontWeight: 500,
                      fontSize: 14,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <FaTimes size={12} /> Clear
                  </motion.button>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginLeft: isTablet ? 0 : "auto",
                }}
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={fetchData}
                  style={{
                    background: colors.card,
                    color: colors.accent,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 10,
                    padding: "12px 20px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <FaSync size={14} /> Refresh
                </motion.button>

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
                    padding: "12px 20px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: colors.buttonShadow,
                  }}
                >
                  <FaPlus size={14} /> Add Attendance
                </motion.button>
              </div>
            </div>
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
                <FaUserGraduate size={24} color={colors.accent} />
              </motion.div>
              <p style={{ margin: 0 }}>Loading attendance records...</p>
            </div>
          ) : filtered.length === 0 ? (
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
              No attendance records found matching your criteria.
            </div>
          ) : (
            filtered.map((rec, index) => renderAttendanceCard(rec, index))
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
            ref={tableRef}
          >
            <table
              style={{
                width: "100%",
                minWidth: 700,
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <FaCalendarAlt
                        size={14}
                        style={{ color: colors.accent }}
                      />
                      Date
                    </div>
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <FaSchool size={14} style={{ color: colors.accent }} />
                      Class
                    </div>
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <FaUserGraduate
                        size={14}
                        style={{ color: colors.accent }}
                      />
                      Student
                    </div>
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
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
                      colSpan={5}
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
                        <FaUserGraduate size={16} color={colors.accent} />
                      </motion.div>
                      Loading attendance records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: 32,
                        color: colors.textSecondary,
                      }}
                    >
                      No attendance records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((rec, index) => (
                    <motion.tr
                      key={rec.id}
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
                          color: colors.text,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontWeight: 500,
                          }}
                        >
                          <FaCalendarAlt
                            size={14}
                            style={{ color: colors.accent }}
                          />
                          {rec.date}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: 14,
                          whiteSpace: "nowrap",
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
                          {rec.class}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: 14,
                          fontWeight: 500,
                          color: colors.text,
                        }}
                      >
                        {getStudentName(rec.studentId)}
                      </td>
                      <td
                        style={{
                          padding: 14,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {rec.status === "present" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              background: `${colors.status.present}15`,
                              color: colors.status.present,
                              padding: "4px 10px",
                              borderRadius: 6,
                              fontWeight: 600,
                              fontSize: 13,
                              width: "fit-content",
                            }}
                          >
                            <FaCheckCircle size={14} />
                            Present
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              background: `${colors.status.absent}15`,
                              color: colors.status.absent,
                              padding: "4px 10px",
                              borderRadius: 6,
                              fontWeight: 600,
                              fontSize: 13,
                              width: "fit-content",
                            }}
                          >
                            <FaTimesCircle size={14} />
                            Absent
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: 14,
                          textAlign: "center",
                        }}
                      >
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
                            onClick={() => handleEdit(rec)}
                            style={{
                              background: colors.warning,
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontWeight: 500,
                              fontSize: 14,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <FaEdit size={14} /> Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(rec.id)}
                            style={{
                              background: colors.danger,
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontWeight: 500,
                              fontSize: 14,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <FaTrash size={14} /> Delete
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

      {/* Add/Edit Modal - Improved for Small Screens */}
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
                maxWidth: isMobile ? "100%" : 500,
                maxHeight: isSmallMobile ? "92vh" : isMobile ? "85vh" : "90vh",
                overflowY: "auto",
                padding: 0,
                borderRadius: isMobile ? "16px 16px 0 0" : 16,
                position: "relative",
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
                  gap: isSmallMobile ? 16 : 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: isMobile ? 4 : 8,
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
                    <FaUserGraduate style={{ color: colors.accent }} />
                    {editId ? "Edit Attendance" : "Add Attendance"}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setShowForm(false)}
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
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isSmallMobile ? 12 : 16,
                  }}
                >
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
                      <FaCalendarAlt
                        size={14}
                        style={{ color: colors.accent }}
                      />
                      Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, date: e.target.value }))
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
                      <FaSchool size={14} style={{ color: colors.accent }} />
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
                      {classOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 6 : 10,
                      gridColumn: isMobile ? "auto" : "span 2",
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
                      Student *
                    </label>
                    <select
                      required
                      value={form.studentId}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, studentId: e.target.value }))
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
                      <option value="">Select Student</option>
                      {students
                        .filter((s) => !form.class || s.class === form.class)
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {(s.firstName || "") + " " + (s.lastName || "")}
                          </option>
                        ))}
                    </select>
                    {form.class &&
                      students.filter((s) => s.class === form.class).length ===
                        0 && (
                        <div
                          style={{
                            fontSize: 13,
                            color: colors.textSecondary,
                            marginTop: 4,
                            padding: "8px 12px",
                            background:
                              theme === "dark"
                                ? "rgba(59, 130, 246, 0.1)"
                                : "rgba(79, 70, 229, 0.1)",
                            borderRadius: 6,
                          }}
                        >
                          No students found in this class
                        </div>
                      )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 6 : 10,
                      gridColumn: isMobile ? "auto" : "span 2",
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
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        marginTop: 4,
                      }}
                    >
                      {statusOptions.map((s) => (
                        <label
                          key={s}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            cursor: "pointer",
                            padding: isSmallMobile ? "8px 12px" : "10px 16px",
                            borderRadius: 8,
                            border: `1px solid ${
                              form.status === s
                                ? s === "present"
                                  ? colors.success
                                  : colors.danger
                                : colors.border
                            }`,
                            background:
                              form.status === s
                                ? s === "present"
                                  ? `${colors.success}15`
                                  : `${colors.danger}15`
                                : "transparent",
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          <input
                            type="radio"
                            value={s}
                            checked={form.status === s}
                            onChange={() =>
                              setForm((f) => ({ ...f, status: s }))
                            }
                            style={{ display: "none" }}
                          />
                          {s === "present" ? (
                            <FaCheckCircle size={18} color={colors.success} />
                          ) : (
                            <FaTimesCircle size={18} color={colors.danger} />
                          )}
                          <span
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 500,
                              color:
                                form.status === s
                                  ? s === "present"
                                    ? colors.success
                                    : colors.danger
                                  : colors.text,
                            }}
                          >
                            {s}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: isSmallMobile ? 8 : 16,
                    marginTop: isSmallMobile ? 8 : 16,
                    justifyContent: "flex-end",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      background: "transparent",
                      color: colors.accent,
                      border: `1px solid ${colors.accent}`,
                      borderRadius: 10,
                      padding: isSmallMobile ? "10px 16px" : "12px 24px",
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
                      padding: isSmallMobile ? "10px 16px" : "12px 32px",
                      fontWeight: 600,
                      fontSize: isSmallMobile ? 14 : 15,
                      cursor: "pointer",
                      boxShadow: colors.buttonShadow,
                      minWidth: isMobile ? "100%" : 120,
                      order: isMobile ? 1 : 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {editId ? "Update" : "Add Record"}
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

export default AttendanceDashboard;

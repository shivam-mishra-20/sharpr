import React, { useState, useEffect } from "react";
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
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaSync,
  FaFilter,
  FaTimes,
  FaBars,
  FaUserGraduate,
  FaBook,
  FaCalendarAlt,
  FaCheckCircle,
  FaTrophy,
  FaCertificate,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

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

const AdminTestResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    studentId: "",
    subject: "",
    testType: "",
    testDate: "",
    marksObtained: "",
    totalMarks: "",
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    subject: "",
    testType: "",
    date: "",
    studentId: "",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get window size for responsive design
  const { width } = useWindowSize();
  const isSmallMobile = width <= 480; // Extra small screens
  const isMobile = width <= 768;
  const isTablet = width <= 1024 && width > 768;

  // Fetch students and test results
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
      // Test Results
      const resultsSnap = await getDocs(collection(db, "testResults"));
      const resultsArr = resultsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestResults(resultsArr);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Handlers
  const handleOpenForm = (result = null) => {
    if (result) {
      setEditId(result.id);
      setForm({
        studentId: result.studentId || "",
        subject: result.subject || "",
        testType: result.testType || "",
        testDate: result.testDate || "",
        marksObtained: result.marksObtained || "",
        totalMarks: result.totalMarks || "",
      });
    } else {
      setEditId(null);
      setForm({
        studentId: "",
        subject: "",
        testType: "",
        testDate: "",
        marksObtained: "",
        totalMarks: "",
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({
      studentId: "",
      subject: "",
      testType: "",
      testDate: "",
      marksObtained: "",
      totalMarks: "",
    });
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = students.find((s) => s.id === form.studentId);
    const payload = {
      ...form,
      studentName: student
        ? `${student.firstName || ""} ${student.lastName || ""}`.trim()
        : "",
      marksObtained: form.marksObtained,
      totalMarks: form.totalMarks,
    };
    try {
      if (editId) {
        await updateDoc(doc(db, "testResults", editId), payload);
      } else {
        await addDoc(collection(db, "testResults"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      await fetchData();
      handleCloseForm();
    } catch (err) {
      alert("Error saving test result: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this test result?")) return;
    try {
      await deleteDoc(doc(db, "testResults", id));
      await fetchData();
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  // Search & Filter
  const filteredResults = testResults.filter((tr) => {
    const student = students.find((s) => s.id === tr.studentId);
    const studentName = student
      ? `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase()
      : "";
    const matchesSearch =
      !search ||
      studentName.includes(search.toLowerCase()) ||
      (tr.subject || "").toLowerCase().includes(search.toLowerCase()) ||
      (tr.testType || "").toLowerCase().includes(search.toLowerCase());
    const matchesSubject = !filter.subject || tr.subject === filter.subject;
    const matchesType = !filter.testType || tr.testType === filter.testType;
    const matchesDate = !filter.date || tr.testDate === filter.date;
    const matchesStudent =
      !filter.studentId || tr.studentId === filter.studentId;
    return (
      matchesSearch &&
      matchesSubject &&
      matchesType &&
      matchesDate &&
      matchesStudent
    );
  });

  // Unique filter options
  const subjectOptions = [
    ...new Set(testResults.map((tr) => tr.subject).filter(Boolean)),
  ];
  const testTypeOptions = [
    ...new Set(testResults.map((tr) => tr.testType).filter(Boolean)),
  ];

  const { theme } = useTheme();

  // Theme-aware colors
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

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  // Toggle sidebar function (to be connected to parent component)
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // You'll need to communicate this state to a parent component
  };

  // Render test result card for mobile view
  const renderResultCard = (result, index) => {
    const student = students.find((s) => s.id === result.studentId);
    const studentName = student
      ? `${student.firstName || ""} ${student.lastName || ""}`
      : result.studentName || "";

    // Calculate percentage
    const percentage = result.totalMarks
      ? Math.round((result.marksObtained / result.totalMarks) * 100)
      : 0;

    // Determine performance level
    let performanceColor = colors.success;
    if (percentage < 40) performanceColor = colors.danger;
    else if (percentage < 70) performanceColor = colors.warning;

    return (
      <motion.div
        key={result.id}
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FaUserGraduate
                size={14}
                style={{ color: colors.accent, flexShrink: 0 }}
              />
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.text,
                }}
              >
                {studentName}
              </h3>
            </div>

            <div
              style={{
                marginTop: 6,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FaBook size={12} style={{ color: colors.textSecondary }} />
                <span style={{ fontSize: 13, color: colors.textSecondary }}>
                  {result.subject} - {result.testType}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FaCalendarAlt
                  size={12}
                  style={{ color: colors.textSecondary }}
                />
                <span style={{ fontSize: 13, color: colors.textSecondary }}>
                  {result.testDate || "No date"}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              minWidth: 80,
            }}
          >
            <div
              style={{
                height: 60,
                width: 60,
                borderRadius: "50%",
                backgroundColor: `${performanceColor}15`,
                border: `2px solid ${performanceColor}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: performanceColor,
                }}
              >
                {percentage}%
              </div>
              <FaCertificate
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  color: performanceColor,
                }}
                size={16}
              />
            </div>
            <div style={{ fontWeight: 600, color: colors.text, fontSize: 14 }}>
              {result.marksObtained}/{result.totalMarks}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 12,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenForm(result)}
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
            onClick={() => handleDelete(result.id)}
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
            Test Results
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
              marginBottom: 16,
              color: colors.text,
              letterSpacing: "-0.02em",
            }}
          >
            Test Results Management
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
            Track, manage, and analyze student test performance across all
            subjects.
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
              isSmallMobile ? "Search..." : "Search by student, subject..."
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
              onClick={() => handleOpenForm()}
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
              <FaPlus size={14} /> Add Result
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
              marginTop: 8,
              marginBottom: 4,
            }}
          >
            <select
              value={filter.subject}
              onChange={(e) =>
                setFilter((f) => ({ ...f, subject: e.target.value }))
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
              <option value="">All Subjects</option>
              {subjectOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={filter.testType}
              onChange={(e) =>
                setFilter((f) => ({ ...f, testType: e.target.value }))
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
              <option value="">All Test Types</option>
              {testTypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={filter.studentId}
              onChange={(e) =>
                setFilter((f) => ({ ...f, studentId: e.target.value }))
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
              <option value="">All Students</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {(s.firstName || "") + " " + (s.lastName || "")}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filter.date}
              onChange={(e) =>
                setFilter((f) => ({ ...f, date: e.target.value }))
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
            />

            {(filter.subject ||
              filter.testType ||
              filter.date ||
              filter.studentId ||
              search) && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  setFilter({
                    subject: "",
                    testType: "",
                    date: "",
                    studentId: "",
                  });
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
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleOpenForm()}
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
                width: "fit-content",
              }}
            >
              <FaPlus size={14} /> Add Test Result
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
                padding: "12px 20px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                minWidth: "fit-content",
              }}
            >
              <FaSync size={14} /> Refresh
            </motion.button>
          </>
        )}
      </motion.div>
      {/* Desktop Filters */}
      {!isMobile && (
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            gap: isTablet ? 12 : 16,
            marginBottom: 24,
            flexWrap: "wrap",
            alignItems: "center",
            background: colors.tableHeader,
            padding: 16,
            borderRadius: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FaFilter size={14} style={{ color: colors.textSecondary }} />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: colors.textSecondary,
              }}
            >
              Filters:
            </span>
          </div>

          <select
            value={filter.subject}
            onChange={(e) =>
              setFilter((f) => ({ ...f, subject: e.target.value }))
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
            <option value="">All Subjects</option>
            {subjectOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filter.testType}
            onChange={(e) =>
              setFilter((f) => ({ ...f, testType: e.target.value }))
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
            <option value="">All Test Types</option>
            {testTypeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={filter.studentId}
            onChange={(e) =>
              setFilter((f) => ({ ...f, studentId: e.target.value }))
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
            <option value="">All Students</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {(s.firstName || "") + " " + (s.lastName || "")}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter((f) => ({ ...f, date: e.target.value }))}
            style={{
              padding: 10,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              background: colors.card,
              color: colors.text,
              fontSize: 14,
            }}
          />

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() =>
              setFilter({ subject: "", testType: "", date: "", studentId: "" })
            }
            style={{
              background: colors.card,
              color: colors.textSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: "10px 16px",
              fontWeight: 500,
              fontSize: 14,
              cursor: "pointer",
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FaTimes size={12} /> Clear Filters
          </motion.button>
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
                <FaTrophy size={24} color={colors.accent} />
              </motion.div>
              <p style={{ margin: 0 }}>Loading test results...</p>
            </div>
          ) : filteredResults.length === 0 ? (
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
              No test results found matching your criteria.
            </div>
          ) : (
            filteredResults.map((result, index) =>
              renderResultCard(result, index)
            )
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
          <div style={{ overflowX: "none", width: "80%" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 15,
                color: colors.text,
              }}
            >
              <thead
                style={{
                  background: colors.tableHeader,
                  border: `1px solid ${colors.tableBorder}`,
                }}
              >
                <tr>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Student
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Subject
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Test Type
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Test Date
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Marks</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Total</th>
                  <th style={{ padding: "16px", textAlign: "center" }}>
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
                        <FaSync size={16} color={colors.textSecondary} />
                      </motion.div>
                      Loading results...
                    </td>
                  </tr>
                ) : filteredResults.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: colors.textSecondary,
                      }}
                    >
                      No test results found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((tr, index) => {
                    const student = students.find((s) => s.id === tr.studentId);
                    return (
                      <motion.tr
                        key={tr.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          borderBottom: `1px solid ${colors.tableBorder}`,
                          backgroundColor:
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
                        <td style={{ padding: "14px 16px", fontWeight: 500 }}>
                          {student
                            ? `${student.firstName || ""} ${
                                student.lastName || ""
                              }`
                            : tr.studentName || ""}
                        </td>
                        <td style={{ padding: "14px 16px" }}>{tr.subject}</td>
                        <td style={{ padding: "14px 16px" }}>{tr.testType}</td>
                        <td style={{ padding: "14px 16px" }}>{tr.testDate}</td>
                        <td
                          style={{
                            padding: "14px 16px",
                            fontWeight: 600,
                          }}
                        >
                          {tr.marksObtained}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {tr.totalMarks}
                        </td>
                        <td
                          style={{ padding: "14px 16px", textAlign: "center" }}
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
                              onClick={() => handleOpenForm(tr)}
                              style={{
                                background: colors.warning,
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                padding: "8px 12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 14,
                                fontWeight: 500,
                              }}
                            >
                              <FaEdit size={14} /> Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(tr.id)}
                              style={{
                                background: colors.danger,
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                padding: "8px 12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 14,
                                fontWeight: 500,
                              }}
                            >
                              <FaTrash size={14} /> Delete
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Modal Form - Responsive */}
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
              width: "95vw",
              height: "100vh",
              background: "rgba(0,0,0,0.6)",
              zIndex: 1000,
              display: "flex",
              alignItems: isMobile ? "flex-end" : "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
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
                borderRadius: isMobile ? "20px 20px 0 0" : 20,
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                background: colors.card,
              }}
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  padding: isSmallMobile
                    ? "20px 16px"
                    : isMobile
                    ? "24px 20px"
                    : "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: isSmallMobile ? 16 : 18,
                  width: "90%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                    borderBottom: `1px solid ${colors.border}`,
                    paddingBottom: isSmallMobile ? 12 : 16,
                    gap: 2, // Reduce gap between title and close button
                  }}
                >
                  <h2
                    style={{
                      fontSize: isSmallMobile ? 18 : isMobile ? 20 : 24,
                      fontWeight: 700,
                      margin: 0,
                      color: colors.text,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <FaTrophy style={{ color: colors.accent }} />
                    {editId ? "Edit Test Result" : "Add Test Result"}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleCloseForm}
                    style={{
                      background:
                        theme === "dark"
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.05)",
                      border: "none",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: colors.text,
                      fontSize: 20,
                      marginLeft: "auto", // Push button to the right
                      flexShrink: 0, // Prevent button from shrinking
                    }}
                    aria-label="Close"
                  >
                    ×
                  </motion.button>
                </div>

                {/* Student Selection Field */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isSmallMobile ? 8 : 10,
                    width: "100%",
                  }}
                >
                  <label
                    htmlFor="studentId"
                    style={{
                      fontWeight: 600,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      width: "100px",
                    }}
                  >
                    <FaUserGraduate
                      size={14}
                      style={{ color: colors.accent }}
                    />
                    Student *
                  </label>
                  <select
                    id="studentId"
                    required
                    name="studentId"
                    value={form.studentId}
                    onChange={handleFormChange}
                    style={{
                      padding: isSmallMobile ? "12px 14px" : "14px 16px",
                      borderRadius: 10,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: isSmallMobile ? 15 : 16,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
                        theme === "dark" ? "%2394a3b8" : "%2364748b"
                      }' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      backgroundSize: "16px",
                      paddingRight: "40px",
                    }}
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {(s.firstName || "") + " " + (s.lastName || "")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject and Test Type Section */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isSmallMobile ? 28 : isMobile ? 28 : 45,
                    justifyContent: "space-between",
                    width: "98%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 8 : 10,
                      maxWidth: "100%",
                    }}
                  >
                    <label
                      htmlFor="subject"
                      style={{
                        fontWeight: 600,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                        width: "fit-content",
                      }}
                    >
                      <FaBook size={14} style={{ color: colors.accent }} />
                      Subject *
                    </label>
                    <input
                      id="subject"
                      required
                      name="subject"
                      value={form.subject}
                      onChange={handleFormChange}
                      style={{
                        padding: isSmallMobile ? "12px 14px" : "14px 16px",
                        borderRadius: 10,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 15 : 16,
                        width: "100%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                      placeholder="e.g. Mathematics"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 8 : 10,

                      width: "90%",
                    }}
                  >
                    <label
                      htmlFor="testType"
                      style={{
                        fontWeight: 600,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                        width: "fit-content",
                      }}
                    >
                      <FaCheckCircle
                        size={14}
                        style={{ color: colors.accent }}
                      />
                      Test Type *
                    </label>
                    <input
                      id="testType"
                      required
                      name="testType"
                      value={form.testType}
                      onChange={handleFormChange}
                      style={{
                        padding: isSmallMobile ? "12px 14px" : "14px 16px",
                        borderRadius: 10,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 15 : 16,
                        width: "100%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                      placeholder="e.g. Midterm"
                    />
                  </div>
                </div>

                {/* Test Date Field */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isSmallMobile ? 8 : 10,
                    width: "94%",
                  }}
                >
                  <label
                    htmlFor="testDate"
                    style={{
                      fontWeight: 600,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      width: "fit-content",
                    }}
                  >
                    <FaCalendarAlt size={14} style={{ color: colors.accent }} />
                    Test Date *
                  </label>
                  <input
                    id="testDate"
                    required
                    type="date"
                    name="testDate"
                    value={form.testDate}
                    onChange={handleFormChange}
                    style={{
                      padding: isSmallMobile ? "12px 14px" : "14px 16px",
                      borderRadius: 10,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: isSmallMobile ? 15 : 16,
                      width: "100%",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                  />
                </div>

                {/* Marks Section */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isSmallMobile ? 22 : isMobile ? 24 : 45,
                    justifyContent: "space-between",
                    width: "94%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 8 : 10,
                      maxWidth: "100%",
                    }}
                  >
                    <label
                      htmlFor="marksObtained"
                      style={{
                        fontWeight: 600,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                        width: "fit-content",
                      }}
                    >
                      <FaTrophy size={14} style={{ color: colors.accent }} />
                      Marks Obtained *
                    </label>
                    <input
                      id="marksObtained"
                      required
                      type="number"
                      name="marksObtained"
                      value={form.marksObtained}
                      onChange={handleFormChange}
                      style={{
                        padding: isSmallMobile ? "12px 14px" : "14px 16px",
                        borderRadius: 10,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 15 : 16,
                        width: "100%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                      placeholder="e.g. 85"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 8 : 10,
                      maxWidth: "100%",
                    }}
                  >
                    <label
                      htmlFor="totalMarks"
                      style={{
                        fontWeight: 600,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                        width: "fit-content",
                      }}
                    >
                      <FaCertificate
                        size={14}
                        style={{ color: colors.accent }}
                      />
                      Total Marks *
                    </label>
                    <input
                      id="totalMarks"
                      required
                      type="number"
                      name="totalMarks"
                      value={form.totalMarks}
                      onChange={handleFormChange}
                      style={{
                        padding: isSmallMobile ? "12px 14px" : "14px 16px",
                        borderRadius: 10,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 15 : 16,
                        width: "100%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: isSmallMobile ? 10 : 16,
                    marginTop: isSmallMobile ? 8 : isMobile ? 12 : 16,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flexDirection: isMobile ? "column-reverse" : "row",
                    borderTop: `1px solid ${colors.border}`,
                    paddingTop: isSmallMobile ? 16 : 20,
                    width: "90%",
                  }}
                >
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    type="button"
                    onClick={handleCloseForm}
                    style={{
                      background:
                        theme === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)",
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      padding: isSmallMobile ? "12px 20px" : "14px 28px",
                      fontWeight: 600,
                      fontSize: isSmallMobile ? 15 : 16,
                      cursor: "pointer",
                      minWidth: isMobile ? "100%" : 120,
                      flex: isMobile ? "unset" : 1,
                      maxWidth: isMobile ? "unset" : 180,
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
                      borderRadius: 12,
                      padding: isSmallMobile ? "12px 20px" : "14px 28px",
                      fontWeight: 600,
                      fontSize: isSmallMobile ? 15 : 16,
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                      minWidth: isMobile ? "100%" : 140,
                      flex: isMobile ? "unset" : 1,
                      maxWidth: isMobile ? "unset" : 220,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    {editId ? (
                      <>
                        <FaEdit size={16} /> Update Result
                      </>
                    ) : (
                      <>
                        <FaPlus size={16} /> Add Result
                      </>
                    )}
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

export default AdminTestResults;

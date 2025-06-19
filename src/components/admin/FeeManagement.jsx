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
  FaMoneyBill,
  FaSearch,
  FaTimes,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaCalendarAlt,
  FaUserGraduate,
  FaCreditCard,
  FaBars,
  FaListAlt,
} from "react-icons/fa";

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

const AdminFeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editFeeId, setEditFeeId] = useState(null);
  const [form, setForm] = useState({
    studentId: "",
    feeType: "",
    amount: "",
    dueDate: "",
    status: "",
    paymentDate: "",
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    class: "",
    status: "",
    feeType: "",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get window size for responsive design
  const { width } = useWindowSize();
  const isSmallMobile = width <= 480; // Extra small screens
  const isMobile = width <= 768;
  const isTablet = width <= 1024 && width > 768;

  const feeTypeOptions = ["Tuition", "Books", "Uniform", "Other"];
  const feeStatusOptions = ["pending", "paid", "partial"];
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

  // Fetch fees and students
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [feesSnap, studentsSnap] = await Promise.all([
        getDocs(collection(db, "fees")),
        getDocs(collection(db, "students")),
      ]);
      const studentsArr = studentsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setStudents(studentsArr);
      setFees(
        feesSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
      setLoading(false);
    };
    fetchData();
  }, []);

  // Helpers
  const getStudentName = (id) => {
    const s = students.find((x) => x.id === id);
    return s ? `${s.firstName || ""} ${s.lastName || ""}` : "";
  };
  const getStudentClass = (id) => {
    const s = students.find((x) => x.id === id);
    return s ? s.class : "";
  };

  // CRUD Handlers
  const openAddModal = () => {
    setModalMode("add");
    setForm({
      studentId: "",
      feeType: "",
      amount: "",
      dueDate: "",
      status: "",
      paymentDate: "",
    });
    setShowModal(true);
    setEditFeeId(null);
  };
  const openEditModal = (fee) => {
    setModalMode("edit");
    setForm({
      studentId: fee.studentId || "",
      feeType: fee.feeType || "",
      amount: fee.amount || "",
      dueDate: fee.dueDate || "",
      status: fee.status || "",
      paymentDate: fee.paymentDate || "",
    });
    setEditFeeId(fee.id);
    setShowModal(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Delete this fee record?")) {
      await deleteDoc(doc(db, "fees", id));
      setFees((prev) => prev.filter((f) => f.id !== id));
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        const docRef = await addDoc(collection(db, "fees"), {
          ...form,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setFees((prev) => [
          ...prev,
          {
            ...form,
            id: docRef.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      } else if (modalMode === "edit" && editFeeId) {
        await updateDoc(doc(db, "fees", editFeeId), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        setFees((prev) =>
          prev.map((f) =>
            f.id === editFeeId ? { ...f, ...form, updatedAt: new Date() } : f
          )
        );
      }
      setShowModal(false);
      setEditFeeId(null);
    } catch (error) {
      console.error("Error saving fee: ", error);
      alert("Failed to save fee record");
    }
  };

  // Search & Filter
  const filteredFees = fees.filter((f) => {
    const studentName = getStudentName(f.studentId).toLowerCase();
    const matchesSearch =
      !search ||
      studentName.includes(search.toLowerCase()) ||
      (f.feeType || "").toLowerCase().includes(search.toLowerCase());
    const matchesClass =
      !filter.class || getStudentClass(f.studentId) === filter.class;
    const matchesStatus = !filter.status || f.status === filter.status;
    const matchesFeeType = !filter.feeType || f.feeType === filter.feeType;
    return matchesSearch && matchesClass && matchesStatus && matchesFeeType;
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
    status: {
      pending: theme === "dark" ? "#f59e0b" : "#f59e0b",
      paid: theme === "dark" ? "#10b981" : "#10b981",
      partial: theme === "dark" ? "#3b82f6" : "#3b82f6",
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

  // Render fee card for mobile view
  const renderFeeCard = (fee, index) => {
    return (
      <motion.div
        key={fee.id}
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
          <div>
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
                {getStudentName(fee.studentId)}
              </h3>
            </div>
            <div
              style={{
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
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
                {getStudentClass(fee.studentId)}
              </span>
              <span
                style={{
                  background: fee.status
                    ? `${colors.status[fee.status]}15`
                    : colors.accentLight,
                  color: fee.status ? colors.status[fee.status] : colors.accent,
                  padding: "3px 6px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: fee.status
                      ? colors.status[fee.status]
                      : colors.accent,
                  }}
                ></div>
                {fee.status}
              </span>
            </div>
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 18,
              color: colors.text,
            }}
          >
            ₹{fee.amount}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 12,
            fontSize: 13,
            color: colors.textSecondary,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              minWidth: "45%",
            }}
          >
            <FaListAlt size={12} />
            {fee.feeType}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              minWidth: "45%",
            }}
          >
            <FaCalendarAlt size={12} color={colors.warning} />
            Due: {fee.dueDate}
          </div>
          {fee.paymentDate && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                minWidth: "45%",
              }}
            >
              <FaCreditCard size={12} color={colors.success} />
              Paid: {fee.paymentDate}
            </div>
          )}
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
            onClick={() => openEditModal(fee)}
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
            onClick={() => handleDelete(fee.id)}
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
            Fee Management
          </h1>
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
              <FaMoneyBill size={28} style={{ color: colors.accent }} />
            </motion.div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: colors.text,
                margin: 0,
              }}
            >
              Fee Management
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
            Manage student fees here. Add, edit, delete, search, and filter fee
            records.
          </motion.p>
        </>
      )}

      {/* Search & Add Button - Responsive Row */}
      <motion.div
        variants={itemVariants}
        style={{
          display: "flex",
          gap: isSmallMobile ? 8 : isMobile ? 12 : 16,
          marginBottom: isSmallMobile ? 12 : 20,
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
            placeholder={
              isSmallMobile ? "Search..." : "Search by student or fee type"
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

        {/* Mobile - Filter Toggle Button */}
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
              <FaFilter size={14} />{" "}
              {showFilters ? "Hide Filters" : "Show Filters"}
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={openAddModal}
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
              <FaPlus size={14} /> Add Fee
            </motion.button>
          </div>
        )}

        {/* Collapsible Filters for Mobile */}
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
            }}
          >
            <select
              value={filter.class}
              onChange={(e) =>
                setFilter((f) => ({ ...f, class: e.target.value }))
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
              <option value="">All Classes</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
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
              {feeStatusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filter.feeType}
              onChange={(e) =>
                setFilter((f) => ({ ...f, feeType: e.target.value }))
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
              <option value="">All Fee Types</option>
              {feeTypeOptions.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </select>
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
                value={filter.class}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, class: e.target.value }))
                }
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
                  minWidth: 140,
                }}
              >
                <option value="">All Status</option>
                {feeStatusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={filter.feeType}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, feeType: e.target.value }))
                }
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
                <option value="">All Fee Types</option>
                {feeTypeOptions.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={openAddModal}
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
              <FaPlus size={14} /> Add Fee Record
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
                <FaMoneyBill size={24} color={colors.accent} />
              </motion.div>
              <p style={{ margin: 0 }}>Loading fee records...</p>
            </div>
          ) : filteredFees.length === 0 ? (
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
              No fee records found matching your criteria.
            </div>
          ) : (
            filteredFees.map((fee, index) => renderFeeCard(fee, index))
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
                    Student
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
                    Fee Type
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
                    Amount
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
                    Payment Date
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
                      colSpan={8}
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
                        <FaMoneyBill size={16} color={colors.accent} />
                      </motion.div>
                      Loading fee records...
                    </td>
                  </tr>
                ) : filteredFees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: 32,
                        color: colors.textSecondary,
                      }}
                    >
                      No fee records found. Create your first record using the
                      "Add Fee Record" button.
                    </td>
                  </tr>
                ) : (
                  filteredFees.map((fee, index) => (
                    <motion.tr
                      key={fee.id}
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
                          fontWeight: 500,
                          color: colors.text,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <FaUserGraduate
                            size={14}
                            style={{ color: colors.accent }}
                          />
                          {getStudentName(fee.studentId)}
                        </div>
                      </td>
                      <td style={{ padding: 14, color: colors.text }}>
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
                          {getStudentClass(fee.studentId)}
                        </span>
                      </td>
                      <td style={{ padding: 14, color: colors.text }}>
                        {fee.feeType}
                      </td>
                      <td
                        style={{
                          padding: 14,
                          fontWeight: 600,
                          color: colors.text,
                        }}
                      >
                        ₹{fee.amount}
                      </td>
                      <td style={{ padding: 14, color: colors.text }}>
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
                          {fee.dueDate}
                        </div>
                      </td>
                      <td style={{ padding: 14 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: fee.status
                              ? `${colors.status[fee.status]}15`
                              : colors.accentLight,
                            color: fee.status
                              ? colors.status[fee.status]
                              : colors.accent,
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontWeight: 600,
                            fontSize: 13,
                            textTransform: "capitalize",
                          }}
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: fee.status
                                ? colors.status[fee.status]
                                : colors.accent,
                            }}
                          ></div>
                          {fee.status}
                        </div>
                      </td>
                      <td style={{ padding: 14, color: colors.text }}>
                        {fee.paymentDate ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 14,
                            }}
                          >
                            <FaCreditCard
                              size={14}
                              style={{ color: colors.success }}
                            />
                            {fee.paymentDate}
                          </div>
                        ) : (
                          <span style={{ color: colors.textSecondary }}>-</span>
                        )}
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
                            onClick={() => openEditModal(fee)}
                            style={{
                              background: colors.warning,
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
                            <FaEdit size={12} /> Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(fee.id)}
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
                            <FaTrash size={12} /> Delete
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

      {/* Modal - Responsive */}
      <AnimatePresence>
        {showModal && (
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
                maxWidth: 580,
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
                    <FaMoneyBill style={{ color: colors.accent }} />
                    {modalMode === "add" ? "Add Fee Record" : "Edit Fee Record"}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setShowModal(false)}
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
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {(s.firstName || "") + " " + (s.lastName || "")}
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
                      <FaMoneyBill size={14} style={{ color: colors.accent }} />
                      Fee Type *
                    </label>
                    <select
                      required
                      value={form.feeType}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, feeType: e.target.value }))
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
                      <option value="">Select Fee Type</option>
                      {feeTypeOptions.map((ft) => (
                        <option key={ft} value={ft}>
                          {ft}
                        </option>
                      ))}
                    </select>
                  </div>
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
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                    >
                      Amount (₹) *
                    </label>
                    <input
                      required
                      type="number"
                      value={form.amount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, amount: e.target.value }))
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
                      placeholder="Enter fee amount"
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
                      <option value="">Select Status</option>
                      {feeStatusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
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
                      <FaCreditCard
                        size={14}
                        style={{ color: colors.success }}
                      />
                      Payment Date{" "}
                      {form.status === "pending" ? "(Optional)" : "*"}
                    </label>
                    <input
                      type="date"
                      required={
                        form.status === "paid" || form.status === "partial"
                      }
                      value={form.paymentDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, paymentDate: e.target.value }))
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
                    onClick={() => setShowModal(false)}
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
                      order: isMobile ? 1 : 2,
                    }}
                  >
                    {modalMode === "add" ? "Add Fee" : "Save Changes"}
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

export default AdminFeeManagement;

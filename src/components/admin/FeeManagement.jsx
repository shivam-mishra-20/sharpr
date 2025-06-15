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
} from "react-icons/fa";

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

  const feeTypeOptions = ["Tuition", "Transport", "Books", "Uniform", "Other"];
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 24,
        color: colors.text,
      }}
    >
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

      {/* Search & Filter */}
      <motion.div
        variants={itemVariants}
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 340,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: colors.card,
            borderRadius: 10,
            padding: "4px 16px",
            border: `1px solid ${colors.border}`,
          }}
        >
          <FaSearch style={{ color: colors.textSecondary }} />
          <input
            placeholder="Search by student or fee type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px 0",
              border: "none",
              width: "100%",
              fontSize: 15,
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
              }}
            >
              <FaTimes size={14} />
            </motion.button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            background: colors.tableHeader,
            padding: "8px 16px",
            borderRadius: 10,
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
      </motion.div>

      {/* Table */}
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
        <div style={{ overflowX: "auto", width: "100%" }}>
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
                  <td colSpan={8} style={{ textAlign: "center", padding: 32 }}>
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
                        index % 2 === 0 ? colors.tableRow : colors.tableRowAlt,
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

      {/* Modal */}
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
                maxHeight: "90vh",
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
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
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
                      fontSize: 22,
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

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 500,
                        color: colors.text,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 15,
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
                        padding: 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: 15,
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
                      minWidth: 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 500,
                        color: colors.text,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 15,
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
                        padding: 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: 15,
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

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 500,
                        color: colors.text,
                        fontSize: 15,
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
                        padding: 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: 15,
                        width: "100%",
                      }}
                      placeholder="Enter fee amount"
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 500,
                        color: colors.text,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 15,
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
                        padding: 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: 15,
                        width: "100%",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 500,
                        color: colors.text,
                        fontSize: 15,
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
                        padding: 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: 15,
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
                      minWidth: 200,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 500,
                        color: colors.text,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 15,
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
                        padding: 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: 15,
                        width: "100%",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    marginTop: 8,
                    justifyContent: "flex-end",
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
                      padding: "12px 24px",
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                      minWidth: 100,
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
                      padding: "12px 32px",
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                      boxShadow: colors.buttonShadow,
                      minWidth: 150,
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

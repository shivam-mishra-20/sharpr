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
} from "react-icons/fa";

const priorityOptions = ["High", "Medium", "Low"];
const audienceOptions = ["All", "Students", "Parents", "Teachers"];
const statusOptions = ["Active", "Inactive"];

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
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    priority: "",
    status: "",
    audience: "",
  });

  // Fetch notices from Firestore
  const fetchNotices = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "notices"));
    const arr = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setNotices(arr);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Add or update notice
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDoc(doc(db, "notices", editId), {
          ...form,
        });
      } else {
        await addDoc(collection(db, "notices"), {
          ...form,
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
    });
    setShowForm(true);
  };

  // Delete notice
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    await deleteDoc(doc(db, "notices", id));
    fetchNotices();
  };

  // Filter and search
  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.content?.toLowerCase().includes(search.toLowerCase());
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
        Send, manage, and update notices for students, parents, and teachers.
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
            type="text"
            placeholder="Search by title or content"
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
              minWidth: 140,
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
              minWidth: 140,
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
              minWidth: 140,
            }}
          >
            <option value="">All Audiences</option>
            {audienceOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => {
            setFilter({ priority: "", status: "", audience: "" });
            setSearch("");
          }}
          style={{
            padding: "10px 16px",
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
      </motion.div>

      {/* Notices Table */}
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
                  <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
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
                        <FaUsers size={12} />
                        {n.audience}
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

      {/* Notice Form Modal */}
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
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              style={{
                width: "100%",
                maxWidth: 540,
                maxHeight: "90vh",
                overflow: "auto",
                padding: 0,
                borderRadius: 16,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                background: colors.card,
              }}
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
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
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
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
                      padding: 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: 15,
                    }}
                    placeholder="Enter notice title"
                  />
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
                        padding: 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: 15,
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
                      <FaUsers size={14} style={{ color: colors.accent }} />
                      Audience *
                    </label>
                    <select
                      required
                      value={form.audience}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, audience: e.target.value }))
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
                      <option value="">Select Audience</option>
                      {audienceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <label
                    style={{
                      fontWeight: 500,
                      color: colors.text,
                      fontSize: 15,
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
                      padding: 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: 15,
                      minHeight: 100,
                      resize: "vertical",
                    }}
                    placeholder="Enter notice content"
                  />
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
                    gap: 16,
                    marginTop: 16,
                    justifyContent: "flex-end",
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
                      minWidth: 120,
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

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

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Notices Dashboard
      </h1>
      <div style={{ marginBottom: 18, color: "#64748b" }}>
        Send, manage, and update notices for students, parents, and teachers.
      </div>
      {/* Search & Filter */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}
      >
        <input
          type="text"
          placeholder="Search by title or content"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ddd",
            minWidth: 200,
          }}
        />
        <select
          value={filter.priority}
          onChange={(e) =>
            setFilter((f) => ({ ...f, priority: e.target.value }))
          }
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
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
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
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
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
        >
          <option value="">All Audiences</option>
          {audienceOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setFilter({ priority: "", status: "", audience: "" });
            setSearch("");
          }}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: "#f1f5f9",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
        <button
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
            padding: "8px 18px",
            borderRadius: 6,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Notice
        </button>
      </div>
      {/* Notices Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={{ padding: 12, textAlign: "left" }}>Title</th>
              <th style={{ padding: 12, textAlign: "left" }}>Priority</th>
              <th style={{ padding: 12, textAlign: "left" }}>Audience</th>
              <th style={{ padding: 12, textAlign: "left" }}>Status</th>
              <th style={{ padding: 12, textAlign: "left" }}>Expiry</th>
              <th style={{ padding: 12, textAlign: "left" }}>Content</th>
              <th style={{ padding: 12, textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 24 }}>
                  Loading...
                </td>
              </tr>
            ) : filteredNotices.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 24 }}>
                  No notices found.
                </td>
              </tr>
            ) : (
              filteredNotices.map((n) => (
                <tr key={n.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10, fontWeight: 600 }}>{n.title}</td>
                  <td style={{ padding: 10 }}>{n.priority}</td>
                  <td style={{ padding: 10 }}>{n.audience}</td>
                  <td style={{ padding: 10 }}>{n.status}</td>
                  <td style={{ padding: 10 }}>
                    {n.expiryDate ? n.expiryDate : "-"}
                  </td>
                  <td
                    style={{
                      padding: 10,
                      maxWidth: 220,
                      whiteSpace: "pre-line",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {n.content}
                  </td>
                  <td style={{ padding: 10 }}>
                    <button
                      onClick={() => handleEdit(n)}
                      style={{
                        marginRight: 8,
                        padding: "6px 12px",
                        borderRadius: 5,
                        border: "none",
                        background: "#818cf8",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 5,
                        border: "none",
                        background: "#ef4444",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Notice Form Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.2)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 14,
              minWidth: 380,
              boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 480,
              width: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                {editId ? "Edit Notice" : "Add Notice"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  cursor: "pointer",
                  color: "#888",
                  marginLeft: 8,
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Priority *</label>
                <select
                  required
                  value={form.priority}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priority: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
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
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Audience *</label>
                <select
                  required
                  value={form.audience}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, audience: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
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
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Content *</label>
              <textarea
                required
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  minHeight: 60,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Expiry Date</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiryDate: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Status *</label>
                <select
                  required
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
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
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="submit"
                style={{
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {editId ? "Update Notice" : "Add Notice"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                style={{
                  background: "#fff",
                  color: "#4f46e5",
                  border: "1px solid #4f46e5",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NoticesDashboard;

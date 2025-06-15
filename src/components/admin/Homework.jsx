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

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Homework Management
      </h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Assign, edit, search, and manage homework for all classes.
      </p>
      {/* Search & Filter */}
      <div
        style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}
      >
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ddd",
            minWidth: 220,
            flex: 1,
          }}
        />
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
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
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        >
          <option value="">All Subjects</option>
          {subjectOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            minWidth: 140,
          }}
        >
          + Assign Homework
        </button>
      </div>
      {/* Error */}
      {error && (
        <div style={{ color: "#ef4444", marginBottom: 16 }}>{error}</div>
      )}
      {/* Homework Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={{ padding: 14, textAlign: "left" }}>Title</th>
              <th style={{ padding: 14, textAlign: "left" }}>Subject</th>
              <th style={{ padding: 14, textAlign: "left" }}>Class</th>
              <th style={{ padding: 14, textAlign: "left" }}>Assigned Date</th>
              <th style={{ padding: 14, textAlign: "left" }}>Due Date</th>
              <th style={{ padding: 14, textAlign: "left" }}>Description</th>
              <th style={{ padding: 14, textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
                  Loading...
                </td>
              </tr>
            ) : filteredHomeworks.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
                  No homework found.
                </td>
              </tr>
            ) : (
              filteredHomeworks.map((hw) => (
                <tr key={hw.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{hw.title}</td>
                  <td style={{ padding: 12 }}>{hw.subject}</td>
                  <td style={{ padding: 12 }}>{hw.class}</td>
                  <td style={{ padding: 12 }}>
                    {hw.assignedDate ||
                      hw.createdAt?.toDate?.()?.toLocaleDateString?.() ||
                      ""}
                  </td>
                  <td style={{ padding: 12 }}>{hw.dueDate}</td>
                  <td
                    style={{
                      padding: 12,
                      maxWidth: 220,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {hw.description}
                  </td>
                  <td style={{ padding: 12, textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(hw)}
                      style={{
                        background: "#fbbf24",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 14px",
                        fontWeight: 500,
                        marginRight: 8,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hw.id)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 14px",
                        fontWeight: 500,
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
      {/* Homework Form Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleFormSubmit}
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 16,
              minWidth: 420,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 520,
              width: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
                {editId ? "Edit Homework" : "Assign Homework"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setForm(initialForm);
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
              <label style={{ fontWeight: 500 }}>Assignment Title *</label>
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
            <div style={{ display: "flex", gap: 16 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Subject *</label>
                <select
                  required
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
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
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Class *</label>
                <select
                  required
                  value={form.class}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, class: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
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
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Description *</label>
              <textarea
                required
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  minHeight: 64,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Assigned Date *</label>
                <input
                  required
                  type="date"
                  value={form.assignedDate}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      assignedDate: e.target.value,
                    }))
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
                <label style={{ fontWeight: 500 }}>Due Date *</label>
                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dueDate: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
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
                {editId ? "Update" : "Assign"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setForm(initialForm);
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

export default AdminHomework;

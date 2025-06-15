/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as XLSX from "xlsx";
import { FaFileExport } from "react-icons/fa";

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

const initialForm = {
  firstName: "",
  lastName: "",
  class: "",
  dob: "",
  email: "",
  parentName: "",
  parentContact: "",
  address: "",
  password: "", // Add password field
};

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [error, setError] = useState(null);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "students"));
      setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setError("Failed to fetch students");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Don't update password on edit
        const { password, ...formData } = form;
        await updateDoc(doc(db, "students", editId), {
          ...formData,
        });
      } else {
        let userUid = null;
        if (form.password && form.email) {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            form.email,
            form.password
          );
          userUid = userCredential.user.uid;
          // Create parent user doc with UID as doc ID
          await setDoc(doc(db, "users", userUid), {
            uid: userUid,
            name: form.firstName + " " + form.lastName,
            email: form.email,
            role: "parent",
            createdAt: serverTimestamp(),
          });
          // Create student doc with UID as doc ID
          const { password, ...formData } = form;
          await setDoc(doc(db, "students", userUid), {
            ...formData,
            authUid: userUid,
            createdAt: serverTimestamp(),
          });
        } else {
          // If no password, fallback to addDoc (not recommended for parent login)
          const { password, ...formData } = form;
          await addDoc(collection(db, "students"), {
            ...formData,
            authUid: null,
            createdAt: serverTimestamp(),
          });
        }
      }
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
      fetchStudents();
    } catch (err) {
      setError("Failed to save student");
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setForm({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      class: student.class || "",
      dob: student.dob || "",
      email: student.email || "",
      parentName: student.parentName || "",
      parentContact: student.parentContact || "",
      address: student.address || "",
      password: "", // Don't prefill password on edit
    });
    setEditId(student.id);
    setShowForm(true);
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteDoc(doc(db, "students", id));
      fetchStudents();
    } catch (err) {
      setError("Failed to delete student");
    }
  };

  // Export students to Excel
  const handleExport = async () => {
    try {
      const snap = await getDocs(collection(db, "students"));
      const arr = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Remove Firestore Timestamp objects for Excel export
      const cleanedArr = arr.map((s) => {
        const obj = { ...s };
        for (const k in obj) {
          if (obj[k]?.toDate) obj[k] = obj[k].toDate().toLocaleString();
        }
        return obj;
      });
      const worksheet = XLSX.utils.json_to_sheet(cleanedArr);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      XLSX.writeFile(workbook, "students.xlsx");
    } catch (err) {
      setError("Failed to export: " + err.message);
    }
  };

  // Filtered and searched students
  const filtered = students.filter((s) => {
    const matchesClass = filterClass ? s.class === filterClass : true;
    const matchesSearch = (s.firstName + " " + s.lastName + " " + s.email)
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Student Management
      </h1>
      <div
        style={{ marginBottom: 18, display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ddd",
            minWidth: 220,
          }}
        />
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ddd",
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
        <button
          onClick={() => {
            setShowForm(true);
            setForm(initialForm);
            setEditId(null);
          }}
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          + Add Student
        </button>
        <button
          onClick={handleExport}
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            color: "#4f46e5",
            border: "1px solid #4f46e5",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            gap: 8,
          }}
        >
          <FaFileExport style={{ marginRight: 6 }} />
          Export
        </button>
      </div>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            border: "1px solid #eee",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={{ padding: 12, textAlign: "left" }}>Name</th>
                <th style={{ padding: 12, textAlign: "left" }}>Class</th>
                <th style={{ padding: 12, textAlign: "left" }}>DOB</th>
                <th style={{ padding: 12, textAlign: "left" }}>Email</th>
                <th style={{ padding: 12, textAlign: "left" }}>Parent Name</th>
                <th style={{ padding: 12, textAlign: "left" }}>
                  Parent Contact
                </th>
                <th style={{ padding: 12, textAlign: "left" }}>Address</th>
                <th style={{ padding: 12, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 24 }}>
                    No students found.
                  </td>
                </tr>
              )}
              {filtered.map((s) => (
                <tr key={s.id} style={{ borderTop: "1px solid #f1f1f1" }}>
                  <td style={{ padding: 10 }}>
                    {(s.firstName || "") + " " + (s.lastName || "")}
                  </td>
                  <td style={{ padding: 10 }}>{s.class}</td>
                  <td style={{ padding: 10 }}>{s.dob}</td>
                  <td style={{ padding: 10 }}>{s.email}</td>
                  <td style={{ padding: 10 }}>{s.parentName}</td>
                  <td style={{ padding: 10 }}>{s.parentContact}</td>
                  <td style={{ padding: 10 }}>{s.address}</td>
                  <td style={{ padding: 10, textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(s)}
                      style={{
                        background: "#fbbf24",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        marginRight: 6,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
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
              borderRadius: 16,
              minWidth: 420,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
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
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                {editId ? "Edit Student" : "Add Student"}
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
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <label>First Name *</label>
                <input
                  required
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                  style={{
                    padding: 8,
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
                  gap: 4,
                }}
              >
                <label>Last Name *</label>
                <input
                  required
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <label>Class *</label>
                <select
                  required
                  value={form.class}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, class: e.target.value }))
                  }
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd",
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
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <label>Date of Birth *</label>
                <input
                  required
                  type="date"
                  value={form.dob}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dob: e.target.value }))
                  }
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label>Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                style={{
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
            </div>
            {/* Show password field only when adding */}
            {!editId && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label>Password (for parent login)</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                  placeholder="Set password for parent login"
                  autoComplete="new-password"
                />
                <span style={{ fontSize: 12, color: "#888" }}>
                  This password, along with the email, can be used to log in as
                  a parent.
                </span>
              </div>
            )}
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <label>Parent Name *</label>
                <input
                  required
                  value={form.parentName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, parentName: e.target.value }))
                  }
                  style={{
                    padding: 8,
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
                  gap: 4,
                }}
              >
                <label>Parent Contact *</label>
                <input
                  required
                  value={form.parentContact}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, parentContact: e.target.value }))
                  }
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label>Address</label>
              <textarea
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                style={{
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  minHeight: 40,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                type="submit"
                style={{
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 22px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {editId ? "Update" : "Add"}
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
                  padding: "8px 22px",
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

export default AdminStudents;

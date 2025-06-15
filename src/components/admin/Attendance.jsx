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
import { FaEdit, FaTrash, FaPlus, FaSync } from "react-icons/fa";

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

  // Fetch students and attendance
  const fetchData = async () => {
    setLoading(true);
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
    setLoading(false);
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
      await deleteDoc(doc(db, "attendance", id));
      fetchData();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.class || !form.studentId || !form.status) return;
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
    fetchData();
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

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Attendance Management
      </h1>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleAdd}
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FaPlus /> Add Attendance
        </button>
        <button
          onClick={fetchData}
          style={{
            background: "#fff",
            color: "#4f46e5",
            border: "1px solid #4f46e5",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FaSync /> Refresh
        </button>
        <input
          type="text"
          placeholder="Search by student name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            minWidth: 180,
          }}
        />
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
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
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        >
          <option value="">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {/* Attendance Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f3f4f6" }}>
            <tr>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                }}
              >
                Date
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                }}
              >
                Class
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                }}
              >
                Student
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((rec) => (
                <tr key={rec.id}>
                  <td style={{ padding: "10px 16px" }}>{rec.date}</td>
                  <td style={{ padding: "10px 16px" }}>{rec.class}</td>
                  <td style={{ padding: "10px 16px" }}>
                    {getStudentName(rec.studentId)}
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      textTransform: "capitalize",
                    }}
                  >
                    {rec.status}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <button
                      onClick={() => handleEdit(rec)}
                      style={{
                        background: "#fbbf24",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        marginRight: 8,
                        cursor: "pointer",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rec.id)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Modal */}
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
            onSubmit={handleFormSubmit}
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 16,
              minWidth: 340,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 420,
              width: "100%",
              position: "relative",
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                margin: 0,
              }}
            >
              {editId ? "Edit Attendance" : "Add Attendance"}
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <label>Date *</label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
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
                display: "flex",
                flexDirection: "column",
                gap: 6,
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
                  padding: 10,
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
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <label>Student *</label>
              <select
                required
                value={form.studentId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, studentId: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ddd",
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
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <label>Status *</label>
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
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 8,
              }}
            >
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
                {editId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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

export default AttendanceDashboard;

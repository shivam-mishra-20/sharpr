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
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync } from "react-icons/fa";

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

  // Fetch students and test results
  const fetchData = async () => {
    setLoading(true);
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
    setLoading(false);
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

  // Search and Filter
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

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Test Results Management
      </h1>
      <div
        style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}
      >
        <button
          onClick={() => handleOpenForm()}
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FaPlus /> Add Test Result
        </button>
        <button
          onClick={fetchData}
          style={{
            background: "#fff",
            color: "#4f46e5",
            border: "1px solid #4f46e5",
            borderRadius: 8,
            padding: "10px 18px",
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
        <div
          style={{
            flex: 1,
            minWidth: 220,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FaSearch style={{ color: "#888" }} />
          <input
            type="text"
            placeholder="Search by student, subject, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              width: "100%",
              fontSize: 15,
            }}
          />
        </div>
      </div>
      {/* Filters */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}
      >
        <select
          value={filter.subject}
          onChange={(e) =>
            setFilter((f) => ({ ...f, subject: e.target.value }))
          }
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
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
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
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
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
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
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <button
          onClick={() =>
            setFilter({ subject: "", testType: "", date: "", studentId: "" })
          }
          style={{
            background: "#eee",
            color: "#333",
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            fontWeight: 500,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Clear Filters
        </button>
      </div>
      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "auto",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}
        >
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>
                Student
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>
                Subject
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>
                Test Type
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>
                Test Date
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Marks</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Total</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
                  Loading...
                </td>
              </tr>
            ) : filteredResults.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
                  No test results found.
                </td>
              </tr>
            ) : (
              filteredResults.map((tr) => {
                const student = students.find((s) => s.id === tr.studentId);
                return (
                  <tr key={tr.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px 16px" }}>
                      {student
                        ? `${student.firstName || ""} ${student.lastName || ""}`
                        : tr.studentName || ""}
                    </td>
                    <td style={{ padding: "10px 16px" }}>{tr.subject}</td>
                    <td style={{ padding: "10px 16px" }}>{tr.testType}</td>
                    <td style={{ padding: "10px 16px" }}>{tr.testDate}</td>
                    <td style={{ padding: "10px 16px" }}>{tr.marksObtained}</td>
                    <td style={{ padding: "10px 16px" }}>{tr.totalMarks}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <button
                        onClick={() => handleOpenForm(tr)}
                        style={{
                          background: "#fbbf24",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 10px",
                          marginRight: 6,
                          cursor: "pointer",
                        }}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(tr.id)}
                        style={{
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 10px",
                          cursor: "pointer",
                        }}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Modal Form */}
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
              minWidth: 340,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 420,
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
                {editId ? "Edit Test Result" : "Add Test Result"}
              </h2>
              <button
                type="button"
                onClick={handleCloseForm}
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
              <label style={{ fontWeight: 500 }}>Student *</label>
              <select
                required
                name="studentId"
                value={form.studentId}
                onChange={handleFormChange}
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ddd",
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
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Subject *</label>
                <input
                  required
                  name="subject"
                  value={form.subject}
                  onChange={handleFormChange}
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
                <label style={{ fontWeight: 500 }}>Test Type *</label>
                <input
                  required
                  name="testType"
                  value={form.testType}
                  onChange={handleFormChange}
                  style={{
                    padding: 10,
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
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Test Date *</label>
                <input
                  required
                  type="date"
                  name="testDate"
                  value={form.testDate}
                  onChange={handleFormChange}
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
                <label style={{ fontWeight: 500 }}>Marks Obtained *</label>
                <input
                  required
                  type="number"
                  name="marksObtained"
                  value={form.marksObtained}
                  onChange={handleFormChange}
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
                <label style={{ fontWeight: 500 }}>Total Marks *</label>
                <input
                  required
                  type="number"
                  name="totalMarks"
                  value={form.totalMarks}
                  onChange={handleFormChange}
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
                {editId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={handleCloseForm}
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

export default AdminTestResults;

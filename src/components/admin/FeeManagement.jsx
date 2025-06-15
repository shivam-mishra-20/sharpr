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

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Fee Management
      </h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Manage student fees here. Add, edit, delete, search, and filter fee
        records.
      </p>
      {/* Search & Filter */}
      <div
        style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}
      >
        <input
          placeholder="Search by student or fee type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ddd",
            minWidth: 220,
          }}
        />
        <select
          value={filter.class}
          onChange={(e) => setFilter((f) => ({ ...f, class: e.target.value }))}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
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
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        >
          <option value="">All Status</option>
          {feeStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={filter.feeType}
          onChange={(e) =>
            setFilter((f) => ({ ...f, feeType: e.target.value }))
          }
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        >
          <option value="">All Fee Types</option>
          {feeTypeOptions.map((ft) => (
            <option key={ft} value={ft}>
              {ft}
            </option>
          ))}
        </select>
        <button
          onClick={openAddModal}
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          + Add Fee Record
        </button>
      </div>
      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: 14, textAlign: "left" }}>Student</th>
              <th style={{ padding: 14, textAlign: "left" }}>Class</th>
              <th style={{ padding: 14, textAlign: "left" }}>Fee Type</th>
              <th style={{ padding: 14, textAlign: "left" }}>Amount</th>
              <th style={{ padding: 14, textAlign: "left" }}>Due Date</th>
              <th style={{ padding: 14, textAlign: "left" }}>Status</th>
              <th style={{ padding: 14, textAlign: "left" }}>Payment Date</th>
              <th style={{ padding: 14, textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 32 }}>
                  Loading...
                </td>
              </tr>
            ) : filteredFees.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 32 }}>
                  No records found.
                </td>
              </tr>
            ) : (
              filteredFees.map((fee) => (
                <tr key={fee.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 12 }}>
                    {getStudentName(fee.studentId)}
                  </td>
                  <td style={{ padding: 12 }}>
                    {getStudentClass(fee.studentId)}
                  </td>
                  <td style={{ padding: 12 }}>{fee.feeType}</td>
                  <td style={{ padding: 12 }}>₹{fee.amount}</td>
                  <td style={{ padding: 12 }}>{fee.dueDate}</td>
                  <td style={{ padding: 12, textTransform: "capitalize" }}>
                    {fee.status}
                  </td>
                  <td style={{ padding: 12 }}>{fee.paymentDate || "-"}</td>
                  <td style={{ padding: 12 }}>
                    <button
                      onClick={() => openEditModal(fee)}
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
                      onClick={() => handleDelete(fee.id)}
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
      {/* Modal */}
      {showModal && (
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
                {modalMode === "add" ? "Add Fee Record" : "Edit Fee Record"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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
            <div style={{ display: "flex", gap: 16 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Student *</label>
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
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Fee Type *</label>
                <select
                  required
                  value={form.feeType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, feeType: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
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
            <div style={{ display: "flex", gap: 16 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Amount *</label>
                <input
                  required
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
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
            <div style={{ display: "flex", gap: 16 }}>
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
                  <option value="">Select Status</option>
                  {feeStatusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
                <label style={{ fontWeight: 500 }}>Payment Date</label>
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, paymentDate: e.target.value }))
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
                {modalMode === "add" ? "Add Fee" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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

export default AdminFeeManagement;

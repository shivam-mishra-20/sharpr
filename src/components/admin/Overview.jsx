/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaBook,
  FaCalendarCheck,
  FaCreditCard,
  FaTasks,
  FaSync,
  FaFileExport,
  FaComments,
  FaFileAlt,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import * as XLSX from "xlsx";

const AdminOverview = () => {
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeHomework: 0,
    attendanceToday: "0%",
    pendingFees: "₹0",
  });
  const [recentChanges, setRecentChanges] = useState([]);
  // Form states
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [showTestResultForm, setShowTestResultForm] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    class: "",

    dob: "",
    email: "",
    parentName: "",
    parentContact: "",
    address: "",
  });
  const [homeworkForm, setHomeworkForm] = useState({
    title: "",
    subject: "",
    class: "",
    description: "",
    assignedDate: "",
    dueDate: "",
  });
  const [attendanceForm, setAttendanceForm] = useState({
    date: "",
    class: "",
  });
  const [testResultForm, setTestResultForm] = useState({
    studentId: "",
    subject: "",
    testType: "",
    testDate: "",
    marksObtained: "",
    totalMarks: "",
  });
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    priority: "",
    audience: "",
    content: "",
    expiryDate: "",
    status: "Active",
  });
  const [feeForm, setFeeForm] = useState({
    id: "",
    studentId: "",
    feeType: "",
    amount: "",
    dueDate: "",
    status: "",
    paymentDate: "",
  });
  const [students, setStudents] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [fees, setFees] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const priorityOptions = ["High", "Medium", "Low"];
  const audienceOptions = ["All", "Students", "Parents", "Teachers"];
  const statusOptions = ["Active", "Inactive"];

  // Theme colors (same as AdminDashboard)
  const colors = {
    background: theme === "dark" ? "#0f172a" : "#f8fafc",
    card: theme === "dark" ? "#1e293b" : "#ffffff",
    text: theme === "dark" ? "#f1f5f9" : "#1e293b",
    textSecondary: theme === "dark" ? "#94a3b8" : "#64748b",
    border: theme === "dark" ? "#334155" : "#e2e8f0",
    highlight: theme === "dark" ? "#3b82f6" : "#4f46e5",
    highlightSecondary: theme === "dark" ? "#38bdf8" : "#818cf8",
    icon: theme === "dark" ? "#60a5fa" : "#4f46e5",
    iconBg:
      theme === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(79, 70, 229, 0.1)",
    buttonPrimary: theme === "dark" ? "#1e40af" : "#4f46e5",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: theme === "dark" ? "#1e293b" : "#ffffff",
    buttonSecondaryText: theme === "dark" ? "#f1f5f9" : "#1e293b",
    buttonBorder: theme === "dark" ? "#334155" : "#e2e8f0",
    success: theme === "dark" ? "#10b981" : "#10b981",
    warning: theme === "dark" ? "#f59e0b" : "#f59e0b",
    danger: theme === "dark" ? "#ef4444" : "#ef4444",
    shadow:
      theme === "dark"
        ? "0 4px 12px rgba(0, 0, 0, 0.2)"
        : "0 4px 12px rgba(0, 0, 0, 0.05)",
    shadowHover:
      theme === "dark"
        ? "0 8px 24px rgba(0, 0, 0, 0.3)"
        : "0 8px 24px rgba(0, 0, 0, 0.1)",
  };

  useEffect(() => {
    // Fetch data from Firestore on mount
    fetchData();
  }, []);

  // Simulate data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardData((prev) => ({
        ...prev,
        totalStudents: prev.totalStudents,
        activeHomework: prev.activeHomework,
      }));
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch data from Firestore
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Students
      const studentsSnap = await getDocs(collection(db, "students"));
      const studentsArr = studentsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsArr);

      // Homework
      const homeworkSnap = await getDocs(collection(db, "homework"));
      const homeworkArr = homeworkSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHomeworks(homeworkArr);

      // Attendance (today)
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      const attendanceSnap = await getDocs(collection(db, "attendance"));
      const attendanceArr = attendanceSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttendanceRecords(attendanceArr);

      // Fees
      const feesSnap = await getDocs(collection(db, "fees"));
      const feesArr = feesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFees(feesArr);

      // Test Results
      const testResultsSnap = await getDocs(collection(db, "testResults"));
      const testResultsArr = testResultsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestResults(testResultsArr);

      // Notices
      const noticesSnap = await getDocs(collection(db, "notices"));
      const noticesArr = noticesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotices(noticesArr);

      // Recent changes (from all collections, show last 5)
      const changes = [];
      for (const s of studentsArr) {
        if (s.createdAt)
          changes.push({
            type: "student",
            user: s.name || `${s.firstName || ""} ${s.lastName || ""}`,
            timestamp: s.createdAt?.toDate?.().toLocaleString?.() || "",
            action: "Added student",
          });
      }
      for (const h of homeworkArr) {
        if (h.createdAt)
          changes.push({
            type: "homework",
            user: h.assignedBy || "Admin",
            timestamp: h.createdAt?.toDate?.().toLocaleString?.() || "",
            action: `Assigned ${h.title}`,
          });
      }
      for (const a of attendanceArr) {
        if (a.date === todayStr)
          changes.push({
            type: "attendance",
            user: a.studentName || "Student",
            timestamp: a.date,
            action: `Marked ${a.status}`,
          });
      }
      for (const f of feesArr) {
        if (f.updatedAt)
          changes.push({
            type: "fee",
            user: f.studentName || "Student",
            timestamp: f.updatedAt?.toDate?.().toLocaleString?.() || "",
            action: `Fee status: ${f.status}`,
          });
      }
      for (const t of testResultsArr) {
        if (t.createdAt)
          changes.push({
            type: "testResult",
            user: t.studentName || "Student",
            timestamp: t.createdAt?.toDate?.().toLocaleString?.() || "",
            action: `Added test result for ${t.subject}`,
          });
      }
      for (const n of noticesArr) {
        if (n.createdAt)
          changes.push({
            type: "notice",
            user: "Admin",
            timestamp: n.createdAt?.toDate?.().toLocaleString?.() || "",
            action: `Notice: ${n.title}`,
          });
      }
      changes.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
      setRecentChanges(changes.slice(0, 5));

      // Dashboard stats
      setDashboardData({
        totalStudents: studentsArr.length,
        activeHomework: homeworkArr.length,
        attendanceToday:
          studentsArr.length > 0
            ? Math.round(
                (attendanceArr.filter(
                  (a) => a.date === todayStr && a.status === "present"
                ).length /
                  studentsArr.length) *
                  100
              ) + "%"
            : "0%",
        pendingFees:
          "₹" +
          feesArr
            .filter((f) => f.status === "pending")
            .reduce((sum, f) => sum + (parseInt(f.amount, 10) || 0), 0),
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      // Set default values in case of error
      setDashboardData({
        totalStudents: 0,
        activeHomework: 0,
        attendanceToday: "0%",
        pendingFees: "₹0",
      });
      setRecentChanges([]);
    } finally {
      setLoading(false);
    }
  };

  // Move fetchData outside useEffect so it can be called by Sync All
  // const fetchData = async () => { ... }

  // Add Student
  const handleAddStudent = async () => {
    setShowStudentForm(true);
  };
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
  const submitStudentForm = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "students"), {
        ...studentForm,
        createdAt: serverTimestamp(),
      });
      setShowStudentForm(false);
      setStudentForm({
        firstName: "",
        lastName: "",
        class: "",
        dob: "",
        email: "",
        parentName: "",
        parentContact: "",
        address: "",
      });
      await fetchData();
    } catch (err) {
      alert("Failed to add student: " + err.message);
    }
  };

  // Assign Homework
  const handleAssignHomework = async () => {
    setShowHomeworkForm(true);
  };
  const subjectOptions = [
    "Math",
    "Science",
    "English",
    "Social Studies",
    "Computer",
    "Hindi",
    "Other",
  ];
  const submitHomeworkForm = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "homework"), {
        ...homeworkForm,
        assignedBy: "Admin",
        createdAt: serverTimestamp(),
      });
      setShowHomeworkForm(false);
      setHomeworkForm({
        title: "",
        subject: "",
        class: "",
        description: "",
        assignedDate: "",
        dueDate: "",
      });
      await fetchData();
    } catch (err) {
      alert("Failed to assign homework: " + err.message);
    }
  };

  // Mark Attendance
  const handleMarkAttendance = async () => {
    setShowAttendanceForm(true);
  };
  // Update submitAttendanceForm to mark attendance for selected student
  const submitAttendanceForm = async (e) => {
    e.preventDefault();
    try {
      // Get selected student and status
      const studentId = e.target.studentId.value;
      const status = e.target.status.value;
      const student = students.find((s) => s.id === studentId);
      await addDoc(collection(db, "attendance"), {
        date: attendanceForm.date,
        class: attendanceForm.class,
        studentId,
        studentName: student ? `${student.firstName} ${student.lastName}` : "",
        status,
        createdAt: serverTimestamp(),
      });
      setShowAttendanceForm(false);
      setAttendanceForm({ date: "", class: "" });
      await fetchData();
    } catch (err) {
      alert("Failed to mark attendance: " + err.message);
    }
  };

  // Add Test Result
  const handleAddTestResult = async () => {
    setShowTestResultForm(true);
  };
  const testTypeOptions = [
    "Unit Test",
    "Mid Term",
    "Final Exam",
    "Class Test",
    "Other",
  ];
  const submitTestResultForm = async (e) => {
    e.preventDefault();
    try {
      const student = students.find((s) => s.id === testResultForm.studentId);
      await addDoc(collection(db, "testResults"), {
        ...testResultForm,
        studentName: student ? student.firstName + " " + student.lastName : "",
        createdAt: serverTimestamp(),
      });
      setShowTestResultForm(false);
      setTestResultForm({
        studentId: "",
        subject: "",
        testType: "",
        testDate: "",
        marksObtained: "",
        totalMarks: "",
      });
      await fetchData();
    } catch (err) {
      alert("Failed to add test result: " + err.message);
    }
  };

  // Send Notice
  const handleSendNotice = () => setShowNoticeForm(true);

  const submitNoticeForm = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "notices"), {
        ...noticeForm,
        createdAt: serverTimestamp(),
      });
      setShowNoticeForm(false);
      setNoticeForm({
        title: "",
        priority: "",
        audience: "",
        content: "",
        expiryDate: "",
        status: "Active",
      });
      await fetchData();
    } catch (err) {
      alert("Failed to send notice: " + err.message);
    }
  };

  // Fee Types and Status Options
  const feeTypeOptions = ["Tuition", "Transport", "Books", "Uniform", "Other"];
  const feeStatusOptions = ["pending", "paid", "partial"];

  // Open Fee Update Modal
  const handleUpdateFees = () => setShowFeeForm(true);

  // Submit Fee Update
  const submitFeeForm = async (e) => {
    e.preventDefault();
    try {
      if (feeForm.id) {
        // Update existing fee record
        const docRef = doc(db, "fees", feeForm.id);
        await updateDoc(docRef, {
          studentId: feeForm.studentId,
          feeType: feeForm.feeType,
          amount: feeForm.amount,
          dueDate: feeForm.dueDate,
          status: feeForm.status,
          paymentDate: feeForm.paymentDate,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Add new fee record
        await addDoc(collection(db, "fees"), {
          studentId: feeForm.studentId,
          feeType: feeForm.feeType,
          amount: feeForm.amount,
          dueDate: feeForm.dueDate,
          status: feeForm.status,
          paymentDate: feeForm.paymentDate,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setShowFeeForm(false);
      setFeeForm({
        id: "",
        studentId: "",
        feeType: "",
        amount: "",
        dueDate: "",
        status: "",
        paymentDate: "",
      });
      await fetchData();
    } catch (err) {
      alert("Failed to update/add fee: " + err.message);
    }
  };

  // When opening fee modal, prefill with latest fee record if available
  useEffect(() => {
    if (showFeeForm && fees.length > 0) {
      // Sort by updatedAt or createdAt descending
      const sorted = [...fees].sort((a, b) => {
        const aTime = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      const f = sorted[0];
      setFeeForm({
        id: f.id,
        studentId: f.studentId || "",
        feeType: f.feeType || "",
        amount: f.amount || "",
        dueDate: f.dueDate || "",
        status: f.status || "",
        paymentDate: f.paymentDate || "",
      });
    } else if (showFeeForm) {
      // If no fee records, reset form for new entry
      setFeeForm({
        id: "",
        studentId: "",
        feeType: "",
        amount: "",
        dueDate: "",
        status: "",
        paymentDate: "",
      });
    }
  }, [showFeeForm, fees]);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.2 } },
  };
  const tableRowVariants = {
    hover: {
      backgroundColor:
        theme === "dark" ? "rgba(30, 41, 59, 0.5)" : "rgba(248, 250, 252, 0.5)",
      transition: { duration: 0.2 },
    },
  };

  // Export students to Excel
  const handleExportData = async () => {
    try {
      const studentsSnap = await getDocs(collection(db, "students"));
      const studentsArr = studentsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Remove Firestore Timestamp objects for Excel export
      const cleanedArr = studentsArr.map((s) => {
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
      alert("Failed to export: " + err.message);
    }
  };

  // Sync All: re-fetch dashboard data and recent changes
  const handleSyncAll = async () => {
    await fetchData();
  };

  const studentsForAttendance = attendanceForm.class
    ? students.filter((s) => s.class === attendanceForm.class)
    : [];

  return (
    <div>
      {/* Student Form Modal */}
      {showStudentForm && (
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
            onSubmit={submitStudentForm}
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
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Add New Student
              </h2>
              <button
                type="button"
                onClick={() => setShowStudentForm(false)}
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
                <label style={{ fontWeight: 500 }}>First Name *</label>
                <input
                  required
                  value={studentForm.firstName}
                  onChange={(e) =>
                    setStudentForm((f) => ({ ...f, firstName: e.target.value }))
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
                <label style={{ fontWeight: 500 }}>Last Name *</label>
                <input
                  required
                  value={studentForm.lastName}
                  onChange={(e) =>
                    setStudentForm((f) => ({ ...f, lastName: e.target.value }))
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
                <label style={{ fontWeight: 500 }}>Class *</label>
                <select
                  required
                  value={studentForm.class}
                  onChange={(e) =>
                    setStudentForm((f) => ({ ...f, class: e.target.value }))
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
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <label style={{ fontWeight: 500 }}>Date of Birth *</label>
                <input
                  required
                  type="date"
                  value={studentForm.dob}
                  onChange={(e) =>
                    setStudentForm((f) => ({ ...f, dob: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                  placeholder="dd-mm-yyyy"
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Email *</label>
              <input
                required
                type="email"
                value={studentForm.email}
                onChange={(e) =>
                  setStudentForm((f) => ({ ...f, email: e.target.value }))
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
                <label style={{ fontWeight: 500 }}>Parent Name *</label>
                <input
                  required
                  value={studentForm.parentName}
                  onChange={(e) =>
                    setStudentForm((f) => ({
                      ...f,
                      parentName: e.target.value,
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
                <label style={{ fontWeight: 500 }}>Parent Contact *</label>
                <input
                  required
                  value={studentForm.parentContact}
                  onChange={(e) =>
                    setStudentForm((f) => ({
                      ...f,
                      parentContact: e.target.value,
                    }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Address</label>
              <textarea
                value={studentForm.address}
                onChange={(e) =>
                  setStudentForm((f) => ({ ...f, address: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  minHeight: 48,
                }}
              />
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
                Add Student
              </button>
              <button
                type="button"
                onClick={() => setShowStudentForm(false)}
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
      {/* Homework Form Modal */}
      {showHomeworkForm && (
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
            onSubmit={submitHomeworkForm}
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
                Assign Homework
              </h2>
              <button
                type="button"
                onClick={() => setShowHomeworkForm(false)}
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
                value={homeworkForm.title}
                onChange={(e) =>
                  setHomeworkForm((f) => ({ ...f, title: e.target.value }))
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
                  value={homeworkForm.subject}
                  onChange={(e) =>
                    setHomeworkForm((f) => ({ ...f, subject: e.target.value }))
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
                  value={homeworkForm.class}
                  onChange={(e) =>
                    setHomeworkForm((f) => ({ ...f, class: e.target.value }))
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
                value={homeworkForm.description}
                onChange={(e) =>
                  setHomeworkForm((f) => ({
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
                  value={homeworkForm.assignedDate}
                  onChange={(e) =>
                    setHomeworkForm((f) => ({
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
                  value={homeworkForm.dueDate}
                  onChange={(e) =>
                    setHomeworkForm((f) => ({ ...f, dueDate: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 8,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowHomeworkForm(false)}
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
              <button
                type="submit"
                style={{
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Assign Homework
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Attendance Form Modal */}
      {showAttendanceForm && (
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
            onSubmit={submitAttendanceForm}
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
                Mark Attendance
              </h2>
              <button
                type="button"
                onClick={() => setShowAttendanceForm(false)}
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
                <label style={{ fontWeight: 500 }}>Date *</label>
                <input
                  required
                  type="date"
                  value={attendanceForm.date}
                  onChange={(e) =>
                    setAttendanceForm((f) => ({ ...f, date: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                  placeholder="dd-mm-yyyy"
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
                <label style={{ fontWeight: 500 }}>Class *</label>
                <select
                  required
                  value={attendanceForm.class}
                  onChange={(e) =>
                    setAttendanceForm((f) => ({ ...f, class: e.target.value }))
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
            {/* Student select and status */}
            {attendanceForm.class && (
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
                  <select name="studentId" required>
                    <option value="">Select Student</option>
                    {studentsForAttendance.map((s) => (
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
                  <label style={{ fontWeight: 500 }}>Status *</label>
                  <select name="status" required>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>
            )}
            <div style={{ color: "#64748b", fontSize: 15, marginTop: 2 }}>
              Select a class to mark attendance
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowAttendanceForm(false)}
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
              <button
                type="submit"
                style={{
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Save Attendance
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Test Result Form Modal */}
      {showTestResultForm && (
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
            onSubmit={submitTestResultForm}
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
                Add Test Result
              </h2>
              <button
                type="button"
                onClick={() => setShowTestResultForm(false)}
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
                  value={testResultForm.studentId}
                  onChange={(e) =>
                    setTestResultForm((f) => ({
                      ...f,
                      studentId: e.target.value,
                    }))
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
                <label style={{ fontWeight: 500 }}>Subject *</label>
                <select
                  required
                  value={testResultForm.subject}
                  onChange={(e) =>
                    setTestResultForm((f) => ({
                      ...f,
                      subject: e.target.value,
                    }))
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
                <label style={{ fontWeight: 500 }}>Test Type *</label>
                <select
                  required
                  value={testResultForm.testType}
                  onChange={(e) =>
                    setTestResultForm((f) => ({
                      ...f,
                      testType: e.target.value,
                    }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="">Select Test Type</option>
                  {testTypeOptions.map((opt) => (
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
                <label style={{ fontWeight: 500 }}>Test Date *</label>
                <input
                  required
                  type="date"
                  value={testResultForm.testDate}
                  onChange={(e) =>
                    setTestResultForm((f) => ({
                      ...f,
                      testDate: e.target.value,
                    }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                  placeholder="dd-mm-yyyy"
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
                <label style={{ fontWeight: 500 }}>Marks Obtained *</label>
                <input
                  required
                  type="number"
                  value={testResultForm.marksObtained}
                  onChange={(e) =>
                    setTestResultForm((f) => ({
                      ...f,
                      marksObtained: e.target.value,
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
                <label style={{ fontWeight: 500 }}>Total Marks *</label>
                <input
                  required
                  type="number"
                  value={testResultForm.totalMarks}
                  onChange={(e) =>
                    setTestResultForm((f) => ({
                      ...f,
                      totalMarks: e.target.value,
                    }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowTestResultForm(false)}
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
              <button
                type="submit"
                style={{
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Add Result
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Notice Form Modal */}
      {showNoticeForm && (
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
            onSubmit={submitNoticeForm}
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
                Create Notice
              </h2>
              <button
                type="button"
                onClick={() => setShowNoticeForm(false)}
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
              <label style={{ fontWeight: 500 }}>Notice Title *</label>
              <input
                required
                value={noticeForm.title}
                onChange={(e) =>
                  setNoticeForm((f) => ({ ...f, title: e.target.value }))
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
                <label style={{ fontWeight: 500 }}>Priority *</label>
                <select
                  required
                  value={noticeForm.priority}
                  onChange={(e) =>
                    setNoticeForm((f) => ({ ...f, priority: e.target.value }))
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
                <label style={{ fontWeight: 500 }}>Target Audience *</label>
                <select
                  required
                  value={noticeForm.audience}
                  onChange={(e) =>
                    setNoticeForm((f) => ({ ...f, audience: e.target.value }))
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
              <label style={{ fontWeight: 500 }}>Notice Content *</label>
              <textarea
                required
                value={noticeForm.content}
                onChange={(e) =>
                  setNoticeForm((f) => ({ ...f, content: e.target.value }))
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
                <label style={{ fontWeight: 500 }}>Expiry Date</label>
                <input
                  type="date"
                  value={noticeForm.expiryDate}
                  onChange={(e) =>
                    setNoticeForm((f) => ({ ...f, expiryDate: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                  placeholder="dd-mm-yyyy"
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
                  value={noticeForm.status}
                  onChange={(e) =>
                    setNoticeForm((f) => ({ ...f, status: e.target.value }))
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
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowNoticeForm(false)}
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
              <button
                type="submit"
                style={{
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Create Notice
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Fee Update Modal */}
      {showFeeForm && (
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
            onSubmit={submitFeeForm}
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
                Update Fee Record
              </h2>
              <button
                type="button"
                onClick={() => setShowFeeForm(false)}
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
                  name="studentId"
                  value={feeForm.studentId}
                  onChange={(e) =>
                    setFeeForm((f) => ({ ...f, studentId: e.target.value }))
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
                  name="feeType"
                  value={feeForm.feeType}
                  onChange={(e) =>
                    setFeeForm((f) => ({ ...f, feeType: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="">Select Fee Type</option>
                  {feeTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
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
                  name="amount"
                  type="number"
                  value={feeForm.amount}
                  onChange={(e) =>
                    setFeeForm((f) => ({ ...f, amount: e.target.value }))
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
                  name="dueDate"
                  type="date"
                  value={feeForm.dueDate}
                  onChange={(e) =>
                    setFeeForm((f) => ({ ...f, dueDate: e.target.value }))
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Status *</label>
              <select
                required
                name="status"
                value={feeForm.status}
                onChange={(e) =>
                  setFeeForm((f) => ({ ...f, status: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              >
                <option value="">Select Status</option>
                {feeStatusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Payment Date</label>
              <input
                name="paymentDate"
                type="date"
                value={feeForm.paymentDate}
                onChange={(e) =>
                  setFeeForm((f) => ({ ...f, paymentDate: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
                placeholder="dd-mm-yyyy"
              />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setShowFeeForm(false)}
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
              <button
                type="submit"
                style={{
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Update Fee Record
              </button>
            </div>
          </form>
        </div>
      )}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "32px" }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "10px",
            color: colors.text,
            letterSpacing: "-0.5px",
          }}
        >
          Dashboard Overview
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: colors.textSecondary,
            maxWidth: "600px",
            lineHeight: "1.5",
          }}
        >
          Welcome to your admin control panel. Manage student data, monitor
          activities, and update information in real-time.
        </p>
      </motion.div>
      {/* Dashboard Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        {/* Total Students */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover={{
            y: -8,
            boxShadow: colors.shadowHover,
            transition: { duration: 0.3 },
          }}
          style={{
            backgroundColor: colors.card,
            borderRadius: "16px",
            padding: "24px",
            boxShadow: colors.shadow,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${colors.border}`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                marginBottom: "10px",
                fontWeight: 500,
                color: colors.textSecondary,
                letterSpacing: "0.3px",
              }}
            >
              Total Students
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: colors.text,
              }}
            >
              {dashboardData.totalStudents}
            </div>
            <div
              style={{
                marginTop: "12px",
                fontSize: "13px",
                color: colors.success,
                display: "flex",
                alignItems: "center",
                fontWeight: "500",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "5px" }}
              >
                <path
                  d="M12 20V4M12 4L5 11M12 4L19 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Live data
            </div>
          </div>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(129, 140, 248, 0.1))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.highlight,
              zIndex: 1,
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.08)",
            }}
          >
            <FaUser size={28} />
          </div>
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-10%",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(79, 70, 229, 0.03), rgba(129, 140, 248, 0.06))",
              zIndex: 0,
            }}
          />
        </motion.div>
        {/* Active Homework */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          whileHover={{
            y: -8,
            boxShadow: colors.shadowHover,
            transition: { duration: 0.3 },
          }}
          style={{
            backgroundColor: colors.card,
            borderRadius: "16px",
            padding: "24px",
            boxShadow: colors.shadow,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${colors.border}`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                marginBottom: "10px",
                fontWeight: 500,
                color: colors.textSecondary,
                letterSpacing: "0.3px",
              }}
            >
              Active Homework
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: colors.text,
              }}
            >
              {dashboardData.activeHomework}
            </div>
            <div
              style={{
                marginTop: "12px",
                fontSize: "13px",
                color: colors.success,
                display: "flex",
                alignItems: "center",
                fontWeight: "500",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "5px" }}
              >
                <path
                  d="M12 20V4M12 4L5 11M12 4L19 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Assignments
            </div>
          </div>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(129, 140, 248, 0.1))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.highlight,
              zIndex: 1,
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.08)",
            }}
          >
            <FaBook size={28} />
          </div>
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-10%",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(79, 70, 229, 0.03), rgba(129, 140, 248, 0.06))",
              zIndex: 0,
            }}
          />
        </motion.div>
        {/* Today's Attendance */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          whileHover={{
            y: -8,
            boxShadow: colors.shadowHover,
            transition: { duration: 0.3 },
          }}
          style={{
            backgroundColor: colors.card,
            borderRadius: "16px",
            padding: "24px",
            boxShadow: colors.shadow,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${colors.border}`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                marginBottom: "10px",
                fontWeight: 500,
                color: colors.textSecondary,
                letterSpacing: "0.3px",
              }}
            >
              Today's Attendance
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: colors.text,
              }}
            >
              {dashboardData.attendanceToday}
            </div>
            <div
              style={{
                marginTop: "12px",
                fontSize: "13px",
                color: colors.success,
                display: "flex",
                alignItems: "center",
                fontWeight: "500",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "5px" }}
              >
                <path
                  d="M12 20V4M12 4L5 11M12 4L19 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Present today
            </div>
          </div>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(129, 140, 248, 0.1))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.highlight,
              zIndex: 1,
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.08)",
            }}
          >
            <FaCalendarCheck size={28} />
          </div>
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-10%",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(79, 70, 229, 0.03), rgba(129, 140, 248, 0.06))",
              zIndex: 0,
            }}
          />
        </motion.div>
        {/* Pending Fees */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          whileHover={{
            y: -8,
            boxShadow: colors.shadowHover,
            transition: { duration: 0.3 },
          }}
          style={{
            backgroundColor: colors.card,
            borderRadius: "16px",
                       padding: "24px",
            boxShadow: colors.shadow,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${colors.border}`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                marginBottom: "10px",
                fontWeight: 500,
                color: colors.textSecondary,
                letterSpacing: "0.3px",
              }}
            >
              Pending Fees
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: colors.text,
              }}
            >
              {dashboardData.pendingFees}
            </div>
            <div
              style={{
                marginTop: "12px",
                fontSize: "13px",
                color: colors.success,
                display: "flex",
                alignItems: "center",
                fontWeight: "500",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "5px" }}
              >
                <path
                  d="M12 20V4M12 4L5 11M12 4L19 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All paid
            </div>
          </div>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(129, 140, 248, 0.1))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.highlight,
              zIndex: 1,
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.08)",
            }}
          >
            <FaCreditCard size={28} />
          </div>
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-10%",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(79, 70, 229, 0.03), rgba(129, 140, 248, 0.06))",
              zIndex: 0,
            }}
          />
        </motion.div>
      </div>
      {/* Quick Data Management Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          marginBottom: "40px",
          background: colors.card,
          padding: "24px",
          borderRadius: "16px",
          boxShadow: colors.shadow,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: colors.text,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaTasks style={{ fontSize: "16px", color: colors.highlight }} />
            Quick Actions
          </h2>
          <span
            style={{
              fontSize: "14px",
              color: colors.textSecondary,
            }}
          >
            Add, edit, or sync data instantly
          </span>
        </div>
        {/* Action Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleAddStudent}
            style={{
              display: "flex",
              alignItems: "center",

              justifyContent: "center",
              backgroundColor: colors.buttonPrimary,
              color: colors.buttonPrimaryText,
              border: "none",
              borderRadius: "12px",
              padding: "14px 20px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
              fontSize: "15px",
              letterSpacing: "0.3px",
            }}
          >
            <FaUser size={16} />
            Add Student
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleAssignHomework}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(to right, #4f46e5, #818cf8)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "14px 20px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
              fontSize: "15px",
              letterSpacing: "0.3px",
            }}
          >
            <FaBook size={16} />
            Assign Homework
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleMarkAttendance}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.buttonSecondary,
              color: colors.buttonSecondaryText,
              border: `1px solid ${colors.buttonBorder}`,
              borderRadius: "12px",
              padding: "14px 20px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              fontSize: "15px",
              letterSpacing: "0.3px",
            }}
          >
            <FaCalendarCheck size={16} />
            Mark Attendance
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleAddTestResult}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(to right, #f59e0b, #fbbf24)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "14px 20px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
              fontSize: "15px",
              letterSpacing: "0.3px",
            }}
          >
            <FaFileAlt size={16} />
            Add Test Result
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleUpdateFees}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.buttonSecondary,
              color: colors.buttonSecondaryText,
              border: `1px solid ${colors.buttonBorder}`,
              borderRadius: "12px",
              padding: "14px 20px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              fontSize: "15px",
              letterSpacing: "0.3px",
            }}
          >
            <FaCreditCard size={16} />
            Update Fees
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleSendNotice}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme === "dark" ? "#374151" : "#f8fafc",
              color: colors.buttonSecondaryText,
              border: `1px solid ${colors.buttonBorder}`,
              borderRadius: "12px",
              padding: "14px 24px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              width: "100%",
              maxWidth: "220px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              fontSize: "15px",
              letterSpacing: "0.3px",
            }}
          >
            <FaComments size={16} />
            Send Notice
          </motion.button>
        </div>
      </motion.div>
      {/* Recent Data Changes Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: colors.text,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaSync style={{ fontSize: "16px", color: colors.highlight }} />
            Recent Updates
          </h2>
          <span
            style={{
              fontSize: "14px",
              color: colors.textSecondary,
            }}
          >
            Live updates to parent dashboards
          </span>
        </div>
        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleExportData}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.buttonSecondary,
              color: colors.buttonSecondaryText,
              border: `1px solid ${colors.buttonBorder}`,
              borderRadius: "10px",
              padding: "10px 16px",
              fontWeight: 500,
              cursor: "pointer",
              gap: "8px",
              fontSize: "14px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            }}
          >
            <FaFileExport size={14} />
            Export Data
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleSyncAll}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.buttonPrimary,
              color: colors.buttonPrimaryText,
              border: "none",
              borderRadius: "10px",
              padding: "10px 16px",
              fontWeight: 500,
              cursor: "pointer",
              gap: "8px",
              fontSize: "14px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 10px rgba(79, 70, 229, 0.15)",
            }}
          >
            <FaSync size={14} />
            Sync All
          </motion.button>
        </div>
        {/* Recent Changes Table */}
        <div
          style={{
            backgroundColor: colors.card,
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: colors.shadow,
            border: `1px solid ${colors.border}`,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
              color: colors.text,
            }}
          >
            <thead
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(30, 41, 59, 0.5)"
                    : "rgba(248, 250, 252, 0.8)",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <tr>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  User
                </th>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  Action
                </th>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {recentChanges.map((change, idx) => (
                <motion.tr
                  key={change.timestamp + change.type + change.user + idx}
                  variants={tableRowVariants}
                  whileHover="hover"
                  style={{
                    borderBottom: `1px solid ${colors.border}`,
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          backgroundColor: colors.iconBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: colors.highlight,
                        }}
                      >
                        {change.type === "attendance" && (
                          <FaCalendarCheck size={18} />
                        )}
                        {change.type === "homework" && <FaBook size={18} />}
                        {change.type === "fee" && <FaCreditCard size={18} />}
                        {change.type === "testResult" && (
                          <FaFileAlt size={18} />
                        )}
                        {change.type === "notice" && <FaComments size={18} />}
                        {/* ...add more icons as needed... */}
                      </motion.div>
                      <div
                        style={{
                          textTransform: "capitalize",
                          fontWeight: 500,
                          letterSpacing: "0.3px",
                        }}
                      >
                        {change.type}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontWeight: 500 }}>
                    {change.user}
                  </td>
                  <td style={{ padding: "16px 20px" }}>{change.action}</td>
                  <td
                    style={{
                      padding: "16px 20px",
                      color: colors.textSecondary,
                      fontWeight: 500,
                      fontSize: "13px",
                    }}
                  >
                    {change.timestamp}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
// Replacing the Add Student button with View Inquiries button

import { useNavigate } from "react-router-dom";
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
  FaCalendarAlt,
  FaPlus,
  FaSchool,
  FaUserGraduate,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaCertificate,
  FaMoneyBill,
  FaBullhorn,
  FaTag,
  FaExclamationTriangle,
  FaUsers,
  FaComment,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { db, auth } from "../../firebase";
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
  const [editId, setEditId] = useState(null);
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    class: "",
    dob: "",
    email: "",
    parentName: "",
    parentContact: "",
    address: "",
    password: "", // Add password field to match Students.jsx
  });

  const navigate = useNavigate();

  // Replace handleAddStudent function with handleViewInquiries
  const handleViewInquiries = () => {
    // This follows the same routing pattern as sidebar navigation
    navigate("/admin_dashboard/inquiry");
  };

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
  // 1. Update the noticeForm initial state to include the new fields
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    priority: "",
    audience: "",
    content: "",
    expiryDate: "",
    status: "Active",
    targetClass: "", // New field for class targeting
    targetStudent: "", // New field for student targeting
    targetStudentName: "", // To store the student's name for display
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
  // 2. Update the audienceOptions to match Notices.jsx
  const audienceOptions = [
    "All",
    "Students",
    "Parents",
    "Teachers",
    "Class",
    "Individual Student",
  ];
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
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];
  // Update the submitStudentForm function to use authentication like Students.jsx
  const submitStudentForm = async (e) => {
    e.preventDefault();
    try {
      if (studentForm.password && studentForm.email) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          studentForm.email,
          studentForm.password
        );
        const userUid = userCredential.user.uid;
        // Create parent user doc with UID as doc ID
        await setDoc(doc(db, "users", userUid), {
          uid: userUid,
          name: studentForm.firstName + " " + studentForm.lastName,
          email: studentForm.email,
          role: "parent",
          createdAt: serverTimestamp(),
        });
        // Create student doc with UID as doc ID
        const { password, ...formData } = studentForm;
        await setDoc(doc(db, "students", userUid), {
          ...formData,
          authUid: userUid,
          createdAt: serverTimestamp(),
        });
      } else {
        // If no password, fallback to addDoc (not recommended for parent login)
        const { password, ...formData } = studentForm;
        await addDoc(collection(db, "students"), {
          ...formData,
          authUid: null,
          createdAt: serverTimestamp(),
        });
      }
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
        password: "",
      });
      await fetchData();
    } catch (err) {
      alert("Failed to add student: " + err.message);
    }
  };

  // Assign Homework
  // Fix the handleAssignHomework function in Overview.jsx to properly initialize form values
  const handleAssignHomework = () => {
    // Initialize form with today's date as assigned date
    const today = new Date().toISOString().split("T")[0];

    setHomeworkForm({
      title: "",
      subject: "",
      class: "",
      description: "",
      assignedDate: today, // Set today as the default assigned date
      dueDate: "",
    });

    // Show the form
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
  // Updated submitHomeworkForm function to fix the blank form issue
  const submitHomeworkForm = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "homework"), {
        ...homeworkForm,
        assignedBy: "Admin",
        createdAt: serverTimestamp(),
      });

      // Initialize with today's date before closing the form
      const today = new Date().toISOString().split("T")[0];

      // Close form first, then reset it with proper initial values
      setShowHomeworkForm(false);

      // Reset form with today's date for the next time
      setHomeworkForm({
        title: "",
        subject: "",
        class: "",
        description: "",
        assignedDate: today,
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

  // 3. Update the handleSendNotice function
  const handleSendNotice = () => {
    setNoticeForm({
      title: "",
      priority: "",
      audience: "",
      content: "",
      expiryDate: "",
      status: "Active",
      targetClass: "",
      targetStudent: "",
      targetStudentName: "",
    });
    setShowNoticeForm(true);
  };

  // 4. Add a helper function to handle student selection
  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    const selectedStudent = students.find(
      (student) => student.id === studentId
    );
    setNoticeForm((f) => ({
      ...f,
      targetStudent: studentId,
      targetStudentName: selectedStudent
        ? `${selectedStudent.firstName || ""} ${selectedStudent.lastName || ""}`
        : "",
    }));
  };

  // 5. Update the submit notice form function
  const submitNoticeForm = async (e) => {
    e.preventDefault();
    try {
      // Prepare notice data based on audience selection
      const noticeData = { ...noticeForm };

      // Clean up unnecessary fields based on audience
      if (noticeForm.audience !== "Class") {
        delete noticeData.targetClass;
      }

      if (noticeForm.audience !== "Individual Student") {
        delete noticeData.targetStudent;
        delete noticeData.targetStudentName;
      }

      await addDoc(collection(db, "notices"), {
        ...noticeData,
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
        targetClass: "",
        targetStudent: "",
        targetStudentName: "",
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
        const aTime =
          a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
        const bTime =
          b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
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

  // Add responsive state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;

  useEffect(() => {
    // Update document title
    document.title = "Admin Dashboard - School Management System";
  }, []);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {/* Replace the existing student form modal with this */}
      {showStudentForm && (
        <div
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
            padding: "16px",
            backdropFilter: "blur(2px)",
          }}
        >
          <form
            onSubmit={submitStudentForm}
            style={{
              background: colors.card,
              padding: isSmallMobile ? "20px" : "24px",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: isSmallMobile ? "18px" : "22px",
                  fontWeight: 700,
                  margin: 0,
                  color: colors.text,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <FaUser style={{ color: colors.accent || colors.highlight }} />
                Add New Student
              </h2>
              <button
                type="button"
                onClick={() => setShowStudentForm(false)}
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
              </button>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <label style={{ fontWeight: 500, color: colors.text }}>
                  First Name *
                </label>
                <input
                  required
                  value={studentForm.firstName}
                  onChange={(e) =>
                    setStudentForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    width: "100%",
                  }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <label style={{ fontWeight: 500, color: colors.text }}>
                  Last Name *
                </label>
                <input
                  required
                  value={studentForm.lastName}
                  onChange={(e) =>
                    setStudentForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    width: "100%",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <label style={{ fontWeight: 500, color: colors.text }}>
                  Class *
                </label>
                <select
                  required
                  value={studentForm.class}
                  onChange={(e) =>
                    setStudentForm((f) => ({ ...f, class: e.target.value }))
                  }
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    width: "100%",
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
                  gap: "6px",
                }}
              >
                <label style={{ fontWeight: 500, color: colors.text }}>
                  Date of Birth *
                </label>
                <input
                  required
                  type="date"
                  value={studentForm.dob}
                  onChange={(e) =>
                    setStudentForm((f) => ({ ...f, dob: e.target.value }))
                  }
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    width: "100%",
                  }}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontWeight: 500, color: colors.text }}>
                Email *
              </label>
              <input
                required
                type="email"
                value={studentForm.email}
                onChange={(e) =>
                  setStudentForm((f) => ({ ...f, email: e.target.value }))
                }
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: `1px solid ${colors.border}`,
                  background: colors.inputBg || colors.card,
                  color: colors.text,
                  width: "100%",
                }}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontWeight: 500, color: colors.text }}>
                Password (for parent login)
              </label>
              <input
                type="password"
                value={studentForm.password || ""}
                onChange={(e) =>
                  setStudentForm((f) => ({ ...f, password: e.target.value }))
                }
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: `1px solid ${colors.border}`,
                  background: colors.inputBg || colors.card,
                  color: colors.text,
                  width: "100%",
                }}
                placeholder="Set password for parent login"
                autoComplete="new-password"
              />
              <span
                style={{
                  fontSize: "12px",
                  color: colors.textSecondary,
                  marginTop: 4,
                }}
              >
                This password, along with the email, can be used to log in as a
                parent.
              </span>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <label style={{ fontWeight: 500, color: colors.text }}>
                  Parent Name *
                </label>
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
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    width: "100%",
                  }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <label style={{ fontWeight: 500, color: colors.text }}>
                  Parent Contact *
                </label>
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
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    width: "100%",
                  }}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontWeight: 500, color: colors.text }}>
                Address
              </label>
              <textarea
                value={studentForm.address}
                onChange={(e) =>
                  setStudentForm((f) => ({ ...f, address: e.target.value }))
                }
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: `1px solid ${colors.border}`,
                  background: colors.inputBg || colors.card,
                  color: colors.text,
                  minHeight: "64px",
                  width: "100%",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="submit"
                style={{
                  background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  width: "100%",
                }}
              >
                Add Student
              </button>
              <button
                type="button"
                onClick={() => setShowStudentForm(false)}
                style={{
                  background: colors.card,
                  color: colors.highlight,
                  border: `1px solid ${colors.highlight}`,
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Notice Form Modal */}
      {/* 6. Update the Notice Form Modal - replace the current showNoticeForm section with: */}
      {showNoticeForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: isMobile ? "flex-end" : "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
            padding: isSmallMobile ? 12 : isMobile ? 16 : 0,
          }}
        >
          <motion.div
            initial={{
              scale: isMobile ? 1 : 0.9,
              opacity: 0,
              y: isMobile ? 100 : 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: isMobile ? 1 : 0.9,
              opacity: 0,
              y: isMobile ? 100 : 0,
            }}
            transition={{ type: "spring", damping: 25 }}
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : 580,
              maxHeight: isSmallMobile ? "92vh" : isMobile ? "85vh" : "90vh",
              overflow: "auto",
              padding: 0,
              borderRadius: isMobile ? "16px 16px 0 0" : 16,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              background: colors.card,
            }}
          >
            <form
              onSubmit={submitNoticeForm}
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
                  <FaBullhorn
                    style={{ color: colors.accent || colors.highlight }}
                  />
                  {editId ? "Edit Notice" : "Add Notice"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowNoticeForm(false)}
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
                  <FaTag
                    size={14}
                    style={{ color: colors.accent || colors.highlight }}
                  />
                  Title *
                </label>
                <input
                  required
                  value={noticeForm.title}
                  onChange={(e) =>
                    setNoticeForm((f) => ({ ...f, title: e.target.value }))
                  }
                  style={{
                    padding: isSmallMobile ? 10 : 12,
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    fontSize: isSmallMobile ? 14 : 15,
                  }}
                  placeholder="Enter notice title"
                />
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
                    <FaExclamationTriangle
                      size={14}
                      style={{ color: colors.warning }}
                    />
                    Priority *
                  </label>
                  <select
                    required
                    value={noticeForm.priority}
                    onChange={(e) =>
                      setNoticeForm((f) => ({ ...f, priority: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
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
                    <FaUsers
                      size={14}
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Audience *
                  </label>
                  <select
                    required
                    value={noticeForm.audience}
                    onChange={(e) =>
                      setNoticeForm((f) => ({
                        ...f,
                        audience: e.target.value,
                        // Reset targeting fields when audience changes
                        targetClass: "",
                        targetStudent: "",
                        targetStudentName: "",
                      }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
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

              {/* Conditional fields for Class or Individual Student selection */}
              {noticeForm.audience === "Class" && (
                <div
                  style={{
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
                    <FaChalkboardTeacher
                      size={14}
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Select Class *
                  </label>
                  <select
                    required
                    value={noticeForm.targetClass}
                    onChange={(e) =>
                      setNoticeForm((f) => ({
                        ...f,
                        targetClass: e.target.value,
                      }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      width: "100%",
                    }}
                  >
                    <option value="">Select Class</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {noticeForm.audience === "Individual Student" && (
                <div
                  style={{
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
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Select Student *
                  </label>
                  <select
                    required
                    value={noticeForm.targetStudent}
                    onChange={handleStudentSelect}
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      width: "100%",
                    }}
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName || ""} {student.lastName || ""} (
                        {student.class || ""})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div
                style={{
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
                  Content *
                </label>
                <textarea
                  required
                  value={noticeForm.content}
                  onChange={(e) =>
                    setNoticeForm((f) => ({ ...f, content: e.target.value }))
                  }
                  style={{
                    padding: isSmallMobile ? 10 : 12,
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    fontSize: isSmallMobile ? 14 : 15,
                    minHeight: isSmallMobile ? 80 : isMobile ? 100 : 120,
                    resize: "vertical",
                  }}
                  placeholder="Enter notice content"
                />
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
                    <FaCalendarAlt
                      size={14}
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={noticeForm.expiryDate}
                    onChange={(e) =>
                      setNoticeForm((f) => ({
                        ...f,
                        expiryDate: e.target.value,
                      }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      width: "100%",
                    }}
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
                      fontSize: isSmallMobile ? 14 : 15,
                    }}
                  >
                    Status *
                  </label>
                  <select
                    required
                    value={noticeForm.status}
                    onChange={(e) =>
                      setNoticeForm((f) => ({ ...f, status: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
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
                  onClick={() => setShowNoticeForm(false)}
                  style={{
                    background: "transparent",
                    color: colors.accent || colors.highlight,
                    border: `1px solid ${colors.accent || colors.highlight}`,
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
                    boxShadow:
                      colors.buttonShadow ||
                      "0 4px 12px rgba(79, 70, 229, 0.25)",
                    minWidth: isMobile ? "100%" : 120,
                    order: isMobile ? 1 : 2,
                  }}
                >
                  Send Notice
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Homework Form Modal - Using responsive components */}
      {/* // Update to the homework form modal in Overview.jsx to match Homework.jsx */}
      {showHomeworkForm && (
        <div
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
              maxWidth: 600,
              maxHeight: isSmallMobile ? "92vh" : isMobile ? "85vh" : "90vh",
              overflow: "auto",
              padding: 0,
              borderRadius: 16,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              background: colors.card,
            }}
          >
            <form
              onSubmit={submitHomeworkForm}
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
                  <FaBook
                    style={{ color: colors.accent || colors.highlight }}
                  />
                  {editId ? "Edit Homework" : "Assign Homework"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowHomeworkForm(false)}
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
                    marginBottom: 2,
                    fontSize: isSmallMobile ? 14 : 15,
                  }}
                >
                  Assignment Title *
                </label>
                <input
                  required
                  value={homeworkForm.title}
                  onChange={(e) =>
                    setHomeworkForm((f) => ({ ...f, title: e.target.value }))
                  }
                  style={{
                    padding: isSmallMobile ? 10 : 12,
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    fontSize: 15,
                  }}
                  placeholder="Enter homework title"
                />
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
                      marginBottom: 2,
                      fontSize: isSmallMobile ? 14 : 15,
                    }}
                  >
                    Subject *
                  </label>
                  <select
                    required
                    value={homeworkForm.subject}
                    onChange={(e) =>
                      setHomeworkForm((f) => ({
                        ...f,
                        subject: e.target.value,
                      }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      width: "100%",
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
                      marginBottom: 2,
                      fontSize: isSmallMobile ? 14 : 15,
                    }}
                  >
                    Class *
                  </label>
                  <select
                    required
                    value={homeworkForm.class}
                    onChange={(e) =>
                      setHomeworkForm((f) => ({ ...f, class: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      width: "100%",
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isSmallMobile ? 6 : 10,
                }}
              >
                <label
                  style={{
                    fontWeight: 500,
                    color: colors.text,
                    marginBottom: 2,
                    fontSize: isSmallMobile ? 14 : 15,
                  }}
                >
                  Description *
                </label>
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
                    padding: isSmallMobile ? 10 : 12,
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    fontSize: isSmallMobile ? 14 : 15,
                    minHeight: isSmallMobile ? 60 : isMobile ? 80 : 100,
                    resize: "vertical",
                  }}
                  placeholder="Enter homework description and requirements"
                />
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
                      marginBottom: 2,
                      fontSize: isSmallMobile ? 14 : 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <FaCalendarAlt
                      size={12}
                      style={{ color: colors.accent || colors.highlight }}
                    />{" "}
                    Assigned Date *
                  </label>
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
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      width: "100%",
                    }}
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
                      marginBottom: 2,
                      fontSize: isSmallMobile ? 14 : 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <FaCalendarAlt
                      size={12}
                      style={{ color: colors.warning }}
                    />{" "}
                    Due Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={homeworkForm.dueDate}
                    onChange={(e) =>
                      setHomeworkForm((f) => ({
                        ...f,
                        dueDate: e.target.value,
                      }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
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
                  onClick={() => {
                    setShowHomeworkForm(false);
                    setHomeworkForm({
                      title: "",
                      subject: "",
                      class: "",
                      description: "",
                      assignedDate: "",
                      dueDate: "",
                    });
                  }}
                  style={{
                    background: "transparent",
                    color: colors.accent || colors.highlight,
                    border: `1px solid ${colors.accent || colors.highlight}`,
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    order: isMobile ? 1 : 2,
                  }}
                >
                  Assign
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Attendance Form Modal - Matching Attendance.jsx styling */}
      {showAttendanceForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: isMobile ? "flex-end" : "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
            padding: isSmallMobile ? 12 : isMobile ? 16 : 0,
          }}
        >
          <motion.div
            initial={{
              scale: isMobile ? 1 : 0.9,
              opacity: 0,
              y: isMobile ? 100 : 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: isMobile ? 1 : 0.9,
              opacity: 0,
              y: isMobile ? 100 : 0,
            }}
            transition={{ type: "spring", damping: 25 }}
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : 500,
              maxHeight: isSmallMobile ? "92vh" : isMobile ? "85vh" : "90vh",
              overflowY: "auto",
              padding: 0,
              borderRadius: isMobile ? "16px 16px 0 0" : 16,
              position: "relative",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              background: colors.card,
            }}
          >
            <form
              onSubmit={submitAttendanceForm}
              style={{
                padding: isSmallMobile ? 16 : isMobile ? 20 : 32,
                display: "flex",
                flexDirection: "column",
                gap: isSmallMobile ? 16 : 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: isMobile ? 4 : 8,
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
                  <FaCalendarCheck
                    style={{ color: colors.accent || colors.highlight }}
                  />
                  Mark Attendance
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowAttendanceForm(false)}
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
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isSmallMobile ? 12 : 16,
                }}
              >
                <div
                  style={{
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
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={attendanceForm.date}
                    onChange={(e) =>
                      setAttendanceForm((f) => ({ ...f, date: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      width: "100%",
                    }}
                  />
                </div>

                <div
                  style={{
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
                    <FaSchool
                      size={14}
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Class *
                  </label>
                  <select
                    required
                    value={attendanceForm.class}
                    onChange={(e) =>
                      setAttendanceForm((f) => ({
                        ...f,
                        class: e.target.value,
                      }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      width: "100%",
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

                {attendanceForm.class && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: isSmallMobile ? 6 : 10,
                        gridColumn: isMobile ? "auto" : "span 2",
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
                          style={{ color: colors.accent || colors.highlight }}
                        />
                        Student *
                      </label>
                      <select
                        name="studentId"
                        required
                        style={{
                          padding: isSmallMobile ? 10 : 12,
                          borderRadius: 8,
                          border: `1px solid ${colors.border}`,
                          background: colors.inputBg || colors.card,
                          color: colors.text,
                          fontSize: isSmallMobile ? 14 : 15,
                          width: "100%",
                        }}
                      >
                        <option value="">Select Student</option>
                        {studentsForAttendance.map((s) => (
                          <option key={s.id} value={s.id}>
                            {(s.firstName || "") + " " + (s.lastName || "")}
                          </option>
                        ))}
                      </select>
                      {studentsForAttendance.length === 0 && (
                        <div
                          style={{
                            fontSize: 13,
                            color: colors.textSecondary,
                            marginTop: "8px",
                            padding: "12px",
                            background:
                              theme === "dark"
                                ? "rgba(59, 130, 246, 0.1)"
                                : "rgba(79, 70, 229, 0.1)",
                            borderRadius: 6,
                          }}
                        >
                          No students found in this class
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: isSmallMobile ? 6 : 10,
                        gridColumn: isMobile ? "auto" : "span 2",
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
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          marginTop: 4,
                        }}
                      >
                        {["present", "absent"].map((s) => (
                          <label
                            key={s}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              cursor: "pointer",
                              padding: isSmallMobile ? "8px 12px" : "10px 16px",
                              borderRadius: 8,
                              border: `1px solid ${colors.border}`,
                              background: "transparent",
                              flex: 1,
                              justifyContent: "center",
                            }}
                          >
                            <input
                              type="radio"
                              name="status"
                              value={s}
                              defaultChecked={s === "present"}
                              style={{ marginRight: 8 }}
                            />
                            {s === "present" ? (
                              <FaCheckCircle size={18} color={colors.success} />
                            ) : (
                              <FaTimesCircle size={18} color={colors.danger} />
                            )}
                            <span
                              style={{
                                textTransform: "capitalize",
                                fontWeight: 500,
                                color: colors.text,
                              }}
                            >
                              {s}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: isSmallMobile ? 8 : 16,
                  marginTop: isSmallMobile ? 8 : 16,
                  justifyContent: "flex-end",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowAttendanceForm(false)}
                  style={{
                    background: "transparent",
                    color: colors.accent || colors.highlight,
                    border: `1px solid ${colors.accent || colors.highlight}`,
                    borderRadius: 10,
                    padding: isSmallMobile ? "10px 16px" : "12px 24px",
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  style={{
                    background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: isSmallMobile ? "10px 16px" : "12px 32px",
                    fontWeight: 600,
                    fontSize: isSmallMobile ? 14 : 15,
                    cursor: "pointer",
                    boxShadow: colors.buttonShadow,
                    minWidth: isMobile ? "100%" : 120,
                    order: isMobile ? 1 : 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  Save Attendance
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Test Result Form Modal - Update to match TestResults.jsx */}
      {showTestResultForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: isMobile ? "flex-end" : "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
            padding: isSmallMobile ? 12 : isMobile ? 16 : 0,
          }}
        >
          <motion.div
            initial={{
              scale: isMobile ? 1 : 0.9,
              opacity: 0,
              y: isMobile ? 100 : 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: isMobile ? 1 : 0.9,
              opacity: 0,
              y: isMobile ? 100 : 0,
            }}
            transition={{ type: "spring", damping: 25 }}
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : 580,
              maxHeight: isSmallMobile ? "92vh" : isMobile ? "85vh" : "90vh",
              overflow: "auto",
              padding: 0,
              borderRadius: isMobile ? "20px 20px 0 0" : 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              background: colors.card,
            }}
          >
            <form
              onSubmit={submitTestResultForm}
              style={{
                padding: isSmallMobile
                  ? "20px 16px"
                  : isMobile
                  ? "24px 20px"
                  : "32px",
                display: "flex",
                flexDirection: "column",
                gap: isSmallMobile ? 16 : 18,
                width: "90%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                  borderBottom: `1px solid ${colors.border}`,
                  paddingBottom: isSmallMobile ? 12 : 16,
                  gap: 2,
                }}
              >
                <h2
                  style={{
                    fontSize: isSmallMobile ? 18 : isMobile ? 20 : 24,
                    fontWeight: 700,
                    margin: 0,
                    color: colors.text,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <FaFileAlt
                    style={{ color: colors.accent || colors.highlight }}
                  />
                  {editId ? "Edit Test Result" : "Add Test Result"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowTestResultForm(false)}
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                    border: "none",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: colors.text,
                    fontSize: 20,
                    marginLeft: "auto",
                    flexShrink: 0,
                  }}
                  aria-label="Close"
                >
                  ×
                </motion.button>
              </div>

              {/* Student Selection Field */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isSmallMobile ? 8 : 10,
                  width: "100%",
                }}
              >
                <label
                  htmlFor="studentId"
                  style={{
                    fontWeight: 600,
                    color: colors.text,
                    fontSize: isSmallMobile ? 14 : 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                    width: "100px",
                  }}
                >
                  <FaUserGraduate
                    size={14}
                    style={{ color: colors.accent || colors.highlight }}
                  />
                  Student *
                </label>
                <select
                  id="studentId"
                  required
                  value={testResultForm.studentId}
                  onChange={(e) =>
                    setTestResultForm((f) => ({
                      ...f,
                      studentId: e.target.value,
                    }))
                  }
                  style={{
                    padding: isSmallMobile ? "12px 14px" : "14px 16px",
                    borderRadius: 10,
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    fontSize: isSmallMobile ? 15 : 16,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
                      theme === "dark" ? "%2394a3b8" : "%2364748b"
                    }' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                    backgroundSize: "16px",
                    paddingRight: "40px",
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

              {/* Subject and Test Type Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isSmallMobile ? 28 : isMobile ? 28 : 45,
                  justifyContent: "space-between",
                  width: "98%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isSmallMobile ? 8 : 10,
                    maxWidth: "100%",
                  }}
                >
                  <label
                    htmlFor="subject"
                    style={{
                      fontWeight: 600,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      width: "fit-content",
                    }}
                  >
                    <FaBook
                      size={14}
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Subject *
                  </label>
                  <select
                    id="subject"
                    required
                    value={testResultForm.subject}
                    onChange={(e) =>
                      setTestResultForm((f) => ({
                        ...f,
                        subject: e.target.value,
                      }))
                    }
                    style={{
                      padding: isSmallMobile ? "12px 14px" : "14px 16px",
                      borderRadius: 10,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 15 : 16,
                      width: "100%",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
                        theme === "dark" ? "%2394a3b8" : "%2364748b"
                      }' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      backgroundSize: "16px",
                      paddingRight: "40px",
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
                    display: "flex",
                    flexDirection: "column",
                    gap: isSmallMobile ? 8 : 10,
                    width: "90%",
                  }}
                >
                  <label
                    htmlFor="testType"
                    style={{
                      fontWeight: 600,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      width: "fit-content",
                    }}
                  >
                    <FaCheckCircle
                      size={14}
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Test Type *
                  </label>
                  <select
                    id="testType"
                    required
                    value={testResultForm.testType}
                    onChange={(e) =>
                      setTestResultForm((f) => ({
                        ...f,
                        testType: e.target.value,
                      }))
                    }
                    style={{
                      padding: isSmallMobile ? "12px 14px" : "14px 16px",
                      borderRadius: 10,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 15 : 16,
                      width: "100%",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
                        theme === "dark" ? "%2394a3b8" : "%2364748b"
                      }' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      backgroundSize: "16px",
                      paddingRight: "40px",
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
              </div>

              {/* Test Date Field */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isSmallMobile ? 8 : 10,
                  width: "94%",
                }}
              >
                <label
                  htmlFor="testDate"
                  style={{
                    fontWeight: 600,
                    color: colors.text,
                    fontSize: isSmallMobile ? 14 : 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                    width: "fit-content",
                  }}
                >
                  <FaCalendarAlt
                    size={14}
                    style={{ color: colors.accent || colors.highlight }}
                  />
                  Test Date *
                </label>
                <input
                  id="testDate"
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
                    padding: isSmallMobile ? "12px 14px" : "14px 16px",
                    borderRadius: 10,
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg || colors.card,
                    color: colors.text,
                    fontSize: isSmallMobile ? 15 : 16,
                    width: "100%",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                />
              </div>

              {/* Marks Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isSmallMobile ? 22 : isMobile ? 24 : 45,
                  justifyContent: "space-between",
                  width: "94%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isSmallMobile ? 8 : 10,
                    maxWidth: "100%",
                  }}
                >
                  <label
                    htmlFor="marksObtained"
                    style={{
                      fontWeight: 600,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      width: "fit-content",
                    }}
                  >
                    <FaTrophy
                      size={14}
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Marks Obtained *
                  </label>
                  <input
                    id="marksObtained"
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
                      padding: isSmallMobile ? "12px 14px" : "14px 16px",
                      borderRadius: 10,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 15 : 16,
                      width: "100%",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                    placeholder="e.g. 85"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isSmallMobile ? 8 : 10,
                    maxWidth: "100%",
                  }}
                >
                  <label
                    htmlFor="totalMarks"
                    style={{
                      fontWeight: 600,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      width: "fit-content",
                    }}
                  >
                    <FaCertificate
                      size={14}
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Total Marks *
                  </label>
                  <input
                    id="totalMarks"
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
                      padding: isSmallMobile ? "12px 14px" : "14px 16px",
                      borderRadius: 10,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
                      color: colors.text,
                      fontSize: isSmallMobile ? 15 : 16,
                      width: "100%",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: isSmallMobile ? 10 : 16,
                  marginTop: isSmallMobile ? 8 : isMobile ? 12 : 16,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexDirection: isMobile ? "column-reverse" : "row",
                  borderTop: `1px solid ${colors.border}`,
                  paddingTop: isSmallMobile ? 16 : 20,
                  width: "90%",
                }}
              >
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  type="button"
                  onClick={() => setShowTestResultForm(false)}
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: isSmallMobile ? "12px 20px" : "14px 28px",
                    fontWeight: 600,
                    fontSize: isSmallMobile ? 15 : 16,
                    cursor: "pointer",
                    minWidth: isMobile ? "100%" : 120,
                    flex: isMobile ? "unset" : 1,
                    maxWidth: isMobile ? "unset" : 180,
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
                    borderRadius: 12,
                    padding: isSmallMobile ? "12px 20px" : "14px 28px",
                    fontWeight: 600,
                    fontSize: isSmallMobile ? 15 : 16,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                    minWidth: isMobile ? "100%" : 140,
                    flex: isMobile ? "unset" : 1,
                    maxWidth: isMobile ? "unset" : 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <FaPlus size={16} /> Add Result
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* // Update only the showFeeForm modal section to match FeeManagement.jsx
      styling */}
      {showFeeForm && (
        <div
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
              onSubmit={submitFeeForm}
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
                  <FaCreditCard
                    style={{ color: colors.accent || colors.highlight }}
                  />
                  {feeForm.id ? "Edit Fee Record" : "Add Fee Record"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowFeeForm(false)}
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
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Student *
                  </label>
                  <select
                    required
                    value={feeForm.studentId}
                    onChange={(e) =>
                      setFeeForm((f) => ({ ...f, studentId: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
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
                    <FaMoneyBill
                      size={14}
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Fee Type *
                  </label>
                  <select
                    required
                    value={feeForm.feeType}
                    onChange={(e) =>
                      setFeeForm((f) => ({ ...f, feeType: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
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
                    value={feeForm.amount}
                    onChange={(e) =>
                      setFeeForm((f) => ({ ...f, amount: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
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
                      style={{ color: colors.accent || colors.highlight }}
                    />
                    Due Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={feeForm.dueDate}
                    onChange={(e) =>
                      setFeeForm((f) => ({ ...f, dueDate: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
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
                    value={feeForm.status}
                    onChange={(e) =>
                      setFeeForm((f) => ({ ...f, status: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
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
                      style={{ color: colors.success || colors.highlight }}
                    />
                    Payment Date{" "}
                    {feeForm.status === "pending" ? "(Optional)" : "*"}
                  </label>
                  <input
                    type="date"
                    required={
                      feeForm.status === "paid" || feeForm.status === "partial"
                    }
                    value={feeForm.paymentDate}
                    onChange={(e) =>
                      setFeeForm((f) => ({ ...f, paymentDate: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg || colors.card,
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
                  onClick={() => setShowFeeForm(false)}
                  style={{
                    background: "transparent",
                    color: colors.accent || colors.highlight,
                    border: `1px solid ${colors.accent || colors.highlight}`,
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
                    boxShadow:
                      colors.buttonShadow ||
                      "0 4px 12px rgba(79, 70, 229, 0.25)",
                    minWidth: isMobile ? "100%" : 150,
                    order: isMobile ? 1 : 2,
                  }}
                >
                  {feeForm.id ? "Update Fee" : "Add Fee"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: isMobile ? "24px" : "32px" }}
      >
        <h1
          style={{
            fontSize: isMobile ? "24px" : "28px",
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
            fontSize: isMobile ? "15px" : "16px",
            color: colors.textSecondary,
            maxWidth: "600px",
            lineHeight: "1.5",
          }}
        >
          Welcome to your admin control panel. Manage student data, monitor
          activities, and update information in real-time.
        </p>
      </motion.div>
      {/* Dashboard Stats - Responsive grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isSmallMobile
            ? "1fr"
            : isMobile
            ? "repeat(2, 1fr)"
            : "repeat(auto-fit, minmax(240px, 1fr))",
          gap: isMobile ? "16px" : "24px",
          marginBottom: isMobile ? "32px" : "40px",
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
            padding: isMobile ? "20px" : "24px",
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
                fontSize: isMobile ? "13px" : "14px",
                marginBottom: "8px",
                fontWeight: 500,
                color: colors.textSecondary,
                letterSpacing: "0.3px",
              }}
            >
              Total Students
            </div>
            <div
              style={{
                fontSize: isMobile ? "28px" : "36px",
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
              width: isMobile ? "48px" : "56px",
              height: isMobile ? "48px" : "56px",
              borderRadius: "14px",
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
            <FaUser size={isMobile ? 22 : 28} />
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
            padding: isMobile ? "20px" : "24px",
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
            padding: isMobile ? "20px" : "24px",
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
            padding: isMobile ? "20px" : "24px",
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
      {/* Quick Data Management Section - Adjusted for mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          marginBottom: isMobile ? "32px" : "40px",
          background: colors.card,
          padding: isMobile ? "20px" : "24px",
          borderRadius: "16px",
          boxShadow: colors.shadow,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",

            marginBottom: isMobile ? "16px" : "24px",
            flexDirection: isSmallMobile ? "column" : "row",
            alignItems: isSmallMobile ? "flex-start" : "center",
            gap: isSmallMobile ? "8px" : "0",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: 600,
              color: colors.text,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: isSmallMobile ? "0 0 4px 0" : 0,
            }}
          >
            <FaTasks style={{ fontSize: "16px", color: colors.highlight }} />
            Quick Actions
          </h2>
          <span
            style={{
              fontSize: isMobile ? "13px" : "14px",
              color: colors.textSecondary,
            }}
          >
            Add, edit, or sync data instantly
          </span>
        </div>

        {/* Action Buttons - Responsive grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isSmallMobile
              ? "1fr"
              : isMobile
              ? "repeat(2, 1fr)"
              : "repeat(auto-fit, minmax(200px, 1fr))",
            gap: isSmallMobile ? "12px" : "16px",
            marginBottom: "20px",
          }}
        >
          {/* Action buttons - Use same component for consistent styling */}
          {/* // Then replace the button in the Quick Actions section: */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleViewInquiries}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.buttonPrimary,
              color: colors.buttonPrimaryText,
              border: "none",
              borderRadius: "12px",
              padding: isMobile ? "12px 16px" : "14px 20px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
              fontSize: isMobile ? "14px" : "15px",
              letterSpacing: "0.3px",
            }}
          >
            <FaComments size={16} />
            View Inquiries
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
              padding: isMobile ? "12px 16px" : "14px 20px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
              fontSize: isMobile ? "14px" : "15px",
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
              padding: isMobile ? "12px 16px" : "14px 20px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              fontSize: isMobile ? "14px" : "15px",
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
              padding: isMobile ? "12px 16px" : "14px 20px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
              fontSize: isMobile ? "14px" : "15px",
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
              padding: isMobile ? "12px 16px" : "14px 20px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              fontSize: isMobile ? "14px" : "15px",
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
              padding: isMobile ? "12px 16px" : "14px 24px",
              fontWeight: 600,
              cursor: "pointer",
              gap: "10px",
              width: "100%",
              maxWidth: isSmallMobile ? "100%" : "220px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              fontSize: isMobile ? "14px" : "15px",
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
            marginBottom: isMobile ? "16px" : "20px",
            flexDirection: isSmallMobile ? "column" : "row",
            alignItems: isSmallMobile ? "flex-start" : "center",
            gap: isSmallMobile ? "8px" : "0",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: 600,
              color: colors.text,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: isSmallMobile ? "0 0 4px 0" : 0,
            }}
          >
            <FaSync style={{ fontSize: "16px", color: colors.highlight }} />
            Recent Updates
          </h2>
          <span
            style={{
              fontSize: isMobile ? "13px" : "14px",
              color: colors.textSecondary,
            }}
          >
            Live updates to parent dashboards
          </span>
        </div>

        {/* Action Buttons - Responsive */}
        <div
          style={{
            display: "flex",
            justifyContent: isSmallMobile ? "space-between" : "flex-end",
            alignItems: "center",
            gap: isSmallMobile ? "8px" : "16px",
            marginBottom: isMobile ? "16px" : "20px",
            flexWrap: "wrap",
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
              padding: isSmallMobile ? "8px 12px" : "10px 16px",
              fontWeight: 500,
              cursor: "pointer",
              gap: "8px",
              fontSize: isSmallMobile ? "13px" : "14px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
              flex: isSmallMobile ? 1 : "initial",
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
              padding: isSmallMobile ? "8px 12px" : "10px 16px",
              fontWeight: 500,
              cursor: "pointer",
              gap: "8px",
              fontSize: isSmallMobile ? "13px" : "14px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 10px rgba(79, 70, 229, 0.15)",
              flex: isSmallMobile ? 1 : "initial",
            }}
          >
            <FaSync size={14} />
            Sync All
          </motion.button>
        </div>

        {/* Recent Changes - Responsive Table for larger screens, Cards for mobile */}
        {isMobile ? (
          // Card view for mobile devices
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {recentChanges.map((change, idx) => (
              <motion.div
                key={change.timestamp + change.type + change.user + idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                whileHover={{
                  y: -4,
                  boxShadow: colors.shadowHover,
                  transition: { duration: 0.2 },
                }}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: colors.shadow,
                  border: `1px solid ${colors.border}`,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        backgroundColor: colors.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.icon,
                        flexShrink: 0,
                      }}
                    >
                      {change.type === "attendance" && (
                        <FaCalendarCheck size={18} />
                      )}
                      {change.type === "homework" && <FaBook size={18} />}
                      {change.type === "fee" && <FaCreditCard size={18} />}
                      {change.type === "testResult" && <FaFileAlt size={18} />}
                      {change.type === "notice" && <FaComments size={18} />}
                      {change.type === "student" && <FaUser size={18} />}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "15px",
                          color: colors.text,
                          marginBottom: "4px",
                          wordBreak: "break-word",
                        }}
                      >
                        {change.user}
                      </div>
                      <div
                        style={{
                          color: colors.textSecondary,
                          fontSize: "13px",
                          textTransform: "capitalize",
                        }}
                      >
                        {change.type}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: colors.textSecondary,
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      marginLeft: "8px",
                    }}
                  >
                    {typeof change.timestamp === "string" &&
                    change.timestamp.includes(":")
                      ? change.timestamp.split(" ")[1]
                      : change.timestamp}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: colors.text,
                    background:
                      theme === "dark"
                        ? "rgba(30, 41, 59, 0.5)"
                        : "rgba(248, 250, 252, 0.8)",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    fontWeight: 500,
                  }}
                >
                  {change.action}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Table view for larger screens
          <div
            style={{
              backgroundColor: colors.card,
              borderRadius: "16px",
              overflow: "auto",
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
              maxWidth: "100%",
            }}
          >
            <div style={{ minWidth: isSmallMobile ? "500px" : "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: isMobile ? "13px" : "14px",
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
                        padding: isMobile ? "12px 16px" : "16px 20px",
                        textAlign: "left",
                        fontSize: isMobile ? "12px" : "13px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Type
                    </th>
                    <th
                      style={{
                        padding: isMobile ? "12px 16px" : "16px 20px",
                        textAlign: "left",
                        fontSize: isMobile ? "12px" : "13px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                      }}
                    >
                      User
                    </th>
                    <th
                      style={{
                        padding: isMobile ? "12px 16px" : "16px 20px",
                        textAlign: "left",
                        fontSize: isMobile ? "12px" : "13px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                      }}
                    >
                      Action
                    </th>
                    <th
                      style={{
                        padding: isMobile ? "12px 16px" : "16px 20px",
                        textAlign: "left",
                        fontSize: isMobile ? "12px" : "13px",
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
                      <td
                        style={{
                          padding: isMobile ? "12px 16px" : "16px 20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: isMobile ? "8px" : "12px",
                          }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            style={{
                              width: isMobile ? "32px" : "40px",
                              height: isMobile ? "32px" : "40px",
                              borderRadius: "8px",
                              backgroundColor: colors.iconBg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: colors.highlight,
                            }}
                          >
                            {change.type === "attendance" && (
                              <FaCalendarCheck size={isMobile ? 14 : 18} />
                            )}
                            {change.type === "homework" && (
                              <FaBook size={isMobile ? 14 : 18} />
                            )}
                            {change.type === "fee" && (
                              <FaCreditCard size={isMobile ? 14 : 18} />
                            )}
                            {change.type === "testResult" && (
                              <FaFileAlt size={isMobile ? 14 : 18} />
                            )}
                            {change.type === "notice" && (
                              <FaComments size={isMobile ? 14 : 18} />
                            )}
                            {change.type === "student" && (
                              <FaUser size={isMobile ? 14 : 18} />
                            )}
                          </motion.div>
                          {!isSmallMobile && (
                            <div
                              style={{
                                textTransform: "capitalize",
                                fontWeight: 500,
                                letterSpacing: "0.3px",
                              }}
                            >
                              {change.type}
                            </div>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: isMobile ? "12px 16px" : "16px 20px",
                          fontWeight: 500,
                          maxWidth: isSmallMobile ? "80px" : "auto",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {change.user}
                      </td>
                      <td
                        style={{
                          padding: isMobile ? "12px 16px" : "16px 20px",
                          maxWidth: isSmallMobile ? "120px" : "auto",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {change.action}
                      </td>
                      <td
                        style={{
                          padding: isMobile ? "12px 16px" : "16px 20px",
                          color: colors.textSecondary,
                          fontWeight: 500,
                          fontSize: isMobile ? "12px" : "13px",
                        }}
                      >
                        {change.timestamp}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
      {/* // ...existing code... */}
    </div>
  );
};

export default AdminOverview;

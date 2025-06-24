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
  getDoc,
  query,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  getAuth,
} from "firebase/auth";

import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  FaFileExport,
  FaUserPlus,
  FaPen,
  FaTrashAlt,
  FaSearch,
  FaTimes,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaUserGraduate,
  FaBars,
  FaEnvelope,
  FaPhoneAlt,
  FaHome,
  FaBirthdayCake,
  FaUserFriends,
  FaBook, // Add this for course icon
  FaPlus, // Add this for adding courses
} from "react-icons/fa";
import bcryptjs from "bcryptjs"; // Add this import at the top

const classOptions = [
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
  password: "",
  changePassword: false, // Add this new field
};

// Screen size hook for responsive design
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    category: "",
    duration: "",
  });
  const [editCourseId, setEditCourseId] = useState(null);
  const [showAssignCourseModal, setShowAssignCourseModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);

  // Get window size for responsive design
  const { width } = useWindowSize();
  const isSmallMobile = width <= 480; // Extra small screens
  const isMobile = width <= 768;
  const isTablet = width <= 1024 && width > 768;

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

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

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

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const snap = await getDocs(collection(db, "courses"));
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setError("Failed to fetch courses: " + err.message);
    }
  };

  // Fetch student courses
  const fetchStudentCourses = async (studentId) => {
    if (!studentId) return;
    try {
      const snap = await getDocs(
        query(
          collection(db, "courseEnrollments"),
          where("studentId", "==", studentId)
        )
      );
      setStudentCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setError("Failed to fetch student courses");
    }
  };

  // Fetch all students with their courses
  const fetchStudentsWithCourses = async () => {
    setLoading(true);
    try {
      // First get all students
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const studentsData = studentsSnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // Then get all course enrollments
      const enrollmentsSnapshot = await getDocs(
        collection(db, "courseEnrollments")
      );
      const enrollments = enrollmentsSnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // Get all courses for lookup
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const coursesLookup = {};
      coursesSnapshot.docs.forEach((doc) => {
        coursesLookup[doc.id] = doc.data();
      });

      // Map enrollments to students
      const studentsWithCourses = studentsData.map((student) => {
        // Find enrollments for this student
        const studentEnrollments = enrollments.filter(
          (e) => e.studentId === student.id
        );

        // Map enrollments to course data
        const courses = studentEnrollments.map((enrollment) => ({
          enrollmentId: enrollment.id,
          courseId: enrollment.courseId,
          name: coursesLookup[enrollment.courseId]?.name || "Unknown Course",
          category: coursesLookup[enrollment.courseId]?.category || "",
        }));

        return {
          ...student,
          courses,
        };
      });

      setStudents(studentsWithCourses);
    } catch (err) {
      console.error("Error fetching students with courses:", err);
      setError("Failed to fetch student data: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudentsWithCourses();
    fetchCourses();
  }, []);

  // Replace the existing handleSubmit function with this updated version
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Create a copy of form data for updates
        const updateData = {
          firstName: form.firstName,
          lastName: form.lastName,
          class: form.class,
          dob: form.dob,
          email: form.email,
          parentName: form.parentName,
          parentContact: form.parentContact,
          address: form.address || "",
          updatedAt: serverTimestamp(),
        };

        // Handle password update if requested
        if (form.changePassword && form.password) {
          // Hash the new password
          const salt = bcryptjs.genSaltSync(12);
          const hashedPassword = bcryptjs.hashSync(form.password, salt);
          updateData.password = hashedPassword;

          // Also update the password in the users collection if it exists
          const userRef = doc(db, "users", editId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            await updateDoc(userRef, {
              password: hashedPassword,
              updatedAt: serverTimestamp(),
            });
          }
        }

        // Update the student document
        await updateDoc(doc(db, "students", editId), updateData);
      } else {
        // New student creation (existing code)
        // Hash the password using bcryptjs
        const salt = bcryptjs.genSaltSync(12);
        const hashedPassword = bcryptjs.hashSync(form.password, salt);

        // Create custom document ID
        const now = new Date();
        const dateString = `${now.getFullYear()}${(now.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
        const studentName = `${form.firstName}_${form.lastName}`
          .toLowerCase()
          .replace(/\s+/g, "-");
        const customDocId = `${studentName}_${dateString}`;

        // Create a new document in the students collection with custom ID
        const studentRef = doc(db, "students", customDocId);
        await setDoc(studentRef, {
          firstName: form.firstName,
          lastName: form.lastName,
          class: form.class,
          dob: form.dob,
          email: form.email,
          parentName: form.parentName,
          parentContact: form.parentContact,
          address: form.address || "",
          password: hashedPassword, // Store hashed password instead of plaintext
          role: "parent",
          createdAt: serverTimestamp(),
        });

        // Also create a complete user document for authentication
        await setDoc(doc(db, "users", customDocId), {
          uid: customDocId,
          name: `${form.firstName} ${form.lastName}`,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: hashedPassword,
          role: "parent",
          createdAt: serverTimestamp(),
          class: form.class,
          parentName: form.parentName,
          parentContact: form.parentContact,
        });
      }

      // Close the form and refresh the list
      setShowForm(false);
      setEditId(null);
      setForm(initialForm);
      fetchStudentsWithCourses(); // Refresh the student list
    } catch (err) {
      console.error("Error saving student:", err);
      setError("Failed to save student: " + err.message);
    }
  };

  // Add or update course
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCourseId) {
        await updateDoc(doc(db, "courses", editCourseId), {
          ...courseForm,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "courses"), {
          ...courseForm,
          createdAt: serverTimestamp(),
        });
      }
      setShowCourseForm(false);
      setCourseForm({ name: "", description: "", category: "", duration: "" });
      setEditCourseId(null);
      fetchCourses();
    } catch (err) {
      setError("Failed to save course: " + err.message);
    }
  };

  // Enroll student in course
  const handleEnrollStudent = async (studentId, courseId) => {
    try {
      await addDoc(collection(db, "courseEnrollments"), {
        studentId,
        courseId,
        enrolledAt: serverTimestamp(),
      });
      // Refresh courses for this student
      fetchStudentCourses(studentId);
      // Also refresh the full student list after a short delay
      setTimeout(() => {
        fetchStudentsWithCourses();
      }, 500);
    } catch (err) {
      setError("Failed to enroll student in course: " + err.message);
    }
  };

  // Remove student from course
  const handleRemoveStudent = async (enrollmentId, studentId) => {
    if (
      !window.confirm(
        "Remove this student from the course? This will delete the enrollment record."
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "courseEnrollments", enrollmentId));
      // Refresh courses for this student
      fetchStudentCourses(studentId);
      // Also refresh the full student list
      fetchStudentsWithCourses();
    } catch (err) {
      setError("Failed to remove student from course: " + err.message);
    }
  };

  // Add this new helper function to handle admin re-authentication
  const signBackInAsAdmin = async (adminEmail) => {
    try {
      const adminPassword = sessionStorage.getItem("adminPassword");
      if (adminEmail && adminPassword) {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        console.log("Successfully signed back in as admin");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error signing back in as admin:", error);
      return false;
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
      changePassword: false, // Reset password change flag
    });
    setEditId(student.id);
    setShowForm(true);
  };

  // Edit course
  const handleCourseEdit = (course) => {
    setCourseForm({
      name: course.name || "",
      description: course.description || "",
      category: course.category || "",
      duration: course.duration || "",
    });
    setEditCourseId(course.id);
    setShowCourseForm(true);
  };

  // Delete student
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this student? This will permanently remove all associated data including fees, attendance records, test results, and course enrollments."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Get the student data first (for reference and auth checking)
      const studentDoc = await getDoc(doc(db, "students", id));
      const studentData = studentDoc.data();

      if (!studentData) {
        throw new Error("Student not found");
      }

      // Step 2: Start a batch of delete operations for all related collections
      const batch = [];

      // Delete fees records
      const feesQuery = query(
        collection(db, "fees"),
        where("studentId", "==", id)
      );
      const feesSnapshot = await getDocs(feesQuery);
      feesSnapshot.docs.forEach((doc) => {
        batch.push(deleteDoc(doc.ref));
      });

      // Delete attendance records
      const attendanceQuery = query(
        collection(db, "attendance"),
        where("studentId", "==", id)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      attendanceSnapshot.docs.forEach((doc) => {
        batch.push(deleteDoc(doc.ref));
      });

      // Delete test results
      const testResultsQuery = query(
        collection(db, "testResults"),
        where("studentId", "==", id)
      );
      const testResultsSnapshot = await getDocs(testResultsQuery);
      testResultsSnapshot.docs.forEach((doc) => {
        batch.push(deleteDoc(doc.ref));
      });

      // Delete course enrollments
      const enrollmentsQuery = query(
        collection(db, "courseEnrollments"),
        where("studentId", "==", id)
      );
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      enrollmentsSnapshot.docs.forEach((doc) => {
        batch.push(deleteDoc(doc.ref));
      });

      // Delete notices targeted to this student
      const noticesQuery = query(
        collection(db, "notices"),
        where("targetStudent", "==", id)
      );
      const noticesSnapshot = await getDocs(noticesQuery);
      noticesSnapshot.docs.forEach((doc) => {
        batch.push(deleteDoc(doc.ref));
      });

      // Step 3: Handle authentication data if exists
      if (studentData.authUid) {
        // Store the admin user details for signing back in later
        const adminUser = auth.currentUser;
        const adminEmail = adminUser?.email;
        const adminPassword = sessionStorage.getItem("adminPassword");

        // Delete user document in the users collection
        try {
          await deleteDoc(doc(db, "users", studentData.authUid));
        } catch (error) {
          console.error("Error deleting user document:", error);
        }

        // Mark auth account for deletion (would need Firebase Admin SDK for direct deletion)
        await addDoc(collection(db, "deletedUsers"), {
          uid: studentData.authUid,
          email: studentData.email,
          deletedAt: serverTimestamp(),
        });

        // You could alternatively use Firebase Auth directly if your authentication allows:
        // try {
        //   await deleteUser(auth.currentUser);
        //   await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        // } catch(authError) {
        //   console.error("Error with auth operation:", authError);
        // }
      }

      // Step 4: Execute all deletion operations
      await Promise.all(batch);

      // Step 5: Finally delete the student document itself
      await deleteDoc(doc(db, "students", id));

      // Step 6: Update UI and display success
      setStudents(students.filter((s) => s.id !== id));
      console.log("Student and all related data deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      setError(`Failed to delete student: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const handleCourseDelete = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try {
      setLoading(true);

      // First, remove course from all students who have it
      const studentCoursesRef = collection(db, "studentCourses");
      const q = query(studentCoursesRef, where("courseId", "==", id));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Then delete the actual course document
      await deleteDoc(doc(db, "courses", id));

      setLoading(false);
      fetchCourses();

      // Show success message
      setError(null);
    } catch (err) {
      console.error("Delete course error:", err);
      setError("Failed to delete course: " + err.message);
      setLoading(false);
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

  // Toggle sidebar function (to be connected to parent component)
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // You'll need to communicate this state to a parent component
  };

  // Open assign course modal
  const openAssignCourse = (student) => {
    setSelectedStudent(student);
    setShowAssignCourseModal(true);
    // If student already has course data, use it
    if (student.courses) {
      setStudentCourses(
        student.courses.map((course) => ({
          id: course.enrollmentId,
          courseId: course.courseId,
          studentId: student.id,
        }))
      );
    } else {
      // Otherwise, fetch courses as before
      fetchStudentCourses(student.id);
    }
  };

  // Toggle course assignment
  const toggleCourseAssignment = (courseId) => {
    if (studentCourses.some((enrollment) => enrollment.courseId === courseId)) {
      // Find the enrollment to remove
      const enrollment = studentCourses.find(
        (enrollment) => enrollment.courseId === courseId
      );
      handleRemoveStudent(enrollment.id, selectedStudent.id);
    } else {
      // Add new course enrollment
      handleEnrollStudent(selectedStudent.id, courseId);
    }
  };

  // Render student card for mobile view
  const renderStudentCard = (student, index) => {
    return (
      <motion.div
        key={student.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        style={{
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${colors.cardBorder}`,
          marginBottom: 12,
          background: colors.card,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: colors.text,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FaUserGraduate
                size={14}
                style={{ color: colors.accent, flexShrink: 0 }}
              />
              {(student.firstName || "") + " " + (student.lastName || "")}
            </h3>
            <span
              style={{
                background: colors.accentLight,
                color: colors.accent,
                padding: "3px 6px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                marginTop: 4,
                display: "inline-block",
              }}
            >
              {student.class}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 16,
            fontSize: 14,
            color: colors.textSecondary,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FaEnvelope size={12} style={{ flexShrink: 0 }} />
            <span style={{ wordBreak: "break-word" }}>{student.email}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FaBirthdayCake size={12} style={{ flexShrink: 0 }} />
            <span>{student.dob || "Not specified"}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FaUserFriends size={12} style={{ flexShrink: 0 }} />
            <span>{student.parentName || "Not specified"}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FaPhoneAlt size={12} style={{ flexShrink: 0 }} />
            <span>{student.parentContact || "No contact"}</span>
          </div>

          {student.address && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <FaHome size={12} style={{ flexShrink: 0, marginTop: 4 }} />
              <span style={{ wordBreak: "break-word" }}>{student.address}</span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 8,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(student)}
            style={{
              background: colors.warning,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FaPen size={12} /> Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(student.id)}
            style={{
              background: colors.danger,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FaTrashAlt size={12} /> Delete
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openAssignCourse(student)}
            style={{
              background: colors.success,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FaBook size={12} /> Courses
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: isSmallMobile ? "12px 8px" : isMobile ? 16 : 24,
        color: colors.text,
      }}
    >
      {/* Mobile Header with Sidebar Toggle */}
      {isMobile && (
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 12,
            gap: 12,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            style={{
              background: colors.card,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            aria-label="Toggle Sidebar"
          >
            <FaBars size={16} />
          </motion.button>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Students</h1>
        </motion.div>
      )}

      {/* Desktop/Tablet Header */}
      {!isMobile && (
        <>
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
              color: colors.text,
            }}
          >
            Student Management
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 16,
              color: colors.textSecondary,
              marginBottom: 24,
              maxWidth: 800,
            }}
          >
            Add, edit and manage student information in one place.
          </motion.p>
        </>
      )}

      {/* Search & Filter Controls - Responsive Layout */}
      <motion.div
        variants={itemVariants}
        style={{
          display: "flex",
          gap: isSmallMobile ? 8 : isMobile ? 12 : 16,
          marginBottom: isSmallMobile ? 12 : isMobile ? 16 : 24,
          flexWrap: "wrap",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Search Box - Full width on mobile */}
        <div
          style={{
            flex: isMobile ? "1 0 100%" : 1,
            minWidth: isMobile ? "100%" : 220,
            maxWidth: isMobile ? "100%" : 340,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: colors.card,
            borderRadius: 10,
            padding: isSmallMobile ? "2px 12px" : "4px 16px",
            border: `1px solid ${colors.border}`,
          }}
        >
          <FaSearch style={{ color: colors.textSecondary, flexShrink: 0 }} />
          <input
            type="text"
            placeholder={
              isSmallMobile ? "Search..." : "Search by name or email"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: isSmallMobile ? "8px 0" : "10px 0",
              border: "none",
              width: "100%",
              fontSize: 14,
              backgroundColor: "transparent",
              color: colors.text,
              outline: "none",
            }}
          />
          {search && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearch("")}
              style={{
                background: "transparent",
                border: "none",
                color: colors.textSecondary,
                cursor: "pointer",
                padding: 4,
                flexShrink: 0,
              }}
            >
              <FaTimes size={14} />
            </motion.button>
          )}
        </div>
        {/* Filter and Export Buttons - Desktop */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 16 }}>
            {/* <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: showFilters ? colors.accentLight : colors.card,
                color: showFilters ? colors.accent : colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: "12px 20px",
                fontSize: 15,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <FaFilter size={14} /> {showFilters ? "Hide Filters" : "Filters"}
            </motion.button> */}

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleExport}
              style={{
                background: theme === "dark" ? "#334155" : "#f1f5f9",
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: "12px 20px",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <FaFileExport size={14} /> Export
            </motion.button>
          </div>
        )}
        {/* Mobile Controls Row */}
        {isMobile && (
          <div style={{ display: "flex", width: "100%", gap: 8 }}>
            {/* <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                background: showFilters ? colors.accentLight : colors.card,
                color: showFilters ? colors.accent : colors.text,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: 1,
              }}
            >
              <FaFilter size={14} /> {showFilters ? "Hide Filters" : "Filters"}
            </motion.button> */}

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                setShowForm(true);
                setForm(initialForm);
                setEditId(null);
              }}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: colors.buttonShadow,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: 1,
              }}
            >
              <FaUserPlus size={14} /> Add Student
            </motion.button>
          </div>
        )}
        {/* Mobile Controls Row - Add Courses Button */}
        {isMobile && (
          <div style={{ display: "flex", width: "100%", gap: 8, marginTop: 8 }}>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowCourseForm(true)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(90deg, #10b981, #059669)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: colors.buttonShadow,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: 1,
              }}
            >
              <FaBook size={14} /> Manage Courses
            </motion.button>
          </div>
        )}
        {/* // Desktop Controls */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 16 }}>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                setShowForm(true);
                setForm(initialForm);
                setEditId(null);
              }}
              style={{
                background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 20px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: colors.buttonShadow,
              }}
            >
              <FaUserPlus size={14} /> Add Student
            </motion.button>
          </div>
        )}
        {/* Desktop Controls - Add Courses Button */}
        {!isMobile && (
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowCourseForm(true)}
            style={{
              background: "linear-gradient(90deg, #10b981, #059669)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 20px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: colors.buttonShadow,
            }}
          >
            <FaBook size={14} /> Manage Courses
          </motion.button>
        )}
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: colors.danger,
            marginBottom: 16,
            padding: "12px 16px",
            borderRadius: 8,
            background:
              theme === "dark"
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${
              theme === "dark"
                ? "rgba(239, 68, 68, 0.3)"
                : "rgba(239, 68, 68, 0.2)"
            }`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <FaTimes size={16} />
          {error}
        </motion.div>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: 20,
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: 32,
                background: colors.card,
                borderRadius: 12,
                border: `1px solid ${colors.cardBorder}`,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
                style={{ display: "inline-block", marginBottom: 8 }}
              >
                <FaUserGraduate size={24} color={colors.accent} />
              </motion.div>
              <p style={{ margin: 0 }}>Loading students...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 32,
                background: colors.card,
                borderRadius: 12,
                border: `1px solid ${colors.cardBorder}`,
                color: colors.textSecondary,
              }}
            >
              No students found matching your criteria.
            </div>
          ) : (
            filtered.map((student, index) => renderStudentCard(student, index))
          )}
        </motion.div>
      )}

      {/* Desktop/Tablet View - Table */}
      {!isMobile && (
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
          <div
            style={{
              overflowX: "auto",
              width: "100%",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "-ms-autohiding-scrollbar",
              position: "relative", // For sticky header
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                tableLayout: "fixed", // Helps with column sizing
              }}
            >
              <thead
                style={{
                  background: colors.tableHeader,
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  boxShadow: `0 1px 0 ${colors.border}`,
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "16px 12px",
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "15%",
                      borderBottom: `2px solid ${colors.accent}`,
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "16px 12px",
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      width: "10%",
                      borderBottom: `2px solid ${colors.accent}`,
                    }}
                  >
                    Class
                  </th>
                  <th
                    style={{
                      padding: "16px 12px",
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      width: "10%",
                      borderBottom: `2px solid ${colors.accent}`,
                    }}
                  >
                    DOB
                  </th>
                  <th
                    style={{
                      padding: "16px 12px",
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      width: "15%",
                      borderBottom: `2px solid ${colors.accent}`,
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: "16px 12px",
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      width: "12%",
                      borderBottom: `2px solid ${colors.accent}`,
                    }}
                  >
                    Parent Name
                  </th>
                  <th
                    style={{
                      padding: "16px 12px",
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      width: "12%",
                      borderBottom: `2px solid ${colors.accent}`,
                    }}
                  >
                    Parent Contact
                  </th>
                  <th
                    style={{
                      padding: "16px 12px",
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      width: "12%",
                      borderBottom: `2px solid ${colors.accent}`,
                      maxWidth: "150px",
                    }}
                  >
                    Address
                  </th>
                  <th
                    style={{
                      padding: "16px 12px",
                      textAlign: "center",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      borderBottom: `2px solid ${colors.accent}`,
                      width: "15%",
                    }}
                  >
                    Actions
                  </th>
                  <th
                    style={{
                      padding: "16px 12px",
                      textAlign: "left",
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      borderBottom: `2px solid ${colors.accent}`,
                      width: "15%",
                    }}
                  >
                    Courses
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        textAlign: "center",
                        padding: 32,
                        height: "200px",
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        style={{
                          display: "inline-block",
                          marginRight: 10,
                        }}
                      >
                        <FaUserGraduate size={20} color={colors.accent} />
                      </motion.div>
                      <p style={{ fontWeight: 500 }}>Loading students...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        textAlign: "center",
                        padding: 32,
                        color: colors.textSecondary,
                        height: "200px",
                      }}
                    >
                      <div style={{ fontSize: 16 }}>
                        <p style={{ fontWeight: 500 }}>No students found.</p>
                        <p style={{ fontSize: 14 }}>
                          Create your first student using the "Add Student"
                          button.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, index) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      style={{
                        borderTop: `1px solid ${colors.tableBorder}`,
                        background:
                          index % 2 === 0
                            ? colors.tableRow
                            : colors.tableRowAlt,
                        transition: "background-color 0.2s ease",
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
                          padding: "14px 12px",
                          fontWeight: 500,
                          color: colors.text,
                          verticalAlign: "middle",
                          lineHeight: 1.4,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: colors.accentLight,
                              color: colors.accent,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            {s.firstName?.charAt(0)}
                            {s.lastName?.charAt(0)}
                          </div>
                          <span>
                            {(s.firstName || "") + " " + (s.lastName || "")}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          color: colors.text,
                          verticalAlign: "middle",
                        }}
                      >
                        <span
                          style={{
                            background: colors.accentLight,
                            color: colors.accent,
                            padding: "5px 10px",
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 500,
                            display: "inline-block",
                          }}
                        >
                          {s.class}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          color: colors.text,
                          verticalAlign: "middle",
                        }}
                      >
                        {s.dob}
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          color: colors.text,
                          verticalAlign: "middle",
                          maxWidth: "180px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <FaEnvelope
                            size={12}
                            style={{
                              color: colors.textSecondary,
                              flexShrink: 0,
                            }}
                          />
                          <span title={s.email}>{s.email}</span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          color: colors.text,
                          verticalAlign: "middle",
                          maxWidth: "150px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span title={s.parentName}>{s.parentName}</span>
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          color: colors.text,
                          verticalAlign: "middle",
                          maxWidth: "150px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span title={s.parentContact}>{s.parentContact}</span>
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          color: colors.text,
                          verticalAlign: "middle",
                          maxWidth: "150px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span title={s.address}>{s.address}</span>
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(s)}
                            style={{
                              background: colors.warning,
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontWeight: 500,
                              fontSize: 13,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              transition: "all 0.2s ease",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          >
                            <FaPen size={12} /> Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(s.id)}
                            style={{
                              background: colors.danger,
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontWeight: 500,
                              fontSize: 13,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              transition: "all 0.2s ease",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          >
                            <FaTrashAlt size={12} /> Delete
                          </motion.button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openAssignCourse(s)}
                          style={{
                            background: colors.success,
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 12px",
                            marginTop: 8,
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: 13,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          }}
                        >
                          <FaBook size={12} /> Courses
                        </motion.button>
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          color: colors.text,
                          verticalAlign: "middle",
                        }}
                      >
                        {s.courses && s.courses.length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 6,
                            }}
                          >
                            {s.courses.map((course, i) => (
                              <div
                                key={course.enrollmentId}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  background: `${colors.accentLight}`,
                                  color: colors.accent,
                                  padding: "4px 10px",
                                  borderRadius: 20,
                                  fontSize: 13,
                                  gap: 6,
                                  border: `1px solid ${
                                    theme === "dark"
                                      ? "rgba(59, 130, 246, 0.2)"
                                      : "rgba(79, 70, 229, 0.2)"
                                  }`,
                                  maxWidth: "100%",
                                  marginBottom:
                                    i < s.courses.length - 1 ? 4 : 0,
                                }}
                              >
                                <span
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "calc(100% - 20px)",
                                  }}
                                  title={course.name}
                                >
                                  {course.name}
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveStudent(
                                      course.enrollmentId,
                                      s.id
                                    );
                                  }}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    padding: 2,
                                    cursor: "pointer",
                                    display: "flex",
                                    color: colors.danger,
                                    flexShrink: 0,
                                  }}
                                >
                                  <FaTimes size={12} />
                                </motion.button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span
                            style={{
                              color: colors.textSecondary,
                              fontSize: 13,
                              fontStyle: "italic",
                            }}
                          >
                            No courses assigned
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && !loading && (
            <div
              style={{
                padding: "12px 20px",
                borderTop: `1px solid ${colors.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: colors.tableHeader,
              }}
            >
              <span
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                }}
              >
                Showing {filtered.length}{" "}
                {filtered.length === 1 ? "student" : "students"}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Add/Edit Modal - Responsive */}
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
                onSubmit={handleSubmit}
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
                    marginBottom: 8,
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
                      gap: 10,
                    }}
                  >
                    <FaUserGraduate style={{ color: colors.accent }} />
                    {editId ? "Edit Student" : "Add Student"}
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
                      First Name *
                    </label>
                    <input
                      required
                      value={form.firstName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, firstName: e.target.value }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
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
                      Last Name *
                    </label>
                    <input
                      required
                      value={form.lastName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, lastName: e.target.value }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
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
                      Class *
                    </label>
                    <select
                      required
                      value={form.class}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, class: e.target.value }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                        width: "100%",
                        cursor: "pointer",
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
                      Date of Birth *
                    </label>
                    <input
                      required
                      type="date"
                      value={form.dob}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, dob: e.target.value }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
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
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                    }}
                  />
                </div>

                {/* Show password field only when adding */}
                {!editId && (
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
                      Password (for parent login)
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                      placeholder="Set password for parent login"
                      autoComplete="new-password"
                    />
                    <span
                      style={{
                        fontSize: isSmallMobile ? 11 : 12,
                        color: colors.textSecondary,
                        marginTop: 4,
                      }}
                    >
                      This password, along with the email, can be used to log in
                      as a parent.
                    </span>
                  </div>
                )}

                {/* In the edit form section, add this new password change field */}
                {editId && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 6 : 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <input
                        type="checkbox"
                        id="changePassword"
                        checked={form.changePassword}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            changePassword: e.target.checked,
                          }))
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        htmlFor="changePassword"
                        style={{
                          fontWeight: 500,
                          color: colors.text,
                          fontSize: isSmallMobile ? 14 : 15,
                          cursor: "pointer",
                        }}
                      >
                        Change Password
                      </label>
                    </div>

                    {form.changePassword && (
                      <>
                        <input
                          type="password"
                          value={form.password || ""}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, password: e.target.value }))
                          }
                          style={{
                            padding: isSmallMobile ? 10 : 12,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            background: colors.inputBg,
                            color: colors.text,
                            fontSize: isSmallMobile ? 14 : 15,
                          }}
                          placeholder="New password"
                          autoComplete="new-password"
                        />
                        <span
                          style={{
                            fontSize: isSmallMobile ? 11 : 12,
                            color: colors.textSecondary,
                          }}
                        >
                          Enter a new password for this account.
                        </span>
                      </>
                    )}
                  </div>
                )}

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
                      Parent Name *
                    </label>
                    <input
                      required
                      value={form.parentName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, parentName: e.target.value }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
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
                      Parent Contact *
                    </label>
                    <input
                      required
                      value={form.parentContact}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          parentContact: e.target.value,
                        }))
                      }
                      style={{
                        padding: isSmallMobile ? 10 : 12,
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.inputBg,
                        color: colors.text,
                        fontSize: isSmallMobile ? 14 : 15,
                      }}
                    />
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
                      fontSize: isSmallMobile ? 14 : 15,
                    }}
                  >
                    Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                    style={{
                      padding: isSmallMobile ? 10 : 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background: colors.inputBg,
                      color: colors.text,
                      fontSize: isSmallMobile ? 14 : 15,
                      minHeight: isSmallMobile ? 60 : 80,
                      resize: "vertical",
                    }}
                  />
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
                      setShowForm(false);
                      setEditId(null);
                    }}
                    style={{
                      background: "transparent",
                      color: colors.accent,
                      border: `1px solid ${colors.accent}`,
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
                      order: isMobile ? 1 : 2,
                    }}
                  >
                    {editId ? "Update Student" : "Add Student"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Management Modal */}
      <AnimatePresence>
        {showCourseForm && (
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
                maxWidth: 800,
                maxHeight: isSmallMobile ? "92vh" : isMobile ? "85vh" : "90vh",
                overflow: "auto",
                padding: 0,
                borderRadius: 16,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                background: colors.card,
              }}
            >
              <div style={{ padding: isSmallMobile ? 16 : isMobile ? 20 : 32 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
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
                      gap: 10,
                    }}
                  >
                    <FaBook style={{ color: colors.success }} />
                    {editCourseId ? "Edit Course" : "Course Management"}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      setShowCourseForm(false);
                      setEditCourseId(null);
                      setCourseForm({
                        name: "",
                        description: "",
                        category: "",
                        duration: "",
                      });
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

                {/* Course Form */}
                <div>
                  <form
                    onSubmit={handleCourseSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isSmallMobile ? 16 : isMobile ? 20 : 20,
                      marginBottom: 24,
                      padding: 16,
                      background:
                        theme === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.02)",
                      borderRadius: 12,
                      border: `1px solid ${colors.border}`,
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
                          fontSize: isSmallMobile ? 14 : 15,
                        }}
                      >
                        Course Name *
                      </label>
                      <input
                        required
                        value={courseForm.name}
                        onChange={(e) =>
                          setCourseForm((f) => ({ ...f, name: e.target.value }))
                        }
                        style={{
                          padding: isSmallMobile ? 10 : 12,
                          borderRadius: 8,
                          border: `1px solid ${colors.border}`,
                          background: colors.inputBg,
                          color: colors.text,
                          fontSize: isSmallMobile ? 14 : 15,
                        }}
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
                            fontSize: isSmallMobile ? 14 : 15,
                          }}
                        >
                          Category
                        </label>
                        <input
                          value={courseForm.category}
                          onChange={(e) =>
                            setCourseForm((f) => ({
                              ...f,
                              category: e.target.value,
                            }))
                          }
                          style={{
                            padding: isSmallMobile ? 10 : 12,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            background: colors.inputBg,
                            color: colors.text,
                            fontSize: isSmallMobile ? 14 : 15,
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
                          Duration
                        </label>
                        <input
                          value={courseForm.duration}
                          onChange={(e) =>
                            setCourseForm((f) => ({
                              ...f,
                              duration: e.target.value,
                            }))
                          }
                          style={{
                            padding: isSmallMobile ? 10 : 12,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            background: colors.inputBg,
                            color: colors.text,
                            fontSize: isSmallMobile ? 14 : 15,
                          }}
                          placeholder="e.g. 8 weeks, 3 months"
                        />
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
                          fontSize: isSmallMobile ? 14 : 15,
                        }}
                      >
                        Description
                      </label>
                      <textarea
                        value={courseForm.description}
                        onChange={(e) =>
                          setCourseForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        style={{
                          padding: isSmallMobile ? 10 : 12,
                          borderRadius: 8,
                          border: `1px solid ${colors.border}`,
                          background: colors.inputBg,
                          color: colors.text,
                          fontSize: isSmallMobile ? 14 : 15,
                          minHeight: isSmallMobile ? 80 : 100,
                          resize: "vertical",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: isSmallMobile ? 8 : 16,
                        justifyContent: "flex-end",
                        flexDirection: isMobile ? "column" : "row",
                      }}
                    >
                      <motion.button
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        type="submit"
                        style={{
                          background:
                            "linear-gradient(90deg, #10b981, #059669)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 10,
                          padding: isSmallMobile ? "10px 24px" : "12px 32px",
                          fontWeight: 600,
                          fontSize: isSmallMobile ? 14 : 15,
                          cursor: "pointer",
                          boxShadow: colors.buttonShadow,
                          order: isMobile ? 1 : 2,
                        }}
                      >
                        {editCourseId ? "Update Course" : "Add Course"}
                      </motion.button>
                    </div>
                  </form>
                </div>

                {/* Course List */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                      Available Courses
                    </h3>
                    <motion.button
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      onClick={() => {
                        setEditCourseId(null);
                        setCourseForm({
                          name: "",
                          description: "",
                          category: "",
                          duration: "",
                        });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: colors.accentLight,
                        color: colors.accent,
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontWeight: 500,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      <FaPlus size={12} /> New Course
                    </motion.button>
                  </div>

                  {courses.length === 0 ? (
                    <div
                      style={{
                        padding: 24,
                        textAlign: "center",
                        borderRadius: 12,
                        background:
                          theme === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                        border: `1px solid ${colors.border}`,
                        color: colors.textSecondary,
                      }}
                    >
                      No courses available. Create your first course.
                    </div>
                  ) : (
                    <div
                      style={{
                        maxHeight: 400,
                        overflow: "auto",
                        borderRadius: 12,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {courses.map((course) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            padding: 16,
                            borderBottom: `1px solid ${colors.border}`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background:
                              theme === "dark"
                                ? "rgba(255,255,255,0.02)"
                                : "white",
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                margin: 0,
                                fontSize: 16,
                                fontWeight: 600,
                              }}
                            >
                              {course.name}
                            </h4>
                            <p
                              style={{
                                margin: "4px 0 0 0",
                                fontSize: 14,
                                color: colors.textSecondary,
                              }}
                            >
                              {course.category}
                              {course.duration ? ` • ${course.duration}` : ""}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCourseEdit(course)}
                              style={{
                                background: colors.warning,
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: 13,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <FaPen size={11} /> Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCourseDelete(course.id)}
                              style={{
                                background: colors.danger,
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: 13,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <FaTrashAlt size={11} /> Delete
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Courses Modal */}
      <AnimatePresence>
        {showAssignCourseModal && selectedStudent && (
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
              <div style={{ padding: isSmallMobile ? 16 : isMobile ? 20 : 32 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <h2
                    style={{
                      fontSize: isSmallMobile ? 16 : isMobile ? 18 : 22,
                      fontWeight: 700,
                      margin: 0,
                      color: colors.text,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <FaBook style={{ color: colors.success }} />
                      Manage Student Courses
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: colors.textSecondary,
                      }}
                    >
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </span>
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      setShowAssignCourseModal(false);
                      setSelectedStudent(null);
                      setStudentCourses([]);
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

                {/* Course Assignment List */}
                <div>
                  {courses.length === 0 ? (
                    <div
                      style={{
                        padding: 24,
                        textAlign: "center",
                        borderRadius: 12,
                        background:
                          theme === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                        border: `1px solid ${colors.border}`,
                        color: colors.textSecondary,
                      }}
                    >
                      No courses available. Please create courses first.
                    </div>
                  ) : (
                    <div
                      style={{
                        maxHeight: 400,
                        overflow: "auto",
                        borderRadius: 12,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {courses.map((course) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            padding: 16,
                            borderBottom: `1px solid ${colors.border}`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background:
                              theme === "dark"
                                ? "rgba(255,255,255,0.02)"
                                : "white",
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                margin: 0,
                                fontSize: 16,
                                fontWeight: 600,
                              }}
                            >
                              {course.name}
                            </h4>
                            <p
                              style={{
                                margin: "4px 0 0 0",
                                fontSize: 14,
                                color: colors.textSecondary,
                              }}
                            >
                              {course.category}
                              {course.duration ? ` • ${course.duration}` : ""}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleCourseAssignment(course.id)}
                            style={{
                              background: studentCourses.includes(course.id)
                                ? colors.danger
                                : colors.success,
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "8px 16px",
                              cursor: "pointer",
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            {studentCourses.includes(course.id)
                              ? "Remove"
                              : "Assign"}
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminStudents;

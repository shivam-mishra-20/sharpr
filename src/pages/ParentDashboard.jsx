/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaBook,
  FaCalendarCheck,
  FaCreditCard,
  FaFileAlt,
  FaComments,
  FaSync,
  FaTachometerAlt,
  FaBullhorn,
  FaBars,
  FaSignOutAlt,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import Chatbot from "../components/Chatbot";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const ParentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState(null);
  const [student, setStudent] = useState(null);
  const [homework, setHomework] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed default to false for mobile
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if the screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Only auto-open sidebar on desktop
      setSidebarOpen(!mobile);
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation items for the sidebar
  const navItems = [
    { id: "overview", label: "Overview", icon: <FaTachometerAlt /> },
    { id: "attendance", label: "Attendance", icon: <FaCalendarCheck /> },
    { id: "homework", label: "Homework", icon: <FaBook /> },
    { id: "testResults", label: "Test Results", icon: <FaFileAlt /> },
    { id: "fees", label: "Fees", icon: <FaCreditCard /> },
    { id: "notices", label: "Notices", icon: <FaBullhorn /> },
  ];

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Animation variants for mobile sidebar
  const mobileSidebarAnimation = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: -300,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Desktop sidebar animation variant
  const desktopSidebarAnimation = {
    expanded: {
      width: 240,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    collapsed: {
      width: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      // Clear all user-related state
      setParent(null);
      setStudent(null);
      setHomework([]);
      setAttendance([]);
      setFees([]);
      setTestResults([]);
      setNotices([]);
      setRecentUpdates([]);

      // Clear session storage items
      sessionStorage.removeItem("lastAuthCheck");
      sessionStorage.removeItem("userRole");
      localStorage.removeItem("auth"); // If you use localStorage for any auth data

      // Sign out from Firebase
      await signOut(auth);

      // Navigate to signup page with replace to prevent back navigation
      navigate("/signup", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Force navigation even if there's an error
      navigate("/signup", { replace: true });
    }
  };

  // Fetch parent user and student record
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Get parent info from localStorage instead of auth
        const userId = localStorage.getItem("userId");
        const userEmail = localStorage.getItem("userEmail");
        const userName = localStorage.getItem("userName");

        if (!userId || !userEmail) {
          setError("Not logged in.");
          setLoading(false);
          return;
        }

        // Set parent data from localStorage
        setParent({
          id: userId,
          email: userEmail,
          name: userName,
          role: "parent",
        });

        // Get student record linked to this parent
        const studentQuery = query(
          collection(db, "students"),
          where("email", "==", userEmail) // Match by email
        );

        const studentSnap = await getDocs(studentQuery);

        if (studentSnap.empty) {
          // Set default student data if none found
          setStudent({
            id: null,
            firstName: userName?.split(" ")[0] || "Not",
            lastName: userName?.split(" ")[1] || "Available",
            class: "Not Assigned",
            email: userEmail,
            fullName: userName || "Not Available",
            status: "Active",
          });

          // Set empty arrays for related data
          setHomework([]);
          setAttendance([]);
          setFees([]);
          setTestResults([]);
          setNotices([]);
          setRecentUpdates([]);

          setLoading(false);
          return;
        }

        // Continue with your existing code to fetch student data
        const studentData = {
          id: studentSnap.docs[0].id,
          ...studentSnap.docs[0].data(),
        };
        setStudent(studentData);

        // Fetch related data for this student
        const [homeworkSnap, attendanceSnap, feesSnap, testSnap] =
          await Promise.all([
            getDocs(
              query(
                collection(db, "homework"),
                where("class", "==", studentData.class)
              )
            ),
            getDocs(
              query(
                collection(db, "attendance"),
                where("studentId", "==", studentData.id)
              )
            ),
            getDocs(
              query(
                collection(db, "fees"),
                where("studentId", "==", studentData.id)
              )
            ),
            getDocs(
              query(
                collection(db, "testResults"),
                where("studentId", "==", studentData.id)
              )
            ),
          ]);

        // Process the data
        setHomework(homeworkSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setAttendance(
          attendanceSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
        setFees(feesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setTestResults(testSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Fetch notices with proper filtering:
        // 1. Notices for all students
        // 2. Notices for this student's class
        // 3. Notices for this specific student
        const noticeQueries = [
          query(
            collection(db, "notices"),
            where("audience", "==", "All Students")
          ),
          query(
            collection(db, "notices"),
            where("audience", "==", "Class"),
            where("targetClass", "==", studentData.class)
          ),
          query(
            collection(db, "notices"),
            where("audience", "==", "Individual Student"),
            where("targetStudent", "==", studentData.id)
          ),
        ];

        // Execute all notice queries in parallel
        const noticeResults = await Promise.all(
          noticeQueries.map((q) => getDocs(q))
        );

        // Combine all notice results, removing duplicates by ID
        const noticesMap = new Map();
        noticeResults.forEach((snapshot) => {
          snapshot.docs.forEach((doc) => {
            if (!noticesMap.has(doc.id)) {
              noticesMap.set(doc.id, { id: doc.id, ...doc.data() });
            }
          });
        });

        // Process notices - ensure they have all required fields
        const processedNotices = Array.from(noticesMap.values()).map((data) => {
          return {
            id: data.id,
            ...data,
            title: data.title || "Untitled Notice",
            content: data.content || "",
            priority: data.priority || "Medium",
            audience: data.audience || "All Students",
            targetClass: data.targetClass || "",
            targetStudent: data.targetStudent || null,
            createdAt: data.createdAt || new Date(),
          };
        });
        setNotices(processedNotices);

        // Recent updates (last 5, sorted by date)
        const updates = [];
        for (const h of homeworkSnap.docs) {
          updates.push({
            type: "homework",
            title: h.data().title,
            date: h.data().assignedDate || "",
            desc: "Homework assigned",
          });
        }
        for (const a of attendanceSnap.docs) {
          updates.push({
            type: "attendance",
            title: a.data().status,
            date: a.data().date,
            desc: `Attendance marked: ${a.data().status}`,
          });
        }
        for (const f of feesSnap.docs) {
          updates.push({
            type: "fee",
            title: f.data().feeType,
            date: f.data().dueDate,
            desc: `Fee status: ${f.data().status}`,
          });
        }
        for (const t of testSnap.docs) {
          updates.push({
            type: "testResult",
            title: t.data().subject,
            date: t.data().testDate,
            desc: `Test result: ${t.data().marksObtained}/${
              t.data().totalMarks
            }`,
          });
        }
        // Recent updates - add notices
        for (const n of processedNotices) {
          updates.push({
            type: "notice",
            title: n.title || "Untitled Notice",
            date: n.createdAt?.toDate?.()
              ? n.createdAt.toDate().toLocaleString()
              : typeof n.createdAt === "string"
              ? n.createdAt
              : "",
            desc: n.content || "No details available",
          });
        }
        updates.sort((a, b) => (b.date > a.date ? 1 : -1));
        setRecentUpdates(updates.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard: " + err.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Dashboard stats for this student
  const attendanceTotal = attendance.length;
  const attendancePresent = attendance.filter(
    (a) => a.status === "present"
  ).length;
  const attendancePercent =
    attendanceTotal > 0
      ? Math.round((attendancePresent / attendanceTotal) * 100) + "%"
      : "0%";
  const pendingFees = fees
    .filter((f) => f.status === "pending")
    .reduce((sum, f) => sum + (parseInt(f.amount, 10) || 0), 0);

  // Theme colors (match AdminDashboard)
  const colors = {
    background: "#f7f8fa",
    card: "#fff",
    text: "#232946",
    textSecondary: "#64748b",
    border: "#e5e7eb",
    highlight: "#4f46e5",
    highlightSecondary: "#818cf8",
    icon: "#4f46e5",
    iconBg: "rgba(79, 70, 229, 0.1)",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    shadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    shadowHover: "0 8px 24px rgba(0, 0, 0, 0.1)",
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.background,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "5px solid #e5e7eb",
            borderTopColor: "#4f46e5",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.background,
        }}
      >
        <div style={{ color: colors.danger, fontSize: 20 }}>{error}</div>
      </div>
    );
  }
  if (!student) {
    return null;
  }

  // Mobile-optimized card component
  const MobileStatsCard = ({ title, value, description, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: colors.card,
        borderRadius: "12px",
        padding: "16px",
        boxShadow: colors.shadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: `1px solid ${colors.border}`,
        marginBottom: "16px",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "13px",
            color: colors.textSecondary,
            marginBottom: "5px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: colors.text,
          }}
        >
          {value}
        </div>
        {description && (
          <div
            style={{
              fontSize: "12px",
              color: colors.success,
              marginTop: "5px",
            }}
          >
            {description}
          </div>
        )}
      </div>
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: colors.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.highlight,
        }}
      >
        {icon}
      </div>
    </motion.div>
  );

  // Mobile-optimized table component
  const MobileTable = ({ columns, data, emptyMessage }) => (
    <div style={{ marginTop: "16px" }}>
      {data.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "16px",
            color: colors.textSecondary,
          }}
        >
          {emptyMessage || "No data available"}
        </div>
      ) : (
        data.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              backgroundColor: index % 2 === 0 ? colors.card : "#f8fafc",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {columns.map((column) => (
              <div key={column.key} style={{ marginBottom: "6px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: colors.textSecondary,
                  }}
                >
                  {column.title}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: column.primary ? "600" : "normal",
                    color: column.colorFn
                      ? column.colorFn(item[column.key])
                      : colors.text,
                  }}
                >
                  {item[column.key]}
                </div>
              </div>
            ))}
            {item.actions && (
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {item.actions}
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );

  // Mobile view for the active section
  const renderMobileContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            {/* Student Info */}
            <MobileStatsCard
              title="Student"
              value={parent?.name}
              description={student?.class || "Not Assigned"}
              icon={<FaUser size={20} />}
            />

            {/* Attendance */}
            <MobileStatsCard
              title="Attendance"
              value={attendancePercent}
              description={`${attendancePresent} Present / ${attendanceTotal} Total`}
              icon={<FaCalendarCheck size={20} />}
            />

            {/* Homework */}
            <MobileStatsCard
              title="Homework"
              value={homework.length}
              description={
                homework.length > 0 ? homework[0].title : "No homework assigned"
              }
              icon={<FaBook size={20} />}
            />

            {/* Fees */}
            <MobileStatsCard
              title="Pending Fees"
              value={`₹${pendingFees}`}
              description={pendingFees === 0 ? "All paid" : "Pending"}
              icon={<FaCreditCard size={20} />}
            />

            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginTop: "24px",
                marginBottom: "16px",
              }}
            >
              Recent Updates
            </h2>

            {/* Recent Updates List */}
            {recentUpdates.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  color: colors.textSecondary,
                }}
              >
                No recent updates found.
              </div>
            ) : (
              recentUpdates.map((update, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    backgroundColor: colors.card,
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    boxShadow: colors.shadow,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        background: colors.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.highlight,
                        marginRight: "8px",
                      }}
                    >
                      {update.type === "attendance" && (
                        <FaCalendarCheck size={12} />
                      )}
                      {update.type === "homework" && <FaBook size={12} />}
                      {update.type === "fee" && <FaCreditCard size={12} />}
                      {update.type === "testResult" && <FaFileAlt size={12} />}
                      {update.type === "notice" && <FaBullhorn size={12} />}
                    </div>
                    <div
                      style={{
                        color: colors.text,
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {update.title}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: colors.textSecondary,
                      marginLeft: "32px",
                    }}
                  >
                    {update.desc}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: colors.textSecondary,
                      marginTop: "6px",
                      textAlign: "right",
                    }}
                  >
                    {update.date}
                  </div>
                </motion.div>
              ))
            )}
          </>
        );

      case "attendance":
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  borderRadius: "8px",
                  background: colors.iconBg,
                  padding: "10px",
                  marginRight: "10px",
                }}
              >
                <div
                  style={{
                    color: colors.textSecondary,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  Total
                </div>
                <div
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    fontSize: "18px",
                    textAlign: "center",
                  }}
                >
                  {attendanceTotal}
                </div>
              </div>
              <div
                style={{
                  borderRadius: "8px",
                  background: colors.iconBg,
                  padding: "10px",
                  marginRight: "10px",
                }}
              >
                <div
                  style={{
                    color: colors.textSecondary,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  Present
                </div>
                <div
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    fontSize: "18px",
                    textAlign: "center",
                  }}
                >
                  {attendancePresent}
                </div>
              </div>
              <div
                style={{
                  borderRadius: "8px",
                  background: colors.iconBg,
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: colors.textSecondary,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  Percentage
                </div>
                <div
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    fontSize: "18px",
                    textAlign: "center",
                  }}
                >
                  {attendancePercent}
                </div>
              </div>
            </div>

            <MobileTable
              columns={[
                { key: "date", title: "Date", primary: true },
                {
                  key: "status",
                  title: "Status",
                  colorFn: (value) =>
                    value === "present" ? colors.success : colors.danger,
                },
                { key: "class", title: "Class" },
              ]}
              data={attendance.sort((a, b) => (b.date > a.date ? 1 : -1))}
              emptyMessage="No attendance records found."
            />
          </>
        );

      case "homework":
        return (
          <MobileTable
            columns={[
              { key: "title", title: "Title", primary: true },
              { key: "subject", title: "Subject" },
              { key: "dueDate", title: "Due Date" },
              { key: "description", title: "Description" },
            ]}
            data={homework.sort((a, b) => (b.dueDate > a.dueDate ? 1 : -1))}
            emptyMessage="No homework assignments found."
          />
        );

      case "testResults":
        return (
          <>
            {testResults.length > 0 && (
              <div
                style={{
                  background: colors.iconBg,
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: colors.textSecondary,
                    fontSize: "12px",
                    marginBottom: "4px",
                  }}
                >
                  Average Score
                </div>
                <div
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    fontSize: "22px",
                  }}
                >
                  {Math.round(
                    testResults.reduce(
                      (sum, t) => sum + t.marksObtained / t.totalMarks + 100,
                      0
                    ) / testResults.length
                  )}
                  %
                </div>
              </div>
            )}

            <MobileTable
              columns={[
                { key: "subject", title: "Subject", primary: true },
                { key: "testType", title: "Test Type" },
                { key: "testDate", title: "Date" },
                {
                  key: "marks",
                  title: "Marks",
                  render: (item) =>
                    `${item.marksObtained}/${item.totalMarks} (${Math.round(
                      (item.marksObtained / item.totalMarks) * 100
                    )}%)`,
                },
              ]}
              data={testResults.map((t) => ({
                ...t,
                marks: `${t.marksObtained}/${t.totalMarks}`,
              }))}
              emptyMessage="No test results found."
            />
          </>
        );

      case "fees":
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  borderRadius: "8px",
                  background: colors.iconBg,
                  padding: "10px",
                  flex: 1,
                  marginRight: "10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: colors.textSecondary,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  Pending
                </div>
                <div
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    fontSize: "18px",
                    textAlign: "center",
                  }}
                >
                  ₹{pendingFees}
                </div>
              </div>
              <div
                style={{
                  borderRadius: "8px",
                  background: colors.iconBg,
                  padding: "10px",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: colors.textSecondary,
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  Paid
                </div>
                <div
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    fontSize: "18px",
                    textAlign: "center",
                  }}
                >
                  ₹
                  {fees
                    .filter((f) => f.status === "paid")
                    .reduce((sum, f) => sum + (parseInt(f.amount, 10) || 0), 0)}
                </div>
              </div>
            </div>

            <MobileTable
              columns={[
                { key: "feeType", title: "Fee Type", primary: true },
                {
                  key: "amount",
                  title: "Amount",
                  render: (item) => `₹${item.amount}`,
                },
                { key: "dueDate", title: "Due Date" },
                {
                  key: "status",
                  title: "Status",
                  colorFn: (value) =>
                    value === "paid"
                      ? colors.success
                      : value === "partial"
                      ? colors.warning
                      : colors.danger,
                },
              ]}
              data={fees.sort((a, b) => (b.dueDate > a.dueDate ? 1 : -1))}
              emptyMessage="No fee records found."
            />
          </>
        );

      case "notices":
        return (
          <div
            style={{
              background: colors.card,
              borderRadius: "16px",
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
              marginBottom: "40px",
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: colors.text,
                padding: "20px 24px",
              }}
            >
              Notices
            </h2>
            <div style={{ padding: "0 24px 20px" }}>
              {notices.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: colors.textSecondary,
                  }}
                >
                  No notices found.
                </div>
              ) : (
                notices
                  .sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || new Date(0);
                    const dateB = b.createdAt?.toDate?.() || new Date(0);
                    return dateB - dateA;
                  })
                  .map((notice) => (
                    <div
                      key={notice.id}
                      style={{
                        marginBottom: 16,
                        padding: 16,
                        borderRadius: 8,
                        background: "#f8fafc",
                        borderLeft: `4px solid ${
                          notice.priority === "High"
                            ? colors.danger
                            : notice.priority === "Medium"
                            ? colors.warning
                            : colors.success
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 18,
                            margin: 0,
                            color: colors.text,
                            fontWeight: 600,
                          }}
                        >
                          {notice.title}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          {notice.targetStudentId && (
                            <span
                              style={{
                                fontSize: 12,
                                padding: "2px 8px",
                                borderRadius: 12,
                                background: "rgba(79, 70, 229, 0.1)",
                                color: colors.highlight,
                              }}
                            >
                              Personal
                            </span>
                          )}
                          {notice.targetClass &&
                            notice.targetClass !== "All" && (
                              <span
                                style={{
                                  fontSize: 12,
                                  padding: "2px 8px",
                                  borderRadius: 12,
                                  background: "rgba(16, 185, 129, 0.1)",
                                  color: colors.success,
                                }}
                              >
                                Class {notice.targetClass}
                              </span>
                            )}
                          <span
                            style={{
                              fontSize: 12,
                              padding: "2px 8px",
                              borderRadius: 12,
                              background:
                                notice.priority === "High"
                                  ? "rgba(239, 68, 68, 0.1)"
                                  : notice.priority === "Medium"
                                  ? "rgba(245, 158, 11, 0.1)"
                                  : "rgba(16, 185, 129, 0.1)",
                              color:
                                notice.priority === "High"
                                  ? colors.danger
                                  : notice.priority === "Medium"
                                  ? colors.warning
                                  : colors.success,
                            }}
                          >
                            {notice.priority}
                          </span>
                        </div>
                      </div>
                      <p style={{ margin: "8px 0", color: colors.text }}>
                        {notice.content}
                      </p>
                      <div
                        style={{
                          fontSize: 12,
                          color: colors.textSecondary,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          Posted:{" "}
                          {notice.createdAt?.toDate?.().toLocaleString?.() ||
                            ""}
                        </span>
                        <span>
                          For:{" "}
                          {notice.targetStudentId
                            ? "You specifically"
                            : notice.targetClass && notice.targetClass !== "All"
                            ? `Class ${notice.targetClass}`
                            : notice.audience}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render components based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            {/* Dashboard Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "24px",
                marginBottom: "40px",
              }}
            >
              {/* Student Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                      letterSpacing: 1,
                    }}
                  >
                    Student Name
                  </div>

                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {parent?.name}
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
                    {student.class}
                  </div>
                </div>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: colors.iconBg,
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
              </motion.div>

              {/* Attendance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                    Attendance
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {attendancePercent}
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
                    {attendancePresent} Present / {attendanceTotal} Total
                  </div>
                </div>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: colors.iconBg,
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
              </motion.div>

              {/* Homework */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                    Homework Assigned
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {homework.length}
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
                    {homework.length > 0
                      ? homework[0].title
                      : "No homework assigned"}
                  </div>
                </div>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: colors.iconBg,
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
              </motion.div>

              {/* Pending Fees */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                      fontSize: "28px",
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    ₹{pendingFees}
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
                    {pendingFees === 0 ? "All paid" : "Pending"}
                  </div>
                </div>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: colors.iconBg,
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
              </motion.div>
            </div>

            {/* Recent Updates */}
            <div
              style={{
                background: colors.card,
                borderRadius: "16px",
                boxShadow: colors.shadow,
                border: `1px solid ${colors.border}`,
                marginBottom: "40px",
                overflow: "hidden",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: colors.text,
                  padding: "20px 24px 0 24px",
                }}
              >
                Recent Updates
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                    color: colors.text,
                    marginTop: 8,
                  }}
                >
                  <thead
                    style={{
                      backgroundColor: "#f8fafc",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <tr>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>
                        Type
                      </th>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>
                        Title
                      </th>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>
                        Date
                      </th>
                      <th style={{ padding: "12px 16px", textAlign: "left" }}>
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUpdates.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          style={{ textAlign: "center", padding: 24 }}
                        >
                          No recent updates.
                        </td>
                      </tr>
                    ) : (
                      recentUpdates.map((u, i) => (
                        <tr key={u.type + u.title + i}>
                          <td style={{ padding: "10px 16px" }}>
                            {u.type === "attendance" && <FaCalendarCheck />}
                            {u.type === "homework" && <FaBook />}
                            {u.type === "fee" && <FaCreditCard />}
                            {u.type === "testResult" && <FaFileAlt />}
                            {u.type === "notice" && <FaComments />}
                            <span
                              style={{
                                marginLeft: 8,
                                textTransform: "capitalize",
                              }}
                            >
                              {u.type}
                            </span>
                          </td>
                          <td style={{ padding: "10px 16px" }}>{u.title}</td>
                          <td style={{ padding: "10px 16px" }}>{u.date}</td>
                          <td style={{ padding: "10px 16px" }}>{u.desc}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case "attendance":
        return (
          <div
            style={{
              background: colors.card,
              borderRadius: "16px",
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
              marginBottom: "40px",
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: colors.text,
                padding: "20px 24px",
              }}
            >
              Attendance Records
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                  color: colors.text,
                  minWidth: "500px", // Ensure table doesn't get too narrow
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#f8fafc",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <tr>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Date
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Status
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Class
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        style={{ textAlign: "center", padding: 24 }}
                      >
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    attendance
                      .sort((a, b) => (b.date > a.date ? 1 : -1))
                      .map((record) => (
                        <tr key={record.id}>
                          <td style={{ padding: "10px 16px" }}>
                            {record.date}
                          </td>
                          <td
                            style={{
                              padding: "10px 16px",
                              color:
                                record.status === "present"
                                  ? colors.success
                                  : colors.danger,
                              textTransform: "capitalize",
                            }}
                          >
                            {record.status}
                          </td>
                          <td style={{ padding: "10px 16px" }}>
                            {record.class}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "16px 24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>
                    Attendance Percentage:
                  </span>{" "}
                  {attendancePercent}
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>Present Days:</span>{" "}
                  {attendancePresent} / {attendanceTotal}
                </div>
              </div>
            </div>
          </div>
        );

      case "homework":
        return (
          <div
            style={{
              background: colors.card,
              borderRadius: "16px",
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
              marginBottom: "40px",
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: colors.text,
                padding: "20px 24px",
              }}
            >
              Homework Assignments
            </h2>
            <div style={{ overflowX: "auto" }}>
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
                    backgroundColor: "#f8fafc",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <tr>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Title
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Subject
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Assigned Date
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {homework.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        style={{ textAlign: "center", padding: 24 }}
                      >
                        No homework assignments found.
                      </td>
                    </tr>
                  ) : (
                    homework
                      .sort((a, b) => (b.dueDate > a.dueDate ? 1 : -1))
                      .map((hw) => (
                        <tr
                          key={hw.id}
                          style={{ borderBottom: "1px solid #eee" }}
                        >
                          <td style={{ padding: "12px 16px", fontWeight: 500 }}>
                            {hw.title}
                          </td>
                          <td style={{ padding: "12px 16px" }}>{hw.subject}</td>
                          <td style={{ padding: "12px 16px" }}>
                            {hw.assignedDate || "Not specified"}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            {hw.dueDate || "Not specified"}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            {homework.length > 0 && (
              <div style={{ padding: "16px 24px" }}>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>
                  Latest Assignment Details:
                </h3>
                <div
                  style={{
                    padding: "12px",
                    background: "#f8fafc",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{homework[0].title}</div>
                  <div style={{ marginTop: 8 }}>{homework[0].description}</div>
                </div>
              </div>
            )}
          </div>
        );

      case "testResults":
        return (
          <div
            style={{
              background: colors.card,
              borderRadius: "16px",
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
              marginBottom: "40px",
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: colors.text,
                padding: "20px 24px",
              }}
            >
              Test Results
            </h2>
            <div style={{ overflowX: "auto" }}>
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
                    backgroundColor: "#f8fafc",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <tr>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Subject
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Test Type
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Date
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Marks
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", padding: 24 }}
                      >
                        No test results found.
                      </td>
                    </tr>
                  ) : (
                    testResults
                      .sort((a, b) => (b.testDate > a.testDate ? 1 : -1))
                      .map((t) => (
                        <tr key={t.id}>
                          <td style={{ padding: "10px 16px" }}>{t.subject}</td>
                          <td style={{ padding: "10px 16px" }}>{t.testType}</td>
                          <td style={{ padding: "10px 16px" }}>{t.testDate}</td>
                          <td style={{ padding: "10px 16px" }}>
                            {t.marksObtained}/{t.totalMarks}
                          </td>
                          <td style={{ padding: "10px 16px" }}>
                            {Math.round((t.marksObtained / t.totalMarks) * 100)}
                            %
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            {testResults.length > 0 && (
              <div style={{ padding: "16px 24px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>Average Score:</span>{" "}
                    {Math.round(
                      testResults.reduce(
                        (sum, t) =>
                          sum + (t.marksObtained / t.totalMarks) * 100,
                        0
                      ) / testResults.length
                    )}
                    %
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "fees":
        return (
          <div
            style={{
              background: colors.card,
              borderRadius: "16px",
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
              marginBottom: "40px",
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: colors.text,
                padding: "20px 24px",
              }}
            >
              Fee Records
            </h2>
            <div style={{ overflowX: "auto" }}>
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
                    backgroundColor: "#f8fafc",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <tr>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Fee Type
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Amount
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Due Date
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Status
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Payment Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", padding: 24 }}
                      >
                        No fee records found.
                      </td>
                    </tr>
                  ) : (
                    fees
                      .sort((a, b) => (b.dueDate > a.dueDate ? 1 : -1))
                      .map((fee) => (
                        <tr key={fee.id}>
                          <td style={{ padding: "10px 16px" }}>
                            {fee.feeType}
                          </td>
                          <td style={{ padding: "10px 16px" }}>
                            ₹{fee.amount}
                          </td>
                          <td style={{ padding: "10px 16px" }}>
                            {fee.dueDate}
                          </td>
                          <td
                            style={{
                              padding: "10px 16px",
                              color:
                                fee.status === "paid"
                                  ? colors.success
                                  : fee.status === "partial"
                                  ? colors.warning
                                  : colors.danger,
                              textTransform: "capitalize",
                            }}
                          >
                            {fee.status}
                          </td>
                          <td style={{ padding: "10px 16px" }}>
                            {fee.paymentDate || "-"}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "16px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontWeight: 600 }}>Total Pending:</span> ₹
                  {pendingFees}
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>Total Paid:</span> ₹
                  {fees
                    .filter((f) => f.status === "paid")
                    .reduce((sum, f) => sum + (parseInt(f.amount, 10) || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        );

      case "notices":
        return (
          <div
            style={{
              background: colors.card,
              borderRadius: "16px",
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
              marginBottom: "40px",
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: colors.text,
                padding: "20px 24px",
              }}
            >
              Notices
            </h2>
            <div style={{ padding: "0 24px 20px" }}>
              {notices.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: colors.textSecondary,
                  }}
                >
                  No notices found.
                </div>
              ) : (
                notices
                  .sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || new Date(0);
                    const dateB = b.createdAt?.toDate?.() || new Date(0);
                    return dateB - dateA;
                  })
                  .map((notice) => (
                    <div
                      key={notice.id}
                      style={{
                        marginBottom: 16,
                        padding: 16,
                        borderRadius: 8,
                        background: "#f8fafc",
                        borderLeft: `4px solid ${
                          notice.priority === "High"
                            ? colors.danger
                            : notice.priority === "Medium"
                            ? colors.warning
                            : colors.success
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 18,
                            margin: 0,
                            color: colors.text,
                            fontWeight: 600,
                          }}
                        >
                          {notice.title}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          {notice.targetStudentId && (
                            <span
                              style={{
                                fontSize: 12,
                                padding: "2px 8px",
                                borderRadius: 12,
                                background: "rgba(79, 70, 229, 0.1)",
                                color: colors.highlight,
                              }}
                            >
                              Personal
                            </span>
                          )}
                          {notice.targetClass &&
                            notice.targetClass !== "All" && (
                              <span
                                style={{
                                  fontSize: 12,
                                  padding: "2px 8px",
                                  borderRadius: 12,
                                  background: "rgba(16, 185, 129, 0.1)",
                                  color: colors.success,
                                }}
                              >
                                Class {notice.targetClass}
                              </span>
                            )}
                          <span
                            style={{
                              fontSize: 12,
                              padding: "2px 8px",
                              borderRadius: 12,
                              background:
                                notice.priority === "High"
                                  ? "rgba(239, 68, 68, 0.1)"
                                  : notice.priority === "Medium"
                                  ? "rgba(245, 158, 11, 0.1)"
                                  : "rgba(16, 185, 129, 0.1)",
                              color:
                                notice.priority === "High"
                                  ? colors.danger
                                  : notice.priority === "Medium"
                                  ? colors.warning
                                  : colors.success,
                            }}
                          >
                            {notice.priority}
                          </span>
                        </div>
                      </div>
                      <p style={{ margin: "8px 0", color: colors.text }}>
                        {notice.content}
                      </p>
                      <div
                        style={{
                          fontSize: 12,
                          color: colors.textSecondary,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          Posted:{" "}
                          {notice.createdAt?.toDate?.().toLocaleString?.() ||
                            ""}
                        </span>
                        <span>
                          For:{" "}
                          {notice.targetStudentId
                            ? "You specifically"
                            : notice.targetClass && notice.targetClass !== "All"
                            ? `Class ${notice.targetClass}`
                            : notice.audience}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        paddingTop: isMobile ? 55 : 55, // Adjust for topbar height
      }}
    >
      {/* Enhanced Topbar */}
      <header
        style={{
          height: 64,
          background: "#fff",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          boxShadow: "0 2px 8px rgba(90, 115, 252, 0.04)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            style={{
              background: "none",
              border: "none",
              color: colors.text,
              fontSize: 24,
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            {isMobile ? <FaBars /> : sidebarOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
          <motion.img
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
            src="/logo-01.jpg"
            alt="Sharpr Logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              objectFit: "cover",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          />
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontWeight: 700,
              fontSize: isMobile ? 16 : 20,
              color: "#232946",
              letterSpacing: 0.5,
              display: isMobile ? "none" : "block",
            }}
          >
            Sharpr Parent Dashboard
          </motion.span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "6px 12px",
              background: colors.iconBg,
              borderRadius: "24px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: colors.highlight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <FaUser size={16} />
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: colors.text,
                maxWidth: isMobile ? "100px" : "160px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {parent?.name || "Parent"}
            </span>
          </div>

          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: colors.danger,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <FaSignOutAlt size={15} />
              <span>Logout</span>
            </motion.button>
          )}
        </div>
      </header>

      {/* Main Content with Enhanced Sidebar */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Mobile Sidebar with AnimatePresence - REPLACE this section */}
        {isMobile && (
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Backdrop for mobile sidebar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "black",
                    zIndex: 900,
                  }}
                />

                {/* Mobile sidebar with improved animation */}
                <motion.aside
                  key="mobile-sidebar"
                  variants={mobileSidebarAnimation}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{
                    width: "260px",
                    background: colors.card,
                    color: colors.text,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "1px 0 20px rgba(0,0,0,0.25)",
                    zIndex: 1000,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "28px 0 20px 0",
                      textAlign: "center",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src="/logo-01.jpg"
                        alt="Sharpr Logo"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "14px",
                          marginBottom: 8,
                          objectFit: "cover",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                        }}
                      />
                    </motion.div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 20,
                        letterSpacing: "0.5px",
                        color: colors.text,
                        marginTop: "10px",
                      }}
                    >
                      Parent Dashboard
                    </div>
                  </div>
                  <nav style={{ flex: 1, marginTop: 20, padding: "10px 0" }}>
                    {navItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial="rest"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div
                          onClick={() => {
                            setActiveSection(item.id);
                            setSidebarOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            padding: "12px 16px",
                            marginLeft: "12px",
                            marginRight: "12px",
                            marginBottom: "2px",
                            borderRadius: "8px",
                            color:
                              activeSection === item.id
                                ? colors.highlight
                                : colors.textSecondary,
                            background:
                              activeSection === item.id
                                ? colors.iconBg
                                : "transparent",
                            fontWeight: activeSection === item.id ? 600 : 500,
                            textDecoration: "none",
                            fontSize: 15,
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          <FaChevronRight size={12} />
                        </div>
                      </motion.div>
                    ))}
                  </nav>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    style={{
                      margin: "16px 16px 24px 16px",
                      padding: "12px 0",
                      border: "none",
                      borderRadius: 8,
                      background: colors.highlight,
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
                    }}
                  >
                    <FaSignOutAlt /> Sign Out
                  </motion.button>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        )}

        {/* Enhanced Desktop Sidebar */}
        {!isMobile && (
          <motion.aside
            variants={desktopSidebarAnimation}
            initial={false}
            animate={sidebarOpen ? "expanded" : "collapsed"}
            style={{
              background: colors.card,
              borderRight: `1px solid ${colors.border}`,
              overflowY: "auto",
              overflowX: "hidden",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              height: "calc(100vh - 64px)",
              position: "sticky",
              top: 64,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* User Profile Section */}
              <div
                style={{
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",

                  textAlign: "center",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: colors.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <FaUser size={40} color={colors.highlight} />
                </motion.div>
                <div style={{ marginTop: "4px" }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {parent?.name || "Parent User"}
                  </div>
                  <div style={{ fontSize: 14, color: colors.textSecondary }}>
                    {student?.class ? `${student.class}` : ""}
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav style={{ padding: "12px 0" }}>
                {navItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      padding: "12px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      color:
                        activeSection === item.id
                          ? colors.highlight
                          : colors.textSecondary,
                      background:
                        activeSection === item.id
                          ? colors.iconBg
                          : "transparent",
                      fontWeight: activeSection === item.id ? 600 : 500,
                      transition: "all 0.2s ease",
                      borderLeft:
                        activeSection === item.id
                          ? `4px solid ${colors.highlight}`
                          : "4px solid transparent",
                      marginBottom: "2px",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: "24px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <FaChevronRight
                      size={12}
                      style={{
                        opacity: activeSection === item.id ? 1 : 0.4,
                        transform:
                          activeSection === item.id
                            ? "translateX(0)"
                            : "translateX(-4px)",
                        transition: "all 0.2s ease",
                      }}
                    />
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Logout Section in Sidebar */}
            <div
              style={{
                marginTop: "auto",
                padding: "16px 0",
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <motion.button
                whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.08)" }}
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  cursor: "pointer",
                  color: colors.danger,
                  background: "transparent",
                  fontWeight: 600,
                  border: "none",
                  textAlign: "left",
                  fontSize: "15px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: "24px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FaSignOutAlt />
                  </div>
                  <span>Logout</span>
                </div>
                <FaChevronRight size={12} />
              </motion.button>
            </div>
          </motion.aside>
        )}

        {/* Main Content Area - keep your existing code */}
        <main
          style={{
            flex: 1,
            padding: isMobile ? "20px 16px" : "32px 24px",
            overflowY: "auto",
            width: "100%",
            transition: "max-width 0.3s ease",
            overflowX: "hidden",
          }}
        >
          {/* Keep your existing main content implementation */}
          {isMobile ? renderMobileContent() : renderContent()}
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default ParentDashboard;

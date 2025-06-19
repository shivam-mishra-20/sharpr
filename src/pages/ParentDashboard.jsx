/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if the screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
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
        // Get current user
        const user = auth.currentUser;
        if (!user) {
          setError("Not logged in.");
          setLoading(false);
          return;
        }
        // Get parent user doc
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || userDoc.data().role !== "parent") {
          setError("Not authorized.");
          setLoading(false);
          return;
        }
        setParent(userDoc.data());

        // Get student record linked to this parent (by authUid)
        const q = query(
          collection(db, "students"),
          where("authUid", "==", user.uid)
        );
        const studentSnap = await getDocs(q);
        if (studentSnap.empty) {
          setError("No student record found for this parent.");
          setLoading(false);
          return;
        }
        const studentData = {
          id: studentSnap.docs[0].id,
          ...studentSnap.docs[0].data(),
        };
        setStudent(studentData);

        // Fetch related data for this student
        const [homeworkSnap, attendanceSnap, feesSnap, testSnap, noticeSnap] =
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
            getDocs(collection(db, "notices")),
          ]);
        setHomework(homeworkSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setAttendance(
          attendanceSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
        setFees(feesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setTestResults(testSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setNotices(noticeSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

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
        for (const n of noticeSnap.docs) {
          if (
            n.data().audience === "All" ||
            n.data().audience === "Parents" ||
            n.data().audience === "Students"
          ) {
            updates.push({
              type: "notice",
              title: n.data().title,
              date: n.data().createdAt?.toDate?.().toLocaleString?.() || "",
              desc: n.data().content,
            });
          }
        }
        updates.sort((a, b) => (b.date > a.date ? 1 : -1));
        setRecentUpdates(updates.slice(0, 5));
      } catch (err) {
        setError("Failed to load dashboard.");
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
              value={`${student.firstName || ""} ${student.lastName || ""}`}
              description={student.class}
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
                      (sum, t) => sum + (t.marksObtained / t.totalMarks) * 100,
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
          <>
            {notices
              .filter(
                (n) =>
                  n.audience === "All" ||
                  n.audience === "Parents" ||
                  n.audience === "Students"
              )
              .sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB - dateA;
              })
              .map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    marginBottom: 16,
                    padding: 16,
                    borderRadius: 8,
                    background: colors.card,
                    boxShadow: colors.shadow,
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
                        fontSize: 16,
                        margin: 0,
                        color: colors.text,
                        fontWeight: 600,
                      }}
                    >
                      {notice.title}
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 6px",
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
                  <p
                    style={{
                      margin: "8px 0",
                      color: colors.text,
                      fontSize: "14px",
                    }}
                  >
                    {notice.content}
                  </p>
                  <div
                    style={{
                      fontSize: 11,
                      color: colors.textSecondary,
                      marginTop: 8,
                    }}
                  >
                    Posted:{" "}
                    {notice.createdAt?.toDate?.().toLocaleString?.() || ""}
                  </div>
                </motion.div>
              ))}
            {notices.filter(
              (n) =>
                n.audience === "All" ||
                n.audience === "Parents" ||
                n.audience === "Students"
            ).length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: 24,
                  color: colors.textSecondary,
                }}
              >
                No notices found.
              </div>
            )}
          </>
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
                      letterSpacing: "0.3px",
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
                    {(student.firstName || "") + " " + (student.lastName || "")}
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
              School Notices
            </h2>
            <div style={{ padding: "0 24px 20px" }}>
              {notices
                .filter(
                  (n) =>
                    n.audience === "All" ||
                    n.audience === "Parents" ||
                    n.audience === "Students"
                )
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
                        {notice.createdAt?.toDate?.().toLocaleString?.() || ""}
                      </span>
                      {notice.expiryDate && (
                        <span>Expires: {notice.expiryDate}</span>
                      )}
                    </div>
                  </div>
                ))}
              {notices.filter(
                (n) =>
                  n.audience === "All" ||
                  n.audience === "Parents" ||
                  n.audience === "Students"
              ).length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: 24,
                    color: colors.textSecondary,
                  }}
                >
                  No notices found.
                </div>
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
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Topbar */}
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
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
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
            }}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <img
            src="/logo-01.jpg"
            alt="Sharpr Logo"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              objectFit: "cover",
              background: "#fff",
            }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: isMobile ? 16 : 20,
              color: "#232946",
              letterSpacing: 1,
              display: isMobile ? "none" : "block",
            }}
          >
            Sharpr Parent Dashboard
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FaUser style={{ fontSize: 22, color: "#232946" }} />
          <span
            style={{
              fontWeight: 600,
              fontSize: 16,
              color: "#232946",
              maxWidth: isMobile ? "100px" : "auto",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {parent?.name}
          </span>
        </div>
      </header>

      {/* Main Content with Sidebar */}

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar Navigation */}
        {(sidebarOpen || !isMobile) && (
          <div
            style={{
              width: sidebarOpen ? (isMobile ? "100%" : 240) : 0,
              background: colors.card,
              borderRight: `1px solid ${colors.border}`,
              transition: "all 0.3s ease",
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              zIndex: 20, // Increased z-index to be higher than topbar
              height: isMobile ? "100vh" : "auto", // Changed to full viewport height for mobile
              position: isMobile ? "fixed" : "sticky",
              top: isMobile ? 0 : 64, // Start from top of viewport on mobile
              left: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingTop: isMobile ? 64 : 0, // Add padding to account for topbar height on mobile
            }}
          >
            <nav style={{ padding: "16px 0" }}>
              {navItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  style={{
                    padding: "12px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    color:
                      activeSection === item.id
                        ? colors.highlight
                        : colors.textSecondary,
                    background:
                      activeSection === item.id ? colors.iconBg : "transparent",
                    fontWeight: activeSection === item.id ? 600 : 500,
                    transition: "all 0.2s ease",
                    borderLeft:
                      activeSection === item.id
                        ? `4px solid ${colors.highlight}`
                        : "4px solid transparent",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {isMobile && <FaChevronRight size={12} />}
                </div>
              ))}
            </nav>

            {/* Logout Section at bottom of sidebar */}
            <div
              style={{
                padding: "16px 0",
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <div
                onClick={handleLogout}
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  cursor: "pointer",
                  color: colors.danger,
                  background: "transparent",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  marginTop: "auto",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span>
                    <FaSignOutAlt />
                  </span>
                  <span>Logout</span>
                </div>
                {isMobile && <FaChevronRight size={12} />}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            padding: isMobile ? "20px 16px" : "32px 24px",
            overflowY: "auto",
            width: isMobile && sidebarOpen ? 0 : "100%",
            maxWidth: !isMobile && sidebarOpen ? "calc(100% - 240px)" : "100%",
            transition: "max-width 0.3s ease",
            overflowX: "hidden",
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: isMobile ? "20px" : "32px" }}
          >
            <h1
              style={{
                fontSize: isMobile ? "22px" : "28px",
                fontWeight: 700,
                marginBottom: "10px",
                color: colors.text,
                letterSpacing: "-0.5px",
              }}
            >
              {/* Show section specific title */}
              {activeSection === "overview" && "Dashboard Overview"}
              {activeSection === "attendance" && "Attendance Records"}
              {activeSection === "homework" && "Homework Assignments"}
              {activeSection === "testResults" && "Test Results"}
              {activeSection === "fees" && "Fee Management"}
              {activeSection === "notices" && "School Notices"}
            </h1>
            <p
              style={{
                fontSize: isMobile ? "14px" : "16px",
                color: colors.textSecondary,
                maxWidth: "600px",
                lineHeight: "1.5",
              }}
            >
              {student && (
                <>
                  Student: {student.firstName} {student.lastName} | Class:{" "}
                  {student.class}
                </>
              )}
            </p>
          </motion.div>

          {/* Render section based on active tab and device type */}
          {isMobile ? renderMobileContent() : renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ParentDashboard;

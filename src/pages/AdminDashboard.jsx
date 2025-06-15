/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaUserTie,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaBook,
  FaChartBar,
  FaMoneyBill,
  FaBullhorn,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const sidebarLinks = [
  {
    label: "Overview",
    to: "/admin_dashboard/overview",
    icon: <FaTachometerAlt />,
  },
  { label: "Students", to: "/admin_dashboard/students", icon: <FaUsers /> },
  {
    label: "Attendance",
    to: "/admin_dashboard/attendance",
    icon: <FaClipboardList />,
  },
  { label: "Homework", to: "/admin_dashboard/homework", icon: <FaBook /> },
  {
    label: "Test Results",
    to: "/admin_dashboard/test-results",
    icon: <FaChartBar />,
  },
  {
    label: "Fee Management",
    to: "/admin_dashboard/fee-management",
    icon: <FaMoneyBill />,
  },
  { label: "Notices", to: "/admin_dashboard/notices", icon: <FaBullhorn /> },
  // { label: "Settings", to: "/admin_dashboard/settings", icon: <FaCog /> },
  // { label: "Help", to: "/admin_dashboard/help", icon: <FaQuestionCircle /> },
];

const AdminDashboard = () => {
  const [userName, setUserName] = useState("Admin");
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch admin name if available (optional, fallback to "Admin")
  useEffect(() => {
    const fetchAdminName = async () => {
      const user = auth.currentUser;
      if (user) {
        // Try to get name from Firestore if available
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().name) {
          setUserName(docSnap.data().name);
        } else if (user.displayName) {
          setUserName(user.displayName);
        }
      }
    };
    fetchAdminName();
  }, []);

  const handleLogout = () => {
    auth.signOut().finally(() => {
      navigate("/signup");
    });
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f7f8fa",
        marginTop: "56px",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 230,
          background: "#232946",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            padding: "32px 0 24px 0",
            textAlign: "center",
            borderBottom: "1px solid #2a2d3e",
          }}
        >
          <img
            src="/src/assets/logo-01.jpg"
            alt="Sharpr Logo"
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              marginBottom: 8,
              objectFit: "cover",
              background: "#fff",
            }}
          />
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 1,
              color: "#fff",
            }}
          >
            Sharpr
          </div>
        </div>
        <nav style={{ flex: 1, marginTop: 24 }}>
          {sidebarLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "13px 32px",
                color: isActive ? "#e75480" : "#fff",
                background: isActive ? "rgba(231,84,128,0.08)" : "transparent",
                fontWeight: isActive ? 600 : 500,
                textDecoration: "none",
                fontSize: 16,
                borderLeft: isActive
                  ? "4px solid #e75480"
                  : "4px solid transparent",
                transition: "all 0.18s",
                cursor: "pointer",
              })}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <motion.button
          whileHover={{
            scale: 1.04,
            backgroundColor: "#e75480",
            color: "#fff",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{
            margin: "24px 24px 32px 24px",
            padding: "12px 0",
            width: "calc(100% - 48px)",
            border: "none",
            borderRadius: 8,
            background: "#2a2d3e",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <FaSignOutAlt /> Logout
        </motion.button>
      </aside>
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Topbar */}
        <header
          style={{
            height: 64,
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            boxShadow: "0 2px 8px rgba(90, 115, 252, 0.04)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/src/assets/logo-01.jpg"
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
                fontSize: 20,
                color: "#232946",
                letterSpacing: 1,
              }}
            >
              Sharpr
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FaUserTie style={{ fontSize: 22, color: "#232946" }} />
            <span style={{ fontWeight: 600, fontSize: 16, color: "#232946" }}>
              {userName}
            </span>
          </div>
        </header>
        {/* Routed Content */}
        <main
          style={{
            flex: 1,
            padding: "32px 32px 0 32px",
            background: "#f7f8fa",
            minHeight: 0,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

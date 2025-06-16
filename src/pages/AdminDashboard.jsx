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
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  // Professional color palette with theme support
  const colors = {
    background: theme === "dark" ? "#111827" : "#f8fafc",
    sidebar: {
      background: theme === "dark" ? "#1f2937" : "#ffffff",
      text: theme === "dark" ? "#e5e7eb" : "#1e293b",
      activeText: theme === "dark" ? "#60a5fa" : "#3b82f6",
      activeBg:
        theme === "dark"
          ? "rgba(96, 165, 250, 0.1)"
          : "rgba(59, 130, 246, 0.08)",
      border: theme === "dark" ? "#374151" : "#f1f5f9",
      hoverBg: theme === "dark" ? "#2d3748" : "#f1f5f9",
      icon: theme === "dark" ? "#9ca3af" : "#64748b",
    },
    topbar: {
      background: theme === "dark" ? "#1f2937" : "#ffffff",
      text: theme === "dark" ? "#e5e7eb" : "#1e293b",
      border: theme === "dark" ? "#374151" : "#e2e8f0",
      shadow:
        theme === "dark"
          ? "0 1px 3px rgba(0, 0, 0, 0.3)"
          : "0 1px 3px rgba(0, 0, 0, 0.05)",
    },
    logo: {
      text: theme === "dark" ? "#f3f4f6" : "#1e293b",
      shadow:
        theme === "dark"
          ? "0 2px 8px rgba(0, 0, 0, 0.3)"
          : "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    button: {
      primary: theme === "dark" ? "#3b82f6" : "#3b82f6",
      primaryText: "#ffffff",
      hover: theme === "dark" ? "#2563eb" : "#2563eb",
      shadow:
        theme === "dark"
          ? "0 2px 8px rgba(59, 130, 246, 0.3)"
          : "0 2px 8px rgba(59, 130, 246, 0.2)",
    },
    main: {
      background: theme === "dark" ? "#0f172a" : "#f8fafc",
    },
  };

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-collapse sidebar on small screens
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  useEffect(() => {
    // Close mobile sidebar on location change
    setMobileSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    auth.signOut().finally(() => {
      navigate("/signup");
    });
  };

  // Animation variants
  const sidebarAnimation = {
    hidden: { x: -280, opacity: 0 },
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
      x: -280,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const linkHoverAnimation = {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const fadeAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const logoAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  // Calculate sidebar width based on collapse state and screen size
  const sidebarWidth = sidebarCollapsed ? 70 : 250;

  // Mobile sidebar is a separate element
  const isMobile = windowWidth <= 768;

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: colors.background,
        position: "relative",
        transition: "all 0.3s ease",
      }}
    >
      {/* Mobile Toggle Button */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          style={{
            position: "fixed",
            top: "70px",
            left: "16px",
            zIndex: 1000,
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: colors.button.primary,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            boxShadow: colors.button.shadow,
          }}
        >
          {mobileSidebarOpen ? <FaTimes /> : <FaBars />}
        </motion.button>
      )}

      {/* Mobile Sidebar (separate component for mobile) */}
      {isMobile && (
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                width: 250,
                background: colors.sidebar.background,
                color: colors.sidebar.text,
                display: "flex",
                flexDirection: "column",
                boxShadow: "1px 0 15px rgba(0,0,0,0.2)",
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
                  borderBottom: `1px solid ${colors.sidebar.border}`,
                }}
              >
                <motion.div
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  variants={logoAnimation}
                >
                  <img
                    src="/src/assets/logo-01.jpg"
                    alt="Sharpr Logo"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "14px",
                      marginBottom: 8,
                      objectFit: "cover",
                      boxShadow: colors.logo.shadow,
                    }}
                  />
                </motion.div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    letterSpacing: "0.5px",
                    color: colors.logo.text,
                    marginTop: "10px",
                  }}
                >
                  Admin Dashboard
                </div>
              </div>
              <nav style={{ flex: 1, marginTop: 20, padding: "10px 0" }}>
                {sidebarLinks.map((item) => (
                  <motion.div
                    key={item.to}
                    initial="rest"
                    whileHover="hover"
                    variants={linkHoverAnimation}
                  >
                    <NavLink
                      to={item.to}
                      style={({ isActive }) => ({
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        marginLeft: "12px",
                        marginRight: "12px",
                        marginBottom: "2px",
                        borderRadius: "8px",
                        color: isActive
                          ? colors.sidebar.activeText
                          : colors.sidebar.text,
                        background: isActive
                          ? colors.sidebar.activeBg
                          : "transparent",
                        fontWeight: isActive ? 600 : 500,
                        textDecoration: "none",
                        fontSize: 15,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                      })}
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <span
                        style={{
                          fontSize: 16,
                          color: colors.sidebar.icon,
                        }}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </NavLink>
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
                  background: colors.button.primary,
                  color: colors.button.primaryText,
                  fontWeight: 600,
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor: "pointer",
                  boxShadow: colors.button.shadow,
                }}
              >
                <FaSignOutAlt /> Sign Out
              </motion.button>
            </motion.aside>
          )}
        </AnimatePresence>
      )}

      {/* Desktop Sidebar with collapsible feature */}
      {!isMobile && (
        <motion.aside
          key="desktop-sidebar"
          animate={{
            width: sidebarWidth,
            transition: { duration: 0.3 },
          }}
          style={{
            background: colors.sidebar.background,
            color: colors.sidebar.text,
            display: "flex",
            flexDirection: "column",
            boxShadow:
              theme === "dark"
                ? "1px 0 5px rgba(0,0,0,0.2)"
                : "1px 0 5px rgba(0,0,0,0.05)",
            zIndex: 20,
            position: "fixed",
            top: "60px",
            left: 0,
            bottom: 0,
            overflowY: "auto",
            overflowX: "hidden",
            transition: "width 0.3s ease",
          }}
        >
          {/* Collapse toggle button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            style={{
              position: "absolute",
              top: "10px",
              right: "-12px",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: colors.button.primary,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              boxShadow: colors.button.shadow,
              zIndex: 25,
            }}
          >
            {sidebarCollapsed ? (
              <FaChevronRight size={10} />
            ) : (
              <FaChevronLeft size={10} />
            )}
          </motion.button>

          <div
            style={{
              padding: sidebarCollapsed ? "20px 0 15px 0" : "28px 0 20px 0",
              textAlign: "center",
              borderBottom: `1px solid ${colors.sidebar.border}`,
              transition: "all 0.3s ease",
            }}
          >
            <motion.div
              initial="initial"
              animate="animate"
              whileHover="hover"
              variants={logoAnimation}
            >
              <img
                src="/src/assets/logo-01.jpg"
                alt="Sharpr Logo"
                style={{
                  width: sidebarCollapsed ? 40 : 50,
                  height: sidebarCollapsed ? 40 : 50,
                  borderRadius: "14px",
                  marginBottom: sidebarCollapsed ? 0 : 8,
                  objectFit: "cover",
                  boxShadow: colors.logo.shadow,
                  transition: "all 0.3s ease",
                }}
              />
            </motion.div>
            {!sidebarCollapsed && (
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  letterSpacing: "0.5px",
                  color: colors.logo.text,
                  transition: "color 0.3s ease",
                  marginTop: "10px",
                }}
              >
                Admin Dashboard
              </div>
            )}
          </div>
          <nav style={{ flex: 1, marginTop: 20, padding: "10px 0" }}>
            {sidebarLinks.map((item) => (
              <motion.div
                key={item.to}
                initial="rest"
                whileHover="hover"
                variants={linkHoverAnimation}
              >
                <NavLink
                  to={item.to}
                  title={sidebarCollapsed ? item.label : ""}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: sidebarCollapsed ? "center" : "flex-start",
                    gap: sidebarCollapsed ? 0 : 12,
                    padding: sidebarCollapsed ? "12px 0" : "12px 16px",
                    marginLeft: "12px",
                    marginRight: "12px",
                    marginBottom: "2px",
                    borderRadius: "8px",
                    color: isActive
                      ? colors.sidebar.activeText
                      : colors.sidebar.text,
                    background: isActive
                      ? colors.sidebar.activeBg
                      : "transparent",
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: "none",
                    fontSize: 15,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  })}
                >
                  <span
                    style={{
                      fontSize: 16,
                      color: colors.sidebar.icon,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && item.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            style={{
              margin: sidebarCollapsed ? "16px auto" : "16px 16px 24px 16px",
              padding: sidebarCollapsed ? "12px" : "12px 0",
              width: sidebarCollapsed ? "40px" : "auto",
              height: sidebarCollapsed ? "40px" : "auto",
              border: "none",
              borderRadius: 8,
              background: colors.button.primary,
              color: colors.button.primaryText,
              fontWeight: 600,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: sidebarCollapsed ? 0 : 10,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: colors.button.shadow,
            }}
            title={sidebarCollapsed ? "Sign Out" : ""}
          >
            <FaSignOutAlt />
            {!sidebarCollapsed && "Sign Out"}
          </motion.button>
        </motion.aside>
      )}

      {/* Main Content - Adjust margin based on sidebar state */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginTop: "60px",
          transition: "all 0.3s ease",
        }}
      >
        {/* Topbar - Adjust left based on sidebar state */}
        <header
          style={{
            height: 60,
            background: colors.topbar.background,
            borderBottom: `1px solid ${colors.topbar.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            boxShadow: colors.topbar.shadow,
            position: "fixed",
            top: 0,
            right: 0,
            left: isMobile ? 0 : sidebarWidth,
            zIndex: 10,
            transition: "all 0.3s ease",
          }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeAnimation}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: isMobile ? 16 : 18,
                color: colors.topbar.text,
                transition: "color 0.3s ease",
              }}
            >
              {/* Get current section from path */}
              {sidebarLinks.find((link) =>
                location.pathname.includes(link.to.split("/").pop())
              )?.label || "Overview"}
            </span>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeAnimation}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: theme === "dark" ? "#2d3748" : "#f1f5f9",
              padding: isMobile ? "4px 8px" : "6px 12px",
              borderRadius: "24px",
              transition: "background 0.3s ease",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: colors.button.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <FaUserTie style={{ fontSize: 16 }} />
            </div>
            {(!isMobile || windowWidth > 480) && (
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: colors.topbar.text,
                  transition: "color 0.3s ease",
                }}
              >
                {userName}
              </span>
            )}
          </motion.div>
        </header>

        {/* Routed Content - Add top margin to accommodate fixed topbar */}
        <main
          style={{
            flex: 1,
            padding: isMobile ? "16px" : "24px",
            paddingTop: isMobile ? "76px" : "84px",
            background: colors.main.background,
            minHeight: 0,
            transition: "background 0.3s ease",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ height: "100%" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

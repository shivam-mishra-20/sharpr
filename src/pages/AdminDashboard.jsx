/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react"; // Add useRef
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
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail, // Add this import
  onAuthStateChanged,
} from "firebase/auth";

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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmailError, setResetEmailError] = useState("");
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [sessionExpiryTime, setSessionExpiryTime] = useState(null);
  const dropdownRef = useRef(null);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update handleLogout function
  const handleLogout = async () => {
    try {
      // Clear any local state
      setUserName("Admin");
      setMobileSidebarOpen(false);

      // Clear ALL session and local storage
      sessionStorage.clear();
      localStorage.clear();

      // Sign out from Firebase
      await auth.signOut();

      // Force clear browser history and navigate to signup
      window.history.replaceState(null, "", "/signup?forceLogin=true");
      navigate("/signup?forceLogin=true", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Force navigation even if there's an error
      navigate("/signup?forceLogin=true", { replace: true });
    }
  };

  // Password change handler
  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);
    setIsSubmitting(true);

    // Validation
    if (!currentPassword) {
      setPasswordError("Please enter your current password");
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // First, reauthenticate with current credentials
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      // Then update password
      await updatePassword(user, newPassword);

      // Clear form and show success message
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);

      // Close modal after delay
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.code === "auth/wrong-password") {
        setPasswordError("Current password is incorrect");
      } else if (error.code === "auth/too-many-requests") {
        setPasswordError("Too many failed attempts. Please try again later");
      } else if (error.code === "auth/requires-recent-login") {
        setPasswordError(
          "For security reasons, please sign out and sign in again before changing your password"
        );
      } else {
        setPasswordError("Failed to update password: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Session expiration management
  useEffect(() => {
    // Set session timeout to 60 minutes (adjust as needed)
    const SESSION_TIMEOUT = 60 * 60 * 1000;

    // Check for existing session expiry time in localStorage
    const savedExpiryTime = localStorage.getItem("sessionExpiryTime");
    const expiryTime = savedExpiryTime
      ? parseInt(savedExpiryTime)
      : Date.now() + SESSION_TIMEOUT;

    setSessionExpiryTime(expiryTime);

    // Save to localStorage
    if (!savedExpiryTime) {
      localStorage.setItem("sessionExpiryTime", expiryTime.toString());
    }

    // Set up interval to check session expiration every minute
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now >= expiryTime) {
        setIsSessionExpired(true);
        clearInterval(intervalId);
      }
    }, 60000); // Check every minute

    // User activity listeners to reset session timer
    const resetSessionTimer = () => {
      const newExpiryTime = Date.now() + SESSION_TIMEOUT;
      setSessionExpiryTime(newExpiryTime);
      localStorage.setItem("sessionExpiryTime", newExpiryTime.toString());
      setIsSessionExpired(false);
    };

    // Reset timer on user activity
    window.addEventListener("click", resetSessionTimer);
    window.addEventListener("keypress", resetSessionTimer);
    window.addEventListener("scroll", resetSessionTimer);
    window.addEventListener("mousemove", resetSessionTimer);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("click", resetSessionTimer);
      window.removeEventListener("keypress", resetSessionTimer);
      window.removeEventListener("scroll", resetSessionTimer);
      window.removeEventListener("mousemove", resetSessionTimer);
    };
  }, []);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !isSubmitting) {
        // User is signed out, redirect to login
        handleLogout();
      }
    });

    return unsubscribe;
  }, []);

  // Handle forgot password
  const handleForgotPassword = async () => {
    setResetEmailError("");
    setResetEmailSent(false);

    if (!resetEmail || !resetEmail.includes("@")) {
      setResetEmailError("Please enter a valid email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetEmailSent(true);

      // Clear form after short delay
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setResetEmailSent(false);
        setResetEmail("");
      }, 3000);
    } catch (error) {
      console.error("Error sending reset email:", error);
      if (error.code === "auth/user-not-found") {
        setResetEmailError("No account found with this email");
      } else {
        setResetEmailError("Failed to send reset email: " + error.message);
      }
    }
  };

  // Handle session expiry
  const handleSessionExpiry = () => {
    setIsSessionExpired(false);
    handleLogout();
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

  // Enhanced mobile animations
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

  // Improved mobile toggle button animation
  const toggleButtonAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    tap: { scale: 0.9, transition: { duration: 0.1 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  // Define the main navbar height
  const mainNavbarHeight = 70; // Height of the main Sharpr navbar at the top

  // Add this function right before your return statement

  const renderPasswordModal = () => {
    // Mobile-optimized password modal
    if (isMobile) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: "20%",
            left: "4%",
            transform: "translate(-50%, -50%)",
            width: "92%",
            maxWidth: "400px", // Add max width for consistent appearance
            backgroundColor: colors.sidebar.background,
            borderRadius: "12px",
            zIndex: 1002,
            boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
            overflow: "hidden",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${colors.sidebar.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              backgroundColor: colors.sidebar.background,
              zIndex: 5,
            }}
          >
            <h3
              style={{
                margin: 0,
                color: colors.sidebar.text,
                fontSize: "17px",
                fontWeight: 600,
              }}
            >
              Change Password
            </h3>
            <button
              onClick={() => setShowPasswordModal(false)}
              style={{
                background: "transparent",
                border: "none",
                color: colors.sidebar.text,
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                marginRight: "-8px",
              }}
            >
              <FaTimes />
            </button>
          </div>
          <div style={{ padding: "16px 20px" }}>
            {passwordSuccess ? (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "rgba(39, 174, 96, 0.1)",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  color: "#27ae60",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                Password updated successfully!
              </div>
            ) : (
              <>
                {passwordError && (
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "rgba(235, 87, 87, 0.1)",
                      borderRadius: "8px",
                      marginBottom: "16px",
                      color: "#eb5757",
                      fontSize: "13px",
                    }}
                  >
                    {passwordError}
                  </div>
                )}

                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "13px",
                      color: colors.sidebar.text,
                      fontWeight: 500,
                    }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: `1px solid ${colors.sidebar.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                      color: colors.sidebar.text,
                      outline: "none",
                    }}
                    placeholder="Enter current password"
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "13px",
                      color: colors.sidebar.text,
                      fontWeight: 500,
                    }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: `1px solid ${colors.sidebar.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                      color: colors.sidebar.text,
                      outline: "none",
                    }}
                    placeholder="Enter new password"
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "13px",
                      color: colors.sidebar.text,
                      fontWeight: 500,
                    }}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: `1px solid ${colors.sidebar.border}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                      color: colors.sidebar.text,
                      outline: "none",
                    }}
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "none",
                    borderRadius: "8px",
                    background: colors.button.primary,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "14px",
                  }}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>

                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setShowForgotPasswordModal(true);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: colors.button.primary,
                      fontSize: "13px",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: "8px",
                    }}
                  >
                    Forgot your password?
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      );
    }

    // Desktop password modal with improved centering
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          backgroundColor: colors.sidebar.background,
          borderRadius: "12px",
          zIndex: 1002,
          boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
          overflow: "hidden",
          margin: 0, // Remove any margins that might affect centering
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${colors.sidebar.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: colors.sidebar.text,
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Change Password
          </h3>
          <button
            onClick={() => setShowPasswordModal(false)}
            style={{
              background: "transparent",
              border: "none",
              color: colors.sidebar.text,
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <FaTimes />
          </button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          {passwordSuccess ? (
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(39, 174, 96, 0.1)",
                borderRadius: "8px",
                marginBottom: "20px",
                color: "#27ae60",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              Password updated successfully!
            </div>
          ) : (
            <>
              {passwordError && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "rgba(235, 87, 87, 0.1)",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    color: "#eb5757",
                    fontSize: "14px",
                  }}
                >
                  {passwordError}
                </div>
              )}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    color: colors.sidebar.text,
                    fontWeight: 500,
                  }}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `1px solid ${colors.sidebar.border}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                    color: colors.sidebar.text,
                    outline: "none",
                  }}
                  placeholder="Enter current password"
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    color: colors.sidebar.text,
                    fontWeight: 500,
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `1px solid ${colors.sidebar.border}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                    color: colors.sidebar.text,
                    outline: "none",
                  }}
                  placeholder="Enter new password"
                />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    color: colors.sidebar.text,
                    fontWeight: 500,
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `1px solid ${colors.sidebar.border}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                    color: colors.sidebar.text,
                    outline: "none",
                  }}
                  placeholder="Confirm new password"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    padding: "10px 16px",
                    border: `1px solid ${colors.sidebar.border}`,
                    borderRadius: "8px",
                    background: "transparent",
                    color: colors.sidebar.text,
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={isSubmitting}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    background: colors.button.primary,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
              <div style={{ marginTop: "12px", textAlign: "center" }}>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setShowForgotPasswordModal(true);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: colors.button.primary,
                    fontSize: "14px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Forgot your password?
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: colors.background,
        position: "relative",
        transition: "all 0.3s ease",
        marginTop: 10, // Add margin to account for main navbar
      }}
    >
      {/* Mobile Toggle Button with enhanced modern design */}
      {isMobile && (
        <motion.button
          variants={toggleButtonAnimation}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          style={{
            position: "fixed",
            top: `${mainNavbarHeight + 55}px`, // Position below main navbar
            left: "16px",
            zIndex: 1000,
            width: "46px",
            height: "46px",
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${colors.button.primary}, ${colors.button.hover})`,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {mobileSidebarOpen ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaTimes size={18} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaBars size={18} />
            </motion.div>
          )}
        </motion.button>
      )}

      {/* Mobile Sidebar with improved animation and backdrop */}
      {isMobile && (
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              {/* Backdrop for mobile sidebar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
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
                  background: colors.sidebar.background,
                  color: colors.sidebar.text,
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
                      src="/logo-01.jpg"
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
            </>
          )}
        </AnimatePresence>
      )}

      {/* Desktop Sidebar Toggle Button - Moved OUTSIDE sidebar component */}
      {!isMobile && (
        <motion.button
          whileHover={{
            scale: 1.12,
            boxShadow: "0 5px 15px rgba(59, 130, 246, 0.45)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            left: sidebarCollapsed ? "42px" : "222px",
            top: 576, // Position more visibly below the navbar
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${colors.button.primary}, ${colors.button.hover})`,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
            transition: "all 0.25s ease, left 0.3s ease",
            transform: sidebarCollapsed ? "rotate(0deg)" : "rotate(180deg)",
            border: `3px solid ${theme === "dark" ? "#1f2937" : "#ffffff"}`,
            outline: `2px solid ${colors.button.primary}30`,
            zIndex: 999, // Lower z-index to stay below topbar
            marginLeft: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: sidebarCollapsed ? "1px" : "-1px",
            }}
          >
            <FaChevronRight size={14} />
          </div>
        </motion.button>
      )}

      {/* Desktop Sidebar with collapsible feature - adjust top position */}
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
            top: 60, // Position just below the main navbar
            left: 0,
            bottom: 0,
            overflowY: "auto",
            overflowX: "hidden",
            transition: "width 0.3s ease",
          }}
        >
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
                src="/logo-01.jpg"
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

      {/* Main Content - Adjust margin to match the topbar position */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginTop: "60px", // This is for the admin topbar, not the main navbar
          transition: "all 0.3s ease",
        }}
      >
        {/* Topbar - Position it below the main navbar */}
        <header
          style={{
            height: 60,
            background: colors.topbar.background,
            borderBottom: `1px solid ${colors.topbar.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            boxShadow:
              theme === "dark"
                ? "0 2px 5px rgba(0, 0, 0, 0.5)"
                : "0 2px 5px rgba(0, 0, 0, 0.1)",
            position: "fixed",
            top: 60, // Position just below main navbar
            right: 0,
            left: isMobile ? 0 : sidebarWidth,
            zIndex: 50, // Lower than mobile sidebar but higher than content
            transition: "all 0.3s ease",
            borderTop: theme === "dark" ? "1px solid #374151" : "none",
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

          {/* Modified user profile section with dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeAnimation}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background:
                  theme === "dark"
                    ? "rgba(45, 55, 72, 0.8)"
                    : "rgba(241, 245, 249, 0.8)",
                padding: isMobile ? "4px 8px" : "6px 12px",
                borderRadius: "24px",
                transition: "background 0.3s ease",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                cursor: "pointer",
                boxShadow: showProfileDropdown
                  ? `0 0 0 2px ${colors.button.primary}`
                  : "none",
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
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <FaUserTie style={{ fontSize: 16 }} />
              </div>
              {(!isMobile || windowWidth > 480) && (
                <>
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
                  <motion.div
                    animate={{
                      rotate: showProfileDropdown ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: 12 }}
                  >
                    <FaChevronDown />
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Dropdown menu */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "180px",
                    backgroundColor: colors.sidebar.background,
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    zIndex: 100,
                    overflow: "hidden",
                    border: `1px solid ${colors.sidebar.border}`,
                  }}
                >
                  <div
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setShowPasswordModal(true);
                    }}
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      transition: "background 0.2s ease",
                      cursor: "pointer",
                      color: colors.sidebar.text,
                      borderBottom: `1px solid ${colors.sidebar.border}`,
                      background: theme === "dark" ? "#1a202c" : "#fff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.sidebar.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        theme === "dark" ? "#1a202c" : "#fff";
                    }}
                  >
                    <FaCog size={14} />
                    <span style={{ fontSize: "14px" }}>Change Password</span>
                  </div>

                  <div
                    onClick={handleLogout}
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      transition: "background 0.2s ease",
                      cursor: "pointer",
                      color: colors.sidebar.text,
                      background: theme === "dark" ? "#1a202c" : "#fff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.sidebar.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        theme === "dark" ? "#1a202c" : "#fff";
                    }}
                  >
                    <FaSignOutAlt size={14} />
                    <span style={{ fontSize: "14px" }}>Sign Out</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Password Change Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 200,
                  width: "100vw", // Ensure full viewport width
                  height: "100vh", // Ensure full viewport height
                  backgroundColor: "black",
                  zIndex: 1001,
                  // Reset margin to avoid overflow
                }}
                onClick={() => setShowPasswordModal(false)}
              />
              {renderPasswordModal()}
            </>
          )}
        </AnimatePresence>
        {/* Forgot Password Modal - New addition */}
        <AnimatePresence>
          {showForgotPasswordModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "black",
                  zIndex: 1001,
                }}
                onClick={() => setShowForgotPasswordModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: isMobile ? "90%" : "400px",
                  backgroundColor: colors.sidebar.background,
                  borderRadius: "12px",
                  zIndex: 1002,
                  boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "20px 24px",
                    borderBottom: `1px solid ${colors.sidebar.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: colors.sidebar.text,
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                  >
                    Reset Password
                  </h3>
                  <button
                    onClick={() => setShowForgotPasswordModal(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: colors.sidebar.text,
                      fontSize: "20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div style={{ padding: "20px 24px" }}>
                  {resetEmailSent ? (
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "rgba(39, 174, 96, 0.1)",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        color: "#27ae60",
                        fontSize: "14px",
                        textAlign: "center",
                      }}
                    >
                      Password reset email sent! Please check your inbox.
                    </div>
                  ) : (
                    <>
                      {resetEmailError && (
                        <div
                          style={{
                            padding: "12px",
                            backgroundColor: "rgba(235, 87, 87, 0.1)",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            color: "#eb5757",
                            fontSize: "14px",
                          }}
                        >
                          {resetEmailError}
                        </div>
                      )}
                      <div style={{ marginBottom: "16px" }}>
                        <p
                          style={{
                            fontSize: "14px",
                            color: colors.sidebar.text,
                          }}
                        >
                          Enter your email address and we'll send you a link to
                          reset your password.
                        </p>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontSize: "14px",
                            color: colors.sidebar.text,
                            fontWeight: 500,
                          }}
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: `1px solid ${colors.sidebar.border}`,
                            borderRadius: "8px",
                            fontSize: "14px",
                            backgroundColor:
                              theme === "dark" ? "#1f2937" : "#fff",
                            color: colors.sidebar.text,
                            outline: "none",
                          }}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "10px",
                          marginTop: "24px",
                        }}
                      >
                        <button
                          onClick={() => setShowForgotPasswordModal(false)}
                          style={{
                            padding: "10px 16px",
                            border: `1px solid ${colors.sidebar.border}`,
                            borderRadius: "8px",
                            background: "transparent",
                            color: colors.sidebar.text,
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleForgotPassword}
                          style={{
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "8px",
                            background: colors.button.primary,
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          Send Reset Link
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Session Expiry Modal */}
        <AnimatePresence>
          {isSessionExpired && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "black",
                  zIndex: 2000,
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: isMobile ? "90%" : "400px",
                  backgroundColor: colors.sidebar.background,
                  borderRadius: "12px",
                  zIndex: 2001,
                  boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                  border: `1px solid ${colors.sidebar.border}`,
                }}
              >
                <div
                  style={{
                    padding: "24px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "rgba(235, 87, 87, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <FaExclamationTriangle size={24} color="#eb5757" />
                  </div>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      color: colors.sidebar.text,
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    Session Expired
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: colors.sidebar.text,
                      marginBottom: "24px",
                    }}
                  >
                    Your session has expired for security reasons. Please sign
                    in again to continue.
                  </p>
                  <button
                    onClick={handleSessionExpiry}
                    style={{
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      background: colors.button.primary,
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Sign In Again
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_EMAIL = "Admin@sharpr.in";
const ADMIN_PASSWORD = "Sharpr@2024!Admin#";

const SignUp = () => {
  // Changed default tab to parent_login since registration is commented out
  const [tab, setTab] = useState("parent_login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [theme, setTheme] = useState("light");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Detect system theme preference
  useEffect(() => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(isDarkMode ? "dark" : "light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle input changes
  const handleChange = (e, type = "form") => {
    const { name, value } = e.target;
    if (type === "form") setForm((prev) => ({ ...prev, [name]: value }));
    if (type === "login") setLogin((prev) => ({ ...prev, [name]: value }));
    if (type === "admin") setAdmin((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  /* Commented out Parent Registration
  // Parent Registration
  const handleParentRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;
      // Store user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: form.name,
        email: form.email,
        role: "parent",
        createdAt: new Date(),
      });

      setSuccess("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/parent_dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };
  */

  // Parent Login
  const handleParentLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!login.email || !login.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        login.email,
        login.password
      );
      // Optionally check if user is parent in Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "parent") {
        setError("Not authorized as parent.");
        setLoading(false);
        return;
      }

      setSuccess("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/parent_dashboard");
      }, 1500);
    } catch (err) {
      setError("Invalid credentials or user does not exist.");
    } finally {
      setLoading(false);
    }
  };

  // Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (admin.email === ADMIN_EMAIL && admin.password === ADMIN_PASSWORD) {
        setSuccess("Admin login successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/admin_dashboard");
        }, 1500);
      } else {
        setError("Invalid admin credentials.");
      }
      setLoading(false);
    }, 800); // Simulated verification delay
  };

  const themeStyles = {
    leftSide: {
      backgroundColor: theme === "dark" ? "#1a202c" : "#ffffff",
      color: theme === "dark" ? "#f7fafc" : "#1a202c",
    },
    rightSide: {
      // Now primarily for image overlay
      backgroundColor:
        theme === "dark" ? "rgba(6, 32, 41, 0.8)" : "rgba(16, 52, 41, 0.7)",
      color: "#ffffff",
    },
    input: {
      backgroundColor: "transparent",
      borderBottom: `1px solid ${theme === "dark" ? "#4a5568" : "#e2e8f0"}`,
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderRadius: 0,
      color: theme === "dark" ? "#f7fafc" : "#1a202c",
      paddingLeft: 0,
      paddingRight: 0,
    },
    activeTab: {
      color: theme === "dark" ? "#81e6d9" : "#194e31",
      borderBottom: `2px solid ${theme === "dark" ? "#81e6d9" : "#194e31"}`,
    },
    inactiveTab: {
      color: theme === "dark" ? "#a0aec0" : "#4a5568",
      borderBottom: "none",
    },
    submitButton: {
      backgroundColor: theme === "dark" ? "#2d7765" : "#194e31",
      color: "#ffffff",
      hoverBg: theme === "dark" ? "#38a89d" : "#146c43",
    },
    card: {
      backgroundColor: theme === "dark" ? "#2d3748" : "#ffffff",
      boxShadow:
        theme === "dark"
          ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  // Educational images based on theme
  const educationImages = {
    dark: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
    light:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch", // Changed to stretch to make both columns full height
        transition: "all 0.3s ease",
      }}
    >
      {/* Left Column - Form Side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          width: "50%",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          ...themeStyles.leftSide,
        }}
      >
        <div style={{ maxWidth: "400px", margin: "0 auto", width: "100%" }}>
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            style={{ marginBottom: "24px" }}
          >
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: theme === "dark" ? "#81e6d9" : "#194e31",
              }}
            >
              <span style={{ fontSize: "24px", marginRight: "4px" }}>@</span>
              sharpr
            </h1>
          </motion.div>

          {/* Sign in / Register Header */}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            Sign in
          </h2>

          {/* 
          Commented out toggle text between login and register
          {tab !== "admin_login" && (
            <div
              style={{
                fontSize: "14px",
                marginBottom: "24px",
                color: theme === "dark" ? "#a0aec0" : "#718096",
              }}
            >
              {tab === "parent_register"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <span
                style={{
                  color: theme === "dark" ? "#81e6d9" : "#194e31",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
                onClick={() =>
                  setTab(
                    tab === "parent_register"
                      ? "parent_login"
                      : "parent_register"
                  )
                }
              >
                {tab === "parent_register" ? "Login here" : "Create Now"}
              </span>
            </div>
          )}
          */}

          {/* Navigation Tabs */}
          <div
            style={{
              display: "flex",
              marginBottom: "24px",
              borderBottom: `1px solid ${
                theme === "dark" ? "#2d3748" : "#edf2f7"
              }`,
            }}
          >
            {/* Commented out Register tab
            <motion.button
              onClick={() => setTab("parent_register")}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "10px 15px",
                background: "transparent",
                border: "none",
                fontWeight: 500,
                cursor: "pointer",
                marginRight: "20px",
                ...(tab === "parent_register"
                  ? themeStyles.activeTab
                  : themeStyles.inactiveTab),
              }}
            >
              Register
            </motion.button>
            */}
            <motion.button
              onClick={() => setTab("parent_login")}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "10px 15px",
                background: "transparent",
                border: "none",
                fontWeight: 500,
                cursor: "pointer",
                marginRight: "20px",
                ...(tab === "parent_login"
                  ? themeStyles.activeTab
                  : themeStyles.inactiveTab),
              }}
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => setTab("admin_login")}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "10px 15px",
                background: "transparent",
                border: "none",
                fontWeight: 500,
                cursor: "pointer",
                ...(tab === "admin_login"
                  ? themeStyles.activeTab
                  : themeStyles.inactiveTab),
              }}
            >
              Admin
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  color: "#10b981",
                  marginBottom: 16,
                  padding: "10px 16px",
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(16, 185, 129, 0.05)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 20 }}>✓</div>
                <div>{success}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  color: "#ef4444",
                  marginBottom: 16,
                  padding: "8px 12px",
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(239, 68, 68, 0.1)"
                      : "rgba(239, 68, 68, 0.05)",
                  borderRadius: 6,
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* Commented out registration form 
            {tab === "parent_register" && (
              <motion.form
                onSubmit={handleParentRegister}
                key="register-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: theme === "dark" ? "#a0aec0" : "#718096",
                      marginBottom: "6px",
                    }}
                  >
                    Full Name
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.01 }}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 16,
                      ...themeStyles.input,
                    }}
                    autoComplete="name"
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: theme === "dark" ? "#a0aec0" : "#718096",
                      marginBottom: "6px",
                    }}
                  >
                    Email
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.01 }}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 16,
                      ...themeStyles.input,
                    }}
                    autoComplete="email"
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: theme === "dark" ? "#a0aec0" : "#718096",
                      marginBottom: "6px",
                    }}
                  >
                    Password
                  </label>
                  <motion.input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.01 }}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 16,
                      ...themeStyles.input,
                    }}
                    autoComplete="new-password"
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: theme === "dark" ? "#a0aec0" : "#718096",
                      marginBottom: "6px",
                    }}
                  >
                    Confirm Password
                  </label>
                  <motion.input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.01 }}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 16,
                      ...themeStyles.input,
                    }}
                    autoComplete="new-password"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: themeStyles.submitButton.hoverBg,
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    padding: 14,
                    borderRadius: 8,
                    backgroundColor: themeStyles.submitButton.backgroundColor,
                    color: themeStyles.submitButton.color,
                    fontWeight: 600,
                    fontSize: 16,
                    border: "none",
                    cursor: loading ? "default" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <motion.div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          border: "3px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          marginRight: 8,
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Sign up"
                  )}
                </motion.button>
              </motion.form>
            )}
            */}

            {tab === "parent_login" && (
              <motion.form
                onSubmit={handleParentLogin}
                key="login-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: theme === "dark" ? "#a0aec0" : "#718096",
                      marginBottom: "6px",
                    }}
                  >
                    Email
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    value={login.email}
                    onChange={(e) => handleChange(e, "login")}
                    whileFocus={{ scale: 1.01 }}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 16,
                      ...themeStyles.input,
                    }}
                    autoComplete="email"
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: theme === "dark" ? "#a0aec0" : "#718096",
                      marginBottom: "6px",
                    }}
                  >
                    Password
                  </label>
                  <motion.input
                    type="password"
                    name="password"
                    value={login.password}
                    onChange={(e) => handleChange(e, "login")}
                    whileFocus={{ scale: 1.01 }}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 16,
                      ...themeStyles.input,
                    }}
                    autoComplete="current-password"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    fontSize: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      style={{ marginRight: "8px" }}
                    />
                    <label
                      htmlFor="remember"
                      style={{
                        color: theme === "dark" ? "#a0aec0" : "#718096",
                      }}
                    >
                      Remember me
                    </label>
                  </div>
                  <div>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      style={{
                        color: theme === "dark" ? "#81e6d9" : "#194e31",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: themeStyles.submitButton.hoverBg,
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    padding: 14,
                    borderRadius: 8,
                    backgroundColor: themeStyles.submitButton.backgroundColor,
                    color: themeStyles.submitButton.color,
                    fontWeight: 600,
                    fontSize: 16,
                    border: "none",
                    cursor: loading ? "default" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    marginBottom: "20px",
                  }}
                >
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <motion.div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          border: "3px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          marginRight: 8,
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </motion.button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "20px 0",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: theme === "dark" ? "#2d3748" : "#edf2f7",
                      flex: 1,
                    }}
                  />
                  <span
                    style={{
                      padding: "0 10px",
                      color: theme === "dark" ? "#a0aec0" : "#718096",
                      fontSize: "14px",
                    }}
                  >
                    or
                  </span>
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: theme === "dark" ? "#2d3748" : "#edf2f7",
                      flex: 1,
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      flex: 1,
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${
                        theme === "dark" ? "#2d3748" : "#e2e8f0"
                      }`,
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                      color: theme === "dark" ? "#f7fafc" : "#1a202c",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      style={{ marginRight: "8px" }}
                    >
                      <path
                        fill={theme === "dark" ? "#f7fafc" : "#4285F4"}
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill={theme === "dark" ? "#f7fafc" : "#34A853"}
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill={theme === "dark" ? "#f7fafc" : "#FBBC05"}
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill={theme === "dark" ? "#f7fafc" : "#EA4335"}
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      flex: 1,
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${
                        theme === "dark" ? "#2d3748" : "#e2e8f0"
                      }`,
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                      color: theme === "dark" ? "#f7fafc" : "#1a202c",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      style={{ marginRight: "8px" }}
                    >
                      <path
                        fill={theme === "dark" ? "#f7fafc" : "#1877F2"}
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                    Facebook
                  </motion.button>
                </div>
              </motion.form>
            )}

            {tab === "admin_login" && (
              <motion.form
                onSubmit={handleAdminLogin}
                key="admin-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: theme === "dark" ? "#a0aec0" : "#718096",
                      marginBottom: "6px",
                    }}
                  >
                    Admin Email
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    value={admin.email}
                    onChange={(e) => handleChange(e, "admin")}
                    whileFocus={{ scale: 1.01 }}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 16,
                      ...themeStyles.input,
                    }}
                    autoComplete="username"
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      color: theme === "dark" ? "#a0aec0" : "#718096",
                      marginBottom: "6px",
                    }}
                  >
                    Admin Password
                  </label>
                  <motion.input
                    type="password"
                    name="password"
                    value={admin.password}
                    onChange={(e) => handleChange(e, "admin")}
                    whileFocus={{ scale: 1.01 }}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      fontSize: 16,
                      ...themeStyles.input,
                    }}
                    autoComplete="current-password"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: themeStyles.submitButton.hoverBg,
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    padding: 14,
                    borderRadius: 8,
                    backgroundColor: themeStyles.submitButton.backgroundColor,
                    color: themeStyles.submitButton.color,
                    fontWeight: 600,
                    fontSize: 16,
                    border: "none",
                    cursor: loading ? "default" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <motion.div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          border: "3px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          marginRight: 8,
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Access Admin Panel"
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 14,
              opacity: 0.7,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          >
            Sharpr Education Platform &copy; {new Date().getFullYear()}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column - Educational Image Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          width: "50%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${
              theme === "dark" ? educationImages.dark : educationImages.light
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "all 0.5s ease",
          }}
        />

        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            ...themeStyles.rightSide,
            transition: "all 0.5s ease",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            padding: "40px",
            zIndex: 2,
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          {/* Support link in top-right */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "20px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              fontWeight: "500",
              zIndex: 3,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M12 17V17.01"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 14C12 13 13 12.5 13.5 12C14 11.5 14.5 11 14.5 10C14.5 8.89543 13.6046 8 12.5 8C11.3954 8 10.5 8.89543 10.5 10"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Support
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Floating badge */}
            <motion.div
              initial={{ y: -5 }}
              animate={{ y: 5 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2.5,
              }}
              style={{
                display: "inline-flex",
                padding: "6px 12px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                marginBottom: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <span style={{ marginRight: "5px" }}>🎓</span> Unlock your
              potential
            </motion.div>

            <h2
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#ffffff",
                lineHeight: 1.3,
              }}
            >
              Learn, grow and achieve excellence
            </h2>

            <p
              style={{
                fontSize: "18px",
                marginBottom: "28px",
                opacity: 0.9,
                lineHeight: 1.6,
              }}
            >
              Join thousands of students achieving their academic goals with our
              personalized learning platform.
            </p>

            {/* Features list */}
            <div style={{ marginBottom: "32px" }}>
              {
                {
                  dark: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
                  light:
                    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop",
                }.dark
              }
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "20px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontStyle: "italic",
                  marginBottom: "16px",
                  lineHeight: 1.6,
                }}
              >
                "The structured curriculum and personalized approach helped my
                daughter improve her grades significantly within just one
                semester."
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#4c1d95",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  AS
                </div>
                <div>
                  <div style={{ fontWeight: "600" }}>Anita Sharma</div>
                  <div style={{ fontSize: "14px", opacity: 0.8 }}>Parent</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;

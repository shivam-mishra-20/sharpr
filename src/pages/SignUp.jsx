/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged, // Add this import
} from "firebase/auth";
import bcryptjs from "bcryptjs";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { motion, AnimatePresence, m } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; // Import the theme context hook

const ADMIN_EMAIL = "Admin@sharpr.in";
const ADMIN_PASSWORD = "Sharpr@2024!Admin#";

const SignUp = () => {
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
  // Replace local theme state with context theme
  const { theme } = useTheme();
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Remove the local theme detection useEffect since we're using the global theme context now

  // Handle input changes
  const handleChange = (e, type = "form") => {
    const { name, value } = e.target;
    if (type === "form") setForm((prev) => ({ ...prev, [name]: value }));
    if (type === "login") setLogin((prev) => ({ ...prev, [name]: value }));
    if (type === "admin") setAdmin((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Update the handleParentLogin function with this modified version:
  const handleParentLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!login.email || !login.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      // Find user by email in the users collection
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", login.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No account found with this email.");
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Check if this is a parent account
      if (userData.role !== "parent") {
        setError("This email is not registered as a parent account.");
        setLoading(false);
        return;
      }

      // Compare the password
      const isPasswordCorrect = bcryptjs.compareSync(
        login.password,
        userData.password
      );

      if (!isPasswordCorrect) {
        setError("Invalid password.");
        setLoading(false);
        return;
      }

      console.log("Authentication successful, storing user data");

      // Set ESSENTIAL user data in localStorage
      localStorage.setItem("userId", userDoc.id);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem(
        "userName",
        userData.name ||
          `${userData.firstName || ""} ${userData.lastName || ""}`
      );
      localStorage.setItem("userRole", userData.role);

      setSuccess("Login successful! Redirecting to dashboard...");

      console.log("Redirecting to parent dashboard");

      // Wait a moment to ensure storage is set
      setTimeout(() => {
        navigate("/parent_dashboard", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      setError("Error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        admin.email,
        admin.password
      );

      // Check if email is the admin email (don't check password as it might have changed)
      if (admin.email === ADMIN_EMAIL) {
        // Get user data to confirm role
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const docSnap = await getDoc(userDocRef);

        // Verify this is actually an admin account
        if (docSnap.exists() && docSnap.data().role === "admin") {
          setSuccess("Admin login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/admin_dashboard");
          }, 1500);
        } else {
          // Create or update admin role if not set
          await setDoc(
            userDocRef,
            {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              role: "admin",
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );

          setSuccess("Admin login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/admin_dashboard");
          }, 1500);
        }
      } else {
        // If email doesn't match admin email
        await signOut(auth);
        setError("Invalid admin credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid admin credentials or authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // Updated professional color palette
  const colors = {
    light: {
      primary: "#2563eb", // Modern blue
      secondary: "#4f46e5", // Indigo
      accent: "#3b82f6", // Bright blue
      background: "#f8fafc", // Off-white
      cardBg: "#ffffff",
      text: "#0f172a", // Dark slate
      textLight: "#64748b", // Slate
      border: "#e2e8f0",
      success: "#10b981", // Green
      error: "#ef4444", // Red
      inputBg: "#f8fafc",
      buttonHover: "#1d4ed8",
    },
    dark: {
      primary: "#3b82f6", // Blue
      secondary: "#6366f1", // Indigo
      accent: "#60a5fa", // Light blue
      background: "#0f172a", // Dark slate
      cardBg: "#1e293b", // Slate dark
      text: "#f8fafc", // Off-white
      textLight: "#94a3b8", // Slate 400
      border: "#334155", // Slate 700
      success: "#059669", // Green
      error: "#dc2626", // Red
      inputBg: "#1e293b",
      buttonHover: "#2563eb",
    },
  };

  const currentTheme = theme === "dark" ? colors.dark : colors.light;

  const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  // Modern education-themed images - updated with different images
  const educationImages = {
    dark: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    light:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",
  };

  // 3D floating element animation
  const floatAnimation = {
    animate: {
      y: [0, -10, 0],
      rotateY: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Enhanced button hover animation
  const buttonHoverAnimation = {
    rest: { scale: 1 },
    hover: {
      scale: 1.03,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      backgroundColor: currentTheme.buttonHover,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  // Mobile breakpoint detection - enhanced with additional breakpoints
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 768,
    isVerySmall: window.innerWidth < 380,
  });

  // Add responsive handler with enhanced breakpoints
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth < 768,
        isVerySmall: window.innerWidth < 380,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use destructuring for cleaner code
  const { isMobile, isVerySmall } = screenSize;

  // Update useEffect for auth checking
  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      // Get URL parameters to check if we should force the login page
      const urlParams = new URLSearchParams(window.location.search);
      const forceLogin = urlParams.get("forceLogin") === "true";

      // If we're forcing login, clear any existing auth state
      if (forceLogin) {
        // Try to sign out if forceLogin is true
        (async () => {
          try {
            await signOut(auth);
            sessionStorage.clear();
          } catch (error) {
            console.error("Error signing out:", error);
          }
        })();
        return () => {}; // Return empty cleanup function
      }

      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            // Check user role in Firestore
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (userDoc.exists()) {
              const role = userDoc.data().role;

              // Store role in sessionStorage for quicker access
              sessionStorage.setItem("userRole", role);
              sessionStorage.setItem("lastAuthCheck", Date.now().toString());

              // Only redirect if we're on the signup page specifically
              // This prevents unwanted redirects from other pages
              if (window.location.pathname === "/signup") {
                // Redirect based on role
                if (role === "admin") {
                  navigate("/admin_dashboard", { replace: true });
                } else if (role === "parent") {
                  navigate("/parent_dashboard", { replace: true });
                }
              }
            }
          } catch (error) {
            console.error("Error checking authentication:", error);
            // If error, attempt to sign out
            try {
              await signOut(auth);
            } catch (signOutError) {
              console.error("Error signing out:", signOutError);
            }
          }
        }
      });

      return unsubscribe;
    };

    const unsubscribe = checkAuth();

    // Cleanup function
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  const [showPassword, setShowPassword] = useState({
    login: false,
    admin: false,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: currentTheme.background,
        transition: "all 0.3s ease",
        padding: isMobile ? "10px" : "30px", // Reduced mobile padding
        overflow: "hidden", // Prevent overflow
      }}
    >
      {/* Main Card - responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: "90%",
          maxWidth: "950px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            theme === "dark"
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Left Column - Image Section (smaller but not hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            width: isMobile ? "100%" : "45%",
            height: isMobile ? "180px" : "auto",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background:
              theme === "dark"
                ? "linear-gradient(135deg, #0f172a 0%, #312e81 100%)"
                : "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
          }}
        >
          {/* Background Image with Overlay */}
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
              opacity: 0.7,
              mixBlendMode: "overlay",
            }}
          />

          {/* 3D Icon/Illustration - now shown on both mobile and desktop */}
          <motion.div
            variants={floatAnimation}
            animate="animate"
            style={{
              position: "relative",
              width: isMobile ? "45%" : "75%", // Smaller width on mobile
              marginBottom: isMobile ? "10px" : "30px",
              zIndex: 5,
              filter: "drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.2))",
              display: isMobile ? (isVerySmall ? "none" : "block") : "block", // Hide on very small screens only
            }}
          >
            {/* Using a free 3D SVG illustration - simplified for mobile */}
            <svg
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: isMobile ? "120px" : "200px",
              }}
            >
              {/* Laptop base - simplified on mobile */}
              <motion.path
                d="M124.5,300 L375.5,300 L400,350 L100,350 Z"
                fill="#2d3748"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />

              {/* Laptop screen */}
              <motion.rect
                x="150"
                y="170"
                width="200"
                height="130"
                rx="5"
                fill="#1a202c"
                stroke="#4a5568"
                strokeWidth="2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{ transformOrigin: "150px 300px" }}
              />

              {/* Laptop screen content */}
              <motion.rect
                x="160"
                y="180"
                width="180"
                height="110"
                rx="2"
                fill="#4299e1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              />

              {/* Code lines - less detail on mobile */}
              {!isMobile && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <rect
                    x="170"
                    y="190"
                    width="100"
                    height="6"
                    rx="2"
                    fill="#ebf8ff"
                  />
                  <rect
                    x="170"
                    y="205"
                    width="140"
                    height="6"
                    rx="2"
                    fill="#ebf8ff"
                  />
                  <rect
                    x="170"
                    y="220"
                    width="80"
                    height="6"
                    rx="2"
                    fill="#ebf8ff"
                  />
                  <rect
                    x="170"
                    y="235"
                    width="120"
                    height="6"
                    rx="2"
                    fill="#ebf8ff"
                  />
                  <rect
                    x="170"
                    y="250"
                    width="90"
                    height="6"
                    rx="2"
                    fill="#ebf8ff"
                  />
                  <rect
                    x="170"
                    y="265"
                    width="60"
                    height="6"
                    rx="2"
                    fill="#ebf8ff"
                  />
                </motion.g>
              )}
              {/* Simplified code lines for mobile */}
              {isMobile && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <rect
                    x="170"
                    y="200"
                    width="100"
                    height="6"
                    rx="2"
                    fill="#ebf8ff"
                  />
                  <rect
                    x="170"
                    y="220"
                    width="140"
                    height="6"
                    rx="2"
                    fill="#ebf8ff"
                  />
                  <rect
                    x="170"
                    y="240"
                    width="80"
                    height="6"
                    rx="2"
                    fill="#ebf8ff"
                  />
                </motion.g>
              )}

              {/* Floating graduation cap - simplified on mobile */}
              <motion.g
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <motion.path
                  d="M280,120 L340,140 L250,170 L190,145 Z"
                  fill={theme === "dark" ? "#60a5fa" : "#3b82f6"}
                  animate={{
                    y: [0, -5, 0],
                    rotateZ: [0, 2, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                />
                <motion.path
                  d="M250,170 L250,200 L220,187 L220,160 Z"
                  fill={theme === "dark" ? "#3b82f6" : "#2563eb"}
                  animate={{
                    y: [0, -5, 0],
                    rotateZ: [0, 2, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                    delay: 0.1,
                  }}
                />
                {!isMobile && (
                  <motion.path
                    d="M250,135 L250,115 L260,120 L260,133 Z"
                    fill={theme === "dark" ? "#93c5fd" : "#60a5fa"}
                    animate={{
                      y: [0, -5, 0],
                      rotateZ: [0, 2, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                  />
                )}
              </motion.g>

              {/* Flying paper plane - only on desktop or larger screens */}
              {!isVerySmall && (
                <motion.path
                  d="M80,180 L130,160 L110,200 Z"
                  fill="#e2e8f0"
                  initial={{ x: -100, y: 100, opacity: 0 }}
                  animate={{
                    x: [null, 350],
                    y: [null, 50],
                    opacity: [0, 1, 1, 0],
                    rotate: [0, -10, -5, -15],
                  }}
                  transition={{
                    duration: 10,
                    times: [0, 0.1, 0.9, 1],
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                />
              )}
            </svg>
          </motion.div>

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: isMobile ? "10px" : "0 30px 30px 30px", // Reduced padding on mobile
              textAlign: "center",
              color: "#ffffff",
            }}
          >
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: isMobile ? (isVerySmall ? "18px" : "20px") : "26px", // Smaller on very small screens
                fontWeight: "700",
                marginBottom: isMobile ? "8px" : "16px",
                background: "linear-gradient(to right, #fff, #e2e8f0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Elevate Your Learning Journey
            </motion.h2>

            {!isVerySmall && ( // Show on all except very small screens
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: isMobile ? "13px" : "15px", // Smaller on mobile
                  lineHeight: 1.6,
                  marginBottom: isMobile ? "10px" : "20px",
                  opacity: 0.9,
                }}
              >
                Join our platform to access personalized education plans and
                expert guidance.
              </motion.p>
            )}

            {/* Features with enhanced animation - hide on smaller screens */}
            {!isMobile && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                {["Personalized", "Interactive", "Results-driven"].map(
                  (item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        y: -2,
                      }}
                      style={{
                        padding: "6px 12px",
                        background: "rgba(255, 255, 255, 0.15)",
                        borderRadius: "20px",
                        fontSize: "13px",
                        backdropFilter: "blur(10px)",
                        cursor: "default",
                      }}
                    >
                      {item}
                    </motion.div>
                  )
                )}
              </motion.div>
            )}

            {/* Logo with animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              style={{
                marginTop: isMobile ? "5px" : "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1
                style={{
                  fontSize: isMobile ? "18px" : "22px",
                  fontWeight: "bold",
                }}
              >
                <motion.span
                  style={{
                    fontSize: isMobile ? "20px" : "24px",
                    marginRight: "4px",
                  }}
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  @
                </motion.span>
                sharpr
              </h1>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column - Form Side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            width: isMobile ? "100%" : "55%",
            padding: isMobile
              ? isVerySmall
                ? "15px 12px"
                : "20px 15px"
              : "35px", // More responsive padding
            backgroundColor: currentTheme.cardBg,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: currentTheme.text,
            boxSizing: "border-box", // Important for preventing overflow
          }}
        >
          <div
            style={{
              maxWidth: "420px",
              margin: "0 auto",
              width: "100%",
              overflow: "hidden", // Prevent overflow
            }}
          >
            {/* Welcome Text with enhanced animation */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.h2
                whileHover={{ scale: 1.02 }}
                style={{
                  fontSize: isMobile ? (isVerySmall ? "20px" : "22px") : "24px", // Smaller on very small screens
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Welcome back
              </motion.h2>
              <p
                style={{
                  fontSize: isMobile ? (isVerySmall ? "13px" : "14px") : "15px",
                  color: currentTheme.textLight,
                  marginBottom: isMobile ? "16px" : "24px",
                }}
              >
                Please sign in to your account to continue
              </p>
            </motion.div>

            {/* Navigation Tabs with enhanced hover effects - adjusted for mobile */}
            <div
              style={{
                display: "flex",
                marginBottom: isMobile ? "20px" : "25px",
                borderBottom: `1px solid ${currentTheme.border}`,
              }}
            >
              <motion.button
                onClick={() => setTab("parent_login")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: isMobile
                    ? isVerySmall
                      ? "6px 8px"
                      : "8px 12px"
                    : "10px 16px",
                  background: "transparent",
                  border: "none",
                  fontWeight: 600,
                  fontSize: isMobile ? (isVerySmall ? "13px" : "14px") : "16px",
                  cursor: "pointer",
                  marginRight: isMobile ? "10px" : "20px",
                  color:
                    tab === "parent_login"
                      ? currentTheme.primary
                      : currentTheme.textLight,
                  borderBottom:
                    tab === "parent_login"
                      ? `2px solid ${currentTheme.primary}`
                      : "none",
                  transform:
                    tab === "parent_login" ? "translateY(1px)" : "none",
                }}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => setTab("admin_login")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: isMobile
                    ? isVerySmall
                      ? "6px 8px"
                      : "8px 12px"
                    : "10px 16px",
                  background: "transparent",
                  border: "none",
                  fontWeight: 600,
                  fontSize: isMobile ? (isVerySmall ? "13px" : "14px") : "16px",
                  cursor: "pointer",
                  color:
                    tab === "admin_login"
                      ? currentTheme.primary
                      : currentTheme.textLight,
                  borderBottom:
                    tab === "admin_login"
                      ? `2px solid ${currentTheme.primary}`
                      : "none",
                  transform: tab === "admin_login" ? "translateY(1px)" : "none",
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
                    color: currentTheme.success,
                    marginBottom: 20,
                    padding: isMobile ? "10px 12px" : "12px 16px",
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(16, 185, 129, 0.1)"
                        : "rgba(16, 185, 129, 0.05)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: `1px solid ${
                      theme === "dark"
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(16, 185, 129, 0.1)"
                    }`,
                  }}
                >
                  <div style={{ fontSize: 18 }}>✓</div>
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
                    color: currentTheme.error,
                    marginBottom: 20,
                    padding: isMobile ? "10px 12px" : "12px 16px",
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(239, 68, 68, 0.05)",
                    borderRadius: 8,
                    border: `1px solid ${
                      theme === "dark"
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(239, 68, 68, 0.1)"
                    }`,
                    fontSize: isMobile ? "13px" : "14px",
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {tab === "parent_login" && (
                <motion.form
                  onSubmit={handleParentLogin}
                  key="login-form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ overflow: "hidden" }} // Prevent form overflow
                >
                  {/* Email field with enhanced interactive animation */}
                  <div
                    style={{
                      marginBottom: isMobile ? "16px" : "20px",
                      overflow: "hidden", // Prevent overflow
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontSize: isMobile
                          ? isVerySmall
                            ? "12px"
                            : "13px"
                          : "14px",
                        color: currentTheme.textLight,
                        marginBottom: "8px",
                        fontWeight: "500",
                        overflow: "hidden", // Prevent text overflow
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Email
                    </label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <motion.input
                        type="email"
                        name="email"
                        value={login.email}
                        onChange={(e) => handleChange(e, "login")}
                        whileFocus={{
                          boxShadow: `0 0 0 2px ${currentTheme.primary}25`,
                        }}
                        style={{
                          width: "100%",
                          padding: isMobile
                            ? isVerySmall
                              ? "8px 12px"
                              : "10px 14px"
                            : "12px 16px",
                          fontSize: isMobile
                            ? isVerySmall
                              ? "13px"
                              : "14px"
                            : "15px",
                          backgroundColor: currentTheme.inputBg,
                          color: currentTheme.text,
                          border: `1px solid ${currentTheme.border}`,
                          borderRadius: "8px",
                          outline: "none",
                          transition: "all 0.2s ease",
                          boxSizing: "border-box", // Critical for preventing overflow
                        }}
                        autoComplete="email"
                      />
                    </motion.div>
                  </div>

                  {/* Password field with enhanced interactive animation */}
                  <div
                    style={{
                      marginBottom: isMobile ? "14px" : "16px",
                      overflow: "hidden", // Prevent overflow
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontSize: isMobile
                          ? isVerySmall
                            ? "12px"
                            : "13px"
                          : "14px",
                        color: currentTheme.textLight,
                        marginBottom: "8px",
                        fontWeight: "500",
                        overflow: "hidden", // Prevent text overflow
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Password
                    </label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <motion.input
                        type={showPassword.login ? "text" : "password"}
                        name="password"
                        value={login.password}
                        onChange={(e) => handleChange(e, "login")}
                        whileFocus={{
                          boxShadow: `0 0 0 2px ${currentTheme.primary}25`,
                        }}
                        style={{
                          width: "100%",
                          padding: isMobile
                            ? isVerySmall
                              ? "8px 12px"
                              : "10px 14px"
                            : "12px 16px",
                          paddingRight: "40px", // Make room for the eye icon
                          fontSize: isMobile
                            ? isVerySmall
                              ? "13px"
                              : "14px"
                            : "15px",
                          backgroundColor: currentTheme.inputBg,
                          color: currentTheme.text,
                          border: `1px solid ${currentTheme.border}`,
                          borderRadius: "8px",
                          outline: "none",
                          transition: "all 0.2s ease",
                          boxSizing: "border-box", // Critical for preventing overflow
                        }}
                        autoComplete="current-password"
                      />
                      <motion.button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            login: !showPassword.login,
                          })
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          position: "absolute",
                          right: "12px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: currentTheme.textLight,
                          padding: "0",
                        }}
                        aria-label={
                          showPassword.login ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword.login ? (
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Remember me and forgot password - better layout for very small screens
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile || isVerySmall ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems:
                        isMobile || isVerySmall ? "flex-start" : "center",
                      marginBottom: isMobile ? "20px" : "24px",
                      gap: isMobile || isVerySmall ? "10px" : "0",
                      fontSize: isMobile
                        ? isVerySmall
                          ? "12px"
                          : "13px"
                        : "14px",
                    }}
                  >
                    <motion.div
                      style={{ display: "flex", alignItems: "center" }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        style={{
                          marginRight: "8px",
                          accentColor: currentTheme.primary,
                        }}
                      />
                      <label
                        htmlFor="remember"
                        style={{
                          color: currentTheme.textLight,
                          fontSize: isMobile
                            ? isVerySmall
                              ? "12px"
                              : "13px"
                            : "14px",
                        }}
                      >
                        Remember me
                      </label>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05, x: -2 }}>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        style={{
                          color: currentTheme.primary,
                          textDecoration: "none",
                          fontWeight: "500",
                          fontSize: isMobile
                            ? isVerySmall
                              ? "12px"
                              : "13px"
                            : "14px",
                        }}
                      >
                        Forgot Password?
                      </a>
                    </motion.div>
                  </div> */}

                  {/* Submit button with enhanced animation */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    initial="rest"
                    whileHover="hover"
                    variants={buttonHoverAnimation}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%",
                      padding: isMobile
                        ? isVerySmall
                          ? "10px"
                          : "12px"
                        : "14px",
                      borderRadius: "8px",
                      backgroundColor: currentTheme.primary,
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: isMobile
                        ? isVerySmall
                          ? "13px"
                          : "14px"
                        : "15px",
                      border: "none",
                      cursor: loading ? "default" : "pointer",
                      opacity: loading ? 0.7 : 1,
                      marginBottom: isMobile ? "20px" : "24px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      boxSizing: "border-box", // Critical for preventing overflow
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
                            width: isMobile ? (isVerySmall ? 14 : 16) : 18,
                            height: isMobile ? (isVerySmall ? 14 : 16) : 18,
                            borderRadius: isMobile ? (isVerySmall ? 7 : 8) : 9,
                            border: "3px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            marginRight: isMobile ? (isVerySmall ? 6 : 8) : 10,
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

                  {/* Divider - with smaller text on mobile */}
                  {/*
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: isMobile ? "16px 0" : "20px 0",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: currentTheme.border,
                        flex: 1,
                      }}
                    />
                    <span
                      style={{
                        padding: "0 15px",
                        color: currentTheme.textLight,
                        fontSize: isMobile ? (isVerySmall ? 11 : 12) : 14,
                      }}
                    >
                      or continue with
                    </span>
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: currentTheme.border,
                        flex: 1,
                      }}
                    />
                  </div>
                  */}

                  {/* Social login buttons - COMMENTED OUT as requested */}
                  {/* 
                  <div
                    style={{
                      display: "flex",
                      gap: isMobile ? (isVerySmall ? "8px" : "12px") : "12px",
                      flexDirection: isMobile && isVerySmall ? "column" : "row",
                    }}
                  >
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.04, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        flex: 1,
                        padding: isMobile
                          ? isVerySmall
                            ? "8px"
                            : "10px"
                          : "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${currentTheme.border}`,
                        borderRadius: "8px",
                        backgroundColor: "transparent",
                        color: currentTheme.text,
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                        transition: "all 0.2s ease",
                        fontSize: isMobile
                          ? isVerySmall
                            ? "12px"
                            : "13px"
                          : "14px",
                        boxSizing: "border-box",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width={isMobile ? (isVerySmall ? "16" : "18") : "20"}
                        height={isMobile ? (isVerySmall ? "16" : "18") : "20"}
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
                      whileHover={{ scale: 1.04, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        flex: 1,
                        padding: isMobile
                          ? isVerySmall
                            ? "8px"
                            : "10px"
                          : "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${currentTheme.border}`,
                        borderRadius: "8px",
                        backgroundColor: "transparent",
                        color: currentTheme.text,
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                        transition: "all 0.2s ease",
                        fontSize: isMobile
                          ? isVerySmall
                            ? "12px"
                            : "13px"
                          : "14px",
                        boxSizing: "border-box",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width={isMobile ? (isVerySmall ? "16" : "18") : "20"}
                        height={isMobile ? (isVerySmall ? "16" : "18") : "20"}
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
                  */}

                  {/* Also comment out the divider since we're removing the social login options */}
                  {/*
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: isMobile ? "16px 0" : "20px 0",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: currentTheme.border,
                        flex: 1,
                      }}
                    />
                    <span
                      style={{
                        padding: "0 15px",
                        color: currentTheme.textLight,
                        fontSize: isMobile ? (isVerySmall ? 11 : 12) : 14,
                      }}
                    >
                      or continue with
                    </span>
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: currentTheme.border,
                        flex: 1,
                      }}
                    />
                  </div>
                  */}
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
                  style={{ overflow: "hidden" }} // Prevent form overflow
                >
                  {/* Admin Email field with enhanced interactive animation */}
                  <div
                    style={{
                      marginBottom: isMobile ? "16px" : "20px",
                      overflow: "hidden", // Prevent overflow
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontSize: isMobile
                          ? isVerySmall
                            ? "12px"
                            : "13px"
                          : "14px",
                        color: currentTheme.textLight,
                        marginBottom: "8px",
                        fontWeight: "500",
                        overflow: "hidden", // Prevent text overflow
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Admin Email
                    </label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <motion.input
                        type="email"
                        name="email"
                        value={admin.email}
                        onChange={(e) => handleChange(e, "admin")}
                        whileFocus={{
                          boxShadow: `0 0 0 2px ${currentTheme.primary}25`,
                        }}
                        style={{
                          width: "100%",
                          padding: isMobile
                            ? isVerySmall
                              ? "8px 12px"
                              : "10px 14px"
                            : "12px 16px",
                          fontSize: isMobile
                            ? isVerySmall
                              ? "13px"
                              : "14px"
                            : "15px",
                          backgroundColor: currentTheme.inputBg,
                          color: currentTheme.text,
                          border: `1px solid ${currentTheme.border}`,
                          borderRadius: "8px",
                          outline: "none",
                          transition: "all 0.2s ease",
                          boxSizing: "border-box", // Critical for preventing overflow
                        }}
                        autoComplete="username"
                      />
                    </motion.div>
                  </div>

                  {/* Admin Password field with enhanced interactive animation */}
                  <div
                    style={{
                      marginBottom: isMobile ? "20px" : "24px",
                      overflow: "hidden", // Prevent overflow
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontSize: isMobile
                          ? isVerySmall
                            ? "12px"
                            : "13px"
                          : "14px",
                        color: currentTheme.textLight,
                        marginBottom: "8px",
                        fontWeight: "500",
                        overflow: "hidden", // Prevent text overflow
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Admin Password
                    </label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <motion.input
                        type={showPassword.admin ? "text" : "password"}
                        name="password"
                        value={admin.password}
                        onChange={(e) => handleChange(e, "admin")}
                        whileFocus={{
                          boxShadow: `0 0 0 2px ${currentTheme.primary}25`,
                        }}
                        style={{
                          width: "100%",
                          padding: isMobile
                            ? isVerySmall
                              ? "8px 12px"
                              : "10px 14px"
                            : "12px 16px",
                          paddingRight: "40px", // Make room for the eye icon
                          fontSize: isMobile
                            ? isVerySmall
                              ? "13px"
                              : "14px"
                            : "15px",
                          backgroundColor: currentTheme.inputBg,
                          color: currentTheme.text,
                          border: `1px solid ${currentTheme.border}`,
                          borderRadius: "8px",
                          outline: "none",
                          transition: "all 0.2s ease",
                          boxSizing: "border-box", // Critical for preventing overflow
                        }}
                        autoComplete="current-password"
                      />
                      <motion.button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            admin: !showPassword.admin,
                          })
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          position: "absolute",
                          right: "12px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: currentTheme.textLight,
                          padding: "0",
                        }}
                        aria-label={
                          showPassword.admin ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword.admin ? (
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Admin button with enhanced animation */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    initial="rest"
                    whileHover="hover"
                    variants={buttonHoverAnimation}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%",
                      padding: isMobile
                        ? isVerySmall
                          ? "10px"
                          : "12px"
                        : "14px",
                      borderRadius: "8px",
                      backgroundColor: currentTheme.primary,
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: isMobile
                        ? isVerySmall
                          ? "13px"
                          : "14px"
                        : "15px",
                      border: "none",
                      cursor: loading ? "default" : "pointer",
                      opacity: loading ? 0.7 : 1,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      boxSizing: "border-box", // Critical for preventing overflow
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
                            width: isMobile ? (isVerySmall ? 14 : 16) : 18,
                            height: isMobile ? (isVerySmall ? 14 : 16) : 18,
                            borderRadius: isMobile ? (isVerySmall ? 7 : 8) : 9,
                            border: "3px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            marginRight: isMobile ? (isVerySmall ? 6 : 8) : 10,
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
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default SignUp;

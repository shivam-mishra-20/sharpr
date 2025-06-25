import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  FaTimes,
  FaGraduationCap,
  FaUsers,
  FaRocket,
  FaBell,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const WelcomePopup = () => {
  const { theme } = useTheme();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // Cross-browser compatible color palette
  const colors = {
    background: theme === "dark" ? "#111827" : "#ffffff",
    cardBackground: theme === "dark" ? "#1f2937" : "#f8fafc",
    text: theme === "dark" ? "#f3f4f6" : "#111827",
    textSecondary: theme === "dark" ? "#9ca3af" : "#4b5563",
    primary: theme === "dark" ? "#8b5cf6" : "#7c3aed", // Purple instead of blue
    primaryLight: theme === "dark" ? "#a78bfa" : "#8b5cf6",
    secondary: theme === "dark" ? "#10b981" : "#059669", // Teal green accent
    accent: theme === "dark" ? "#f97316" : "#ea580c", // Orange accent
    border: theme === "dark" ? "#374151" : "#e2e8f0",
    inputBg: theme === "dark" ? "#374151" : "#f1f5f9",
    cardBg: theme === "dark" ? "#1e293b" : "#ffffff",
    gradientStart: theme === "dark" ? "#4c1d95" : "#7c3aed",
    gradientEnd: theme === "dark" ? "#8b5cf6" : "#a78bfa",
    success: theme === "dark" ? "#10b981" : "#059669",
    successBg:
      theme === "dark" ? "rgba(16, 185, 129, 0.1)" : "rgba(5, 150, 105, 0.1)",
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if the popup has been shown before
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Format phone number to remove any non-numeric characters
      const formattedPhone = formData.phone.replace(/[^0-9]/g, "");

      // Save to Firestore with complete data structure
      const docRef = await addDoc(collection(db, "waitlist"), {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formattedPhone,
        address: formData.address ? formData.address.trim() : "",
        status: "pending", // Status field for tracking
        source: "website-popup", // Tracking source of signup
        showInAdmin: false, // Add this flag to hide from admin dashboard
        createdAt: serverTimestamp(),
        joinDate: new Date().toISOString().split("T")[0], // Store readable date YYYY-MM-DD
        browser: navigator.userAgent, // Store browser info for debugging
        notes: "", // Empty field for future admin notes
      });

      console.log("Document written with ID: ", docRef.id);

      // Track successful signup
      try {
        // Optional: Add analytics tracking here if you use a service like Google Analytics
        // if (typeof window.gtag === 'function') {
        //   window.gtag('event', 'signup', {
        //     'event_category': 'waitlist',
        //     'event_label': 'popup_form'
        //   });
        // }
      } catch (analyticsError) {
        console.error("Analytics error:", analyticsError);
        // Non-critical error, don't show to user
      }

      setSubmitted(true);

      // Reset form data
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      // Keep popup open to show success message
      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting to waitlist:", error);
      setFormErrors({
        submit: "Something went wrong. Please try again or contact support.",
      });
    }

    setIsSubmitting(false);
  };

  // Determine if we should render the mobile version
  const isMobile = windowSize.width < 768;

  // CSS-reset for cross-browser compatibility
  const resetStyles = {
    boxSizing: "border-box",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  // Standard input style for cross-browser compatibility
  const getInputStyle = (hasError) => ({
    ...resetStyles,
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    backgroundColor: colors.inputBg,
    color: colors.text,
    border: hasError ? "1px solid #e53e3e" : `1px solid ${colors.border}`,
    borderRadius: "8px",
    outline: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    transition: "border 0.2s ease",
  });

  // Shared components
  const SuccessMessage = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        textAlign: "center",
        padding: isMobile ? "16px" : "24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        style={{
          width: isMobile ? "50px" : "70px",
          height: isMobile ? "50px" : "70px",
          borderRadius: "50%",
          backgroundColor: colors.successBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: isMobile ? "12px" : "20px",
          boxShadow: `0 0 20px ${colors.successBg}`,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FaCheckCircle size={isMobile ? 25 : 35} color={colors.success} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3
          style={{
            fontSize: isMobile ? "18px" : "22px",
            fontWeight: "700",
            color: colors.text,
            marginBottom: "10px",
          }}
        >
          Thanks for Joining!
        </h3>

        <p
          style={{
            color: colors.textSecondary,
            fontSize: isMobile ? "14px" : "15px",
            lineHeight: 1.5,
            marginBottom: "20px",
            maxWidth: "340px",
          }}
        >
          You've successfully joined our waitlist. We'll notify you when we
          launch with exclusive early access benefits!
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "8px",
          }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <FaStar
                size={16}
                color={colors.accent}
                style={{ margin: "0 2px" }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const CloseButton = () => (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClose}
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        background:
          theme === "dark"
            ? "rgba(55, 65, 81, 0.5)"
            : "rgba(241, 245, 249, 0.7)",
        border: "none",
        color: colors.textSecondary,
        cursor: "pointer",
        zIndex: 10,
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        backdropFilter: "blur(8px)",
        boxShadow:
          theme === "dark"
            ? "0 2px 4px rgba(0, 0, 0, 0.2)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <FaTimes size={isMobile ? 14 : 16} />
    </motion.button>
  );

  // Mobile Version
  const renderMobilePopup = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 50,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "12px",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        ...resetStyles,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "400px", // Smaller size
          maxHeight: "85vh", // Limit height for scrolling
          backgroundColor: colors.background,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          display: "flex",
          flexDirection: "column",
          ...resetStyles,
        }}
      >
        <CloseButton />

        {/* Header Section */}
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
            padding: "24px 16px", // Smaller padding
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0, // Prevent shrinking
          }}
        >
          {/* Animated Background Pattern */}
          <motion.div
            animate={{
              backgroundPosition: ["0px 0px", "100px 100px"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 2px)",
              backgroundSize: "30px 30px",
              opacity: 0.4,
            }}
          />

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  fontSize: "24px", // Smaller font
                  color: "#ffffff",
                  marginRight: "4px",
                }}
              >
                @
              </motion.div>
              <h2
                style={{
                  fontSize: "24px", // Smaller font
                  fontWeight: "800",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                sharpr
              </h2>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <FaGraduationCap
                size={40} // Smaller icon
                color="#ffffff"
                style={{ opacity: 0.9 }}
              />
            </motion.div>

            <h3
              style={{
                fontSize: "18px", // Smaller font
                fontWeight: "700",
                color: "#ffffff",
                margin: "0 0 4px",
              }}
            >
              Elevate Your Learning Journey
            </h3>
          </motion.div>
        </div>

        {/* Scrollable Content Section */}
        <div
          style={{
            padding: "16px", // Smaller padding
            overflowY: "auto", // Enable scrolling
            WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
            msOverflowStyle: "-ms-autohiding-scrollbar", // Better scrollbars on Windows
            flexGrow: 1, // Allow this section to grow
          }}
        >
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3
                style={{
                  fontSize: "16px", // Smaller font
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: "6px",
                  marginTop: 0,
                }}
              >
                Join Our Waitlist
              </h3>
              <p
                style={{
                  color: colors.textSecondary,
                  fontSize: "14px",
                  marginBottom: "12px",
                  margin: "0 0 12px",
                }}
              >
                Be the first to experience our innovative learning platform
              </p>

              {/* Waitlist counter with animation */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: colors.cardBg,
                  padding: "10px 14px",
                  borderRadius: "10px",
                  marginBottom: "16px",
                  border: `1px solid ${
                    theme === "dark"
                      ? "rgba(75, 85, 99, 0.3)"
                      : "rgba(226, 232, 240, 0.8)"
                  }`,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  style={{
                    backgroundColor: colors.primaryLight,
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                  }}
                >
                  <FaUsers size={14} color="#ffffff" />
                </div>
                <div>
                  <p
                    style={{
                      color: colors.text,
                      fontSize: "12px",
                      fontWeight: "500",
                      margin: 0,
                    }}
                  >
                    <strong style={{ color: colors.primary }}>
                      500+ parents
                    </strong>{" "}
                    have already joined the waitlist
                  </p>
                </div>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      color: colors.textSecondary,
                      marginBottom: "4px",
                      fontWeight: "500",
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={getInputStyle(formErrors.name)}
                    placeholder="Your full name"
                  />
                  {formErrors.name && (
                    <p
                      style={{
                        color: "#e53e3e",
                        fontSize: "11px",
                        marginTop: "4px",
                        margin: "4px 0 0",
                      }}
                    >
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      color: colors.textSecondary,
                      marginBottom: "4px",
                      fontWeight: "500",
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={getInputStyle(formErrors.email)}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <p
                      style={{
                        color: "#e53e3e",
                        fontSize: "11px",
                        marginTop: "4px",
                        margin: "4px 0 0",
                      }}
                    >
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      color: colors.textSecondary,
                      marginBottom: "4px",
                      fontWeight: "500",
                    }}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={getInputStyle(formErrors.phone)}
                    placeholder="Your phone number"
                  />
                  {formErrors.phone && (
                    <p
                      style={{
                        color: "#e53e3e",
                        fontSize: "11px",
                        marginTop: "4px",
                        margin: "4px 0 0",
                      }}
                    >
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {formErrors.submit && (
                  <p
                    style={{
                      color: "#e53e3e",
                      fontSize: "13px",
                      marginBottom: "14px",
                      textAlign: "center",
                      padding: "8px",
                      backgroundColor: "rgba(229, 62, 62, 0.1)",
                      borderRadius: "6px",
                      margin: "0 0 14px",
                    }}
                  >
                    {formErrors.submit}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    ...resetStyles,
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "14px",
                    border: "none",
                    cursor: isSubmitting ? "default" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    boxShadow: "0 4px 6px rgba(124, 58, 237, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSubmitting ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <motion.div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 8,
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
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span>Join Waitlist</span>
                      <FaArrowRight size={12} style={{ marginLeft: "6px" }} />
                    </div>
                  )}
                </motion.button>
              </form>

              {/* Features Section */}
              <div style={{ marginTop: "16px" }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: colors.text,
                    marginBottom: "10px",
                    textAlign: "center",
                    margin: "16px 0 10px",
                  }}
                >
                  Why Join Sharpr?
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "8px",
                  }}
                >
                  {[
                    {
                      icon: <FaRocket size={12} />,
                      text: "Access to premium learning tools",
                    },
                    {
                      icon: <FaGraduationCap size={12} />,
                      text: "Personalized education plans",
                    },
                    {
                      icon: <FaBell size={12} />,
                      text: "Early bird special offers",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        backgroundColor:
                          theme === "dark"
                            ? "rgba(55, 65, 81, 0.3)"
                            : "rgba(241, 245, 249, 0.7)",
                        borderRadius: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: colors.primaryLight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "8px",
                          flexShrink: 0,
                          color: "#fff",
                        }}
                      >
                        {feature.icon}
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: colors.text,
                          margin: 0,
                        }}
                      >
                        {feature.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <SuccessMessage />
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  // Desktop Version
  const renderDesktopPopup = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        ...resetStyles,
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "800px", // Smaller than before
          height: "auto",
          maxHeight: "85vh", // Limit height
          backgroundColor: colors.background,
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
          display: "flex",
          flexDirection: "row",
          ...resetStyles,
        }}
      >
        <CloseButton />

        {/* Left section with animated gradient background */}
        <div
          style={{
            flex: "0 0 40%",
            background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
            padding: "30px 24px", // Smaller padding
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated Background Pattern */}
          <motion.div
            animate={{
              backgroundPosition: ["0px 0px", "200px 200px"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.15) 3px, transparent 3px)",
              backgroundSize: "50px 50px",
              opacity: 0.5,
            }}
          />

          {/* Floating particles - fewer for performance */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.4 + 0.1,
                }}
                animate={{
                  x: [Math.random() * 100, Math.random() * 100 + 50],
                  y: [Math.random() * 100, Math.random() * 100 + 50],
                }}
                transition={{
                  duration: Math.random() * 5 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  position: "absolute",
                  width: Math.random() * 8 + 4 + "px", // Smaller particles
                  height: Math.random() * 8 + 4 + "px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                }}
              />
            ))}
          </div>

          {/* Top content */}
          <div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  fontSize: "28px", // Smaller
                  marginRight: "6px",
                  color: "#ffffff",
                }}
              >
                @
              </motion.div>
              <h2
                style={{
                  fontSize: "28px", // Smaller
                  fontWeight: "800",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                sharpr
              </h2>
            </motion.div>

            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: "24px", // Smaller
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: "14px",
                lineHeight: 1.3,
                margin: "0 0 14px",
              }}
            >
              Elevate Your <br />
              Learning Journey
            </motion.h3>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: "15px", // Smaller
                color: "#ffffff",
                opacity: 0.9,
                maxWidth: "280px",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Join thousands of parents who trust us to provide personalized
              education plans and expert guidance for their children's success.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                marginTop: "30px", // Smaller
              }}
            >
              {[
                "Advanced learning algorithms",
                "Expert-curated content",
                "Progress tracking tools",
                "Community support",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px", // Smaller
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    style={{
                      width: "18px",
                      height: "18px",
                      backgroundColor: "#ffffff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "10px",
                    }}
                  >
                    <FaCheckCircle size={12} color={colors.primary} />
                  </motion.div>
                  <span
                    style={{
                      fontSize: "14px", // Smaller
                      color: "#ffffff",
                      fontWeight: "500",
                    }}
                  >
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <FaGraduationCap
              size={65} // Smaller
              color="#ffffff"
              style={{ opacity: 0.9 }}
            />
          </motion.div>
        </div>

        {/* Right section with form - scrollable */}
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxHeight: "85vh",
          }}
        >
          <div
            style={{
              padding: "30px 30px 20px",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "-ms-autohiding-scrollbar",
              flexGrow: 1,
            }}
          >
            {!submitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3
                  style={{
                    fontSize: "22px", // Smaller
                    fontWeight: "700",
                    color: colors.text,
                    marginBottom: "10px",
                    margin: "0 0 10px",
                  }}
                >
                  Join Our Exclusive Waitlist
                </h3>
                <p
                  style={{
                    color: colors.textSecondary,
                    fontSize: "15px", // Smaller
                    marginBottom: "20px",
                    lineHeight: 1.5,
                    margin: "0 0 20px",
                  }}
                >
                  Be among the first to experience our revolutionary approach to
                  education. Early members receive special benefits and
                  discounts.
                </p>

                {/* Waitlist counter with animation */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: colors.cardBg,
                    padding: "14px 16px",
                    borderRadius: "10px",
                    marginBottom: "24px",
                    border: `1px solid ${
                      theme === "dark"
                        ? "rgba(75, 85, 99, 0.3)"
                        : "rgba(226, 232, 240, 0.8)"
                    }`,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: colors.primaryLight,
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "14px",
                    }}
                  >
                    <FaUsers size={16} color="#ffffff" />
                  </div>
                  <div>
                    <p
                      style={{
                        color: colors.text,
                        fontSize: "14px",
                        fontWeight: "500",
                        margin: 0,
                      }}
                    >
                      <strong
                        style={{ color: colors.primary, fontSize: "15px" }}
                      >
                        500+ parents
                      </strong>{" "}
                      have already joined the waitlist
                    </p>
                    <p
                      style={{
                        color: colors.textSecondary,
                        fontSize: "12px",
                        marginTop: "2px",
                        margin: "2px 0 0",
                      }}
                    >
                      Limited spots available for beta access
                    </p>
                  </div>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          color: colors.textSecondary,
                          marginBottom: "5px",
                          fontWeight: "500",
                        }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={getInputStyle(formErrors.name)}
                        placeholder="Your full name"
                      />
                      {formErrors.name && (
                        <p
                          style={{
                            color: "#e53e3e",
                            fontSize: "12px",
                            marginTop: "4px",
                            margin: "4px 0 0",
                          }}
                        >
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          color: colors.textSecondary,
                          marginBottom: "5px",
                          fontWeight: "500",
                        }}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={getInputStyle(formErrors.email)}
                        placeholder="your@email.com"
                      />
                      {formErrors.email && (
                        <p
                          style={{
                            color: "#e53e3e",
                            fontSize: "12px",
                            marginTop: "4px",
                            margin: "4px 0 0",
                          }}
                        >
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          color: colors.textSecondary,
                          marginBottom: "5px",
                          fontWeight: "500",
                        }}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={getInputStyle(formErrors.phone)}
                        placeholder="Your phone number"
                      />
                      {formErrors.phone && (
                        <p
                          style={{
                            color: "#e53e3e",
                            fontSize: "12px",
                            marginTop: "4px",
                            margin: "4px 0 0",
                          }}
                        >
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          color: colors.textSecondary,
                          marginBottom: "5px",
                          fontWeight: "500",
                        }}
                      >
                        Address (Optional)
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        style={getInputStyle(false)}
                        placeholder="Your address"
                      />
                    </div>
                  </div>

                  {formErrors.submit && (
                    <p
                      style={{
                        color: "#e53e3e",
                        fontSize: "14px",
                        marginBottom: "16px",
                        textAlign: "center",
                        padding: "8px",
                        backgroundColor: "rgba(229, 62, 62, 0.1)",
                        borderRadius: "8px",
                        margin: "0 0 16px",
                      }}
                    >
                      {formErrors.submit}
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 6px 16px rgba(124, 58, 237, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      ...resetStyles,
                      width: "100%",
                      padding: "14px",
                      borderRadius: "10px",
                      background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "15px",
                      border: "none",
                      cursor: isSubmitting ? "default" : "pointer",
                      opacity: isSubmitting ? 0.7 : 1,
                      boxShadow: "0 4px 8px rgba(124, 58, 237, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isSubmitting ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <motion.div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            border: "3px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            marginRight: 10,
                          }}
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span>Secure Your Spot Now</span>
                        <FaArrowRight size={14} style={{ marginLeft: "8px" }} />
                      </div>
                    )}
                  </motion.button>

                  {/* Trust indicators */}
                  <div
                    style={{
                      marginTop: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: colors.textSecondary,
                        fontSize: "12px",
                        margin: "0 10px 6px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "5px" }}
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Secure data
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: colors.textSecondary,
                        fontSize: "12px",
                        margin: "0 10px 6px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "5px" }}
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      No spam
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: colors.textSecondary,
                        fontSize: "12px",
                        margin: "0 10px 6px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "5px" }}
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      Privacy protected
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              <SuccessMessage />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {showPopup && (isMobile ? renderMobilePopup() : renderDesktopPopup())}
    </AnimatePresence>
  );
};

export default WelcomePopup;

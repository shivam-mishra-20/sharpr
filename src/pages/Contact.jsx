import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const getThemeColors = (theme) => ({
  primary: theme === "dark" ? "#6366f1" : "#4f46e5",
  primaryLight: theme === "dark" ? "#818cf8" : "#818cf8",
  primaryDark: theme === "dark" ? "#4338ca" : "#3730a3",
  secondary: theme === "dark" ? "#60a5fa" : "#3b82f6",
  text: theme === "dark" ? "#e5e7eb" : "#1e293b",
  textLight: theme === "dark" ? "#9ca3af" : "#64748b",
  background: theme === "dark" ? "#111827" : "#f8fafc",
  backgroundGradient:
    theme === "dark"
      ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
  card: theme === "dark" ? "#1f2937" : "#ffffff",
  error: theme === "dark" ? "#f87171" : "#ef4444",
  success: theme === "dark" ? "#34d399" : "#22c55e",
  border: theme === "dark" ? "#374151" : "#cbd5e1",
  inputBackground: theme === "dark" ? "#374151" : "transparent",
  inputBorder: theme === "dark" ? "#4b5563" : "#cbd5e1",
  cardShadow:
    theme === "dark"
      ? "0 10px 40px rgba(0,0,0,0.2)"
      : "0 10px 40px rgba(0,0,0,0.08)",
});

// --- Mobile View Component ---
function ContactMobile({
  styles,
  socials,
  formRef,
  nameInputRef,
  fields,
  focus,
  errors,
  touched,
  isSubmitting,
  submitted,
  handleChange,
  handleFocus,
  handleBlur,
  handleSubmit,
}) {
  return (
    <div style={{ ...styles.container, padding: "20px 16px", marginTop: 16 }}>
      <div
        style={{
          ...styles.contentWrapper,
          flexDirection: "column",
          gap: 24,
          maxWidth: "100%",
        }}
      >
        <motion.div
          style={{ ...styles.leftPanel, maxWidth: "100%" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Map section commented out */}

          <div style={{ ...styles.mobileCard, padding: "30px 20px" }}>
            <div style={styles.title}>Contact Information</div>
            <div style={styles.subtitle}>
              Reach out to us through any of these channels and we'll respond as
              soon as possible.
            </div>

            <div>
              <div style={styles.infoItem}>
                <svg
                  style={styles.infoIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                thesharpr1@gmail.com
              </div>
              <div style={styles.infoItem}>
                <svg
                  style={styles.infoIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +91 9369428170
              </div>
              <div style={styles.infoItem}>
                <svg
                  style={styles.infoIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Address : 2536, Road 117 , Greenfield, sec 42 ,
                <br />
                Faridabad, Haryana
              </div>
            </div>

            <div style={styles.social}>
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "50%",
                    padding: "6px",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Add the Get in Touch card for mobile */}
        <motion.div
          style={{ ...styles.rightPanel, maxWidth: "100%" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div style={{ ...styles.mobileCard, padding: "30px 20px" }}>
            <div style={styles.title}>Get in Touch</div>
            <div style={styles.subtitle}>
              We'd love to hear from you! Fill out the form and our team will
              get back to you as soon as possible.
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              autoComplete="off"
              noValidate
              style={{
                ...styles.mobileForm,
                alignItems: "center", // Center the form elements
              }}
            >
              <div
                style={{
                  ...styles.formGroup,
                  maxWidth: "90%", // Limit width to prevent overflow
                }}
              >
                <input
                  ref={nameInputRef}
                  style={{
                    ...styles.input,
                    ...(focus.name || fields.name ? styles.inputFocus : {}),
                    ...(errors.name && touched.name ? styles.inputError : {}),
                  }}
                  type="text"
                  id="name"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby="nameErrorMobile"
                />
                <label
                  htmlFor="name"
                  style={{
                    ...styles.label,
                    ...(focus.name || fields.name ? styles.labelActive : {}),
                    ...(errors.name && touched.name ? styles.labelError : {}),
                  }}
                >
                  Name
                </label>
                {errors.name && touched.name && (
                  <div id="nameErrorMobile" style={styles.errorMessage}>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.name}
                  </div>
                )}
              </div>

              <div
                style={{
                  ...styles.formGroup,
                  maxWidth: "90%", // Limit width to prevent overflow
                }}
              >
                <input
                  style={{
                    ...styles.input,
                    ...(focus.email || fields.email ? styles.inputFocus : {}),
                    ...(errors.email && touched.email ? styles.inputError : {}),
                  }}
                  type="email"
                  id="email-mobile"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby="emailErrorMobile"
                />
                <label
                  htmlFor="email-mobile"
                  style={{
                    ...styles.label,
                    ...(focus.email || fields.email ? styles.labelActive : {}),
                    ...(errors.email && touched.email ? styles.labelError : {}),
                  }}
                >
                  Email
                </label>
                {errors.email && touched.email && (
                  <div id="emailErrorMobile" style={styles.errorMessage}>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.email}
                  </div>
                )}
              </div>

              <div
                style={{
                  ...styles.formGroup,
                  maxWidth: "90%", // Limit width to prevent overflow
                }}
              >
                <textarea
                  style={{
                    ...styles.input,
                    minHeight: "120px",
                    resize: "vertical",
                    ...(focus.message || fields.message
                      ? styles.inputFocus
                      : {}),
                    ...(errors.message && touched.message
                      ? styles.inputError
                      : {}),
                  }}
                  id="message-mobile"
                  name="message"
                  value={fields.message}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby="messageErrorMobile"
                />
                <label
                  htmlFor="message-mobile"
                  style={{
                    ...styles.label,
                    ...(focus.message || fields.message
                      ? styles.labelActive
                      : {}),
                    ...(errors.message && touched.message
                      ? styles.labelError
                      : {}),
                  }}
                >
                  Message
                </label>
                {errors.message && touched.message && (
                  <div id="messageErrorMobile" style={styles.errorMessage}>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{ ...styles.mobileButton, maxWidth: "90%" }} // Also limit button width
                disabled={isSubmitting || submitted}
              >
                {isSubmitting ? (
                  <>
                    <span style={styles.loadingSpinner}></span>
                    Sending...
                  </>
                ) : submitted ? (
                  "Message Sent!"
                ) : (
                  "Send Message"
                )}
              </button>

              {submitted && (
                <motion.div
                  style={styles.successMessage}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Thank you! We'll get back to you soon.
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const Contact = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: "100px", // Reduced padding for more modern spacing
      background: colors.backgroundGradient,
      padding: "100px 20px 40px", // Adjusted padding for better layout
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      transition: "all 0.3s ease",
      color: colors.text,
      position: "relative", // Added for potential overlay effects
    },
    contentWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch", // Changed to stretch for equal height cards
      justifyContent: "center",
      width: "100%",
      maxWidth: "1200px",
      gap: "40px",
      boxSizing: "border-box",
    },
    leftPanel: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxWidth: "520px", // Changed to match rightPanel
      minWidth: "280px",
      boxSizing: "border-box",
    },
    rightPanel: {
      flex: 1,
      width: "100%",
      maxWidth: "520px",
      minWidth: "280px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
    },
    card: {
      background: colors.card,
      borderRadius: "20px", // Increased for more modern look
      boxShadow: colors.cardShadow,
      padding: "40px",
      width: "100%",
      margin: "0",
      position: "relative",
      zIndex: 2,
      transition:
        "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow:
          theme === "dark"
            ? "0 15px 50px rgba(0,0,0,0.25)"
            : "0 15px 50px rgba(0,0,0,0.12)",
      },
      boxSizing: "border-box",
      minWidth: "0",
      color: colors.text,
      backdropFilter: "blur(10px)", // Added for glass morphism effect
      WebkitBackdropFilter: "blur(10px)", // For Safari support
    },

    // Mobile-specific card styles
    mobileCard: {
      background: colors.card,
      borderRadius: "18px", // Increased for more modern look
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)", // Enhanced shadow
      padding: "30px 20px", // Increased padding for better spacing
      width: "100%",
      margin: "0",
      position: "relative",
      boxSizing: "border-box",
      minWidth: "0",
      color: colors.text,
      backdropFilter: "blur(10px)", // Added for glass morphism effect
      WebkitBackdropFilter: "blur(10px)", // For Safari support
    },

    title: {
      fontSize: "2.4rem", // Increased for better hierarchy
      fontWeight: 700,
      marginBottom: "12px", // Increased for better spacing
      color: colors.text,
      letterSpacing: "-0.025em",
      lineHeight: 1.2,
    },
    subtitle: {
      color: colors.textLight,
      marginBottom: "32px", // Increased for better spacing
      fontSize: "1.15rem", // Slightly larger for better readability
      lineHeight: 1.5,
    },
    formGroup: {
      position: "relative",
      marginBottom: "28px", // Increased for better spacing
      width: "100%", // Changed from 80% to 100% for container
    },
    input: {
      width: "100%",
      padding: "18px 16px", // Increased for better touch targets
      fontSize: "1rem",
      border: `1.5px solid ${colors.inputBorder}`,
      borderRadius: "12px", // Increased for more modern look
      outline: "none",
      background: colors.inputBackground,
      transition: "all 0.25s ease", // Smoother transitions
      color: colors.text,
      "-webkit-appearance": "none",
      "-moz-appearance": "none",
      "&:focus": {
        borderColor: colors.primary,
        boxShadow: `0 0 0 4px rgba(99, 102, 241, 0.15)`,
      },
    },
    inputFocus: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 4px rgba(99, 102, 241, 0.15)`, // Enhanced focus state
    },
    inputError: {
      borderColor: colors.error,
      boxShadow: `0 0 0 4px rgba(239, 68, 68, 0.15)`,
    },
    label: {
      position: "absolute",
      left: "16px", // Adjusted for new input padding
      top: "18px", // Adjusted for new input padding
      color: colors.textLight,
      fontSize: "1rem",
      pointerEvents: "none",
      background: colors.card,
      padding: "0 6px", // Increased padding for label
      transition: "all 0.25s cubic-bezier(.4,0,.2,1)", // Smoother transitions
    },
    labelActive: {
      top: "-12px", // Adjusted for better positioning
      left: "12px", // Adjusted for better positioning
      fontSize: "0.85rem",
      color: colors.primary,
      fontWeight: 500,
    },
    labelError: {
      color: colors.error,
    },
    errorMessage: {
      color: colors.error,
      fontSize: "0.85rem",
      marginTop: "8px", // Increased for better spacing
      display: "flex",
      alignItems: "center",
      gap: "6px", // Increased gap
    },
    button: {
      width: "100%",
      padding: "18px", // Increased for better touch target
      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      color: "#fff",
      fontWeight: 600,
      fontSize: "1.1rem",
      border: "none",
      borderRadius: "14px", // Increased for modern look
      cursor: "pointer",
      boxShadow: `0 4px 18px rgba(99, 102, 241, 0.2)`, // Enhanced shadow
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: `0 6px 20px rgba(99, 102, 241, 0.3)`,
      },
      "&:active": {
        transform: "translateY(1px)",
      },
      "&:disabled": {
        opacity: 0.7,
        cursor: "not-allowed",
        background: `linear-gradient(90deg, ${colors.primaryLight} 0%, ${colors.secondary} 100%)`,
      },
    },
    mobileButton: {
      width: "100%",
      padding: "18px", // Increased for better touch target
      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      color: "#fff",
      fontWeight: 600,
      fontSize: "1rem",
      border: "none",
      borderRadius: "14px", // Increased for modern look
      cursor: "pointer",
      boxShadow: `0 4px 16px rgba(99, 102, 241, 0.2)`, // Enhanced shadow
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
      marginTop: "12px", // Increased for better spacing
      WebkitTapHighlightColor: "transparent",
    },
    loadingSpinner: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      border: "3px solid rgba(255, 255, 255, 0.3)", // Thicker border for visibility
      borderTopColor: "#fff",
      animation: "spin 0.8s linear infinite",
      marginRight: "8px",
    },
    info: {
      marginTop: "32px",
      color: colors.text,
    },
    infoItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px", // Increased gap for better spacing
      marginBottom: "16px", // Increased for better spacing
      fontSize: "1.05rem", // Slightly larger for better readability
      transition: "transform 0.2s ease", // Added transition for hover effect
      padding: "8px 0", // Added padding for better touch targets
      "&:hover": {
        transform: "translateX(4px)", // Slight movement on hover
      },
    },
    infoIcon: {
      width: "20px", // Slightly larger
      height: "20px",
      color: colors.primary,
    },
    social: {
      display: "flex",
      justifyContent: "flex-start",
      gap: "20px", // Increased gap
      marginTop: "24px", // Increased for better spacing
    },
    icon: {
      width: "36px", // Increased size for better visibility
      height: "36px",
      color: colors.primary,
      transition: "all 0.3s ease", // Smoother transition
      "&:hover": {
        color: colors.primaryDark,
        transform: "translateY(-3px)",
      },
    },
    mapContainer: {
      width: "100%",
      height: "240px",
      borderRadius: "18px", // Increased for modern look
      overflow: "hidden",
      boxShadow:
        theme === "dark"
          ? "0 4px 20px rgba(0,0,0,0.2)"
          : "0 4px 20px rgba(0,0,0,0.08)",
      margin: "25px 0 0",
      border: `1px solid ${theme === "dark" ? "#374151" : "#e2e8f0"}`,
      position: "relative",
    },
    infoCard: {
      height: "100%", // Added for equal height
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between", // Better spacing
      background: colors.card,
      borderRadius: "20px",
      boxShadow: colors.cardShadow,
      padding: "40px", // Matched padding with card
      width: "100%",
      margin: "0",
      position: "relative",
      zIndex: 2,
      transition:
        "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
      boxSizing: "border-box",
      minWidth: "0",
      color: colors.text,
      backdropFilter: "blur(10px)", // Added for glass morphism effect
      WebkitBackdropFilter: "blur(10px)", // For Safari support
    },
    successMessage: {
      padding: "22px", // Increased padding
      background:
        theme === "dark"
          ? "rgba(52, 211, 153, 0.15)"
          : "rgba(34, 197, 94, 0.15)",
      borderRadius: "14px", // Increased for modern look
      color: colors.success,
      display: "flex",
      alignItems: "center",
      gap: "12px", // Increased gap
      marginTop: "24px", // Increased for better spacing
      fontSize: "1.05rem",
      fontWeight: 500,
    },
    contactDetailsHeading: {
      fontSize: "1.5rem", // Increased size
      fontWeight: 700, // Bolder for better hierarchy
      marginBottom: "24px", // Increased for better spacing
      color: colors.text,
      position: "relative",
      paddingBottom: "12px", // Added for underline effect
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "60px",
        height: "3px",
        background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        borderRadius: "2px",
      },
    },
    fadeIn: {
      opacity: 0,
      animation: "fadeIn 0.5s forwards",
    },
    "@keyframes fadeIn": {
      "0%": { opacity: 0 },
      "100%": { opacity: 1 },
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
    mobileForm: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "4px", // Added small gap
    },
    "@media (max-width: 1100px)": {
      contentWrapper: {
        gap: "24px",
        maxWidth: "98vw",
      },
      leftPanel: {
        maxWidth: "480px", // Changed to match rightPanel
      },
      rightPanel: {
        maxWidth: "480px",
      },
    },
    "@media (max-width: 900px)": {
      contentWrapper: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // Center on mobile too
        gap: "30px",
        maxWidth: "100vw",
      },
      leftPanel: {
        maxWidth: "100%",
        minWidth: "0",
      },
      rightPanel: {
        maxWidth: "100%",
        minWidth: "0",
      },
      card: {
        padding: "32px 16px",
      },
    },
    "@media (max-width: 600px)": {
      container: {
        padding: "80px 16px 20px", // Adjusted to keep content lower on mobile
        justifyContent: "flex-start",
      },
      contentWrapper: {
        gap: "24px", // Increased from 16px for better spacing
      },
      leftPanel: {
        padding: 0,
        maxWidth: "100%",
      },
      rightPanel: {
        padding: 0,
        maxWidth: "100%",
      },
      card: {
        padding: "24px 16px", // Increased padding for better touch experience
        borderRadius: "14px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
      },
      title: {
        fontSize: "1.5rem", // Increased from 1.2rem for better readability
      },
      mapContainer: {
        height: "200px", // Increased height for better visibility
      },
      infoCard: {
        padding: "20px",
        marginTop: "16px",
        borderRadius: "14px",
      },
      formGroup: {
        marginBottom: "20px",
        width: "100%", // Changed from 80% to 100% for proper mobile layout
      },
      input: {
        fontSize: "16px", // Prevents zoom on input focus on iOS
        padding: "14px 12px", // Slightly reduced for better fit
      },
      successMessage: {
        padding: "14px",
        fontSize: "0.98rem",
        borderRadius: "10px",
        marginTop: "16px", // Added specific margin
      },
    },
    "@media (max-width: 400px)": {
      container: {
        padding: "60px 12px 16px", // Adjusted for very small screens
      },
      mobileCard: {
        padding: "20px 14px",
        borderRadius: "12px",
      },
      infoCard: {
        padding: "16px 12px",
      },
      title: {
        fontSize: "1.4rem", // Adjusted for very small screens
        marginBottom: "4px", // Reduced spacing
      },
      subtitle: {
        fontSize: "0.95rem", // Smaller for very small screens
        marginBottom: "20px", // Reduced spacing
      },
    },
    "@media (min-width: 601px) and (max-width: 900px)": {
      mapContainer: {
        height: "260px", // Better size for tablets
      },
      card: {
        padding: "32px 24px", // Better padding for tablets
      },
      formGroup: {
        width: "100%", // Changed from 95% to 100% for tablets
      },
    },
  };

  // Updated social media icons with better accessibility and modern design
  const socials = [
    {
      href: "mailto:thesharpr1@gmail.com",
      icon: (
        <svg
          aria-hidden="true"
          style={{ ...styles.icon, padding: "4px" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      ),
      label: "Email",
    },
    {
      href: "https://linkedin.com",
      icon: (
        <svg
          aria-hidden="true"
          style={{ ...styles.icon, padding: "4px" }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm15.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.76 1.37-1.56 2.82-1.56 3.02 0 3.58 1.99 3.58 4.58v5.62z" />
        </svg>
      ),
      label: "LinkedIn",
    },
    {
      href: "https://twitter.com",
      icon: (
        <svg
          aria-hidden="true"
          style={{ ...styles.icon, padding: "4px" }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 4.56c-.89.39-1.84.65-2.84.77a4.93 4.93 0 0 0 2.16-2.72c-.95.56-2.01.97-3.13 1.19a4.92 4.92 0 0 0-8.39 4.48c-4.09-.2-7.72-2.17-10.15-5.15a4.93 4.93 0 0 0 1.52 6.57c-.8-.03-1.56-.25-2.22-.62v.06a4.93 4.93 0 0 0 3.95 4.83c-.39.11-.8.17-1.22.17-.3 0-.58-.03-.86-.08a4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 21.54a13.94 13.94 0 0 0 7.56 2.22c9.05 0 14-7.5 14-14v-.64A9.94 9.94 0 0 0 24 4.56z" />
        </svg>
      ),
      label: "Twitter",
    },
    {
      href: "https://instagram.com",
      icon: (
        <svg
          aria-hidden="true"
          style={{ ...styles.icon, padding: "4px" }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      label: "Instagram",
    },
  ];

  // Form validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name is too short";
    return null;
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return null;
  };

  const validateMessage = (message) => {
    if (!message.trim()) return "Message is required";
    if (message.trim().length < 10)
      return "Message is too short (min 10 characters)";
    return null;
  };

  function useIsMobile(breakpoint = 700) {
    const [isMobile, setIsMobile] = React.useState(
      window.innerWidth < breakpoint
    );
    React.useEffect(() => {
      const onResize = () => setIsMobile(window.innerWidth < breakpoint);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [breakpoint]);
    return isMobile;
  }

  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [focus, setFocus] = useState({});
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const nameInputRef = useRef(null);
  const isMobile = useIsMobile();

  // Focus first input on mount for better UX
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Validate fields on change
  useEffect(() => {
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateName(fields.name) }));
    }
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(fields.email) }));
    }
    if (touched.message) {
      setErrors((prev) => ({
        ...prev,
        message: validateMessage(fields.message),
      }));
    }
  }, [fields, touched]);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleFocus = (e) => setFocus({ ...focus, [e.target.name]: true });

  const handleBlur = (e) => {
    setFocus({ ...focus, [e.target.name]: false });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const nameError = validateName(fields.name);
    const emailError = validateEmail(fields.email);
    const messageError = validateMessage(fields.message);

    const formErrors = {
      name: nameError,
      email: emailError,
      message: messageError,
    };

    setErrors(formErrors);
    setTouched({ name: true, email: true, message: true });

    // Check if there are any errors
    if (nameError || emailError || messageError) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
    setFields({ name: "", email: "", message: "" });
    setTouched({});

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  if (isMobile)
    return (
      <ContactMobile
        styles={{
          ...styles,
          container: {
            ...styles.container,
            padding: "80px 16px 20px", // Match mobile container style
          },
        }}
        socials={socials}
        formRef={formRef}
        nameInputRef={nameInputRef}
        fields={fields}
        focus={focus}
        errors={errors}
        touched={touched}
        isSubmitting={isSubmitting}
        submitted={submitted}
        handleChange={handleChange}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
      />
    );

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <motion.div
          style={styles.leftPanel}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Map section commented out but kept in code for future reference */}

          <div style={{ ...styles.infoCard, flex: 1 }}>
            <motion.div
              style={{ ...styles.title, fontSize: "2.4rem" }} // Added title style for consistency
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Contact Information
            </motion.div>
            <motion.div
              style={{ ...styles.subtitle, marginBottom: "40px" }} // Added subtitle style for consistency
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Reach out to us through any of these channels and we'll respond as
              soon as possible.
            </motion.div>

            <div style={{ flex: 1 }}>
              {" "}
              {/* Added container for info items */}
              <motion.div
                style={styles.infoItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <svg
                  style={styles.infoIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                thesharpr1@gmail.com
              </motion.div>
              <motion.div
                style={styles.infoItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <svg
                  style={styles.infoIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +91 9369428170
              </motion.div>
              <motion.div
                style={styles.infoItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <svg
                  style={styles.infoIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Address : 2536, Road 117 , Greenfield, sec 42 ,
                <br />
                Faridabad, Haryana
              </motion.div>
            </div>

            <motion.div
              style={{ ...styles.social, marginTop: "40px" }} // Increased margin for better spacing
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              {socials.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                    borderRadius: "50%",
                    padding: "6px",
                  }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          style={styles.rightPanel}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={styles.card}>
            <motion.div
              style={styles.title}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Get in Touch
            </motion.div>
            <motion.div
              style={styles.subtitle}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              We'd love to hear from you! Fill out the form and our team will
              get back to you as soon as possible.
            </motion.div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              autoComplete="off"
              noValidate
            >
              <motion.div
                style={styles.formGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <input
                  ref={nameInputRef}
                  style={{
                    ...styles.input,
                    ...(focus.name || fields.name ? styles.inputFocus : {}),
                    ...(errors.name && touched.name ? styles.inputError : {}),
                  }}
                  type="text"
                  id="name"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby="nameError"
                />
                <label
                  htmlFor="name"
                  style={{
                    ...styles.label,
                    ...(focus.name || fields.name ? styles.labelActive : {}),
                    ...(errors.name && touched.name ? styles.labelError : {}),
                  }}
                >
                  Name
                </label>
                {errors.name && touched.name && (
                  <div id="nameError" style={styles.errorMessage}>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.name}
                  </div>
                )}
              </motion.div>

              <motion.div
                style={styles.formGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <input
                  style={{
                    ...styles.input,
                    ...(focus.email || fields.email ? styles.inputFocus : {}),
                    ...(errors.email && touched.email ? styles.inputError : {}),
                  }}
                  type="email"
                  id="email"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby="emailError"
                />
                <label
                  htmlFor="email"
                  style={{
                    ...styles.label,
                    ...(focus.email || fields.email ? styles.labelActive : {}),
                    ...(errors.email && touched.email ? styles.labelError : {}),
                  }}
                >
                  Email
                </label>
                {errors.email && touched.email && (
                  <div id="emailError" style={styles.errorMessage}>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.email}
                  </div>
                )}
              </motion.div>

              <motion.div
                style={styles.formGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <textarea
                  style={{
                    ...styles.input,
                    minHeight: "140px", // Increased height for better UX
                    resize: "vertical",
                    ...(focus.message || fields.message
                      ? styles.inputFocus
                      : {}),
                    ...(errors.message && touched.message
                      ? styles.inputError
                      : {}),
                  }}
                  id="message"
                  name="message"
                  value={fields.message}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby="messageError"
                />
                <label
                  htmlFor="message"
                  style={{
                    ...styles.label,
                    ...(focus.message || fields.message
                      ? styles.labelActive
                      : {}),
                    ...(errors.message && touched.message
                      ? styles.labelError
                      : {}),
                  }}
                >
                  Message
                </label>
                {errors.message && touched.message && (
                  <div id="messageError" style={styles.errorMessage}>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.message}
                  </div>
                )}
              </motion.div>

              <motion.button
                type="submit"
                style={styles.button}
                disabled={isSubmitting || submitted}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 6px 20px rgba(99, 102, 241, 0.4)`,
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                {isSubmitting ? (
                  <>
                    <span style={styles.loadingSpinner}></span>
                    Sending...
                  </>
                ) : submitted ? (
                  "Message Sent!"
                ) : (
                  "Send Message"
                )}
              </motion.button>

              {submitted && (
                <motion.div
                  style={styles.successMessage}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Thank you! We'll get back to you soon.
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

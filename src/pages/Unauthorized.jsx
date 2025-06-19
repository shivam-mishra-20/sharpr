import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Unauthorized = () => {
  const { theme } = useTheme();

  const colors = {
    light: {
      background: "#f8fafc",
      text: "#0f172a",
      subtext: "#64748b",
      primary: "#2563eb",
    },
    dark: {
      background: "#0f172a",
      text: "#f8fafc",
      subtext: "#94a3b8",
      primary: "#3b82f6",
    },
  };

  const currentColors = theme === "dark" ? colors.dark : colors.light;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: currentColors.background,
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: "500px",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <motion.div
          animate={{ rotate: [0, 10, 0, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke={currentColors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 9L9 15"
              stroke={currentColors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 9L15 15"
              stroke={currentColors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "28px",
            color: currentColors.text,
            marginTop: "24px",
            marginBottom: "16px",
          }}
        >
          Access Denied
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "16px",
            color: currentColors.subtext,
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          You don't have permission to access this page. Please log in with an
          account that has the appropriate access level.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: "12px 24px",
                backgroundColor: currentColors.primary,
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              Back to Login
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;

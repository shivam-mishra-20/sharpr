/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteRight } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const themeColors = {
  light: {
    cardBg: "var(--background)",
    borderColor: "var(--secondary)",
    boxShadow:
      "0 10px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.05)",
    textColor: "var(--foreground)",
    quoteColor: "#4b5563",
    quoteIconColor: "#e5e7eb",
    nameColor: "var(--foreground)",
    roleColor: "var(--secondary)",
    patternOpacity: 0.08,
    patternFill: "#000000",
    borderTopColor: "var(--secondary)",
    profileShadow:
      "0 0 0 2px var(--secondary), 0 0 0 4px rgba(139, 92, 246, 0.3)",
    starShadow: "drop-shadow(0 0 1px rgba(251,191,36,0.5))",
  },
  dark: {
    cardBg: "var(--background)",
    borderColor: "var(--secondary)",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.45)",
    textColor: "var(--foreground)",
    quoteColor: "#c7d2fe",
    quoteIconColor: "#23263a",
    nameColor: "var(--foreground)",
    roleColor: "var(--secondary)",
    patternOpacity: 0.06,
    patternFill: "#ffffff",
    borderTopColor: "var(--secondary)",
    profileShadow:
      "0 0 0 2px var(--secondary), 0 0 0 4px rgba(139, 92, 246, 0.18)",
    starShadow: "drop-shadow(0 0 1px rgba(251,191,36,0.7))",
  },
};

const Testimonial = ({ name, role, image, quote, rating }) => {
  const { theme } = useTheme();
  const colors = themeColors[theme] || themeColors.light;

  const cardStyle = {
    position: "relative",
    overflow: "hidden",
    background: colors.cardBg,
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: colors.boxShadow,
    border: `1px solid ${colors.borderColor}`,
    transition: "all 0.3s ease",
    color: colors.textColor,
  };

  const quoteIconStyle = {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    fontSize: "2rem",
    color: colors.quoteIconColor,
    opacity: 0.6,
  };

  const starStyle = {
    color: "#fbbf24",
    marginRight: "0.25rem",
    filter: colors.starShadow,
  };

  const quoteTextStyle = {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: colors.quoteColor,
    fontStyle: "italic",
    position: "relative",
    zIndex: "1",
    marginBottom: "1.5rem",
  };

  const profileContainerStyle = {
    display: "flex",
    alignItems: "center",
    borderTop: `1px solid ${colors.borderTopColor}`,
    paddingTop: "1.25rem",
    marginTop: "1.25rem",
  };

  const imageContainerStyle = {
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    overflow: "hidden",
    marginRight: "1rem",
    boxShadow: colors.profileShadow,
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const nameStyle = {
    fontWeight: "700",
    fontSize: "1rem",
    color: colors.nameColor,
    marginBottom: "0.25rem",
  };

  const roleStyle = {
    fontSize: "0.875rem",
    color: colors.roleColor,
    fontWeight: "500",
  };

  const patternStyle = {
    position: "absolute",
    top: "0",
    right: "0",
    width: "150px",
    height: "150px",
    opacity: colors.patternOpacity,
    transform: "translateX(30%) translateY(-30%)",
    zIndex: "0",
  };

  return (
    <motion.div
      style={cardStyle}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -10,
        boxShadow:
          theme === "dark"
            ? "0 25px 50px -12px rgba(0,0,0,0.7)"
            : "0 25px 50px -12px rgba(0,0,0,0.15), 0 12px 15px -6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Background Pattern */}
      <div style={patternStyle}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill={colors.patternFill}
            d="M42.8,-65.3C54.9,-56.7,63.7,-43.5,69.9,-29.1C76.2,-14.6,80.1,1.1,74.9,13.4C69.7,25.6,55.4,34.4,42.2,45.3C29,56.2,16.8,69.1,1.9,67.2C-13,65.4,-26,48.8,-39.7,35.4C-53.4,21.9,-67.8,11.5,-69.6,-0.7C-71.5,-12.9,-60.9,-25.8,-49.1,-35.2C-37.4,-44.7,-24.6,-50.7,-11.1,-58.5C2.4,-66.3,15.8,-75.9,29.8,-74.1C43.8,-72.3,58.5,-59.1,42.8,-65.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Quote Icon */}
      <FaQuoteRight style={quoteIconStyle} />

      {/* Rating Stars */}
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        {[...Array(5)].map((_, index) => (
          <motion.span
            key={index}
            style={{
              ...starStyle,
              opacity: index < rating ? 1 : 0.3,
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: index < rating ? 1 : 0.3, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <FaStar />
          </motion.span>
        ))}
      </div>

      {/* Quote Text */}
      <motion.blockquote
        style={quoteTextStyle}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {quote}
      </motion.blockquote>

      {/* Profile */}
      <motion.div
        style={profileContainerStyle}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          style={imageContainerStyle}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <img
            src={image}
            alt={name}
            style={imageStyle}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/150?text=" + name.charAt(0);
            }}
          />
        </motion.div>
        <div>
          <p style={nameStyle}>{name}</p>
          <p style={roleStyle}>{role}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Testimonial;

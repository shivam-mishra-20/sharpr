import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaChevronRight } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Enhanced color system with theme awareness
const getColors = (theme) => ({
  primary: theme === "dark" ? "#60a5fa" : "#4f46e5",
  background:
    theme === "dark"
      ? "linear-gradient(135deg, #111827 0%, #1e293b 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
  text: theme === "dark" ? "#e5e7eb" : "#1e293b",
  textLight: theme === "dark" ? "#9ca3af" : "#64748b",
  card: theme === "dark" ? "#1f2937" : "#ffffff",
  cardShadow:
    theme === "dark"
      ? "0 10px 30px rgba(0, 0, 0, 0.3)"
      : "0 10px 30px rgba(0, 0, 0, 0.05)",
  cardBorder: theme === "dark" ? "#374151" : "rgba(226, 232, 240, 0.8)",
  buttonBg: theme === "dark" ? "#3b82f6" : "#4f46e5",
  buttonText: "#ffffff",
  disabledBg: theme === "dark" ? "#374151" : "#e2e8f0",
  disabledText: theme === "dark" ? "#9ca3af" : "#94a3b8",
  accentRed: "#f87171",
  cardGradient:
    theme === "dark"
      ? "linear-gradient(145deg, #1f2937, #111827)"
      : "linear-gradient(145deg, #ffffff, #f9fafb)",
});

// Locations extracted from the image
const locations = {
  current: [
    { id: 1, name: "Saket" },
    { id: 2, name: "Karol Bagh" },
    { id: 3, name: "Faridabad" },
    { id: 4, name: "Noida" },
  ],
  comingSoon: [
    { id: 5, name: "Jaipur" },
    { id: 6, name: "Lucknow" },
    { id: 7, name: "Varanasi" },
  ],
};

// Hook to detect mobile view
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

const LocationButton = ({ location, isCurrent = true, colors }) => {
  return (
    <motion.button
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "14px 20px",
        borderRadius: "12px",
        width: "100%",
        border: "none",
        background: isCurrent ? colors.buttonBg : colors.disabledBg,
        color: isCurrent ? colors.buttonText : colors.disabledText,
        fontWeight: 600,
        fontSize: "1rem",
        cursor: isCurrent ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      }}
      onClick={() => isCurrent && console.log(`Selected ${location.name}`)}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <FaMapMarkerAlt
          size={14}
          style={{ marginRight: "8px", opacity: 0.8 }}
        />
        {location.name}
      </div>
      {isCurrent && <FaChevronRight size={12} style={{ opacity: 0.7 }} />}
    </motion.button>
  );
};

const Locations = () => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const colors = getColors(theme);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <section
        style={{
          padding: isMobile ? "40px 16px" : "60px 20px",
          background: colors.background,
          color: colors.text,
          marginTop: "50px",
          borderRadius: isMobile ? "0" : "16px",
          maxWidth: "1400px",
          margin: "50px auto 0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Header with location pin icon */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "40px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 16px rgba(239, 68, 68, 0.25)",
              }}
            >
              <FaMapMarkerAlt color="#fff" size={24} />
            </div>
            <h2
              style={{
                fontSize: isMobile ? "1.8rem" : "2.2rem",
                fontWeight: 700,
                margin: 0,
                background:
                  theme === "dark"
                    ? "linear-gradient(90deg, #e5e7eb 0%, #9ca3af 100%)"
                    : "linear-gradient(90deg, #1e293b 0%, #334155 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              Find a Sharpr Center Near You
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "40px" : "48px",
            }}
          >
            {/* Current Locations */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                background: colors.cardGradient,
                padding: "24px",
                borderRadius: "16px",
                boxShadow: colors.cardShadow,
                border: `1px solid ${colors.cardBorder}`,
              }}
            >
              <h3
                style={{
                  fontSize: "1.3rem",
                  marginBottom: "20px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: theme === "dark" ? "#60a5fa" : "#4f46e5",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                ></span>
                Now Available
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "12px",
                }}
              >
                {locations.current.map((location) => (
                  <motion.div key={location.id} variants={itemVariants}>
                    <LocationButton
                      location={location}
                      colors={colors}
                      isCurrent={true}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Coming Soon Locations */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                background: colors.cardGradient,
                padding: "24px",
                borderRadius: "16px",
                boxShadow: colors.cardShadow,
                border: `1px solid ${colors.cardBorder}`,
              }}
            >
              <h3
                style={{
                  fontSize: "1.3rem",
                  marginBottom: "20px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: theme === "dark" ? "#9ca3af" : "#64748b",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#f59e0b",
                  }}
                ></span>
                Coming Soon
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "12px",
                }}
              >
                {locations.comingSoon.map((location) => (
                  <motion.div key={location.id} variants={itemVariants}>
                    <LocationButton
                      location={location}
                      colors={colors}
                      isCurrent={false}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Call to action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: isMobile ? "12px" : "20px",
              marginTop: "48px",
              flexDirection: isMobile ? "column" : "row",
              maxWidth: isMobile ? "100%" : "80%",
              margin: "48px auto 0",
            }}
          >
            <motion.a
              href="tel:9369428170"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "16px 28px",
                background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
                color: "#ffffff",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                fontSize: "1.05rem",
                flex: isMobile ? "1" : "",
              }}
            >
              <FaPhone /> Call Us Now
            </motion.a>

            <motion.a
              href="/notfound"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "16px 28px",
                background: theme === "dark" ? "#1f2937" : "#ffffff",
                color: theme === "dark" ? "#e5e7eb" : "#000000",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${
                  theme === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.05)"
                }`,
                fontSize: "1.05rem",
                flex: isMobile ? "1" : "",
              }}
            >
              <FaMapMarkerAlt /> Center Locator Map
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Locations;

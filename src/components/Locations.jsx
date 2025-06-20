import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
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
        y: -3,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "12px 20px",
        borderRadius: "8px",
        width: "100%",
        border: "none",
        background: isCurrent ? colors.buttonBg : colors.disabledBg,
        color: isCurrent ? colors.buttonText : colors.disabledText,
        fontWeight: 500,
        fontSize: "1rem",
        cursor: isCurrent ? "pointer" : "default",
        textAlign: "center",
        marginTop: "28px",
      }}
      onClick={() => isCurrent && console.log(`Selected ${location.name}`)}
    >
      {location.name}
    </motion.button>
  );
};

const Locations = () => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <>
      <section
        style={{
          padding: isMobile ? "24px 16px" : "40px 20px",
          background: colors.background,
          color: colors.text,
          marginTop: "50px",
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
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                background: "#f87171",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaMapMarkerAlt color="#fff" size={20} />
            </div>
            <h2
              style={{
                fontSize: isMobile ? "1.5rem" : "2rem",
                fontWeight: 700,
                margin: 0,
              }}
            >
              Find a Sharpr Center Near You
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "32px",
            }}
          >
            {/* Current Locations */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "16px",
                  fontWeight: 600,
                }}
              >
                Now in:
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "12px",
                }}
              >
                {locations.current.map((location, index) => (
                  <LocationButton
                    key={location.id}
                    location={location}
                    colors={colors}
                    isCurrent={true}
                  />
                ))}
              </div>
            </motion.div>

            {/* Coming Soon Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "16px",
                  fontWeight: 600,
                }}
              >
                Coming Soon:
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "12px",
                }}
              >
                {locations.comingSoon.map((location, index) => (
                  <LocationButton
                    key={location.id}
                    location={location}
                    colors={colors}
                    isCurrent={false}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Call to action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "40px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <motion.a
              href="tel:9369428170"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "#000000",
                color: "#ffffff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <FaPhone /> Call Us Now
            </motion.a>

            <motion.a
              href="/notfound"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "#ffffff",
                color: "#000000",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
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

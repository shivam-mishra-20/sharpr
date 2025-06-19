import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaStar,
  FaDirections,
  FaBuilding,
  FaRegCalendarCheck,
  FaSearch,
  FaChevronRight,
  FaRegClock,
  FaInfoCircle,
} from "react-icons/fa";
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
  accent: theme === "dark" ? "#f87171" : "#ef4444",
  cardHover: theme === "dark" ? "#2d3748" : "#f8fafc",
  tagBg: theme === "dark" ? "#374151" : "#f1f5f9",
  tagText: theme === "dark" ? "#e5e7eb" : "#334155",
  yellow: "#fbbf24",
  green: theme === "dark" ? "#34d399" : "#10b981",
});

// Enhanced locations data with more details
const locationsData = {
  current: [
    {
      id: 1,
      name: "Saket",
      address: "R-32, Block R, Saket, New Delhi, Delhi 110017",
      phone: "011-4567-8900",
      hours: "Mon-Sat: 10 AM - 8 PM",
      features: ["Study Rooms", "WiFi", "Cafeteria"],
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      name: "Karol Bagh",
      address: "15A/56, Ajmal Khan Road, Karol Bagh, New Delhi, 110005",
      phone: "011-2874-5623",
      hours: "Mon-Sat: 9 AM - 7 PM",
      features: ["Conference Rooms", "Library", "WiFi"],
      image:
        "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      name: "Faridabad",
      address: "SCO 45, Sector 15, Faridabad, Haryana 121007",
      phone: "0129-256-7890",
      hours: "Mon-Sun: 10 AM - 9 PM",
      features: ["24/7 Access", "Parking", "Cafeteria"],
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 4,
      name: "Jabalpur",
      address: "Civil Lines, Near Baldev Bagh, Jabalpur, MP 482002",
      phone: "0761-424-5678",
      hours: "Mon-Sat: 10 AM - 8 PM",
      features: ["Study Rooms", "WiFi", "Library"],
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ],
  comingSoon: [
    {
      id: 5,
      name: "Jaipur",
      address: "C-Scheme, Near Statue Circle, Jaipur, Rajasthan 302001",
      opening: "October 2023",
      features: ["Study Rooms", "Cafeteria", "Conference Rooms"],
      image:
        "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 6,
      name: "Lucknow",
      address: "Hazratganj, Lucknow, Uttar Pradesh 226001",
      opening: "November 2023",
      features: ["24/7 Access", "WiFi", "Library"],
      image:
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 7,
      name: "Varanasi",
      address: "Lanka, Varanasi, Uttar Pradesh 221005",
      opening: "December 2023",
      features: ["Study Rooms", "Cafeteria", "Parking"],
      image:
        "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
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

const FeatureTag = ({ feature, colors }) => (
  <span
    style={{
      display: "inline-block",
      padding: "4px 10px",
      backgroundColor: colors.tagBg,
      color: colors.tagText,
      borderRadius: "16px",
      fontSize: "0.75rem",
      fontWeight: 500,
      margin: "0 4px 4px 0",
    }}
  >
    {feature}
  </span>
);

const LocationCard = ({ location, isCurrent = true, colors, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: colors.cardShadow }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        background: colors.card,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: isHovered
          ? colors.cardShadow
          : "0 4px 6px rgba(0, 0, 0, 0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Status badge */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 2,
          backgroundColor: isCurrent ? colors.green : colors.accent,
          color: "#fff",
          borderRadius: "16px",
          padding: "4px 12px",
          fontSize: "0.7rem",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {isCurrent ? (
          <>
            <FaStar size={10} /> OPEN
          </>
        ) : (
          <>
            <FaRegCalendarCheck size={10} /> COMING SOON
          </>
        )}
      </div>

      {/* Location Image */}
      <div
        style={{
          position: "relative",
          height: "180px",
          overflow: "hidden",
          borderBottom: `1px solid ${colors.cardBorder}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)",
            zIndex: 1,
          }}
        />

        <img
          src={location.image}
          alt={location.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
      </div>

      {/* Location Details */}
      <div
        style={{
          padding: "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            margin: "0 0 10px 0",
            fontWeight: 600,
            color: colors.text,
          }}
        >
          {location.name}
        </h3>

        <p
          style={{
            margin: "0 0 12px 0",
            color: colors.textLight,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <FaMapMarkerAlt
            style={{ marginTop: "3px", flexShrink: 0, color: colors.accent }}
          />
          <span>{location.address}</span>
        </p>

        {isCurrent && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 0 12px 0",
              fontSize: "0.9rem",
              color: colors.textLight,
            }}
          >
            <FaRegClock style={{ marginRight: "8px", color: colors.primary }} />
            <span>{location.hours}</span>
          </div>
        )}

        {!isCurrent && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 0 12px 0",
              fontSize: "0.9rem",
              color: colors.primary,
              fontWeight: 500,
            }}
          >
            <FaRegCalendarCheck style={{ marginRight: "8px" }} />
            <span>Opening: {location.opening}</span>
          </div>
        )}

        <div style={{ margin: "8px 0 16px" }}>
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "0.85rem",
              color: colors.textLight,
              fontWeight: 500,
            }}
          >
            <FaInfoCircle size={12} style={{ marginRight: "6px" }} /> Features:
          </p>
          <div>
            {location.features.map((feature, index) => (
              <FeatureTag key={index} feature={feature} colors={colors} />
            ))}
          </div>
        </div>

        {/* Action button */}
        <div style={{ marginTop: "auto" }}>
          {isCurrent ? (
            <motion.a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                location.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                backgroundColor: colors.buttonBg,
                color: colors.buttonText,
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <span>Get Directions</span>
              <FaDirections size={16} />
            </motion.a>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                backgroundColor: "transparent",
                color: colors.primary,
                border: `1px solid ${colors.primary}`,
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 500,
                width: "100%",
              }}
              onClick={() =>
                alert(
                  `You'll be notified when our ${location.name} center opens!`
                )
              }
            >
              <span>Notify Me When Open</span>
              <FaChevronRight size={14} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SearchBar = ({ colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        maxWidth: "500px",
        margin: "0 auto 40px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          backgroundColor: colors.card,
          borderRadius: "12px",
          padding: "0 16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        <FaSearch color={colors.textLight} />
        <input
          type="text"
          placeholder="Search centers by location..."
          style={{
            border: "none",
            padding: "14px 16px",
            width: "100%",
            backgroundColor: "transparent",
            color: colors.text,
            fontSize: "1rem",
            outline: "none",
          }}
        />
      </div>
    </motion.div>
  );
};

const HeaderDecoration = ({ colors }) => (
  <>
    <div
      style={{
        position: "absolute",
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
        top: "-60px",
        left: "-80px",
        zIndex: 0,
      }}
    />

    <div
      style={{
        position: "absolute",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${colors.accent}15 0%, transparent 70%)`,
        top: "20%",
        right: "-60px",
        zIndex: 0,
      }}
    />

    <div
      style={{
        position: "absolute",
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
        bottom: "10%",
        left: "-75px",
        zIndex: 0,
      }}
    />
  </>
);

const Locations = () => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const [activeSection, setActiveSection] = useState("current");

  return (
    <section
      style={{
        padding: isMobile ? "40px 16px 60px" : "60px 24px 80px",
        background: colors.background,
        color: colors.text,
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <HeaderDecoration colors={colors} />

        {/* Header with location pin icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: "16px",
            marginBottom: "32px",
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: colors.accent,
              borderRadius: "50%",
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            }}
          >
            <FaBuilding color="#fff" size={24} />
          </div>
          <div>
            <h2
              style={{
                fontSize: isMobile ? "1.75rem" : "2.25rem",
                fontWeight: 700,
                margin: 0,
                backgroundClip: "text",
                backgroundImage: "linear-gradient(to right, #4f46e5, #8b5cf6)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Find a Sharpr Center Near You
            </h2>
            <p
              style={{
                margin: "8px 0 0",
                color: colors.textLight,
                fontSize: "1rem",
                maxWidth: "600px",
              }}
            >
              Access world-class facilities and services at our conveniently
              located centers
            </p>
          </div>
        </motion.div>

        {/* Search bar
        <SearchBar colors={colors} /> */}

        {/* Toggle for Current vs Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: colors.cardHover,
              borderRadius: "12px",
              padding: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <button
              onClick={() => setActiveSection("current")}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor:
                  activeSection === "current" ? colors.primary : "transparent",
                color: activeSection === "current" ? "#fff" : colors.text,
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              Available Centers
            </button>
            <button
              onClick={() => setActiveSection("comingSoon")}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor:
                  activeSection === "comingSoon"
                    ? colors.primary
                    : "transparent",
                color: activeSection === "comingSoon" ? "#fff" : colors.text,
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              Coming Soon
            </button>
          </div>
        </motion.div>

        {/* Location Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : activeSection === "current" ||
                locationsData[activeSection].length > 2
              ? "repeat(auto-fill, minmax(280px, 1fr))"
              : "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {locationsData[activeSection].map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              colors={colors}
              isCurrent={activeSection === "current"}
              isMobile={isMobile}
            />
          ))}
        </motion.div>

        {/* Call to action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginTop: "48px",
            flexDirection: isMobile ? "column" : "row",
            position: "relative",
            zIndex: 1,
            maxWidth: "600px",
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
              padding: "16px 32px",
              background: "linear-gradient(to right, #4f46e5, #8b5cf6)",
              color: "#ffffff",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
              flex: isMobile ? "unset" : 1,
            }}
          >
            <FaPhone /> Call Us Now
          </motion.a>

          <motion.a
            href="/find-centers"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "16px 32px",
              background: "#ffffff",
              color: "#4f46e5",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(79, 70, 229, 0.3)",
              flex: isMobile ? "unset" : 1,
            }}
          >
            <FaMapMarkerAlt /> View Interactive Map
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Locations;

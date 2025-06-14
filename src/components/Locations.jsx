import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaDirections,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Enhanced color system with theme awareness
const getColors = (theme) => ({
  primary: theme === "dark" ? "#60a5fa" : "#4f46e5",
  primaryLight: theme === "dark" ? "#93c5fd" : "#818cf8",
  secondary: theme === "dark" ? "#818cf8" : "#8b5cf6",
  background:
    theme === "dark"
      ? "linear-gradient(135deg, #111827 0%, #1e293b 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
  backgroundAlt: theme === "dark" ? "#1f2937" : "#f0f4ff",
  text: theme === "dark" ? "#e5e7eb" : "#1e293b",
  textLight: theme === "dark" ? "#9ca3af" : "#64748b",
  highlight: theme === "dark" ? "#60a5fa" : "#6d28d9",
  card: theme === "dark" ? "#1f2937" : "#ffffff",
  accent: theme === "dark" ? "#38bdf8" : "#06b6d4",
  success: theme === "dark" ? "#34d399" : "#10b981",
  muted: theme === "dark" ? "#374151" : "#f1f5f9",
  cardShadow:
    theme === "dark"
      ? "0 10px 30px rgba(0, 0, 0, 0.3)"
      : "0 10px 30px rgba(0, 0, 0, 0.05)",
  cardBorder: theme === "dark" ? "#374151" : "rgba(226, 232, 240, 0.8)",
  decorativeBg:
    theme === "dark" ? "rgba(96, 165, 250, 0.05)" : "rgba(79, 70, 229, 0.05)",
});

const branches = [
  {
    id: 1,
    city: "Bengaluru",
    tagline: "Our Flagship Center",
    address: "123 Tech Plaza, Innovation District, Bengaluru, Karnataka 560001",
    phone: "+91 98765 43210",
    email: "blr@sharpr.edu",
    lat: 12.9716,
    lng: 77.5946,
    hours: "Mon-Sat: 9AM-7PM, Sun: Closed",
    amenities: [
      "Smart Classrooms",
      "Computer Lab",
      "Library",
      "Recreation Area",
    ],
    staff: "18+ Certified Teachers",
    studentsEnrolled: "450+",
    courses: "8+ Programs",
    featured: true,
    googleMap:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.858956112785!2d77.5924113152607!3d12.97159899085708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c3b2b2b9%3A0x7e4d8e6e8e8e8e8e!2sBengaluru!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin",
  },
  {
    id: 2,
    city: "Delhi",
    tagline: "NCR Learning Hub",
    address: "456 Knowledge Park, Connaught Place, New Delhi 110001",
    phone: "+91 99887 66554",
    email: "delhi@sharpr.edu",
    lat: 28.6139,
    lng: 77.209,
    hours: "Mon-Sat: 8:30AM-7:30PM, Sun: 10AM-2PM",
    amenities: [
      "Digital Classroom",
      "Science Lab",
      "Study Lounge",
      "Cafeteria",
    ],
    staff: "15+ Certified Teachers",
    studentsEnrolled: "380+",
    courses: "7+ Programs",
    featured: false,
    googleMap:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.8391983662!2d77.06889999999999!3d28.527280000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2b2f8c8c8c8%3A0x7e4d8e6e8e8e8e8e!2sDelhi!5e0!3m2!1sen!2sin!4v1680000000001!5m2!1sen!2sin",
  },
  {
    id: 3,
    city: "Mumbai",
    tagline: "West Coast Center",
    address: "789 Edu Hub, Bandra West, Mumbai, Maharashtra 400050",
    phone: "+91 90000 12345",
    email: "mumbai@sharpr.edu",
    lat: 19.076,
    lng: 72.8777,
    hours: "Mon-Sat: 9AM-8PM, Sun: Closed",
    amenities: [
      "Smart Classrooms",
      "Coding Lab",
      "Counseling Center",
      "Sports Area",
    ],
    staff: "12+ Certified Teachers",
    studentsEnrolled: "320+",
    courses: "6+ Programs",
    featured: true,
    // No googleMap property, will show placeholder
  },
  {
    id: 4,
    city: "Hyderabad",
    tagline: "Southern Knowledge Point",
    address: "101 NextGen Tower, Hitech City, Hyderabad, Telangana 500081",
    phone: "+91 91234 56789",
    email: "hyd@sharpr.edu",
    lat: 17.444,
    lng: 78.377,
    hours: "Mon-Sat: 9AM-7PM, Sun: Closed",
    amenities: ["Smart Classrooms", "Innovation Lab", "Cafeteria"],
    staff: "10+ Certified Teachers",
    studentsEnrolled: "250+",
    courses: "5+ Programs",
    featured: false,
    googleMap:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.406504634812!2d78.374998315342!3d17.444000000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93b2b2b2b2b2%3A0x7e4d8e6e8e8e8e8e!2sHyderabad!5e0!3m2!1sen!2sin!4v1680000000002!5m2!1sen!2sin",
  },
  {
    id: 5,
    city: "Chennai",
    tagline: "Coastal Learning Center",
    address: "202 Edu Heights, T Nagar, Chennai, Tamil Nadu 600017",
    phone: "+91 93456 78901",
    email: "chennai@sharpr.edu",
    lat: 13.0827,
    lng: 80.2707,
    hours: "Mon-Sat: 8AM-6PM, Sun: Closed",
    amenities: ["Digital Classroom", "Library", "Sports Area"],
    staff: "8+ Certified Teachers",
    studentsEnrolled: "180+",
    courses: "4+ Programs",
    featured: false,
    // No googleMap property, will show placeholder
  },
  {
    id: 6,
    city: "Pune",
    tagline: "Innovation Campus",
    address: "303 Learning Lane, Baner, Pune, Maharashtra 411045",
    phone: "+91 94567 12345",
    email: "pune@sharpr.edu",
    lat: 18.5204,
    lng: 73.8567,
    hours: "Mon-Sat: 9AM-7PM, Sun: Closed",
    amenities: ["Smart Classrooms", "Coding Lab"],
    staff: "7+ Certified Teachers",
    studentsEnrolled: "120+",
    courses: "3+ Programs",
    featured: false,
    googleMap:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.406504634812!2d73.854998315342!3d18.520400000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93b2b2b2b2b2%3A0x7e4d8e6e8e8e8e8e!2sPune!5e0!3m2!1sen!2sin!4v1680000000003!5m2!1sen!2sin",
  },
];

// Hook to detect mobile view
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

const Locations = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const colors = getColors(theme);

  // Filter branches based on active tab
  const filteredBranches =
    activeTab === "all"
      ? branches
      : activeTab === "featured"
      ? branches.filter((b) => b.featured)
      : branches;

  // Mobile rendering function
  const renderMobile = () => (
    <section
      style={{
        background: colors.background,
        padding: "18px 0",
        position: "relative",
        overflow: "hidden",
      }}
      aria-labelledby="locations-heading"
    >
      {/* Decorative Elements */}
      <motion.div
        style={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: colors.decorativeBg,
          filter: "blur(30px)",
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      <div
        style={{
          width: "100%",
          maxWidth: 500,
          margin: "0 auto",
          padding: "0 4px",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <motion.h2
          id="locations-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 10,
            color: colors.highlight,
            position: "relative",
            display: "inline-block",
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            Our Learning Centers
            <motion.span
              style={{
                position: "absolute",
                height: "6px",
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                bottom: "-8px",
                left: "25%",
                right: "25%",
                borderRadius: "4px",
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            textAlign: "center",
            color: colors.textLight,
            fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
            maxWidth: 500,
            margin: "0 auto 14px",
            lineHeight: 1.4,
          }}
        >
          Visit our state-of-the-art learning centers across India. Each
          location offers modern facilities and experienced faculty to help
          students excel.
        </motion.p>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
          role="tablist"
          aria-label="Location filters"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("all")}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: "none",
              background: activeTab === "all" ? colors.primary : colors.muted,
              color: activeTab === "all" ? "white" : colors.text,
              fontWeight: activeTab === "all" ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                activeTab === "all"
                  ? theme === "dark"
                    ? "0 2px 8px rgba(96, 165, 250, 0.18)"
                    : "0 2px 8px rgba(79, 70, 229, 0.18)"
                  : "none",
              fontSize: "0.95rem",
            }}
            role="tab"
            aria-selected={activeTab === "all"}
            aria-controls="all-locations-panel"
          >
            All Locations
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("featured")}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: "none",
              background:
                activeTab === "featured" ? colors.primary : colors.muted,
              color: activeTab === "featured" ? "white" : colors.text,
              fontWeight: activeTab === "featured" ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                activeTab === "featured"
                  ? theme === "dark"
                    ? "0 2px 8px rgba(96, 165, 250, 0.18)"
                    : "0 2px 8px rgba(79, 70, 229, 0.18)"
                  : "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.95rem",
            }}
            role="tab"
            aria-selected={activeTab === "featured"}
            aria-controls="featured-locations-panel"
          >
            <span>Featured Centers</span>
            <span
              style={{
                background: theme === "dark" ? "#3b82f6" : "#4338ca",
                color: "white",
                fontSize: "0.65rem",
                padding: "2px 6px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              NEW
            </span>
          </motion.button>
        </motion.div>

        {/* Branch cards */}
        <div
          role="tabpanel"
          id={
            activeTab === "all"
              ? "all-locations-panel"
              : "featured-locations-panel"
          }
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
          }}
        >
          {filteredBranches.map((branch, i) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onMouseEnter={() => setHoveredCard(branch.id)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
                boxShadow:
                  theme === "dark"
                    ? "0 20px 40px rgba(0, 0, 0, 0.2)"
                    : "0 20px 40px rgba(0, 0, 0, 0.1)",
              }}
              style={{
                background: colors.card,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow:
                  theme === "dark"
                    ? "0 4px 16px rgba(0, 0, 0, 0.15)"
                    : "0 4px 16px rgba(0, 0, 0, 0.07)",
                border: `1px solid ${colors.cardBorder}`,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative",
                transition: "all 0.3s ease",
                fontSize: "0.97rem",
                color: colors.text,
              }}
              role="region"
              aria-label={`${branch.city} branch information`}
            >
              {/* Featured badge if applicable */}
              {branch.featured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 10,
                    background:
                      theme === "dark"
                        ? "linear-gradient(135deg, #3b82f6 0%, #818cf8 100%)"
                        : "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: 16,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    boxShadow:
                      theme === "dark"
                        ? "0 2px 8px rgba(96, 165, 250, 0.18)"
                        : "0 2px 8px rgba(79, 70, 229, 0.18)",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Featured Center
                </motion.div>
              )}

              <div
                style={{
                  position: "relative",
                  height: 90,
                  overflow: "hidden",
                  borderRadius: "16px 16px 0 0",
                }}
              >
                {/* Map or Placeholder */}
                {branch.googleMap ? (
                  <iframe
                    title={`${branch.city} map`}
                    src={branch.googleMap}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: 0,
                      position: "absolute",
                    }}
                    loading="lazy"
                    allowFullScreen=""
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: theme === "dark" ? "#2d3748" : "#e0e7ef",
                      color: theme === "dark" ? "#9ca3af" : "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      position: "absolute",
                      left: 0,
                      top: 0,
                      borderRadius: "16px 16px 0 0",
                      border:
                        theme === "dark"
                          ? "1px dashed #4b5563"
                          : "1px dashed #b6b6b6",
                      zIndex: 1,
                    }}
                  >
                    Map Unavailable
                  </div>
                )}

                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    color: "white",
                    padding: "0 10px",
                  }}
                  animate={{
                    backgroundColor:
                      hoveredCard === branch.id
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(0, 0, 0, 0.3)",
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h3
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.25rem)",
                      fontWeight: 700,
                      margin: 0,
                      textAlign: "center",
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                    animate={{
                      scale: hoveredCard === branch.id ? 1.05 : 1,
                      y: hoveredCard === branch.id ? -5 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {branch.city}
                  </motion.h3>
                  <motion.p
                    style={{
                      fontSize: "0.85rem",
                      margin: "4px 0 0 0",
                      opacity: 0.9,
                      fontWeight: 500,
                      textAlign: "center",
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                    animate={{
                      opacity: hoveredCard === branch.id ? 1 : 0.9,
                      y: hoveredCard === branch.id ? -5 : 0,
                    }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {branch.tagline}
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 3,
                  }}
                >
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      padding: "5px 10px",
                      background: "white",
                      color: colors.primary,
                      borderRadius: 20,
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 16px rgba(0,0,0,0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.1)";
                    }}
                    aria-label={`Get directions to ${branch.city} branch`}
                  >
                    <FaDirections size={12} />
                    Directions
                  </a>
                </motion.div>
              </div>

              {/* Branch stats */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  background: colors.muted,
                  padding: "7px 0",
                  borderBottom: `1px solid ${colors.cardBorder}`,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: colors.textLight }}>
                    Staff
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: colors.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "3px",
                    }}
                  >
                    <FaChalkboardTeacher color={colors.primary} size={13} />
                    {branch.staff}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: colors.textLight }}>
                    Students
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: colors.text,
                    }}
                  >
                    {branch.studentsEnrolled}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: colors.textLight }}>
                    Courses
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: colors.text,
                    }}
                  >
                    {branch.courses}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "clamp(10px, 2vw, 16px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 7,
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: 12,
                      background: colors.backgroundAlt,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 1,
                    }}
                  >
                    <FaMapMarkerAlt color={colors.primary} size={12} />
                  </motion.div>
                  <span
                    style={{
                      color: colors.text,
                      lineHeight: 1.4,
                      textAlign: "left",
                      fontSize: "0.93rem",
                    }}
                  >
                    {branch.address}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: 12,
                      background: colors.backgroundAlt,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaPhone color={colors.primary} size={12} />
                  </motion.div>
                  <a
                    href={`tel:${branch.phone}`}
                    style={{
                      color: colors.primary,
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "color 0.2s ease",
                      fontSize: "0.93rem",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = colors.secondary;
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = colors.primary;
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    {branch.phone}
                  </a>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <motion.div
                    whileHover={{
                      y: [0, -5, 0],
                      transition: { duration: 0.5 },
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: 12,
                      background: colors.backgroundAlt,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaEnvelope color={colors.primary} size={12} />
                  </motion.div>
                  <a
                    href={`mailto:${branch.email}`}
                    style={{
                      color: colors.primary,
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "color 0.2s ease",
                      fontSize: "0.93rem",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = colors.secondary;
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = colors.primary;
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    {branch.email}
                  </a>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <motion.div
                    animate={{ rotate: hoveredCard === branch.id ? 360 : 0 }}
                    transition={{ duration: 1.5 }}
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: 12,
                      background: colors.backgroundAlt,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaClock color={colors.primary} size={12} />
                  </motion.div>
                  <span style={{ color: colors.text, fontSize: "0.93rem" }}>
                    {branch.hours}
                  </span>
                </div>
                {/* Amenities and Schedule a Visit button removed */}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            textAlign: "center",
            marginTop: 30,
            width: "100%",
          }}
        >
          <motion.a
            href="/contact"
            whileHover={{
              scale: 1.05,
              boxShadow:
                theme === "dark"
                  ? "0 10px 30px rgba(96, 165, 250, 0.3)"
                  : "0 10px 30px rgba(79, 70, 229, 0.3)",
              backgroundPosition: "right center",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
              background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)`,
              backgroundSize: "200% auto",
              color: "white",
              fontWeight: 600,
              borderRadius: 10,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow:
                theme === "dark"
                  ? "0 3px 8px rgba(96, 165, 250, 0.18)"
                  : "0 3px 8px rgba(79, 70, 229, 0.18)",
              transition: "all 0.4s ease",
            }}
          >
            Book a Free Demo Class
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: 10 }}
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </motion.a>
          <p
            style={{
              marginTop: 10,
              fontSize: "0.85rem",
              color: colors.textLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Limited spots available. Reserve your seat now.
          </p>
        </motion.div>
      </div>
    </section>
  );

  // Main render
  if (isMobile) return renderMobile();

  return (
    <section
      style={{
        background: colors.background,
        padding: "40px 0",
        position: "relative",
        overflow: "hidden",
      }}
      aria-labelledby="locations-heading"
    >
      {/* Decorative Elements */}
      <motion.div
        style={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: 180, // smaller
          height: 180,
          borderRadius: "50%",
          background: "rgba(79, 70, 229, 0.05)",
          filter: "blur(30px)",
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      <div
        style={{
          width: "100%",
          maxWidth: 1000, // smaller max width
          margin: "0 auto",
          padding: "0 12px", // less padding
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <motion.h2
          id="locations-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)", // smaller
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 10,
            color: colors.highlight,
            position: "relative",
            display: "inline-block",
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            Our Learning Centers
            <motion.span
              style={{
                position: "absolute",
                height: "6px",
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                bottom: "-8px",
                left: "25%",
                right: "25%",
                borderRadius: "4px",
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            textAlign: "center",
            color: colors.textLight,
            fontSize: "clamp(0.9rem, 1.5vw, 1rem)", // smaller
            maxWidth: 500,
            margin: "0 auto 14px",
            lineHeight: 1.4,
          }}
        >
          Visit our state-of-the-art learning centers across India. Each
          location offers modern facilities and experienced faculty to help
          students excel.
        </motion.p>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
          role="tablist"
          aria-label="Location filters"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("all")}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: "none",
              background: activeTab === "all" ? colors.primary : colors.muted,
              color: activeTab === "all" ? "white" : colors.text,
              fontWeight: activeTab === "all" ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                activeTab === "all"
                  ? theme === "dark"
                    ? "0 2px 8px rgba(96, 165, 250, 0.18)"
                    : "0 2px 8px rgba(79, 70, 229, 0.18)"
                  : "none",
              fontSize: "0.95rem",
            }}
            role="tab"
            aria-selected={activeTab === "all"}
            aria-controls="all-locations-panel"
          >
            All Locations
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("featured")}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: "none",
              background:
                activeTab === "featured" ? colors.primary : colors.muted,
              color: activeTab === "featured" ? "white" : colors.text,
              fontWeight: activeTab === "featured" ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                activeTab === "featured"
                  ? theme === "dark"
                    ? "0 2px 8px rgba(96, 165, 250, 0.18)"
                    : "0 2px 8px rgba(79, 70, 229, 0.18)"
                  : "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.95rem",
            }}
            role="tab"
            aria-selected={activeTab === "featured"}
            aria-controls="featured-locations-panel"
          >
            <span>Featured Centers</span>
            <span
              style={{
                background: theme === "dark" ? "#3b82f6" : "#4338ca",
                color: "white",
                fontSize: "0.65rem",
                padding: "2px 6px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              NEW
            </span>
          </motion.button>
        </motion.div>

        {/* Branch cards */}
        <div
          role="tabpanel"
          id={
            activeTab === "all"
              ? "all-locations-panel"
              : "featured-locations-panel"
          }
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // smaller min width
            gap: "clamp(12px, 2vw, 20px)",
            width: "100%",
          }}
        >
          {filteredBranches.map((branch, i) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onMouseEnter={() => setHoveredCard(branch.id)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
                boxShadow:
                  theme === "dark"
                    ? "0 20px 40px rgba(0, 0, 0, 0.2)"
                    : "0 20px 40px rgba(0, 0, 0, 0.1)",
              }}
              style={{
                background: colors.card,
                borderRadius: 16, // smaller
                overflow: "hidden",
                boxShadow:
                  theme === "dark"
                    ? "0 4px 16px rgba(0, 0, 0, 0.15)"
                    : "0 4px 16px rgba(0, 0, 0, 0.07)",
                border: `1px solid ${colors.cardBorder}`,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative",
                transition: "all 0.3s ease",
                fontSize: "0.97rem", // smaller
              }}
              role="region"
              aria-label={`${branch.city} branch information`}
            >
              {/* Featured badge if applicable */}
              {branch.featured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 10,
                    background:
                      theme === "dark"
                        ? "linear-gradient(135deg, #3b82f6 0%, #818cf8 100%)"
                        : "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: 16,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    boxShadow:
                      theme === "dark"
                        ? "0 2px 8px rgba(96, 165, 250, 0.18)"
                        : "0 2px 8px rgba(79, 70, 229, 0.18)",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Featured Center
                </motion.div>
              )}

              <div
                style={{
                  position: "relative",
                  height: 120, // smaller map height
                  overflow: "hidden",
                  borderRadius: "16px 16px 0 0",
                }}
              >
                {/* Map or Placeholder */}
                {branch.googleMap ? (
                  <iframe
                    title={`${branch.city} map`}
                    src={branch.googleMap}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: 0,
                      position: "absolute",
                    }}
                    loading="lazy"
                    allowFullScreen=""
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: theme === "dark" ? "#2d3748" : "#e0e7ef",
                      color: theme === "dark" ? "#9ca3af" : "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      position: "absolute",
                      left: 0,
                      top: 0,
                      borderRadius: "16px 16px 0 0",
                      border:
                        theme === "dark"
                          ? "1px dashed #4b5563"
                          : "1px dashed #b6b6b6",
                      zIndex: 1,
                    }}
                  >
                    Map Unavailable
                  </div>
                )}

                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    color: "white",
                    padding: "0 10px",
                  }}
                  animate={{
                    backgroundColor:
                      hoveredCard === branch.id
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(0, 0, 0, 0.3)",
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h3
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.25rem)", // smaller
                      fontWeight: 700,
                      margin: 0,
                      textAlign: "center",
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                    animate={{
                      scale: hoveredCard === branch.id ? 1.05 : 1,
                      y: hoveredCard === branch.id ? -5 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {branch.city}
                  </motion.h3>
                  <motion.p
                    style={{
                      fontSize: "0.85rem", // smaller
                      margin: "4px 0 0 0",
                      opacity: 0.9,
                      fontWeight: 500,
                      textAlign: "center",
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                    animate={{
                      opacity: hoveredCard === branch.id ? 1 : 0.9,
                      y: hoveredCard === branch.id ? -5 : 0,
                    }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {branch.tagline}
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 3,
                  }}
                >
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      padding: "5px 10px",
                      background: "white",
                      color: colors.primary,
                      borderRadius: 20,
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 16px rgba(0,0,0,0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.1)";
                    }}
                    aria-label={`Get directions to ${branch.city} branch`}
                  >
                    <FaDirections size={12} />
                    Directions
                  </a>
                </motion.div>
              </div>

              {/* Branch stats */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  background: colors.muted,
                  padding: "7px 0",
                  borderBottom: `1px solid ${colors.cardBorder}`,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: colors.textLight }}>
                    Staff
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: colors.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "3px",
                    }}
                  >
                    <FaChalkboardTeacher color={colors.primary} size={13} />
                    {branch.staff}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: colors.textLight }}>
                    Students
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: colors.text,
                    }}
                  >
                    {branch.studentsEnrolled}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: colors.textLight }}>
                    Courses
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: colors.text,
                    }}
                  >
                    {branch.courses}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "clamp(10px, 2vw, 16px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 7,
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: 12,
                      background: colors.backgroundAlt,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 1,
                    }}
                  >
                    <FaMapMarkerAlt color={colors.primary} size={12} />
                  </motion.div>
                  <span
                    style={{
                      color: colors.text,
                      lineHeight: 1.4,
                      textAlign: "left",
                      fontSize: "0.93rem",
                    }}
                  >
                    {branch.address}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: 12,
                      background: colors.backgroundAlt,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaPhone color={colors.primary} size={12} />
                  </motion.div>
                  <a
                    href={`tel:${branch.phone}`}
                    style={{
                      color: colors.primary,
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "color 0.2s ease",
                      fontSize: "0.93rem",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = colors.secondary;
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = colors.primary;
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    {branch.phone}
                  </a>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <motion.div
                    whileHover={{
                      y: [0, -5, 0],
                      transition: { duration: 0.5 },
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: 12,
                      background: colors.backgroundAlt,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaEnvelope color={colors.primary} size={12} />
                  </motion.div>
                  <a
                    href={`mailto:${branch.email}`}
                    style={{
                      color: colors.primary,
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "color 0.2s ease",
                      fontSize: "0.93rem",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = colors.secondary;
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = colors.primary;
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    {branch.email}
                  </a>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <motion.div
                    animate={{ rotate: hoveredCard === branch.id ? 360 : 0 }}
                    transition={{ duration: 1.5 }}
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: 12,
                      background: colors.backgroundAlt,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaClock color={colors.primary} size={12} />
                  </motion.div>
                  <span style={{ color: colors.text, fontSize: "0.93rem" }}>
                    {branch.hours}
                  </span>
                </div>
                {/* Amenities and Schedule a Visit button removed */}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            textAlign: "center",
            marginTop: 30,
            width: "100%",
          }}
        >
          <motion.a
            href="/contact"
            whileHover={{
              scale: 1.05,
              boxShadow:
                theme === "dark"
                  ? "0 10px 30px rgba(96, 165, 250, 0.3)"
                  : "0 10px 30px rgba(79, 70, 229, 0.3)",
              backgroundPosition: "right center",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
              background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)`,
              backgroundSize: "200% auto",
              color: "white",
              fontWeight: 600,
              borderRadius: 10,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow:
                theme === "dark"
                  ? "0 3px 8px rgba(96, 165, 250, 0.18)"
                  : "0 3px 8px rgba(79, 70, 229, 0.18)",
              transition: "all 0.4s ease",
            }}
          >
            Book a Free Demo Class
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: 10 }}
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </motion.a>
          <p
            style={{
              marginTop: 10,
              fontSize: "0.85rem",
              color: colors.textLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Limited spots available. Reserve your seat now.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Locations;

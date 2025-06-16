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
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=77.5846%2C12.9616%2C77.6046%2C12.9816&amp;layer=mapnik&amp;marker=12.9716%2C77.5946",
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
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=77.199%2C28.6039%2C77.219%2C28.6239&amp;layer=mapnik&amp;marker=28.6139%2C77.209",
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
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=72.8677%2C19.066%2C72.8877%2C19.086&amp;layer=mapnik&amp;marker=19.076%2C72.8777",
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
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=78.367%2C17.434%2C78.387%2C17.454&amp;layer=mapnik&amp;marker=17.444%2C78.377",
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
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=80.2607%2C13.0727%2C80.2807%2C13.0927&amp;layer=mapnik&amp;marker=13.0827%2C80.2707",
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
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=73.8467%2C18.5104%2C73.8667%2C18.5304&amp;layer=mapnik&amp;marker=18.5204%2C73.8567",
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

const LocationCard = ({
  branch,
  hoveredCard,
  setHoveredCard,
  colors,
  theme,
}) => {
  return (
    <motion.div
      key={branch.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setHoveredCard(branch.id)}
      onMouseLeave={() => setHoveredCard(null)}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
        boxShadow:
          theme === "dark"
            ? "0 15px 30px rgba(0, 0, 0, 0.2)"
            : "0 15px 30px rgba(0, 0, 0, 0.1)",
      }}
      style={{
        background: colors.card,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: colors.cardShadow,
        border: `1px solid ${colors.cardBorder}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.3s ease",
        color: colors.text,
      }}
      role="region"
      aria-label={`${branch.city} branch information`}
    >
      {/* Map Section */}
      <div
        style={{
          position: "relative",
          height: "140px",
          overflow: "hidden",
        }}
      >
        {branch.mapEmbedUrl ? (
          <iframe
            title={`${branch.city} map`}
            src={branch.mapEmbedUrl}
            style={{
              width: "100%",
              height: "100%",
              border: 0,
            }}
            loading="lazy"
            allowFullScreen=""
            aria-label={`${branch.city} branch location`}
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
              fontSize: "0.9rem",
            }}
          >
            Map Unavailable
          </div>
        )}

        {/* City overlay */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
          animate={{
            backgroundColor:
              hoveredCard === branch.id
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(0, 0, 0, 0.25)",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              margin: 0,
              color: "white",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
            animate={{
              scale: hoveredCard === branch.id ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {branch.city}
          </motion.h3>
        </motion.div>

        {/* Directions button */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "5px 10px",
            background: "white",
            color: colors.primary,
            borderRadius: "20px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.75rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 10,
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
          }}
          aria-label={`Get directions to ${branch.city} branch`}
        >
          <FaDirections size={10} />
          Directions
        </a>

        {/* Featured badge */}
        {branch.featured && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "0.65rem",
              fontWeight: 600,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              zIndex: 10,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Featured
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Branch tagline */}
        <p
          style={{
            color: colors.textLight,
            fontSize: "0.85rem",
            margin: 0,
            fontWeight: 500,
            marginBottom: "4px",
          }}
        >
          {branch.tagline}
        </p>

        {/* Contact info - streamlined */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Address - most important info */}
          <div style={{ display: "flex", gap: "8px" }}>
            <FaMapMarkerAlt
              size={14}
              color={colors.primary}
              style={{ marginTop: "3px", flexShrink: 0 }}
            />
            <span style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
              {branch.address}
            </span>
          </div>

          {/* Contact methods */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "2px",
            }}
          >
            <a
              href={`tel:${branch.phone}`}
              style={{
                color: colors.primary,
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              aria-label={`Call ${branch.city} branch`}
            >
              <FaPhone size={12} />
              Call
            </a>
            <a
              href={`mailto:${branch.email}`}
              style={{
                color: colors.primary,
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              aria-label={`Email ${branch.city} branch`}
            >
              <FaEnvelope size={12} />
              Email
            </a>
          </div>

          {/* Hours - simplified */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.8rem",
              color: colors.textLight,
              marginTop: "2px",
            }}
          >
            <FaClock size={12} color={colors.primary} />
            {branch.hours}
          </div>
        </div>

        {/* Stats Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "12px",
            borderTop: `1px solid ${colors.muted}`,
            fontSize: "0.8rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FaChalkboardTeacher size={12} color={colors.primary} />
            <span>{branch.staff.split(" ")[0]}</span>
          </div>
          <div>
            <span style={{ fontWeight: 600 }}>{branch.studentsEnrolled}</span>{" "}
            Students
          </div>
          <div>
            <span style={{ fontWeight: 600 }}>
              {branch.courses.split(" ")[0]}
            </span>{" "}
            Courses
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Locations = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
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
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
        marginTop: 50,
      }}
      aria-labelledby="locations-heading"
    >
      {/* Decorative background blur */}
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
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
      />

      <div
        style={{
          width: "100%",
          maxWidth: 500,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Section Title */}
        <motion.h2
          id="locations-heading"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: "12px",
            color: colors.highlight,
          }}
        >
          Our Learning Centers
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            textAlign: "center",
            color: colors.textLight,
            fontSize: "0.95rem",
            maxWidth: 500,
            margin: "0 auto 20px",
            lineHeight: 1.5,
          }}
        >
          Visit our state-of-the-art learning centers across India
        </motion.p>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
          role="tablist"
          aria-label="Location filters"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("all")}
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              border: "none",
              background: activeTab === "all" ? colors.primary : colors.muted,
              color: activeTab === "all" ? "white" : colors.text,
              fontWeight: activeTab === "all" ? 600 : 500,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
            role="tab"
            aria-selected={activeTab === "all"}
          >
            All Locations
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("featured")}
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              border: "none",
              background:
                activeTab === "featured" ? colors.primary : colors.muted,
              color: activeTab === "featured" ? "white" : colors.text,
              fontWeight: activeTab === "featured" ? 600 : 500,
              cursor: "pointer",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            role="tab"
            aria-selected={activeTab === "featured"}
          >
            Featured Centers
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "0.65rem",
                padding: "2px 6px",
                borderRadius: "10px",
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
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
          }}
        >
          {filteredBranches.map((branch) => (
            <LocationCard
              key={branch.id}
              branch={branch}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              colors={colors}
              theme={theme}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
            marginTop: "32px",
            width: "100%",
          }}
        >
          <motion.a
            href="/contact"
            whileHover={{
              scale: 1.03,
              backgroundPosition: "right center",
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 24px",
              background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)`,
              backgroundSize: "200% auto",
              color: "white",
              fontWeight: 600,
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "0.95rem",
              boxShadow: "0 4px 10px rgba(79, 70, 229, 0.2)",
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
              style={{ marginLeft: 8 }}
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );

  // Desktop view
  if (isMobile) return renderMobile();

  return (
    <section
      style={{
        background: colors.background,
        padding: "60px 20px",
        position: "relative",
        overflow: "hidden",
        marginTop: 50,
      }}
      aria-labelledby="locations-heading"
    >
      {/* Decorative background blur */}
      <motion.div
        style={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(79, 70, 229, 0.05)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
      />

      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Section Title */}
        <motion.h2
          id="locations-heading"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: "12px",
            color: colors.highlight,
          }}
        >
          Our Learning Centers
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            textAlign: "center",
            color: colors.textLight,
            fontSize: "1.1rem",
            maxWidth: 600,
            margin: "0 auto 32px",
            lineHeight: 1.5,
          }}
        >
          Visit our state-of-the-art learning centers across India
        </motion.p>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "36px",
          }}
          role="tablist"
          aria-label="Location filters"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab("all")}
            style={{
              padding: "10px 24px",
              borderRadius: "14px",
              border: "none",
              background: activeTab === "all" ? colors.primary : colors.muted,
              color: activeTab === "all" ? "white" : colors.text,
              fontWeight: activeTab === "all" ? 600 : 500,
              cursor: "pointer",
              fontSize: "1rem",
            }}
            role="tab"
            aria-selected={activeTab === "all"}
          >
            All Locations
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab("featured")}
            style={{
              padding: "10px 24px",
              borderRadius: "14px",
              border: "none",
              background:
                activeTab === "featured" ? colors.primary : colors.muted,
              color: activeTab === "featured" ? "white" : colors.text,
              fontWeight: activeTab === "featured" ? 600 : 500,
              cursor: "pointer",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            role="tab"
            aria-selected={activeTab === "featured"}
          >
            Featured Centers
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "0.7rem",
                padding: "2px 8px",
                borderRadius: "10px",
                fontWeight: 600,
              }}
            >
              NEW
            </span>
          </motion.button>
        </motion.div>

        {/* Branch cards - grid layout */}
        <div
          role="tabpanel"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            width: "100%",
          }}
        >
          {filteredBranches.map((branch) => (
            <LocationCard
              key={branch.id}
              branch={branch}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              colors={colors}
              theme={theme}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
            marginTop: "48px",
            width: "100%",
          }}
        >
          <motion.a
            href="/contact"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 30px rgba(79, 70, 229, 0.3)",
              backgroundPosition: "right center",
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 32px",
              background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)`,
              backgroundSize: "200% auto",
              color: "white",
              fontWeight: 600,
              borderRadius: "14px",
              textDecoration: "none",
              fontSize: "1.1rem",
              boxShadow: "0 4px 15px rgba(79, 70, 229, 0.2)",
            }}
          >
            Book a Free Demo Class
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
        </motion.div>
      </div>
    </section>
  );
};

export default Locations;

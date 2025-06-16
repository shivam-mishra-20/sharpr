import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal, FaStar, FaAward } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Enhanced color system
const getColors = (theme) => ({
  primary: theme === "dark" ? "#60a5fa" : "#4f46e5",
  primaryGradient:
    theme === "dark"
      ? "linear-gradient(135deg, #3b82f6, #60a5fa)"
      : "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
  background:
    theme === "dark"
      ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
  cardBg: theme === "dark" ? "#1f2937" : "#ffffff",
  heading: theme === "dark" ? "#e5e7eb" : "#3730a3",
  subheading: theme === "dark" ? "#9ca3af" : "#64748b",
  text: theme === "dark" ? "#e5e7eb" : "#1e293b",
  accent: theme === "dark" ? "#93c5fd" : "#f59e0b",
  highlight: theme === "dark" ? "#818cf8" : "#8b5cf6",
  statNumberColor: theme === "dark" ? "#60a5fa" : "#5a73fc",
  muted: theme === "dark" ? "#374151" : "#f1f5f9",
  cardShadow:
    theme === "dark"
      ? "0 10px 30px rgba(0, 0, 0, 0.3)"
      : "0 10px 30px rgba(0, 0, 0, 0.05)",
  cardBorder: theme === "dark" ? "#374151" : "rgba(90, 115, 252, 0.1)",
  badgeColor: theme === "dark" ? "#111827" : "#f0f4ff",
});

const results = [
  {
    name: "Aarav Sharma",
    achievement: "Topper, Class 10 Board Exams",
    score: "98.6%",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    badge: <FaTrophy />,
    badgeColor: "#f59e0b",
    year: "2023",
  },
  {
    name: "Meera Patel",
    achievement: "Gold Medal, Math Olympiad",
    score: "National Rank 1",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    badge: <FaMedal />,
    badgeColor: "#eab308",
    year: "2023",
  },
  {
    name: "Rohan Gupta",
    achievement: "NTSE Scholar",
    score: "All India Rank 12",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    badge: <FaStar />,
    badgeColor: "#4f46e5",
    year: "2022",
  },
  // {
  //   name: "Simran Kaur",
  //   achievement: "Coding Competition Winner",
  //   score: "1st Place, CodeFest",
  //   avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  //   badge: <FaAward />,
  //   badgeColor: "#06b6d4",
  //   year: "2022",
  // },
];

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

const Results = () => {
  const [activeResult, setActiveResult] = useState(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const colors = getColors(theme);

  const renderMobile = () => (
    <section
      style={{
        background: colors.background,
        padding: "28px 0",
        position: "relative",
        overflow: "hidden",
      }}
      aria-labelledby="results-heading"
    >
      {/* Decorative Elements */}
      <motion.div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            theme === "dark"
              ? "rgba(96, 165, 250, 0.06)"
              : "rgba(79, 70, 229, 0.06)",
          top: -100,
          right: -100,
          zIndex: 1,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 500,
          margin: "0 auto",
          padding: "0 6px",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <motion.h2
          id="results-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 16,
            color: colors.heading,
            display: "inline-block",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            Student Achievements
            <motion.span
              style={{
                position: "absolute",
                height: "4px",
                background: colors.primaryGradient,
                bottom: "-6px",
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
            color: colors.subheading,
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            maxWidth: 700,
            margin: "0 auto 30px",
            lineHeight: 1.6,
          }}
        >
          We celebrate our students who have achieved outstanding results
          through dedication and hard work. These accomplishments reflect our
          commitment to excellence in education.
        </motion.p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "14px",
            width: "100%",
            alignItems: "stretch", // All cards same width
            justifyItems: "center", // Center cards horizontally
          }}
        >
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow:
                  theme === "dark"
                    ? "0 20px 40px rgba(0, 0, 0, 0.3)"
                    : "0 20px 40px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setActiveResult(i)}
              onMouseLeave={() => setActiveResult(null)}
              style={{
                background: colors.cardBg,
                borderRadius: 20,
                boxShadow: colors.cardShadow,
                padding:
                  "clamp(0.8rem, 2vw, 1.2rem) clamp(0.6rem, 1.5vw, 1rem)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                border: `1px solid ${colors.cardBorder}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "100%", // Make all cards take full width of grid cell
                maxWidth: 340, // Limit max width for uniformity
                minWidth: 0,
                boxSizing: "border-box",
                color: colors.text,
              }}
              role="article"
              aria-label={`${r.name}'s achievement: ${r.achievement}`}
              tabIndex="0"
            >
              <motion.div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  fontSize: 30,
                  color: r.badgeColor,
                  opacity: 0.9,
                  transform: "rotate(0deg)",
                }}
                animate={{
                  rotate: activeResult === i ? [0, 15, 0, -15, 0] : 0,
                  scale: activeResult === i ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              >
                {r.badge}
              </motion.div>

              <motion.div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: colors.badgeColor,
                  color: colors.text,
                  padding: "4px 10px",
                  fontSize: "0.75rem",
                  borderRadius: 20,
                  fontWeight: 500,
                }}
                animate={{
                  scale: activeResult === i ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {r.year}
              </motion.div>

              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: "50%",
                  padding: 3,
                  background: `linear-gradient(135deg, ${r.badgeColor} 0%, ${colors.highlight} 100%)`,
                  marginBottom: 16,
                }}
              >
                <img
                  src={r.avatar}
                  alt={r.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `3px solid ${colors.cardBg}`,
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${r.name}&background=random`;
                  }}
                />
              </div>

              <motion.h3
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginBottom: 6,
                  color: colors.text,
                  textAlign: "center",
                }}
                animate={{
                  color: activeResult === i ? r.badgeColor : colors.text,
                }}
                transition={{ duration: 0.3 }}
              >
                {r.name}
              </motion.h3>

              <div
                style={{
                  color: colors.highlight,
                  fontWeight: 600,
                  marginBottom: 10,
                  fontSize: "0.85rem",
                  textAlign: "center",
                }}
              >
                {r.achievement}
              </div>

              <motion.div
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
                      : "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
                  color: colors.heading,
                  fontWeight: 600,
                  borderRadius: 12,
                  padding: "6px 12px",
                  fontSize: "0.9rem",
                  marginTop: 6,
                  boxShadow:
                    theme === "dark"
                      ? "0 2px 10px rgba(0, 0, 0, 0.2)"
                      : "0 2px 10px rgba(0, 0, 0, 0.05)",
                }}
                animate={{
                  scale: activeResult === i ? [1, 1.1, 1] : 1,
                  backgroundColor:
                    activeResult === i
                      ? theme === "dark"
                        ? "#374151"
                        : "#f0f4ff"
                      : theme === "dark"
                      ? "#1f2937"
                      : "#f8fafc",
                }}
                transition={{ duration: 0.5 }}
              >
                {r.score}
              </motion.div>
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
            href="/results"
            whileHover={{
              scale: 1.05,
              boxShadow:
                theme === "dark"
                  ? "0 10px 25px rgba(96, 165, 250, 0.3)"
                  : "0 10px 25px rgba(79, 70, 229, 0.3)",
              backgroundColor: theme === "dark" ? "#3b82f6" : "#4338ca",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 24px",
              background: colors.primary,
              color: "white",
              fontWeight: 600,
              borderRadius: 12,
              textDecoration: "none",
              fontSize: "0.95rem",
              boxShadow:
                theme === "dark"
                  ? "0 4px 14px rgba(96, 165, 250, 0.2)"
                  : "0 4px 14px rgba(79, 70, 229, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            View All Achievements
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: 8 }}
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );

  if (isMobile) return renderMobile();

  return (
    <section
      style={{
        background: colors.background,
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}
      aria-labelledby="results-heading"
    >
      {/* Decorative Elements */}
      <motion.div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            theme === "dark"
              ? "rgba(96, 165, 250, 0.06)"
              : "rgba(79, 70, 229, 0.06)",
          top: -100,
          right: -100,
          zIndex: 1,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 2,
          textAlign: "center", // Center all content
        }}
      >
        <motion.h2
          id="results-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "clamp(2rem, 5vw, 2.8rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 16,
            color: colors.heading,
            display: "inline-block",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            Student Achievements
            <motion.span
              style={{
                position: "absolute",
                height: "6px",
                background: colors.primaryGradient,
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
            color: colors.subheading,
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            maxWidth: 700,
            margin: "0 auto 50px",
            lineHeight: 1.6,
          }}
        >
          We celebrate our students who have achieved outstanding results
          through dedication and hard work. These accomplishments reflect our
          commitment to excellence in education.
        </motion.p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(16px, 3vw, 30px)",
            width: "100%", // Ensure the grid takes full width
          }}
        >
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow:
                  theme === "dark"
                    ? "0 20px 40px rgba(0, 0, 0, 0.3)"
                    : "0 20px 40px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setActiveResult(i)}
              onMouseLeave={() => setActiveResult(null)}
              style={{
                background: colors.cardBg,
                borderRadius: 20,
                boxShadow: colors.cardShadow,
                padding:
                  "clamp(1.2rem, 2vw, 2.2rem) clamp(0.9rem, 1.5vw, 1.8rem)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                border: `1px solid ${colors.cardBorder}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              role="article"
              aria-label={`${r.name}'s achievement: ${r.achievement}`}
              tabIndex="0"
            >
              <motion.div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  fontSize: 30,
                  color: r.badgeColor,
                  opacity: 0.9,
                  transform: "rotate(0deg)",
                }}
                animate={{
                  rotate: activeResult === i ? [0, 15, 0, -15, 0] : 0,
                  scale: activeResult === i ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              >
                {r.badge}
              </motion.div>

              <motion.div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: colors.badgeColor,
                  color: colors.text,
                  padding: "4px 10px",
                  fontSize: "0.75rem",
                  borderRadius: 20,
                  fontWeight: 500,
                }}
                animate={{
                  scale: activeResult === i ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {r.year}
              </motion.div>

              <div
                style={{
                  width: 82,
                  height: 82,
                  borderRadius: "50%",
                  padding: 3,
                  background: `linear-gradient(135deg, ${r.badgeColor} 0%, ${colors.highlight} 100%)`,
                  marginBottom: 22,
                }}
              >
                <img
                  src={r.avatar}
                  alt={r.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `3px solid ${colors.cardBg}`,
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${r.name}&background=random`;
                  }}
                />
              </div>

              <motion.h3
                style={{
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  marginBottom: 8,
                  color: colors.text,
                  textAlign: "center",
                }}
                animate={{
                  color: activeResult === i ? r.badgeColor : colors.text,
                }}
                transition={{ duration: 0.3 }}
              >
                {r.name}
              </motion.h3>

              <div
                style={{
                  color: colors.highlight,
                  fontWeight: 600,
                  marginBottom: 12,
                  fontSize: "0.95rem",
                  textAlign: "center",
                }}
              >
                {r.achievement}
              </div>

              <motion.div
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
                      : "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
                  color: colors.heading,
                  fontWeight: 600,
                  borderRadius: 12,
                  padding: "8px 16px",
                  fontSize: "1rem",
                  marginTop: 8,
                  boxShadow:
                    theme === "dark"
                      ? "0 2px 10px rgba(0, 0, 0, 0.2)"
                      : "0 2px 10px rgba(0, 0, 0, 0.05)",
                }}
                animate={{
                  scale: activeResult === i ? [1, 1.1, 1] : 1,
                  backgroundColor:
                    activeResult === i
                      ? theme === "dark"
                        ? "#374151"
                        : "#f0f4ff"
                      : theme === "dark"
                      ? "#1f2937"
                      : "#f8fafc",
                }}
                transition={{ duration: 0.5 }}
              >
                {r.score}
              </motion.div>
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
            marginTop: 50,
            width: "100%",
          }}
        >
          <motion.a
            href="/results"
            whileHover={{
              scale: 1.05,
              boxShadow:
                theme === "dark"
                  ? "0 10px 25px rgba(96, 165, 250, 0.3)"
                  : "0 10px 25px rgba(79, 70, 229, 0.3)",
              backgroundColor: theme === "dark" ? "#3b82f6" : "#4338ca",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 28px",
              background: colors.primary,
              color: "white",
              fontWeight: 600,
              borderRadius: 12,
              textDecoration: "none",
              fontSize: "1.05rem",
              boxShadow:
                theme === "dark"
                  ? "0 4px 14px rgba(96, 165, 250, 0.2)"
                  : "0 4px 14px rgba(79, 70, 229, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            View All Achievements
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: 8 }}
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Results;

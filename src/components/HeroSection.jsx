import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const HeroSection = () => {
  const { theme } = useTheme();

  const isLight = theme !== "dark";

  return (
    <section
      style={{
        background: isLight
          ? "linear-gradient(170deg, #f8f9fb 70%, #f0f2f7 100%)"
          : "linear-gradient(170deg, #111827 70%, #0f172a 100%)",
        color: isLight ? "#111" : "#f9fafb",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8rem 2rem 6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: isLight
            ? "radial-gradient(circle, rgba(79,70,229,0.05) 0%, rgba(79,70,229,0) 70%)"
            : "radial-gradient(circle, rgba(79,70,229,0.1) 0%, rgba(79,70,229,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: isLight
            ? "radial-gradient(circle, rgba(236,72,153,0.05) 0%, rgba(236,72,153,0) 70%)"
            : "radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0) 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "4rem",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            flex: "1 1 500px",
            minWidth: 320,
            maxWidth: 600,
            padding: "0 1rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              background: isLight
                ? "rgba(79, 70, 229, 0.08)"
                : "rgba(79, 70, 229, 0.15)",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              marginBottom: "1.5rem",
            }}
          >
            <span role="img" aria-label="rocket" style={{ fontSize: "1.2rem" }}>
              🚀
            </span>
            <span
              style={{
                fontWeight: 600,
                fontSize: "1rem",
                color: isLight ? "#4f46e5" : "#818cf8",
              }}
            >
              Accelerating learning for young minds
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
              ...(isLight
                ? {
                    background: "linear-gradient(90deg, #111827 30%, #4f46e5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }
                : {
                    color: "#f9fafb",
                  }),
            }}
          >
            Empowering Young Minds Through Innovative Education
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{
              color: isLight ? "#4b5563" : "#d1d5db",
              fontSize: "1.25rem",
              marginBottom: "2.5rem",
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            Sharpr helps children ages 5-10 master essential subjects with
            clarity, confidence, and personalized attention — conveniently
            located in your neighborhood.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            style={{
              display: "flex",
              gap: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  borderRadius: "12px",
                  padding: "1rem 2rem",
                  textDecoration: "none",
                  boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                <FaCheckCircle style={{ fontSize: "1.2rem" }} />
                Book Your Free Demo
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/locations"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: isLight
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(30, 41, 59, 0.8)",
                  backdropFilter: "blur(8px)",
                  color: isLight ? "#111827" : "#f9fafb",
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  borderRadius: "12px",
                  padding: "1rem 2rem",
                  border: isLight
                    ? "1px solid rgba(0,0,0,0.08)"
                    : "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  boxShadow: isLight
                    ? "0 8px 20px rgba(0,0,0,0.06)"
                    : "0 8px 20px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                }}
              >
                <FaMapMarkerAlt
                  style={{ color: "#ec4899", fontSize: "1.2rem" }}
                />
                Find a Center Near You
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            style={{
              display: "flex",
              gap: "2rem",
              marginTop: "3.5rem",
              fontSize: "0.875rem",
              color: isLight ? "#6b7280" : "#9ca3af",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  background: isLight ? "#dcfce7" : "#065f46",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: isLight ? "#059669" : "#10b981" }}>
                  ✓
                </span>
              </div>
              <span>Certified Teachers</span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  background: isLight ? "#dcfce7" : "#065f46",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: isLight ? "#059669" : "#10b981" }}>
                  ✓
                </span>
              </div>
              <span>30+ Locations</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            flex: "1 1 400px",
            minWidth: 320,
            maxWidth: 580,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: "10px",
              left: "10px",
              borderRadius: "20px",
              background: isLight
                ? "rgba(79, 70, 229, 0.2)"
                : "rgba(79, 70, 229, 0.4)",
              zIndex: 1,
              transform: "rotate(-3deg)",
            }}
          ></div>

          <motion.div
            whileHover={{ scale: 1.02, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: "relative",
              zIndex: 2,
              transform: "rotate(2deg)",
              transformOrigin: "center center",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
              alt="Students engaged in interactive learning with tablets and educational materials"
              style={{
                width: "100%",
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                objectFit: "cover",
                aspectRatio: "4/3",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                background: isLight
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(17, 24, 39, 0.9)",
                borderRadius: "12px",
                padding: "1rem 1.5rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                backdropFilter: "blur(10px)",
                maxWidth: "200px",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "2rem",
                  color: "#4f46e5",
                  lineHeight: 1,
                }}
              >
                5-10
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: isLight ? "#4b5563" : "#d1d5db",
                }}
              >
                Perfect age range for foundational learning
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

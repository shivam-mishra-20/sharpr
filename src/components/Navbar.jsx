/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/aboutus" },
  { label: "Programs", to: "/programs" },
  { label: "Contact", to: "/contact" },
  { label: "Sign Up", to: "/signup" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navbarStyle = {
    position: "sticky",
    top: 0,
    width: "100%",
    zIndex: 1000,
    padding: scrolled ? "0.75rem 1.5rem" : "1rem 1.5rem",
    background:
      theme === "dark"
        ? scrolled
          ? "rgba(17, 24, 39, 0.95)"
          : "linear-gradient(to right, #0f0c29, #302b63, #24243e)"
        : scrolled
        ? "rgba(255, 255, 255, 0.95)"
        : "linear-gradient(to right, #8e2de2, #4a00e0)",
    backdropFilter: scrolled ? "blur(8px)" : "none",
    boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "none",
    color: theme === "dark" ? "#ffffff" : "#ffffff",
    transition: "all 0.3s ease",
  };

  const logoContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const logoStyle = {
    width: "2.25rem",
    height: "2.25rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  };

  const logoInnerStyle = {
    width: "1.25rem",
    height: "1.25rem",
    background: "#ffffff",
    borderRadius: "4px",
    transform: "rotate(45deg)",
  };

  return (
    <motion.nav
      style={navbarStyle}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link to="/" style={logoContainerStyle}>
          <motion.div
            style={logoStyle}
            whileHover={{
              rotate: 20,
              scale: 1.1,
              boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div style={logoInnerStyle} />
          </motion.div>
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              background: "linear-gradient(to right, #ffffff, #e0e0e0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sharpr
          </span>
        </Link>

        {/* Nav Links - Desktop */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "2.5rem",
            "@media (min-width: 768px)": { display: "flex" },
          }}
          className="hidden md:flex"
        >
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              style={({ isActive }) => ({
                position: "relative",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: isActive
                  ? theme === "dark"
                    ? "#a78bfa"
                    : "#ffffff"
                  : theme === "dark"
                  ? "#e5e7eb"
                  : "#f3f4f6",
                transition: "all 0.3s ease",
              })}
            >
              {({ isActive }) => (
                <motion.span
                  whileHover={{
                    color: theme === "dark" ? "#a78bfa" : "#ffffff",
                    scale: 1.05,
                  }}
                  style={{ display: "inline-block" }}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      style={{
                        position: "absolute",
                        bottom: "-6px",
                        left: 0,
                        right: 0,
                        height: "3px",
                        background:
                          "linear-gradient(to right, #8b5cf6, #6366f1)",
                        borderRadius: "3px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                  )}
                </motion.span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              border: "none",
              cursor: "pointer",
              color: theme === "dark" ? "#ffffff" : "#000000",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span style={{ fontSize: "1.1rem" }}>
              {theme === "dark" ? "☀️" : "🌙"}
            </span>
          </motion.button>

          {/* Enroll Button */}
          <motion.div
            className="hidden md:block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "none",
              "@media (min-width: 768px)": { display: "block" },
            }}
          >
            <Link
              to="/enroll"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.5rem",
                borderRadius: "9999px",
                background: "linear-gradient(to right, #4f46e5, #7c3aed)",
                color: "#ffffff",
                fontWeight: 600,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                backgroundSize: "200% auto",
                backgroundPosition: "left center",
                ":hover": {
                  backgroundPosition: "right center",
                },
              }}
            >
              <div
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaArrowRight size={10} />
              </div>
              Enroll now
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="block md:hidden"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
              color: theme === "dark" ? "#ffffff" : "#ffffff",
              display: "block",
              "@media (min-width: 768px)": { display: "none" },
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: "hidden",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1.5rem 0",
              }}
            >
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: "block",
                    padding: "0.5rem 0",
                    fontSize: "1.1rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? theme === "dark"
                        ? "#a78bfa"
                        : "#ffffff"
                      : theme === "dark"
                      ? "#e5e7eb"
                      : "rgba(255, 255, 255, 0.8)",
                    borderLeft: isActive
                      ? "3px solid #a78bfa"
                      : "3px solid transparent",
                    paddingLeft: "0.75rem",
                  })}
                >
                  {item.label}
                </NavLink>
              ))}

              <Link
                to="/enroll"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  background: "linear-gradient(to right, #4f46e5, #7c3aed)",
                  color: "#ffffff",
                  fontWeight: 600,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  width: "fit-content",
                }}
              >
                Enroll now <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

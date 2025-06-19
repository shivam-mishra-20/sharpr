/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FaPhoneAlt,
  FaRegCalendarAlt,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaUserCircle,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Define base navigation items without SignUp/Dashboard that will change
const baseNavItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/aboutus" },
  { label: "Programs", to: "/programs" },
  { label: "Results", to: "/results" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Locations", to: "/locations" },
  { label: "Contact", to: "/contact" },
];

const navLinkUnderline = {
  rest: { scaleX: 0, opacity: 0, transition: { duration: 0.2 } },
  hover: { scaleX: 1, opacity: 1, transition: { duration: 0.3 } },
  active: { scaleX: 1, opacity: 1, transition: { duration: 0.3 } },
};

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.15, rotate: 15 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        border: "none",
        background: theme === "dark" ? "#333" : "#f3f4f6",
        color: theme === "dark" ? "#f9d71c" : "#5662e9", // Yellow sun in dark, blue moon in light
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        cursor: "pointer",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
      }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </motion.button>
  );
}

function DesktopNav({ theme, toggleTheme, navItems }) {
  return (
    <div
      className="navbar-desktop"
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
        minHeight: 60, // Reduced from 72
        background: theme === "dark" ? "#18181b" : "#fff",
        color: theme === "dark" ? "#fff" : "#222",
        transition: "background 0.3s, color 0.3s",
        padding: "0 0.5rem", // Added horizontal padding
      }}
    >
      {/* Logo and tagline */}
      <Link
        to="/"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0.6rem", // Reduced gap
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <motion.img
          src="/logo-01.jpg"
          alt="Sharpr Logo"
          whileHover={{ scale: 1.08, rotate: 5 }}
          style={{
            width: 40, // Reduced from 48
            height: 40, // Reduced from 48
            borderRadius: "50%",
            objectFit: "cover",
            background: "#000",
            display: "block",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Poppins",
          }}
        >
          <span
            style={{
              fontSize: "clamp(1.1rem, 1.3vw, 1.5rem)", // Slightly smaller
              fontWeight: 700,
              color: theme === "dark" ? "#fff" : "#222",
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            Sharpr
          </span>
          <span
            style={{
              fontSize: "clamp(0.45rem, 0.6vw, 0.65rem)", // Slightly smaller
              color: theme === "dark" ? "#bbb" : "#757575",
              fontWeight: 300,
              marginTop: 2,
              letterSpacing: "0.01em",
              lineHeight: 1.2,
            }}
          >
            Sharper Minds. Stronger Futures.
          </span>
        </div>
      </Link>

      {/* Nav Links */}
      <div
        className="nav-links-container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(0.5rem, 1vw, 1.5rem)", // Reduced gap
          marginLeft: "0.5rem", // Reduced margin
          marginRight: "0.5rem",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            style={({ isActive }) => ({
              position: "relative",
              fontSize: "clamp(0.75rem, 0.85vw, 0.95rem)", // Smaller font size
              fontWeight: 500,
              color: isActive
                ? theme === "dark"
                  ? "#fff"
                  : "#111"
                : theme === "dark"
                ? "#bbb"
                : "#444",
              textDecoration: "none",
              padding: "0.4rem 0.25rem", // Reduced padding
              transition: "color 0.2s",
              outline: "none",
              background: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              whiteSpace: "nowrap",
            })}
          >
            {({ isActive }) => (
              <motion.span
                style={{
                  position: "relative",
                  display: "inline-block",
                  cursor: "pointer",
                  padding: "0 2px",
                  color:
                    theme === "dark"
                      ? isActive
                        ? "#fff"
                        : "#bbb"
                      : isActive
                      ? "#000"
                      : "#444",
                }}
                initial="rest"
                whileHover="hover"
                animate={isActive ? "active" : "rest"}
              >
                {item.label}
                <motion.div
                  variants={navLinkUnderline}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: -4,
                    height: 3,
                    borderRadius: 2,
                    background:
                      "linear-gradient(90deg, #e75480 0%, #6366f1 100%)",
                    transformOrigin: "left",
                  }}
                />
              </motion.span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Right Buttons */}
      <div
        className="nav-actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          flexShrink: 0,
          marginLeft: "0.25rem",
          marginRight: "0.5rem",
        }}
      >
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <motion.a
          href="tel:9369428170"
          whileHover={{
            scale: 1.03,
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            padding: "0.4rem 0.6rem",
            borderRadius: "8px",
            border: `1px solid ${theme === "dark" ? "#333" : "#ddd"}`,
            background: theme === "dark" ? "#fff" : "#18181b",
            color: theme === "dark" ? "#111" : "#fff",
            fontWeight: 500,
            fontSize: "0.75rem",
            textDecoration: "none",
            transition: "all 0.2s",
            cursor: "pointer",
            minWidth: "fit-content",
            justifyContent: "center",
          }}
        >
          <FaPhoneAlt style={{ color: "#e75480", fontSize: "0.7rem" }} />
          <span>Call Now</span>
        </motion.a>
        <motion.div
          whileHover={{ scale: 1.03 }}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
        >
          <Link
            to="/contact"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.4rem 0.6rem",
              borderRadius: "8px",
              background: theme === "dark" ? "#e75480" : "#000",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.75rem",
              textDecoration: "none",
              border: "none",
              cursor: "pointer",
              minWidth: "fit-content",
              justifyContent: "center",
              whiteSpace: "nowrap",
            }}
          >
            <FaRegCalendarAlt style={{ color: "#fff", fontSize: "0.7rem" }} />
            <span>Book Free Demo</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function MobileNav({
  theme,
  toggleTheme,
  mobileMenuOpen,
  setMobileMenuOpen,
  location,
  navItems,
}) {
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location, setMobileMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e) => {
      if (e.target.closest(".mobile-menu-container")) return;
      setMobileMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  return (
    <div
      className="navbar-mobile"
      style={{
        width: "100vw", // Changed from 100% to 100vw
        background: theme === "dark" ? "#18181b" : "#fff",
        color: theme === "dark" ? "#fff" : "#222",
        transition: "background 0.3s, color 0.3s",
        padding: "0.2rem 0",
        position: "relative", // Ensure stacking context
        left: 0, // Ensure alignment
        overflowX: "hidden", // Prevent horizontal scroll
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          minHeight: 50,
          padding: "0.2rem 0",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.5rem", // Reduced gap
            textDecoration: "none",
          }}
        >
          <img
            src="/logo-01.jpg"
            alt="Sharpr Logo"
            style={{
              width: 45, // Reduced size
              height: 45, // Reduced size
              borderRadius: "60%",
              objectFit: "cover",
              background: "#000",
              display: "block",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Poppins",
              fontStyle: "bold",
            }}
          >
            <span
              style={{
                fontSize: "1.1rem", // Smaller
                fontWeight: 700,
                color: theme === "dark" ? "#fff" : "#222",
                letterSpacing: "0.01em",
                lineHeight: 1,
              }}
            >
              Sharpr
            </span>
            <span
              style={{
                fontSize: "0.55rem", // Smaller
                color: theme === "dark" ? "#bbb" : "#757575",
                fontWeight: 300,
                marginTop: 2,
              }}
            >
              Sharper Minds. Stronger Futures.
            </span>
          </div>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen((v) => !v);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: theme === "dark" ? "#333" : "#f3f4f6",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              fontSize: 18,
              color: theme === "dark" ? "#fff" : "#222",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu-container"
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: theme === "dark" ? "#23232b" : "#fff",
              color: theme === "dark" ? "#fff" : "#222",
              borderRadius: "0 0 16px 16px",
              marginTop: 4,
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.12)",
              padding: "0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              overflow: "hidden",
              position: "fixed", // Changed from absolute to fixed
              left: 0,
              top: 50, // Just below the navbar
              width: "100vw", // Full viewport width
              zIndex: 1000,
              maxWidth: "100vw", // Prevent overflow
            }}
          >
            <div
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {navItems.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: "block",
                    fontSize: "1rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? theme === "dark"
                        ? "#fff"
                        : "#111"
                      : theme === "dark"
                      ? "#bbb"
                      : "#444",
                    borderLeft: isActive
                      ? "3px solid #e75480"
                      : "3px solid transparent",
                    padding: "0.7rem 1rem",
                    borderRadius: 8,
                    background: isActive
                      ? theme === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)"
                      : "transparent",
                    transition: "all 0.2s",
                    textDecoration: "none",
                    position: "relative",
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            {/* Mobile menu buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "center",
                padding: "1rem 0.5rem 0.5rem 0.5rem",
                borderTop: `1px solid ${theme === "dark" ? "#333" : "#eee"}`,
                marginTop: "0.5rem",
              }}
            >
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: theme === "dark" ? "#e75480" : "#000",
                  color: "#fff",
                  fontWeight: 600,
                  boxShadow:
                    theme === "dark"
                      ? "0 3px 10px rgba(231,84,128,0.2)"
                      : "0 3px 10px rgba(0,0,0,0.1)",
                  width: "100%",
                  maxWidth: "250px",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                <FaRegCalendarAlt style={{ color: "#fff" }} />
                Book Free Demo
              </Link>
              <a
                href="tel:9369428170"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: `2px solid ${theme === "dark" ? "#333" : "#ddd"}`,
                  background: theme === "dark" ? "#fff" : "#18181b",
                  color: theme === "dark" ? "#111" : "#333",
                  fontWeight: 600,
                  width: "100%",
                  maxWidth: "250px",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                <FaPhoneAlt style={{ color: "#e75480" }} />
                Call Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Get user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            // Default to parent if no role found
            setUserRole("parent");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("parent"); // Default fallback
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Construct navItems based on authentication state
  const navItems = [...baseNavItems];

  // Add the appropriate Dashboard or SignUp item
  if (!loading) {
    if (user) {
      // If user is logged in, add Dashboard with appropriate link
      const dashboardPath =
        userRole === "admin" ? "/admin_dashboard" : "/parent_dashboard";
      navItems.push({
        label: "Dashboard",
        to: dashboardPath,
        icon: <FaUserCircle />,
      });
    } else {
      // If user is not logged in, add SignUp
      navItems.push({ label: "SignUp", to: "/signup" });
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isMobileState, setIsMobileState] = useState(
    typeof window !== "undefined" && window.innerWidth < 1080
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileState(window.innerWidth < 1080);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Check on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navbarStyle = {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100vw", // Changed from calc(100% + 12px) to 100vw
    zIndex: 1000,
    background: theme === "dark" ? "#18181b" : "#fff",
    color: theme === "dark" ? "#fff" : "#222",
    borderBottom: theme === "dark" ? "1px solid #333" : "1px solid #eaeaea",
    boxShadow: scrolled
      ? "0 4px 12px rgba(0,0,0,0.06)"
      : "0 1px 6px rgba(0,0,0,0.02)",
    transition: "all 0.3s ease",
    overflowX: "hidden", // Prevent horizontal scroll
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav style={navbarStyle}>
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
          position: "relative",
          paddingRight: "1rem",
          overflowX: "hidden", // Prevent horizontal scroll
        }}
      >
        {isMobileState ? (
          <MobileNav
            theme={theme}
            toggleTheme={toggleTheme}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            location={location}
            navItems={navItems}
          />
        ) : (
          <DesktopNav
            theme={theme}
            toggleTheme={toggleTheme}
            navItems={navItems}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;

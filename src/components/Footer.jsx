/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  const { theme } = useTheme();

  const footerStyle = {
    background: theme === "dark" ? "#111827" : "#1f2937",
    color: "#ffffff",
    position: "relative",
    overflow: "hidden",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      'url(\'data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" fill="%239C92AC" fill-opacity="0.04" fill-rule="evenodd"/%3E%3C/svg%3E\')',
    opacity: 0.6,
  };

  const containerStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "2.5rem 1.5rem 1.5rem",
    position: "relative",
    zIndex: 10,
  };

  const logoContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  };

  const logoBoxStyle = {
    width: "2.5rem",
    height: "2.5rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "0.75rem",
  };

  const logoInnerStyle = {
    width: "1.25rem",
    height: "1.25rem",
    background: "#ffffff",
    borderRadius: "0.25rem",
  };

  const headingStyle = {
    fontSize: "1.125rem",
    fontWeight: 600,
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
  };

  const headingAfterStyle = {
    content: '""',
    position: "absolute",
    bottom: "-1px",
    left: 0,
    width: "3rem",
    height: "2px",
    background: "linear-gradient(to right, #6366f1, #8b5cf6)",
  };

  const linkStyle = {
    color: "rgba(255, 255, 255, 0.7)",
    transition: "all 0.2s ease",
    display: "inline-block",
    ":hover": {
      color: "#ffffff",
      transform: "translateX(5px)",
    },
  };

  const socialIconStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    width: "2.25rem",
    height: "2.25rem",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  };

  const contactItemStyle = {
    display: "flex",
    marginBottom: "0.75rem",
  };

  const contactIconStyle = {
    color: "#8b5cf6",
    marginRight: "0.75rem",
    marginTop: "0.25rem",
  };

  return (
    <footer style={footerStyle}>
      <div style={overlayStyle}></div>

      <div className="container mx-auto px-6 pt-10 pb-6" style={containerStyle}>
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={logoContainerStyle}>
              <motion.div
                style={logoBoxStyle}
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <div style={logoInnerStyle}></div>
              </motion.div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Sharpr</h2>
            </div>

            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "1.5rem",
                lineHeight: 1.6,
              }}
            >
              Empowering the next generation of tech professionals with
              cutting-edge education and practical skills.
            </p>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { icon: <FaTwitter size={16} />, href: "https://twitter.com" },
                {
                  icon: <FaFacebook size={16} />,
                  href: "https://facebook.com",
                },
                {
                  icon: <FaInstagram size={16} />,
                  href: "https://instagram.com",
                },
                {
                  icon: <FaLinkedin size={16} />,
                  href: "https://linkedin.com",
                },
                { icon: <FaGithub size={16} />, href: "https://github.com" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialIconStyle}
                  whileHover={{
                    y: -5,
                    backgroundColor: "#8b5cf6",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 style={headingStyle}>
              Quick Links
              <span style={headingAfterStyle}></span>
            </h3>

            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
              }}
            >
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/aboutus" },
                { label: "Programs", href: "/programs" },
                { label: "Contact", href: "/contact" },
                { label: "Blog", href: "/blog" },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    to={link.href}
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      transition: "color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                    onMouseLeave={(e) =>
                      (e.target.style.color = "rgba(255, 255, 255, 0.7)")
                    }
                  >
                    <span style={{ fontSize: "0.75rem" }}>►</span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 style={headingStyle}>
              Programs
              <span style={headingAfterStyle}></span>
            </h3>

            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
              }}
            >
              {[
                "Web Development",
                "Data Science",
                "Mobile App Development",
                "UI/UX Design",
                "Cloud Computing",
              ].map((program, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    to="/programs"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      transition: "color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                    onMouseLeave={(e) =>
                      (e.target.style.color = "rgba(255, 255, 255, 0.7)")
                    }
                  >
                    <span style={{ fontSize: "0.75rem" }}>►</span>
                    {program}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 style={headingStyle}>
              Contact Us
              <span style={headingAfterStyle}></span>
            </h3>

            <div style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              <div style={contactItemStyle}>
                <FaMapMarkerAlt style={contactIconStyle} />
                <p>
                  123 Tech Street
                  <br />
                  San Francisco, CA 94103
                </p>
              </div>

              <div style={contactItemStyle}>
                <FaEnvelope style={contactIconStyle} />
                <a
                  href="mailto:info@sharpr.edu"
                  style={{
                    transition: "color 0.2s ease",
                    textDecoration: "underline",
                    textDecorationColor: "transparent",
                    textUnderlineOffset: "0.2em",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ffffff";
                    e.target.style.textDecorationColor = "#8b5cf6";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "rgba(255, 255, 255, 0.7)";
                    e.target.style.textDecorationColor = "transparent";
                  }}
                >
                  info@sharpr.edu
                </a>
              </div>

              <div style={contactItemStyle}>
                <FaPhone style={contactIconStyle} />
                <a
                  href="tel:+15551234567"
                  style={{
                    transition: "color 0.2s ease",
                    textDecoration: "underline",
                    textDecorationColor: "transparent",
                    textUnderlineOffset: "0.2em",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ffffff";
                    e.target.style.textDecorationColor = "#8b5cf6";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "rgba(255, 255, 255, 0.7)";
                    e.target.style.textDecorationColor = "transparent";
                  }}
                >
                  +1 (555) 123-4567
                </a>
              </div>

              {/* Newsletter Signup */}
              <motion.div
                style={{
                  marginTop: "1.5rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "1.25rem",
                  borderRadius: "0.5rem",
                }}
                whileHover={{
                  boxShadow: "0 0 15px rgba(139, 92, 246, 0.15)",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    color: "#ffffff",
                  }}
                >
                  Subscribe to our newsletter
                </h4>

                <div
                  style={{
                    display: "flex",
                    position: "relative",
                  }}
                >
                  <input
                    type="email"
                    placeholder="Your email"
                    style={{
                      width: "100%",
                      padding: "0.625rem 1rem",
                      paddingRight: "3rem",
                      borderRadius: "0.375rem",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      outline: "none",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8b5cf6";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(139, 92, 246, 0.25)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <motion.button
                    style={{
                      position: "absolute",
                      right: "0.25rem",
                      top: "0.25rem",
                      bottom: "0.25rem",
                      padding: "0 0.75rem",
                      background: "#8b5cf6",
                      color: "#ffffff",
                      borderRadius: "0.25rem",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span style={{ fontSize: "0.75rem" }}>→</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.875rem",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p>
            © {new Date().getFullYear()} Sharpr Education. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

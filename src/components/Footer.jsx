import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const themeColors = {
  light: {
    footerBg: "#f3f4f6",
    footerText: "#1f2937",
    border: "#e5e7eb",
    ctaBg: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
    ctaText: "#fff",
    ctaBtnBg: "#fff",
    ctaBtnText: "#6366f1",
    ctaBtnShadow: "0 4px 16px rgba(99,102,241,0.12)",
    social: "#6366f1",
    link: "#6366f1",
  },
  dark: {
    footerBg: "#1f2937",
    footerText: "#e5e7eb",
    border: "#374151",
    ctaBg: "linear-gradient(90deg, #4b5563 0%, #6366f1 100%)",
    ctaText: "#fff",
    ctaBtnBg: "#fff",
    ctaBtnText: "#4b5563",
    ctaBtnShadow: "0 4px 16px rgba(99,102,241,0.18)",
    social: "#8b5cf6",
    link: "#8b5cf6",
  },
};

const socials = [
  {
    href: "mailto:contact@yourdomain.com",
    icon: <FaEnvelope />,
    label: "Email",
  },
  {
    href: "https://linkedin.com",
    icon: <FaLinkedin />,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com",
    icon: <FaTwitter />,
    label: "Twitter",
  },
];

const Footer = () => {
  const { theme } = useTheme();
  const colors = themeColors[theme] || themeColors.light;

  return (
    <footer
      style={{
        background: colors.footerBg,
        color: colors.footerText,
        borderTop: `1px solid ${colors.border}`,
        marginTop: "3rem",
        paddingTop: 0,
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {/* CTA Section */}
      <div
        style={{
          background: colors.ctaBg,
          color: colors.ctaText,
          padding: "2.5rem 1rem 2rem 1rem",
          textAlign: "center",
          borderRadius: "1.25rem",
          maxWidth: 900,
          margin: "0 auto",
          marginTop: "-2.5rem",
          boxShadow: "0 8px 32px rgba(99,102,241,0.10)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2
          style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}
        >
          Ready to sharpen your future?
        </h2>
        <p
          style={{ fontSize: "1.1rem", opacity: 0.95, marginBottom: "1.5rem" }}
        >
          Join our learning community and unlock your potential with Sharpr.
        </p>
        <Link
          to="/signup"
          style={{
            display: "inline-block",
            background: colors.ctaBtnBg,
            color: colors.ctaBtnText,
            fontWeight: 600,
            fontSize: "1.1rem",
            borderRadius: "0.75rem",
            padding: "0.85rem 2.2rem",
            boxShadow: colors.ctaBtnShadow,
            textDecoration: "none",
            transition: "all 0.2s",
            border: "none",
          }}
        >
          Get Started
        </Link>
      </div>

      {/* Footer Main */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2.5rem 1rem 1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* Logo and Links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.7rem",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <img
              src="/logo-01.jpg"
              alt="Sharpr Logo"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                objectFit: "cover",
                background: "#000",
              }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: "1.25rem",
                color: colors.footerText,
              }}
            >
              Sharpr
            </span>
          </Link>
          <div
            style={{
              fontSize: "0.98rem",
              color: colors.footerText,
              opacity: 0.8,
            }}
          >
            Sharper Minds. Stronger Futures.
          </div>
        </div>

        {/* Socials */}
        <div style={{ display: "flex", gap: "1.2rem", margin: "0.5rem 0" }}>
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              style={{
                color: colors.social,
                fontSize: "1.45rem",
                transition: "color 0.2s",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Footer Links */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            to="/aboutus"
            style={{
              color: colors.link,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            About
          </Link>
          <Link
            to="/programs"
            style={{
              color: colors.link,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Programs
          </Link>
          <Link
            to="/contact"
            style={{
              color: colors.link,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Contact
          </Link>
          <Link
            to="/notfound"
            style={{
              color: colors.link,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

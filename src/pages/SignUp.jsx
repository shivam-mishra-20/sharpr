/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaGithub,
  FaFacebook,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const SignUp = () => {
  const { theme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const containerStyle = {
    minHeight: "100vh",
    background:
      theme === "dark"
        ? "linear-gradient(to bottom, #111827, #1f2937)"
        : "linear-gradient(to bottom, #f9fafb, #f3f4f6)",
    padding: "3rem 1rem",
  };

  const formCardStyle = {
    maxWidth: "32rem",
    margin: "0 auto",
    background: theme === "dark" ? "#1f2937" : "#ffffff",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow:
      theme === "dark"
        ? "0 25px 50px -12px rgba(0, 0, 0, 0.3)"
        : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    border: theme === "dark" ? "1px solid #374151" : "1px solid #f3f4f6",
  };

  const formHeaderStyle = {
    textAlign: "center",
    padding: "2rem",
    background:
      theme === "dark"
        ? "linear-gradient(to right, #4b5563, #1f2937)"
        : "linear-gradient(to right, #6366f1, #8b5cf6)",
    color: "#ffffff",
  };

  const formBodyStyle = {
    padding: "2rem",
  };

  const titleStyle = {
    fontSize: "1.875rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  };

  const subtitleStyle = {
    fontSize: "1rem",
    opacity: "0.8",
  };

  const inputGroupStyle = {
    marginBottom: "1.25rem",
    position: "relative",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: theme === "dark" ? "#e5e7eb" : "#4b5563",
  };

  const inputContainerStyle = {
    position: "relative",
  };

  const inputIconStyle = {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: theme === "dark" ? "#9ca3af" : "#9ca3af",
    fontSize: "0.875rem",
  };

  const getInputStyle = (error) => ({
    width: "100%",
    padding: "0.75rem 1rem 0.75rem 2.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    background: theme === "dark" ? "#374151" : "#ffffff",
    border: error
      ? "1px solid #ef4444"
      : theme === "dark"
      ? "1px solid #4b5563"
      : "1px solid #e5e7eb",
    color: theme === "dark" ? "#e5e7eb" : "#1f2937",
    boxShadow: error ? "0 0 0 2px rgba(239, 68, 68, 0.25)" : "none",
    outline: "none",
  });

  const errorMessageStyle = {
    fontSize: "0.75rem",
    color: "#ef4444",
    marginTop: "0.375rem",
  };

  const checkboxLabelStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "0.875rem",
    color: theme === "dark" ? "#e5e7eb" : "#4b5563",
    cursor: "pointer",
  };

  const checkboxStyle = {
    marginRight: "0.5rem",
    width: "1rem",
    height: "1rem",
    accentColor: "#8b5cf6",
  };

  const socialButtonStyle = (color) => ({
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    fontWeight: "500",
    color: "#ffffff",
    background: color,
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer",
    boxShadow:
      theme === "dark"
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.2)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  });

  const dividerStyle = {
    display: "flex",
    alignItems: "center",
    margin: "1.5rem 0",
    color: theme === "dark" ? "#9ca3af" : "#9ca3af",
    fontSize: "0.875rem",
  };

  const dividerLineStyle = {
    flexGrow: 1,
    height: "1px",
    background: theme === "dark" ? "#4b5563" : "#e5e7eb",
  };

  const dividerTextStyle = {
    padding: "0 1rem",
  };

  const submitButtonStyle = {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    fontWeight: "500",
    borderRadius: "0.5rem",
    background: "linear-gradient(to right, #6366f1, #8b5cf6)",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.4)",
  };

  const loginLinkContainerStyle = {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.95rem",
    color: theme === "dark" ? "#e5e7eb" : "#4b5563",
  };

  const loginLinkStyle = {
    color: "#8b5cf6",
    fontWeight: "500",
    textDecoration: "none",
  };

  const successMessageStyle = {
    padding: "1rem",
    background: theme === "dark" ? "#065f46" : "#d1fae5",
    color: theme === "dark" ? "#ffffff" : "#065f46",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setSuccessMessage(
        "Account created successfully! Check your email for verification."
      );

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }, 1500);
  };

  return (
    <div style={containerStyle}>
      <div className="container mx-auto">
        <motion.div
          style={formCardStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div style={formHeaderStyle}>
            <h2 style={titleStyle}>Create Your Account</h2>
            <p style={subtitleStyle}>Join our community of tech enthusiasts</p>
          </div>

          <div style={formBodyStyle}>
            {/* Success Message */}
            {successMessage && (
              <motion.div
                style={successMessageStyle}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <FaCheck
                  style={{ color: theme === "dark" ? "#10b981" : "#10b981" }}
                />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </div>

          {/* Social Sign Up Options */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            {/*
                { icon: <FaGoogle />, name: "Google", color: "#ea4335" },
                { icon: <FaGithub />, name: "GitHub", color: "#333333" },
                {
                  icon: <FaFacebook />,
                  name: "Facebook",
                  color: "#1877f2",
                },
              */}
            {/*
                .map((provider, index) => (
                <motion.button
                  key={index}
                  style={socialButtonStyle(provider.color)}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: `0 6px 12px -2px ${provider.color}40`
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {provider.icon}
                  <span>Continue with {provider.name}</span>
                </motion.button>
              ))}
            </div>

            <div style={dividerStyle}>
              <div style={dividerLineStyle}></div>
              <div style={dividerTextStyle}>OR</div>
              <div style={dividerLineStyle}></div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                {/* Name Field */}
                <div style={inputGroupStyle}>
                  <label htmlFor="name" style={labelStyle}>
                    Full Name
                  </label>
                  <div style={inputContainerStyle}>
                    <div style={inputIconStyle}>
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      style={getInputStyle(errors.name)}
                    />
                  </div>
                  {errors.name && (
                    <p style={errorMessageStyle}>{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div style={inputGroupStyle}>
                  <label htmlFor="email" style={labelStyle}>
                    Email Address
                  </label>
                  <div style={inputContainerStyle}>
                    <div style={inputIconStyle}>
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="johndoe@example.com"
                      style={getInputStyle(errors.email)}
                    />
                  </div>
                  {errors.email && (
                    <p style={errorMessageStyle}>{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div style={inputGroupStyle}>
                  <label htmlFor="password" style={labelStyle}>
                    Password
                  </label>
                  <div style={inputContainerStyle}>
                    <div style={inputIconStyle}>
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      style={getInputStyle(errors.password)}
                    />
                  </div>
                  {errors.password && (
                    <p style={errorMessageStyle}>{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div style={inputGroupStyle}>
                  <label htmlFor="confirmPassword" style={labelStyle}>
                    Confirm Password
                  </label>
                  <div style={inputContainerStyle}>
                    <div style={inputIconStyle}>
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      style={getInputStyle(errors.confirmPassword)}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p style={errorMessageStyle}>{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={checkboxLabelStyle}>
                    <input type="checkbox" id="terms" style={checkboxStyle} />
                    <span>
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        style={{
                          ...loginLinkStyle,
                          textDecoration: "underline",
                        }}
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        style={{
                          ...loginLinkStyle,
                          textDecoration: "underline",
                        }}
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  style={submitButtonStyle}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 8px 20px -4px rgba(99, 102, 241, 0.5)",
                    backgroundImage:
                      "linear-gradient(to right, #4f46e5, #7c3aed)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.div
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        borderRadius: "50%",
                        border: "3px solid rgba(255, 255, 255, 0.3)",
                        borderTopColor: "#ffffff",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <>
                      Create Account <FaArrowRight size={14} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Login Link */}
            <div style={loginLinkContainerStyle}>
              <p>
                Already have an account?{" "}
                <Link to="/login" style={loginLinkStyle}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default SignUp;

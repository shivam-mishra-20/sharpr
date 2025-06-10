/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import Footer from "../components/Footer";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.message) errors.message = "Message is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 1500);
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <div className="bg-gray-50" style={{ overflowX: "hidden" }}>
      {/* Hero Section */}
      <section
        className="relative"
        style={{
          background:
            "linear-gradient(120deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{
                textShadow: "0 2px 15px rgba(0,0,0,0.3)",
                letterSpacing: "-0.02em",
              }}
            >
              Get in Touch
            </motion.h1>
            <motion.p
              className="text-xl text-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.7,
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              We'd love to hear from you. Our team is always here to help.
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 w-full h-24"
          style={{
            background: 'url("/src/assets/wave.svg")',
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
          animate={{
            y: [0, -10, 0],
            backgroundPositionX: ["0%", "100%"],
          }}
          transition={{
            y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
            backgroundPositionX: {
              repeat: Infinity,
              duration: 30,
              ease: "linear",
            },
          }}
        />
      </section>

      {/* Contact Info and Form Section */}
      <section
        className="py-16 md:py-24"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(236, 253, 245, 0.6) 0%, rgba(249, 250, 251, 0) 35%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div
            className="max-w-5xl mx-auto bg-white rounded-xl overflow-hidden"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              transform: "translateY(-30px)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Contact Info */}
              <motion.div
                className="p-8 md:p-12 text-white"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  background:
                    "linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)",
                  boxShadow: "inset 0 0 60px rgba(0,0,0,0.1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  className="absolute top-0 right-0 w-full h-full opacity-10"
                  style={{
                    backgroundImage: 'url("/src/assets/pattern-dots.svg")',
                    backgroundSize: "300px",
                  }}
                  animate={{
                    backgroundPosition: ["0px 0px", "100px 100px"],
                  }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />

                <motion.h2
                  className="text-2xl font-bold mb-6 relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  }}
                >
                  Contact Information
                  <motion.span
                    style={{
                      display: "block",
                      height: "3px",
                      width: "40px",
                      background: "#fff",
                      marginTop: "8px",
                      borderRadius: "2px",
                    }}
                    initial={{ width: "0px" }}
                    animate={{ width: "40px" }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  />
                </motion.h2>

                <div className="space-y-6">
                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="mt-1">
                      <FaEnvelope className="text-blue-300" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-blue-200 mt-1">contact@sharpr.edu</p>
                      <p className="text-blue-200">support@sharpr.edu</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="mt-1">
                      <FaPhone className="text-blue-300" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-blue-200 mt-1">+1 (555) 123-4567</p>
                      <p className="text-blue-200">Mon-Fri, 9am-6pm ET</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <div className="mt-1">
                      <FaMapMarkerAlt className="text-blue-300" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Visit Us</h3>
                      <p className="text-blue-200 mt-1">123 Education Street</p>
                      <p className="text-blue-200">San Francisco, CA 94103</p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-12">
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
                  >
                    Connect With Us
                  </h3>
                  <div className="flex gap-4">
                    {["facebook", "twitter", "linkedin", "instagram"].map(
                      (social, index) => (
                        <motion.a
                          key={social}
                          href={`#${social}`}
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          whileHover={{ scale: 1.15, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.8 + index * 0.1,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 300,
                          }}
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          <img
                            src={`/src/assets/${social}.svg`}
                            alt={`${social} icon`}
                            className="w-5 h-5"
                          />
                        </motion.a>
                      )
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="p-8 md:p-12"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  background:
                    "linear-gradient(to bottom right, #ffffff, #f8fafc)",
                }}
              >
                {isSubmitted ? (
                  <motion.div
                    className="h-full flex flex-col items-center justify-center text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                    }}
                    style={{ minHeight: "400px" }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0, -10, 0],
                      }}
                      transition={{
                        duration: 1,
                        delay: 0.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <FaCheckCircle
                        size={70}
                        style={{
                          color: "#22c55e",
                          filter:
                            "drop-shadow(0 4px 8px rgba(34, 197, 94, 0.4))",
                        }}
                      />
                    </motion.div>

                    <motion.h2
                      className="text-2xl font-bold text-gray-800 mb-2 mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      Thank You!
                    </motion.h2>

                    <motion.p
                      className="text-gray-600 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      style={{ maxWidth: "300px", lineHeight: 1.7 }}
                    >
                      Your message has been sent successfully. We'll get back to
                      you soon.
                    </motion.p>

                    <motion.button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      style={{
                        boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
                      }}
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      Send Us a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                              formErrors.name
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {formErrors.name && (
                            <p className="mt-1 text-sm text-red-600">
                              {formErrors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Your Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                              formErrors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {formErrors.email && (
                            <p className="mt-1 text-sm text-red-600">
                              {formErrors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone Number (Optional)
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Subject (Optional)
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                            formErrors.message
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {formErrors.message && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.message}
                          </p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </motion.button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-center">Find Us Here</h2>
            </motion.div>

            <motion.div
              className="bg-white p-2 rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="h-96 w-full rounded-lg overflow-hidden">
                <iframe
                  title="Sharpr Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12615.460203620926!2d-122.419416!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858089d3daae21%3A0x5c7c921b6f52bf82!2sSan%20Francisco%2C%20CA%2094103!5e0!3m2!1sen!2sus!4v1631024987654!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "What are your office hours?",
                answer:
                  "Our offices are open Monday through Friday from 9:00 AM to 6:00 PM Eastern Time. We are closed on weekends and major holidays.",
              },
              {
                question: "How quickly do you respond to inquiries?",
                answer:
                  "We strive to respond to all inquiries within 24 business hours. For urgent matters, please call our office directly.",
              },
              {
                question: "Do you offer virtual meetings?",
                answer:
                  "Yes, we are happy to schedule virtual meetings via Zoom or Google Meet for those who cannot visit our office in person.",
              },
              {
                question: "How can I request a campus tour?",
                answer:
                  "You can request a campus tour by filling out the form on this page or by calling our admissions office directly at +1 (555) 123-4567.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <details className="group">
                  <summary className="flex justify-between items-center p-4 cursor-pointer bg-white hover:bg-gray-50">
                    <h3 className="font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    <span className="text-blue-600 group-open:rotate-180 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </summary>
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

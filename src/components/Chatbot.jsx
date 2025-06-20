import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  FaRobot,
  FaTimes,
  FaAngleRight,
  FaPaperPlane,
  FaArrowUp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Predefined Q&A data
const chatbotData = [
  {
    id: 1,
    question: "What programs does Sharpr offer?",
    answer:
      "Sharpr offers a variety of educational programs including Foundation Builder (Class 5-6), Concept Mastery (Class 7-8), Board Excellence (Class 9-10), Competitive Edge (Olympiad/NTSE prep), Coding & Digital Skills, and Spoken English & Communication programs.",
  },
  {
    id: 2,
    question: "What age group is suitable for Sharpr's courses?",
    answer:
      "Sharpr primarily caters to students aged 5-10 for foundational learning, with specialized programs extending through high school (up to Class 10). Our curriculum is designed to match different developmental stages and academic requirements.",
  },
  {
    id: 3,
    question: "How qualified are Sharpr's teachers?",
    answer:
      "All our teachers are certified professionals with extensive experience in their subject areas. Each instructor undergoes rigorous training in our teaching methodology, and many hold advanced degrees in education or their specialized fields.",
  },
  {
    id: 4,
    question: "Do you offer online classes?",
    answer:
      "Yes, Sharpr provides both in-person and online learning options. Our digital platform delivers the same high-quality education with interactive elements, live sessions, and personalized attention that you would expect from our physical classrooms.",
  },
  {
    id: 5,
    question: "How much do the programs cost?",
    answer:
      "Our program fees vary based on the course, duration, and format (online vs. in-person). We offer flexible payment plans to accommodate different budgets. For detailed pricing, please request a fee structure by contacting our admissions team.",
  },
  {
    id: 6,
    question: "Is there a free trial class available?",
    answer:
      "Absolutely! We offer a free demo class for all our programs. This allows students and parents to experience our teaching methodology and interact with our faculty before making a commitment.",
  },
  {
    id: 7,
    question: "How do you track student progress?",
    answer:
      "Sharpr uses a comprehensive progress tracking system with regular assessments, personalized feedback, and detailed reports. Parents receive updates through our parent portal and scheduled parent-teacher meetings to discuss growth and areas for improvement.",
  },
  {
    id: 8,
    question: "Where are your centers located?",
    answer:
      "We have multiple learning centers across major cities including Bengaluru, Delhi, Mumbai, Hyderabad, Chennai, and Pune. Each center is equipped with modern facilities to ensure an optimal learning environment.",
  },
];

const Chatbot = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "👋 Hi there! I'm Sharpr's virtual assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [typingEffect, setTypingEffect] = useState(false);
  const messagesEndRef = useRef(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Theme colors - Updated to black-white theme
  const colors = {
    primary: theme === "dark" ? "#ffffff" : "#000000",
    primaryLight:
      theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    secondary: theme === "dark" ? "#a3a3a3" : "#666666",
    background: theme === "dark" ? "#121212" : "#ffffff",
    card: theme === "dark" ? "#1e1e1e" : "#f8f8f8",
    text: theme === "dark" ? "#e5e5e5" : "#121212",
    textLight: theme === "dark" ? "#a3a3a3" : "#6e6e6e",
    border: theme === "dark" ? "#333333" : "#e2e2e2",
    botMessage: theme === "dark" ? "#1e1e1e" : "#f5f5f5",
    userMessage: theme === "dark" ? "#333333" : "#333333",
    shadow:
      theme === "dark"
        ? "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)"
        : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    iconBg: theme === "dark" ? "#333333" : "#333333",
  };

  // Auto scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle clicking a question
  const handleQuestionClick = (question) => {
    // Add user question to chat
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: question.question,
        timestamp: new Date(),
      },
    ]);

    setSelectedQuestion(question);
    setTypingEffect(true);

    // Simulate typing delay
    setTimeout(() => {
      setTypingEffect(false);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: question.answer,
          timestamp: new Date(),
          isContact: question.isContact,
        },
      ]);
    }, 1000 + Math.random() * 500);
  };

  // Handle submitting a custom question
  const handleCustomQuestionSubmit = (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    // Add user question to chat
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: customQuestion,
        timestamp: new Date(),
      },
    ]);

    setTypingEffect(true);
    setCustomQuestion("");

    // Simulate typing delay
    setTimeout(() => {
      setTypingEffect(false);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "For this info, please contact our support team directly.",
          timestamp: new Date(),
        },
        {
          type: "bot",
          content: "contact",
          timestamp: new Date(),
          isContact: true,
        },
      ]);
    }, 1500);
  };

  // Toggle chatbot open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Animation variants - Adjusted for mobile
  const chatbotVariants = {
    closed: {
      width: "60px",
      height: "60px",
      borderRadius: "30px",
    },
    open: {
      width: isMobile ? "90vw" : "380px",
      height: isMobile ? "80vh" : "520px",
      borderRadius: "16px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const iconVariants = {
    closed: {
      rotate: 0,
    },
    open: {
      rotate: 90,
    },
  };

  // UI elements
  const renderChatMessages = () => (
    <div
      className="messages-container"
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "10px",
      }}
    >
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            alignSelf: message.type === "bot" ? "flex-start" : "flex-end",
            maxWidth: "85%",
          }}
        >
          <div
            style={{
              background:
                message.type === "bot" ? colors.botMessage : colors.userMessage,
              color: message.type === "bot" ? colors.text : "#ffffff",
              padding: message.isContact ? "0" : "12px 16px",
              borderRadius: "16px",
              borderBottomLeftRadius: message.type === "bot" ? "4px" : "16px",
              borderBottomRightRadius: message.type === "user" ? "4px" : "16px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              fontSize: "15px",
              lineHeight: 1.5,
              position: "relative",
            }}
          >
            {message.isContact ? (
              <div className="contact-info">
                <div
                  style={{
                    background: theme === "dark" ? "#333333" : "#333333",
                    color: "#fff",
                    padding: "16px",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                >
                  Contact Sharpr
                </div>
                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        background: colors.primaryLight,
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaPhoneAlt color={colors.primary} size={16} />
                    </div>
                    <div>
                      <div
                        style={{ fontSize: "14px", color: colors.textLight }}
                      >
                        Phone
                      </div>
                      <div style={{ fontWeight: "500" }}>+919369428170</div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        background: colors.primaryLight,
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaEnvelope color={colors.primary} size={16} />
                    </div>
                    <div>
                      <div
                        style={{ fontSize: "14px", color: colors.textLight }}
                      >
                        Email
                      </div>
                      <div style={{ fontWeight: "500" }}>
                        thesharpr1@gmail.com
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        background: colors.primaryLight,
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaMapMarkerAlt color={colors.primary} size={16} />
                    </div>
                    <div>
                      <div
                        style={{ fontSize: "14px", color: colors.textLight }}
                      >
                        Headquarters
                      </div>
                      <div style={{ fontWeight: "500" }}>
                        Faridabad,Haryana, India
                      </div>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: theme === "dark" ? "#333333" : "#333333",
                    color: "#fff",
                    border: "none",
                    width: "100%",
                    padding: "12px",
                    borderBottomLeftRadius: "16px",
                    borderBottomRightRadius: "16px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onClick={() => (window.location.href = "/contact")}
                >
                  Get in touch{" "}
                  <FaArrowUp style={{ transform: "rotate(45deg)" }} />
                </motion.button>
              </div>
            ) : (
              message.content
            )}
            <div
              style={{
                fontSize: "11px",
                color:
                  message.type === "bot"
                    ? colors.textLight
                    : "rgba(255,255,255,0.8)",
                marginTop: "6px",
                textAlign: "right",
              }}
            >
              {formatTime(message.timestamp)}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Typing indicator */}
      {typingEffect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            alignSelf: "flex-start",
            background: colors.botMessage,
            padding: "12px 20px",
            borderRadius: "16px",
            borderBottomLeftRadius: "4px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            color: colors.text,
            width: "60px",
          }}
        >
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );

  const renderQuestions = () => (
    <div style={{ padding: "0 16px 10px" }}>
      <p
        style={{
          fontSize: "14px",
          fontWeight: "500",
          margin: "0 0 10px 4px",
          color: colors.textLight,
        }}
      >
        Frequently Asked Questions
      </p>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "10px",
          padding: "4px 0",
          scrollbarWidth: "none", // Firefox
          maxWidth: "100%",
        }}
        className="horizontal-questions"
      >
        {chatbotData.map((question) => (
          <motion.button
            key={question.id}
            whileHover={{ scale: 1.01, backgroundColor: colors.primaryLight }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleQuestionClick(question)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "transparent",
              border: `1px solid ${colors.border}`,
              color: colors.text,
              padding: "10px 14px",
              borderRadius: "10px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "14px",
              fontWeight: "500",
              minWidth: "220px",
              flexShrink: 0,
              transition: "all 0.2s ease",
              height: "auto",
              maxWidth: isMobile ? "80%" : "300px",
            }}
          >
            <span style={{ flex: 1, marginRight: "8px" }}>
              {question.question}
            </span>
            <FaAngleRight color={colors.primary} size={16} />
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Add CSS for typing indicator animation and responsiveness */}
      <style>
        {`
          .typing-indicator {
            display: flex;
            align-items: center;
            gap: 2px;
          }
          
          .typing-indicator span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: ${colors.textLight};
            display: inline-block;
            animation: bounce 1.4s infinite ease-in-out both;
          }
          
          .typing-indicator span:nth-child(1) {
            animation-delay: -0.32s;
          }
          
          .typing-indicator span:nth-child(2) {
            animation-delay: -0.16s;
          }
          
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0.6); }
            40% { transform: scale(1); }
          }
          
          /* Custom scrollbar */
          .messages-container::-webkit-scrollbar {
            width: 6px;
          }
          
          .messages-container::-webkit-scrollbar-track {
            background: ${theme === "dark" ? "#1a1a1a" : "#f5f5f5"};
            border-radius: 10px;
          }
          
          .messages-container::-webkit-scrollbar-thumb {
            background: ${theme === "dark" ? "#333333" : "#cccccc"};
            border-radius: 10px;
          }
          
          .messages-container::-webkit-scrollbar-thumb:hover {
            background: ${theme === "dark" ? "#444444" : "#999999"};
          }
          
          /* Hide horizontal scrollbar but keep functionality */
          .horizontal-questions::-webkit-scrollbar {
            height: 4px;
          }
          
          .horizontal-questions::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .horizontal-questions::-webkit-scrollbar-thumb {
            background: ${colors.border};
            border-radius: 10px;
          }
          
          @media (max-width: 768px) {
            .horizontal-questions::-webkit-scrollbar {
              display: none;
            }
          }
        `}
      </style>

      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={chatbotVariants}
        style={{
          position: "fixed",
          bottom: isMobile ? "16px" : "24px",
          right: isMobile ? "16px" : "24px",
          background: colors.background,
          boxShadow: colors.shadow,
          zIndex: 1000,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${colors.border}`,
          maxWidth: isMobile ? "90vw" : "380px",
          maxHeight: isMobile ? "80vh" : "520px",
        }}
      >
        {isOpen ? (
          <>
            {/* Chatbot header */}
            <div
              style={{
                padding: "16px",
                background: theme === "dark" ? "#333333" : "#333333",
                color: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaRobot size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "16px" }}>
                    Sharpr Assistant
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.9 }}>
                    Online | Typically replies instantly
                  </div>
                </div>
              </div>
              <motion.button
                variants={iconVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }}
              >
                <FaTimes size={18} />
              </motion.button>
            </div>

            {/* Chat messages - Increased space by making it flex: 1 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                overflowY: "hidden",
              }}
            >
              {renderChatMessages()}
            </div>

            {/* Custom question input */}
            <form
              onSubmit={handleCustomQuestionSubmit}
              style={{
                display: "flex",
                padding: "12px 16px",
                borderTop: `1px solid ${colors.border}`,
                background: theme === "dark" ? "#1a1a1a" : "#f8f8f8",
              }}
            >
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Type your question here..."
                style={{
                  flex: 1,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "24px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  outline: "none",
                  background: colors.background,
                  color: colors.text,
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                style={{
                  background: colors.primary,
                  color: theme === "dark" ? "#000000" : "#ffffff",
                  border: "none",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  marginLeft: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                disabled={!customQuestion.trim()}
              >
                <FaPaperPlane size={14} />
              </motion.button>
            </form>

            {/* Questions section - Now horizontally scrollable */}
            {renderQuestions()}
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            style={{
              background: theme === "dark" ? "#333333" : "#333333",
              color: "#ffffff",
              border: "none",
              width: "100%",
              height: "100%",
              borderRadius: "30px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <FaRobot size={24} />
          </motion.button>
        )}
      </motion.div>
    </>
  );
};

export default Chatbot;

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// Define a cohesive color palette with theme support
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
  gold: theme === "dark" ? "#fbbf24" : "#fbbf24",
  cardShadow:
    theme === "dark"
      ? "0 10px 40px rgba(0, 0, 0, 0.3)"
      : "0 10px 40px rgba(0, 0, 0, 0.08)",
  gradientPrimary:
    theme === "dark"
      ? "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)"
      : "linear-gradient(90deg, #4f46e5 0%, #8b5cf6 100%)",
  decorativeBg:
    theme === "dark" ? "rgba(96, 165, 250, 0.05)" : "rgba(79, 70, 229, 0.05)",
  mutedBg: theme === "dark" ? "#374151" : "#e5e7eb",
  buttonGlow:
    theme === "dark"
      ? "0 10px 30px rgba(96, 165, 250, 0.3)"
      : "0 10px 30px rgba(79, 70, 229, 0.3)",
  buttonHover: theme === "dark" ? "#3b82f6" : "#4338ca",
});

const testimonials = [
  {
    id: 1,
    name: "Priya Verma",
    role: "Student",
    image:
      "https://media.istockphoto.com/id/1369754239/photo/university-student-in-white-background-stock-photo.jpg?s=2048x2048&w=is&k=20&c=61vXcaYUi5qx3EmuyS0hGMKqBmpI9E7ypQgSdkG-Ma0=",
    quote:
      "Sharpr's personalized approach helped my son gain confidence in Math and Science. The teachers are truly dedicated and always available to address my concerns. I've seen remarkable progress in just a few months.",
    rating: 5,
    location: "Bengaluru",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Student, Class 9",
    image:
      "https://plus.unsplash.com/premium_photo-1682092630667-c7193ed339dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote:
      "The coding classes were fun and interactive. I built my first website and now want to learn more! The project-based approach makes it easy to understand complex concepts. I look forward to every class.",
    rating: 5,
    location: "Delhi",
  },
  {
    id: 3,
    name: "Anjali Singh",
    role: "Srudent",
    image:
      "https://plus.unsplash.com/premium_photo-1682089897177-4dbc85aa672f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHN0dWRlbnQlMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D",
    quote:
      "Excellent results! My daughter topped her class after joining Sharpr. The structured curriculum and regular assessments kept her motivated throughout the academic year. Highly recommended for serious students.",
    rating: 5,
    location: "Mumbai",
  },
  {
    id: 4,
    name: "Vikram Rao",
    role: "Parent, Class 8",
    image:
      "https://images.unsplash.com/photo-1623053434406-befaaad987d0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote:
      "The teachers explain concepts so clearly that I can understand even difficult topics. I love the regular tests and personalized feedback that helps me identify my weak areas and improve continuously.",
    rating: 4,
    location: "Hyderabad",
  },
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

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);
  const progressIntervalRef = useRef(null);
  const touchStartX = useRef(0);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const colors = getColors(theme);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    resetProgress();
  };

  const handleNext = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    resetProgress();
  };

  const handleDotClick = (i) => {
    setIndex(i);
    resetProgress();
  };

  const resetProgress = () => {
    clearInterval(progressIntervalRef.current);
    setProgressWidth(0);

    if (isAutoPlaying) {
      startProgressInterval();
    }
  };

  const startProgressInterval = () => {
    setProgressWidth(0);
    progressIntervalRef.current = setInterval(() => {
      setProgressWidth((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 0.4; // Slightly slower progression (0.4 instead of 0.5)
      });
    }, 40); // 40ms * 250 steps = ~10 seconds total (slightly longer for smoother animation)
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      startProgressInterval();
    } else {
      clearInterval(progressIntervalRef.current);
    }

    return () => clearInterval(progressIntervalRef.current);
  }, [isAutoPlaying]);

  // Handle keyboard navigation and touch events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle touch events for swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 50) {
      // Swipe threshold
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Star rating component
  const StarRating = ({ rating }) => (
    <div style={{ display: "flex", gap: 4 }}>
      {[...Array(5)].map((_, i) => (
        <motion.svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={i < rating ? colors.gold : colors.mutedBg}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          style={{
            filter:
              i < rating
                ? "drop-shadow(0 0 2px rgba(251, 191, 36, 0.4))"
                : "none",
          }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </motion.svg>
      ))}
    </div>
  );

  const renderMobile = () => (
    <section
      style={{
        background: colors.background,
        padding: "28px 0",
        position: "relative",
        overflow: "hidden",
      }}
      aria-labelledby="testimonial-heading"
    >
      {/* Decorative Elements */}
      <motion.div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: colors.decorativeBg,
          filter: "blur(40px)",
          zIndex: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
          delay: 1,
        }}
        aria-hidden="true"
      />

      <motion.div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "10%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            theme === "dark"
              ? "rgba(129, 140, 248, 0.05)"
              : "rgba(139, 92, 246, 0.05)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
          delay: 0.5,
        }}
        aria-hidden="true"
      />

      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          padding: "0 6px",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <motion.h2
          id="testimonial-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 16,
            color: colors.highlight,
            position: "relative",
            display: "inline-block",
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            Voices of Success
            <motion.span
              style={{
                position: "absolute",
                height: "6px",
                background: colors.gradientPrimary,
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
            color: colors.textLight,
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            maxWidth: 400,
            margin: "0 auto 32px",
            lineHeight: 1.6,
          }}
        >
          Hear what our students and parents say about their journey with
          Sharpr. Real experiences from our community of learners.
        </motion.p>

        <div
          style={{
            maxWidth: 400,
            margin: "0 auto",
            position: "relative",
            padding: "0 0px",
          }}
        >
          {/* Carousel: show one testimonial at a time, swipeable, smaller paddings */}
          <div
            style={{
              position: "relative",
              background: colors.card,
              borderRadius: 24,
              boxShadow: colors.cardShadow,
              padding: "clamp(20px, 5vw, 24px)",
              margin: "0 auto",
              overflow: "hidden",
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials carousel"
          >
            {/* Progress bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: colors.mutedBg,
                zIndex: 2,
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  width: `${progressWidth}%`,
                  background: colors.gradientPrimary,
                  borderRadius: 2,
                }}
                transition={{ ease: "linear" }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    style={{
                      position: "relative",
                      marginBottom: 10,
                    }}
                  >
                    <svg
                      width="50"
                      height="40"
                      viewBox="0 0 51 41"
                      fill="none"
                      style={{ opacity: 0.2, marginBottom: 16 }}
                    >
                      <path
                        d="M11.04 6.71C8.87 9.15 7.25 11.58 6.18 13.98C5.12 16.39 4.58 18.93 4.58 21.62C4.58 24.95 5.49 27.75 7.30 30.02C9.12 32.29 11.41 33.42 14.19 33.42C16.35 33.42 18.19 32.69 19.69 31.23C21.20 29.76 21.95 27.99 21.95 25.92C21.95 23.79 21.26 21.97 19.88 20.45C18.50 18.92 16.82 18.15 14.82 18.15C14.21 18.15 13.58 18.27 12.92 18.52C13.22 16.65 13.97 14.70 15.17 12.67C16.38 10.64 17.87 8.87 19.63 7.34L15.67 3.26C13.91 4.26 12.34 5.41 10.97 6.71H11.04Z"
                        fill={colors.primary}
                      />
                      <path
                        d="M36.47 6.71C34.31 9.15 32.68 11.58 31.62 13.98C30.56 16.39 30.02 18.93 30.02 21.62C30.02 24.95 30.93 27.75 32.74 30.02C34.56 32.29 36.85 33.42 39.63 33.42C41.79 33.42 43.63 32.69 45.13 31.23C46.64 29.76 47.39 27.99 47.39 25.92C47.39 23.79 46.70 21.97 45.32 20.45C43.94 18.92 42.26 18.15 40.26 18.15C39.65 18.15 39.02 18.27 38.36 18.52C38.66 16.65 39.41 14.70 40.61 12.67C41.82 10.64 43.31 8.87 45.07 7.34L41.11 3.26C39.35 4.26 37.78 5.41 36.41 6.71H36.47Z"
                        fill={colors.primary}
                      />
                    </svg>

                    <p
                      style={{
                        fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                        lineHeight: 1.7,
                        color: colors.text,
                        fontStyle: "italic",
                        position: "relative",
                        textAlign: "left",
                      }}
                    >
                      "{testimonials[index].quote}"
                    </p>
                  </motion.div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 16 }}
                    >
                      {" "}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          borderRadius: "50%",
                          overflow: "hidden",
                          width: "clamp(70px, 10vw, 80px)",
                          height: "clamp(70px, 10vw, 80px)",
                          border: `3px solid ${colors.primary}`,
                          position: "relative",
                          boxShadow: `0 0 0 2px ${colors.card}, 0 8px 20px rgba(0,0,0,0.2)`,
                        }}
                      >
                        <img
                          src={testimonials[index].image}
                          alt={testimonials[index].name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center top",
                          }}
                          loading="eager"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              testimonials[index].name
                            )}&background=random&color=fff&size=200&font-size=0.33`;
                          }}
                        />
                      </motion.div>
                      <div style={{ textAlign: "left" }}>
                        <motion.h3
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          style={{
                            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                            fontWeight: 600,
                            margin: 0,
                            color: colors.text,
                          }}
                        >
                          {testimonials[index].name}
                        </motion.h3>

                        <motion.p
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                          style={{
                            margin: "4px 0 8px 0",
                            color: colors.secondary,
                            fontWeight: 500,
                          }}
                        >
                          {testimonials[index].role}
                        </motion.p>

                        <StarRating rating={testimonials[index].rating} />
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      style={{
                        background: colors.backgroundAlt,
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: colors.highlight,
                      }}
                    >
                      {testimonials[index].location}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls - Dots and autoplay toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              marginTop: 32,
            }}
          >
            {testimonials.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => handleDotClick(i)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: i === index ? 24 : 10,
                  height: 10,
                  borderRadius: 10,
                  border: "none",
                  background: i === index ? colors.primary : colors.mutedBg,
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index ? "true" : "false"}
              />
            ))}

            <motion.button
              onClick={toggleAutoPlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
                marginLeft: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isAutoPlaying ? colors.primary : colors.textLight,
              }}
              aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isAutoPlaying ? (
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
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
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
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            textAlign: "center",
            marginTop: 50,
          }}
        >
          <motion.a
            href="/testimonials"
            whileHover={{
              scale: 1.05,
              boxShadow: colors.buttonGlow,
              backgroundColor: colors.buttonHover,
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
            Read More Testimonials
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
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
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
      aria-labelledby="testimonial-heading"
    >
      {/* Decorative Elements */}
      <motion.div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: colors.decorativeBg,
          filter: "blur(40px)",
          zIndex: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
          delay: 1,
        }}
        aria-hidden="true"
      />

      <motion.div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "10%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            theme === "dark"
              ? "rgba(129, 140, 248, 0.05)"
              : "rgba(139, 92, 246, 0.05)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
          delay: 0.5,
        }}
        aria-hidden="true"
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 2,
          textAlign: "center", // Center all content
        }}
      >
        {" "}
        <motion.h2
          id="testimonial-heading"
          initial={{ opacity: 0.6, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: "clamp(2rem, 5vw, 2.8rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 16,
            color: colors.highlight,
            position: "relative",
            display: "inline-block",
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            Voices of Success
            <motion.span
              style={{
                position: "absolute",
                height: "6px",
                background: colors.gradientPrimary,
                bottom: "-8px",
                left: "25%",
                right: "25%",
                borderRadius: "4px",
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
            />
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Hear what our students and parents say about their journey with
          Sharpr. Real experiences from our community of learners.
        </motion.p>
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            position: "relative",
            padding: "0 80px", // Increased padding to make room for the arrows
          }}
        >
          {/* Navigation arrows - Moved outside and positioned better */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              position: "absolute",
              top: "50%",
              left: 0, // Left edge of container
              right: 0, // Right edge of container
              transform: "translateY(-50%)",
              width: "100%", // Full width of container
              pointerEvents: "none",
              zIndex: 5, // Ensure buttons are above everything
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                pointerEvents: "auto",
                color: colors.text,
                marginLeft: 10,
              }}
              aria-label="Previous testimonial"
              onClick={handlePrev}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                pointerEvents: "auto",
                color: colors.text,
                marginRight: 10,
              }}
              aria-label="Next testimonial"
              onClick={handleNext}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          </div>

          <div
            style={{
              position: "relative",
              background: colors.card,
              borderRadius: 24,
              boxShadow: colors.cardShadow,
              padding: "clamp(20px, 5vw, 40px)",
              margin: "0 auto",
              overflow: "hidden",
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials carousel"
          >
            {/* Progress bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: colors.mutedBg,
                zIndex: 2,
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  width: `${progressWidth}%`,
                  background: colors.gradientPrimary,
                  borderRadius: 2,
                }}
                transition={{ ease: "linear" }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    style={{
                      position: "relative",
                      marginBottom: 10,
                    }}
                  >
                    <svg
                      width="50"
                      height="40"
                      viewBox="0 0 51 41"
                      fill="none"
                      style={{ opacity: 0.2, marginBottom: 16 }}
                    >
                      <path
                        d="M11.04 6.71C8.87 9.15 7.25 11.58 6.18 13.98C5.12 16.39 4.58 18.93 4.58 21.62C4.58 24.95 5.49 27.75 7.30 30.02C9.12 32.29 11.41 33.42 14.19 33.42C16.35 33.42 18.19 32.69 19.69 31.23C21.20 29.76 21.95 27.99 21.95 25.92C21.95 23.79 21.26 21.97 19.88 20.45C18.50 18.92 16.82 18.15 14.82 18.15C14.21 18.15 13.58 18.27 12.92 18.52C13.22 16.65 13.97 14.70 15.17 12.67C16.38 10.64 17.87 8.87 19.63 7.34L15.67 3.26C13.91 4.26 12.34 5.41 10.97 6.71H11.04Z"
                        fill={colors.primary}
                      />
                      <path
                        d="M36.47 6.71C34.31 9.15 32.68 11.58 31.62 13.98C30.56 16.39 30.02 18.93 30.02 21.62C30.02 24.95 30.93 27.75 32.74 30.02C34.56 32.29 36.85 33.42 39.63 33.42C41.79 33.42 43.63 32.69 45.13 31.23C46.64 29.76 47.39 27.99 47.39 25.92C47.39 23.79 46.70 21.97 45.32 20.45C43.94 18.92 42.26 18.15 40.26 18.15C39.65 18.15 39.02 18.27 38.36 18.52C38.66 16.65 39.41 14.70 40.61 12.67C41.82 10.64 43.31 8.87 45.07 7.34L41.11 3.26C39.35 4.26 37.78 5.41 36.41 6.71H36.47Z"
                        fill={colors.primary}
                      />
                    </svg>

                    <p
                      style={{
                        fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                        lineHeight: 1.7,
                        color: colors.text,
                        fontStyle: "italic",
                        position: "relative",
                        textAlign: "left",
                      }}
                    >
                      "{testimonials[index].quote}"
                    </p>
                  </motion.div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 16 }}
                    >
                      {" "}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          borderRadius: "50%",
                          overflow: "hidden",
                          width: "clamp(70px, 10vw, 80px)",
                          height: "clamp(70px, 10vw, 80px)",
                          border: `3px solid ${colors.primary}`,
                          position: "relative",
                          boxShadow: `0 0 0 2px ${colors.card}, 0 8px 20px rgba(0,0,0,0.2)`,
                        }}
                      >
                        <img
                          src={testimonials[index].image}
                          alt={testimonials[index].name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center top",
                          }}
                          loading="eager"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              testimonials[index].name
                            )}&background=random&color=fff&size=200&font-size=0.33`;
                          }}
                        />
                      </motion.div>
                      <div style={{ textAlign: "left" }}>
                        <motion.h3
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          style={{
                            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                            fontWeight: 600,
                            margin: 0,
                            color: colors.text,
                          }}
                        >
                          {testimonials[index].name}
                        </motion.h3>

                        <motion.p
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                          style={{
                            margin: "4px 0 8px 0",
                            color: colors.secondary,
                            fontWeight: 500,
                          }}
                        >
                          {testimonials[index].role}
                        </motion.p>

                        <StarRating rating={testimonials[index].rating} />
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      style={{
                        background: colors.backgroundAlt,
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: colors.highlight,
                      }}
                    >
                      {testimonials[index].location}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls - Dots and autoplay toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              marginTop: 32,
            }}
          >
            {testimonials.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => handleDotClick(i)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: i === index ? 24 : 10,
                  height: 10,
                  borderRadius: 10,
                  border: "none",
                  background: i === index ? colors.primary : colors.mutedBg,
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index ? "true" : "false"}
              />
            ))}

            <motion.button
              onClick={toggleAutoPlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
                marginLeft: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isAutoPlaying ? colors.primary : colors.textLight,
              }}
              aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isAutoPlaying ? (
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
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
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
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            textAlign: "center",
            marginTop: 50,
          }}
        >
          <motion.a
            href="/testimonials"
            whileHover={{
              scale: 1.05,
              boxShadow: colors.buttonGlow,
              backgroundColor: colors.buttonHover,
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
            Read More Testimonials
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
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

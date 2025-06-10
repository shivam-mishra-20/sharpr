/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClock,
  FaLaptopCode,
  FaChartLine,
  FaMobileAlt,
  FaLock,
  FaPalette,
  FaRobot,
  FaCloud,
} from "react-icons/fa";
import Footer from "../components/Footer";

const Programs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Programs" },
    { id: "web", name: "Web Development" },
    { id: "data", name: "Data Science" },
    { id: "mobile", name: "Mobile Apps" },
    { id: "design", name: "UX/UI Design" },
  ];

  const programs = [
    {
      id: 1,
      title: "Full Stack Web Development",
      description:
        "Learn front-end and back-end technologies to build complete web applications.",
      category: "web",
      duration: "12 weeks",
      level: "Intermediate",
      price: "$3,999",
      image: "https://via.placeholder.com/600x400?text=Web+Development",
      icon: <FaLaptopCode className="text-2xl" />,
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      description:
        "Master the basics of data analysis, visualization, and machine learning.",
      category: "data",
      duration: "10 weeks",
      level: "Beginner",
      price: "$3,499",
      image: "https://via.placeholder.com/600x400?text=Data+Science",
      icon: <FaChartLine className="text-2xl" />,
    },
    {
      id: 3,
      title: "iOS App Development",
      description:
        "Build native iOS applications with Swift and SwiftUI frameworks.",
      category: "mobile",
      duration: "8 weeks",
      level: "Intermediate",
      price: "$2,999",
      image: "https://via.placeholder.com/600x400?text=iOS+Development",
      icon: <FaMobileAlt className="text-2xl" />,
    },
    {
      id: 4,
      title: "UX/UI Design Principles",
      description:
        "Learn to create intuitive user experiences and visually appealing interfaces.",
      category: "design",
      duration: "6 weeks",
      level: "Beginner",
      price: "$2,499",
      image: "https://via.placeholder.com/600x400?text=UX/UI+Design",
      icon: <FaPalette className="text-2xl" />,
    },
    {
      id: 5,
      title: "Advanced Data Science",
      description:
        "Dive deeper into machine learning models and statistical analysis methods.",
      category: "data",
      duration: "14 weeks",
      level: "Advanced",
      price: "$4,499",
      image: "https://via.placeholder.com/600x400?text=Advanced+Data+Science",
      icon: <FaChartLine className="text-2xl" />,
    },
    {
      id: 6,
      title: "Cybersecurity Fundamentals",
      description:
        "Learn the essential skills to protect systems and networks from cyber threats.",
      category: "web",
      duration: "10 weeks",
      level: "Intermediate",
      price: "$3,699",
      image: "https://via.placeholder.com/600x400?text=Cybersecurity",
      icon: <FaLock className="text-2xl" />,
    },
    {
      id: 7,
      title: "Android App Development",
      description:
        "Create native Android applications using Kotlin and Android Studio.",
      category: "mobile",
      duration: "8 weeks",
      level: "Intermediate",
      price: "$2,999",
      image: "https://via.placeholder.com/600x400?text=Android+Development",
      icon: <FaMobileAlt className="text-2xl" />,
    },
    {
      id: 8,
      title: "AI and Machine Learning",
      description:
        "Explore artificial intelligence concepts and implement machine learning models.",
      category: "data",
      duration: "14 weeks",
      level: "Advanced",
      price: "$4,999",
      image: "https://via.placeholder.com/600x400?text=AI+and+ML",
      icon: <FaRobot className="text-2xl" />,
    },
    {
      id: 9,
      title: "Cloud Computing",
      description: "Master cloud platforms like AWS, Azure, and Google Cloud.",
      category: "web",
      duration: "8 weeks",
      level: "Intermediate",
      price: "$3,299",
      image: "https://via.placeholder.com/600x400?text=Cloud+Computing",
      icon: <FaCloud className="text-2xl" />,
    },
  ];

  const filteredPrograms = programs.filter((program) => {
    const matchesFilter = filter === "all" || program.category === filter;
    const matchesSearch =
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-gray-50" style={{ overflowX: "hidden" }}>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(125deg, #172554 0%, #1e40af 40%, #1e3a8a 100%)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'url("https://via.placeholder.com/200x200?text=Pattern")',
            backgroundSize: "200px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "200px 200px"],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        ></motion.div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{
                letterSpacing: "-0.02em",
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              Our Tech Programs
            </h1>
            <p
              className="text-xl text-indigo-100 mb-8"
              style={{ lineHeight: 1.7 }}
            >
              Discover the skills that will propel your career forward in
              today's digital economy.
            </p>

            <motion.div
              className="relative max-w-xl mx-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-6 pr-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition"
                style={{
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
              />
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </motion.svg>
            </motion.div>
          </motion.div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background:
              "linear-gradient(to top, #f9fafb 0%, rgba(249, 250, 251, 0) 100%)",
          }}
        ></div>
      </section>

      {/* Filter Categories */}
      <section
        className="py-8 border-b border-gray-200"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`px-5 py-2 rounded-full font-medium transition ${
                  filter === category.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setFilter(category.id)}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow:
                    filter === category.id
                      ? "0 4px 12px rgba(79, 70, 229, 0.25)"
                      : "0 2px 5px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section
        className="py-16"
        style={{
          background: "linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {filteredPrograms.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                key="results"
              >
                {filteredPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.1, duration: 0.5 },
                    }}
                    exit={{ opacity: 0, y: 20 }}
                    whileHover={{
                      y: -8,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      borderColor: "rgba(79, 70, 229, 0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      transformOrigin: "center bottom",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <motion.img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        style={{ transformOrigin: "center" }}
                      />
                      <div
                        className="absolute top-0 right-0 m-4 px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          background:
                            "linear-gradient(135deg, #4f46e5, #6366f1)",
                          color: "white",
                          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                        }}
                      >
                        {program.level}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #ebf4ff, #dbeafe)",
                            color: "#4f46e5",
                            boxShadow: "0 2px 5px rgba(79, 70, 229, 0.1)",
                          }}
                        >
                          {program.icon}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <FaClock style={{ color: "#6366f1" }} />{" "}
                          {program.duration}
                        </div>
                      </div>

                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: "#1e293b" }}
                      >
                        {program.title}
                      </h3>
                      <p
                        className="text-gray-600 mb-4"
                        style={{ lineHeight: 1.6 }}
                      >
                        {program.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className="font-bold text-lg"
                          style={{
                            color: "#4f46e5",
                            textShadow: "0 0.5px 1px rgba(79, 70, 229, 0.1)",
                          }}
                        >
                          {program.price}
                        </span>
                        <motion.button
                          className="px-5 py-2 rounded-lg text-white"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            background:
                              "linear-gradient(135deg, #4f46e5, #6366f1)",
                            boxShadow: "0 4px 10px rgba(79, 70, 229, 0.2)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          View Details
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                key="no-results"
                style={{ minHeight: "50vh" }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
                <motion.h3
                  className="text-xl font-bold text-gray-700 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{ letterSpacing: "-0.01em" }}
                >
                  No Programs Found
                </motion.h3>
                <motion.p
                  className="text-gray-500 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{
                    maxWidth: "400px",
                    margin: "0 auto",
                    lineHeight: 1.7,
                  }}
                >
                  We couldn't find any programs matching your criteria. Try
                  adjusting your search or filter.
                </motion.p>
                <motion.button
                  onClick={() => {
                    setFilter("all");
                    setSearchQuery("");
                  }}
                  className="px-6 py-2 text-white rounded-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                  }}
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 text-white"
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%)",
          boxShadow: "inset 0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                letterSpacing: "-0.02em",
              }}
            >
              Ready to start your learning journey?
            </h2>
            <p
              className="text-xl mb-8"
              style={{
                color: "rgba(219, 234, 254, 0.9)",
                lineHeight: 1.7,
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              Get personalized guidance to help you choose the right program for
              your goals.
            </p>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="px-8 py-3 bg-white text-blue-700 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  color: "#1d4ed8",
                  fontWeight: 600,
                }}
              >
                Apply Now
              </motion.button>

              <motion.button
                className="px-8 py-3 border border-white bg-transparent rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backdropFilter: "blur(4px)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                Schedule a Consultation
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Programs;

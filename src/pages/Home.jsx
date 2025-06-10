/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaGraduationCap,
  FaLaptopCode,
  FaChartLine,
  FaUserFriends,
} from "react-icons/fa";
import Footer from "../components/Footer";
import Testimonial from "../components/Testimonial";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-gray-50" style={{ overflowX: "hidden" }}>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(125deg, #0c2461 0%, #1e3799 40%, #0a3bbd 100%)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-[url('/src/assets/grid-pattern.svg')] opacity-20"
          animate={{
            backgroundPosition: ["0px 0px", "100px 100px"],
          }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
        ></motion.div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-6"
            >
              <motion.span
                className="px-4 py-2 rounded-full text-sm font-medium inline-block"
                whileHover={{ scale: 1.05 }}
                style={{
                  background: "rgba(30, 64, 175, 0.6)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                }}
              >
                Future-proof your career
              </motion.span>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{
                  textShadow: "0 2px 15px rgba(0,0,0,0.2)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Sharpen Your Skills for the Digital Economy
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-blue-100 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                style={{
                  lineHeight: 1.7,
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                Master in-demand tech skills with immersive, project-based
                learning experiences designed by industry experts.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <motion.button
                  className="px-8 py-3 bg-white text-blue-900 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    fontWeight: 600,
                  }}
                >
                  Get Started <FaArrowRight style={{ marginLeft: "4px" }} />
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
                  Explore Programs
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{
                delay: 0.5,
                duration: 1,
                type: "spring",
                stiffness: 100,
              }}
              className="hidden md:block relative"
              style={{ transformOrigin: "center" }}
            >
              <motion.div
                whileHover={{ rotate: 0, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <img
                  src="/src/assets/hero-image.png"
                  alt="Students learning"
                  className="rounded-lg"
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                    border: "4px solid rgba(255,255,255,0.1)",
                  }}
                />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-4 rounded-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                style={{
                  boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                  width: "180px",
                }}
              >
                <p className="font-bold">95% Success Rate</p>
                <p className="text-sm text-blue-100">
                  for our graduates in job placement
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background:
              "linear-gradient(to top, #f9fafb 0%, rgba(249, 250, 251, 0) 100%)",
          }}
        ></div>
      </section>

      {/* Featured Programs */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <motion.span
              className="text-blue-600 font-semibold inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                letterSpacing: "0.05em",
                position: "relative",
                paddingBottom: "8px",
              }}
            >
              FEATURED PROGRAMS
              <motion.span
                style={{
                  position: "absolute",
                  height: "2px",
                  width: "40%",
                  background: "linear-gradient(to right, #3b82f6, transparent)",
                  bottom: 0,
                  left: "30%",
                }}
                initial={{ width: "0%", left: "50%" }}
                whileInView={{ width: "40%", left: "30%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </motion.span>
            <h2
              className="text-3xl md:text-4xl font-bold mt-2 mb-4"
              style={{
                color: "#1e293b",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Accelerate Your Career Growth
            </h2>
            <p className="text-gray-600" style={{ lineHeight: 1.7 }}>
              Choose from our most popular programs designed to help you master
              the skills that employers are looking for.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              {
                icon: <FaLaptopCode className="text-white text-2xl" />,
                title: "Web Development",
                description:
                  "Master modern web development with React, Node.js and other essential technologies.",
                color: "bg-blue-600",
              },
              {
                icon: <FaChartLine className="text-white text-2xl" />,
                title: "Data Science",
                description:
                  "Learn the skills to analyze and interpret complex data sets with Python and ML tools.",
                color: "bg-indigo-600",
              },
              {
                icon: <FaUserFriends className="text-white text-2xl" />,
                title: "UX/UI Design",
                description:
                  "Create engaging user experiences with industry-standard design principles and tools.",
                color: "bg-purple-600",
              },
            ].map((program, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className={`${program.color} p-6`}>
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                    {program.icon}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      12 weeks
                    </span>
                    <Link
                      to="/programs"
                      className="text-blue-600 font-medium flex items-center gap-1 group"
                    >
                      Learn more
                      <FaArrowRight className="transform group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold">WHY CHOOSE US</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Education that makes a difference
            </h2>
            <p className="text-gray-600">
              Our approach combines practical learning with industry expertise
              to give you the edge in today's competitive job market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaGraduationCap className="text-blue-600 text-3xl" />,
                title: "Expert Instructors",
                description:
                  "Learn from industry professionals who bring real-world experience to the classroom.",
              },
              {
                icon: <FaLaptopCode className="text-blue-600 text-3xl" />,
                title: "Project-Based Learning",
                description:
                  "Build a portfolio of projects that demonstrate your skills to potential employers.",
              },
              {
                icon: <FaUserFriends className="text-blue-600 text-3xl" />,
                title: "Community Support",
                description:
                  "Join a community of learners and mentors who will support your journey.",
              },
              {
                icon: <FaChartLine className="text-blue-600 text-3xl" />,
                title: "Career Services",
                description:
                  "Get guidance on resume building, interviewing, and job search strategies.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4 w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              What Our Students Say
            </h2>
            <p className="text-gray-600">
              Hear from our alumni who have transformed their careers through
              our programs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial
              name="Sarah Johnson"
              role="Software Developer at Google"
              image="/src/assets/testimonial1.jpg"
              quote="The web development program was exactly what I needed to transition into tech from my previous career. The instructors were supportive and the curriculum was challenging but rewarding."
              rating={5}
            />
            <Testimonial
              name="Michael Chen"
              role="Data Analyst at Amazon"
              image="/src/assets/testimonial2.jpg"
              quote="I had tried learning data science on my own, but Sharpr's structured program and hands-on projects helped me truly master the concepts and land my dream job."
              rating={5}
            />
            <Testimonial
              name="Jessica Taylor"
              role="UX Designer at Adobe"
              image="/src/assets/testimonial3.jpg"
              quote="The UX/UI design program gave me both the technical skills and strategic thinking needed to create meaningful user experiences. Worth every penny!"
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your future?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have accelerated their careers with
              Sharpr Education.
            </p>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="px-8 py-3 bg-white text-blue-700 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Now <FaArrowRight />
              </motion.button>

              <motion.button
                className="px-8 py-3 border border-white bg-transparent rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule a Call
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

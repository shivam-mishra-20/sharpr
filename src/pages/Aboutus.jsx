/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaLightbulb,
  FaGlobeAmericas,
  FaChalkboardTeacher,
} from "react-icons/fa";
import Footer from "../components/Footer";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  // Parallax effect for hero section
  const parallaxBg = {
    y: [0, -20],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 2,
      ease: "easeInOut",
    },
  };

  return (
    <div className="bg-gray-50" style={{ overflowX: "hidden" }}>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(125deg, #111827 0%, #1f2937 40%, #334155 100%)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-[url('/src/assets/dot-pattern.svg')] opacity-20"
          animate={parallaxBg}
        ></motion.div>

        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.15) 0%, transparent 70%)",
          }}
        ></motion.div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                textShadow: "0 4px 15px rgba(0,0,0,0.3)",
                letterSpacing: "-0.02em",
                background: "linear-gradient(to right, #fff, #cbd5e1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.1,
              }}
            >
              Our Mission and Vision
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-200 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                lineHeight: 1.7,
                textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              Empowering the next generation of tech professionals with
              practical, industry-relevant education
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.a
                href="#our-story"
                className="inline-block"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  style={{
                    margin: "30px auto 0",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.7 }}
                  >
                    <path d="M7 13l5 5 5-5"></path>
                    <path d="M7 6l5 5 5-5"></path>
                  </svg>
                </motion.div>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section
        id="our-story"
        className="py-20"
        style={{
          background: "linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span
                className="text-blue-600 font-semibold inline-block"
                style={{
                  letterSpacing: "0.05em",
                  position: "relative",
                  paddingBottom: "8px",
                }}
              >
                OUR STORY
                <motion.span
                  style={{
                    position: "absolute",
                    height: "2px",
                    width: "40px",
                    background: "#2563eb",
                    bottom: 0,
                    left: 0,
                  }}
                  initial={{ width: "0px" }}
                  whileInView={{ width: "40px" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                />
              </motion.span>

              <h2
                className="text-3xl md:text-4xl font-bold mt-2 mb-6"
                style={{
                  color: "#1e293b",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Bridging the Gap Between Education and Industry
              </h2>

              <div className="space-y-4 text-gray-700">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{ lineHeight: 1.8 }}
                >
                  Founded in 2018, Sharpr began with a simple question: Why is
                  there such a gap between what traditional education provides
                  and what employers actually need?
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{ lineHeight: 1.8 }}
                >
                  Our founders, experienced professionals from tech and
                  education backgrounds, recognized that conventional learning
                  paths were failing to prepare students for real-world
                  challenges in the rapidly evolving tech industry.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  style={{ lineHeight: 1.8 }}
                >
                  What started as a small workshop series has grown into a
                  comprehensive educational platform serving thousands of
                  students worldwide. We remain committed to our founding
                  principle: education should be practical, relevant, and
                  directly applicable to real career opportunities.
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: 0.2,
                duration: 0.8,
                type: "spring",
                stiffness: 100,
              }}
              className="relative"
            >
              <motion.div
                className="rounded-xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                style={{
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transform: "rotate(2deg)",
                }}
              >
                <img
                  src="/src/assets/founders.jpg"
                  alt="Sharpr Founders"
                  className="w-full h-auto"
                  style={{
                    filter: "contrast(1.05) brightness(1.05)",
                  }}
                />
              </motion.div>

              <motion.div
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-lg"
                initial={{ opacity: 0, x: -20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  maxWidth: "280px",
                }}
              >
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: "#1e40af" }}
                >
                  Our Impact
                </h3>
                <p className="text-gray-700" style={{ lineHeight: 1.7 }}>
                  Over{" "}
                  <span
                    style={{
                      color: "#1e40af",
                      fontWeight: 600,
                    }}
                  >
                    15,000
                  </span>{" "}
                  graduates since 2018, with{" "}
                  <span
                    style={{
                      color: "#1e40af",
                      fontWeight: 600,
                    }}
                  >
                    92%
                  </span>{" "}
                  job placement rate within 6 months of completion.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold">CORE VALUES</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              What We Stand For
            </h2>
            <p className="text-gray-600">
              The principles that guide our work and our relationships with
              students, partners, and the community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaUsers className="text-blue-600 text-3xl" />,
                title: "Community",
                description:
                  "We believe learning happens best in supportive communities where students can collaborate and grow together.",
              },
              {
                icon: <FaLightbulb className="text-blue-600 text-3xl" />,
                title: "Innovation",
                description:
                  "Our curriculum evolves constantly to keep pace with industry trends and technological advancements.",
              },
              {
                icon: <FaGlobeAmericas className="text-blue-600 text-3xl" />,
                title: "Accessibility",
                description:
                  "We strive to make quality education accessible through scholarships and flexible payment options.",
              },
              {
                icon: (
                  <FaChalkboardTeacher className="text-blue-600 text-3xl" />
                ),
                title: "Excellence",
                description:
                  "We hold ourselves to the highest standards in curriculum development, instruction, and student support.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                }}
              >
                <div className="mb-4 w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold">OUR TEAM</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-gray-600">
              The passionate educators and industry experts behind Sharpr's
              vision and success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Maya Patel",
                role: "CEO & Co-Founder",
                image: "/src/assets/team-1.jpg",
                bio: "Former tech executive with 15+ years of experience in Silicon Valley companies.",
              },
              {
                name: "James Wilson",
                role: "CTO & Co-Founder",
                image: "/src/assets/team-2.jpg",
                bio: "Software architect and educator with a passion for making complex concepts accessible.",
              },
              {
                name: "Sarah Chen",
                role: "Director of Curriculum",
                image: "/src/assets/team-3.jpg",
                bio: "PhD in Computer Science with research focus on effective teaching methodologies.",
              },
              {
                name: "Michael Rodriguez",
                role: "Director of Student Success",
                image: "/src/assets/team-4.jpg",
                bio: "Career coach and former HR professional from leading tech companies.",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-xl">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold">OUR PARTNERS</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Companies That Trust Us
            </h2>
            <p className="text-gray-600">
              We work with leading tech companies to ensure our curriculum meets
              industry standards and our graduates are job-ready.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {[1, 2, 3, 4, 5, 6].map((partner) => (
              <div
                key={partner}
                className="flex items-center justify-center p-4"
              >
                <img
                  src={`/src/assets/partner-${partner}.svg`}
                  alt={`Partner Logo ${partner}`}
                  className="max-h-12 opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;

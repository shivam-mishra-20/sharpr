import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AboutUs = () => {
  const { theme } = useTheme();

  // Enhanced theme-based colors with better dark mode support
  const colors = {
    background: theme === "dark" ? "#111827" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#333333",
    textLight: theme === "dark" ? "#9ca3af" : "#444444",
    sectionBg: theme === "dark" ? "#1f2937" : "#f9f9f9",
    statsBg: theme === "dark" ? "#182234" : "#f0f9ff",
    cardBg: theme === "dark" ? "#2a3042" : "#ffffff",
    cardBorder: theme === "dark" ? "#374151" : "rgba(90, 115, 252, 0.1)",
    cardBorderHover: theme === "dark" ? "#4b5563" : "rgba(90, 115, 252, 0.3)",
    cardShadow:
      theme === "dark"
        ? "0 10px 30px rgba(0, 0, 0, 0.3)"
        : "0 10px 30px rgba(0, 0, 0, 0.05)",
    cardShadowHover:
      theme === "dark"
        ? "0 15px 35px rgba(0, 0, 0, 0.4)"
        : "0 15px 35px rgba(90, 115, 252, 0.1)",
    primary: theme === "dark" ? "#60a5fa" : "#5a73fc",
    secondary: theme === "dark" ? "#93c5fd" : "#6bc5f8",
    gradient:
      theme === "dark"
        ? "linear-gradient(135deg, #3b82f6, #60a5fa)"
        : "linear-gradient(135deg, #6bc5f8, #5a73fc)",
    buttonText: "#ffffff",
    iconBg:
      theme === "dark"
        ? "linear-gradient(135deg, #182234, #1f2937)"
        : "linear-gradient(135deg, #f0f9ff, #e6f5fe)",
    featureTitle: theme === "dark" ? "#e5e7eb" : "#333",
    featureText: theme === "dark" ? "#9ca3af" : "#666",
    statNumberColor: theme === "dark" ? "#60a5fa" : "#5a73fc",
    sectionDivider: theme === "dark" ? "#1f2937" : "#f0f4ff",
    buttonHoverBg: theme === "dark" ? "#3b82f6" : "#4338ca",
    buttonHoverShadow:
      theme === "dark"
        ? "0 15px 35px rgba(59, 130, 246, 0.4)"
        : "0 15px 35px rgba(90, 115, 252, 0.4)",
  };

  // Animation controls for different sections
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Animation variants with refined timings
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  const counterAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 2 },
    },
  };

  const navigate = useNavigate();

  return (
    <AboutContainer
      style={{ background: colors.background, color: colors.text }}
    >
      {/* Hero Section */}
      <HeroSection style={{ background: colors.gradient }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-content"
        >
          <Title>About Sharpr</Title>
          <Subtitle>Transforming Education Through Technology</Subtitle>
        </motion.div>
      </HeroSection>

      {/* Mission & Vision */}
      <Section
        style={{ background: theme === "dark" ? colors.background : "white" }}
      >
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeIn}
          className="mission-container"
        >
          <SectionTitle style={{ color: colors.text }}>
            Our Mission
          </SectionTitle>
          <Description style={{ color: colors.textLight }}>
            At Sharpr, we're on a mission to unlock new potential through
            digital skills mastery. We believe that quality education should be
            accessible to everyone, regardless of their location or background.
            Our platform is designed to provide the tools, resources, and
            support needed for students to thrive in today's digital world.
          </Description>
        </motion.div>
      </Section>

      {/* Stats Section */}
      <StatsSection
        className="stats-section"
        style={{ background: colors.statsBg }}
      >
        <SectionTitle style={{ color: colors.text, marginBottom: "2.5rem" }}>
          Our Impact
        </SectionTitle>
        <StatsContainer>
          <motion.div
            className="stats-row"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <StatCard
              variants={fadeIn}
              style={{
                background: colors.cardBg,
                color: colors.text,
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: colors.cardShadow,
              }}
              whileHover={{
                y: -8,
                boxShadow: colors.cardShadowHover,
                borderColor: colors.cardBorderHover,
              }}
            >
              <StatIconWrapper style={{ background: colors.gradient }}>
                <StatIcon>👨‍🎓</StatIcon>
              </StatIconWrapper>
              <StatNumber style={{ color: colors.statNumberColor }}>
                <CounterValue>120k+</CounterValue>
              </StatNumber>
              <StatLabel style={{ color: colors.textLight }}>
                Successfully Graduated
              </StatLabel>
            </StatCard>

            <StatCard
              variants={fadeIn}
              style={{
                background: colors.cardBg,
                color: colors.text,
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: colors.cardShadow,
              }}
              whileHover={{
                y: -8,
                boxShadow: colors.cardShadowHover,
                borderColor: colors.cardBorderHover,
              }}
            >
              <StatIconWrapper style={{ background: colors.gradient }}>
                <StatIcon>🏆</StatIcon>
              </StatIconWrapper>
              <StatNumber style={{ color: colors.statNumberColor }}>
                <CounterValue>90%</CounterValue>
              </StatNumber>
              <StatLabel style={{ color: colors.textLight }}>
                Course Completion Rate
              </StatLabel>
            </StatCard>

            <StatCard
              variants={fadeIn}
              style={{
                background: colors.cardBg,
                color: colors.text,
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: colors.cardShadow,
              }}
              whileHover={{
                y: -8,
                boxShadow: colors.cardShadowHover,
                borderColor: colors.cardBorderHover,
              }}
            >
              <StatIconWrapper style={{ background: colors.gradient }}>
                <StatIcon>⏱️</StatIcon>
              </StatIconWrapper>
              <StatNumber style={{ color: colors.statNumberColor }}>
                <CounterValue>10+</CounterValue>
              </StatNumber>
              <StatLabel style={{ color: colors.textLight }}>
                Years of Experience
              </StatLabel>
            </StatCard>

            <StatCard
              variants={fadeIn}
              style={{
                background: colors.cardBg,
                color: colors.text,
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: colors.cardShadow,
              }}
              whileHover={{
                y: -8,
                boxShadow: colors.cardShadowHover,
                borderColor: colors.cardBorderHover,
              }}
            >
              <StatIconWrapper style={{ background: colors.gradient }}>
                <StatIcon>👥</StatIcon>
              </StatIconWrapper>
              <StatNumber style={{ color: colors.statNumberColor }}>
                <CounterValue>100K+</CounterValue>
              </StatNumber>
              <StatLabel style={{ color: colors.textLight }}>
                Active Students
              </StatLabel>
            </StatCard>
          </motion.div>
        </StatsContainer>
      </StatsSection>

      {/* Our Story */}
      <Section
        style={{
          background: colors.sectionBg,
          paddingTop: "5rem",
          paddingBottom: "5rem",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="story-container"
        >
          <SectionTitle style={{ color: colors.text }}>Our Story</SectionTitle>
          <Description style={{ color: colors.textLight }}>
            “Sharpr — The Root of Possibility” In an age of distractions and
            surface-level learning, Sharpr plants the seed of deep curiosity,
            nurturing it with clarity and guidance, until it grows into a
            Kalpavriksha — the eternal tree of knowledge and dreams. The Logo’s
            Story: The tree symbolizes every child’s potential — vivid,
            branching, and limitless. The roots are not buried in confusion, but
            in the solid foundation Sharpr provides. From this fertile learning
            ground, the mind grows upward, branching into aspirations: science,
            imagination, empathy, and excellence. The colors represent diversity
            in learning and thinking. Each child’s path is unique, but all are
            rooted in one truth — clarity sharpens the mind. The fusion of
            nature (tree) and design (roots/digital precision) embodies the soul
            of Sharpr: old wisdom, new tools.
          </Description>
        </motion.div>
      </Section>

      {/* Our Approach */}
      <Section
        style={{
          background: theme === "dark" ? colors.background : "white",
          paddingTop: "6rem",
          paddingBottom: "6rem",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <SectionTitle style={{ color: colors.text, marginBottom: "3rem" }}>
            Why Choose Us
          </SectionTitle>
          <FeatureCards>
            {/* First Feature Card */}
            <FeatureCard
              variants={fadeIn}
              style={{
                background: colors.cardBg,
                boxShadow: colors.cardShadow,
                border: `1px solid ${colors.cardBorder}`,
              }}
              whileHover={{
                y: -10,
                boxShadow: colors.cardShadowHover,
                borderColor: colors.cardBorderHover,
                transition: { duration: 0.3 },
              }}
            >
              <FeatureIconWrapper
                style={{
                  background: colors.iconBg,
                  marginBottom: "2rem",
                }}
              >
                <FeatureIcon>🎓</FeatureIcon>
              </FeatureIconWrapper>
              <FeatureContent>
                <FeatureTitle style={{ color: colors.featureTitle }}>
                  Industry-Relevant Curriculum
                  <TitleUnderline
                    style={{
                      background: colors.gradient,
                      width: "50px",
                      height: "4px",
                    }}
                  />
                </FeatureTitle>
                <FeatureDescription style={{ color: colors.featureText }}>
                  Our courses are designed by industry experts and continuously
                  updated to reflect the latest trends, tools, and best
                  practices.
                </FeatureDescription>
              </FeatureContent>
            </FeatureCard>

            {/* Second Feature Card */}
            <FeatureCard
              variants={fadeIn}
              style={{
                background: colors.cardBg,
                boxShadow: colors.cardShadow,
                border: `1px solid ${colors.cardBorder}`,
              }}
              whileHover={{
                y: -10,
                boxShadow: colors.cardShadowHover,
                borderColor: colors.cardBorderHover,
                transition: { duration: 0.3 },
              }}
            >
              <FeatureIconWrapper
                style={{
                  background: colors.iconBg,
                  marginBottom: "2rem",
                }}
              >
                <FeatureIcon>💼</FeatureIcon>
              </FeatureIconWrapper>
              <FeatureContent>
                <FeatureTitle style={{ color: colors.featureTitle }}>
                  Career-Focused Learning
                  <TitleUnderline
                    style={{
                      background: colors.gradient,
                      width: "50px",
                      height: "4px",
                    }}
                  />
                </FeatureTitle>
                <FeatureDescription style={{ color: colors.featureText }}>
                  Every course is built with your career goals in mind, focusing
                  on the skills employers actually need.
                </FeatureDescription>
              </FeatureContent>
            </FeatureCard>

            {/* Third Feature Card */}
            <FeatureCard
              variants={fadeIn}
              style={{
                background: colors.cardBg,
                boxShadow: colors.cardShadow,
                border: `1px solid ${colors.cardBorder}`,
              }}
              whileHover={{
                y: -10,
                boxShadow: colors.cardShadowHover,
                borderColor: colors.cardBorderHover,
                transition: { duration: 0.3 },
              }}
            >
              <FeatureIconWrapper
                style={{
                  background: colors.iconBg,
                  marginBottom: "2rem",
                }}
              >
                <FeatureIcon>👨‍👩‍👧‍👦</FeatureIcon>
              </FeatureIconWrapper>
              <FeatureContent>
                <FeatureTitle style={{ color: colors.featureTitle }}>
                  Supportive Community
                  <TitleUnderline
                    style={{
                      background: colors.gradient,
                      width: "50px",
                      height: "4px",
                    }}
                  />
                </FeatureTitle>
                <FeatureDescription style={{ color: colors.featureText }}>
                  Join thousands of learners in our active community where you
                  can seek help, share achievements, and network with peers.
                </FeatureDescription>
              </FeatureContent>
            </FeatureCard>

            {/* Fourth Feature Card */}
            <FeatureCard
              variants={fadeIn}
              style={{
                background: colors.cardBg,
                boxShadow: colors.cardShadow,
                border: `1px solid ${colors.cardBorder}`,
              }}
              whileHover={{
                y: -10,
                boxShadow: colors.cardShadowHover,
                borderColor: colors.cardBorderHover,
                transition: { duration: 0.3 },
              }}
            >
              <FeatureIconWrapper
                style={{
                  background: colors.iconBg,
                  marginBottom: "2rem",
                }}
              >
                <FeatureIcon>🚀</FeatureIcon>
              </FeatureIconWrapper>
              <FeatureContent>
                <FeatureTitle style={{ color: colors.featureTitle }}>
                  Learn by Doing
                  <TitleUnderline
                    style={{
                      background: colors.gradient,
                      width: "50px",
                      height: "4px",
                    }}
                  />
                </FeatureTitle>
                <FeatureDescription style={{ color: colors.featureText }}>
                  Our project-based approach ensures you're not just watching
                  videos but actively building your portfolio with real-world
                  projects.
                </FeatureDescription>
              </FeatureContent>
            </FeatureCard>
          </FeatureCards>
        </motion.div>
      </Section>

      {/* Team Section commented out in original code */}
      {/* <Section bgColor="#f9f9f9">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <SectionTitle>Meet Our Team</SectionTitle>
          <Description>
            Sharpr is powered by a diverse team of educators, technologists, and
            lifelong learners who are passionate about transforming education.
          </Description>
        </motion.div>
        <TeamGrid>
          <motion.div
            className="team-row"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Add team member cards here with appropriate images 
            
            <TeamMember variants={fadeIn}>
              <TeamMemberImageWrapper>
                <TeamMemberImage
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                />
              </TeamMemberImageWrapper>
              <TeamMemberInfo>
                <TeamMemberName>Robert David</TeamMemberName>
                <TeamMemberRole>Founder & CEO</TeamMemberRole>
              </TeamMemberInfo>
            </TeamMember>

            <TeamMember variants={fadeIn}>
              <TeamMemberImageWrapper>
                <TeamMemberImage
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                />
              </TeamMemberImageWrapper>
              <TeamMemberInfo>
                <TeamMemberName>Sarah Edwards</TeamMemberName>
                <TeamMemberRole>Chief Learning Officer</TeamMemberRole>
              </TeamMemberInfo>
            </TeamMember>

            <TeamMember variants={fadeIn}>
              <TeamMemberImageWrapper>
                <TeamMemberImage
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                />
              </TeamMemberImageWrapper>
              <TeamMemberInfo>
                <TeamMemberName>Michael Chen</TeamMemberName>
                <TeamMemberRole>Head of Technology</TeamMemberRole>
              </TeamMemberInfo>
            </TeamMember>

            <TeamMember variants={fadeIn}>
              <TeamMemberImageWrapper>
                <TeamMemberImage
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                />
              </TeamMemberImageWrapper>
              <TeamMemberInfo>
                <TeamMemberName>Jessica Singh</TeamMemberName>
                <TeamMemberRole>Lead Content Strategist</TeamMemberRole>
              </TeamMemberInfo>
            </TeamMember>
          </motion.div>
        </TeamGrid>
      </Section> */}
      {/* CTA Section */}
      <CTASection
        style={{
          background: colors.gradient,
          padding: "6rem 2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="cta-container"
        >
          <CTATitle>Ready to Start Your Learning Journey?</CTATitle>
          <CTADescription>
            Join over 100,000 students who are already mastering new skills and
            advancing their careers with Sharpr.
          </CTADescription>
          <CTAButton
            onClick={() => navigate("/programs")}
            style={{
              background: theme === "dark" ? "#ffffff" : "#ffffff",
              color: theme === "dark" ? "#3b82f6" : "#5a73fc",
              boxShadow:
                theme === "dark"
                  ? "0 10px 25px rgba(255, 255, 255, 0.2)"
                  : "0 10px 25px rgba(90, 115, 252, 0.4)",
            }}
            whileHover={{
              y: -5,
              boxShadow: colors.buttonHoverShadow,
              transition: { duration: 0.3 },
            }}
          >
            Explore Courses
          </CTAButton>
        </motion.div>
      </CTASection>
    </AboutContainer>
  );
};

// Styled Components with enhanced theme awareness and spacing
const AboutContainer = styled.div`
  max-width: 100%;
  overflow-x: hidden;
  font-family: "Inter", sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;

  .hero-content,
  .mission-container,
  .story-container,
  .cta-container {
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const HeroSection = styled.div`
  color: white;
  padding: 140px 20px; /* Increased vertical padding */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.2), transparent);
  }

  @media (max-width: 768px) {
    padding: 100px 20px;
  }

  @media (max-width: 480px) {
    padding: 80px 16px;
  }
`;

// Custom section component that works with theme
const Section = styled.section`
  padding: 90px 24px; /* More consistent padding */
  max-width: 1200px;
  margin: 0 auto;
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 768px) {
    padding: 70px 20px;
  }

  @media (max-width: 480px) {
    padding: 60px 16px;
  }
`;

const StatsSection = styled(Section)`
  text-align: center;
  position: relative;
  padding: 110px 24px; /* Increased vertical padding */
  transition: background-color 0.3s ease;
  box-shadow: 0 -1px 15px rgba(0, 0, 0, 0.05), 0 1px 15px rgba(0, 0, 0, 0.05);

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${(props) =>
      props.theme === "dark"
        ? "linear-gradient(to right, #3b82f6, #60a5fa)"
        : "linear-gradient(to right, #5a73fc, #6bc5f8)"};
    transition: background 0.3s ease;
  }
`;

const Title = styled.h1`
  font-size: 54px; /* Increased size */
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.5px; /* Tighter letter spacing for headings */

  @media (max-width: 768px) {
    font-size: 42px;
  }

  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.h2`
  font-size: 26px; /* Increased size */
  font-weight: 400;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 38px; /* Increased size */
  font-weight: 700;
  margin-bottom: 34px; /* Increased spacing */
  text-align: center;
  transition: color 0.3s ease;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 34px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    font-size: 30px;
    margin-bottom: 26px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.8; /* Increased line height */
  max-width: 900px;
  margin: 0 auto;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 17px;
    line-height: 1.7;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    line-height: 1.6;
  }
`;

// New component for story paragraph break
const StoryBreak = styled.div`
  height: 24px; /* Space between paragraphs */
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    margin-top: 40px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
`;

// Add theme transition to stat card
const StatCard = styled(motion.div)`
  border-radius: 16px;
  padding: 36px 24px; /* Increased padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease, background-color 0.3s ease, border-color 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
`;

const StatIconWrapper = styled.div`
  width: 70px; /* Larger */
  height: 70px; /* Larger */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px; /* More spacing */
  box-shadow: 0 6px 18px rgba(90, 115, 252, 0.3);
  transition: background 0.3s ease;
`;

const StatIcon = styled.div`
  font-size: 34px; /* Larger icon */
  color: white;
`;

const StatNumber = styled.div`
  font-size: 42px; /* Larger */
  font-weight: 800;
  margin-bottom: 12px;
  line-height: 1;
  transition: color 0.3s ease;
`;

const CounterValue = styled(motion.span)`
  display: inline-block;
`;

const StatLabel = styled.div`
  font-size: 17px; /* Slightly larger */
  font-weight: 500;
  transition: color 0.3s ease;
  text-align: center;
`;

const FeatureCards = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 40px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr; /* Single column earlier */
    gap: 24px;
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

// Simplified feature card styling for better mobile experience
const FeatureCard = styled(motion.div)`
  border-radius: 16px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  height: auto; /* Auto height instead of 100% for mobile */
  overflow: visible;
  min-height: unset; /* Remove minimum height constraint */

  @media (max-width: 768px) {
    padding: 24px 18px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    margin-bottom: 5px; /* Add a little extra space between cards */
  }
`;

const FeatureIconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px; /* Reduced spacing for mobile */
  box-shadow: 0 6px 18px rgba(90, 115, 252, 0.3);
  transition: background 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    margin-bottom: 12px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 28px;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const FeatureContent = styled.div`
  width: 100%;
  /* Ensure content doesn't cause overflow */
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const FeatureTitle = styled.h3`
  font-size: 19px;
  font-weight: 600;
  margin-bottom: 14px;
  position: relative;
  padding-bottom: 14px;
  transition: color 0.3s ease;

  @media (max-width: 480px) {
    font-size: 17px;
    margin-bottom: 12px;
    padding-bottom: 12px;
  }
`;

const TitleUnderline = styled.span`
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  border-radius: 3px;
  transition: background 0.3s ease;
`;

const FeatureDescription = styled.p`
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;

  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 1.4;
  }
`;

// Team components - kept for reference but commented out in usage
// ...existing code...

const CTASection = styled.section`
  color: white;
  padding: 90px 24px; /* More consistent padding */
  text-align: center;
  transition: background 0.3s ease;
`;

const CTATitle = styled.h2`
  font-size: 40px; /* Larger */
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 36px;
  }

  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

const CTADescription = styled.p`
  font-size: 22px; /* Larger */
  max-width: 700px;
  margin: 0 auto 36px; /* More space below */
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const CTAButton = styled(motion.button)`
  border: none;
  border-radius: 50px;
  padding: 18px 54px; /* Larger button */
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    padding: 16px 48px;
    font-size: 17px;
  }
`;

export default AboutUs;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal, FaStar, FaAward } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import styled from "styled-components";

// Theme-based colors
const themeColors = {
  light: {
    background: "#f7f8fa",
    card: "#ffffff",
    text: "#333333",
    textLight: "#444444",
    border: "#ececec",
    tagBg: "#111111",
    tagText: "#ffffff",
    badgeColor: "#f0f4ff",
    heading: "#3730a3",
    subheading: "#64748b",
    highlight: "#8b5cf6",
    buttonPrimary: "linear-gradient(90deg, #5a73fc 60%, #6bc5f8 100%)",
    buttonPrimaryHover: "linear-gradient(90deg, #6bc5f8 0%, #5a73fc 100%)",
    buttonText: "#ffffff",
    cardShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    cardBorder: "rgba(90, 115, 252, 0.1)",
  },
  dark: {
    background: "#1a1a2e",
    card: "#2a2a40",
    text: "#e5e7eb",
    textLight: "#b0b0c0",
    border: "#3a3a50",
    tagBg: "#6bc5f8",
    tagText: "#111111",
    badgeColor: "#111827",
    heading: "#e5e7eb",
    subheading: "#9ca3af",
    highlight: "#818cf8",
    buttonPrimary: "linear-gradient(90deg, #5a73fc 60%, #6bc5f8 100%)",
    buttonPrimaryHover: "linear-gradient(90deg, #6bc5f8 0%, #5a73fc 100%)",
    buttonText: "#ffffff",
    cardShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    cardBorder: "#374151",
  },
};

const results = [
  {
    name: "Aarav Sharma",
    achievement: "Topper, Class 10 Board Exams",
    score: "98.6%",
    avatar:
      "https://plus.unsplash.com/premium_photo-1682089892133-556bde898f2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3R1ZGVudCUyMGJveSUyMGluZGlhfGVufDB8fDB8fHww",
    badge: <FaTrophy />,
    badgeColor: "#f59e0b",
    year: "2023",
  },
  {
    name: "Meera Patel",
    achievement: "Gold Medal, Math Olympiad",
    score: "National Rank 1",
    avatar:
      "https://media.istockphoto.com/id/2159138781/photo/portrait-of-smiling-indian-girl-using-laptop-do-thumbs-up-career-opportunities-browsing.webp?a=1&b=1&s=612x612&w=0&k=20&c=RwUwcT2mkSupDy7aJrUm2Ka_X3-FsED_DVxImtbPhJs=",
    badge: <FaMedal />,
    badgeColor: "#eab308",
    year: "2023",
  },
  {
    name: "Rohan Gupta",
    achievement: "NTSE Scholar",
    score: "All India Rank 12",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    badge: <FaStar />,
    badgeColor: "#4f46e5",
    year: "2022",
  },
  // {
  //   name: "Simran Kaur",
  //   achievement: "Coding Competition Winner",
  //   score: "1st Place, CodeFest",
  //   avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  //   badge: <FaAward />,
  //   badgeColor: "#06b6d4",
  //   year: "2022",
  // },
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

const Results = () => {
  const [activeResult, setActiveResult] = useState(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const colors = themeColors[theme] || themeColors.light;

  const renderMobile = () => (
    <ResultsContainer $colors={colors}>
      {/* Decorative Elements */}
      <DecorativeCircle
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <ContentWrapper>
        <motion.h2
          id="results-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <TitleSpan $colors={colors}>
            Student Achievements
            <UnderlineSpan
              $colors={colors}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
          </TitleSpan>
        </motion.h2>

        <SubHeading
          $colors={colors}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          We celebrate our students who have achieved outstanding results
          through dedication and hard work. These accomplishments reflect our
          commitment to excellence in education.
        </SubHeading>

        <MobileResultsGrid>
          {results.map((r, i) => (
            <ResultCard
              key={i}
              $colors={colors}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow: colors.cardShadow,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setActiveResult(i)}
              onMouseLeave={() => setActiveResult(null)}
              role="article"
              aria-label={`${r.name}'s achievement: ${r.achievement}`}
              tabIndex="0"
            >
              <BadgeIcon
                style={{
                  color: r.badgeColor,
                }}
                animate={{
                  rotate: activeResult === i ? [0, 15, 0, -15, 0] : 0,
                  scale: activeResult === i ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              >
                {r.badge}
              </BadgeIcon>

              <YearBadge
                $colors={colors}
                animate={{
                  scale: activeResult === i ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {r.year}
              </YearBadge>

              <AvatarWrapper $colors={colors} $badgeColor={r.badgeColor}>
                <AvatarImage
                  src={r.avatar}
                  alt={r.name}
                  $colors={colors}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${r.name}&background=random`;
                  }}
                />
              </AvatarWrapper>

              <StudentName
                $colors={colors}
                animate={{
                  color: activeResult === i ? r.badgeColor : colors.text,
                }}
                transition={{ duration: 0.3 }}
              >
                {r.name}
              </StudentName>

              <AchievementText $colors={colors}>
                {r.achievement}
              </AchievementText>

              <ScoreBadge
                $colors={colors}
                animate={{
                  scale: activeResult === i ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {r.score}
              </ScoreBadge>
            </ResultCard>
          ))}
        </MobileResultsGrid>

        {/* <ButtonWrapper
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <ActionButton
            href="/results"
            $colors={colors}
            whileHover={{
              scale: 1.05,
              backgroundColor: theme === "dark" ? "#3b82f6" : "#4338ca",
            }}
            whileTap={{ scale: 0.95 }}
          >
            View All Achievements
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </ActionButton>
        </ButtonWrapper> */}
      </ContentWrapper>
    </ResultsContainer>
  );

  if (isMobile) return renderMobile();
  return (
    <ResultsContainer $colors={colors}>
      {/* Decorative Elements */}
      <DecorativeCircle
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
      />

      <ContentWrapper>
        <motion.h2
          id="results-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <TitleSpan $colors={colors}>
            Student Achievements
            <UnderlineSpan
              $colors={colors}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
          </TitleSpan>
        </motion.h2>

        <SubHeading
          $colors={colors}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          We celebrate our students who have achieved outstanding results
          through dedication and hard work. These accomplishments reflect our
          commitment to excellence in education.
        </SubHeading>

        <ResultsGrid>
          {results.map((r, i) => (
            <ResultCard
              key={i}
              $colors={colors}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow: colors.cardShadow,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setActiveResult(i)}
              onMouseLeave={() => setActiveResult(null)}
              role="article"
              aria-label={`${r.name}'s achievement: ${r.achievement}`}
              tabIndex="0"
            >
              <BadgeIcon
                style={{
                  color: r.badgeColor,
                }}
                animate={{
                  rotate: activeResult === i ? [0, 15, 0, -15, 0] : 0,
                  scale: activeResult === i ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              >
                {r.badge}
              </BadgeIcon>

              <YearBadge
                $colors={colors}
                animate={{
                  scale: activeResult === i ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {r.year}
              </YearBadge>

              <AvatarWrapper $colors={colors} $badgeColor={r.badgeColor}>
                <AvatarImage
                  src={r.avatar}
                  alt={r.name}
                  $colors={colors}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${r.name}&background=random`;
                  }}
                />
              </AvatarWrapper>

              <StudentName
                $colors={colors}
                animate={{
                  color: activeResult === i ? r.badgeColor : colors.text,
                }}
                transition={{ duration: 0.3 }}
              >
                {r.name}
              </StudentName>

              <AchievementText $colors={colors}>
                {r.achievement}
              </AchievementText>

              <ScoreBadge
                $colors={colors}
                animate={{
                  scale: activeResult === i ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {r.score}
              </ScoreBadge>
            </ResultCard>
          ))}
        </ResultsGrid>

        {/* <ButtonWrapper
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <ActionButton
            href="/results"
            $colors={colors}
            whileHover={{
              scale: 1.05,
              backgroundColor: theme === "dark" ? "#3b82f6" : "#4338ca",
            }}
            whileTap={{ scale: 0.95 }}
          >
            View All Achievements
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </ActionButton>
        </ButtonWrapper> */}
      </ContentWrapper>
    </ResultsContainer>
  );
};

const ResultsContainer = styled.section`
  background: ${(props) => props.$colors.background};
  min-height: 100vh;
  padding: 80px 0;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;

  @media (max-width: 700px) {
    padding: 28px 0;
  }
`;

const DecorativeCircle = styled(motion.div)`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(90, 115, 252, 0.06);
  top: -100px;
  right: -100px;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
  text-align: center;

  @media (max-width: 700px) {
    max-width: 500px;
    padding: 0 6px;
  }
`;

const TitleSpan = styled.span`
  position: relative;
  display: inline-block;
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 800;
  color: ${(props) => props.$colors.heading};
  transition: color 0.3s ease;

  @media (max-width: 700px) {
    font-size: clamp(1.5rem, 5vw, 2rem);
  }
`;

const UnderlineSpan = styled(motion.span)`
  position: absolute;
  height: 6px;
  background: ${(props) => props.$colors.buttonPrimary};
  bottom: -8px;
  left: 25%;
  right: 25%;
  border-radius: 4px;
  transition: background 0.3s ease;

  @media (max-width: 700px) {
    height: 4px;
    bottom: -6px;
  }
`;

const SubHeading = styled(motion.p)`
  text-align: center;
  color: ${(props) => props.$colors.subheading};
  font-size: clamp(1rem, 2vw, 1.2rem);
  max-width: 700px;
  margin: 0 auto 50px;
  line-height: 1.6;
  transition: color 0.3s ease;

  @media (max-width: 700px) {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    margin: 0 auto 30px;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(16px, 3vw, 30px);
  width: 100%;
`;

const MobileResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  width: 100%;
  align-items: stretch;
  justify-items: center;
`;

const ResultCard = styled(motion.div)`
  background: ${(props) => props.$colors.card};
  border-radius: 20px;
  box-shadow: ${(props) => props.$colors.cardShadow};
  padding: clamp(1.2rem, 2vw, 2.2rem) clamp(0.9rem, 1.5vw, 1.8rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: 1px solid ${(props) => props.$colors.cardBorder};
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${(props) => props.$colors.text};

  @media (max-width: 700px) {
    padding: clamp(0.8rem, 2vw, 1.2rem) clamp(0.6rem, 1.5vw, 1rem);
    width: 100%;
    max-width: 340px;
    min-width: 0;
    box-sizing: border-box;
  }
`;

const BadgeIcon = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 30px;
  opacity: 0.9;
  transform: rotate(0deg);
`;

const YearBadge = styled(motion.div)`
  position: absolute;
  top: 16px;
  left: 16px;
  background: ${(props) => props.$colors.badgeColor};
  color: ${(props) => props.$colors.text};
  padding: 4px 10px;
  font-size: 0.75rem;
  border-radius: 20px;
  font-weight: 500;
  transition: background 0.3s ease, color 0.3s ease;
`;

const AvatarWrapper = styled.div`
  width: 82px;
  height: 82px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(
    135deg,
    ${(props) => props.$badgeColor} 0%,
    ${(props) => props.$colors.highlight} 100%
  );
  margin-bottom: 22px;

  @media (max-width: 700px) {
    width: 62px;
    height: 62px;
    margin-bottom: 16px;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${(props) => props.$colors.card};
  transition: border 0.3s ease;
`;

const StudentName = styled(motion.h3)`
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: ${(props) => props.$colors.text};
  text-align: center;
  transition: color 0.3s ease;

  @media (max-width: 700px) {
    font-size: 1rem;
    margin-bottom: 6px;
  }
`;

const AchievementText = styled.div`
  color: ${(props) => props.$colors.highlight};
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 0.95rem;
  text-align: center;
  transition: color 0.3s ease;

  @media (max-width: 700px) {
    font-size: 0.85rem;
    margin-bottom: 10px;
  }
`;

const ScoreBadge = styled(motion.div)`
  background: ${(props) => props.$colors.background};
  color: ${(props) => props.$colors.heading};
  font-weight: 600;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 1rem;
  margin-top: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: background 0.3s ease, color 0.3s ease;

  @media (max-width: 700px) {
    padding: 6px 12px;
    font-size: 0.9rem;
    margin-top: 6px;
  }
`;

const ButtonWrapper = styled(motion.div)`
  text-align: center;
  margin-top: 50px;
  width: 100%;

  @media (max-width: 700px) {
    margin-top: 30px;
  }
`;

const ActionButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  background: ${(props) => props.$colors.buttonPrimary};
  color: ${(props) => props.$colors.buttonText};
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  font-size: 1.05rem;
  box-shadow: 0 4px 14px rgba(90, 115, 252, 0.2);
  transition: all 0.3s ease;

  @media (max-width: 700px) {
    padding: 10px 24px;
    font-size: 0.95rem;
  }
`;

export default Results;

import React from "react";
import styled from "styled-components";
import {
  FaDownload,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

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
    buttonPrimary: "linear-gradient(90deg, #5a73fc 60%, #6bc5f8 100%)",
    buttonPrimaryHover: "linear-gradient(90deg, #6bc5f8 0%, #5a73fc 100%)",
    buttonText: "#ffffff",
    buttonSecondary: "#ffffff",
    buttonSecondaryText: "#222222",
    buttonBorder: "#d1d5db",
    dotColor: "#5a73fc",
  },
  dark: {
    background: "#1a1a2e",
    card: "#2a2a40",
    text: "#e5e7eb",
    textLight: "#b0b0c0",
    border: "#3a3a50",
    tagBg: "#6bc5f8",
    tagText: "#111111",
    buttonPrimary: "linear-gradient(90deg, #5a73fc 60%, #6bc5f8 100%)",
    buttonPrimaryHover: "linear-gradient(90deg, #6bc5f8 0%, #5a73fc 100%)",
    buttonText: "#ffffff",
    buttonSecondary: "#2a2a40",
    buttonSecondaryText: "#e5e7eb",
    buttonBorder: "#3a3a50",
    dotColor: "#6bc5f8",
  },
};

const programs = [
  {
    id: 1,
    title: "Foundation Builder",
    classes: "Class 5–6",
    description: ["Math, Science, English", "Reading, Writing, Logic"],
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Concept Mastery",
    classes: "Class 7–8",
    description: ["Math, Science, SST", "Weekly tests & revision"],
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Board Excellence",
    classes: "Class 9–10",
    description: ["Full Subject Support", "Test series & mentoring"],
    image:
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Competitive Edge",
    classes: "Olympiad/NTSE/Scholarship",
    description: ["Olympiad, NTSE, Scholarship Prep", "Special doubt sessions"],
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Coding & Digital Skills",
    classes: "All Classes",
    description: ["Scratch, Python, Web Development", "Project-based learning"],
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    title: "Spoken English & Communication",
    classes: "All Classes",
    description: ["Public Speaking, Debates", "Confidence Building"],
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
  },
];

const BROCHURE_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

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

const Programs = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const colors = themeColors[theme] || themeColors.light;

  // Download brochure handler
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = BROCHURE_URL;
    link.download = "Sharpr-Brochure.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Talk to advisor handler
  const handleAdvisor = () => {
    navigate("/contact");
  };

  const isMobile = useIsMobile();

  const renderMobile = () => (
    <ProgramsContainer
      style={{ paddingBottom: 30, background: colors.background }}
    >
      <HeroSection style={{ padding: "30px 8px 18px 8px" }}>
        <HeroIcon style={{ fontSize: 32 }}>👩‍🏫</HeroIcon>
        <HeroTitle style={{ fontSize: "1.5rem", color: colors.text }}>
          Programs We Offer
        </HeroTitle>
        <HeroSubtitle style={{ fontSize: "1rem", color: colors.textLight }}>
          Empowering students with structured, engaging, and effective learning
          programs for every stage.
        </HeroSubtitle>
      </HeroSection>
      <CardsGrid
        style={{
          gridTemplateColumns: "1fr",
          gap: 18,
          maxWidth: 400,
          margin: "20px auto 0 auto",
          padding: "0 6px",
        }}
      >
        {programs.map((program) => (
          <ProgramCard key={program.id} $colors={colors}>
            <ImageWrapper>
              <ProgramImage src={program.image} alt={program.title} />
              <ClassTag $colors={colors}>{program.classes}</ClassTag>
            </ImageWrapper>
            <CardContent>
              <ProgramTitle $colors={colors}>{program.title}</ProgramTitle>
              <ProgramList $colors={colors}>
                {program.description.map((item, idx) => (
                  <li key={idx}>
                    <span className="dot">◆</span> {item}
                  </li>
                ))}
              </ProgramList>
            </CardContent>
          </ProgramCard>
        ))}
      </CardsGrid>
      <Actions style={{ marginTop: 18, gap: 10 }}>
        <ActionButton $colors={colors} onClick={handleDownload}>
          <FaDownload style={{ marginRight: 8 }} />
          Download Brochure
        </ActionButton>
        <ActionButton $colors={colors} primary onClick={handleAdvisor}>
          <FaChalkboardTeacher style={{ marginRight: 8 }} />
          Talk to Academic Advisor
        </ActionButton>
      </Actions>
    </ProgramsContainer>
  );

  if (isMobile) return renderMobile();

  return (
    <ProgramsContainer $colors={colors}>
      <HeroSection>
        <HeroIcon>👩‍🏫</HeroIcon>
        <HeroTitle $colors={colors}>Programs We Offer</HeroTitle>
        <HeroSubtitle $colors={colors}>
          Empowering students with structured, engaging, and effective learning
          programs for every stage.
        </HeroSubtitle>
      </HeroSection>
      <CardsGrid>
        {programs.map((program) => (
          <ProgramCard key={program.id} $colors={colors}>
            <ImageWrapper>
              <ProgramImage src={program.image} alt={program.title} />
              <ClassTag $colors={colors}>{program.classes}</ClassTag>
            </ImageWrapper>
            <CardContent>
              <ProgramTitle $colors={colors}>{program.title}</ProgramTitle>
              <ProgramList $colors={colors}>
                {program.description.map((item, idx) => (
                  <li key={idx}>
                    <span className="dot">◆</span> {item}
                  </li>
                ))}
              </ProgramList>
            </CardContent>
          </ProgramCard>
        ))}
      </CardsGrid>
      <Actions>
        <ActionButton $colors={colors} onClick={handleDownload}>
          <FaDownload style={{ marginRight: 8 }} />
          Download Brochure
        </ActionButton>
        <ActionButton $colors={colors} primary onClick={handleAdvisor}>
          <FaChalkboardTeacher style={{ marginRight: 8 }} />
          Talk to Academic Advisor
        </ActionButton>
      </Actions>
    </ProgramsContainer>
  );
};

const ProgramsContainer = styled.div`
  background: ${(props) =>
    props.$colors ? props.$colors.background : "#f7f8fa"};
  min-height: 100vh;
  padding-bottom: 60px;
  transition: background 0.3s ease;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 60px 20px 30px 20px;
`;

const HeroIcon = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
`;

const HeroTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${(props) => (props.$colors ? props.$colors.text : "#333")};
  transition: color 0.3s ease;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${(props) => (props.$colors ? props.$colors.textLight : "#444")};
  max-width: 600px;
  margin: 0 auto;
  transition: color 0.3s ease;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 36px;
  max-width: 1200px;
  margin: 40px auto 0 auto;
  padding: 0 20px;
`;

const ProgramCard = styled.div`
  background: ${(props) => (props.$colors ? props.$colors.card : "#fff")};
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(90, 115, 252, 0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s, background-color 0.3s;
  border: 1px solid
    ${(props) => (props.$colors ? props.$colors.border : "#ececec")};

  &:hover {
    box-shadow: 0 16px 40px rgba(90, 115, 252, 0.13);
    transform: translateY(-6px) scale(1.02);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
`;

const ProgramImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ClassTag = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: ${(props) => (props.$colors ? props.$colors.tagBg : "#111")};
  color: ${(props) => (props.$colors ? props.$colors.tagText : "#fff")};
  font-size: 1rem;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s, color 0.3s;
`;

const CardContent = styled.div`
  padding: 28px 24px 24px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProgramTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: ${(props) => (props.$colors ? props.$colors.text : "#333")};
  transition: color 0.3s ease;
`;

const ProgramList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 1.08rem;
    color: ${(props) => (props.$colors ? props.$colors.textLight : "#333")};
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    transition: color 0.3s ease;

    .dot {
      color: ${(props) => (props.$colors ? props.$colors.dotColor : "#5a73fc")};
      font-size: 1.1em;
      margin-right: 8px;
      transition: color 0.3s ease;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 40px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: ${({ primary, $colors }) =>
    primary
      ? $colors
        ? $colors.buttonPrimary
        : "linear-gradient(90deg, #5a73fc 60%, #6bc5f8 100%)"
      : $colors
      ? $colors.buttonSecondary
      : "#fff"};
  color: ${({ primary, $colors }) =>
    primary
      ? $colors
        ? $colors.buttonText
        : "#fff"
      : $colors
      ? $colors.buttonSecondaryText
      : "#222"};
  border: ${({ primary, $colors }) =>
    primary
      ? "none"
      : `1.5px solid ${$colors ? $colors.buttonBorder : "#d1d5db"}`};
  border-radius: 8px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ primary, $colors }) =>
    primary
      ? "0 4px 18px rgba(90, 115, 252, 0.13)"
      : "0 2px 8px rgba(90, 115, 252, 0.07)"};
  display: flex;
  align-items: center;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;

  &:hover {
    background: ${({ primary, $colors }) =>
      primary
        ? $colors
          ? $colors.buttonPrimaryHover
          : "linear-gradient(90deg, #6bc5f8 0%, #5a73fc 100%)"
        : $colors
        ? "rgba(0,0,0,0.05)"
        : "#f3f4f6"};
    color: ${({ primary, $colors }) =>
      primary
        ? $colors
          ? $colors.buttonText
          : "#fff"
        : $colors
        ? $colors.buttonSecondaryText
        : "#111"};
    box-shadow: 0 6px 24px rgba(90, 115, 252, 0.15);
  }
`;

export default Programs;

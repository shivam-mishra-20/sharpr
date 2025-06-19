import React from "react";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Theme-based colors that match your existing theme
const themeColors = {
  light: {
    background: "#ffffff",
    text: "#333333",
    textLight: "#444444",
    strikethrough: "#888888",
    highlightBg: "#FFFDE7",
    highlightText: "#111111",
    offerTagBg: "#FFEB3B",
    offerTagText: "#111111",
    border: "#ececec",
    shadow: "rgba(90, 115, 252, 0.1)",
    starColor: "#FFC107",
  },
  dark: {
    background: "#2a2a40",
    text: "#e5e7eb",
    textLight: "#b0b0c0",
    strikethrough: "#8e8ea0",
    highlightBg: "#3a3a50",
    highlightText: "#e5e7eb",
    offerTagBg: "#6bc5f8",
    offerTagText: "#111111",
    border: "#3a3a50",
    shadow: "rgba(0, 0, 0, 0.25)",
    starColor: "#FFC107",
  },
};

const PricingOffer = () => {
  const { theme } = useTheme();
  const colors = themeColors[theme] || themeColors.light;

  return (
    <OfferContainer $colors={colors}>
      <OfferTag $colors={colors}>
        <FaStar style={{ marginRight: "6px" }} /> Limited Offer
      </OfferTag>

      <PriceWrapper>
        <OriginalPrice $colors={colors}>₹3,500/month</OriginalPrice>
        <CurrentPrice $colors={colors}>₹3,000/month</CurrentPrice>
      </PriceWrapper>

      <OfferText $colors={colors}>LIMITED OFFER FOR FEW BATCHES</OfferText>

      <SubtitleText $colors={colors}>
        Quality education at accessible prices
      </SubtitleText>

      <SaveBadge $colors={colors}>Save ₹500/month</SaveBadge>
    </OfferContainer>
  );
};

const OfferContainer = styled.div`
  position: relative;
  background: ${(props) => props.$colors.background};
  border-radius: 16px;
  padding: 32px 24px;
  margin: 40px auto;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 32px ${(props) => props.$colors.shadow};
  border: 1px solid ${(props) => props.$colors.border};
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px ${(props) => props.$colors.shadow};
  }
`;

const OfferTag = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: ${(props) => props.$colors.offerTagBg};
  color: ${(props) => props.$colors.offerTagText};
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 0 16px 0 12px;
  display: flex;
  align-items: center;
  font-size: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const PriceWrapper = styled.div`
  margin-bottom: 16px;
`;

const OriginalPrice = styled.div`
  font-size: 1.5rem;
  color: ${(props) => props.$colors.strikethrough};
  text-decoration: line-through;
  margin-bottom: 8px;
  font-weight: 500;
`;

const CurrentPrice = styled.div`
  font-size: 3rem;
  color: ${(props) => props.$colors.text};
  font-weight: 800;
  line-height: 1.1;
`;

const OfferText = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(props) => props.$colors.text};
  margin: 16px 0 8px;
  letter-spacing: 0.5px;
`;

const SubtitleText = styled.div`
  font-size: 1rem;
  color: ${(props) => props.$colors.textLight};
  margin-bottom: 24px;
`;

const SaveBadge = styled.div`
  background: ${(props) => props.$colors.highlightBg};
  color: ${(props) => props.$colors.highlightText};
  border-radius: 8px;
  padding: 6px 16px;
  display: inline-block;
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: 8px;
`;

export default PricingOffer;

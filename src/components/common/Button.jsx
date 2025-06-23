import React from "react";
import { motion } from "framer-motion";
import { buttonAnimations, colors } from "../../utils/styleConstants";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return { background: colors.primary, color: "white" };
      case "secondary":
        return { background: colors.secondary, color: "white" };
      case "success":
        return { background: colors.success, color: "white" };
      case "danger":
        return { background: colors.danger, color: "white" };
      case "outline":
        return {
          background: "transparent",
          color: colors.primary,
          border: `1px solid ${colors.primary}`,
        };
      default:
        return { background: colors.primary, color: "white" };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { padding: "0.25rem 0.5rem", fontSize: "0.875rem" };
      case "lg":
        return { padding: "0.75rem 1.5rem", fontSize: "1.125rem" };
      default: // md
        return { padding: "0.5rem 1rem", fontSize: "1rem" };
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={disabled ? {} : buttonAnimations.hover}
      whileTap={disabled ? {} : buttonAnimations.tap}
      style={{
        border: "none",
        borderRadius: "0.375rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        width: fullWidth ? "100%" : "auto",
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...props.style,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;

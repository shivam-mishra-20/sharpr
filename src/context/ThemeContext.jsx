import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);

    // Enhanced smooth transitions when theme changes
    document.documentElement.style.transition =
      "background-color 0.7s cubic-bezier(0.4, 0, 0.2, 1), color 0.7s cubic-bezier(0.4, 0, 0.2, 1)";

    // Apply custom transition to all elements for smoother theme toggle
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      * {
        transition: background-color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease !important;
      }
    `;

    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

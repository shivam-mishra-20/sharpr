import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import { useTheme } from "./context/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";

// Animation wrapper for route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: theme === "dark" ? "#121212" : "#ffffff",
          transition: "background 0.3s ease",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "5px solid rgba(0, 0, 0, 0.1)",
            borderTopColor: theme === "dark" ? "#ffffff" : "#0070f3",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: theme === "dark" ? "#121212" : "#f9fafb",
          color: theme === "dark" ? "#ffffff" : "#1f2937",
          transition: "all 0.3s ease",
        }}
      >
        <Navbar />
        <main
          className="flex-grow"
          style={{
            padding: "0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <AnimatedRoutes />
        </main>
        <footer
          style={{
            textAlign: "center",
            padding: "1.5rem",
            background: theme === "dark" ? "#1f2937" : "#f3f4f6",
            borderTop: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
            transition: "all 0.3s ease",
          }}
        >
          <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>
            © {new Date().getFullYear()} SharpR. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

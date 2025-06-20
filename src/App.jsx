import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import Results from "./components/Results";
import Testimonials from "./components/Testimonials";
import Locations from "./components/Locations";
import ParentDashboard from "./pages/ParentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./components/admin/Overview";
import AdminStudents from "./components/admin/Students";
import AdminAttendance from "./components/admin/Attendance";
import AdminHomework from "./components/admin/Homework";
import AdminTestResults from "./components/admin/TestResults";
import AdminFeeManagement from "./components/admin/FeeManagement";
import AdminNotices from "./components/admin/Notices";
import AdminSettings from "./components/admin/Settings";
import AdminHelp from "./components/admin/Help";
import { useTheme } from "./context/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import NotFound from "./pages/404Notfound";
import AdminInquiry from "./components/admin/Inquiry";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized";

// Theme-based colors
const getThemeColors = (theme) => ({
  background: theme === "dark" ? "#121212" : "#f9fafb",
  backgroundSecondary: theme === "dark" ? "#1f2937" : "#f3f4f6",
  text: theme === "dark" ? "#ffffff" : "#1f2937",
  textMuted:
    theme === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
  border: theme === "dark" ? "#374151" : "#e5e7eb",
  primary: theme === "dark" ? "#3b82f6" : "#0070f3",
  spinner: theme === "dark" ? "#ffffff" : "#0070f3",
  spinnerBg:
    theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
});

// Animation wrapper for route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/results" element={<Results />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Parent Routes */}
        <Route element={<ProtectedRoutes allowedRoles={["parent"]} />}>
          <Route path="/parent_dashboard" element={<ParentDashboard />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
          <Route path="/admin_dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="homework" element={<AdminHomework />} />
            <Route path="test-results" element={<AdminTestResults />} />
            <Route path="fee-management" element={<AdminFeeManagement />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="help" element={<AdminHelp />} />
            <Route path="inquiry" element={<AdminInquiry />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

// Update this component
const RootRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            if (role === "admin") {
              setRedirectTo("/admin_dashboard");
            } else if (role === "parent") {
              setRedirectTo("/parent_dashboard");
            } else {
              // Default to home page for unknown roles
              setRedirectTo("/home");
            }
          } else {
            setRedirectTo("/home");
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          setRedirectTo("/home");
        }
      } else {
        // User is not authenticated, go to home page
        setRedirectTo("/home");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            border: "4px solid rgba(0, 0, 0, 0.1)",
            borderTopColor: "#3b82f6",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  return redirectTo ? <Navigate to={redirectTo} replace /> : null;
};

function App() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const colors = getThemeColors(theme);

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
          background: colors.background,
          transition: "background 0.3s ease",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: `5px solid ${colors.spinnerBg}`,
            borderTopColor: colors.spinner,
            animation: "spin 1s linear infinite",
            transition: "border-color 0.3s ease",
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
          background: colors.background,
          color: colors.text,
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
            background: colors.backgroundSecondary,
            borderTop: `1px solid ${colors.border}`,
            transition: "all 0.3s ease",
          }}
        >
          <p style={{ fontSize: "0.875rem", opacity: 0.8, color: colors.text }}>
            © {new Date().getFullYear()} SharpR. All rights reserved.
          </p>
        </footer>

        {/* Add the Chatbot component */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const ProtectedRoutes = ({ allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // This clears browser back/forward cache for this route to prevent back navigation after logout
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, null, window.location.pathname);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Always verify role in Firestore for protected routes
          // Don't rely on session storage for critical auth checks
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            setUser(currentUser);
            // Update timestamp
            sessionStorage.setItem("lastAuthCheck", Date.now().toString());
            sessionStorage.setItem("userRole", userData.role);
          } else {
            // No user document found, sign out
            await auth.signOut();
            sessionStorage.removeItem("lastAuthCheck");
            sessionStorage.removeItem("userRole");
            setUser(null);
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          // Error fetching user data, sign out
          await auth.signOut();
          sessionStorage.removeItem("lastAuthCheck");
          sessionStorage.removeItem("userRole");
          setUser(null);
          setUserRole(null);
        }
      } else {
        sessionStorage.removeItem("lastAuthCheck");
        sessionStorage.removeItem("userRole");
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("popstate", () => {
        window.history.pushState(null, null, window.location.pathname);
      });
    };
  }, []);

  if (loading) {
    // Show loading spinner while checking authentication
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <motion.div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            border: "4px solid rgba(0, 0, 0, 0.1)",
            borderTopColor: "#3b82f6",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Not logged in - redirect to login page
  if (!user) {
    return (
      <Navigate
        to="/signup?forceLogin=true"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  // Check if user has allowed role
  if (!allowedRoles.includes(userRole)) {
    // User doesn't have required role - redirect to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoutes;

import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const ManualAuthRoutes = ({ allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkManualAuth = async () => {
      try {
        // Check localStorage for user details
        const userId = localStorage.getItem("userId");
        const userRole = localStorage.getItem("userRole");

        console.log("Manual Auth Check - User ID:", userId);
        console.log("Manual Auth Check - User Role:", userRole);

        if (!userId || !userRole) {
          console.log("No user credentials in localStorage");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Verify the user exists in Firestore
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          console.log("User document found in Firestore");
          setIsAuthenticated(true);
          setUserRole(userRole);
        } else {
          console.log("No user document found with ID:", userId);
          setIsAuthenticated(false);
          // Clear invalid localStorage data
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
        }
      } catch (error) {
        console.error("Error checking manual authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkManualAuth();
  }, []);

  if (loading) {
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

  // Not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to signup");
    return <Navigate to="/signup?forceLogin=true" replace />;
  }

  // Check role authorization
  if (!allowedRoles.includes(userRole)) {
    console.log("User role not authorized:", userRole);
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  console.log("User authenticated and authorized with role:", userRole);
  return <Outlet />;
};

export default ManualAuthRoutes;

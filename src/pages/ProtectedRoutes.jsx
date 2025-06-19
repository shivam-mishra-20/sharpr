import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ user, allowedRoles }) => {
  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Role not authorized
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ allowedRoles }) => {
  // Check both localStorage and sessionStorage for authentication info
  const userRole =
    localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
  console.log("Protected Route Check - User Role:", userRole);

  // If role exists and is in allowed roles, render the route
  if (userRole && allowedRoles.includes(userRole)) {
    return <Outlet />;
  }

  // Otherwise redirect to login
  return <Navigate to="/signup?forceLogin=true" replace />;
};

export default ProtectedRoutes;

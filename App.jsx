import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./path/to/LoginPage";
import Dashboard from "./path/to/Dashboard";
import Profile from "./path/to/Profile";
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add other protected routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

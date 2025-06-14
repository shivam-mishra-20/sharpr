import React from "react";

const ParentDashboard = () => {
  return (
    <div style={{ minHeight: "100vh", padding: 40, background: "#f7f8fa" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
        Parent Dashboard
      </h1>
      <p>
        Welcome to your dashboard! Here you can view your child's progress,
        assignments, and more.
      </p>
    </div>
  );
};

export default ParentDashboard;

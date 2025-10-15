import React from "react";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome! You have successfully signed up.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

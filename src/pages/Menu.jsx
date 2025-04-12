import { BarChart3, LineChart, Plus, Settings } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css"; // Updated CSS import
import NavBar from "../components/NavBar";

export default function Dashboard() {
  return (
    <>
      <NavBar />
      <div className="menu-container">
        <div className="menu-grid">
          {/* New Rug Card */}
          <Link to="/create" className="card-link">
            <div className="menu-card">
              <div className="icon-container purple">
                <Plus className="icon" />
              </div>
              <h2 className="card-title">New Rug</h2>
              <p className="card-description">Create a new token deployment</p>
            </div>
          </Link>

          {/* Previous Rugs Card */}
          <Link to="/rugHistory" className="card-link">
            <div className="menu-card">
              <div className="icon-container blue">
                <LineChart className="icon" />
              </div>
              <h2 className="card-title">Previous Rugs</h2>
              <p className="card-description">View LIVE deployment history</p>
            </div>
          </Link>

          {/* Statistics Card */}
          <Link to="/about" className="card-link">
            <div className="menu-card">
              <div className="icon-container blue">
                <BarChart3 className="icon" />
              </div>
              <h2 className="card-title">Statistics</h2>
              <p className="card-description">Track your performance</p>
            </div>
          </Link>

          {/* Settings Card */}
          <Link to="/info" className="card-link">
            <div className="menu-card">
              <div className="icon-container blue">
                <Settings className="icon" />
              </div>
              <h2 className="card-title">Bot-info</h2>
              <p className="card-description">how works</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

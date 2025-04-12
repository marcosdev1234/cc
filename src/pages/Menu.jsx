import AddCircleIcon from '@mui/icons-material/AddCircle';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InfoIcon from '@mui/icons-material/Info';
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
        
          <Link to="/create" className="card-link">
            <div className="menu-card">
              <div className="icon-container purple">
                <AddCircleIcon className="icon"/>
              </div>
              <h2 className="card-title">New Rug</h2>
              <p className="card-description">Create a new token deployment</p>
            </div>
          </Link>

        
          <Link to="/rugHistory" className="card-link">
            <div className="menu-card">
              <div className="icon-container blue">
                <AutoGraphIcon className="icon"/>
              </div>
              <h2 className="card-title">Previous Rugs</h2>
              <p className="card-description">View LIVE deployment history</p>
            </div>
          </Link>

         
          <Link to="/about" className="card-link">
            <div className="menu-card">
              <div className="icon-container blue">
                <AssessmentIcon className="icon" />
              </div>
              <h2 className="card-title">Statistics</h2>
              <p className="card-description">Track your performance</p>
            </div>
          </Link>

      
          <Link to="/info" className="card-link">
            <div className="menu-card">
              <div className="icon-container blue">
                <InfoIcon className="icon" />
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

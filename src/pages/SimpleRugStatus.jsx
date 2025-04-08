import React from 'react';
import './SimpleRugStats.css';
import TelegramIcon from '@mui/icons-material/Telegram';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
function SimpleRugStats() {
  return (<>
  <NavBar/>
    <div className="simplerug-container" style={{marginTop:"40px"}}>
      <div className="back-button">
        <Link style={{textDecoration:"none", color:"gray"}} to={"/"}>
        ← Back to token creation
        </Link>
      </div>
      
      <div className="statistics-card">
        <h2>Statistics</h2>
        
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">Total Profit</span>
            <span className="stat-value">0 SOL</span>
          </div>
          
          <div className="stat-box">
            <span className="stat-label">Successful Rugs</span>
            <span className="stat-value">0</span>
          </div>
        </div>
        
        <div className="last-rugs-section">
          <h3>Last Rugs</h3>
          <div className="no-rugs-message">
            No rugs available yet (Create a coin first)
          </div>
        </div>
      </div>
      
      <div className="telegram-channel">
        Telegram Channel <TelegramIcon/>
      </div>
    </div>
    </>
  );
}

export default SimpleRugStats;
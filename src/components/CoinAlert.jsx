import React from 'react';
import './Alert.css';
import close from "../assets/close.png";

function CoinAlert({ onClose, tokenInfo, error, isLoading }) {
  return (
    <>
      <div className="alert-overlay" onClick={onClose} />
      <div className="alert-container">
        <div className="alert-header">
          <h2>{isLoading ? "Procesando..." : tokenInfo ? "¡Token Creado!" : "Error"}</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="alert-content">
          {isLoading ? (
            <>
              <div className="spinner"></div>
              <p>Creating your token, Please wait...</p>
            </>
          ) : tokenInfo ? (
            <>
              <p><strong>Nombre:</strong> {tokenInfo.name}</p>
              <p><strong>Ticker:</strong> {tokenInfo.ticker}</p>
              <p><strong>Mint:</strong> {tokenInfo.mint}</p>
            </>
          ) : (
            <>
              <img src={close} alt="Close icon" />
              <p>{error || "Have a problem."}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CoinAlert;
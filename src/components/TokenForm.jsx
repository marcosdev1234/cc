"use client"

import { useState } from "react";
import "./tokenform.css";

export default function TokenForm({ onSubmit, walletAddress }) {
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    description: "",
    amount: "", // Cambiado de "0" a ""
    image: null,
    twitter: "",
    telegram: "",
    website: "",
  });

  const [selectedPlatform, setSelectedPlatform] = useState("Pump.fun");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!walletAddress) {
      alert("Por favor conecta tu billetera Phantom primero");
      return;
    }
    
    if (!formData.image) {
      alert("Por favor selecciona una imagen");
      return;
    }

    // Validación de amount
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Por favor ingresa una cantidad mayor a 0 SOL");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("ticker", formData.ticker);
    data.append("description", formData.description);
    data.append("amount", formData.amount);
    data.append("image", formData.image);
    data.append("twitter", formData.twitter);
    data.append("telegram", formData.telegram);
    data.append("website", formData.website);
    data.append("platform", selectedPlatform);

    console.log("En TokenForm.jsx - Tipo de data:", data instanceof FormData ? "FormData" : typeof data);
    console.log("Datos enviados al backend:");
    for (const [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    onSubmit(data);
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
  };

  return (
    <form onSubmit={handleSubmit} className="token-form">
      <div className="form-group">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          className="form-input"
          id="name"
          placeholder="Nombre del Token"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="ticker" className="form-label">Ticker</label>
        <input
          className="form-input"
          id="ticker"
          placeholder="Ticker"
          value={formData.ticker}
          onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className="form-textarea"
          id="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="image" className="form-label">Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          className="form-input file-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="website" className="form-label">Website</label>
        <input
          className="form-input"
          id="website"
          placeholder="Website (optional)"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="twitter" className="form-label">Twitter</label>
        <input
          className="form-input"
          id="twitter"
          placeholder="Twitter (optional)"
          value={formData.twitter}
          onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="telegram" className="form-label">Telegram</label>
        <input
          className="form-input"
          id="telegram"
          placeholder="Telegram (optional)"
          value={formData.telegram}
          onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount" className="form-label">Amount (SOL)</label>
        <input
          type="number"
          className="form-input"
          id="amount"
          placeholder="amount to invest (SOL)"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          min="0.0001" // Valor mínimo para evitar 0
          step="0.0001"
        />
      </div>

      <div className="platform-options">
        <div 
          className={`platform-option ${selectedPlatform === "Raydium" ? "active" : ""}`} 
          onClick={() => handlePlatformSelect("Raydium")}
        >
          <span className="platform-icon">🔵</span>
          <span className="platform-name">Raydium</span>
        </div>
        <div 
          className={`platform-option ${selectedPlatform === "Meteora" ? "active" : ""}`} 
          onClick={() => handlePlatformSelect("Meteora")}
        >
          <span className="platform-icon">🟣</span>
          <span className="platform-name mateora">Meteora</span>
        </div>
        <div 
          className={`platform-option ${selectedPlatform === "Pump.fun" ? "active" : ""}`} 
          onClick={() => handlePlatformSelect("Pump.fun")}
        >
          <span className="platform-icon">🟢</span>
          <span className="platform-name">Pump.fun</span>
        </div>
      </div>

      <button type="submit" className="submit-button">Receive your coins</button>

      <p className="info-text">
        You will receive your tokens on your wallet/bundled wallets (next step). We advise $30+ on wallet ($200+ being
        optimal for a Rug Pull on Solana).
      </p>
    </form>
  );
}
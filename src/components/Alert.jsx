import React from 'react';
import './Alert.css';
import close from "../assets/close.png"

function Alert({ onClose }) {
    return (
        <>
            <div className="alert-overlay" onClick={onClose} /> {/* Nuevo overlay */}
            <div className="alert-container">
                <div className="alert-header">
                    <h2>Important information</h2>
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <div className="alert-content">
                    <img src={close} alt="" />
                    <p>As you know, Rug Pulling is not tolerated by Phantom. Thus, our dApp is not approved by Phantom. This is why there is a red message when you want to receive your tokens. To bypass this, all you need is to click on the very low button like in the image below. You will see a video tutorial too.</p>
                </div>
            </div>
        </>
    );
}

export default Alert;
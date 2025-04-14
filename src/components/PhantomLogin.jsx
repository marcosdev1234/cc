import { useState, useEffect } from 'react';
import "./phantomLogin.css";
import plogo from "../assets/logo.svg";

export default function PhantomLogin({ onConnected }) {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana?.isPhantom) {
        const response = await solana.connect();
        const address = response.publicKey.toString();
        console.log('Direction of Phantom:', address); // Depuración
        setWalletAddress(address);
        onConnected(address);
      } else {
        alert('Please Install Phantom');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const { solana } = window;
    if (solana?.isPhantom) {
      solana.connect({ onlyIfTrusted: true })
        .then((response) => {
          const address = response.publicKey.toString();
          console.log('Dirección automática de Phantom:', address); // Depuración
          setWalletAddress(address);
          onConnected(address);
        })
        .catch(() => {
          console.log('No se conectó automáticamente');
        });
    }
  }, [onConnected]);

  return (
    <button onClick={connectWallet} className="button">
      {walletAddress ? `Conectado: ${walletAddress.slice(0, 6)}...` : (
        <div style={{ display: "flex", alignItems: "center", fontWeight: "bold", gap: "9px" }}>
          <img style={{ width: "30px", borderRadius: "50%" }} src={plogo} />
          Login with Phantom
        </div>
      )}
    </button>
  );
}

// src/components/MetaMaskLogin.jsx
import React from 'react';
import Web3 from 'web3';

const MetaMaskLogin = ({ setWalletAddress }) => {
  const connectWallet = async () => {
    try {
      // Verificar si MetaMask está instalado
      if (!window.ethereum) {
        alert('Por favor instala MetaMask');
        return;
      }

      // Verificar si es MetaMask específicamente (evitar otras billeteras)
      if (!window.ethereum.isMetaMask) {
        alert('Detectada una extensión incompatible. Usa MetaMask.');
        return;
      }

      // Crear instancia de Web3
      const web3 = new Web3(window.ethereum);

      // Intentar conectar
      console.log('Solicitando conexión a MetaMask...');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();

      if (accounts.length === 0) {
        throw new Error('No se encontraron cuentas. Asegúrate de que MetaMask esté desbloqueado.');
      }

      console.log('MetaMask conectado, dirección:', accounts[0]);
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error('Error conectando MetaMask:', error);
      let errorMessage = 'Error al conectar con MetaMask';
      if (error.message.includes('Requested resource not available')) {
        errorMessage = 'MetaMask no está disponible. Desbloquea MetaMask o verifica la extensión.';
      } else if (error.message.includes('User rejected')) {
        errorMessage = 'Conexión rechazada por el usuario.';
      }
      alert(errorMessage);
    }
  };

  return (
    <button onClick={connectWallet} style={{marginLeft:"30px"}}  className="button">
          <div style={{ display: "flex", alignItems: "center", fontWeight: "bold", gap: "9px" }}>
                  <img style={{ width: "30px", borderRadius: "50%" }} src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png"} />
                  Connect with MetaMask
                </div>
    </button>
  );
};

export default MetaMaskLogin;

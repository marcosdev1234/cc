import React, { useState, useEffect } from 'react';
import './CoinDisplay.css';

const CoinDisplay = () => {
  // Datos de ejemplo
  const coinNames = [
    'Spartans of Vian',
    'Lords of Nebula',
    'Crypto Dragons',
    'Moon Raiders',
    'Starship Toks',
  ];
  const creators = ['7pQqYh', 'xK9mPz', 'aB2vLn', 'jH5tRw', 'qT8nYk'];
  const backgrounds = [
    'linear-gradient(45deg, #030408,#0D0E29)',
    'linear-gradient(45deg, #45b7d1, #0A1023)',
    'linear-gradient(45deg, #6645ED, #778beb)',
    'linear-gradient(45deg,rgb(29, 17, 89),rgb(28, 45, 66))',
    'linear-gradient(45deg, #010304,#784BEE)',
  ];

  // Estados
  const [coinName, setCoinName] = useState('');
  const [creator, setCreator] = useState('');
  const [background, setBackground] = useState('');
  const [memeImage, setMemeImage] = useState('');

  // Función para obtener valores aleatorios
  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  // Función para actualizar todo sincrónicamente
  const updateDisplay = async () => {
    try {
      // Obtener datos del meme
      const response = await fetch('https://meme-api.com/gimme');
      const data = await response.json();

      // Actualizar todos los estados al mismo tiempo
      setCoinName(getRandomItem(coinNames));
      setCreator(getRandomItem(creators));
      setBackground(getRandomItem(backgrounds));
      setMemeImage(data.url);
    } catch (error) {
      console.error('Error fetching meme:', error);
      setCoinName(getRandomItem(coinNames));
      setCreator(getRandomItem(creators));
      setBackground(getRandomItem(backgrounds));
      setMemeImage('https://via.placeholder.com/150'); // Fallback
    }
  };

  // Configurar intervalo con useEffect
  useEffect(() => {
    // Actualizar inmediatamente al montar
    updateDisplay();

    // Actualizar cada 0.5 segundos
    const interval = setInterval(updateDisplay, 1500);

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="coin-display" style={{ background }}>
     
      <div className="text-container">
        <span className="coin-name">{coinName}</span>
        <span> created by </span>
        <span className="creator">{creator}</span>
        {memeImage && <img src={memeImage} alt="Random Meme" className="meme-image" />}
      </div>
    </div>
  );
};

export default CoinDisplay;
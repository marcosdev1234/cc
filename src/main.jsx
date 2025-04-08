import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer'; // Importar Buffer
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// Hacer Buffer disponible globalmente antes de cualquier otra cosa
window.Buffer = window.Buffer || Buffer;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
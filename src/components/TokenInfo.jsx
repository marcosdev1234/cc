import { useState } from 'react';

export default function TokenInfo({ token }) {
  const [botAmount, setBotAmount] = useState('');

  const handleBotActivation = () => {
    console.log(`Activando bots con ${botAmount} SOL`);
    // Aquí iría la lógica de los bots (pendiente de implementación)
  };

  const handleWithdraw = () => {
    console.log('Retirando ganancias');
    // Aquí iría la lógica de retiro (pendiente de implementación)
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="text-xl">¡Token Creado!</h2>
      <p><strong>Nombre:</strong> {token.name}</p>
      <p><strong>Ticker:</strong> {token.ticker}</p>
      <p><strong>Descripción:</strong> {token.description}</p>
      <p><strong>Mint:</strong> {token.mint}</p>
      <p><strong>Enlace:</strong> <a href={token.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{token.link}</a></p>
      <p><strong>Transacción:</strong> <a href={`https://solscan.io/tx/${token.signature}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Ver en Solscan</a></p>
      
      <div className="mt-4">
        <h3>Gestión de Bots</h3>
        <input
          type="number"
          placeholder="Cantidad de SOL para bots"
          value={botAmount}
          onChange={(e) => setBotAmount(e.target.value)}
          className="rounded-md border p-2 mr-2"
        />
        <button
          onClick={handleBotActivation}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Activar Bots
        </button>
      </div>
      
      <button
        onClick={handleWithdraw}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Retirar Ganancias
      </button>
    </div>
  );
}
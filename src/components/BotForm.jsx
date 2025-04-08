import React, { useState } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import "./BotForm.css"
import DeleteIcon from '@mui/icons-material/Delete';


const BotForm = () => {
  const initialBots = [
    { name: "Bot 1 Address:", address: "4jXtg922Hz9H51E5jqEwJ8HpGQdCpX8f4CZ0ZAS1YQ5yQ" },
    { name: "Bot 2 Address:", address: "eWhJxnRdcjVhYPLKGniLVW5tfoS6LQ43Uw432374MrDD" },
    { name: "Bot 3 Address:", address: "Ans2hACwuksFxgBPVsmE8LTXduqr3vq6644UjLRJVUq96" },
    { name: "Bot 4 Address:", address: "J4T5CNd6ScNkmGaeQQeVPenfAHU6u3332ZMZRakcoEqC" },
    { name: "Bot 5 Address:", address: "5QoZ5K2vEsd9Bwk1cjZqQuY2ZpL8tigSHaxAM66HfmUz" },
  ];

  const [bots, setBots] = useState([initialBots[0]]); // Inicializa con el primer bot
  const [availableBots, setAvailableBots] = useState(initialBots.slice(1)); // Bots disponibles para agregar

  const addBot = () => {
    if (availableBots.length > 0) {
      setBots([...bots, availableBots[0]]);
      setAvailableBots(availableBots.slice(1));
    }
  };

  const removeBot = (index) => {
    if (index > 0) { // No permite eliminar el primer bot
      const removedBot = bots[index];
      const newBots = bots.filter((_, i) => i !== index);
      setBots(newBots);
      setAvailableBots([...availableBots, removedBot]);
    }
  };

  return (
    <div>
      <div className="form-group">
        {bots.map((bot, index) => (
          <div key={bot.address}>
            <label htmlFor={`ticker-${index}`} className="form-label">
              {bot.name}
            </label>
            <div style={{display:'flex', gap:'5px'}}>
              <input
                className="form-input"
                id={`ticker-${index}`}
                value={bot.address}
                disabled
              />
              {index > 0 && (
                <button  className="deleteBotButton" type="button" onClick={() => removeBot(index)}>
                 <DeleteIcon/>
                </button>
              )}
            </div>
          </div>
        ))}
        {availableBots.length > 0 && (
          <button className="botButton" type="button" onClick={addBot}>
            <AddCircleIcon/>
          </button>
        )}
      </div>
    </div>
  );
};

export default BotForm;


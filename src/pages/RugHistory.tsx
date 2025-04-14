import React, { useState, useEffect } from 'react';
import './rugHistory.css';
import NavBar from '../components/NavBar';

interface RunItem {
  imageUrl: string;
  title: string;
  subtitle: string;
  percentage: string;
  isPositive: boolean;
}

export default function RugHistory() {
  const coinNames = [
    "Spartans of Vian",
    "Lords of Nebula",
    "Crypto Dragons",
    "Moon Raiders",
    "Starship Toks",
    "MemeLordz",
    "Dogezilla",
    "ShibaRocket",
    "CryptoCatz",
    "MoonMuncher",
    "GiggleBits",
    "WoofWallet",
    "TrollToken",
    "PawPatrolCoin",
    "LOLCoinz",
    "StonkShiba",
    "YeetYacht",
    "HODLPuppy",
    "MeowMillion",
    "ZoomerZest",
    "RektRaccoon",
    "ToTheMoonies",
    "BarkBuck",
    "FluffyFrenzy",
    "WagWagCoin",
    "MemeMogul",
    "ChonkChart",
    "PurrProfit",
    "DerpDollars",
    "BloopBloop",
    "SnoozeCoin",
    "GobbleGains",
    "WhaleWinks",
    "PawPawPop",
    "ZoomZoomZap",
    "CryptoClown",
    "MunchMeme",
    "BoopBux",
    "WoofelWaffle",
    "TikTokToken",
    "BananaBark",
    "SillyShiba",
    "GrumpyGains",
    "ChillChimp",
    "MeowMania",
    "RuffRiser",
    "GiggleGecko",
    "ZanyZebra",
    "MemeMunch",
    "PuddlePaws",
    "BarkBonanza",
    "CryptoCraze",
    "WagWinners",
    "DoodleDime",
    "SnickerSnack",
    "PawPalooza",
    "MoonMeower",
    "ZippyZap",
    "BloopBark",
    "ChonkChamp",
    "WoofWombo",
    "TickleToken",
    "ShibaShenanigans",
    "GlitterGains",
    "PurrPals",
    "BounceBuck",
    "CryptoCorgi",
    "MemeMaverick",
    "WackyWallet",
    "SnootSnooze",
    "BoopBounty",
    "ZestZinger",
    "PawPocalypse",
    "RuffRumble",
    "ChuckleCoin",
    "GrokGiggles",
    "MoonMutt",
    "WoofWarden",
    "BarkBlitz",
    "PuddleProfit",
    "SillyStonk",
    "MeowMischief",
    "CryptoCrumpet",
    "WagWaffle",
    "ZanyZoomer",
    "PawPunch",
    "BloopBoom",
    "ShibaSpark",
    "GiggleGuru",
    "RektRover",
    "MemeMitten",
    "ChonkChaser",
    "WoofWrangle",
    "PurrPioneer",
    "BarkBounty",
    "CryptoCackle",
    "SnoozeStash",
    "BoopBlastoff",
    "WagWiz",
    "MoonMerriment",
    "PawParade",
    "ChuckleChow",
    "RuffRocket"
  ];



  // Estados con valores iniciales desde localStorage
  const [lastRuns, setLastRuns] = useState<RunItem[]>([]);
  const [totalProfit, setTotalProfit] = useState(() => {
    const savedProfit = localStorage.getItem('totalProfit');
    return savedProfit ? parseInt(savedProfit, 10) : 13047;
  });
  const [successfulRuns, setSuccessfulRuns] = useState(() => {
    const savedRuns = localStorage.getItem('successfulRuns');
    return savedRuns ? parseInt(savedRuns, 10) : 66;
  });
  const [showArrow, setShowArrow] = useState(false);
  const [usedCoinNames, setUsedCoinNames] = useState<string[]>(() => {
    const savedUsedCoins = localStorage.getItem('usedCoinNames');
    return savedUsedCoins ? JSON.parse(savedUsedCoins) : [];
  });

  // Función para guardar en localStorage
  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Función para obtener una imagen de la API
  const fetchMemeImage = async (): Promise<string> => {
    try {
      const response = await fetch('https://meme-api.com/gimme');
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error fetching meme:', error);
      return 'https://via.placeholder.com/150';
    }
  };

  // Función para generar un porcentaje aleatorio (solo positivo)
  const generateRandomPercentage = (): { percentage: string; isPositive: boolean } => {
    const value = (Math.random() * 10).toFixed(2);
    return { percentage: `+${value}%`, isPositive: true };
  };

  // Función para generar un nuevo item
  const generateNewRunItem = async (): Promise<RunItem | null> => {
    const availableCoins = coinNames.filter((name) => !usedCoinNames.includes(name));
    if (availableCoins.length === 0) {
      setUsedCoinNames([]);
      saveToLocalStorage('usedCoinNames', []);
      return null;
    }

    const selectedCoin = availableCoins[Math.floor(Math.random() * availableCoins.length)];
    const imageUrl = await fetchMemeImage();
    const { percentage, isPositive } = generateRandomPercentage();

    setUsedCoinNames((prev) => {
      const newUsedCoins = [...prev, selectedCoin];
      saveToLocalStorage('usedCoinNames', newUsedCoins);
      return newUsedCoins;
    });

    return {
      imageUrl,
      title: selectedCoin,
      subtitle: 'SOL',
      percentage,
      isPositive,
    };
  };

  // Función para actualizar lastRuns, totalProfit y successfulRuns
  const updateRuns = async () => {
    const newRun = await generateNewRunItem();
    if (!newRun) return;

    // Incrementar totalProfit (entre 1 y 5 SOL)
    const increment = Math.floor(Math.random() * 5) + 1;
    setTotalProfit((prev) => {
      const newTotal = prev + increment;
      saveToLocalStorage('totalProfit', newTotal);
      return newTotal;
    });

    // Incrementar successfulRuns
    setSuccessfulRuns((prev) => {
      const newRuns = prev + 1;
      saveToLocalStorage('successfulRuns', newRuns);
      return newRuns;
    });

    // Mostrar flecha y ocultarla después de 1 segundo
    setShowArrow(true);
    setTimeout(() => setShowArrow(false), 1000);

    // Actualizar la lista
    setLastRuns((prevRuns) => {
      const updatedRuns = [newRun, ...prevRuns.slice(0, 2)];
      return updatedRuns;
    });
  };

  // Configurar intervalo con useEffect
  useEffect(() => {
    const initializeRuns = async () => {
      const initialRuns: RunItem[] = [];
      for (let i = 0; i < 3; i++) {
        const run = await generateNewRunItem();
        if (run) initialRuns.push(run);
      }
      setLastRuns(initialRuns);
    };

    initializeRuns();

    const interval = setInterval(updateRuns, 60000); // Actualizar cada 1 minuto (60000 ms)

    return () => clearInterval(interval);
  }, []);

  // Formatear totalProfit
  const formattedTotalProfit = totalProfit.toLocaleString();

  return (
    <>
      <NavBar />
      <div className="dashboard__banner">
        <h4>Everything our users have earned by rugpulling innocent people 🚀</h4>
      </div>
      <div className="dashboard">
        <div className="dashboard-grid">
          <div className="card cardMove profit-card">
            <div className="card-label">Total Profit</div>
            <div className="card-value">
              {formattedTotalProfit} SOL
              {showArrow && <span className="profit-arrow">↑</span>}
            </div>
          </div>
          <div className="card cardMove runs-card">
            <div className="card-label">Successful Rugs</div>
            <div className="card-value">{successfulRuns}</div>
          </div>
        </div>

        <div className="card last-runs-card">
          <div className="card-label">Last Rugs</div>
          <div className="runs-list">
            {lastRuns.map((run, index) => (
              <div className="run-item" key={index}>
                <div className="run-icon">
                  <img src={run.imageUrl} alt="Meme" className="icon-image" />
                </div>
                <div className="run-details">
                  <div className="run-title">{run.title}</div>
                  <div className="run-subtitle">{run.subtitle}</div>
                </div>
                <div className={`run-percentage ${run.isPositive ? 'positive' : 'negative'}`}>
                  {run.percentage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

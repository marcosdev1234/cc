import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import "./TradingChart.css"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
const MemecoinChart = () => {
  const chartRef = useRef(null);
  const [currentPrice, setCurrentPrice] = useState(0.001); // Precio inicial

  const [chartOptions, setChartOptions] = useState({
    chart: {
      animation: false,
      height: 300,
      width: 600,
      backgroundColor: "#000000", // Fondo negro
    },
    accessibility: { enabled: false }, // Desactivar advertencia de accesibilidad
    rangeSelector: { enabled: false },
    navigator: { enabled: false },
    scrollbar: { enabled: false },
    title: { text: null },
    xAxis: {
      visible: false, // Sin eje X
      type: "linear", // Escala lineal
      ordinal: false, // Sin gaps
      minPadding: 0,
      maxPadding: 0,
      gapGridLineWidth: 0,
    },
    yAxis: {
      title: { text: null },
      labels: {
        format: "{value:.6f}",
        style: { color: "#FFFFFF" }, // Etiquetas blancas
      },
      gridLineColor: "#333333", // Cuadrícula sutil
    },
    plotOptions: {
      candlestick: {
        pointWidth: 4, // Ancho pequeño
        pointPadding: 0, // Sin espacio entre velas
        groupPadding: 0, // Sin espacio entre grupos
        upColor: "#26a69a", // Verde para subidas
        color: "#ef5350", // Rojo para bajadas
        lineColor: "#FFFFFF", // Mechas blancas
        upLineColor: "#FFFFFF", // Mechas blancas en subidas
        lineWidth: 1, // Grosor de las mechas
      },
    },
    series: [
      {
        type: "candlestick",
        name: "Memecoin",
        data: [
          {
            x: 0,
            open: 0.001,
            high: 0.001,
            low: 0.001,
            close: 0.001,
          },
        ],
        lastPrice: {
          enabled: true,
          label: {
            enabled: true,
            backgroundColor: "gray",
            style: { color: "white" },
          },
        },
      },
    ],
    tooltip: { enabled: false },
  });

  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (!chart) return;

    // Inicializar el rango del eje X
    chart.xAxis[0].setExtremes(-20, 5);

    // Actualizar dentro del minuto
    const updateWithinMinute = () => {
      const series = chart.series[0];
      if (!series || !series.data.length) return; // Evitar errores si no hay datos

      const lastCandle = series.data[series.data.length - 1];
      const randomMove = (Math.random() - 0.5) * 0.2; // Variación ±10%
      const newClose = lastCandle.close * (1 + randomMove);
      const newHigh = Math.max(lastCandle.high, lastCandle.close, newClose);
      const newLow = Math.min(lastCandle.low, lastCandle.close, newClose);

      console.log("Updating within minute - New Close:", newClose);

      lastCandle.update({
        high: newHigh,
        low: newLow,
        close: newClose,
      });
      setCurrentPrice(newClose);
    };

    // Añadir nueva vela cada minuto
    const addNewCandle = () => {
      const series = chart.series[0];
      if (!series || !series.data.length) return; // Evitar errores si no hay datos

      const lastCandle = series.data[series.data.length - 1];
      const newTime = lastCandle.x + 1; // Incremento lineal
      const randomMove = (Math.random() - 0.5) * 0.2; // Variación ±10%
      const newClose = lastCandle.close * (1 + randomMove);
      const newCandle = {
        x: newTime,
        open: lastCandle.close,
        high: Math.max(lastCandle.close, newClose),
        low: Math.min(lastCandle.close, newClose),
        close: newClose,
      };

      console.log("Adding new candle - New Close:", newClose);

      series.addPoint(newCandle, true, false);
      chart.xAxis[0].setExtremes(newTime - 20, newTime + 5); // Mantener 25 velas visibles
      setCurrentPrice(newClose);
    };

    // Iniciar intervalos
    const withinMinuteInterval = setInterval(updateWithinMinute, 5000);
    const newCandleInterval = setInterval(addNewCandle, 60000);

    // Limpiar intervalos al desmontar
    return () => {
      clearInterval(withinMinuteInterval);
      clearInterval(newCandleInterval);
    };
  }, []); // Ejecutar solo al montar

  return (
    <div>
      <h5 style={{ color: "#FFFFFF" , fontSize:"15px",marginTop:"15px"}}>
        Price: {currentPrice.toFixed(6)} USDT
      </h5>
      <div className="chart">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={chartOptions}
        ref={chartRef}
      />
      </div>
    <div className="buttonGraphOptions">
      <button> <AttachMoneyIcon sx={{fontSize:"20px"}}/> Add more </button>
      <button> <CurrencyExchangeIcon/> RugPull Execute </button>
      </div>
    </div>
  );
};

export default MemecoinChart;

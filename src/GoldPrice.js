import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const GoldPrice = () => {
  const [priceLive, setPriceLive] = useState(null);
  const [priceBitcoin, setPriceBitcoin] = useState(null);
  const [previousPriceGold, setPreviousPriceGold] = useState(null); // Stato per il prezzo precedente dell'oro
  const [previousPriceBitcoin, setPreviousPriceBitcoin] = useState(null); // Stato per il prezzo precedente del Bitcoin
  const [loadingGold, setLoadingGold] = useState(true);
  const [loadingBitcoin, setLoadingBitcoin] = useState(true);
  const [weights, setWeights] = useState({
    "24K": 0,
    "22K": 0,
    "18K": 0,
    "14K": 0,
    "9K": 0,
    "8K": 0,
  });

  useEffect(() => {
    const fetchPriceGold = () => {
      axios.get('http://192.168.1.157:8080/api/gold/goldprice')
        .then(response => {
          const newPrice = response.data.priceLive;
          if (newPrice !== priceLive) {
            setPreviousPriceGold(priceLive); // Aggiorna il precedente prezzo dell'oro
            setPriceLive(newPrice);
          }
          setLoadingGold(false);
        })
        .catch(error => {
          console.error('Errore nel caricamento del prezzo dell\'oro:', error);
          setLoadingGold(false);
        });
    };

    const fetchPriceBitcoin = () => {
      axios.get('http://192.168.1.157:8080/api/gold/bitcoin')
        .then(response => {
          const newPrice = response.data.priceBitcoin;
          if (newPrice !== priceBitcoin) {
            setPreviousPriceBitcoin(priceBitcoin); // Aggiorna il precedente prezzo del Bitcoin
            setPriceBitcoin(newPrice);
          }
          setLoadingBitcoin(false);
        })
        .catch(error => {
          console.error('Errore nel caricamento del prezzo del Bitcoin:', error);
          setLoadingBitcoin(false);
        });
    };

    fetchPriceGold();
    fetchPriceBitcoin();

    const intervalGold = setInterval(fetchPriceGold, 5000);
    const intervalBitcoin = setInterval(fetchPriceBitcoin, 5000);

    return () => {
      clearInterval(intervalGold);
      clearInterval(intervalBitcoin);
    };
  }, [priceLive, priceBitcoin]); // Dipendenze per ricalcolare quando i prezzi cambiano

  if (loadingGold || loadingBitcoin) {
    return (
      <div className="container mt-5">
        <h3>Caricamento dei prezzi...</h3>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Funzione per calcolare la variazione percentuale
  const getPercentageChange = (newPrice, oldPrice) => {
    if (oldPrice === null || oldPrice === 0) return '0.00'; // Gestisci il primo caricamento o valore null
    return (((newPrice - oldPrice) / oldPrice) * 100).toFixed(2);
  };

  // Funzione per determinare il colore e l'icona della freccia
  const getColorAndArrow = (newPrice, oldPrice) => {
    if (oldPrice === null) return { color: 'text-success', arrow: '' }; // Primo caricamento
    if (newPrice > oldPrice) return { color: 'text-success', arrow: '▲' }; // Verde su
    if (newPrice < oldPrice) return { color: 'text-danger', arrow: '▼' }; // Rosso giù
    return { color: 'text-warning', arrow: '' }; // Nessuna variazione
  };

  const { color, arrow } = getColorAndArrow(priceLive, previousPriceGold);
  const { color: colorBitcoin, arrow: arrowBitcoin } = getColorAndArrow(priceBitcoin, previousPriceBitcoin);
  const goldPrices = {
    "24K": priceLive,
    "22K": (priceLive * 0.916).toFixed(2),
    "18K": (priceLive * 0.750).toFixed(2),
    "14K": (priceLive * 0.585).toFixed(2),
    "9K": (priceLive * 0.375).toFixed(2),
    "8K": (priceLive * 0.333).toFixed(2),
  };

  // Funzione per calcolare il prezzo in base al peso e al valore dell'oro
  const calculatePrice = (price, weight) => {
    if (isNaN(price) || isNaN(weight)) return 0; // Assicurati che entrambi i valori siano numerici
    return price * weight;
  };

  // Funzione per sommare i prezzi
  const getTotalPrice = (weights) => {
    return Object.keys(weights)
      .map(key => calculatePrice(parseFloat(goldPrices[key]), weights[key])) // Calcola il prezzo per ogni tipo di oro
      .reduce((acc, curr) => acc + curr, 0); // Somma tutti i risultati
  };

  const totalPrice = getTotalPrice(weights);

  // Gestire il cambiamento del peso
  const handleWeightChange = (carat, value) => {
    setWeights(prevWeights => ({
      ...prevWeights,
      [carat]: parseFloat(value) || 0, // Imposta il valore come numero, se non è valido imposta a 0
    }));
  };

  return (
    <div className="container mt-5">
<h2 className="text-center">🌟 Prezzo Oro in Tempo Reale 🌟 </h2>
<div className="marquee-container">
  <div className="marquee">
    <span class="badge text-bg-success">Sterlina oro : {(priceLive * 7.32).toFixed(2)}€</span>&nbsp;
    <span class="badge text-bg-success">Ducato oro : {(priceLive * 3.45).toFixed(2)} €</span>&nbsp;
    <span class="badge text-bg-success">Marengo Francese 20 : {(priceLive * 5.8).toFixed(2)} €</span>&nbsp;
    <span class="badge text-bg-success">Marengo Francese 40 : {(priceLive * 11.6).toFixed(2)} €</span>&nbsp;
    <span class="badge text-bg-success">Marengo Francese 100 : {(priceLive * 29.03).toFixed(2)} €</span>&nbsp;
    <span class="badge text-bg-success">4 Ducato oro : {(priceLive * 16.76).toFixed(2)} €</span>&nbsp;
</div></div>

      <h1>
        Prezzo dell'Oro 24k (un'oncia Troy): 
        <span className={`ms-2 ${color}`}>
          {(priceLive * 31.10).toFixed(2)} Euro {arrow && <span>{arrow}</span>}
        </span>
        {previousPriceGold !== null && (
          <span className="ms-2">
            ({getPercentageChange(priceLive, previousPriceGold)}%)
          </span>
        )}
      </h1>

      <h1>
        Prezzo del Bitcoin: 
        <span className={`ms-2 ${colorBitcoin}`}>
          {priceBitcoin.toFixed(3)} USD {arrowBitcoin && <span>{arrowBitcoin}</span>}
        </span>
        {previousPriceBitcoin !== null && (
          <span className="ms-2">
            ({getPercentageChange(priceBitcoin, previousPriceBitcoin)}%)
          </span>
        )}
      </h1>

      <table className="table table-bordered">
        <thead>
          <tr><th colSpan={6} className="text-center"><h1>Gold Price in Euro</h1></th></tr>
          <tr className="table-info">
            <th>24K</th>
            <th>22K</th>
            <th>18K</th>
            <th>14K</th>
            <th>9K</th>
            <th>8K</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-dark">
            {Object.values(goldPrices).map((price, index) => (
              <td key={index}>{price}</td>
            ))}
          </tr>
          <tr>
            <td colSpan={6}>
              <div className="row">
                {Object.keys(goldPrices).map((carat, index) => (
                  <div className="col" key={index}>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder={`Peso ${carat} (grammi)`}
                      value={weights[carat]} 
                      onChange={(e) => handleWeightChange(carat, e.target.value)} 
                    />
                    <small className="text-muted">{carat}</small>
                  </div>
                ))}
              </div>
            </td>
          </tr>
          <tr className="table-success">
            {Object.keys(goldPrices).map((carat, index) => (
              <td key={index}>
                {(calculatePrice(parseFloat(goldPrices[carat]), weights[carat])).toFixed(2)} €
              </td>
            ))}
          </tr>
          <tr>
            <td colSpan={6}>
              <h4 className="text-center">Totale: {(totalPrice).toFixed(2)} €</h4>
            </td>
          </tr>
        </tbody>
      </table>
      <h3 className="text-center">
  <span style={{ color: 'blue' }}>$</span> SamerSoft Corporation <span style={{ color: 'blue' }}>$</span>
</h3><h6 className="text-center">samerbakhit@hotmail.com</h6>


    </div>
  );
};

export default GoldPrice;

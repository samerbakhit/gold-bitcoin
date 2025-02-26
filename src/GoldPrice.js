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

  return (
    <div className="container mt-5">
      <h1>
        Prezzo dell'Oro 24k: 
        <span className={`ms-2 ${color}`}>
          {priceLive.toFixed(2)} USD {arrow && <span>{arrow}</span>}
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

      <div>
        <h3>Sterlina oro costa : 
          <span className={`ms-2 ${color}`}>
            {(priceLive * 0.916 * 7.98).toFixed(2)} USD
          </span>
          <span>{arrow}</span>
        </h3>
      </div>
    </div>
  );
};

export default GoldPrice;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const GoldPrice = () => {
  const [priceLive, setPriceLive] = useState(null);
  const [priceBitcoin, setPriceBitcoin] = useState(null);
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
      axios.get('https://samersoft-fkavgddvc9bmhycj.northeurope-01.azurewebsites.net/api/gold/goldprice')
        .then(response => {
          setPriceLive(response.data.priceLive);
          setLoadingGold(false);
        })
        .catch(error => {
          console.error('Errore nel caricamento del prezzo dell\'oro:', error);
          setLoadingGold(false);
        });
    };

    const fetchPriceBitcoin = () => {
      axios.get('https://samersoft-fkavgddvc9bmhycj.northeurope-01.azurewebsites.net/api/gold/bitcoin')
        .then(response => {
          setPriceBitcoin(response.data.priceBitcoin);
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
  }, []);

  if (loadingGold || loadingBitcoin) {
    return (
      <div className="container mt-5">
        <h3>Caricamento dei prezzi...</h3>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const goldPrices = {
    "24K": priceLive,
    "22K": (priceLive * 0.916).toFixed(2),
    "18K": (priceLive * 0.750).toFixed(2),
    "14K": (priceLive * 0.585).toFixed(2),
    "9K": (priceLive * 0.375).toFixed(2),
    "8K": (priceLive * 0.333).toFixed(2),
  };

  const handleWeightChange = (carat, value) => {
    setWeights(prev => ({ ...prev, [carat]: value }));
  };

  return (
    <div className="container mt-5">
      <h1>Prezzo dell'Oro 24k (un'oncia Troy): {(priceLive * 31.10).toFixed(2)} Euro</h1>
      <h1>Prezzo del Bitcoin: {priceBitcoin.toFixed(3)} USD</h1>

      <table className="table table-striped table-dark">
        <thead>
          <tr>
            <th>Caratura</th>
            <th>Prezzo per grammo (€)</th>
            <th>Peso (grammi)</th>
            <th>Totale (€)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(goldPrices).map((carat, index) => (
            <tr key={index} className="table-info">
              <td>{carat}</td>
              <td>{goldPrices[carat]}</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={weights[carat]}
                  onChange={(e) => handleWeightChange(carat, e.target.value)}
                />
              </td>
              <td>{(goldPrices[carat] * weights[carat]).toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GoldPrice;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap'; // Importa il componente Spinner


//{[0.916, 0.750, 0.585, 0.375, 0.333].map((purity, index) => {
 // const goldType = [22, 18, 14, 9, 8][index];
 // const goldPrice = priceLive * purity;
 // const prevGoldPrice = previousPriceRef.current ? previousPriceRef.current * purity : null;
 // return (
   // <h3 key={goldType}>
    //  Prezzo dell'Oro {goldType}k: 
    //  <span className={getColor(goldPrice, prevGoldPrice)}> {goldPrice.toFixed(2)} USD</span>
     //</h3> {previousPriceRef.current !== null && (
      //  <span className="ms-2">
      //    ({getPercentageChange(goldPrice, prevGoldPrice)}%)
      //  </span>
     // )}
   // </h3>
 // );
//})}






const GoldPrice = () => {
  const [priceLive, setPriceLive] = useState(null);
  const [loading, setLoading] = useState(true); // Stato di caricamento

  useEffect(() => {
    axios.get(`http://localhost:8080/api/gold/goldprice`) // URL corretto per il backend
      .then(response => {
        console.log(response.data); // Log della risposta per capire cosa ricevi
        setPriceLive(response.data.priceLive); // Imposta il prezzo ricevuto dal backend
        setLoading(false); // Imposta loading su false quando il dato è caricato
      })
      .catch(error => {
        console.error('Errore nel caricamento del prezzo:', error);
        setLoading(false); // Imposta loading su false anche in caso di errore
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Caricamento del prezzo...</h3>
        <Spinner animation="border" variant="primary" /> {/* Spinner di Bootstrap */}
      </div>
    );
  }

  return (
<div className="container mt-5">
    <h1>Prezzo dell'Oro 24k: <span className="text-success">{priceLive.toFixed(2)} USD</span></h1>
    <h3>Prezzo dell'Oro 22k: <span className="text-success">{(priceLive * 0.916).toFixed(2)} USD</span></h3>
    <h3>Prezzo dell'Oro 18k:<span className="text-success"> {(priceLive * 0.750).toFixed(2)} USD</span></h3>
    <h3>Prezzo dell'Oro 14k: <span className="text-success">{(priceLive * 0.585).toFixed(2)} USD</span></h3>
    <h3>Prezzo dell'Oro 9k: <span className="text-success">{(priceLive * 0.375).toFixed(2)} USD</span></h3>
    <h3>Prezzo dell'Oro 8k: <span className="text-success">{(priceLive * 0.333).toFixed(2)} USD</span></h3>
  </div>
  );
};

export default GoldPrice;

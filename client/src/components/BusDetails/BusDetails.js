import React from 'react';
import './BusDetails.css';

const BusDetails = ({ busInfo }) => {
  // This is a placeholder. Expand upon this with real data.
  return (
    <div className="bus-details">
      <h3>Bus Number: {busInfo.busNumber}</h3>
      <p>Next Stop: {busInfo.nextStop}</p>
      <p>ETA: {busInfo.eta}</p>
      <p>Type: {busInfo.type}</p>
    </div>
  );
}

export default BusDetails;


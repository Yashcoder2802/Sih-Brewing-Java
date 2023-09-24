// BusSearchBar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BusSearchBar.css';


const BusSearchBar = ({ onSearch }) => {
  const [busNumber, setBusNumber] = useState('');
  const [destination, setDestination] = useState('');
  const [busList, setBusList] = useState([]);
  const [busStops, setBusStops] = useState([]);

  const [startStopName, setStartStopName] = useState('');
  const [endStopName, setEndStopName] = useState('');
  const [routes, setRoutes] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('/routesBetweenStops', {
        params: { startStopName, endStopName },
      });

      if (response.status === 200) {
        setRoutes(response.data);
        onSearch(routes, startStopName, endStopName);
      } else {
        console.log('Error fetching routes.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateBusList = (item) => {
    // Create a new list by copying the existing list and adding a new item
    const updatedList = [...busList, item];
    
    // Update the state with the new list
    setBusList(updatedList);
  };

  const getBusStops = async () => {
    try {
      const response = await axios.get('/bus-stops');
      const fetchedBusStops = response.data;
      setBusStops(fetchedBusStops); // Update the state with fetched data
    } catch (error) {
      console.error(error);
    }
  };

  // Use useEffect to log busList when it changes
  useEffect(() => {
    onSearch(routes, startStopName, endStopName);
  }, [routes]);

  useEffect(() => {
    getBusStops();
  });

  const destinations = [ // mock destinations
    "Shimla",
    "Manali",
    "Dharamshala",
    "Kullu",
    "Kasauli",
    "Dalhousie",
    "Bilaspur",
    // ... Add other destinations here
  ];

  // const handleSearch = () => {
  //   getLiveBus();
  //   onSearch(busList);
  // };

  return (
    <div className="bus-search-bar">
      {/* <input
        type="text"
        placeholder="Enter Bus Number"
        value={busNumber}
        onChange={(e) => setBusNumber(e.target.value)}
      /> */}
      <select onChange={(e) => setStartStopName(e.target.value)}>
        <option value="" disabled selected>Start Destination</option>
        {busStops.map((dest) => (
          <option key={dest} value={dest.bus_stop_number}>{dest.bus_stop_number}</option>
        ))}
      </select>
      <select onChange={(e) => setEndStopName(e.target.value)}>
        <option value="" disabled selected>End Destination</option>
        {busStops.map((dest) => (
          <option key={dest} value={dest.bus_stop_number}>{dest.bus_stop_number}</option>
        ))}
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default BusSearchBar;

import React from 'react';
import { useState } from 'react';
import MainHeader from '../../../components/MainHeader';
import MapComponent from '../../../components/MapComponent/MapComponent';
import SidePanel from '../../../components/SidePanel/SidePanel';
import BusSearchBar from '../../../components/BusSearchBar/BusSearchBar';
import './MainPage.css';

const MainPage = () => {
  const [buses, setBuses] = useState([]);
  const [start_stop, setStartStop] = useState("");
  const [end_stop, setEndStop] = useState("");

  const handleBusSearch = async (busList, start_stop, end_stop) => {
    // TODO: Implement logic to handle the search
    // console.log(`Searching for Bus Number: ${busNumber}, Destination: ${destination}`);
    setBuses(busList);
    setStartStop(start_stop);
    setEndStop(end_stop);
  };

  console.log(buses);
  
  return (
    <div className="main-page">
      <MainHeader />
      <BusSearchBar onSearch={handleBusSearch} />
      <div className="main-content">
        <SidePanel busList={buses} start={start_stop} end={end_stop} />
        <MapComponent />
      </div>
    </div>
  );
}

export default MainPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConductorPage.css';

const ConductorPage = () => {
    const [busId, setBusId] = useState('');  // State for Bus ID
    const [busNumber, setBusNumber] = useState('');
    const [startDestination, setStartDestination] = useState('');
    const [endDestination, setEndDestination] = useState('');
    const [routes, SetRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState("");

    const getRoutes = async () => {
        try {
            const response = await axios.get('/routes');
            SetRoutes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getRoutes();
    }, []);

    const startLat = "19.1150281";
    const startLong = "72.8398195";
    const endLat = "32.248021";
    const endLong = "77.173488";

    const createRecord = async (conductorId, routeId) => {
        try {
          const response = await axios.post('/createLiveTableRecord', {
            conductorId,
            routeId
          });
      
          if (response.status === 201) {
            const responseData = response.data;
            console.log('LiveTable record created successfully:', responseData);
          } else {
            console.log('Error creating LiveTable record.');
          }
        } catch (error) {
          console.error('Error creating LiveTable record:', error);
        }
      };
      
      // Usage example:
      const conductorId = '614c2b368a9e4c5d7c39ca31';
      const routeId = '123';
      
      createRecord(conductorId, routeId);

    return (
        <div className="conductor-page">
            <h1>Conductor Page</h1>

            <div className="input-section">
                <label htmlFor="busId">Bus ID:</label> {/* Bus ID input field */}
                <input 
                    type="text" 
                    id="busId"
                    value={busId}
                    onChange={(e) => setBusId(e.target.value)}
                />
            </div>

            <div className="input-section">
                <label htmlFor="busNumber">Bus Number:</label>
                <input 
                    type="text" 
                    id="busNumber"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                />
            </div>

            <div className="destinations-row">
            <select onChange={(e) => setSelectedRoute(e.target.value)}>
                <option value="" disabled selected>Start Destination</option>
                {routes.map((route) => (
                <option key={route} value={route.bus_number}>{route.bus_number}</option>
                ))}
            </select>
            </div>
            <div>
                <button className="submit-button">Submit</button>  {/* Added Button */}
            </div>
        </div>
    );
}

export default ConductorPage;

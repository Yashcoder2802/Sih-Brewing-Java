import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SidePanel.css';

const SidePanel = (props) => {
    const [selectedBus, setSelectedBus] = useState(null);
    const [routes, SetRoutes] = useState([]);
    const [liveBus, SetLiveBus] = useState([]);
    const [nextStop, setNextStop] = useState([]);
    const [matches, SetMatches] = useState([]);
    const [selectedBusIndex, setSelectedBusIndex] = useState(0);

    useEffect(() => {
        const nextStops = [];

        props.busList.forEach(item => {
            const currentIndex = item?.bus_stop_name.indexOf(props.start);

            if (currentIndex < item?.bus_stop_name.length - 1) {
                nextStops.push(item?.bus_stop_name[currentIndex + 1]);
            } else {
                nextStops.push(props.end);
            }
        });

        // Set the entire nextStops array in state
        setNextStop(nextStops);
    }, [props.busList, props.start, props.end]);

    const getLiveBus = async () => {
        try {
            const response = await axios.get('/live-table');
            SetLiveBus(response.data);
        } catch (error) {
            console.error(error);
        }
    };

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
        getLiveBus();
    }, []);
    
    useEffect(() => {
        // Check for matches between liveBus and Routes
        const results = liveBus.filter(liveBusItem => {
            // Find the corresponding Routes item with the same id
            const matchingRoutesItem = routes.find(routesItem => routesItem.bus_number === liveBusItem.route_number);
            
            // If a matching Routes item is found, add this liveBus item to matches
            return matchingRoutesItem !== undefined;
        });

        SetMatches(results);
    }, [liveBus, routes]);

    console.log("Matches:", matches);

    return (
        <div className="side-panel">
            <h3>Bus Updates</h3>
            <ul>
                {props.busList.map((bus, index) => (
                    <li key={bus._id} onClick={() => {
                        setSelectedBusIndex(index);
                        setSelectedBus(bus);
                    }}>
                        Bus from {props.start} to {props.end}
                        <br />
                        Next Stop: {nextStop[index]}
                        <span className={matches.some(match => match.bus_number === bus.route_number) ? "live-icon" : "not-live-icon"}>
                            {matches.some(match => match.bus_number === bus.route_number) ? "🟢" : "🔴"} {matches.some(match => match.bus_number === bus.route_number) ? "Live" : "Not Live"}
                        </span>
                    </li>
                ))}
            </ul>

            {selectedBus && (
                <div className="bus-popup">
                    <h4>Bus Details</h4>
                    <p><strong>Type:</strong> EV</p>
                    <p><strong>Start Stop:</strong> {props.start}</p>
                    <p><strong>Next Stop:</strong> {nextStop[selectedBusIndex]}</p>
                    <p><strong>Destination:</strong> {props.end}</p>
                    <p><strong>Environmental Impact:</strong> {selectedBus.type === "EV" ? "Eco Friendly" : "Standard Emission"}</p>
                    <button onClick={() => setSelectedBus(null)}>Close</button>
                </div>
            )}
        </div>
    );
}

export default SidePanel;

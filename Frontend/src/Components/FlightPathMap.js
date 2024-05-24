import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FlightSelection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons';
import { GoArrowSwitch } from 'react-icons/go';
import Background from '../assets/Background.mp4';

const FlightSearch = ({ fromICAO, toICAO, flights, setFromICAO, setToICAO, setFlights }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const fetchFlights = async () => {
    try {
      const response = await axios.get(/api/flightplans ? fromICAO = ${ fromICAO } & toICAO=${ toICAO });
      const uniqueFlights = removeDuplicates(response.data);
      setFlights(uniqueFlights);
    } catch (error) {
      console.error('Error fetching flight plans:', error);
      setError('Failed to fetch flight plans. Please try again later.');
    }
  };

  const handleFlightClick = (flightId) => {
    navigate(/flight/${ flightId });
  };

  const removeDuplicates = (flights) => {
    const seen = new Set();
    return flights.filter(flight => {
      const duplicate = seen.has(flight.distance + flight.waypoints);
      seen.add(flight.distance + flight.waypoints);
      return !duplicate;
    });
  };

  const switchICAOs = () => {
    const temp = fromICAO;
    setFromICAO(toICAO);
    setToICAO(temp);
  };

  return (
    <div className="flight-search-container">
      <video autoPlay loop muted className="background-video">
        <source src={Background} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <h1>Flight Plan Search</h1>
        <div className="search-form">
          <div className="input-group">
            <FontAwesomeIcon icon={faPlaneDeparture} className="input-icon" />
            <input
              type="text"
              placeholder="Enter From ICAO"
              value={fromICAO}
              onChange={(e) => setFromICAO(e.target.value)}
            />
          </div>
          <div className="switch-button" onClick={switchICAOs}>
            <GoArrowSwitch size={30} />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faPlaneArrival} className="input-icon" />
            <input
              type="text"
              placeholder="Enter To ICAO"
              value={toICAO}
              onChange={(e) => setToICAO(e.target.value)}
            />
          </div>
          <button className="search-button" onClick={fetchFlights}>Search</button>
        </div>
        {/* Rest of your code */}
      </div>
    </div>

  );
};

export default FlightSearch;
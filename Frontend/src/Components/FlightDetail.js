import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';  
import { useParams } from 'react-router-dom';
import axios from 'axios';
import airplane from "../assests/airplane.png"; 
import airport from "../assests/airport.png";
import './FlightDetail.css';

const FlightDetail = () => {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await axios.get(`/api/flightplan/${id}`);
        const flightData = response.data;

        const weatherPromises = flightData.route.nodes.map(node =>
          axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${node.lat}&lon=${node.lon}&appid=4c9c36bb42745e8c0226baf21bf2a583`)
        );

        const weatherResponses = await Promise.all(weatherPromises);
        const weatherData = weatherResponses.map(res => res.data);

        setFlight(flightData);
        setWeatherData(weatherData);
      } catch (error) {
        setError('Error fetching flight details: ' + error.message);
        console.error('Error fetching flight details:', error);
      }
    };

    fetchFlightDetails();
  }, [id]);

  const getWeatherWeight = (weather) => {
    switch (weather) {
      case 'clear sky':
        return 1;
      case 'few clouds':
        return 2;
      case 'scattered clouds':
        return 3;
      case 'broken clouds':
        return 4;
      case 'shower rain':
        return 5;
      case 'rain':
        return 6;
      case 'thunderstorm':
        return 7;
      case 'snow':
        return 8;
      case 'mist':
        return 9;
      default:
        return 10;
    }
  };

  const calculateRouteWeight = (flight, weatherData) => {
    return flight.route.nodes.reduce((totalWeight, node, index) => {
      const weather = weatherData[index]?.weather[0]?.description;
      const weight = getWeatherWeight(weather);
      return totalWeight + weight;
    }, 0);
  };

  useEffect(() => {
    if (flight && weatherData.length === flight.route.nodes.length) {
      const routeWeight = calculateRouteWeight(flight, weatherData);
      console.log('Route Weight:', routeWeight);
      // Use this weight to compare different routes and select the safest one
    }
  }, [flight, weatherData]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!flight) {
    return <div>Loading flight details...</div>;
  }

  const pathCoordinates = flight.route.nodes.map(node => [node.lat, node.lon]);


  // Blue airplane icon for departure
  const departureIcon = new L.Icon({
    iconUrl: airplane, // Use airplane icon
    iconSize: [25, 25],
  });

  // Red airplane icon for arrival
  const arrivalIcon = new L.Icon({
    iconUrl: airplane, // Use airplane icon
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5], // Center the icon
  });

  const waypointIcon = new L.Icon({
    iconUrl: airport, // Use airplane icon
    iconSize: [10, 10],
    iconAnchor: [6, 6], // Center the icon
  });

  return (
    <div className="flight-detail-container">
      <div className="flight-info card">
        <h1>Flight Detail</h1>
        <p><strong>Path ID:</strong> {flight.id}</p>
        <p><strong>Departure Airport:</strong> {flight.fromName}</p>
        <p><strong>Arrival Airport:</strong> {flight.toName}</p>
        <p><strong>Distance:</strong> {flight.distance.toFixed(2)} km</p>
        <p><strong>From ICAO:</strong> {flight.fromICAO}</p>
        <p><strong>To ICAO:</strong> {flight.toICAO}</p>
      </div>

      <div className="map-container">
        <MapContainer center={pathCoordinates[0]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={pathCoordinates[0]} icon={departureIcon}>
            <Popup>{flight.fromName} ({flight.fromICAO})</Popup>
          </Marker>

          <Marker position={pathCoordinates[pathCoordinates.length - 1]} icon={arrivalIcon}>
            <Popup>{flight.toName} ({flight.toICAO})</Popup>
          </Marker>

          {flight.route.nodes.slice(1, -1).map((node, index) => (
            <Marker key={index} position={[node.lat, node.lon]} icon={waypointIcon}>
              <Popup>
                {node.ident}: {node.name}<br />
                Weather: {weatherData[index]?.weather[0]?.description}
              </Popup>
            </Marker>
          ))}

          <Polyline positions={pathCoordinates} color="blue" weight={3} />
        </MapContainer>
      </div>
    </div>
  );
};

export default FlightDetail;
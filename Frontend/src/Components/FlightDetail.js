import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './FlightDetail.css';

const FlightDetail = () => {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await axios.get(`/api/flightplan/${id}`);
        setFlight(response.data);
      } catch (error) {
        setError('Error fetching flight details: ' + error.message);
        console.error('Error fetching flight details:', error);
      }
    };

    fetchFlightDetails();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!flight) {
    return <div>Loading flight details...</div>;
  }

  const pathCoordinates = flight.route.nodes.map(node => [node.lat, node.lon]);

  return (
    <div className="flight-detail-container">
      <h1>Flight Detail</h1>
      <div className="flight-info">
        <p><strong>Path ID:</strong> {flight.id}</p>
        <p><strong>Departure Airport:</strong> {flight.fromName}</p>
        <p><strong>Arrival Airport:</strong> {flight.toName}</p>
        <p><strong>Distance:</strong> {flight.distance.toFixed(2)} km</p>
        <p><strong>From ICAO:</strong> {flight.fromICAO}</p>
        <p><strong>To ICAO:</strong> {flight.toICAO}</p>
      </div>
      <MapContainer center={pathCoordinates[0]} zoom={5} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {flight.route.nodes.map((node, index) => (
          <Marker key={index} position={[node.lat, node.lon]}>
            <Popup>{node.ident}: {node.name}</Popup>
          </Marker>
        ))}
        <Polyline positions={pathCoordinates} color="blue" />
      </MapContainer>
    </div>
  );
};

export default FlightDetail;

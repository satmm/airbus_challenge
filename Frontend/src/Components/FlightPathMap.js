import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const FlightPathMap = ({ departureAirport, arrivalAirport, route }) => {
  // Filter the route data to include only departure and arrival points
  const filteredPathCoordinates = route
    .filter(node => (
      (node.lat === departureAirport.location[0] && node.lon === departureAirport.location[1]) ||
      (node.lat === arrivalAirport.location[0] && node.lon === arrivalAirport.location[1])
    ))
    .map(node => [node.lat, node.lon]);

  // Custom airport icon
  const airportIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447279.png',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });

  return (
    <MapContainer center={filteredPathCoordinates[0]} zoom={4} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Departure Airport Marker */}
      <Marker position={departureAirport.location} icon={airportIcon}>
        <Popup>{departureAirport.name} ({departureAirport.code})</Popup>
      </Marker>

      {/* Arrival Airport Marker */}
      <Marker position={arrivalAirport.location} icon={airportIcon}>
        <Popup>{arrivalAirport.name} ({arrivalAirport.code})</Popup>
      </Marker>

      {/* Flight Path Polyline */}
      <Polyline positions={filteredPathCoordinates} color="blue" weight={3} />
    </MapContainer>
  );
};

export default FlightPathMap;

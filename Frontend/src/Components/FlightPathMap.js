import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const FlightPathMap = ({ departureAirport, arrivalAirport, route }) => {
  const pathCoordinates = route.map(node => [node.lat, node.lon]);

  if (pathCoordinates.length < 2) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer center={pathCoordinates[0]} zoom={5} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {route.map((node, index) => (
        <Marker key={index} position={[node.lat, node.lon]}>
          <Popup>{node.ident}: {node.name}</Popup>
        </Marker>
      ))}
      <Polyline positions={pathCoordinates} color="blue" />
    </MapContainer>
  );
};

export default FlightPathMap;

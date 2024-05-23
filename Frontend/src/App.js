import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlightSearch from './Components/FlightSelection';
import FlightDetail from './Components/FlightDetail';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<FlightSearch />} />
          <Route path="/flight/:id" element={<FlightDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

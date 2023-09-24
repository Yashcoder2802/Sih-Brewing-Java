import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage/Homepage'; // Corrected the import to PascalCase
import MainPage from './pages/Homepage/Mainpage/MainPage';
import Conductorpage from './pages/Conductorpage/ConductorPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/conductor" element={<Conductorpage />} />
      </Routes>
    </Router>
  );
}

export default App;

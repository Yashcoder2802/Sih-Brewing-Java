import React from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  // Inline style for the hero section
  const heroStyle = {
    backgroundImage: `url(/Homepage.jpg)`, // Using the public path
    backgroundSize: 'cover',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  };
  const navigate = useNavigate();
  return (
    <div className="homepage">
      
     
      
      {/* Footer */}
      <div className="footer">
        <div className="footer-left">
        <img src="/icons/bus.svg" alt="Bus Logo" className="footer-logo" />
            <span className="footer-company-name">NEXATRANSIT</span>
        </div>

        <div className="footer-right">
            <div className="footer-nav">
                <a href="#conductor login" className="footer-link">Conductor Login</a>
                <a href="#about-us" className="footer-link">About Us</a>
                <a href="#working" className="footer-link">Working</a>
                <a href="#contact-us" className="footer-link">Contact Us</a>
                
            </div>
            <button className="download-btn">Download App</button>
        </div>
      </div>
       {/* Hero Section */}
       <div style={heroStyle} className="hero-section">
        <h1>Introducing Nexatransit</h1>
        <p>Moving Forward, Together</p>
        <button className="cta-button" onClick={() => navigate('/main')}>Get Started</button>
      </div>
    </div>
  );
}

export default Homepage;

import React from 'react';
import './MapComponent.css';

const MapComponent = () => {
    const googleMapsEmbedURL = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3430.7835766067854!2d77.17295!3d31.1040341!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390579ce472c212f%3A0x7a4b158387109079!2sMall%20Road!5e0!3m2!1sen!2sin!4v1632420059206!5m2!1sen!2sin";

    return (
        <div className="map-component">
            <iframe 
                src={googleMapsEmbedURL} 
                width="70%" 
                height="100%" 
                frameborder="0" 
                style={{border:0}} 
                allowfullscreen="" 
                aria-hidden="false" 
                tabindex="0">
            </iframe>
        </div>
    );
}

export default MapComponent;

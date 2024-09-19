import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";

export default function MapWidget({ latitude, longitude }) {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: latitude, lng: longitude });

  useEffect(() => {
    if (latitude && longitude) {
      setCenter({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (map && latitude && longitude) {
      map.panTo(new window.google.maps.LatLng(latitude, longitude));
    }
  }, [map, latitude, longitude]);

  const handleApiLoaded = ({ map, maps }) => {
    setMap(map);
    map.panTo(new maps.LatLng(latitude, longitude));
  };

  return (
    <div style={{
      height: "200px",
      width: "300px",
      borderRadius: '20px', // Apply border radius here for rounded corners
      overflow: 'hidden', // Ensure the corners of the map don't overflow
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Optional: Add a shadow for depth
    }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={center}
        defaultZoom={11}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleApiLoaded}
      >
      </GoogleMapReact>
    </div>
  );
}
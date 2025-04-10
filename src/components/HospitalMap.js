import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const HospitalMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestHospitals, setNearestHospitals] = useState([]);

  const hospitals = [
    { id: 1, name: "Hope Hospital", position: [17.0005, 81.7799], distance: 0 },
    { id: 2, name: "City Care Hospital", position: [17.0023, 81.7875], distance: 0 },
    { id: 3, name: "General Hospital", position: [16.9967, 81.7816], distance: 0 },
    { id: 4, name: "Apollo Hospital", position: [17.0015, 81.7845], distance: 0 },
    { id: 5, name: "Sunrise Hospital", position: [16.9985, 81.7855], distance: 0 }
  ];

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
  };

  const findNearestHospitals = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userPos = [position.coords.latitude, position.coords.longitude];
        setUserLocation(userPos);
        
        const hospitalsWithDistance = hospitals.map(hospital => ({
          ...hospital,
          distance: calculateDistance(
            userPos[0], userPos[1],
            hospital.position[0], hospital.position[1]
          )
        }));

        const sorted = [...hospitalsWithDistance].sort((a, b) => a.distance - b.distance);
        setNearestHospitals(sorted);
      });
    }
  };

  return (
    <div className="hospital-map-container">
      <MapContainer
        center={[17.0005, 81.7799]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={20}
        />
        {hospitals.map((hospital) => (
          <Marker key={hospital.id} position={hospital.position}>
            <Popup>
              <strong>{hospital.name}</strong>
            </Popup>
          </Marker>
        ))}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>

      <button className="find-hospital-btn" onClick={findNearestHospitals}>
        <FaMapMarkerAlt /> Find Hospitals Near Me
      </button>

      {nearestHospitals.length > 0 && (
        <div className="nearest-hospitals">
          <h3>Nearest Hospitals</h3>
          <div className="hospitals-list">
            {nearestHospitals.map(hospital => (
              <div key={hospital.id} className="hospital-item">
                <h4>{hospital.name}</h4>
                <p>{hospital.distance} km away</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalMap;
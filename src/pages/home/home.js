import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope } from 'react-icons/fa';
import './home.css';
 // Make sure to add your logo image

const Home = () => {
  const specializations = [
    { id: 1, name: 'Oncology', rating: 4.8, doctors: 25 },
    { id: 2, name: 'Cardiology', rating: 4.9, doctors: 30 },
    { id: 3, name: 'Neurology', rating: 4.7, doctors: 20 },
    { id: 4, name: 'Pediatrics', rating: 4.8, doctors: 28 },
  ];

  return (
    <div className="app-container">
      <div className="app-header">
        <img src="/logo.png" alt="LycoSpec" className="app-logo" />
        <Link to="/messages" className="message-icon">
          <FaEnvelope />
          <span className="message-badge">2</span>
        </Link>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search doctors, specializations..." />
      </div>

      <div className="content-area">
        <div className="specialization-scroll">
          {specializations.map(spec => (
            <div key={spec.id} className="spec-card">
              <h3>{spec.name}</h3>
              <div className="spec-info">
                <span className="rating">★ {spec.rating}</span>
                <span className="doctor-count">{spec.doctors} Doctors</span>
              </div>
            </div>
          ))}
        </div>

        <div className="nearby-doctors">
          <div className="map-preview">
            <h2>Find Doctors Near You</h2>
            <p>20+ doctors available in your area</p>
            <Link to="/map" className="view-map-btn">View Map</Link>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/" className="nav-item active">
          <FaHome />
          <span>Home</span>
        </Link>
        <Link to="/appointments" className="nav-item">
          <FaCalendarAlt />
          <span>Appointments</span>
        </Link>
        <Link to="/notifications" className="nav-item">
          <FaBell />
          <span>Notifications</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <FaUser />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default Home;
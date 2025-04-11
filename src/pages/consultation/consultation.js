import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope, FaSearch } from 'react-icons/fa';
import VideoConference from '../../components/VideoConference';
import './consultation.css';

const Consultation = () => {
  const [showVideoCall, setShowVideoCall] = useState(false);

  const handleConnectClick = () => {
    setShowVideoCall(true);
  };

  return (
    <div className="app-container">
      {showVideoCall ? (
        <VideoConference onClose={() => setShowVideoCall(false)} />
      ) : (
        <>
          <div className="app-header">
            <img src="/logo.png" alt="LycoSpec" className="app-logo" />
            <Link to="/messages" className="message-icon">
              <FaEnvelope />
              <span className="message-badge">2</span>
            </Link>
          </div>

          <div className="consultation-hero">
            <div className="hero-content">
              <h1>Online Doctor Consultation</h1>
              <p>Private online consultations with verified doctors</p>
              <div className="search-container">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input type="text" placeholder="Search doctors, specialties..." />
                </div>
                <button className="connect-btn" onClick={handleConnectClick}>
                  Connect Now
                </button>
              </div>
            </div>
          </div>

          <nav className="bottom-nav">
            <Link to="/" className="nav-item">
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
        </>
      )}
    </div>
  );
};

export default Consultation;
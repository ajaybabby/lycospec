import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope } from 'react-icons/fa';
import './doctors.css';


const Doctors = () => {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      specialization: 'Cardiology',
      experience: '15 years',
      rating: 4.9,
      image: '/doctor.jpg',
      availability: 'Available Today'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Oncology',
      experience: '12 years',
      rating: 4.8,
      image: '/doctor2.jpg',
      availability: 'Next Available: Tomorrow'
    },
    // Add more doctors as needed
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

      <div className="main-content">
        
        <div className="doctors-hero">
          <div className="search-bar">
            <input type="text" placeholder="Search doctors, specializations..." />
          </div>
        </div>

        <div className="doctors-grid">
          {doctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <img src={doctor.image} alt={doctor.name} className="doctor-image" />
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p className="specialization">{doctor.specialization}</p>
                <div className="doctor-details">
                  <span className="experience">{doctor.experience}</span>
                  <span className="rating">★ {doctor.rating}</span>
                </div>
                <p className="availability">{doctor.availability}</p>
                <Link to={`/book-appointment/${doctor.id}`} className="book-now-btn">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default Doctors;
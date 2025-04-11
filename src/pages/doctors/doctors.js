import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import RegisterPopup from '../../components/RegisterPopup';
import './doctors.css';

const Doctors = () => {
  const navigate = useNavigate();
  const [setSelectedDoctorId] = useState(null);
  const [filters, setFilters] = useState({
    hospital: '',
    speciality: ''
  });
  const isLoggedIn = localStorage.getItem('user') !== null;

  const doctors = [
    {
      id: 1,
      name: 'Dr. N Satish Varma',
      specialization: 'Dentist',
      experience: '28 years',
      hospital: 'The Dental Studio',
      location: 'Dwarakanagar, Visakhapatnam',
      rating: 4.9,
      consultationFee: '₹500',
      patientStories: 115,
      satisfaction: '100%',
      availability: 'Available Today',
      image: '/doctor.jpg'
    },
    {
      id: 2,
      name: 'Dr. Prudviraj Parimi',
      specialization: 'Dentist',
      experience: '13 years',
      hospital: 'Smiles Dental Clinic',
      location: 'Ram Nagar',
      rating: 4.8,
      consultationFee: '₹200',
      patientStories: 440,
      satisfaction: '99%',
      availability: 'Available Today',
      image: '/doctor2.jpg'
    },
  ];

  const handleBookAppointment = (doctorId) => {
    
    navigate(`/book-appointment`);
  };
  
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
            <select defaultValue="">
              <option value="">Select Location</option>
              <option value="vizag">Visakhapatnam</option>
              <option value="hyd">Hyderabad</option>
              <option value="rjy">Rajahmundry</option>
            </select>
            <select defaultValue="">
              <option value="">Select Speciality</option>
              <option value="dentist">Dentist</option>
              <option value="cardiologist">Cardiologist</option>
              <option value="orthopedic">Orthopedic</option>
              <option value="pediatrician">Pediatrician</option>
            </select>
            <input type="text" placeholder="Search doctors, clinics..." />
          </div>
        </div>


        <div className="doctors-summary">
          <h2>37 Dentists available in Visakhapatnam</h2>
          <p>Book appointments with minimum wait-time & verified doctor details</p>
        </div>

        <div className="doctors-list">
          {doctors.map(doctor => (
            <div key={doctor.id} className="doctor-list-item">
              <div className="doctor-list-header">
                <h3>{doctor.hospital}</h3>
                <span>{doctor.consultationFee} Consultation fee at clinic</span>
              </div>
              
              <div className="doctor-list-content">
                <img src={doctor.image} alt={doctor.name} className="doctor-thumbnail" />
                <div className="doctor-list-info">
                  <h4>{doctor.name}</h4>
                  <p className="specialization">{doctor.specialization}</p>
                  <p className="experience">{doctor.experience} experience overall</p>
                  <p className="location">
                    <FaMapMarkerAlt /> {doctor.location}
                  </p>
                  <div className="stats">
                    <span className="satisfaction">{doctor.satisfaction}</span>
                    <span className="stories">{doctor.patientStories} Patient Stories</span>
                  </div>
                </div>
              </div>

              <div className="doctor-list-actions">
                <button 
                  onClick={() => handleBookAppointment(doctor.id)} 
                  className="book-clinic-btn"
                >
                  Book Clinic Visit
                </button>
                <button className="contact-btn">Contact Clinic</button>
                <Link to={`/doctor/${doctor.id}`} className="view-profile-btn">
                  View Profile
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
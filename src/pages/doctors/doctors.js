import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import RegisterPopup from '../../components/RegisterPopup';
import './doctors.css';
import { useLocation } from 'react-router-dom';  // Add this import at the top

const Doctors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize selectedSpeciality with the value from navigation state
  const [selectedSpeciality, setSelectedSpeciality] = useState(location.state?.selectedSpeciality || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [filters, setFilters] = useState({
    hospital: '',
    speciality: ''
  });
  const isLoggedIn = localStorage.getItem('user') !== null;

 
  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, selectedLocation, selectedSpeciality]);

  // Add state for specializations
  const [areas, setAreas] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  // Update useEffect to extract unique areas and specializations
  useEffect(() => {
    if (doctors.length > 0) {
      const uniqueAreas = [...new Set(doctors.map(doctor => doctor.area_name))].filter(Boolean);
      const uniqueSpecializations = [...new Set(doctors.map(doctor => doctor.specialization_name))].filter(Boolean);
      setAreas(uniqueAreas);
      setSpecializations(uniqueSpecializations);
    }
  }, [doctors]);

  // Update filterDoctors function
  const filterDoctors = () => {
    let filtered = [...doctors];
    
    if (selectedLocation) {
      filtered = filtered.filter(doctor => 
        doctor.area_name === selectedLocation
      );
    }
    
    if (selectedSpeciality) {
      filtered = filtered.filter(doctor => 
        doctor.specialization_name === selectedSpeciality  // Removed toLowerCase() for exact match
      );
    }
    
    setFilteredDoctors(filtered);
  };

  // Update the location dropdown in JSX
  <select 
    value={selectedLocation} 
    onChange={(e) => setSelectedLocation(e.target.value)}
  >
    <option value="">Select Location</option>
    {areas.map(area => (
      <option key={area} value={area}>
        {area}
      </option>
    ))}
  </select>
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://lyco.loca.lt/api/getdoctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const result = await response.json();
      // Access the doctors array from the data property
      setDoctors(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctor) => {
      navigate('/book-appointment', { 
        state: { 
          doctorInfo: {
            id: doctor.id,
            name: doctor.name,
            specialization: doctor.specialization_name,
            hospital: doctor.hospital_name,
            consultationFee: doctor.consultation_fee,
            area: doctor.area_name
          }
        }
      });
    };
  
  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    // Update the header and search section
    <div className="app-container">
      <div className="app-header">
        <img src="/logo.png" alt="LycoSpec" className="app-logo" />
        <Link to="/messages" className="message-icon">
          <FaEnvelope />
          <span className="message-badge">2</span>
        </Link>
      </div>
      <div className="main-content">
        <div className="doctor-hero-section">
          <div className="hero-content">
            <h1 className="animate-slide-down">
              {selectedSpeciality ? (
                <>
                  Best <span className="highlight">{selectedSpeciality}</span> Doctors
                </>
              ) : (
                'Find the Right Doctor'
              )}
            </h1>
            <p className="hero-subtitle animate-fade-in">
              Book appointments with verified doctors
            </p>
          </div>
          
          <div className="search-container animate-slide-up">
            <div className="search-box">
              <FaMapMarkerAlt className="search-icon" />
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="location-select"
              >
                <option value="">Select Location</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
  
            <div className="search-box">
              <FaUser className="search-icon" />
              <select 
                value={selectedSpeciality} 
                onChange={(e) => setSelectedSpeciality(e.target.value)}
                className="speciality-select"
              >
                <option value="">Select Speciality</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
  
            <button className="search-button">
              <FaFilter /> Filter
            </button>
          </div>
        </div>
  
        <div className="quick-stats animate-fade-in">
          <div className="stat-item">
            <span className="stat-number">{filteredDoctors.length}</span>
            <span className="stat-label">Available Doctors</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.8</span>
            <span className="stat-label">Average Rating</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>

        {/* Remove the duplicate sections and directly show doctors summary */}
        <div className="doctors-summary">
          <h2>{filteredDoctors.length} Doctors available {selectedLocation && `in ${selectedLocation}`}</h2>
          <p>Book appointments with minimum wait-time & verified doctor details</p>
        </div>

        <div className="doctors-list">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="doctor-list-item">
              <div className="doctor-list-header">
                <h3>{doctor.hospital_name}</h3>
                <span>₹{doctor.consultation_fee || 'N/A'} Consultation fee at clinic</span>
              </div>
              
              <div className="doctor-list-content">
                <img src={doctor.image || '/doctor-placeholder.jpg'} alt={doctor.name} className="doctor-thumbnail" />
                <div className="doctor-list-info">
                  <h4>{doctor.name}</h4>
                  <p className="specialization">{doctor.specialization_name}</p>
                  <p className="experience">{doctor.experience || 'N/A'} experience overall</p>
                  <p className="location">
                    <FaMapMarkerAlt /> {doctor.hospital_name}
                  </p>
                  <div className="stats">
                    <span className="satisfaction">99%</span>
                    <span className="stories">0 Patient Stories</span>
                  </div>
                </div>
              </div>

              <div className="doctor-list-actions">
                <button 
                  onClick={() => handleBookAppointment(doctor)} // Pass entire doctor object
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
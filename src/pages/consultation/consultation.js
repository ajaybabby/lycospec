import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope, FaSearch, FaVideo } from 'react-icons/fa';
import VideoConference from '../../components/VideoConference';
import './consultation.css';

const Consultation = () => {
  const [showVideoCall, setShowVideoCall] = useState(false);
  // Initialize doctors state with empty array
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/video-enabled');
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data); // Changed from data.doctors to data.data
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  const [callStatus, setCallStatus] = useState(null);
    const [callRequestId, setCallRequestId] = useState(null);
  
    // Add this new effect to check call status
    useEffect(() => {
      let statusCheck;
      if (callRequestId) {
        statusCheck = setInterval(async () => {
          try {
            const response = await fetch(`http://localhost:5000/api/video-call/status/${callRequestId}`);
            const data = await response.json();
            if (data.success) {
              setCallStatus(data.status);
              if (data.status === 'accepted') {
                clearInterval(statusCheck);
              }
            }
          } catch (error) {
            console.error('Error checking call status:', error);
          }
        }, 3000);
      }
      return () => clearInterval(statusCheck);
    }, [callRequestId]);
  
    const handleConnectClick = async (doctor) => {
      try {
        const response = await fetch('http://localhost:5000/api/video-call/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ doctorId: doctor.id, patientId: 4 })
        });
        const data = await response.json();
        if (data.success) {
          setCallRequestId(data.requestId);
          setSelectedDoctor(doctor.id);
          alert('Call request sent. Waiting for doctor to accept...');
        } else {
          alert('Failed to connect with doctor. Please try again.');
        }
      } catch (error) {
        console.error('Error connecting to doctor:', error);
        alert('Failed to connect. Please try again.');
      }
    };
  
    const joinCall = () => {
      setShowVideoCall(true);
    };
  
  // Update the filter logic with null check
  const filteredDoctors = doctors?.filter(doctor => 
    doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor?.specialization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor?.hospital_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="app-container">
      {showVideoCall ? (
        <VideoConference 
          onClose={() => setShowVideoCall(false)} 
          doctorId={selectedDoctor}
        />
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
                  <input 
                    type="text" 
                    placeholder="Search doctors, specialties..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="doctors-list">
            {loading ? (
              <div className="loading">Loading doctors...</div>
            ) : (
              filteredDoctors.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <img src={doctor.image || '/default-doctor.png'} alt={doctor.name} />
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <p className="specialization">{doctor.specialization_name}</p>
                    <p className="hospital">{doctor.hospital_name}</p>
                    <p className="experience">{doctor.experience} years experience</p>
                    <p className="fee">₹{doctor.consultation_fee} per consultation</p>
                    <div className="contact-info">
                      <p>Email: {doctor.email}</p>
                      <p>Mobile: {doctor.mobile}</p>
                    </div>
                    <div className="action-buttons">
                      {callStatus === 'accepted' && selectedDoctor === doctor.id ? (
                        <button 
                          className="join-btn"
                          onClick={joinCall}
                        >
                          <FaVideo /> Join Call
                        </button>
                      ) : (
                        <>
                          <button 
                            className="connect-btn"
                            onClick={() => handleConnectClick(doctor)}
                            disabled={callStatus === 'pending'}
                          >
                            <FaVideo /> {callStatus === 'pending' ? 'Waiting...' : 'Start Consultation'}
                          </button>
                          <button 
                            className="request-btn"
                            onClick={() => handleConnectClick(doctor)}
                            disabled={callStatus === 'pending'}
                          >
                            Request Video Call
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
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
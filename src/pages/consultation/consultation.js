import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope, FaSearch, FaVideo } from 'react-icons/fa';
import VideoConference from '../../components/VideoConference.js';
import './consultation.css';


const Consultation = () => {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  // Add these missing state variables
  const [callStatus, setCallStatus] = useState(null);
  const [callRequestId, setCallRequestId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/video-enabled');
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  // Add patientId state
  const [currentPatientId, setCurrentPatientId] = useState(null);
  
  // Modify handleConnectClick to store patientId
  const handleConnectClick = async (doctor) => {
      const patientToken = localStorage.getItem('patientToken');
      if (!patientToken) {
        alert('Please login to start consultation');
        return;
      }
  
      try {
        const tokenPayload = JSON.parse(atob(patientToken.split('.')[1]));
        const patientId = tokenPayload.userId || tokenPayload.user_id || tokenPayload.id || tokenPayload.patientId;
        
        if (!patientId) {
          alert('Authentication error: Patient ID not found');
          return;
        }
  
        setCurrentPatientId(patientId); // Store patientId
  
        // Create video call request
        const response = await fetch('http://localhost:5000/api/video-call/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${patientToken}`
          },
          body: JSON.stringify({
            doctorId: doctor.id,
            patientId: patientId
          })
        });
  
        const data = await response.json();
        if (data.success) {
          // First update all states
          await Promise.all([
            setSelectedDoctor(doctor.id),
            setCallRequestId(data.data.id),
            setCallStatus('pending'),
            setCurrentPatientId(patientId)
          ]);
  
          // Then start status checking with the actual ID
          const requestId = data.data.id;
          const statusCheck = setInterval(async () => {
            const status = await checkCallStatus(requestId);
            if (status === 'accepted') {
              clearInterval(statusCheck);
              setShowVideoCall(true);
            } else if (status === 'rejected' || status === 'ended') {
              clearInterval(statusCheck);
              setCallStatus(null);
              setCallRequestId(null);
            }
          }, 5000);
  
          // Store interval ID for cleanup
          return () => clearInterval(statusCheck);
        } else {
          alert(data.message || 'Failed to create video call request');
        }
      } catch (error) {
        console.error('Error starting consultation:', error);
        alert('Failed to start consultation. Please try again.');
      }
  };


  // Remove the second checkCallStatus method that starts here
  const joinCall = () => {
    setShowVideoCall(true);
  };
  // Delete duplicate checkCallStatus method here
  const checkCallStatus = async (requestId = null) => {
      const idToCheck = requestId || callRequestId;
      if (!idToCheck) {
        console.log('No active call request ID');
        return null;
      }
  
      try {
        const patientToken = localStorage.getItem('patientToken');
        const response = await fetch(`http://localhost:5000/api/video-call/status/${idToCheck}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${patientToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        if (data.success) {
          const status = data.data.status;
          if (status === 'accepted') {
            setCallStatus('accepted');
            setShowVideoCall(true);
          } else if (status === 'rejected' || status === 'ended') {
            setCallStatus(null);
            setCallRequestId(null);
          }
          return status;
        }
        return null;
      } catch (error) {
        console.error('Error checking call status:', error);
        return null;
      }
    };

  const filteredDoctors = doctors?.filter(doctor => 
    doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor?.specialization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor?.hospital_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Update VideoConference component in render
  return (
      <div className="app-container">
        {showVideoCall ? (
          <VideoConference 
            onClose={() => {
              setShowVideoCall(false);
              setCurrentPatientId(null);
              setCallRequestId(null);
              setCallStatus(null);
            }}
            doctorId={selectedDoctor}
            patientId={currentPatientId}
            callId={callRequestId}
            isDoctor={false}
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
  
            <div className="consultation-hero-section">
              <div className="hero-content">
                <h1 className="animate-slide-down">
                  Online Doctor <span className="highlight">Consultation</span>
                </h1>
                <p className="hero-subtitle animate-fade-in">
                  Connect with Expert Doctors Instantly via Video Call
                </p>
              </div>
              
              <div className="search-container animate-slide-up">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search doctors, specialties..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
  
              <div className="quick-stats animate-fade-in">
                <div className="stat-item">
                  <span className="stat-number">{doctors.length}</span>
                  <span className="stat-label">Online Doctors</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">₹299</span>
                  <span className="stat-label">Starting from</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">4.8★</span>
                  <span className="stat-label">User Rating</span>
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
                            >
                              <FaVideo /> Start Consultation
                            </button>
                            {callStatus === 'pending' && selectedDoctor === doctor.id && (
                              <button 
                                className="status-btn"
                                onClick={checkCallStatus}
                              >
                                Check Status
                              </button>
                            )}
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
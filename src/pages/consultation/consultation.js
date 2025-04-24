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

  // Remove this entire useEffect block that does automatic status checking
  /* useEffect(() => {
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
              joinCall();
            } else if (data.status === 'rejected' || data.status === 'cancelled') {
              clearInterval(statusCheck);
              setCallRequestId(null);
              alert(`Call was ${data.status}`);
            }
          }
        } catch (error) {
          console.error('Error checking call status:', error);
          clearInterval(statusCheck);
          setCallRequestId(null);
        }
      }, 3000);
    }
    return () => {
      if (statusCheck) {
        clearInterval(statusCheck);
      }
    };
  }, [callRequestId]); */

  const handleConnectClick = async (doctor) => {
    const patientToken = localStorage.getItem('patientToken');
    console.log('Retrieved token:', patientToken); // Check if token exists

    if (!patientToken) {
      alert('Please login to request a video call');
      return;
    }

    try {
      // Detailed token decoding logs
      const tokenParts = patientToken.split('.');
      console.log('Token parts:', tokenParts);
      
      if (tokenParts.length !== 3) {
        console.error('Invalid token format');
        alert('Invalid authentication token');
        return;
      }

      const decodedPayload = atob(tokenParts[1]);
      console.log('Decoded payload:', decodedPayload);
      
      const tokenPayload = JSON.parse(decodedPayload);
      console.log('Token payload:', tokenPayload);

      // Try different possible ID fields
      const patientId = tokenPayload.userId || tokenPayload.user_id || tokenPayload.id || tokenPayload.patientId;
      console.log('Extracted patient ID:', patientId);

      if (!patientId) {
        console.error('No patient ID found in token');
        alert('Authentication error: Patient ID not found');
        return;
      }

      const requestData = { 
        doctorId: doctor.id,
        patientId: patientId
      };
      
      console.log('Final request data:', requestData);

      const response = await fetch('http://localhost:5000/api/video-call/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${patientToken}`
        },
        body: JSON.stringify(requestData)
      });
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('Setting call request ID:', data.data.id); // Log the correct ID path
        setCallRequestId(data.data.id); // Update to use the correct path data.data.id
        setSelectedDoctor(doctor.id);
        setCallStatus('pending');
        alert('Call request sent. Waiting for doctor to accept...');
      } else {
        alert(data.message || 'Failed to connect with doctor. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting to doctor:', error);
      alert('Failed to connect. Please try again.');
    }
  };

  const joinCall = () => {
    setShowVideoCall(true);
  };

  const checkCallStatus = async () => {
    console.log('Checking call status...');
    console.log('Call Request ID:', callRequestId);
    
    if (!callRequestId) {
      alert('No active call request');
      return;
    }

    try {
      const patientToken = localStorage.getItem('patientToken');
      const response = await fetch(`http://localhost:5000/api/video-call/status/${callRequestId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${patientToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Status check response data:', data);

      if (data.success) {
        console.log('Call status:', data.data.status);
        if (data.data.status === 'accepted') {
          setCallStatus('accepted');
          setShowVideoCall(true);
        } else {
          alert(`Call status: ${data.data.status}`);
        }
      }
    } catch (error) {
      console.error('Error checking call status:', error);
      alert('Failed to check call status');
    }
  };

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
                            disabled={callStatus === 'pending'}
                          >
                            <FaVideo /> {callStatus === 'pending' ? 'Waiting...' : 'Start Consultation'}
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
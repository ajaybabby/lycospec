import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope, FaCheck, FaTimes, FaEdit, FaVideo } from 'react-icons/fa';
import VideoConference from '../../../components/VideoConference';
import './doctordashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [videoRequests, setVideoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [currentCallId, setCurrentCallId] = useState(null);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const fetchAppointments = async () => {
    const storedDoctorData = JSON.parse(localStorage.getItem('doctorData'));
    if (!storedDoctorData?.id) {
      console.error('Doctor ID not found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/appoint/doctor/${storedDoctorData.id}/appointments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  const fetchVideoRequests = async () => {
    const storedDoctorData = JSON.parse(localStorage.getItem('doctorData'));
    if (!storedDoctorData?.id) {
      console.error('Doctor ID not found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/doctor/${storedDoctorData.id}/video-requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setVideoRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching video requests:', error);
    }
  };

  const handleAppointmentAction = async (id, action) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: action })
      });
      const data = await response.json();
      if (data.success) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleVideoRequest = async (requestId, action, patientId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/video-call/${requestId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        if (action === 'accept') {
          setCurrentCallId(requestId);
          setCurrentPatientId(patientId);
          setShowVideoCall(true);
        }
        fetchVideoRequests();
      }
    } catch (error) {
      console.error('Error handling video request:', error);
    }
  };

  useEffect(() => {
    const storedDoctorData = localStorage.getItem('doctorData');
    if (storedDoctorData) {
      const parsedData = JSON.parse(storedDoctorData);
      setDoctorData(parsedData);
    }
    
    fetchAppointments();
    fetchVideoRequests();

    const appointmentsInterval = setInterval(fetchAppointments, 30000);
    const videoRequestsInterval = setInterval(fetchVideoRequests, 5000);

    return () => {
      clearInterval(appointmentsInterval);
      clearInterval(videoRequestsInterval);
    };
  }, []);

  return (
    <div className="app-container">
      {showVideoCall ? (
        <VideoConference 
          doctorId={doctorData?.id}
          patientId={currentPatientId}
          callId={currentCallId}
          onClose={() => {
            setShowVideoCall(false);
            setCurrentCallId(null);
            setCurrentPatientId(null);
            fetchVideoRequests();
          }}
          isDoctor={true}
        />
      ) : (
        <>
          {/* Keep existing dashboard UI */}
          <div className="app-header">
            <img src="/logo.png" alt="LycoSpec" className="app-logo" />
            <div className="header-right">
              <Link to="/video-consultations" className="video-consult-btn">
                <FaVideo /> Video Consultations
              </Link>
              <Link to="/messages" className="message-icon">
                <FaEnvelope />
                <span className="message-badge">2</span>
              </Link>
            </div>
          </div>

          <div className="main-content">
            <div className="dashboard-header">
              <h2>Today's Appointments</h2>
              <div className="appointment-stats">
                <div className="stat-box">
                  <span className="stat-number">8</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Pending</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">5</span>
                  <span className="stat-label">Confirmed</span>
                </div>
              </div>
            </div>

            <div className="appointments-list">
              {appointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h3>{appointment.patient_name}</h3>
                    <div className="appointment-details">
                      <p><strong>Date:</strong> {formatDate(appointment.appointment_date)}</p>
                      <p><strong>Time:</strong> {formatTime(appointment.time_slot)}</p>
                      <p><strong>Age:</strong> {appointment.patient_age}</p>
                      <p><strong>Gender:</strong> {appointment.patient_gender}</p>
                      {appointment.patient_phone && (
                        <p><strong>Phone:</strong> {appointment.patient_phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="appointment-actions">
                    <button 
                      className="action-btn accept"
                      onClick={() => handleAppointmentAction(appointment.id, 'accepted')}
                    >
                      <FaCheck /> Accept
                    </button>
                    <button 
                      className="action-btn modify"
                      onClick={() => handleAppointmentAction(appointment.id, 'modified')}
                    >
                      <FaEdit /> Modify
                    </button>
                    <button 
                      className="action-btn reject"
                      onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="video-requests">
              {videoRequests.map(request => (
                <div key={request.id} className="video-request-card">
                  <div className="request-info">
                    <h4>Video Call Request</h4>
                    <p><strong>Patient:</strong> {request.patient_name}</p>
                    <p><strong>Age:</strong> {request.patient_age}</p>
                    <p><strong>Gender:</strong> {request.patient_gender}</p>
                    <p><strong>Request Time:</strong> {formatDate(request.request_time)} {formatTime(request.request_time)}</p>
                  </div>
                  {request.status === 'pending' && (
                    <div className="request-actions">
                      <button 
                        className="action-btn accept"
                        onClick={() => handleVideoRequest(request.id, 'accept', request.patient_id)}
                      >
                        <FaCheck /> Accept Call
                      </button>
                      <button 
                        className="action-btn reject"
                        onClick={() => handleVideoRequest(request.id, 'reject', request.patient_id)}
                      >
                        <FaTimes /> Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <nav className="bottom-nav">
            <Link to="/doctor-dashboard" className="nav-item active">
              <FaHome />
              <span>Dashboard</span>
            </Link>
            <Link to="/doctor-appointments" className="nav-item">
              <FaCalendarAlt />
              <span>Schedule</span>
            </Link>
            <Link to="/doctor-notifications" className="nav-item">
              <FaBell />
              <span>Notifications</span>
            </Link>
            <Link to="/doctor-profile" className="nav-item">
              <FaUser />
              <span>Profile</span>
            </Link>
          </nav>
        </>
      )}
    </div>
  );
};

export default DoctorDashboard;

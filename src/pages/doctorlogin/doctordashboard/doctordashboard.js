import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope, FaCheck, FaTimes, FaEdit, FaVideo } from 'react-icons/fa';
import './doctordashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [videoRequests, setVideoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState(null);
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

  // Move all other function declarations here, before any JSX
  const fetchAppointments = async () => {
    const storedDoctorData = JSON.parse(localStorage.getItem('doctorData'));
    if (!storedDoctorData?.id) {
      console.error('Doctor ID not found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://lyco.loca.lt/appoint/doctor/${storedDoctorData.id}/appointments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data); // Updated to match response structure
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  // Update the appointments display section
  <div className="appointments-list">
    {appointments.map(appointment => (
      <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
        <div className="appointment-info">
          <h3>{appointment.patient_name}</h3>
          <div className="appointment-details">
            <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {appointment.time_slot}</p>
            <p><strong>Age:</strong> {appointment.patient_age}</p>
            <p><strong>Gender:</strong> {appointment.patient_gender}</p>
            {appointment.patient_phone && (
              <p><strong>Phone:</strong> {appointment.patient_phone}</p>
            )}
          </div>
        </div>
        <div className="appointment-actions">
          {appointment.status === 'pending' && (
            <>
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
            </>
          )}
        </div>
      </div>
    ))}
  </div>

  const fetchVideoRequests = async () => {
    const storedDoctorData = JSON.parse(localStorage.getItem('doctorData'));
    if (!storedDoctorData?.id) {
      console.error('Doctor ID not found');
      return;
    }

    try {
      const response = await fetch(`https://lyco.loca.lt/api/doctor/${storedDoctorData.id}/video-requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setVideoRequests(data.data); // Updated to match response structure
      }
    } catch (error) {
      console.error('Error fetching video requests:', error);
    }
  };

  // Update the video requests section in the return statement
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
              onClick={() => handleVideoRequest(request.id, 'accept')}
            >
              <FaCheck /> Accept Call
            </button>
            <button 
              className="action-btn reject"
              onClick={() => handleVideoRequest(request.id, 'reject')}
            >
              <FaTimes /> Decline
            </button>
          </div>
        )}
      </div>
    ))}
  </div>

  const handleAppointmentAction = async (id, action) => {
    try {
      const response = await fetch(`https://lyco.loca.lt/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: action })
      });
      const data = await response.json();
      if (data.success) {
        fetchAppointments(); // Refresh appointments after action
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleVideoRequest = async (requestId, action) => {
    try {
      const response = await fetch(`https://lyco.loca.lt/api/video-call/${requestId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        if (action === 'accept') {
          navigate(`/doctor/video-call/${requestId}`);
        }
        fetchVideoRequests();
      }
    } catch (error) {
      console.error('Error handling video request:', error);
    }
  };

  useEffect(() => {
    // Get doctor data from localStorage
    const storedDoctorData = localStorage.getItem('doctorData');
    if (storedDoctorData) {
      const parsedData = JSON.parse(storedDoctorData);
      setDoctorData(parsedData);
    }
    fetchAppointments();
    const checkVideoRequests = setInterval(fetchVideoRequests, 5000);

    return () => clearInterval(checkVideoRequests);
  }, []);

  // Then the return statement with JSX
  return (
    <div className="app-container">
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
                <p>Patient: {request.patient_name}</p>
                <p>Time: {new Date(request.created_at).toLocaleTimeString()}</p>
              </div>
              <div className="request-actions">
                <button 
                  className="action-btn accept"
                  onClick={() => handleVideoRequest(request.id, 'accept')}
                >
                  <FaCheck /> Accept Call
                </button>
                <button 
                  className="action-btn reject"
                  onClick={() => handleVideoRequest(request.id, 'reject')}
                >
                  <FaTimes /> Decline
                </button>
              </div>
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
    </div>
  );
};

export default DoctorDashboard;
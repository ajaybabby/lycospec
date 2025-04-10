import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope, FaCheck, FaTimes, FaEdit, FaVideo } from 'react-icons/fa';
import './doctordashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-02-20',
      time: '10:00 AM',
      status: 'pending',
      type: 'Regular',
      symptoms: 'Fever and headache'
    },
    {
      id: 2,
      patientName: 'Sarah Smith',
      date: '2024-02-20',
      time: '11:30 AM',
      status: 'pending',
      type: 'Video Consultation',
      symptoms: 'Chronic back pain'
    },
    // Add more appointments as needed
  ]);

  const handleAppointmentAction = (id, action) => {
    setAppointments(appointments.map(apt => {
      if (apt.id === id) {
        return { ...apt, status: action };
      }
      return apt;
    }));
  };

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
            <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
              <div className="appointment-info">
                <h3>{appointment.patientName}</h3>
                <div className="appointment-details">
                  <p><strong>Date:</strong> {appointment.date}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Type:</strong> {appointment.type}</p>
                  <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
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
                {appointment.type === 'Video Consultation' && (
                  <Link to={`/video-call/${appointment.id}`} className="action-btn video">
                    <FaVideo /> Join Call
                  </Link>
                )}
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
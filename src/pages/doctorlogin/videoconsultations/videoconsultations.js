import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope, FaVideo } from 'react-icons/fa';
import './videoconsultations.css';

const VideoConsultations = () => {
  const [videoAppointments, setVideoAppointments] = useState([
    {
      id: 1,
      patientName: 'Sarah Smith',
      date: '2024-02-20',
      time: '11:30 AM',
      status: 'scheduled',
      symptoms: 'Chronic back pain',
      meetingId: 'meet-123-456'
    },
    // Add more video appointments
  ]);

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
        <div className="video-consultations-header">
          <h2>Video Consultations</h2>
        </div>

        <div className="video-appointments-list">
          {videoAppointments.map(appointment => (
            <div key={appointment.id} className="video-appointment-card">
              <div className="appointment-info">
                <h3>{appointment.patientName}</h3>
                <div className="appointment-details">
                  <p><strong>Date:</strong> {appointment.date}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Meeting ID:</strong> {appointment.meetingId}</p>
                  <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
                </div>
              </div>
              <div className="video-actions">
                <Link to={`/video-call/${appointment.id}`} className="join-call-btn">
                  <FaVideo /> Join Video Call
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/doctor-dashboard" className="nav-item">
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

export default VideoConsultations;
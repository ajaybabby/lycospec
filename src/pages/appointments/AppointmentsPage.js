import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaClock, FaUser, FaHospital, FaEnvelope } from 'react-icons/fa';
import './AppointmentsPage.css';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('https://councils-mrna-flashers-mentioned.trycloudflare.com/appoint/appointments');
      const result = await response.json();
      if (result.success) {
        setAppointments(result.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  // Convert 24-hour format to 12-hour format
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="appointments-page">
      <div className="app-header">
        <img src="/logo.png" alt="LycoSpec" className="app-logo" />
        <Link to="/messages" className="message-icon">
          <FaEnvelope />
          <span className="message-badge">2</span>
        </Link>
      </div>

      <div className="container">
        <h1 className="page-title">My Appointments</h1>
        
        {loading ? (
          <div className="loading">Loading appointments...</div>
        ) : (
          <div className="appointments-list">
            {appointments.map((appointment, index) => (
              <div key={index} className="appointment-card">
                <div className="appointment-header">
                  <div className="time-info">
                    <FaClock className="icon" />
                    <span className="time">{formatTime(appointment.time_slot)}</span>
                  </div>
                </div>
                
                <div className="appointment-details">
                  <div className="detail-item">
                    <FaUser className="icon" />
                    <span className="doctor-name">{appointment.doctor_name}</span>
                  </div>
                  <div className="detail-item">
                    <FaHospital className="icon" />
                    <span className="hospital-name">{appointment.hospital_name}</span>
                  </div>
                  <div className="detail-item patient-info">
                    <span>Patient: {appointment.patient_name}</span>
                  </div>
                </div>
                
                <div className="appointment-actions">
                  <button className="btn-reschedule">Reschedule</button>
                  <button className="btn-cancel">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheck, FaEnvelope } from 'react-icons/fa';
import './BookingPage.css';

const BookingPage = () => {
  const { doctorId } = useParams();
  const [selectedDate, setSelectedDate] = useState('today');

  const doctor = {
    name: 'Dr. N Satish Varma',
    qualification: 'BDS, MDS - Orthodontics',
    specialization: 'Orthodontist',
    experience: '28 Years Experience Overall',
    verified: true,
    rating: '99%',
    patientCount: '441 patients',
    clinic: 'Smiles Dental Clinic',
    location: 'Dwarakanagar',
    fee: '₹200',
    image: '/doctor.jpg'
  };

  const timeSlots = {
    afternoon: [
      { time: '12:30 PM', available: true },
      { time: '12:45 PM', available: true }
    ],
    evening: [
      { time: '04:30 PM', available: true },
      { time: '04:45 PM', available: true },
      { time: '05:15 PM', available: true },
      { time: '05:30 PM', available: true },
      { time: '05:45 PM', available: true },
      { time: '06:15 PM', available: true },
      { time: '06:45 PM', available: true },
      { time: '07:00 PM', available: true }
    ]
  };

  return (
    <div className="booking-page">
      <div className="app-header">
        <img src="/logo.png" alt="LycoSpec" className="app-logo" />
        <Link to="/messages" className="message-icon">
          <FaEnvelope />
          <span className="message-badge">2</span>
        </Link>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <select defaultValue="">
            <option value="">Select Location</option>
            <option value="vizag">Visakhapatnam</option>
          </select>
          <select defaultValue="">
            <option value="">Select Speciality</option>
            <option value="dentist">Dentist</option>
          </select>
          <input type="text" placeholder="Search doctors, clinics..." />
        </div>
      </div>

      <div className="booking-content">
        <div className="doctor-details">
          <div className="doctor-profile">
            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
            <div className="doctor-info">
              <h2>{doctor.name}</h2>
              <p className="qualification">{doctor.qualification}</p>
              <p className="specialization">{doctor.specialization}</p>
              <p className="experience">{doctor.experience}</p>
              {doctor.verified && (
                <div className="verification">
                  <FaCheck className="verify-icon" /> Medical Registration Verified
                </div>
              )}
              <div className="rating-info">
                <span className="rating">{doctor.rating}</span>
                <span className="patient-count">({doctor.patientCount})</span>
              </div>
            </div>
          </div>

          <div className="clinic-info">
            <h3>{doctor.clinic}</h3>
            <p className="location">
              <FaMapMarkerAlt /> {doctor.location}
            </p>
            <p className="fee">₹{doctor.fee} Consultation fee</p>
          </div>
        </div>

        <div className="appointment-slots">
          <h3>Pick a time slot</h3>
          <div className="date-selector">
            <button 
              className={selectedDate === 'today' ? 'active' : ''} 
              onClick={() => setSelectedDate('today')}
            >
              Today
              <span className="slot-count">13 Slots Available</span>
            </button>
            <button 
              className={selectedDate === 'tomorrow' ? 'active' : ''} 
              onClick={() => setSelectedDate('tomorrow')}
            >
              Tomorrow
              <span className="slot-count">19 Slots Available</span>
            </button>
          </div>

          <div className="time-slots">
            <div className="slot-section">
              <h4>Afternoon (2 slots)</h4>
              <div className="slots-grid">
                {timeSlots.afternoon.map((slot, index) => (
                  <button key={index} className="time-slot">
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            <div className="slot-section">
              <h4>Evening (11 slots)</h4>
              <div className="slots-grid">
                {timeSlots.evening.map((slot, index) => (
                  <button key={index} className="time-slot">
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
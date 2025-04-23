import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheck, FaEnvelope } from 'react-icons/fa';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const doctorInfo = location.state?.doctorInfo;
  const navigate = useNavigate();
  
  // Replace the static doctor object with passed data
  const doctor = {
    name: doctorInfo?.name || 'N/A',
    qualification: doctorInfo?.qualification || 'N/A',
    specialization: doctorInfo?.specialization || 'N/A',
    experience: doctorInfo?.experience || 'N/A',
    verified: true,
    rating: '99%',
    patientCount: '441 patients',
    clinic: doctorInfo?.hospital || 'N/A',
    location: doctorInfo?.area || 'N/A',
    fee: `₹${doctorInfo?.consultationFee || 'N/A'}`,
    image: doctorInfo?.image || '/doctor.jpg'
  };
  const { doctorId } = useParams();
  const [selectedDate, setSelectedDate] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  

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

  // Add these state variables at the top with other states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patientId, setPatientId] = useState(null);

  // Add this function after other state declarations
  // Add useEffect to check token on component mount
  useEffect(() => {
    checkPatientLogin();
  }, []);

  const checkPatientLogin = () => {
    const token = localStorage.getItem('patientToken');
    console.log('Raw token:', token); // Log the raw token
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded token payload:', payload);
        setIsLoggedIn(true);
        setPatientId(payload.patientId);
        console.log('Extracted patient ID:', payload.patientId);
      } catch (error) {
        console.error('Token decoding error:', error);
        console.log('Invalid token content:', token);
      }
    } else {
      console.log('No token found in localStorage');
    }
  };

  // Modify handleTimeSlotClick to include login check
  const handleTimeSlotClick = (time) => {
    const [timeValue, period] = time.split(' ');
    const [hours, minutes] = timeValue.split(':');
    let formattedHours = parseInt(hours);
    
    if (period === 'PM' && formattedHours !== 12) {
      formattedHours += 12;
    } else if (period === 'AM' && formattedHours === 12) {
      formattedHours = 0;
    }

    const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes}:00`;
    setSelectedTime(formattedTime);
    checkPatientLogin(); // Check login status
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bookingData.name.trim()) newErrors.name = 'Name is required';
    if (!bookingData.age) newErrors.age = 'Age is required';
    if (!bookingData.gender) newErrors.gender = 'Gender is required';
    if (!bookingData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(bookingData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async () => {
    if (isLoggedIn || validateForm()) {
      try {
        const bookingDetails = {
          doctor_id: doctorInfo?.id,
          appointment_date: selectedDate,
          time_slot: selectedTime,
          ...(isLoggedIn ? { patient_id: patientId } : {
            patient_name: bookingData.name,
            patient_age: bookingData.age,
            patient_gender: bookingData.gender,
            patient_email: bookingData.email
          })
        };

        const response = await fetch('http://localhost:5000/appoint/book-appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingDetails)
        });

        if (!response.ok) {
          throw new Error('Failed to book appointment');
        }

        const result = await response.json();
        console.log('Booking successful:', result);
        setShowModal(false);
        navigate('/appointments');
      } catch (error) {
        console.error('Booking error:', error);
      }
    }
  };

  const renderTimeSlot = (slot) => (
    <button 
      className="btn btn-outline-secondary w-100"
      onClick={() => handleTimeSlotClick(slot.time)}
    >
      {slot.time}
    </button>
  );

  return (
    <div className="booking-page container-fluid">
      <div className="app-header">
        <img src="/logo.png" alt="LycoSpec" className="app-logo" />
        <Link to="/messages" className="message-icon">
          <FaEnvelope />
          <span className="message-badge">2</span>
        </Link>
      </div>

      <div className="search-section">
        <div className="search-bar row g-2">
          <div className="col-md-3">
            <select className="form-select" defaultValue="">
              <option value="">Select Location</option>
              <option value="vizag">Visakhapatnam</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" defaultValue="">
              <option value="">Select Speciality</option>
              <option value="dentist">Dentist</option>
            </select>
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Search doctors, clinics..." />
          </div>
        </div>
      </div>

      <div className="booking-content container">
        <div className="row">
          <div className="col-lg-6">
            <div className="doctor-details card mb-4">
              <div className="card-body">
                <div className="doctor-profile">
                  <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                  <div className="doctor-info">
                    <h2>{doctor.name}</h2>
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

                <div className="clinic-info mt-4">
                  <h3>{doctor.clinic}</h3>
                  <p className="location">
                    <FaMapMarkerAlt /> {doctor.location}
                  </p>
                  <p className="fee">{doctor.fee} Consultation fee</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="appointment-slots card">
              <div className="card-body">
                <h3>Pick a time slot</h3>
                <div className="date-selector d-flex gap-3 mb-4">
                  <button 
                    className={`btn btn-outline-primary flex-grow-1 ${selectedDate === 'today' ? 'active' : ''}`}
                    onClick={() => setSelectedDate('today')}
                  >
                    Today
                    <span className="slot-count d-block">13 Slots Available</span>
                  </button>
                  <button 
                    className={`btn btn-outline-primary flex-grow-1 ${selectedDate === 'tomorrow' ? 'active' : ''}`}
                    onClick={() => setSelectedDate('tomorrow')}
                  >
                    Tomorrow
                    <span className="slot-count d-block">19 Slots Available</span>
                  </button>
                </div>

                <div className="time-slots">
                  <div className="slot-section">
                    <h4 className="mb-3">Afternoon (2 slots)</h4>
                    <div className="row g-3">
                      {timeSlots.afternoon.map((slot, index) => (
                        <div className="col-4" key={index}>
                          {renderTimeSlot(slot)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="slot-section mt-4">
                    <h4 className="mb-3">Evening (11 slots)</h4>
                    <div className="row g-3">
                      {timeSlots.evening.map((slot, index) => (
                        <div className="col-4" key={index}>
                          {renderTimeSlot(slot)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal here */}
      {showModal && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <h3>Book Appointment</h3>
            <p className="selected-time">Selected Time: {selectedTime}</p>
            
            {!isLoggedIn ? (
              // Show full form for non-logged in users
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={bookingData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            ) : (
              // Show only patient ID for logged in users
              <div className="logged-in-confirmation">
                <p>Patient ID: lyco{patientId}</p>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleBooking}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope } from 'react-icons/fa';
import './home.css';

const Home = () => {
  const specializations = [
    { id: 1, name: 'Oncology', rating: 4.8, doctors: 25 },
    { id: 2, name: 'Cardiology', rating: 4.9, doctors: 30 },
    { id: 3, name: 'Neurology', rating: 4.7, doctors: 20 },
    { id: 4, name: 'Pediatrics', rating: 4.8, doctors: 28 },
  ];

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
        <div className="search-bar">
          <input type="text" placeholder="Search doctors, specializations..." />
        </div>

        <h2 className="section-title">Specializations</h2>
        <div className="specialization-scroll">
          {specializations.map(spec => (
            <div key={spec.id} className="spec-card">
              <h3>{spec.name}</h3>
              <div className="spec-info">
                <span className="rating">★ {spec.rating}</span>
                <span className="doctor-count">{spec.doctors} Doctors</span>
              </div>
            </div>
          ))}
        </div>

        <div className="cards-row">
          <div className="nearby-doctors">
            <div className="map-preview">
              <h2>Find Doctors Near You</h2>
              <p>20+ doctors available in your area</p>
              <Link to="/map" className="view-map-btn">View Map</Link>
            </div>
          </div>

          <div className="video-consult">
            <div className="video-preview">
              <h2>Instant Video Consultation</h2>
              <p>Connect within 60 secs</p>
              <Link to="/video-consult" className="view-map-btn">Consult Now</Link>
            </div>
          </div>
        </div>

        <div className="online-consultation">
          <h2 className="section-title">Consult Top Doctors Online</h2>
          <p className="section-subtitle">Private online consultations with verified doctors</p>
          
          <div className="consult-scroll">
            <Link to="/consult/pregnancy" className="consult-card">
              <div className="consult-content">
                <img src="peroid.jpg" alt="Pregnancy" className="consult-image" />
                <h3>Period doubts or Pregnancy</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
            <Link to="/consult/skin" className="consult-card">
              <div className="consult-content">
                <img src="skin.jpg" alt="Skin Care" className="consult-image" />
                <h3>Acne, pimple or skin issues</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
            <Link to="/consult/performance" className="consult-card">
              <div className="consult-content">
                <img src="performance.jpg" alt="Performance" className="consult-image" />
                <h3>Performance issues in bed</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
            <Link to="/consult/cold" className="consult-card">
              <div className="consult-content">
                <img src="cold.png" alt="Cold" className="consult-image" />
                <h3>Cold, cough or fever</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
            <Link to="/consult/child" className="consult-card">
              <div className="consult-content">
                <img src="child.jpg" alt="Child" className="consult-image" />
                <h3>Child not feeling well</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
            <Link to="/consult/mental" className="consult-card">
              <div className="consult-content">
                <img src="mental.jpg" alt="Mental" className="consult-image" />
                <h3>Depression or anxiety</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
          </div>
        </div>
        {/* After online consultation section */}
            <div className="clinic-consultation">
              <h2 className="section-title">Book an appointment in clinics</h2>
              <div className="clinic-scroll">
                <Link to="/clinic/dentist" className="clinic-card">
                  <div className="clinic-content">
                    <img src="dentist.jpg" alt="Dentist" className="clinic-image" />
                    <h3>Dentist</h3>
                    <p>Teeth troubles & dental care</p>
                  </div>
                </Link>
                <Link to="/clinic/orthopedic" className="clinic-card">
                  <div className="clinic-content">
                    <img src="orthopedic.jpg" alt="Orthopedic" className="clinic-image" />
                    <h3>Orthopedic</h3>
                    <p>Bone & joint issues</p>
                  </div>
                </Link>
                <Link to="/clinic/cardiologist" className="clinic-card">
                  <div className="clinic-content">
                    <img src="cardiologist.jpg" alt="Cardiologist" className="clinic-image" />
                    <h3>Cardiologist</h3>
                    <p>Heart & blood pressure</p>
                  </div>
                </Link>
                <Link to="/clinic/pediatrician" className="clinic-card">
                  <div className="clinic-content">
                    <img src="pediatrician.jpg" alt="Pediatrician" className="clinic-image" />
                    <h3>Pediatrician</h3>
                    <p>Child specialists</p>
                  </div>
                </Link>
                <Link to="/clinic/gynecologist" className="clinic-card">
                  <div className="clinic-content">
                    <img src="gynic.jpg" alt="Gynecologist" className="clinic-image" />
                    <h3>Gynecologist</h3>
                    <p>Women's health</p>
                  </div>
                </Link>
                <Link to="/clinic/neurologist" className="clinic-card">
                  <div className="clinic-content">
                    <img src="neuro.jpg" alt="Neurologist" className="clinic-image" />
                    <h3>Neurologist</h3>
                    <p>Brain & nerve issues</p>
                  </div>
                </Link>
              </div>
            </div>
      </div>
      <nav className="bottom-nav">
        <Link to="/" className="nav-item active">
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
    </div>
  );
};

export default Home;
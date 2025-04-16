import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope } from 'react-icons/fa';
import './home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: ''
  });

  // Add these functions near the top of your component
  const sendLoginOTP = async (email) => {
    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email ,userType:'patient'}),
      });
      const data = await response.json();
      if (data.success) {
        setLoginStep('otp');
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.success) {
        // Store token if provided
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setShowLoginModal(false);
        setLoginStep('input');
        setContactInfo('');
        setOtp('');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP. Please try again.');
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setShowLoginModal(false);
        setIsRegistering(false);
        setRegisterData({ name: '', phone: '', age: '', gender: '' });
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. Please try again.');
    }
  };

  // Update handleLogin function
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (registerData.name && registerData.phone && registerData.age && registerData.gender) {
        await registerUser(registerData);
      }
    } else if (loginStep === 'input') {
      if (contactInfo.trim()) {
        await sendLoginOTP(contactInfo);
      }
    } else {
      if (otp.trim()) {
        await verifyOTP(contactInfo, otp);
      }
    }
  };
  const [loginStep, setLoginStep] = useState('input');
  const [contactInfo, setContactInfo] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-wrapper')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const specializations = [
    { id: 1, name: 'Oncology', rating: 4.8, doctors: 25 },
    { id: 2, name: 'Cardiology', rating: 4.9, doctors: 30 },
    { id: 3, name: 'Neurology', rating: 4.7, doctors: 20 },
    { id: 4, name: 'Pediatrics', rating: 4.8, doctors: 28 },
    { id: 5, name: 'Orthopedics', rating: 4.6, doctors: 18 },
    { id: 6, name: 'Gynaecologist', rating: 4.5, doctors: 15 },
    { id: 7, name: 'Dermatology', rating: 4.4, doctors: 12 },
    { id: 8, name: 'Psychiatrist', rating: 4.3, doctors: 10 },
    { id: 9, name: 'ENT', rating: 4.2, doctors: 8 },
    { id: 10, name: 'Urology', rating: 4.1, doctors: 6 },
    { id: 11, name: 'Radiology', rating: 4.0, doctors: 4 },
    { id: 12, name: 'Urology', rating: 4.1, doctors: 6 },
    { id: 13, name: 'Radiology', rating: 4.0, doctors: 4 },






  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-wrapper')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  return (
    <div className="app-container">
      <div className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <img src="/logo.png" alt="LycoSpec" className="app-logo" />
        {isScrolled && (
          <input
            type="text"
            placeholder="Search doctors, specializations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-header"
          />
        )}
        <div className="header-right">
          <Link to="/doctors" className="header-link">Doctors</Link>
          <Link to="/messages" className="message-icon">
            <FaEnvelope />
            <span className="message-badge">2</span>
          </Link>
          <button onClick={() => setShowLoginModal(true)} className="login-link">Login</button>
        </div>
      </div>

      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <button className="close-btn" onClick={() => {
              setShowLoginModal(false);
              setLoginStep('input');
              setIsRegistering(false);
            }}>×</button>
            <img src="/logo.png" alt="LycoSpec" className="modal-logo" />
            <h2>{isRegistering ? 'Create Account' : (loginStep === 'input' ? 'Welcome Back' : 'Verify OTP')}</h2>
            <form onSubmit={handleLogin}>
              {isRegistering ? (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    className="login-input"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                    className="login-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={registerData.age}
                    onChange={(e) => setRegisterData({...registerData, age: e.target.value})}
                    className="login-input"
                    required
                    min="1"
                    max="120"
                  />
                  <select
                    value={registerData.gender}
                    onChange={(e) => setRegisterData({...registerData, gender: e.target.value})}
                    className="login-input"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </>
              ) : (
                loginStep === 'input' ? (
                  <input
                    type="text"
                    placeholder="Enter Email or Phone"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="login-input"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="login-input"
                    required
                    maxLength="6"
                  />
                )
              )}
              <button type="submit" className="login-submit-btn">
                {isRegistering ? 'Create Account' : (loginStep === 'input' ? 'Continue' : 'Verify OTP')}
              </button>
              {loginStep === 'input' && (
                <button 
                  type="button" 
                  className="switch-auth-btn"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? 'Already have an account? Sign in' : 'New to LycoSpec? Create account'}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className={`search-container ${isScrolled ? 'hidden' : ''}`}>
          <input
            type="text"
            placeholder="Search doctors, specializations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
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
          <Link to="/video-consult" className="service-card">
            <img src="/vedio-consult.jpg" alt="Video Consultation" className="service-image" />
            <div className="service-content">
              <h2>Instant Video Consultation</h2>
              <p>Connect within 60 secs</p>
            </div>
          </Link>

          <Link to="/hospitalmap" className="service-card">
            <img src="/map.jpg" alt="Find Doctors" className="service-image" />
            <div className="service-content">
              <h2>Find Doctors Near You</h2>
              <p>Confirmed appointments</p>
            </div>
          </Link>
        </div>

        <div className="online-consultation">
          <h2 className="section-title">Consult Top Doctors Online</h2>
          <p className="section-subtitle">Private online consultations with verified doctors</p>
          
          <div className="consult-scroll">
            <Link to="/consultation" className="consult-card">
              <div className="consult-content">
                <img src="peroid.jpg" alt="Pregnancy" className="consult-image" />
                <h3>Period doubts or Pregnancy</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
            <Link to="/consultation" className="consult-card">
              <div className="consult-content">
                <img src="skin.jpg" alt="Skin Care" className="consult-image" />
                <h3>Acne, pimple or skin issues</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
            <Link to="/consultation" className="consult-card">
              <div className="consult-content">
                <img src="performance.jpg" alt="Performance" className="consult-image" />
                <h3>Performance issues in bed</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
            <Link to="/consultation" className="consult-card">
              <div className="consult-content">
                <img src="cold.png" alt="Cold" className="consult-image" />
                <h3>Cold, cough or fever</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
            <Link to="/consultation" className="consult-card">
              <div className="consult-content">
                <img src="child.jpg" alt="Child" className="consult-image" />
                <h3>Child not feeling well</h3>
                <button className="consult-btn">CONSULT NOW</button>
              </div>
            </Link>
            <Link to="/consultation" className="consult-card">
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
                <Link to="/doctors" state={{ selectedSpeciality: "Dentist" }} className="clinic-card">
                  <div className="clinic-content">
                    <img src="dentist.jpg" alt="Dentist" className="clinic-image" />
                    <h3>Dentist</h3>
                    <p>Teeth troubles & dental care</p>
                  </div>
                </Link>
                <Link to="/doctors" state={{ selectedSpeciality: "Orthopedics" }} className="clinic-card">
                  <div className="clinic-content">
                    <img src="orthopedic.jpg" alt="Orthopedic" className="clinic-image" />
                    <h3>Orthopedic</h3>
                    <p>Bone & joint issues</p>
                  </div>
                </Link>
                {/* Update remaining clinic cards similarly */}
                <Link to="/doctors" state={{ selectedSpeciality: "Cardiology" }} className="clinic-card">
                  <div className="clinic-content">
                    <img src="cardiologist.jpg" alt="Cardiologist" className="clinic-image" />
                    <h3>Cardiologist</h3>
                    <p>Heart & blood pressure</p>
                  </div>
                </Link>
                <Link to="/doctors"  state={{ selectedSpeciality: "Pediatrics" }} className="clinic-card">
                  <div className="clinic-content">
                    <img src="pediatrician.jpg" alt="Pediatrician" className="clinic-image" />
                    <h3>Pediatrician</h3>
                    <p>Child specialists</p>
                  </div>
                </Link>
                <Link to="/doctors"state={{ selectedSpeciality: "Gynaecology" }} className="clinic-card">
                  <div className="clinic-content">
                    <img src="gynic.jpg" alt="Gynecologist" className="clinic-image" />
                    <h3>Gynecologist</h3>
                    <p>Women's health</p>
                  </div>
                </Link>
                <Link to="/doctors" state={{ selectedSpeciality: "Neurology" }} className="clinic-card">
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
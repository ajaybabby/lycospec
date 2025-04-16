import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import './doctorlogin.css';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async () => {
    if (!formData.emailOrPhone) {
      setError('Please enter email or phone number');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.emailOrPhone, userType: 'doctor' })
      });

      if (response.ok) {
        setOtpSent(true);
        setError('');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Error sending OTP. Please try again.');
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.emailOrPhone,
          otp: formData.otp,
          userType: 'doctor'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsOtpVerified(true);
        setError('');
        // Store doctor data in localStorage for persistence
        localStorage.setItem('doctorData', JSON.stringify(data.data));
        // Redirect to dashboard with doctor ID
        navigate(`/doctordashboard`, { 
          state: { doctorData: data.data }
        });
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Error verifying OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      setError('Please verify OTP first');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/doctor-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/doctor-dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="doctor-login-container">
      <div className="doctor-login-box">
        <div className="login-header">
          <img src="/logo.png" alt="LycoSpec" className="login-logo" />
          <h2>Doctor Login</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-with-button">
              <div className="input-icon">
                <FaUser className="icon" />
                <input
                  type="text"
                  name="emailOrPhone"
                  placeholder="Enter Email or Phone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  required
                />
              </div>
              <button 
                type="button" 
                onClick={handleSendOTP}
                disabled={otpSent}
                className="send-otp-button"
              >
                {otpSent ? 'OTP Sent ✓' : 'Send OTP'}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="form-group">
              <div className="input-with-button">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  onClick={verifyOTP}
                  disabled={isOtpVerified}
                  className="verify-otp-button"
                >
                  {isOtpVerified ? 'Verified ✓' : 'Verify'}
                </button>
              </div>
            </div>
          )}

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-button" disabled={!isOtpVerified}>
            Login
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/doctor-register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
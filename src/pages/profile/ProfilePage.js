import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaBell, FaEnvelope, FaEdit } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    phone: '+91 9876543210',
    email: 'john@example.com',
    gender: 'Male'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add API call to save profile data
  };

  return (
    <div className="profile-page">
      <div className="app-header">
        <img src="/logo.png" alt="LycoSpec" className="app-logo" />
        <Link to="/messages" className="message-icon">
          <FaEnvelope />
          <span className="message-badge">2</span>
        </Link>
      </div>

      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile</h1>
          <button onClick={handleEdit} className="edit-button">
            <FaEdit /> Edit
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-field">
            <label>Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            ) : (
              <p>{profile.name}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            ) : (
              <p>{profile.phone}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Gender</label>
            {isEditing ? (
              <select
                value={profile.gender}
                onChange={(e) => setProfile({...profile, gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p>{profile.gender}</p>
            )}
          </div>

          {isEditing && (
            <button onClick={handleSave} className="save-button">
              Save Changes
            </button>
          )}
        </div>
      </div>

      <nav className="bottom-nav">
        <Link to="/" className="nav-item">
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
        <Link to="/profile" className="nav-item active">
          <FaUser />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default ProfilePage;
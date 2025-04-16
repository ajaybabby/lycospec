import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home2.css';

const Home2 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const specializations = [
    {
      id: 1,
      title: "Oncology",
      description: "Cancer diagnosis and treatment",
      color: "#FF6B6B",
      cases: "1.2k+ cases"
    },
    {
      id: 2,
      title: "Neurology",
      description: "Brain and nervous system",
      color: "#4ECDC4",
      cases: "890+ cases"
    },
    {
      id: 3,
      title: "Cardiology",
      description: "Heart and cardiovascular care",
      color: "#FF9F43",
      cases: "2.1k+ cases"
    },
    {
      id: 4,
      title: "Pulmonology",
      description: "Respiratory system specialists",
      color: "#45B7D1",
      cases: "750+ cases"
    },
    {
      id: 5,
      title: "Nephrology",
      description: "Kidney care specialists",
      color: "#6C5CE7",
      cases: "600+ cases"
    },
    {
      id: 6,
      title: "Orthopedics",
      description: "Bone and joint specialists",
      color: "#A8E6CF",
      cases: "1.5k+ cases"
    },
    {
      id: 7,
      title: "Gastroenterology",
      description: "Digestive system care",
      color: "#FFB6B9",
      cases: "980+ cases"
    },
    {
      id: 8,
      title: "Psychiatry",
      description: "Mental health specialists",
      color: "#957DAD",
      cases: "850+ cases"
    }
  ];

  const filteredSpecializations = specializations.filter(spec =>
    spec.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <img src="/logo.png" alt="LycoSpec" className="app-logo" />
        {isScrolled && (
          <input
            type="text"
            placeholder="Search specializations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-header"
          />
        )}
      </div>

      <div className="specializations-container">
        <div className={`search-container ${isScrolled ? 'hidden' : ''}`}>
          <input
            type="text"
            placeholder="Search specializations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="specializations-grid">
          {filteredSpecializations.map((spec) => (
            <div className="specialization-card" key={spec.id}>
              <div className="card-color-bar" style={{ backgroundColor: spec.color }}></div>
              <h3>{spec.title}</h3>
              <p>{spec.description}</p>
              <div className="card-footer">
                <span className="cases">{spec.cases}</span>
                <button className="explore-btn">Explore</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home2;
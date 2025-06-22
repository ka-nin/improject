import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

import logoMain from '../assets/Barangay 176 Logo with Modern Aesthetic and Community Focus.png';
import logoIcon from '../assets/Barangay 176 Logo with Modern Aesthetic and Community Focus (1).png';
import logoSearch from '../assets/Barangay 176 Logo with Modern Aesthetic and Community Focus (3).png';
import logoClock from '../assets/Barangay 176 Logo with Modern Aesthetic and Community Focus (2).png';
import headerImage from '../assets/boni-edsa-mgcq_2020-11-10_08-44-26.jpg';

function MainPage() {
  const navigate = useNavigate(); 

  useEffect(() => {
    const updateTimeDate = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const timeString = now.toLocaleDateString('en-US', options);
      const timeElement = document.getElementById('timeDate');
      if (timeElement) timeElement.textContent = timeString;
    };

    updateTimeDate();
    const interval = setInterval(updateTimeDate, 1000);

    const handleClickOutside = (event) => {
      const menuIcon = document.querySelector('.menu-icon');
      const dropdown = document.getElementById('dropdownMenu');
      if (dropdown && !menuIcon.contains(event.target)) {
        dropdown.classList.remove('show');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) dropdown.classList.toggle('show');
  };

  const adminLogin = () => {
    navigate('/login'); 
  };

  return (
    <div className="container">
      <div
        className="landscape-image"
        style={{ backgroundImage: `url(${headerImage})` }}
      >
        <div className="landscape-overlay"></div>
      </div>

      <div className="content-wrapper">
        <div className="header">
          <div className="time-date-container">
            <div
              className="clock-icon"
              style={{ backgroundImage: `url(${logoClock})` }}
            ></div>
            <span className="time-date-text" id="timeDate">TIME AND DATE</span>
          </div>

          <div className="menu-icon" onClick={toggleDropdown}>
            <div className="menu-dot"></div>
            <div className="menu-dot"></div>
            <div className="menu-dot"></div>

            <div className="dropdown-menu" id="dropdownMenu">
              <div className="dropdown-item" onClick={adminLogin}>
                <span className="icon">⚙️</span>
                <span>Admin Login</span>
              </div>
            </div>
          </div>
        </div>

          <div
            className="main-logo"
            style={{ backgroundImage: `url(${logoMain})`}}
          ></div>
          <div className="projects-title">PROJECTS AND PROGRAMS</div>

      <div className ="iconAndSubtitle">
        <div className="subtitle">
            <span
              className="people-icon"
              style={{ backgroundImage: `url(${logoIcon})` }}
            ></span>
            <span>Manage Barangay Bala Cons Development Initiatives</span>
        </div>
      </div>
          
        
      </div>
    </div>
  );
}

export default MainPage;
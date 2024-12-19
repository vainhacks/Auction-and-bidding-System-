import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Nav() {
  const location = useLocation();
  const [clickedItem, setClickedItem] = useState(null);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/mainDashboard") setClickedItem('dashboard');
    else if (path === "/AddAdvertisement") setClickedItem('addAdvertisement');
    else if (path === "/AdvertisementDetails") setClickedItem('advertisementDetails');
  }, [location]);

  const navStyle = {
    width: '250px',
    position: 'fixed',
    height: '100vh',
    backgroundColor: '#333',
    top: 0, // Ensure it stays at the top
    left: 0, // Align to the left
  };

  const ulStyle = {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    height: '100%',
    overflowY: 'auto', // Allow scrolling if necessary
  };

  const liStyle = {
    padding: '14px 20px',
    textAlign: 'left',
  };

  const linkStyle = {
    fontSize: '18px',
    color: 'white',
    margin: '0',
    padding: '0',
    textDecoration: 'none',
    display: 'block',
    transition: 'color 0.3s ease',
  };

  const buttonContainerStyle = {
    border: '1px solid #444',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  };

  const handleClick = (item) => {
    setClickedItem(item);
  };

  return (
    <div style={navStyle}>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <div
            style={{
              ...buttonContainerStyle,
              backgroundColor: clickedItem === 'dashboard' ? '#444' : '#333',
            }}
            onClick={() => handleClick('dashboard')}
          >
            <Link
              to="/mainDashboard"
              style={{
                ...linkStyle,
                color: clickedItem === 'dashboard' ? 'grey' : 'white',
              }}
            >
              <h1 style={linkStyle}>Dashboard</h1>
            </Link>
          </div>
        </li>
        <li style={liStyle}>
          <div
            style={{
              ...buttonContainerStyle,
              backgroundColor: clickedItem === 'addAdvertisement' ? '#444' : '#333',
            }}
            onClick={() => handleClick('addAdvertisement')}
          >
            <Link
              to="/AddAdvertisement"
              style={{
                ...linkStyle,
                color: clickedItem === 'addAdvertisement' ? 'grey' : 'white',
              }}
            >
              <h1 style={linkStyle}>Add Advertisement</h1>
            </Link>
          </div>
        </li>
        <li style={liStyle}>
          <div
            style={{
              ...buttonContainerStyle,
              backgroundColor: clickedItem === 'advertisementDetails' ? '#444' : '#333',
            }}
            onClick={() => handleClick('advertisementDetails')}
          >
            <Link
              to="/AdvertisementDetails"
              style={{
                ...linkStyle,
                color: clickedItem === 'advertisementDetails' ? 'grey' : 'white',
              }}
            >
              <h1 style={linkStyle}>Advertisement Details</h1>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Nav;

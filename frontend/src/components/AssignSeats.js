import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import axios from 'axios';

export default function AssignSeats() {
  const navigate = useNavigate();
  const location = useRouterLocation(); // Access location to get passed seat data

  const [formData, setFormData] = useState({
    seatId: '',
    bidderId: '',
    name: '',
    email: '',
    location: ''
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [seatId, setSeatId] = useState(null);
  const [seats, setSeats] = useState([]);
  const [existingSeats, setExistingSeats] = useState([]); // Store existing seats

  const [locationsArray] = useState([
    "BMICH",
    "Negombo Regal",
    "Joash Place Maharagama"
  ]);

  useEffect(() => {
    const generateSeatIds = () => {
      const seatIds = [];
      for (let letter = 'A'.charCodeAt(0); letter <= 'H'.charCodeAt(0); letter++) {
        for (let number = 1; number <= 15; number++) {
          seatIds.push(String.fromCharCode(letter) + number);
        }
      }
      return seatIds;
    };

    const fetchSeats = async () => {
      try {
        const response = await axios.get('http://localhost:8070/test1/seats');
        setExistingSeats(response.data);
        setSeats(generateSeatIds()); // Update to use generated seat IDs
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };

    fetchSeats();

    if (location.state && location.state.seat) {
      const seat = location.state.seat;
      setFormData({
        seatId: seat.seatId,
        bidderId: seat.bidderId || '',
        name: seat.name || '',
        email: seat.email || '',
        location: seat.location || ''
      });
      setSeatId(seat._id);
      setIsEditMode(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const isSeatUnique = () => {
    // Check if the selected seat is already assigned in the selected location
    return isEditMode || !existingSeats.some(seat =>
      seat.seatId === formData.seatId && seat.location === formData.location
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.seatId || !formData.location) {
      alert('Please select a seat and location');
      return;
    }

    if (!isSeatUnique()) {
      alert(`Seat ID ${formData.seatId} is already assigned in ${formData.location}.`);
      return;
    }

    try {
      const url = isEditMode
        ? `http://localhost:8070/test1/update/${seatId}`
        : 'http://localhost:8070/test1/seats';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`Seat ${isEditMode ? 'updated' : 'assigned'} successfully`);
        navigate('/Table');
      } else {
        const responseData = await response.json();
        alert(`Failed to ${isEditMode ? 'update' : 'assign'} seat: ${responseData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred while ${isEditMode ? 'updating' : 'assigning'} the seat.`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f7f7f7',
      padding: '10px'
    }}>
      <div style={{
        backgroundColor: '#EDEDEE',
        padding: '20px 40px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '450px',
        border: '2px solid #000000',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Assign Seat Form</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="seatId" style={{ display: 'block', marginBottom: '5px', textAlign: 'left' }}>Seat ID:</label>
            <select
              id="seatId"
              name="seatId"
              value={formData.seatId}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select Seat</option>
              {seats.map(seat => (
                <option key={seat} value={seat}>{seat}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="bidderId" style={{ display: 'block', marginBottom: '5px', textAlign: 'left' }}>Bidder ID:</label>
            <input
              type="text"
              id="bidderId"
              name="bidderId"
              value={formData.bidderId}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', textAlign: 'left' }}>Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', textAlign: 'left' }}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="location" style={{ display: 'block', marginBottom: '5px', textAlign: 'left' }}>Location:</label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select Location</option>
              {locationsArray.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button type="submit" style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}>
              {isEditMode ? 'Update' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/Table')}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                marginLeft: '10px',
              }}
            >
              View Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

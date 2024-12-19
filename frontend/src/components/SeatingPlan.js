import React, { useEffect, useState } from 'react';

const SeatingPlan = () => {
  const [seats, setSeats] = useState([]);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('BMICH'); // Default selection for location

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch('http://localhost:8070/controller/seats');
        if (response.ok) {
          const data = await response.json();
          setSeats(data);
        } else {
          console.error('Failed to fetch seats');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSeats();
  }, []);

  const handleAddClick = () => {
    console.log('Add button clicked');
    // Add functionality here
  };

  const seatingContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px',
  };

  const seatingRowStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '5px',
  };

  const seatStyle = (isAssigned) => ({
    width: '30px',
    height: '30px',
    backgroundColor: isAssigned ? '#f44336' : '#4CAF50',  // Red if assigned, green otherwise
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '5px',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  });

  const seatHoverStyle = {
    backgroundColor: '#3e8e41',
  };

  return (
    <div style={seatingContainerStyle}>

<div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Select Date"
          style={{ marginRight: '10px', padding: '5px', fontSize: '14px' }}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Select Time"
          style={{ marginRight: '10px', padding: '5px', fontSize: '14px' }}
        />
        {/* Dropdown for selecting location */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ padding: '5px', fontSize: '14px' }}
        >
          <option value="BMICH">BMICH</option>
          <option value="Negambo Regal">Negambo Regal</option>
          <option value="Joash Place Maharagama">Joash Place Maharagama</option>
        </select>
        
        </div>
      
      {/* Seating Grid */}
      {rows.map((row) => (
        <div key={row} style={seatingRowStyle}>
          {columns.map((col) => {
            const seat = seats.find(s => s.seatId === `${row}${col}`);
            return (
              <div
                key={col}
                style={seat ? seatStyle(seat.isAssigned) : seatStyle(false)}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = seatHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = seat ? (seat.isAssigned ? '#f44336' : '#4CAF50') : '#4CAF50')}
              >
                {seat ? `${seat.seatId}` : `${row}${col}`}
              </div>
            );
          })}
        </div>
      ))}

      {/* Add Button */}
      <button onClick={handleAddClick} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
        Add Seat
      </button>

      <button onClick={handleAddClick} style={{ marginTop: '20px', padding: '10px 12px', fontSize: '16px' }}>
        Delete Seat
      </button>

    </div>

    
  );
};

export default SeatingPlan;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Table() {
  const [seats, setSeats] = useState([]);
  const navigate = useNavigate();

  // Function to fetch seats from the server
  const fetchSeats = async () => {
    try {
      const response = await fetch('http://localhost:8070/test1/seats');
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

  // Fetch seats when the component mounts
  useEffect(() => {
    fetchSeats();
  }, []);

  // Function to handle updating a seat
  const handleUpdate = (seat) => {
    navigate('/AssignSeats', { state: { seat } });
  };

  // Function to handle deleting a seat
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this seat?');
    if (!confirmed) return;
    try {
      const response = await fetch(`http://localhost:8070/test1/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSeats(); // Refresh the table after deletion
      } else {
        alert('Failed to delete seat');
      }
    } catch (error) {
      console.error('Error deleting seat:', error);
      alert('An error occurred while deleting the seat.');
    }
  };

  // Function to handle navigation
  const handleNavigate = (location) => {
    navigate(`/${location}`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <h1 style={{ marginBottom: '20px', color: '#000000', textAlign: 'center' }}>Seats List</h1>
      <div style={{ position: 'relative' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', color: '#333' }}>
              <th style={{ border: '1px solid #000000', padding: '12px', backgroundColor: '#C7C7C7' }}>Seat ID</th>
              <th style={{ border: '1px solid #000000', padding: '12px', backgroundColor: '#C7C7C7' }}>Bidder ID</th>
              <th style={{ border: '1px solid #000000', padding: '12px', backgroundColor: '#C7C7C7' }}>Name</th>
              <th style={{ border: '1px solid #000000', padding: '12px', backgroundColor: '#C7C7C7' }}>Email</th>
              <th style={{ border: '1px solid #000000', padding: '12px', backgroundColor: '#C7C7C7' }}>Location</th>
              <th style={{ border: '1px solid #000000', padding: '12px', backgroundColor: '#C7C7C7' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {seats.map((seat) => (
              <tr key={seat._id}>
                <td style={{ border: '1px solid #000000', padding: '12px' }}>{seat.seatId}</td>
                <td style={{ border: '1px solid #000000', padding: '12px' }}>{seat.bidderId}</td>
                <td style={{ border: '1px solid #000000', padding: '12px' }}>{seat.name}</td>
                <td style={{ border: '1px solid #000000', padding: '12px' }}>{seat.email}</td>
                <td style={{ border: '1px solid #000000', padding: '12px' }}>{seat.location}</td>
                <td style={{ border: '1px solid #000000', padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleUpdate(seat)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(seat._id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Navigation Buttons */}
        <div style={{ marginLeft: '380px' ,marginTop: '50px', bottom: '0', right: '0', padding: '20px', display: 'flex', flexDirection: 'row', gap: '10px' }}>
          <button onClick={() => handleNavigate('BMICH')} style={navButtonStyle}>Location: BMICH</button>
          <button onClick={() => handleNavigate('NegomboRegal')} style={navButtonStyle}>Location: Negombo Regal</button>
          <button onClick={() => handleNavigate('JoashPlaceMaharagama')} style={navButtonStyle}>Location: Joash Place Maharagama</button>
        </div>
      </div>
    </div>
  );
}

// Navigation button styles
const navButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  textAlign: 'center',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s, transform 0.3s',
};


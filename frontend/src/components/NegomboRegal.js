import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NegomboRegal = () => {
  const [seats, setSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState([]);
  const [numRows, setNumRows] = useState(() => {
    const savedRows = localStorage.getItem('numRows_NegomboRegal');
    return savedRows ? parseInt(savedRows, 10) : 5;
  });
  const [numColumns, setNumColumns] = useState(() => {
    const savedCols = localStorage.getItem('numColumns_NegomboRegal');
    return savedCols ? parseInt(savedCols, 10) : 10;
  });

  const fetchSeats = async () => {
    try {
      const response = await axios.get('http://localhost:8070/test1/seats');
      const filteredSeats = response.data.filter(seat => seat.location === 'Negombo Regal');
      setSeats(filteredSeats);
      generateSeatLayout(filteredSeats, numRows, numColumns);
    } catch (error) {
      console.error('Error fetching Negombo Regal seats:', error);
    }
  };

  const generateSeatLayout = (seatsData, rows, columns) => {
    const layout = Array.from({ length: rows }, (_, rowIndex) => {
      return Array.from({ length: columns }, (_, colIndex) => {
        const seatId = String.fromCharCode(65 + rowIndex) + (colIndex + 1);
        const seatData = seatsData.find(seat => seat.seatId === seatId);
        return {
          seatId,
          isOccupied: !!seatData,
          bidderName: seatData ? seatData.name : '',
        };
      });
    });
    setSeatLayout(layout);
  };

  const addRow = () => {
    setNumRows(prevRows => {
      const newRowCount = prevRows + 1;
      localStorage.setItem('numRows_NegomboRegal', newRowCount);
      generateSeatLayout(seats, newRowCount, numColumns);
      return newRowCount;
    });
  };

  const removeRow = () => {
    if (numRows > 1) {
      setNumRows(prevRows => {
        const newRowCount = prevRows - 1;
        localStorage.setItem('numRows_NegomboRegal', newRowCount);
        generateSeatLayout(seats, newRowCount, numColumns);
        return newRowCount;
      });
    }
  };

  const addColumn = () => {
    setNumColumns(prevCols => {
      const newColCount = prevCols + 1;
      localStorage.setItem('numColumns_NegomboRegal', newColCount);
      generateSeatLayout(seats, numRows, newColCount);
      return newColCount;
    });
  };

  const removeColumn = () => {
    if (numColumns > 1) {
      setNumColumns(prevCols => {
        const newColCount = prevCols - 1;
        const updatedSeats = seats
          .map(seat => {
            const seatId = seat.seatId;
            const rowPart = seatId.charAt(0);
            const colPart = parseInt(seatId.slice(1), 10);

            const newColPart = colPart <= newColCount ? colPart : newColCount;

            return {
              ...seat,
              seatId: `${rowPart}${newColPart}`,
            };
          })
          .filter(seat => parseInt(seat.seatId.slice(1), 10) <= newColCount);

        localStorage.setItem('numColumns_NegomboRegal', newColCount);
        generateSeatLayout(updatedSeats, numRows, newColCount);
        return newColCount;
      });
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  useEffect(() => {
    generateSeatLayout(seats, numRows, numColumns);
  }, [numRows, numColumns, seats]);

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Seating Plan - Negombo Regal</h2>
      <div style={{ ...seatingContainerStyle, gridTemplateColumns: `60px repeat(${numColumns}, 60px)` }}>
        {/* Column Labels */}
        <div style={emptyCellStyle}></div>
        {Array.from({ length: numColumns }, (_, colIndex) => (
          <div key={colIndex} style={columnLabelStyle}>
            {colIndex + 1}
          </div>
        ))}
        {/* Seat Layout */}
        {seatLayout.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Row Label */}
            <div style={rowLabelStyle}>
              {String.fromCharCode(65 + rowIndex)}
            </div>
            {/* Seats */}
            {row.map(seat => (
              <div
                key={seat.seatId}
                style={seatStyle(seat.isOccupied)}
                title={seat.isOccupied ? `Occupied by ${seat.bidderName}` : 'Available'}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = seat.isOccupied ? '#c62828' : '#388e3c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = seat.isOccupied ? '#d32f2f' : '#4caf50'}
                onClick={() => alert(`Seat ${seat.seatId} clicked`)}
              >
                {seat.seatId}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div style={buttonContainerStyle}>
        <button onClick={addRow} style={buttonStyle}>Add Row</button>
        <button onClick={removeRow} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>Remove Row</button>
        <button onClick={addColumn} style={buttonStyle}>Add Column</button>
        <button onClick={removeColumn} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>Remove Column</button>
      </div>
    </div>
  );
};

const containerStyle = {
  padding: '20px',
  backgroundColor: 'transparent',
  maxWidth: '1000px',
  margin: '0 auto',
};

const headerStyle = {
  color: '#004d40',
  marginBottom: '20px',
  fontSize: '24px',
  textAlign: 'center',
};

const buttonContainerStyle = {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s, transform 0.3s',
};

const seatingContainerStyle = {
  display: 'grid',
  gap: '5px',
};

const emptyCellStyle = {
  width: '60px',
  height: '60px',
};

const columnLabelStyle = {
  width: '60px',
  height: '60px',
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#004d40',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const rowLabelStyle = {
  width: '60px',
  height: '60px',
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#004d40',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Seat styling
const seatStyle = (isOccupied) => ({
  width: '60px',
  height: '60px',
  backgroundColor: isOccupied ? '#d32f2f' : '#4caf50',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  cursor: 'pointer',
  border: '2px solid #004d40',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  transition: 'background-color 0.3s, transform 0.3s',
  fontSize: '16px',
  margin: '2px',
});

export default NegomboRegal;

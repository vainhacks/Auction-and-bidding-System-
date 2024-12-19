import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Advertisement({ advertisement }) {
  // Check if advertisement is defined
  if (!advertisement) {
    return <div>Loading...</div>; // Or a suitable placeholder
  }

  const { _id, image, date, title, description } = advertisement;
  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:8070/ads/${_id}`);
      alert('Advertisement deleted successfully!');
      navigate('/'); // Redirect to home after deletion
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      alert('Failed to delete advertisement. Please try again.');
    }
  };

  return (
    <div>
      <h1>Advertisement Display</h1>
      <br />
      <h1>ID: {_id}</h1>
      <h1>
        Image: <img src={image} alt="Advertisement" style={{ maxWidth: '90px' }} />
      </h1>
      <h1>Date: {date}</h1>
      <h1>Title: {title}</h1>
      <h1>Description: {description}</h1>
      <Link to={`/update-advertisement/${_id}`}>
        <button>Update</button>
      </Link>
      <br /><br />
      <button onClick={deleteHandler}>Delete</button>
      <br /><br />
    </div>
  );
}

export default Advertisement;

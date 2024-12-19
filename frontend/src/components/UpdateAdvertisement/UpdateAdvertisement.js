import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const URL = "http://localhost:8070/ads";

function UpdateAdvertisement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [adData, setAdData] = useState({
    title: '',
    description: '',
    date: '',
    image: '',
  });
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setMinDate(formattedDate);

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const formattedMaxDate = nextMonth.toISOString().split('T')[0];
    setMaxDate(formattedMaxDate);
  }, []);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        const ad = response.data.ad;
        setAdData({
          title: ad.title,
          description: ad.description,
          date: ad.date.split('T')[0],
          image: ad.image,
        });
      } catch (error) {
        console.error('Error fetching advertisement:', error);
      }
    };

    fetchAdvertisement();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdData((prevAdData) => ({
      ...prevAdData,
      [name]: value,
    }));
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAdData((prevAdData) => ({
        ...prevAdData,
        image: imageUrl, // Use the created URL for preview
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${URL}/${id}`, adData);
      alert('Advertisement updated successfully!');
      navigate('/AdvertisementDetails');
    } catch (error) {
      console.error('Error updating advertisement:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Clean up the image URL when the component unmounts
  useEffect(() => {
    return () => {
      if (adData.image && adData.image.startsWith('blob:')) {
        URL.revokeObjectURL(adData.image);
      }
    };
  }, [adData.image]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', backgroundColor: '#f4f6f9' }}>
      <div style={{ maxWidth: '800px', width: '100%', padding: '20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '15px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: '20px' }}>Update Advertisement</h1>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: '#666', width: '100%' }}>Current Image</label>
          <div {...getRootProps({ style: { width: '100%', padding: '50px', border: '2px dashed #ccc', borderRadius: '5px', textAlign: 'center', cursor: 'pointer', marginBottom: '15px', color: '#666' } })}>
            <input {...getInputProps()} />
            <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Drag 'n' drop some files here, or click to select files</p>
            {adData.image && (
              <img src={adData.image} alt="Current or Preview" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
            )}
          </div>

          <label style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: '#666', width: '100%' }}>Date</label>
          <input
            type="date"
            name="date"
            value={adData.date}
            onChange={handleInputChange}
            min={minDate}
            max={maxDate}
            required
            style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', fontSize: '16px', marginBottom: '15px' }}
          />
          
          <label style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: '#666', width: '100%' }}>Title</label>
          <select
            name="title"
            value={adData.title}
            onChange={handleInputChange}
            required
            style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', fontSize: '16px', marginBottom: '15px' }}
          >
            <option value="">Select Title</option>
            <option value="Jewellery">Jewellery</option>
            <option value="Collectables">Collectables</option>
            <option value="Arts">Arts</option>
          </select>

          <label style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: '#666', width: '100%' }}>Description</label>
          <textarea
            name="description"
            value={adData.description}
            onChange={handleInputChange}
            required
            style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', height: '120px', resize: 'vertical', marginBottom: '15px' }}
          />

          <button type="submit" style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '12px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', width: '150px', marginTop: '20px', textAlign: 'center', transition: 'background-color 0.3s ease' }}>
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateAdvertisement;

// src/components/EditPaymentForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditPaymentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cardType: '',
        cardNumber: '',
        expirationMonth: '',
        expirationYear: '',
        cvv: '',
        fullName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const [error, setError] = useState('');
    const [imageVisible, setImageVisible] = useState(false); // State to control image visibility

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/payment/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching payment data:', error);
            }
        };
        fetchPayment();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate fullName, city, and state to allow only letters and spaces
        const lettersOnly = /^[A-Za-z\s]*$/;
        if ((name === 'fullName' || name === 'city' || name === 'state') && !lettersOnly.test(value)) return;

        // Validate email to allow only lowercase letters, digits, @, comma, and dot
        if (name === 'email') {
            const emailRegex = /^[a-z0-9@.,]+$/;
            if (!emailRegex.test(value)) return; // Reject invalid characters
        }

        // Validate address to allow only letters, numbers, spaces, and commas
        if (name === 'address') {
            const addressRegex = /^[A-Za-z0-9\s,]*$/;
            if (!addressRegex.test(value)) return; // Reject invalid characters
        }

        // Validate zipCode to allow only 5 digits
        if (name === 'zipCode') {
            const zipCodeRegex = /^[0-9]{0,5}$/; // Allows 0 to 5 digits
            if (!zipCodeRegex.test(value)) return; // Reject invalid characters
        }

        // Validate expirationMonth to allow only numbers from 1 to 12
        if (name === 'expirationMonth') {
            const monthRegex = /^(1[0-2]|[1-9])?$/; // Allows 1-12 or empty
            if (!monthRegex.test(value)) return; // Reject invalid month input
        }

        // Validate expirationYear to allow only 4-digit numerics
        if (name === 'expirationYear') {
            const yearRegex = /^[0-9]{0,4}$/; // Allows 0 to 4 digits
            if (!yearRegex.test(value)) return; // Reject invalid year input
        }

        setFormData({ ...formData, [name]: value });

        // Handle card type change to trigger image animation
        if (name === 'cardType') {
            setImageVisible(false); // Hide image
            setTimeout(() => setImageVisible(true), 50); // Show image after a slight delay
        }
    };

    const validateForm = () => {
        const { fullName, email, address, city, state, zipCode } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format validation
        let errors = {};

        if (fullName.trim() === '') {
            errors.fullName = 'Full name is required';
        }
        if (!emailRegex.test(email)) {
            errors.email = 'Invalid email format';
        }
        if (address.trim() === '') {
            errors.address = 'Address is required';
        }
        if (city.trim() === '') {
            errors.city = 'City is required';
        }
        if (state.trim() === '') {
            errors.state = 'State is required';
        }
        if (zipCode.length !== 5 || isNaN(zipCode)) {
            errors.zipCode = 'Zip code must be exactly 5 digits';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            Object.keys(errors).forEach((field) => {
                alert(errors[field]);
            });
            return;
        }

        try {
            await axios.put(`http://localhost:8070/payment/update/${id}`, formData);
            alert('Payment updated successfully');
            navigate('/payments'); // Navigate to payment list
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating payment');
            console.error('Error updating payment:', err);
        }
    };

    const cardTypes = [
        { name: 'Visa', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
        { name: 'Mastercard', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
        { name: 'American Express', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg' },
        { name: 'Discover', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Commons-logo-en.svg/1556px-Commons-logo-en.svg.png' },
        { name: 'JCB', imgSrc: 'https://www.fintechfutures.com/files/2018/01/JCB-620x400.jpg' }
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundImage: 'url(https://images.pexels.com/photos/8919543/pexels-photo-8919543.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: '#000'
        }}>
            <div className="container mt-5" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)', // White background for form
                borderRadius: '10px',
                padding: '20px'
            }}>
                <h1>Edit Payment</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
                    <div className="mb-3">
                        <label className="form-label">Card Type:</label>
                        <select
                            name="cardType"
                            value={formData.cardType}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="">Select Card Type</option>
                            {cardTypes.map((card) => (
                                <option key={card.name} value={card.name}>
                                    {card.name}
                                </option>
                            ))}
                        </select>
                        {cardTypes.map((card) => (
                            card.name === formData.cardType && (
                                <div key={card.name} className="text-center my-2">
                                    <img 
                                        src={card.imgSrc} 
                                        alt={card.name} 
                                        style={{
                                            width: '50px',
                                            opacity: imageVisible ? 1 : 0,
                                            transition: 'opacity 0.5s ease-in-out',
                                        }} 
                                    />
                                </div>
                            )
                        ))}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Card Number:</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={'**** **** **** ' + formData.cardNumber.slice(-4)} // Show masked card number
                            onChange={handleChange}
                            required
                            className="form-control"
                            readOnly // Make it read-only for security reasons
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Expiration Month:</label>
                        <input
                            type="text"
                            name="expirationMonth"
                            value={formData.expirationMonth}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Expiration Year:</label>
                        <select
                            name="expirationYear"
                            value={formData.expirationYear}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="">Select Year</option>
                            {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">CVV:</label>
                        <input
                            type="text"
                            name="cvv"
                            value={'***'} // Mask CVV
                            onChange={handleChange}
                            required
                            className="form-control"
                            readOnly // Make it read-only for security reasons
                        />
                    </div>

                    {['fullName', 'email', 'address', 'city', 'state', 'zipCode'].map((field) => (
                        <div className="mb-3" key={field}>
                            <label className="form-label">{field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary">Update Payment</button>
                </form>
            </div>
        </div>
    );
};

export default EditPaymentForm;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
    const [formData, setFormData] = useState({
        cardType: '',
        cardNumber: '',
        expiration: '', // Single field for both month and year (e.g., '12/24' for Dec 2024)
        cvv: '',
        fullName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle expiration input separately
        if (name === 'expiration') {
            // Allow input in the format MM/YY
            const formattedValue = value.replace(/[^0-9/]/g, ''); // Only allow numbers and '/'
            // Automatically add the slash after the second digit
            if (formattedValue.length === 2 && !formattedValue.includes('/')) {
                setFormData({ ...formData, [name]: formattedValue + '/' });
                return;
            }
            if (formattedValue.length <= 5) {
                setFormData({ ...formData, [name]: formattedValue });
            }
            return;
        }

        // Validate fullName, city, and state to allow only letters and spaces
        const lettersOnly = /^[A-Za-z\s]*$/;
        if ((name === 'fullName' || name === 'city' || name === 'state') && !lettersOnly.test(value)) return;

        // Validate email to allow only lowercase letters, digits, @, comma, and dot
        if (name === 'email') {
            const emailRegex = /^[a-z0-9@.,]+$/;
            if (!emailRegex.test(value)) return;
        }

        // Validate address to allow only letters, numbers, spaces, and commas
        if (name === 'address') {
            const addressRegex = /^[A-Za-z0-9\s,]*$/;
            if (!addressRegex.test(value)) return;
        }

        // Validate zipCode to allow only 5 digits
        if (name === 'zipCode') {
            const zipCodeRegex = /^[0-9]{0,5}$/;
            if (!zipCodeRegex.test(value)) return;
        }

        // Validate CVV to allow only 3 digits
        if (name === 'cvv') {
            const cvvRegex = /^[0-9]{0,3}$/;
            if (!cvvRegex.test(value)) return;
        }

        // Validate cardNumber to allow only 16 digits
        if (name === 'cardNumber') {
            const cardNumberRegex = /^[0-9]{0,16}$/;
            if (!cardNumberRegex.test(value)) return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleCardTypeSelection = (cardType) => {
        setFormData({ ...formData, cardType });
    };

    const validateForm = () => {
        const { cardNumber, expiration, cvv, fullName, email, address, city, state, zipCode } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let errors = {};

        if (cardNumber.length !== 16 || isNaN(cardNumber)) {
            errors.cardNumber = 'Card number must be exactly 16 digits';
        }
        // Validate expiration to be in the format MM/YY
        if (!/^\d{2}\/\d{2}$/.test(expiration)) {
            errors.expiration = 'Expiration must be in the format MM/YY';
        }
        if (cvv.length !== 3 || isNaN(cvv)) {
            errors.cvv = 'CVV must be exactly 3 digits';
        }
        if (!emailRegex.test(email)) {
            errors.email = 'Invalid email format';
        }
        if (fullName.trim() === '') {
            errors.fullName = 'Full name is required';
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
        setSuccessMessage('');

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            Object.keys(errors).forEach((field) => {
                alert(errors[field]);
            });
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8070/payment/add',
                formData,
                { headers: { 'Content-Type': 'application/json' } }
            );

            setSuccessMessage(response.data.message);

            // Clear form
            setFormData({
                cardType: '',
                cardNumber: '',
                expiration: '',
                cvv: '',
                fullName: '',
                email: '',
                address: '',
                city: '',
                state: '',
                zipCode: ''
            });

            // Navigate to /payments after successful form submission
            navigate('/payments');

        } catch (err) {
            setError(err.response?.data?.message || 'Error processing payment');
        }
    };

    const cardTypes = [
        { name: 'Visa', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
        { name: 'Mastercard', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
        { name: 'American Express', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg' },
        { name: 'Discover', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Commons-logo-en.svg/1556px-Commons-logo-en.svg.png' },
        { name: 'JCB', imgSrc: 'https://www.fintechfutures.com/files/2018/01/JCB-620x400.jpg' }
    ];

    const progress = Object.keys(formData).filter(key => formData[key].trim() !== '').length;
    const totalFields = Object.keys(formData).length;
    const progressPercentage = (progress / totalFields) * 100;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundImage: 'url(https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div style={{
                margin: '20px',
                maxWidth: '600px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(249, 249, 249, 0.8)' // Make the background slightly transparent
            }}>
                <h1 style={{ textAlign: 'center', color: '#333' }}>Payment Gateway</h1>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}
                
                {/* Progress Bar */}
                <div style={{ marginBottom: '10px' }}>
                    <div style={{
                        height: '10px',
                        width: '100%',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '5px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progressPercentage}%`,
                            backgroundColor: '#007BFF',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                    <p style={{ textAlign: 'center', margin: '5px 0' }}>{Math.round(progressPercentage)}% Completed</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Card Type:</label>
                        
                        {/* Displaying Card Type Images */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            {cardTypes.map((card) => (
                                <img
                                    key={card.name}
                                    src={card.imgSrc}
                                    alt={card.name}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        cursor: 'pointer',
                                        margin: '0 5px'
                                    }}
                                    onClick={() => handleCardTypeSelection(card.name)}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Card Number:</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    {/* Expiration Month and Year in one input */}
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Expiration (MM/YY):</label>
                        <input
                            type="text"
                            name="expiration"
                            value={formData.expiration}
                            onChange={handleChange}
                            required
                            placeholder="MM/YY"
                            maxLength="5" // Updated to allow for the slash
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>CVV:</label>
                        <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Full Name:</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>City:</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ flex: '1 0 45%' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>State:</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd',
                                    fontSize: '16px'
                                }}
                            />
                        </div>

                        <div style={{ flex: '1 0 45%' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Zip Code:</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd',
                                    fontSize: '16px'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            fontSize: '16px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Proceed Checkout
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;

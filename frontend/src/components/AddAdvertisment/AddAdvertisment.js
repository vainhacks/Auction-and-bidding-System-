import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Nav from '../Nav2/Nav2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../Firebase/firebase';

function AddAdvertisment() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        image: null,
        date: "",
        title: "",
        description: "",
    });
    const [error, setError] = useState("");
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");

    const updateMinAndMaxDate = () => {
        const today = new Date();
        const currentDate = today.toISOString().split("T")[0];
        setMinDate(currentDate);

        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const maxDate = nextMonth.toISOString().split("T")[0];
        setMaxDate(maxDate);
    };

    useEffect(() => {
        updateMinAndMaxDate();
        const intervalId = setInterval(() => {
            updateMinAndMaxDate();
        }, 60000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        setInputs({
            image: null,
            date: "",
            title: "",
            description: "",
        });
    }, []);

    useEffect(() => {
        if (inputs.image) {
            const objectUrl = URL.createObjectURL(inputs.image);
            setImagePreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [inputs.image]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "description") {
            const filteredValue = value.replace(/[^a-zA-Z0-9.,\s]/g, "");
            setInputs((prevState) => ({
                ...prevState,
                [name]: filteredValue,
            }));
        } else {
            setInputs((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should not exceed 5MB.");
            } else if (!allowedTypes.includes(file.type)) {
                setError("Only image files (JPEG, PNG, GIF) are allowed.");
            } else {
                setError("");
                setInputs((prevState) => ({
                    ...prevState,
                    image: file,
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const userConfirmed = window.confirm("Are you sure you want to submit the advertisement?");
        
        if (userConfirmed) {
            if (inputs.image && inputs.date && inputs.title && inputs.description) {
                try {
                    const imageUrl = await uploadImageToFirebase(inputs.image);
                    await sendRequest(imageUrl);

                    // Log success
                    console.log("Advertisement submitted successfully.");

                    // Reset inputs and navigate
                    setInputs({
                        image: null,
                        date: "",
                        title: "",
                        description: "",
                    });
                    setImagePreviewUrl("");
                    
                    // Navigate with a delay to ensure smooth transition
                    setTimeout(() => {
                        navigate("/AdvertisementDetails");
                    }, 1000);
                } catch (error) {
                    console.error("Error:", error);
                    setError(error.response?.data?.message || "Failed to submit advertisement. Please try again.");
                }
            } else {
                setError("Please fill in all fields correctly.");
            }
        }
    };

    const uploadImageToFirebase = async (imageFile) => {
        const storageRef = ref(storage, `ads/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        return imageUrl;
    };

    const sendRequest = async (imageUrl) => {
        const response = await axios.post("http://localhost:8070/ads", {
            image: imageUrl,
            date: inputs.date,
            title: inputs.title,
            description: inputs.description,
        });
        console.log("Advertisement submitted:", response.data); // Log success
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: 'image/jpeg, image/png, image/gif',
        maxSize: 5 * 1024 * 1024,
    });

    const styles = {
        container: { display: 'flex', minHeight: '100vh' },
        content: {
            flex: 1,
            margin: 'auto',
            maxWidth: '800px',
            padding: '20px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '15px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        form: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
        error: { color: '#f00', fontSize: '14px', marginBottom: '10px' },
        dropzone: {
            width: '100%',
            padding: '100px',
            border: '3px dashed #ccc',
            borderRadius: '5px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '15px',
            color: '#666',
        },
        dropzoneActive: { borderColor: '#4CAF50' },
        imagePreview: { marginTop: '15px', width: '100%', maxWidth: '300px' },
    };

    return (
        <div style={styles.container}>
            <Nav />
            <div style={styles.content}>
                <h1>Create Advertisement</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && <p style={styles.error}>{error}</p>}
                    <label htmlFor="image">Image</label>
                    <div {...getRootProps()} style={{ ...styles.dropzone, ...(imagePreviewUrl ? styles.dropzoneActive : {}) }}>
                        <input {...getInputProps()} id="image" />
                        {isDragActive ? (
                            <p>Drop the image here...</p>
                        ) : (
                            <p>Drag 'n' drop an image here, or click to select an image (JPEG, PNG, GIF only)</p>
                        )}
                        {imagePreviewUrl && (
                            <img src={imagePreviewUrl} alt="Preview" style={styles.imagePreview} />
                        )}
                    </div>
                    {inputs.image && <p>Selected file: {inputs.image.name}</p>}
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        onChange={handleChange}
                        value={inputs.date}
                        required
                        min={minDate}
                        max={maxDate}
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', fontSize: '16px', marginBottom: '15px' }}
                    />
                    <label htmlFor="title">Title</label>
                    <select name="title" id="title" onChange={handleChange} value={inputs.title} required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', height: '40px', fontSize: '16px', marginBottom: '15px' }}>
                        <option value="">Select Title</option>
                        <option value="Jewellery">Jewellery</option>
                        <option value="Collectables">Collectables</option>
                        <option value="Arts">Arts</option>
                    </select>
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        onChange={handleChange}
                        value={inputs.description}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', height: '100px', resize: 'vertical', fontSize: '16px', marginBottom: '15px' }}
                    />
                    <button type="submit" style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default AddAdvertisment;

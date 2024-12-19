import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../AuctionManagement.css';

export default function AuctionManagement() {
    const [auctions, setAuctions] = useState([]);
    const [newAuction, setNewAuction] = useState({ title: '', category: '', description: '', image: '', startingDateTime: '',location:'' });
    const [editingAuction, setEditingAuction] = useState(null);

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            const response = await axios.get('http://localhost:8070/auction/all');
            setAuctions(response.data);
        } catch (error) {
            console.error('Error fetching auctions:', error);
        }
    };

    const validateFutureDateTime = (dateTime) => {
        return new Date(dateTime) > new Date();
    };

    const handleAddAuction = async () => {
        if (!validateFutureDateTime(newAuction.startingDateTime)) {
            alert('Starting date and time must be in the future.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8070/auction/add', newAuction);
            alert(response.data.message);
            fetchAuctions();
            setNewAuction({ title: '', category: '', description: '', image: '', startingDateTime: '' ,location:''});
        } catch (error) {
            console.error('Error adding auction:', error);
        }
    };

    const handleUpdateAuction = async () => {
        if (editingAuction && !validateFutureDateTime(editingAuction.startingDateTime)) {
            alert('Starting date and time must be in the future.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8070/auction/update/${editingAuction._id}`, editingAuction);
            alert(response.data.message);
            fetchAuctions();
            setEditingAuction(null);
        } catch (error) {
            console.error('Error updating auction:', error);
        }
    };

    const handleDeleteAuction = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8070/auction/delete/${id}`);
            alert(response.data.message);
            fetchAuctions();
        } catch (error) {
            console.error('Error deleting auction:', error);
        }
    };

    const currentDateTime = new Date().toISOString().slice(0, 16); // Current date and time in YYYY-MM-DDTHH:MM format

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Auction Management</h1>

            <div className="mb-4">
                <h2>Add New Auction</h2>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={newAuction.title}
                    onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
                    className="form-control mb-2"
                />
                <div className="mb-3">
                    <select 
                        id="category"
                        value={newAuction.category}
                        onChange={(e) => setNewAuction({ ...newAuction, category: e.target.value })}
                        className="form-select mb-2"
                    >
                        <option value="" disabled>Select Category</option>
                        <option value="Collectibles">Collectibles</option>
                        <option value="Arts">Arts</option>
                        <option value="Jewellery">Jewellery</option>
                    </select>
                </div>
                <div className="mb-3">
                    <select 
                        id="location"
                        value={newAuction.location}
                        onChange={(e) => setNewAuction({ ...newAuction, location: e.target.value })}
                        className="form-select mb-2"
                    >
                        <option value="" disabled>Select location</option>
                        <option value="BMICH Colombo">BMICH Colombo</option>
                        <option value="KCC Kandy">KCC Kandy</option>
                        <option value="Negambo">Negambo</option>
                    </select>
                </div>
                <textarea 
                    placeholder="Description" 
                    value={newAuction.description}
                    onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
                    className="form-control mb-2"
                />
                <input 
                    type="text" 
                    placeholder="Image URL" 
                    value={newAuction.image}
                    onChange={(e) => setNewAuction({ ...newAuction, image: e.target.value })}
                    className="form-control mb-2"
                />
                <div className="mb-3">
                    <label htmlFor="startingDateTime" className="form-label">Starting Date and Time</label>
                    <input 
                        type="datetime-local" 
                        id="startingDateTime"
                        value={newAuction.startingDateTime}
                        onChange={(e) => setNewAuction({ ...newAuction, startingDateTime: e.target.value })}
                        className="form-control mb-2"
                        min={currentDateTime} // Set minimum to current date and time
                    />
                </div>
                <button 
                    onClick={handleAddAuction}
                    className="btn btn-dark"
                >
                    Add Auction
                </button>
            </div>

            {editingAuction && (
                <div className="mb-4">
                    <h2>Edit Auction</h2>
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={editingAuction.title}
                        onChange={(e) => setEditingAuction({ ...editingAuction, title: e.target.value })}
                        className="form-control mb-2"
                    />
                    <div className="mb-3">
                    <select 
                        id="category"
                        value={editingAuction.category}
                        onChange={(e) => setEditingAuction({ ...editingAuction, category: e.target.value })}
                        className="form-select mb-2"
                    >
                        <option value="" disabled>Select Category</option>
                        <option value="Collectibles">Collectibles</option>
                        <option value="Arts">Arts</option>
                        <option value="Jewellery">Jewellery</option>
                    </select>
                </div>
                    <div className="mb-3">
                    <select 
                        id="location"
                        value={editingAuction.location}
                        onChange={(e) => setEditingAuction({ ...editingAuction, location: e.target.value })}
                        className="form-select mb-2"
                    >
                        <option value="" disabled>Select location</option>
                        <option value="BMICH Colombo">BMICH Colombo</option>
                        <option value="KCC Kandy">KCC Kandy</option>
                        <option value="Negambo">Negambo</option>
                    </select>
                </div>
                    
                    <textarea 
                        placeholder="Description" 
                        value={editingAuction.description}
                        onChange={(e) => setEditingAuction({ ...editingAuction, description: e.target.value })}
                        className="form-control mb-2"
                    />
                    <input 
                        type="text" 
                        placeholder="Image URL" 
                        value={editingAuction.image}
                        onChange={(e) => setEditingAuction({ ...editingAuction, image: e.target.value })}
                        className="form-control mb-2"
                    />
                    <div className="mb-3">
                        <label htmlFor="startingDateTime" className="form-label">Starting Date and Time</label>
                        <input 
                            type="datetime-local" 
                            id="startingDateTime"
                            value={editingAuction.startingDateTime}
                            onChange={(e) => setEditingAuction({ ...editingAuction, startingDateTime: e.target.value })}
                            className="form-control mb-2"
                            min={currentDateTime} // Set minimum to current date and time
                        />
                    </div>
                    <button 
                        onClick={handleUpdateAuction}
                        className="btn btn-dark"
                    >
                        Update Auction
                    </button>
                </div>
            )}

            <div>
                <h2>Current Auctions</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>location</th>
                            <th>Date and time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctions.map(auction => (
                            <tr key={auction._id}>
                                <td>{auction.title}</td>
                                <td>{auction.category}</td>
                                <td>{auction.location}</td>
                                <td>{auction.startingDateTime}</td>
                                <td>
                                    <button 
                                        onClick={() => setEditingAuction(auction)}
                                        className="btn btn-primary me-2"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteAuction(auction._id)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
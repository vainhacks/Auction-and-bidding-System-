const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat'); // Import the Seat model

// Create a new seat (POST)
router.post('/seats', async (req, res) => {
    const { seatId, bidderId, name, email, location } = req.body;

    if (!seatId || !bidderId || !name || !email || !location) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if a seat with the same seatId exists in the same location
        const seatExists = await Seat.findOne({ seatId, location });
        if (seatExists) {
            return res.status(400).json({ error: `Seat ID ${seatId} is already assigned in ${location}` });
        }

        const newSeat = new Seat({ seatId, bidderId, name, email, location });
        const savedSeat = await newSeat.save();
        res.status(201).json({ message: 'Seat created successfully', seat: savedSeat });
    } catch (error) {
        console.error('Error creating seat:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Get all seats (GET)
router.get('/seats', async (req, res) => {
    try {
        const seats = await Seat.find();
        res.json(seats);
    } catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a seat (PUT)
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { seatId, bidderId, name, email, location } = req.body;

    try {
        const updatedSeat = await Seat.findByIdAndUpdate(
            id,
            { seatId, bidderId, name, email, location },
            { new: true, runValidators: true }
        );

        if (!updatedSeat) {
            return res.status(404).json({ error: 'Seat not found' });
        }

        res.json({ message: 'Seat updated successfully', seat: updatedSeat });
    } catch (error) {
        console.error('Error updating seat:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a seat (DELETE)
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSeat = await Seat.findByIdAndDelete(id);

        if (!deletedSeat) {
            return res.status(404).json({ error: 'Seat not found' });
        }

        res.json({ message: 'Seat deleted successfully' });
    } catch (error) {
        console.error('Error deleting seat:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

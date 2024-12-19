const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatId: {
        type: String,
        required: true,
        unique: true
    },
    bidderId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        enum: ['BMICH', 'Negombo Regal', 'Joash Place Maharagama'] // Restrict to the three locations
    }
}, { collection: 'seats' });


seatSchema.index({ 
    seatId: 1,
     location: 1 }, { unique: true });

// Export the model
const Seat = mongoose.model('Seat', seatSchema);
module.exports = Seat;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

    Name: {
        type: String,
        required: true,
    },
    Gmail: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    NIC: {
        type: String,
        required: true,
    },
    Gender: {
        type: String,
        required: true,
    },
    BirthDay: {
        type: Date,
        required: true,
    },
    Phone: {
        type: Number,
        required: true,
    },
    Username: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    }
    
});

module.exports = mongoose.model('UserModel', userSchema);

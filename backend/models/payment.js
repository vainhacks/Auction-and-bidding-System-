const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new mongoose.Schema({
    cardType: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        
    },
    expirationMonth: {
        type: Number,
       
    },
    expirationYear: {
        type: Number,
       
    },
    cvv: {
        type: String,
        
    },
    fullName: {
        type: String,
       
    },
    email: {
        type: String,
        
    },
    address: {
        type: String,
        
    },
    city: {
        type: String,
        
    },
    state: {
        type: String,
        
    },
    zipCode: {
        type: String,
        
    },
}, {
    timestamps: true,
});

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;

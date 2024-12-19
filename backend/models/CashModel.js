const mongoose = require('mongoose');

const CashSchema = new mongoose.Schema({
    cashType: {
         type: String,
          required: true },
    date: {
         type: Date, 
         required: true },
    description: {
         type: String, 
         required: true },
    amount: { 
        type: Number, 
        required: true }  
});

module.exports = mongoose.model('Cash', CashSchema);
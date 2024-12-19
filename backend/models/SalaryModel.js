const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({

    userId: { 
        
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee', 
        required: true },

    BasicSalary: { 
        type: Number, 
        required: true },
    Bonus: { 
        type: Number,
         required: true },
    OTHours: { 
        type: Number, 
        required: true },
    OTRate: { 
        type: Number, 
        required: true },
    OTAmount: { 
        type: Number, 
        required: true },
    EPF: { 
        type: Number,
         required: true },
    ETF: {
        type: Number, 
        required: true },
    TotalSalary: { 
        type: Number, 
        required: true }
});

module.exports = mongoose.model('Salary', SalarySchema);
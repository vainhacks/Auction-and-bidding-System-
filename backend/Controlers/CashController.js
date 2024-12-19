const mongoose = require('mongoose');
const Cash = require('../models/CashModel');


const addCash = async (req, res) => {
    const{cashType, date, description, amount} = req.body;

    try{
        const cash = new Cash({cashType, date, description, amount});
        await cash.save();
        return res.status(201).json({cash});
    }
    catch(err){
        console.error("Error adding cash:", err);
        return res.status(500).json({message: "Server error occurred while adding cash."});
    }
}

const getAllCash = async (req, res) => {
    try{
        const cash = await Cash.find();
        return res.status(200).json({cash});
    }
    catch(err){
        console.error("Error retrieving cash:", err);
        return res.status(500).json({message: "Server error occurred while retrieving cash.", error: err.message});
    }
}

const getCashById = async (req, res) => {
    const cashId = req.params.cashId;

    if(!mongoose.Types.ObjectId.isValid(cashId)){
        return res.status(400).json({message: "Invalid cash ID format."});
    }

    try{
        const cash = await Cash.findById(cashId);
        if(!cash){
            return res.status(404).json({message: "Cash details not found."});
        }
        return res.status(200).json({cash});
    }
    catch(err){
        console.error("Error retrieving cash:", err);
        return res.status(500).json({message: "Server error occurred while retrieving cash.", error: err.message});
    }
}

const updateCash = async (req, res) => {
    const cashId = req.params.cashId;
    const {cashType, date, description, amount} = req.body;

    if(!mongoose.Types.ObjectId.isValid(cashId)){
        return res.status(400).json({message: "Invalid cash ID format."});
    }

    try{
        const updatedCash = {cashType, date, description, amount};
        const cash = await Cash.findByIdAndUpdate(cashId, updatedCash, {new: true});
        if(!cash){
            return res.status(404).json({message: "Cash details not found."});
        }
        return res.status(200).json({cash});
    }
    catch(err){
        console.error("Error updating cash:", err);
        return res.status(500).json({message: "Server error occurred while updating cash.", error: err.message});
    }
}

const deleteCash = async (req, res) => {
    const cashId = req.params.cashId;

    if(!mongoose.Types.ObjectId.isValid(cashId)){
        return res.status(400).json({message: "Invalid cash ID format."});
    }

    try{
        const cash = await Cash.findByIdAndDelete(cashId);
        if(!cash){
            return res.status(404).json({message: "Cash details not found."});
        }
        return res.status(200).json({message: "Cash details deleted successfully."});
    }
    catch(err){
        console.error("Error deleting cash:", err);
        return res.status(500).json({message: "Server error occurred while deleting cash.", error: err.message});
    }
}

module.exports = {addCash, getAllCash, getCashById, updateCash, deleteCash};
const mongoose = require('mongoose');
const Salary = require("../models/SalaryModel");
const Employee= require("../models/employee");


// Add salary details for a user
const addSalary = async (req, res, next) => {
    const { userId, BasicSalary, Bonus, OTHours, OTRate } = req.body;

    // Calculate EPF, ETF, OTAmount, and TotalSalary
    const EPF = BasicSalary * 0.08;
    const ETF = BasicSalary * 0.03;
    const OTAmount = OTHours * OTRate;
    const TotalSalary = (BasicSalary - (EPF + ETF)) + Bonus + OTAmount;

    try {
        // Create new salary record
        const salary = new Salary({ userId, BasicSalary, Bonus, OTHours, OTRate, OTAmount, EPF, ETF, TotalSalary });
        await salary.save();
        return res.status(201).json({ salary });
    } catch (err) {
        console.error("Error adding salary:", err);
        return res.status(500).json({ message: "Server error occurred while adding salary." });
    }
};

// Get salary details by user ID
const getSalaryByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format." });
    }

    try {
        // Find the salary record and populate user details
        const salary = await Salary.findOne({ userId }).populate("userId");
        if (!salary) {
            return res.status(404).json({ message: "Salary details not found for the user." });
        }
        return res.status(200).json({ salary });
    } catch (err) {
        console.error("Error retrieving salary:", err);
        return res.status(500).json({ message: "Server error occurred while retrieving salary.", error: err.message });
    }
};

// Update salary details for a user
const updateSalary = async (req, res, next) => {
    const userId = req.params.userId;
    const { BasicSalary, Bonus, OTHours, OTRate } = req.body;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format." });
    }

    // Calculate EPF, ETF, OTAmount, and TotalSalary
    const EPF = BasicSalary * 0.08;
    const ETF = BasicSalary * 0.03;
    const OTAmount = OTHours * OTRate;
    const TotalSalary = (BasicSalary - (EPF + ETF)) + Bonus + OTAmount;

    try {
        // Update the salary record
        const salary = await Salary.findOneAndUpdate(
            { userId },
            { BasicSalary, Bonus, OTHours, OTRate, OTAmount, EPF, ETF, TotalSalary },
            { new: true }
        );
        if (!salary) {
            return res.status(404).json({ message: "Unable to update salary." });
        }
        return res.status(200).json({ salary });
    } catch (err) {
        console.error("Error updating salary:", err);
        return res.status(500).json({ message: "Server error occurred while updating salary." });
    }
};

// Delete salary details by user ID
const deleteSalary = async (req, res, next) => {
    const userId = req.params.userId;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format." });
    }

    try {
        // Delete the salary record
        const salary = await Salary.findOneAndDelete({ userId });
        if (!salary) {
            return res.status(404).json({ message: "Unable to delete salary." });
        }
        return res.status(200).json({ message: "Salary deleted successfully." });
    } catch (err) {
        console.error("Error deleting salary:", err);
        return res.status(500).json({ message: "Server error occurred while deleting salary." });
    }
};

module.exports = {
    addSalary,
    getSalaryByUserId,
    updateSalary,
    deleteSalary
};

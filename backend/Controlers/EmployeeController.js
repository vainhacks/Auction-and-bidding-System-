const Employee = require("../models/employee");

// Display all employees
const getAllEmployees = async (req, res, next) => {
    let employees;

    try {
        employees = await Employee.find();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error occurred while retrieving employees." });
    }

    if (!employees || employees.length === 0) {
        return res.status(404).json({ message: "No employees found." });
    }

    return res.status(200).json({ employees });
};

// Insert a new employee
const addEmployee = async (req, res, next) => {
    const { fullName, email, jobTitle } = req.body;

    let employee;

    try {
        
        employee = new Employee({ fullName, email, jobTitle });
        await employee.save();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error occurred while adding the employee." });
    }

    if (!employee) {
        return res.status(400).json({ message: "Unable to add employee." });
    }

    return res.status(201).json({ employee });
};

// Get employee by ID
const getEmployeeById = async (req, res, next) => {
    const id = req.params.id;

    let employee;

    try {
        employee = await Employee.findById(id);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error occurred while retrieving the employee." });
    }

    if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
    }

    return res.status(200).json({ employee });
};

// Update employee details
const updateEmployee = async (req, res, next) => {
    const id = req.params.id;
    const { fullName, email, jobTitle } = req.body;

    let employee;

    try {
        employee = await Employee.findByIdAndUpdate(id, 
            { fullName, email, jobTitle }, 
            { new: true } // Return the updated document
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error occurred while updating the employee." });
    }

    if (!employee) {
        return res.status(404).json({ message: "Unable to update employee details." });
    }

    return res.status(200).json({ employee });
};

// Delete employee by ID
const deleteEmployee = async (req, res, next) => {
    const id = req.params.id;

    let employee;

    try {
        employee = await Employee.findByIdAndDelete(id);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error occurred while deleting the employee." });
    }

    if (!employee) {
        return res.status(404).json({ message: "Unable to delete employee." });
    }

    return res.status(200).json({ message: "Employee deleted successfully." });
};

module.exports = {
    getAllEmployees,
    addEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
const router = require("express").Router();

const Admin = require("../models/admin");
const express = require("express");
const app = express();
require("dotenv").config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authMiddleware = require('./authMiddleware'); //for testing 





router.route("/add",authMiddleware).post(async (req, res) => {
    const { name,email, username, password, salary} = req.body;
  
    try {
        // Check if username already exists
        const usernameCheck = await Admin.findOne({ username });
        if (usernameCheck) {
            return res.json("Admin already exists");
        }
  
        // Check if email already exists
        const emailCheck = await Admin.findOne({ email });
        if (emailCheck) {
            return res.json("Email already exists");
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create new Admin object
        const newAdmin = new Admin({

            name,
            email,
            username,
            password: hashedPassword,
            salary
            
        });
  
        // Save seller to the database
        await newAdmin.save();
        res.json("Admin Added");
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error occurred" });
    }
  });
  



// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find seller by username
      const admin = await Admin.findOne({ username });
  
      // Check if seller exists
      if (!admin) {
        return res.status(400).json({ message: "Admin not found. Invalid credentials." });
      }
  
      // Validate password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password." });
      }
  
      // Generate JWT Token
      const token = jwt.sign({ id: admin._id }, process.env.KEY, { expiresIn: '1h' });
  
      // Return success message and token
      res.json({ message: "Login successful", token });
  
    } catch (err) {
      // Handle any server error
      res.status(500).json({ message: "Server error" });
    }
  });


  router.get('/me', authMiddleware, async (req, res) => {
    try {
      // Find the admin using the ID from the verified token
      const admin = await Admin.findById(req.user.id).select('-password'); // Exclude password
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found.' });
      }
      res.json(admin);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error occurred' });
    }
  });
  

  module.exports = router;
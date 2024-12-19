const router = require("express").Router();
const Seller = require("../models/seller");
const express = require("express");
const app = express();
const Item = require("../models/item");
require("dotenv").config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');

router.route("/add",authMiddleware).post(async (req, res) => {
  const { firstName, lastName, email, username, password, country, address, companyName, businessAddress, contactInfo, paymentMethod, birthday } = req.body;

  try {
      // Check if username already exists
      const usernameCheck = await Seller.findOne({ username });
      if (usernameCheck) {
          return res.json("Username already exists");
      }

      // Check if email already exists
      const emailCheck = await Seller.findOne({ email });
      if (emailCheck) {
          return res.json("Email already exists");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new seller object
      const newSeller = new Seller({
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword,
          country,
          address,
          companyName,
          businessAddress,
          contactInfo,
          paymentMethod,
          birthday,
          
      });

      // Save seller to the database
      await newSeller.save();
      res.json("Seller Added");
      
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
    const seller = await Seller.findOne({ username });

    // Check if seller exists
    if (!seller) {
      return res.status(400).json({ message: "Seller not found. Invalid credentials." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: seller._id }, process.env.KEY, { expiresIn: '1h' });

    // Return success message and token
    res.json({ message: "Login successful", token });

  } catch (err) {
    // Handle any server error
    res.status(500).json({ message: "Server error" });
  }
});





router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Find the seller using the ID from the verified token
    const seller = await Seller.findById(req.user.id).select('-password'); // Exclude password
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }
    res.json(seller);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error occurred' });
  }
});


// Update Seller Data
router.put('/me', authMiddleware, async (req, res) => {
  try {
      // Find the seller using the ID from the verified token
      const seller = await Seller.findById(req.user.id);
      if (!seller) {
          return res.status(404).json({ message: 'Seller not found.' });
      }
      // Update the seller data
      const { firstName, lastName, email, address, contactInfo } = req.body;
      if (firstName) seller.firstName = firstName;
      if (lastName) seller.lastName = lastName;
      if (email) seller.email = email;
      if (address) seller.address = address;
      if (contactInfo) seller.contactInfo = contactInfo;
      // Save the updated seller data
      await seller.save();
      res.json(seller);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error occurred' });
  }
});


// Route to get all sellers
router.get("/all", async (req, res) => {
  try {
      const sellers = await Seller.find({}, '-password -username'); // Exclude password and username
      res.json(sellers);
  } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
  }
});

// Route to delete a seller by ID
router.delete('/delete/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deletedSeller = await Seller.findByIdAndDelete(id);
      if (!deletedSeller) {
          return res.status(404).json({ message: "Seller not found" });
      }
      res.json({ message: "Seller deleted successfully", sellerId: id });
  } catch (err) {
      res.status(500).json({ message: "Error deleting seller", error: err.message });
  }
});



module.exports = router;
const router = require("express").Router();
const Bidder = require("../models/bidder");
const express = require("express");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./authMiddleware");

router.route("/add", authMiddleware).post(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    address,
    contactInfo,
    birthday,
  } = req.body;

  try {
    // Check if username already exists
    const usernameCheck = await Bidder.findOne({ username });
    if (usernameCheck) {
      return res.json("Username already exists");
    }

    // Check if email already exists
    const emailCheck = await Bidder.findOne({ email });
    if (emailCheck) {
      return res.json("Email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new bidder object
    const newBidder = new Bidder({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      address,
      contactInfo,
      birthday,
    });

    // Save bidder to the database
    await newBidder.save();
    res.json("Bidder Added");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error occurred" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find bidder by username
    const bidder = await Bidder.findOne({ username });

    // Check if bidder exists
    if (!bidder) {
      return res
        .status(400)
        .json({ message: "Bidder not found. Invalid credentials." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, bidder.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: bidder._id }, process.env.KEY, {
      expiresIn: "1h",
    });

    // Return success message and token
    res.json({ message: "Login successful", token });
  } catch (err) {
    // Handle any server error
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Find the bidder using the ID from the verified token
    const bidder = await Bidder.findById(req.user.id).select("-password"); // Exclude password
    if (!bidder) {
      return res.status(404).json({ message: "Bidder not found." });
    }
    res.json(bidder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error occurred" });
  }
});

// Update Bidder Data
router.put("/me", authMiddleware, async (req, res) => {
  try {
    // Find the bidder using the ID from the verified token
    const bidder = await Bidder.findById(req.user.id);
    if (!bidder) {
      return res.status(404).json({ message: "Bidder not found." });
    }
    // Update the bidder data
    const { firstName, lastName, email, address, contactInfo } = req.body;
    if (firstName) bidder.firstName = firstName;
    if (lastName) bidder.lastName = lastName;
    if (email) bidder.email = email;
    if (address) bidder.address = address;
    if (contactInfo) bidder.contactInfo = contactInfo;
    // Save the updated bidder data
    await bidder.save();
    res.json(bidder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error occurred" });
  }
});


// Route to get all bidders
router.get("/all", async (req, res) => {
  try {
      const bidders = await Bidder.find({}, '-password -username'); // Exclude password and username
      res.json(bidders);
  } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
  }
});

// Route to delete a bidder by ID
router.delete('/delete/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deletedBidder = await Bidder.findByIdAndDelete(id);
      if (!deletedBidder) {
          return res.status(404).json({ message: "Bidder not found" });
      }
      res.json({ message: "Bidder deleted successfully", bidderId: id });
  } catch (err) {
      res.status(500).json({ message: "Error deleting bidder", error: err.message });
  }
});

module.exports = router;

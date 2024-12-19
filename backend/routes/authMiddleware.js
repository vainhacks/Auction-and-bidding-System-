
const jwt = require('jsonwebtoken');
const express = require("express");
const app = express();
require("dotenv").config();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for authentication
function authMiddleware(req, res, next) {
  const token = req.headers["authtoken"];
  if (!token) return res.status(401).send("Access denied.");

  jwt.verify(token, process.env.KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
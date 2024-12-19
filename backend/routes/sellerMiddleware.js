const jwt = require('jsonwebtoken');
const express = require("express");
const app = express();
require("dotenv").config();


// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
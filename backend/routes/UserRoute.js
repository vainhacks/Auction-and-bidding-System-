const express = require("express");
const router = express.Router();

const User = require("../models/UserModel");
const UserController = require("../Controlers/UserControl");

router.get("/",UserController.getAllUsers);
router.post("/",UserController.addUsers);

router.get("/:id",UserController.getById);
router.put("/:id",UserController.updateUser);
router.delete("/:id",UserController.deleteUser);

module.exports = router;
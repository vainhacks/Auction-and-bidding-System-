const mongoose = require("mongoose");
const router = require("express").Router();

const CashController = require("../Controlers/CashController");

router.post("/", CashController.addCash);
router.get("/", CashController.getAllCash);
router.get("/:cashId", CashController.getCashById);
router.put("/:cashId", CashController.updateCash);
router.delete("/:cashId", CashController.deleteCash);

module.exports = router;
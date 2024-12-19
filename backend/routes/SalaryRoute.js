const express = require("express");
const router = express.Router();

const SalaryController = require("../Controlers/SalaryController");

router.post("/", SalaryController.addSalary);
router.get("/get/:userId", SalaryController.getSalaryByUserId);
router.put("/:userId", SalaryController.updateSalary);
router.delete("/:userId", SalaryController.deleteSalary);

module.exports = router;
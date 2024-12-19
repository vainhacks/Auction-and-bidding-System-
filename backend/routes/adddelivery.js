const router = require("express").Router();
let adddelivery = require("../models/adddeliverymodel");

// Endpoint for adding a delivery
router.route("/adddelivery").post((req, res) => {
  const dDate = req.body.dDate;
  const dTime = req.body.dTime;
  const dStates = req.body.dStates;

  const newadddelivery = new adddelivery({
    dDate,     // Ensure this is being captured from the form
    dTime,     // Ensure this is being captured from the form
    dStates,   // Ensure this is being captured from the form
});

  newadddelivery.save()
    .then(() => {
      res.json("Delivery record added");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to add delivery record" });
    });
});

// Endpoint for reading deliveries
// Endpoint for reading deliveries
router.route("/readdelivery").get((req, res) => {
  adddelivery.find()
    .then((deliveries) => {
      res.json(deliveries);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch deliveries" });
    });
});


module.exports = router;

const express = require("express");
const router = express.Router();

const Ads = require("../models/AdModel");
const AdsController = require("../Controlers/AdControllers");

router.get("/",AdsController.getAllAds);
router.post("/",AdsController.addAds);
router.get("/:id",AdsController.getById);
router.put("/:id",AdsController.updateAd);
router.delete("/:id",AdsController.deleteAd);


module.exports = router;
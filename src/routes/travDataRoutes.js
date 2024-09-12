const express = require("express");
const {
  getAllTravData,
  getFilterTravData,
  saveTravData,
} = require("../controllers/travDataController");

const router = express.Router();

router.get("/", getAllTravData);
router.post("/filter", getFilterTravData);
router.post("/save", saveTravData);

module.exports = router;

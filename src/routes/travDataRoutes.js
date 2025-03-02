const express = require("express");
const auth = require("../services/auth");
const {
  getAllTravData,
  getFilterTravData,
  saveTravData,
} = require("../controllers/travDataController");

const router = express.Router();

router.get("/", getAllTravData);
router.post("/filter", auth, getFilterTravData);
router.post("/save", saveTravData);

module.exports = router;

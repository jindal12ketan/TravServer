const express = require("express");
const { addReview } = require("../controllers/reviewController");
const auth = require("../services/auth");
const router = express.Router();

router.post("/:id", addReview);

module.exports = router;

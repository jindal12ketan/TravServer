const express = require("express");
const { addReview } = require("../controllers/reviewController");
const auth = require("../services/auth");
const router = express.Router();

router.post("/:id/reviews", auth, addReview);

module.exports = router;

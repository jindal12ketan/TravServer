const express = require("express");
const { addReview, getReviews } = require("../controllers/reviewController");
const auth = require("../services/auth");
const router = express.Router();

router.post("/:id", auth, addReview);
router.get("/", getReviews);

module.exports = router;

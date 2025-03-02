const TravData = require("../models/TravData");
const User = require("../models/User");
const Review = require("../models/Review");
const mongoose = require("mongoose");

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, customerId } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Product ID is required in request params" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(customerId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const user = await User.findById(customerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await TravData.findById(id);
    if (!product) {
      return res.status(404).json({ message: "TravData not found" });
    }

    const existingReview = await Review.findOne({ customerId, productId: id });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "User has already reviewed this product" });
    }

    const review = new Review({ customerId, productId: id, rating, comment });
    await review.save();

    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  addReview,
};

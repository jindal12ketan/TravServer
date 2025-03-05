const TravData = require("../models/TravData");
const User = require("../models/User");
const Review = require("../models/Review");
const mongoose = require("mongoose");

const getReviews = async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (
      (userId && !mongoose.Types.ObjectId.isValid(userId)) ||
      (productId && !mongoose.Types.ObjectId.isValid(productId))
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const filter = {};
    if (userId) filter.customerId = userId;
    if (productId) filter.productId = productId;

    const reviews = await Review.find(filter);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.query;
    const { rating, comment, customerId } = req.body;

    if (
      !id ||
      !customerId ||
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(customerId) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const [user, product, existingReview] = await Promise.all([
      User.findById(customerId),
      TravData.findById(id),
      Review.findOne({ customerId, productId: id }),
    ]);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!product)
      return res.status(404).json({ message: "TravData not found" });
    if (existingReview)
      return res
        .status(400)
        .json({ message: "User has already reviewed this product" });

    const review = await new Review({
      customerId,
      productId: id,
      rating,
      comment,
    }).save();
    await TravData.findByIdAndUpdate(id, { $push: { reviews: review._id } });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getReviews,
  addReview,
};

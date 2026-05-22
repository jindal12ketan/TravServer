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
    const id = req.params.id || req.query.id;
    const {
      rating,
      comment,
      customerId: customerIdFromBody,
      customerName,
    } = req.body;
    const customerId = req.user?.id || customerIdFromBody;
    const parsedRating = Number(rating);

    if (
      !id ||
      !customerId ||
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(customerId) ||
      !comment ||
      comment.trim().length === 0 ||
      parsedRating < 1 ||
      parsedRating > 5
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
      rating: parsedRating,
      comment: comment.trim(),
    }).save();
    await TravData.findByIdAndUpdate(id, { $push: { reviews: review._id } });

    res.status(201).json({
      message: "Review added successfully",
      review: {
        ...review.toObject(),
        customerName: customerName || undefined,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res
        .status(400)
        .json({ message: "User has already reviewed this product" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getReviews,
  addReview,
};

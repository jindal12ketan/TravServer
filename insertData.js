const mongoose = require("mongoose");
const TravData = require("./src/models/TravData");
const Review = require("./src/models/Review");
const data = require("./Data"); // Assuming this contains the travel data

require("dotenv").config();

const MONGO_URI = "mongodb://localhost:27017/MyData";
const userId = "67cc7d73106e2b12970ec543";

async function importData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Delete existing data from TravData and Review collections
    await TravData.deleteMany();
    await Review.deleteMany();
    console.log("Deleted existing data from TravData and Review collections");

    // Insert travel data and reviews
    for (const item of data) {
      const newTravData = new TravData({
        id: item.id,
        category: item.category,
        title: item.title,
        image: item.image,
        description: item.description,
        price: item.price,
        location: item.location,
      });

      // Save TravData document first
      const savedTravData = await newTravData.save();

      let reviewId = null;
      if (item.reviews && Array.isArray(item.reviews) && item.reviews.length > 0) {
        const review = item.reviews[0]; // Only take the first review

        const newReview = new Review({
          customerId: new mongoose.Types.ObjectId(userId), // Using fixed user ID
          productId: savedTravData._id,
          rating: review.rating,
          comment: review.comment,
        });

        const savedReview = await newReview.save();
        reviewId = savedReview._id;
      }

      // Update TravData with the linked review (if any)
      if (reviewId) {
        savedTravData.reviews = [reviewId];
        await savedTravData.save();
      }
    }

    console.log("Data successfully inserted");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting data:", error);
    mongoose.connection.close();
  }
}

// Call the function to import data
importData();

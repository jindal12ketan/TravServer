const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env.development.local"),
});
require("dotenv").config();

const User = require("../models/User");
const TravData = require("../models/TravData");
const Review = require("../models/Review");
const FormData = require("../models/FormData");
const OTP = require("../models/OTP");
const Counter = require("../models/Counter");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not set. Add it to .env.development.local or .env",
      );
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create collections at startup so they are visible even before first write.
    await Promise.allSettled([
      User.createCollection(),
      TravData.createCollection(),
      Review.createCollection(),
      FormData.createCollection(),
      OTP.createCollection(),
      Counter.createCollection(),
    ]);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const otpRoutes = require("./src/routes/otpRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const travDataRoutes = require("./src/routes/travDataRoutes");
const formRoutes = require("./src/routes/formRoutes");
const errorHandler = require("./src/utils/errorHandler");

const app = express();
const port = process.env.PORT || 7070;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/otp", otpRoutes);
app.use("/reviews", reviewRoutes);
app.use("/travdata", travDataRoutes);
app.use("/form", formRoutes);
// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

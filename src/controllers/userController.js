const User = require("../models/User");
const { sendMail } = require("../services/mailService");

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const response = await user.save();
    res.status(201).send(response);

    await sendMail(
      user.email,
      "Registration Confirmation",
      "Thank you for registering with TravelGenix. Your account has been successfully created."
    );
  } catch (error) {
    res.status(400).send("Invalid request");
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      res.status(404).send("No data found for the provided email.");
      return;
    }
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await User.deleteOne({ email: req.params.email });
    if (result.deletedCount === 0) {
      res.status(404).send("No data found for the provided email.");
      return;
    }
    res.send("User deleted successfully.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  deleteUser,
};

const express = require("express");
const {
  createUser,
  getUsers,
  getUserByEmail,
  deleteUser,
  forgotPassword,
} = require("../controllers/userController");
const { loginUser } = require("../controllers/loginController");
const router = express.Router();

router.get("/", getUsers);
router.get("/:email", getUserByEmail);
router.post("/create", createUser);
router.post("/login", loginUser);
router.delete("/:email", deleteUser);
router.put("/forgotPassword/:email", forgotPassword);

module.exports = router;

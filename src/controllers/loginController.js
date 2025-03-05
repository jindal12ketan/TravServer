const User = require("../models/User");
const LoginDTO = require("../dto/LoginDTO");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = user.generateToken();
    const loginDTO = new LoginDTO(user.name, user.email, token);
    return res.status(200).json(loginDTO);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  loginUser,
};

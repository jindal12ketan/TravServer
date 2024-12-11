const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Invalid or missing Authorization header");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = verifyToken;

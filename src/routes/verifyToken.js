const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Token is not valid!" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.body.UserId) {
      next();
    } else {
      res.status(403).json({ message: "You are not allowed to do that!" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
};

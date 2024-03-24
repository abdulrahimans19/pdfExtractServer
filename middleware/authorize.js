const asyncHandler = require("express-async-handler");
const User = require("../model/Auth");
const { verifyToken } = require("../middleware/jwtGenerate");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.id).select("-userPassword");
      next();
    } catch (error) {
      if (error.message === "jwt expired") {
        res.status(403).json({ status: false, message: "Token expired" });
      } else {
        res.status(403).json({ status: false, message: "Invalid token" });
      }
    }
  }
  if (!token) {
    res.status(401).json({ status: false, message: "Token not found" });
  }
});

module.exports = protect;

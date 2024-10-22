const User = require("../Models/userModel.js");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("./catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  // Verify the token
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resources`,
          403
        )
      );
    }
    next();
  };
};

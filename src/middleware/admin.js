const debugError = require("debug")("app:projectsLog:error");
const debugRead = require("debug")("app:projectsLog:Read");

const ApiError = require("../utils/ApiError");

function admin(req, res, next) {
  //* Checks our decoded token = req.user from our auth middleware to see if the user is an admin
  //! So if we manually change a user to isAdmin, we need a new token.
  if (!req.user.isAdmin) {
    debugError("Access denied - User is not an admin");
    return next(ApiError.denyAccess("Access denied - User is not an admin"));
  }

  debugRead("Access granted - User is an admin");
  next();
}

module.exports = admin;

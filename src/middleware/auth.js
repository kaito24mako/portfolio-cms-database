// * AUTHENTICATION
//* 1. npm i jsonwebtoken

const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  // load token from the header
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).send("Access denied - No token provided");

  try {
    // decode the token
    const decoded = jwt.verify(token, process.env.API_PRIVATE_KEY);

    // attach decoded token to the request under 'user'
    req.user = decoded;

    // calls next middleware
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;

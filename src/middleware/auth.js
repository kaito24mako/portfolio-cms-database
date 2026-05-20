// * AUTHENTICATION
//* 1. npm i jsonwebtoken

const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  // load token from the header
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).send("Access denied - No token provided");

  try {
    // decode the token
    // if signature doesnt match the token, send 400 status
    const decoded = jwt.verify(token, process.env.API_PRIVATE_KEY);

    // attach decoded token into req.user
    // so that it can be used by the next middleware or controller
    req.user = decoded;

    // calls next middleware
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;

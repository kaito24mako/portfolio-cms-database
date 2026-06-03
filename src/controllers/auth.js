const bcrypt = require("bcrypt");
const _ = require("lodash");

const debugError = require("debug")("app:projectsLog:error");
const debugWrite = require("debug")("app:projectsLog:Write");
const debugRead = require("debug")("app:projectsLog:Read");

const ApiError = require("../utils/ApiError");

const { User } = require("../models/users");

// if password matches the web token's password, create auth token for user to provide access
async function login(req, res, next) {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      debugError("Username, email and/or password were not filled in");
      return next(
        ApiError.badRequest(
          "Username, email, and/or password were not filled in",
        ),
      );
    }

    let user = await User.findOne({
      where: {
        username: req.body?.username,
        email: req.body?.email,
      },
    });

    if (!user) {
      debugError("Invalid username or email details");
      return next(ApiError.badRequest("Invalid login details"));
    }

    // compares the password in the request vs the user's password data
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!validPassword) {
      debugError("Invalid password");
      return next(ApiError.badRequest("Invalid login details"));
    }

    // assign token with details of user
    const token = user.generateAuthToken();

    res.send(token);
    debugWrite("Successful login");
  } catch (error) {
    debugError("Something went wrong with logging in...", error);
    return next(
      ApiError.internal(
        "Something went wrong with logging in...try again later",
      ),
    );
  }
}

module.exports = login;

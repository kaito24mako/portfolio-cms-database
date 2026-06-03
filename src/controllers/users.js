const { User } = require("../models/users");

const debugError = require("debug")("app:projectsLog:error");
const debugWrite = require("debug")("app:projectsLog:Write");
const debugRead = require("debug")("app:projectsLog:Read");

const ApiError = require("../utils/ApiError");
const _ = require("lodash");
const bcrypt = require("bcrypt");

module.exports = {
  // * GET
  // api/users
  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password", "createdAt", "isAdmin"] },
      });

      if (!users || users.length === 0) {
        debugError("Users not found");
        return next(ApiError.notFound("No users found"));
      }

      debugRead("All users found");
      res.json(users);
      debugWrite("Success getting all users");
    } catch (error) {
      return next(
        ApiError.internal("Could not get all users...try again later", error),
      );
    }
  },

  // api/users/:id
  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password", "createdAt", "isAdmin"] },
      });

      if (!user) {
        debugError("User not found by ID");
        return next(ApiError.notFound("User not found by ID"));
      }

      debugRead("User found by ID");
      res.send(user);
      debugWrite("Success getting user by ID");
    } catch (error) {
      return next(
        ApiError.internal("Could not get the user...try again later", error),
      );
    }
  },

  // * POST
  // api/users
  async postUser(req, res, next) {
    try {
      if (!req.body.firstName) {
        return next(ApiError.badRequest("First Name is required"));
      }
      if (!req.body.lastName) {
        return next(ApiError.badRequest("Last Name is required"));
      }
      if (!req.body.username || req.body.username.length < 4) {
        return next(
          ApiError.badRequest(
            "Username is required and must be at least 4 characters long",
          ),
        );
      }
      if (!req.body.email) {
        return next(ApiError.badRequest("Email address is required"));
      }
      if (!req.body.password) {
        return next(ApiError.badRequest("Password is required"));
      }

      // salt and hash (encrypt) the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // ? how to make it username OR email
      const sameUser = await User.findOne({
        where: { username: req.body.username, email: req.body.email },
      });

      if (sameUser) {
        debugError("A user with the same username or email already exists");
        return next(
          ApiError.conflict(
            "A user with the same username or email already exists",
          ),
        );
      }

      const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      // Authentication
      const token = user.generateAuthToken();
      res.header("x-auth-token", token);

      // lodash prevents anything not included from being sent
      let userData = _.pick(user, [
        "id",
        "firstName",
        "lastName",
        "username",
        "email",
      ]);

      // attach token to data
      userData.token = token;

      res.send({
        message: `User ${user.username} created successfully`,
        user: userData,
      });
      debugWrite("Success creating the user");
    } catch (error) {
      return next(
        ApiError.internal("Could not create the user...try again later", error),
      );
    }
  },

  // * PUT
  // api/users/:id
  async putUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        debugError("A user with the same username or email already exists");
        return next(ApiError.conflict("This user already exists"));
      }

      await user.update({
        firstName: req.body.firstName ?? user.firstName,
        lastName: req.body.lastName ?? user.lastName,
        username: req.body.username ?? user.username,
        email: req.body.email ?? user.email,
      });

      res.send({
        message: `User ${user.username} updated successfully`,
        user: user,
      });
      debugWrite("Success updating the user");
    } catch (error) {
      return next(
        ApiError.internal("Could not update the user...try again later", error),
      );
    }
  },

  // * DELETE
  // api/users/:id
  async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        debugError("User was not found");
        return next(ApiError.notFound("User was not found"));
      }

      await user.destroy();

      res.send(`User ${user.username} deleted successfully`);
      debugWrite("The user was successfully deleted");
    } catch (error) {
      return next(
        ApiError.internal("Could not delete the user...try again later", error),
      );
    }
  },
};

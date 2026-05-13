const { User } = require("../models/users");
const _ = require("lodash");
const bcrypt = require("bcrypt");

function internalError(error, res) {
  console.log(error);
  res.status(503).send("Internal Error - try again later");
}

module.exports = {
  // * GET
  // api/users
  async getAllUsers(req, res) {
    try {
      // ! add exclusions - same as lodash
      const users = await User.findAll({
        attributes: { exclude: ["password", "createdAt", "isAdmin"] },
      });
      res.json(users);
    } catch (error) {
      internalError(error, res);
    }
  },

  // api/users/:id
  async getUserById(req, res) {
    try {
      // ! add exclusions - same as lodash
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password", "createdAt", "isAdmin"] },
      });

      if (!user) return res.status(404).send("User not found");

      res.send(user);
    } catch (error) {
      internalError(error, res);
    }
  },

  // * POST
  // api/users
  async postUser(req, res) {
    try {
      // ! Authentication - to salt and hash (encrypt) the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // ! CAN MOVE THESE INTO MODELS!
      // if (!req.body.firstName) {
      //   return res.status(400).send("First name is required");
      // }
      // if (!req.body.lastName) {
      //   return res.status(400).send("Last name is required");
      // }
      // if (!req.body.username || req.body.username.length < 4) {
      //   return res
      //     .status(400)
      //     .send("Username is required and must be at least 4 characters long");
      // }
      // if (!req.body.email) {
      //   return res.status(400).send("Email address is required");
      // }
      // if (!req.body.password) {
      //   return res.status(400).send("Password is required");
      // }

      const sameUser = await User.findOne({
        where: { username: req.body.username, email: req.body.email },
      });
      if (sameUser)
        return res.status(409).send("This username or email already exists");

      const user = await User.create(req.body);

      // ! Authentication
      const token = user.generateAuthToken();
      res.header("x-auth-token", token);

      // ! prevents anything not included from being sent
      let userData = _.pick(user, [
        "id",
        "firstName",
        "lastName",
        "username",
        "email",
      ]);

      // ! attach token to data
      userData.token;

      res.send({
        message: `User ${user.username} created successfully`,
        user: userData,
      });
    } catch (error) {
      internalError(error, res);
    }
  },

  // * PUT
  // api/users/:id
  async putUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) return res.status(404).send("User not found");

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
    } catch (error) {
      internalError(error, res);
    }
  },

  // * DELETE
  // api/users/:id
  async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) return res.status(404).send("User not found");

      await user.destroy();
      res.send(`User ${user.username} deleted successfully`);
    } catch (error) {
      internalError(error, res);
    }
  },
};

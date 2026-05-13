const { User } = require("../models/users");
const _ = require("lodash");

function internalError(error, res) {
  console.log(error);
  if (error.errors[0].message)
    return res.status(409).send(error.errors[0].message);

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
      // ! CAN MOVE THESE INTO MODELS!
      if (!req.body.firstName) {
        return res.status(400).send("First name is required");
      }
      if (!req.body.lastName) {
        return res.status(400).send("Last name is required");
      }
      if (!req.body.username || req.body.username.length < 4) {
        return res
          .status(400)
          .send("Username is required and must be at least 4 characters long");
      }
      if (!req.body.email) {
        return res.status(400).send("Email address is required");
      }
      if (!req.body.password) {
        return res.status(400).send("Password is required");
      }

      // ! combines findByPk and Create

      // ? add exclusions!
      const [user, created] = await User.findOrCreate({
        where: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      });

      if (!created) return res.status(409).send("This user already exists");

      // ! prevents anything not included from being sent
      let userData = _.pick(user, [
        "id",
        "firstName",
        "lastName",
        "username",
        "email",
      ]);

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

      await user.update(
        {
          // if there's a new firstName from Postman, use it, otherwise use current firstName
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
        {
          attributes: { exclude: ["password", "createdAt", "isAdmin"] },
        },
      );

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

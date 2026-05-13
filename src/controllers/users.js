const { User } = require("../models/users");

function internalError(error, res) {
  console.log(error);
  res.status(503).send("Internal Error - try again later");
}

module.exports = {
  // * GET
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      internalError(error, res);
    }
  },

  async getUser(req, res) {
    // req.params.id is the url's :id
    const username = req.params.username;
    try {
      const user = await User.findOne({ where: { username } });

      if (!user) return res.status(404).send("User not found");

      res.send(user);
    } catch (error) {
      internalError(error, res);
    }
  },

  // * POST
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

      // req.body is the JSON object of the user data that the client sends
      const user = await User.create(req.body);

      res.send({
        message: `User ${user.username} created successfully`,
        user: user,
      });
    } catch (error) {
      internalError(error, res);
    }
  },

  // * PUT
  async putUser(req, res) {
    const username = req.params.username;
    try {
      const user = await User.findOne({ where: { username } });

      if (!user) return res.status(404).send("User not found");

      await user.update({
        // if there's a new firstName from Postman, use it, otherwise use current firstName
        firstName: req.body.firstName ?? user.firstName,
        lastName: req.body.lastName ?? user.lastName,
        username: req.body.username ?? user.username,
        email: req.body.email ?? user.email,
        password: req.body.password ?? user.password,
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
  async deleteUser(req, res) {
    const username = req.params.username;
    try {
      const user = await User.findOne({ where: { username } });

      if (!user) return res.status(404).send("User not found");

      await user.destroy();
      res.send(`User ${user.username} deleted successfully`);
    } catch (error) {
      internalError(error, res);
    }
  },
};

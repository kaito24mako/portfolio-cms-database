const { User } = require("../models/users");

module.exports = {
  // * GET
  async getAllUsers(req, res) {
    const users = await User.findAll();
    return res.json(users);
  },

  // * POST
  async postUser(req, res) {
    // req.body is the JSON object of the user data that the client sends
    const user = await User.create(req.body);
    res.json(user);
  },

  // * DELETE
  async deleteUser(req, res) {
    const id = parseInt(req.params.id);
    const userIndex = await User.findByPk(id);

    if (userIndex) {
      await userIndex.destroy();
      return res.send("User successfuly deleted.");
    }

    if (!userIndex) {
      return res.status(404).send("User not found.");
    }
  },
};

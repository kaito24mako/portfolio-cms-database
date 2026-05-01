const { User } = require("../models/users");

module.exports = {
  async getAllUsers(req, res) {
    const users = await User.findAll();
    res.json(users);
    // console.log(res.json(users));
  },
};

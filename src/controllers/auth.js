const bcrypt = require("bcrypt");
const { User } = require("../models/users");

// if password matches the web token's password, create auth token for user to provide access
async function login(req, res) {
  try {
    const user = await User.findOne({
      where: {
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
        username: req.body?.username,
        email: req.body?.email,
        password: req.body?.password,
      },
    });

    if (!user) {
      console.log("Invalid email or username");
      return res.status(400).send("Invalid login details");
    }

    // compares the password in the request vs the user's password data
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!validPassword) {
      console.log("Invalid password");
      return res.status(400).send("Invalid login details");
    }

    const token = user.generateAuthToken();

    res.send(token);
  } catch (error) {
    console.log("Internal error");
    return res.status(503).send("Internal error");
  }
}

module.exports = login;

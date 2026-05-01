const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");

router.get("/", (req, res) => {
  res.send("This is the dashboard route of the Mako Portfolio CMS API.");
});

// Call controllers for users //
router.get("/", usersController.getAllUsers);

module.exports = router;

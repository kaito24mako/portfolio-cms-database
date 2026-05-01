const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");

// Call controllers for users //
router.get("/", usersController.getAllUsers);
router.post("/", usersController.postUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;

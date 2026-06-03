const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const usersController = require("../controllers/users");

// Call controllers for users
router.get("/", [auth, admin], usersController.getAllUsers);

router.get("/:id", [auth, admin], usersController.getUserById);

router.post("/", usersController.postUser);

router.put("/:id", auth, usersController.putUser);

router.delete("/:id", auth, usersController.deleteUser);

module.exports = router;

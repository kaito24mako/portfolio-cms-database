const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const usersController = require("../controllers/users");

// ! Authenticate methods

// Call controllers for users
router.get("/", usersController.getAllUsers);


router.get("/:id", usersController.getUserById);

router.post("/", usersController.postUser);

router.put("/:id", [auth, admin], usersController.putUser);

router.delete("/:id", [auth, admin], usersController.deleteUser);

module.exports = router;

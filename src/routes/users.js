const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");

// Call controllers for users
router.get("/", usersController.getAllUsers);
router.get("/:username", usersController.getUser);

router.post("/", usersController.postUser);

router.put("/:username", usersController.putUser);

router.delete("/:username", usersController.deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const projectsController = require("../controllers/projects");

// Call controllers for projects
router.get("/", projectsController.getAllProjects);

router.get("/:id", projectsController.getProjectById);

router.post("/new", projectsController.postProject);

// ! [auth] for editing and deleting projects?

router.put("/edit/:id", [auth], projectsController.putProject);

router.delete("/edit/:id", [auth], projectsController.deleteProject);

module.exports = router;

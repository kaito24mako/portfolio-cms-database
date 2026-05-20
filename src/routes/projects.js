const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const projectsController = require("../controllers/projects");

// Call controllers for projects
router.get("/", auth, projectsController.getAllProjects);

router.get("/:id", auth, projectsController.getProjectById);

router.post("/new", auth, projectsController.postProject);

router.put("/edit/:id", auth, projectsController.putProject);

router.delete("/edit/:id", auth, projectsController.deleteProject);

module.exports = router;

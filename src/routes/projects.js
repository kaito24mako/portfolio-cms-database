const express = require("express");
const router = express.Router();

const projectsController = require("../controllers/projects");

// Call controllers for projects
router.get("/", projectsController.getAllProjects);

router.get("/:id", projectsController.getProjectById);

// ! get project by title
router.get("/title", projectsController.getProjectByTitle);

router.post("/new", projectsController.postProject);

router.put("/edit/:id", projectsController.putProject);

router.delete("/edit/:id", projectsController.deleteProject);

module.exports = router;

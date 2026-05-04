const express = require("express");
const router = express.Router();

const projectsController = require("../controllers/projects");

// Call controllers for projects
router.get("/", projectsController.getAllProjects);
router.get("/:id", projectsController.getProject);

router.post("/new", projectsController.postProject);

router.put("/edit/:id", projectsController.putProject);

router.delete("/edit/:id", projectsController.deleteProject);

module.exports = router;

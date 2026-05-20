const { Project } = require("../models/projects");

// ! debug
const debugError = require("debug")("app:projectsLog:error");
const debugWrite = require("debug")("app:projectsLog:Write");
const debugRead = require("debug")("app:projectsLog:Read");

function internalError(error, res) {
  console.log(error);
  res.status(503).send("Internal Error - try again later");
}

module.exports = {
  // * GET
  // api/projects
  async getAllProjects(req, res) {
    try {
      const projects = await Project.findAll({
        attributes: { exclude: ["createdAt"] },
        order: [["updatedAt", "DESC"]],
      });

      if (!projects) {
        debugError("Projects not found");
        return res.status(404).send("Projects not found");
      }

      debugRead("Projects found");

      res.json(projects);
    } catch (error) {
      internalError(error, res);
    }
  },

  // api/projects/:id
  async getProjectById(req, res) {
    try {
      const project = await Project.findByPk(req.params.id, {
        attributes: { exclude: ["createdAt"] },
      });

      if (!project) return res.status(404).send("Project not found");

      res.json(project);
    } catch (error) {
      internalError(error, res);
    }
  },

  // * POST
  // api/projects/new
  async postProject(req, res) {
    try {
      const sameProject = await Project.findOne({
        where: { title: req.body.title },
      });

      if (sameProject) {
        debugError("This project already exists");
        return res.status(409).send("This project already exists");
      }

      const project = await Project.create(req.body, {
        attributes: { exclude: ["createdAt"] },
      });

      res.send({
        message: `Project ${project.title} created successfully`,
        project: project,
      });
    } catch (error) {
      internalError(error, res);
    }
  },

  // ! create an instance of Project for an existing User

  // * PUT
  // api/projects/edit/:id
  async putProject(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);

      if (!project) return res.status(404).send("Project not found");

      await project.update({
        title: req.body.title ?? project.title,
        description: req.body.description ?? project.description,
        siteUrl: req.body.siteUrl ?? project.siteUrl,
        githubUrl: req.body.githubUrl ?? project.githubUrl,
        status: req.body.status ?? project.status,
      });

      // ! where exclude DOESNT WORK for put
      // ! use lodash

      res.send({
        message: `Project ${project.title} updated successfully`,
        project: project,
      });
    } catch (error) {
      internalError(error, res);
    }
  },

  // * DELETE
  // api/projects/edit/:id
  async deleteProject(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);

      if (!project) return res.status(404).send("Project not found");

      await project.destroy();
      res.send(`Project ${project.title} deleted successfully`);
    } catch (error) {
      internalError(error, res);
    }
  },
};

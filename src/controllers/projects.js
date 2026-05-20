const { Project } = require("../models/projects");

const debugError = require("debug")("app:projectsLog:error");
const debugWrite = require("debug")("app:projectsLog:Write");
const debugRead = require("debug")("app:projectsLog:Read");

const ApiError = require("../utils/ApiError");

module.exports = {
  // * GET
  // api/projects
  async getAllProjects(req, res, next) {
    try {
      const projects = await Project.findAll({
        attributes: { exclude: ["createdAt"] },
        order: [["updatedAt", "DESC"]],
      });

      if (!projects || projects.length == 0) {
        debugError("Projects not found");
        return next(ApiError.notFound("No Projects found"));
      }

      debugRead("All Projects found");
      res.json(projects);
      debugWrite("Success getting all Projects");
    } catch (error) {
      return next(
        ApiError.internal(
          "Could not get all Projects...try again later",
          error,
        ),
      );
    }
  },

  // api/projects/:id
  async getProjectById(req, res, next) {
    try {
      const project = await Project.findByPk(req.params.id, {
        attributes: { exclude: ["createdAt"] },
      });

      if (!project) {
        debugError("Project not found by ID");
        return next(ApiError.notFound("Project not found"));
      }

      debugRead("Project found by ID");
      res.json(project);
      debugWrite("Success getting Project by ID");
    } catch (error) {
      return next(
        ApiError.internal("Could not get the Project...try again later", error),
      );
    }
  },

  // * POST
  // api/projects/new
  async postProject(req, res, next) {
    try {
      const sameProject = await Project.findOne({
        where: { title: req.body.title },
      });

      if (sameProject) {
        debugError("A Project with the same title already exists");
        return next(ApiError.conflict("This Project already exists"));
      }

      const project = await Project.create(req.body, {
        attributes: { exclude: ["createdAt"] },
      });

      res.send({
        message: `Project ${project.title} created successfully`,
        project: project,
      });
      debugWrite("Project successfully created");
    } catch (error) {
      return next(
        ApiError.internal(
          "Could not create the Project...try again later",
          error,
        ),
      );
    }
  },

  // ! create an instance of Project for an existing User

  // * PUT
  // api/projects/edit/:id
  async putProject(req, res, next) {
    try {
      const project = await Project.findByPk(req.params.id);

      if (!project) {
        debugError("Project was not found");
        return next(ApiError.notFound("Project was not found"));
      }

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
      debugWrite("Project succcessfully updated");
    } catch (error) {
      return next(
        ApiError.internal(
          "Could not update the Project...try again later",
          error,
        ),
      );
    }
  },

  // * DELETE
  // api/projects/edit/:id
  async deleteProject(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);

      if (!project) {
        debugError("Project was not found");
        return next(ApiError.notFound("Project was not found"));
      }

      await project.destroy();

      debugWrite("The Project was successfully deleted");
      res.send(`Project ${project.title} deleted successfully`);
    } catch (error) {
      return next(
        ApiError.internal(
          "Could not delete the Project...try again later",
          error,
        ),
      );
    }
  },
};

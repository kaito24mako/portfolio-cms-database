const { Project } = require("../models/projects");

const debugError = require("debug")("app:projectsLog:error");
const debugWrite = require("debug")("app:projectsLog:Write");
const debugRead = require("debug")("app:projectsLog:Read");

const ApiError = require("../utils/ApiError");

const _ = require("lodash");

module.exports = {
  // * GET
  // api/projects
  async getAllProjects(req, res, next) {
    try {
      const projects = await Project.findAll({
        where: { userId: req.user.id },
        attributes: { exclude: ["createdAt"] },
        order: [["updatedAt", "DESC"]],
      });

      if (!projects) {
        debugError("Projects not found");
        return next(ApiError.notFound("No projects found"));
      }

      debugRead("All Projects found");
      res.json(projects);
      debugWrite("Success getting all projects");
    } catch (error) {
      return next(
        ApiError.internal(
          "Could not get all projects...try again later",
          error,
        ),
      );
    }
  },

  // api/projects/:id
  async getProjectById(req, res, next) {
    try {
      const project = await Project.findOne({
        where: { id: req.params.id, userId: req.user.id },
        attributes: { exclude: ["createdAt"] },
      });

      if (!project) {
        debugError("Project not found by ID");
        return next(ApiError.notFound("Project not found by ID"));
      }

      debugRead("Project found by ID");
      res.json(project);
      debugWrite("Success getting project by ID");
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
        where: { title: req.body.title, userId: req.user.id },
      });

      if (sameProject) {
        debugError("A project with the same title already exists");
        return next(ApiError.conflict("This project already exists"));
      }

      const project = await Project.create({
        title: req.body.title,
        description: req.body.description,
        siteUrl: req.body.siteUrl,
        githubUrl: req.body.githubUrl,
        status: req.body.status,
        userId: req.user.id,
      });

      res.send({
        message: `Project ${project.title} created successfully`,
        project: project,
      });
      debugWrite("Project successfully created");
    } catch (error) {
      return next(
        ApiError.internal(
          "Could not create the project...try again later",
          error,
        ),
      );
    }
  },

  // * PUT
  // api/projects/edit/:id
  async putProject(req, res, next) {
    try {
      const project = await Project.findOne({
        where: { id: req.params.id, userId: req.user.id },
        attributes: { exclude: ["createdAt"] },
      });

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

      res.send({
        message: `Project ${project.title} updated successfully`,
        project: project,
      });
      debugWrite("Project succcessfully updated");
    } catch (error) {
      return next(
        ApiError.internal(
          "Could not update the project...try again later",
          error,
        ),
      );
    }
  },

  // * DELETE
  // api/projects/edit/:id
  async deleteProject(req, res, next) {
    try {
      const project = await Project.findOne({
        where: { id: req.params.id, userId: req.user.id },
        attributes: { exclude: ["createdAt"] },
      });

      if (!project) {
        debugError("Project was not found");
        return next(ApiError.notFound("Project was not found"));
      }

      await project.destroy();

      debugWrite("The project was successfully deleted");
      res.send(`Project ${project.title} deleted successfully`);
    } catch (error) {
      return next(
        ApiError.internal(
          "Could not delete the project...try again later",
          error,
        ),
      );
    }
  },
};

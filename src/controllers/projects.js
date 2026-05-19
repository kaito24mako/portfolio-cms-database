const { Project } = require("../models/projects");

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
        order: [["updatedAt", "DESC"]],
        attributes: { exclude: ["createdAt"] },
      });

      //! can incorporate js logic into controllers

      // const projects1 = await Project.findAll({
      //   // ! for excluding certain columns
      //   attributes: { exclude: ["id", "createdAt"] },
      //   attributes: ["title", "description"],
      //   // ! for finding projects with a certain value of a column
      //   where: { userId: 1, status: "Active" },
      // });

      if (!projects) return res.status(404).send("Projects not found");

      res.json(projects);
    } catch (error) {
      internalError(error, res);
    }
  },

  // api/projects/:id
  async getProjectById(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);

      if (!project) return res.status(404).send("Project not found");

      res.json(project);
    } catch (error) {
      internalError(error, res);
    }
  },

  // api/projects/:id
  // ! get project by title instead of id
  async getProjectByTitle(req, res) {
    try {
      const project = await Project.findOne({
        where: { title: req.body.title },
      });

      if (!project) return res.status(404).send("Project title does not exist");

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

      if (sameProject)
        return res.status(409).send("This project already exists");

      const project = await Project.create(req.body);

      res.send({
        message: `Project ${project.title} created successfully`,
        project: project,
      });
    } catch (error) {
      internalError(error, res);
    }
  },

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

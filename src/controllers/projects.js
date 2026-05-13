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
      });

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
      // ! to prevent two projects with the same title from being created
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
        title: req.body?.title,
        description: req.body?.description,
        siteUrl: req.body?.siteUrl,
        githubUrl: req.body?.githubUrl,
        published: req.body?.published,
        draft: req.body?.draft,
        archived: req.body?.archived,
      });

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

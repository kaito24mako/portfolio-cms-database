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

      const projects1 = await Project.findAll({
        // ! for excluding certain columns
        attributes: { exclude: ["id", "createdAt"] },
        attributes: ["title", "description"],
        // ! for finding projects with a certain value of a column
        where: { userId: 1, status: "Active" },
      });

      if (!projects) return res.status(404).send("Projects not found");

      res.json(projects);
    } catch (error) {
      internalError(error, res);
    }
  },

  // api/projects/[id]
  async getProject(req, res) {
    const id = req.params.id;
    try {
      const project = await Project.findByPk(id);

      if (!project) return res.status(404).send("Project not found");

      res.send(project);
    } catch (error) {
      internalError(error, res);
    }
  },

  // * POST
  // api/projects/new
  async postProject(req, res) {
    try {
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
  // api/projects/edit/[id]
  async putProject(req, res) {
    const id = req.params.id;
    try {
      const project = await Project.findByPk(id);

      if (!project) return res.status(404).send("Project not found");

      await project.update({
        title: req.body.title ?? project.title,
        description: req.body.description ?? project.description,
        siteUrl: req.body.siteUrl ?? project.siteUrl,
        githubUrl: req.body.githubUrl ?? project.githubUrl,
        published: req.body.published ?? project.published,
        draft: req.body.draft ?? project.draft,
        archived: req.body.archived ?? project.archived,
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
  // api/projects/edit/[id]
  async deleteProject(req, res) {
    const id = req.params.id;
    try {
      const project = await Project.findByPk(id);

      if (!project) return res.status(404).send("Project not found");

      await project.destroy();
      res.send(`Project ${project.title} deleted successfully`);
    } catch (error) {
      internalError(error, res);
    }
  },
};

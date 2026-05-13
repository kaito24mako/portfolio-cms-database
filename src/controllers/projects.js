const { Project } = require("../models/projects");

module.exports = {
  // * GET
  async getAllProjects(req, res) {
    const projects = await Project.findAll();
    return res.json(projects);
  },

  async getProject(req, res) {
    const id = req.params.id;
    try {
      const project = await Project.findByPk(id);

      if (!project) return res.status(404).send("Project not found");

      res.send(project);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Error - try again later");
    }
  },

  // * POST
  async postProject(req, res) {
    try {
      const project = await Project.create(req.body);

      res.send({
        message: `Project ${project.title} created successfully`,
        project: project,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Error - try again later");
    }
  },

  // * PUT
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
      console.log(error);
      res.status(500).send("Internal Error - try again later");
    }
  },

  // * DELETE
  async deleteProject(req, res) {
    const id = req.params.id;
    try {
      const project = await Project.findByPk(id);

      if (!project) return res.status(404).send("Project not found");

      await project.destroy();
      res.send(`Project ${project.title} deleted successfully`);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Error - try again later");
    }
  },
};

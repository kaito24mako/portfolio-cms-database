const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Project = sequelize.define("Projects", {
  // ? how to create foreign key of userId
  title: {
    type: DataTypes.CHAR,
  },
  description: {
    type: DataTypes.STRING,
  },
  siteUrl: {
    type: DataTypes.STRING,
  },
  githubUrl: {
    type: DataTypes.STRING,
  },
  // ? should these be in 'status' instead
  published: {
    type: DataTypes.BOOLEAN,
  },
  draft: {
    type: DataTypes.BOOLEAN,
  },
  archived: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = { Project };

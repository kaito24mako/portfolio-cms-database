const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Project = sequelize.define("Project", {
  // ? how to create foreign key of userId
  // attributes of the fields
  title: {
    type: DataTypes.STRING,
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

  // ? use DataTypes.ENUM - for putting statuses in an array
  published: {
    type: DataTypes.BOOLEAN,
  },
  draft: {
    type: DataTypes.BOOLEAN,
  },
  archived: {
    type: DataTypes.BOOLEAN,
  },
  updatedAt: {
    type: DataTypes.DATE,
    // OR DATEONLY
    get() {
      const rawValue = this.getDataValue("updatedAt");
      if (!rawValue) return null;
      const date = new Date(rawValue);

      return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
    },
  },
});

module.exports = { Project };

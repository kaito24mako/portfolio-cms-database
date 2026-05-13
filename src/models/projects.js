const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Project = sequelize.define("Project", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  siteUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
  githubUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
  status: {
    type: DataTypes.ENUM,
    values: ["Published", "Draft", "Archived"],
  },
  updatedAt: {
    type: DataTypes.DATE,
    get() {
      const rawValue = this.getDataValue("updatedAt");
      if (!rawValue) return null;
      const date = new Date(rawValue);

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
});

module.exports.Project = Project;

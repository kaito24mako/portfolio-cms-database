const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Project = sequelize.define("Project", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
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
    values: ["published", "draft", "archived"],
  },
  // published: {
  //   type: DataTypes.BOOLEAN,
  // },
  // draft: {
  //   type: DataTypes.BOOLEAN,
  // },
  // archived: {
  //   type: DataTypes.BOOLEAN,
  // },
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

module.exports.Project = Project;

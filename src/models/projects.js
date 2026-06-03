const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Project = sequelize.define("Project", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
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
    allowNull: false,
    values: ["Published", "Draft", "Archived"],
  },
  updatedAt: {
    type: DataTypes.DATE,
    get() {
      const date = this.getDataValue("updatedAt");
      if (!date) return null;

      const day = date.getDate();

      const month = date.toLocaleString("en-AU", {
        month: "long",
      });

      const time = date
        .toLocaleTimeString("en-AU", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .replace(" ", "")
        .toLowerCase();

      return `${month} ${day}, ${time}`;
    },
  },
});

module.exports.Project = Project;

const sequelize = require("../utils/connection");
const { User } = require("./users");
const { Project } = require("./projects");

// * 1 User | M Project
User.hasMany(Project, {
  // connects User's 'projectId' to Project's 'id'
  foreignKey: "userId",

  // if the project instance is deleted, user's 'projectId' is deleted also
  onDelete: "CASCADE",

  // if the 'projectId' changes, update user's 'projectId'
  onUpdate: "CASCADE",
});

Project.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = {
  sequelize,
  User,
  Project,
};

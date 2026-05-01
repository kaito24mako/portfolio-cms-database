const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const User = sequelize.define("Users", {
  firstName: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = { User };

const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Projects",
      key: "id",
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isAlphanumeric: true,
      max: 50,
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isAlphanumeric: true,
      max: 50,
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      len: [5, 100],
      isAscii: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 20],
        msg: "Password must be between 6 and 20 characters",
      },
      // at least 1 uppercase, 1 lowercase, 1 number, 1 symbol
      // is: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E])[\x20-\x7E]+$/,
    },
  },
});

module.exports.User = User;

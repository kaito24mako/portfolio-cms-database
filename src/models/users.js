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
    type: DataTypes.INTEGER,
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
      len: {
        args: [3, 30],
        msg: "Username must be between 3 and 30 characters",
      },
      isAscii: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      len: {
        args: [5, 255],
        msg: "Email must be between 5 and 255 characters",
      },
      isAscii: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 30],
        msg: "Password must be between 6 and 30 characters",
      },
      isAscii: true,
      is: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E])[\x20-\x7E]+$/,
    },
  },
  // ! isAdmin is someone who can get access to the database
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    validate: {
      isIn: [[0, 1, true, false, "true", "false"]],
    },
  },
});

module.exports.User = User;

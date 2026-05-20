const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
const jwt = require("jsonwebtoken");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true,
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
      // is: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E])[\x20-\x7E]+$/,
    },
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    validate: {
      isIn: [[0, 1, true, false, "true", "false"]],
    },
  },
});

// creates a web token and attaches user details to it
User.prototype.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password,
      isAdmin: this.isAdmin,
    },
    process.env.API_PRIVATE_KEY,
  );
};

module.exports.User = User;

//! Creates a file of the database
const { sequelize } = require("../models/index");

async function authSyncDb() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established");

    await sequelize.sync({ alter: true });
    console.log("Database and tables created");
  } catch (err) {
    console.error("Unable to connect to the database", err);
  }
}

module.exports = authSyncDb;

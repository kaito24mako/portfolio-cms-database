// Imports
require("dotenv").config();
const express = require("express");

// Module imports
const sequelize = require("./utils/connection");
const users = require("./routes/users");
const projects = require("./routes/projects");
const auth = require("./middleware/auth");
const logger = require("./middleware/logger");

// Create Express app isntance
const app = express();

// Middleware
app.use(auth);
app.use(logger);
app.use(express.json());

// Routes
app.use("/users", users);
app.use("/projects", projects);

// Creates a file of the database
async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established");

    await sequelize.sync();
    console.log("Database and tables created");
  } catch (err) {
    console.error("Unable to connect to the database", err);
  }
}
connect();

// Port
app.listen(process.env.PORT, () => {
  console.log(
    `CMS API server is now running on http://localhost:${process.env.PORT}`,
  );
});

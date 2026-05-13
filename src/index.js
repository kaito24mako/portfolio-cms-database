// Imports
require("dotenv").config();
const express = require("express");

// Module imports
//! delete
// const sequelize = require("./utils/connection");
const authSyncDb = require("./utils/authSyncDb");

const users = require("./routes/users");
const projects = require("./routes/projects");
const auth = require("./middleware/auth");
const logger = require("./middleware/logger");

// Create Express app instance
const app = express();

//! load .env
process.loadEnvFile();

// Middleware
app.use(auth);
app.use(logger);
app.use(express.json());

//! Middleware:
// parse incoming form data to make it available in req.body
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", users);
app.use("/projects", projects);

//! call authSyncDb
authSyncDb();

//! port
const port = process.env.PORT || 4002;

app.listen(port, () => {
  console.log(`CMS API server is now running on http://localhost:${port}`);
});

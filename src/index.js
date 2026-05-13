// Imports
require("dotenv").config();
const express = require("express");

// Module imports
const authSyncDb = require("./utils/authSyncDb");

const users = require("./routes/users");
const projects = require("./routes/projects");
const auth = require("./routes/auth");
const logger = require("./middleware/logger");

// Create Express app instance
const app = express();

// load .env
process.loadEnvFile();

// Sync to database
authSyncDb();

// Middleware
// app.use(auth);
// app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", users);
app.use("/projects", projects);
app.use("/login", auth);

// Port
const port = process.env.PORT || 4002;

app.listen(port, () => {
  console.log(`CMS API server is now running on http://localhost:${port}`);
});

// Modules
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const corsOptions = require("./middleware/corsOptions");

// api handler
const ApiError = require("./utils/ApiError");
const apiErrorHandler = require("./middleware/errorHandler");

// debug module
const debugStartup = require("debug")("app:");

// Module imports
const authSyncDb = require("./utils/authSyncDb");

const users = require("./routes/users");
const projects = require("./routes/projects");
const auth = require("./routes/auth");
const logger = require("./middleware/logger");

// Create Express app instance
const app = express();

// Helmet - to protect routes from Headers
app.use(helmet());

// Cors
app.use(cors(corsOptions));
// app.options("/(*path)", cors(corsOptions));

// load .env
process.loadEnvFile();

// Sync to database
authSyncDb();

// Middleware
// app.use(auth);
// app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

debugStartup("All middleware enabled");

// Routes
app.use("/users", users);
app.use("/projects", projects);
app.use("/login", auth);

// error for if a route isnt found
app.use((req, res, next) => {
  next(ApiError.notFound("Route not found"));
});
app.use(apiErrorHandler);

// Port
const port = process.env.PORT || 4002;

app.listen(port, () => {
  debugStartup(`CMS API server is now running on http://localhost:${port}`);
});

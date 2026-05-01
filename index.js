// Imports //
require("dotenv").config();
const express = require("express");

// Module imports //
const sequelize = require("./utils/connection");
const dashboard = require("./routes/dashboard");

// Create Express app isntance //
const app = express();

// Middleware //
app.use(express.json());

// Routes //
app.use("/dashboard", dashboard);

// Creates a file of the database //
sequelize.sync().then(() => {
  console.log("Database and tables created");
});

// Port //
app.listen(process.env.PORT, () => {
  console.log(
    `CMS API server is now running on http://localhost:${process.env.PORT}`,
  );
});

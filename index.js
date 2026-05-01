// Imports //
require("dotenv").config();
const express = require("express");

// Module imports //
const sequelize = require("./utils/connection");
const users = require("./routes/users");

// Create Express app isntance //
const app = express();

// Middleware //
app.use(express.json());

// Routes //
app.use("/users", users);

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

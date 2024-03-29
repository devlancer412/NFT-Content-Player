require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 7777;
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

global.__basedir = __dirname;

// Database connection
require("./config/database");

// Set remove temporary file schedule
require("./utils/temp-cleaner");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/api", routes);

// Server running status
app.listen(port, () => {
  console.log(`The app listening at http://localhost:${port}`);
});

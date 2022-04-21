const express = require("express");
const Router = express.Router();
const middleware = require("../middleware");

const contentRouter = require("./content");

Router.use("/content", contentRouter);

module.exports = Router;

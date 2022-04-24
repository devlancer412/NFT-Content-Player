const express = require("express");
const Router = express.Router();

const contentRouter = require("./content");
const uploadRouter = require("./upload");

Router.use("/content", contentRouter);
Router.use("/upload", uploadRouter);

module.exports = Router;

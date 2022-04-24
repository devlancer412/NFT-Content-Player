const express = require("express");
const Router = express.Router();
const middleware = require("../middleware");
const controller = require("../controller/uplaod");

Router.post(
  "/",
  middleware.uploadMidlleware.single("file"),
  controller.uploadFiles
);

module.exports = Router;

const express = require("express");
const Router = express.Router();
const { contentController } = require("../controller");

Router.get("/", contentController.index);
Router.get("/:id", contentController.searchById);
Router.post("/", contentController.insert);

module.exports = Router;

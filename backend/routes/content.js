const express = require("express");
const Router = express.Router();
const { contentController } = require("../controller");

Router.get("/upload/new", contentController.newContentId);
Router.post("/upload/:contentId/blob", contentController.newBlobUpload);
Router.delete("/upload/:contentId/blob/:name", contentController.newBlobDelete);
Router.patch("/upload/:contentId/blob/:name", contentController.newBlobUpdate);
Router.post("/upload/:contentId/finish", contentController.newContent);
Router.delete("/upload/:contentId", contentController.deleteContent);

Router.get("/:address", contentController.getContents);
Router.get("/:address/:contentId", contentController.getContentData);
module.exports = Router;

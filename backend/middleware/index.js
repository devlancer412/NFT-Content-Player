const contentServerMiddleware = require("./server");
const contentMiddleware = require("./content");
const uploadMidlleware = require("./upload");

module.exports = {
  contentServerMiddleware,
  contentMiddleware,
  uploadMidlleware,
};

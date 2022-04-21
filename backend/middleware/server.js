const { isContentServer } = require("../utils/api.contract");

const contentServerMiddleware = async (req, res, next) => {
  const { address } = req.body;
  console.log("Passed content middleware");

  if (!address || !contentId) {
    res.status(301).json("Authentication parameters missed");
  }

  if (await isContentServer(address)) {
    next();
  }

  res.status(301).json("You are not permitted this action");
};

module.exports = contentServerMiddleware;

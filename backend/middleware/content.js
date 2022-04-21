const { isContentDistributor } = require("../utils/api.contract");

const contentMiddleware = async (req, res, next) => {
  const { address, contentId } = req.body;
  console.log("Passed content middleware");

  if (!address || !contentId) {
    res.status(301).json("Authentication parameters missed");
  }

  if (await isContentDistributor(address, contentId)) {
    next();
  }

  res.status(301).json("You are not permitted this action");
};

module.exports = contentMiddleware;

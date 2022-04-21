const Content = require("../model").Content;
const ObjectID = require("mongoose").Types.ObjectId;

exports.index = async (req, res) => {
  try {
    const contents = await Content.find();
    res.json(contents);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.searchById = async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(400).json("No record with given id: " + id);
  }

  try {
    const content = await Content.findById(id);
    res.json(content);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.insert = async (req, res) => {
  const contentInfo = req.body;

  if (
    !contentInfo.contentId ||
    !contentInfo.name ||
    !contentInfo.owner ||
    !contentInfo.type
  ) {
    return res.status(301).json("Sorry, you provided wrong info");
  }

  const content = await Content.findOne({ contentId: contentInfo.contentId });

  if (content) {
    return res.status(301).json("ContentId already exist");
  }

  try {
    const content = new Content({
      contentId: contentInfo.contentId,
      name: contentInfo.name,
      owner: contentInfo.owner,
      type: contentInfo.type,
    });

    await content.save();
    return res.status(200).json(content);
  } catch (err) {
    res.status(500).json(err);
  }
};

const Content = require("../model").Content;
const ObjectID = require("mongoose").Types.ObjectId;
const contractApi = require("../utils/api.contract");

exports.newContentId = async (req, res) => {
  const result = await contractApi.getNewContentId();

  if (!result.success) {
    return res.status(500).json(result.data);
  }

  res.json(result.data);
};

exports.newBlobUpload = async (req, res) => {
  const contentId = req.params.contentId;
  const { name, link, protected, type } = req.body;

  if (
    !name ||
    !link ||
    (protected != "true" && protected != "false") ||
    !type
  ) {
    return res.status(400).json("Invalid argumets");
  }

  try {
    let contentRecord = await Content.findOne({ contentId: contentId });

    if (!contentRecord) {
      contentRecord = new Content({
        contentId,
        content: [],
      });
    }

    if (contentRecord.name || contentRecord.address) {
      return res.status(400).json("Finished blob upload");
    }

    if (contentRecord.content.filter((item) => item.name === name).length) {
      return res.status(400).json("Same name blob already exist");
    }

    contentRecord.content.push({
      name,
      link,
      protected,
      type,
    });

    await contentRecord.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.newBlobDelete = async (req, res) => {
  const { contentId, name } = req.params;

  try {
    let contentRecord = await Content.findOne({ contentId: contentId });

    if (!contentRecord) {
      return res.status(404).json("Can't find such Content");
    }

    const newContent = contentRecord.content.filter((item) => {
      return item.name != name;
    });

    contentRecord.content = newContent;

    await contentRecord.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.newBlobUpdate = async (req, res) => {
  const { contentId, name } = req.params;
  const { link, protected, type } = req.body;

  try {
    let contentRecord = await Content.findOne({ contentId: contentId });

    if (!contentRecord) {
      return res.status(404).json("Can't find such Content");
    }

    const newContent = contentRecord.content.map((item) => {
      return item.name === name ? { name, link, protected, type } : item;
    });

    contentRecord.content = newContent;

    await contentRecord.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.newContent = async (req, res) => {
  const { contentId } = req.params;
  const { name, address } = req.body;

  if (!name || !address) {
    await Content.findOneAndDelete({ contentId: contentId });
    return res.status(400).json("Params aren't set");
  }

  try {
    let contentRecord = await Content.findOne({ contentId: contentId });

    if (!contentRecord) {
      return res.status(404).json("Can't find such Content");
    }

    const signature = await contractApi.getNewContractSinature(
      address,
      contentId
    );

    contentRecord.address = address.toLowerCase();
    contentRecord.name = name;

    await contentRecord.save();
    res.json({
      contentId,
      address,
      signature,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.index = async (req, res) => {
  try {
    const contents = await Content.find();
    res.json(
      contents.map((item) => {
        return {
          name: item.name,
          content: item.content.filter((contentItem) => !contentItem.protected),
        };
      })
    );
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getContents = async (req, res) => {
  const { address } = req.params;

  try {
    const contents = await Content.find({ address: address.toLowerCase() });
    res.json(contents);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteContent = async (req, res) => {
  const { contentId } = req.params;
  const { address } = req.body;

  try {
    if (!contractApi.isContentDistributor(address, contentId)) {
      return res.status(401).json("You can't delete Contract");
    }

    await Content.findOneAndDelete({ contentId: contentId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};

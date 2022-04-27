const uploadFiles = async (req, res) => {
  const { file } = req;
  try {
    if (file == undefined) {
      return res.status(401).json(`You must select a file.`);
    }

    res.json("/resource/tmp/" + file.filename);
  } catch (error) {
    console.log("upload file error");
    return res.json(500).json(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles,
};

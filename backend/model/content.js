const mongoose = require("mongoose");

const { Schema } = mongoose;

const ContentSchema = new Schema({
  contentId: { type: Number, unique: true, required: true },
  name: { type: String },
  owner: { type: String },
  type: { type: Number },
});

module.exports = Content = mongoose.model("Content", ContentSchema);

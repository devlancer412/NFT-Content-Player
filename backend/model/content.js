const mongoose = require("mongoose");

const { Schema } = mongoose;

const ContentSchema = new Schema({
  contentId: { type: String, required: true },
  name: { type: String },
  address: { type: String },
  content: [
    {
      name: { type: String, required: true, unique: true },
      link: { type: String },
      protected: { type: Boolean },
    },
  ],
});

module.exports = Content = mongoose.model("Content", ContentSchema);

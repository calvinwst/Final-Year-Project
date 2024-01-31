const mongoose = require("mongoose");

const userFeedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
  },
  content: { type: String, required: true },
  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comment: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  postType: { type: String, enum: ["community", "personal"], required: true },
  multimediaContent: { type: String },
  createdAt: { type: Date, default: Date.now },
  isEdited: { type: Boolean, default: false }, // New field
});

const userFeed = mongoose.model("userFeed", userFeedSchema);

module.exports = userFeed;

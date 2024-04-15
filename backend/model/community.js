const mongoose = require("mongoose");
const UserFeed = require("./userFeed");

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  member: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  communityFeed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userFeed",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Community = mongoose.model("Community", CommunitySchema);

module.exports = Community;

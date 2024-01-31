const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  researcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  publicationDate: { type: Date, default: Date.now },
  tags: [{ type: String, required: true }],
  filePath: { type: String },
  imagePath: { type: String },

});

const research = mongoose.model("research", researchSchema);

module.exports = research;

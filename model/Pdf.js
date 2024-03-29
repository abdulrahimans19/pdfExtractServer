const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const pdfSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  extractedPages: {
    type: [Number],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
``;
const pdfFile = mongoose.model("pdf", pdfSchema);

module.exports = pdfFile;

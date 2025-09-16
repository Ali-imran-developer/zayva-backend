const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
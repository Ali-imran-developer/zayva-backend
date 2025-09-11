const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, minlength: 5, maxlength: 100 },
    message: { type: String, required: true, minlength: 10, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);
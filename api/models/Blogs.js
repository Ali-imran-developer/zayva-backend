const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  detail: [
    {
      subheading: { type: String },
      subParagraph: { type: String },
      points: [{ type: String }],
    },
  ],
  tags: [{ type: String }],

}, { timestamps: true });

const Blogs = mongoose.models.Blogs || mongoose.model("Blogs", BlogSchema);
module.exports = Blogs;
const mongoose = require("mongoose");

const UserReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    review: { type: Number, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserReview", UserReviewSchema);
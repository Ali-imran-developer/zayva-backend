const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: String },
    userName: { type: String, required: true },
    reviewMessage: { type: String, required: true },
    reviewValue: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductReview", ProductReviewSchema);
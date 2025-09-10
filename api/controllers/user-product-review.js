const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const ProductReview = require("../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;
    if (!reviewMessage || !reviewValue) {
      return res.status(400).json({
        success: false,
        message: "Review message and rating are required.",
      });
    }
    if (!Order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }
    const checkExistinfReview = await ProductReview.findOne({
      productId,
      userId,
    });
    if (checkExistinfReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }
    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });
    await newReview.save();
    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength;
    await Product.findByIdAndUpdate(productId, { averageReview });
    const updatedReviews = await ProductReview.find({ productId });
    res.status(201).json({
      success: true,
      data: newReview,
      message: "Review addedd successfully",
      updatedReviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getAllProductsReview = async (req, res) => {
  try {
    const reviews = await ProductReview.find().populate("productId", "title price").sort({ createdAt: -1 });
    if (!reviews || reviews.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews, getAllProductsReview };
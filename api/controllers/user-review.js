const UserReview = require("../models/UserReview");

const addReview = async (req, res) => {
  try {
    const { name, review, message } = req.body;
    if (!name || !review || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
    const newReview = new UserReview({ name, review, message });
    await newReview.save();
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await UserReview.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

module.exports = { addReview, getReviews };
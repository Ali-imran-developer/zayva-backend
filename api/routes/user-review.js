const express = require("express");
const { addReview, getReviews } = require("../controllers/user-review");
const router = express.Router();

router.post("/create", addReview);
router.get("/get", getReviews);

module.exports = router;
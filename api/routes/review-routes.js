const express = require("express");
const { addProductReview, getProductReviews, getAllProductsReview } = require("../controllers/user-product-review");
const router = express.Router();

router.post("/add", addProductReview);
router.get("/get", getAllProductsReview);
router.get("/:productId", getProductReviews);

module.exports = router;
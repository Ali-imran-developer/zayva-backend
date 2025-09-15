const express = require("express");
const { getProductsByType } = require("../controllers/user-products");
const router = express.Router();

router.get("/get/:productType", getProductsByType);

module.exports = router;
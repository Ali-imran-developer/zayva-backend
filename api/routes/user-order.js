const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getOrderDetails, capturePayment} = require("../controllers/user-order");

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:id", getOrders);
router.get("/details/:id", getOrderDetails);

module.exports = router;
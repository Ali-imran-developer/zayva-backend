const express = require("express");
const router = express.Router();
const { createOrder, getAllOrdersByUser, getOrderDetails, capturePayment} = require("../controllers/user-order");

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
const express = require("express");
const { getAllCustomers } = require("../controllers/admin-customer");
const router = express.Router();

router.get("/get", getAllCustomers);

module.exports = router;
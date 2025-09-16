const express = require("express");
const { createBrands, getBrands } = require("../controllers/brands-controller");
const router = express.Router();

router.post("/create", createBrands);
router.get("/get", getBrands);

module.exports = router;
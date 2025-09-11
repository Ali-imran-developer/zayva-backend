const express = require("express");
const { sendContact, getContacts } = require("../controllers/contact-controller");
const router = express.Router();

router.post("/add", sendContact);
router.get("/get", getContacts);

module.exports = router;